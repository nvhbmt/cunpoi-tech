/**
 * Khung cảnh hero: lưới toạ độ trải về chân trời + cụm đa diện wireframe xoay chậm,
 * đỉnh gần con trỏ thì sáng lên.
 *
 * Nguyên tắc: không chạy khi người dùng không nhìn thấy, không chạy khi tab bị ẩn,
 * và nếu người dùng bật "giảm chuyển động" thì chỉ vẽ đúng một khung hình tĩnh.
 */
import * as THREE from 'three';

const BG = 0x05070c;
const C_EDGE = 0x5f86c4;
const C_EDGE_SOFT = 0x3d5a8a;
const C_POINT = 0x8fb6ff;
const C_POINT_HOT = 0xc9e4ff;
const C_GRID = 0x2a4675;

interface Shell {
    lines: THREE.LineSegments;
    spin: THREE.Vector3;
}

const vertexShader = /* glsl */ `
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uTime;
  attribute float aGlow;
  attribute float aSeed;
  varying float vGlow;
  varying float vFade;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float dist = max(-mv.z, 0.001);
    vGlow = aGlow;
    vFade = 1.0 - smoothstep(7.0, 19.0, dist);
    float pulse = 0.86 + 0.14 * sin(uTime * 1.5 + aSeed * 6.2831);
    gl_PointSize = uSize * uPixelRatio * pulse * (1.0 + aGlow * 2.4) * (8.0 / dist);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHot;
  uniform float uOpacity;
  varying float vGlow;
  varying float vFade;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.05, d);
    float halo = smoothstep(0.5, 0.0, d);
    vec3 col = mix(uColor, uHot, vGlow);
    float a = (core * 0.9 + halo * 0.3) * vFade * uOpacity * (0.42 + vGlow * 0.58);
    gl_FragColor = vec4(col, a);
  }
`;

/** Gom các đỉnh trùng nhau của geometry không chỉ mục về một danh sách duy nhất. */
function uniqueVertices(geometry: THREE.BufferGeometry): Float32Array {
    const pos = geometry.getAttribute('position');
    const seen = new Set<string>();
    const out: number[] = [];
    for (let i = 0; i < pos.count; i += 1) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        const key = `${x.toFixed(4)}|${y.toFixed(4)}|${z.toFixed(4)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(x, y, z);
    }
    return new Float32Array(out);
}

function makePoints(
    positions: Float32Array,
    size: number,
    pixelRatio: number,
    opacity: number,
): THREE.Points {
    const count = positions.length / 3;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aGlow', new THREE.BufferAttribute(new Float32Array(count), 1));

    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i += 1) seeds[i] = Math.random();
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uSize: { value: size },
            uPixelRatio: { value: pixelRatio },
            uTime: { value: 0 },
            uColor: { value: new THREE.Color(C_POINT) },
            uHot: { value: new THREE.Color(C_POINT_HOT) },
            uOpacity: { value: opacity },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geo, material);
}

/** Lưới toạ độ phẳng, sáng ở tâm và mờ dần ra rìa nhờ màu đỉnh + sương mù. */
function makeGrid(size: number, divisions: number, y: number): THREE.LineSegments {
    const half = size / 2;
    const step = size / divisions;
    const verts: number[] = [];
    const colors: number[] = [];
    const base = new THREE.Color(C_GRID);

    const push = (x: number, z: number) => {
        verts.push(x, y, z);
        const falloff = 1 - Math.min(1, Math.hypot(x, z) / half);
        const k = falloff * falloff * 1.35;
        colors.push(base.r * k, base.g * k, base.b * k);
    };

    for (let i = 0; i <= divisions; i += 1) {
        const p = -half + i * step;
        push(-half, p);
        push(half, p);
        push(p, -half);
        push(p, half);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    return new THREE.LineSegments(
        geo,
        new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85 }),
    );
}

function makeShell(
    geometry: THREE.BufferGeometry,
    color: number,
    opacity: number,
    spin: THREE.Vector3,
): Shell {
    const lines = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry, 1),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
    );
    return { lines, spin };
}

export function initHero(canvas: HTMLCanvasElement): () => void {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compact = window.matchMedia('(max-width: 720px)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
        renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: !compact,
            powerPreference: 'high-performance',
        });
    } catch {
        // Không có WebGL: nền CSS phía dưới đã đủ đẹp, bỏ qua trong im lặng.
        canvas.style.display = 'none';
        return () => {};
    }

    const pixelRatio = Math.min(window.devicePixelRatio || 1, compact ? 1.6 : 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearAlpha(0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(BG, compact ? 0.085 : 0.068);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.6, 7.4);

    /* --- lưới toạ độ --- */
    const grid = makeGrid(46, compact ? 32 : 46, -2.25);
    scene.add(grid);

    /* --- cụm đa diện --- */
    const lattice = new THREE.Group();
    lattice.position.y = 0.15;
    scene.add(lattice);

    const coreGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const shells: Shell[] = [
        makeShell(coreGeo, C_EDGE, 0.62, new THREE.Vector3(0.026, 0.045, 0.011)),
        makeShell(new THREE.OctahedronGeometry(0.8), C_POINT, 0.5, new THREE.Vector3(-0.05, -0.07, 0.03)),
        makeShell(new THREE.IcosahedronGeometry(2.55, 0), C_EDGE_SOFT, 0.34, new THREE.Vector3(-0.018, 0.021, -0.013)),
    ];
    shells.forEach((s) => lattice.add(s.lines));

    const corePoints = makePoints(uniqueVertices(coreGeo), 9.5, pixelRatio, 1);
    const outerPoints = makePoints(uniqueVertices(new THREE.IcosahedronGeometry(2.55, 0)), 7, pixelRatio, 0.75);
    lattice.add(corePoints, outerPoints);

    /* --- bụi nền --- */
    const dustCount = compact ? 140 : 260;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i += 1) {
        dustPos[i * 3] = (Math.random() - 0.5) * 24;
        dustPos[i * 3 + 1] = (Math.random() - 0.35) * 11;
        dustPos[i * 3 + 2] = (Math.random() - 0.5) * 18 - 2;
    }
    const dust = makePoints(dustPos, 4.5, pixelRatio, 0.5);
    scene.add(dust);

    /* --- con trỏ, cuộn trang --- */
    const pointer = new THREE.Vector2(0, 0);
    const pointerTarget = new THREE.Vector2(0, 0);
    let pointerActive = false;
    let scrollProgress = 0;

    const onPointerMove = (event: PointerEvent) => {
        pointerTarget.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
        );
        pointerActive = true;
    };
    const onPointerLeave = () => {
        pointerActive = false;
        pointerTarget.set(0, 0);
    };
    const onScroll = () => {
        scrollProgress = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* --- đổi kích thước --- */
    const resize = () => {
        const { clientWidth: w, clientHeight: h } = canvas;
        if (w === 0 || h === 0) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    /* --- làm sáng đỉnh gần con trỏ --- */
    const projected = new THREE.Vector3();

    const updateGlow = (points: THREE.Points, radius: number, delta: number) => {
        const position = points.geometry.getAttribute('position');
        const glow = points.geometry.getAttribute('aGlow') as THREE.BufferAttribute;
        const aspect = camera.aspect;
        let dirty = false;

        for (let i = 0; i < position.count; i += 1) {
            projected
                .set(position.getX(i), position.getY(i), position.getZ(i))
                .applyMatrix4(points.matrixWorld)
                .project(camera);

            const dx = (projected.x - pointer.x) * aspect;
            const dy = projected.y - pointer.y;
            const dist = Math.hypot(dx, dy);
            const target = pointerActive ? 1 - Math.min(1, dist / radius) : 0;

            const current = glow.getX(i);
            const next = current + (target * target - current) * Math.min(1, delta * 6);
            if (Math.abs(next - current) > 0.0015) {
                glow.setX(i, next);
                dirty = true;
            }
        }

        if (dirty) glow.needsUpdate = true;
    };

    /* --- vòng vẽ --- */
    let last = performance.now();
    let elapsed = 0;
    let frame = 0;
    let visible = true;
    let running = false;

    const render = (delta: number, elapsed: number) => {
        shells.forEach(({ lines, spin }) => {
            lines.rotation.x += spin.x * delta;
            lines.rotation.y += spin.y * delta;
            lines.rotation.z += spin.z * delta;
        });
        corePoints.rotation.copy(shells[0]!.lines.rotation);
        outerPoints.rotation.copy(shells[2]!.lines.rotation);

        pointer.lerp(pointerTarget, Math.min(1, delta * 3.2));

        // Camera nhích theo con trỏ và theo độ cuộn — thị sai nhẹ, không chóng mặt.
        const targetX = pointer.x * 0.85;
        const targetY = 0.6 + pointer.y * 0.42 + scrollProgress * 1.35;
        camera.position.x += (targetX - camera.position.x) * Math.min(1, delta * 2.4);
        camera.position.y += (targetY - camera.position.y) * Math.min(1, delta * 2.4);
        camera.lookAt(0, 0.1 - scrollProgress * 0.5, 0);

        lattice.rotation.z = pointer.x * 0.06;
        lattice.position.y = 0.15 + scrollProgress * 0.9;
        grid.position.z = ((elapsed * 0.28) % 1) - 0.5;

        dust.rotation.y = elapsed * 0.012;

        (corePoints.material as THREE.ShaderMaterial).uniforms.uTime!.value = elapsed;
        (outerPoints.material as THREE.ShaderMaterial).uniforms.uTime!.value = elapsed;
        (dust.material as THREE.ShaderMaterial).uniforms.uTime!.value = elapsed;

        lattice.updateMatrixWorld();
        updateGlow(corePoints, 0.42, delta);
        updateGlow(outerPoints, 0.5, delta);

        renderer.render(scene, camera);
    };

    const loop = (now: number) => {
        if (!running) return;
        frame = requestAnimationFrame(loop);
        // Chặn trên 50ms: quay lại tab sau một lúc thì cảnh không nhảy vọt.
        const delta = Math.min((now - last) / 1000, 0.05);
        last = now;
        elapsed += delta;
        render(delta, elapsed);
    };

    const start = () => {
        if (running || reduced) return;
        running = true;
        last = performance.now();
        frame = requestAnimationFrame(loop);
    };

    const stop = () => {
        running = false;
        cancelAnimationFrame(frame);
    };

    if (reduced) {
        // Một khung hình duy nhất: vẫn thấy hình khối và lưới, nhưng đứng yên.
        lattice.updateMatrixWorld();
        renderer.render(scene, camera);
    } else {
        const inView = new IntersectionObserver(
            (entries) => {
                visible = entries.some((entry) => entry.isIntersecting);
                if (visible && !document.hidden) start();
                else stop();
            },
            { threshold: 0 },
        );
        inView.observe(canvas);

        const onVisibility = () => {
            if (document.hidden) stop();
            else if (visible) start();
        };
        document.addEventListener('visibilitychange', onVisibility);

        canvas.dataset.ready = 'true';

        return () => {
            stop();
            inView.disconnect();
            observer.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerleave', onPointerLeave);
            window.removeEventListener('scroll', onScroll);
            renderer.dispose();
        };
    }

    canvas.dataset.ready = 'true';

    return () => {
        observer.disconnect();
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('scroll', onScroll);
        renderer.dispose();
    };
}
