// Dimensionless discussion geometry. None of these values are installed dimensions or travel limits.
export type Vec3 = [number, number, number];
export type ModelParameters = { x: number; z: number; arm: number; ring: number; chair: number; leg: number; bed: number; yaw: number };
export type ModelBox = { id: string; name: string; center: Vec3; half: Vec3; axes: [Vec3, Vec3, Vec3] };
export type ModelRing = { center: Vec3; angle: number; outer: number; inner: number; halfDepth: number };
export type ModelContact = { ids: [string, string]; names: [string, string]; point: Vec3 };
export type ModelScene = { ring: ModelRing; boxes: ModelBox[]; contacts: ModelContact[]; armEnd: Vec3; legPivot: Vec3; base: number; chairHeight: number; bedHeight: number };

export const DEFAULT_PARAMETERS: ModelParameters = { x: 36, z: 50, arm: 0, ring: 0, chair: 30, leg: 60, bed: 40, yaw: 22 };
// Confirmed physical information is kept separate from the dimensionless illustration.
export const CONFIRMED_DIMENSIONS = { ringInnerDiameterCm: 100 } as const;
// Fixed installation orientation; the chair has no yaw adjustment during use.
export const CHAIR_FORWARD_X = -1;
const EPS = 1e-7;
export const radians = (degrees: number) => degrees * Math.PI / 180;
export const plus = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const minus = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const times = (a: Vec3, n: number): Vec3 => [a[0] * n, a[1] * n, a[2] * n];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const lerp = (a: Vec3, b: Vec3, t: number) => plus(a, times(minus(b, a), t));

export function makeBox(id: string, name: string, center: Vec3, half: Vec3, yaw = 0): ModelBox {
    const c = Math.cos(radians(yaw)), s = Math.sin(radians(yaw));
    return { id, name, center, half, axes: [[c, s, 0], [-s, c, 0], [0, 0, 1]] };
}

export function boxVertices(box: ModelBox): Vec3[] {
    return Array.from({ length: 8 }, (_, i) => box.axes.reduce((p, axis, j) => plus(p, times(axis, box.half[j] * (i & (1 << j) ? 1 : -1))), box.center));
}

export function ringToWorld(ring: ModelRing, point: Vec3): Vec3 {
    const c = Math.cos(radians(ring.angle)), s = Math.sin(radians(ring.angle));
    return plus(ring.center, [point[0] * c - point[2] * s, point[1], point[0] * s + point[2] * c]);
}

export function ringLocal(ring: ModelRing, point: Vec3): Vec3 {
    const p = minus(point, ring.center), c = Math.cos(radians(ring.angle)), s = Math.sin(radians(ring.angle));
    return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
}

const turn = (a: Vec3, b: Vec3, c: Vec3) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);

function projectedHull(points: Vec3[]): Vec3[] {
    const sorted = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const unique = sorted.filter((p, i) => i === 0 || Math.abs(p[0] - sorted[i - 1][0]) > EPS || Math.abs(p[1] - sorted[i - 1][1]) > EPS);
    if (unique.length <= 2) return unique;
    const half = (items: Vec3[]) => {
        const result: Vec3[] = [];
        for (const p of items) {
            while (result.length >= 2 && turn(result[result.length - 2], result[result.length - 1], p) <= EPS) result.pop();
            result.push(p);
        }
        return result;
    };
    return [...half(unique).slice(0, -1), ...half(unique.slice().reverse()).slice(0, -1)];
}

function nearestToAxis(hull: Vec3[]): Vec3 {
    if (hull.length === 1) return hull[0];
    // If the projected origin lies inside, a barycentric combination also gives a feasible axial coordinate.
    if (hull.length > 2 && hull.every((p, i) => turn(p, hull[(i + 1) % hull.length], [0, 0, 0]) >= -EPS)) {
        const a = hull[0];
        for (let i = 1; i < hull.length - 1; i++) {
            const b = hull[i], c = hull[i + 1], area = turn(a, b, c);
            if (Math.abs(area) < EPS) continue;
            const wa = (b[0] * c[1] - b[1] * c[0]) / area;
            const wb = (c[0] * a[1] - c[1] * a[0]) / area;
            const wc = 1 - wa - wb;
            if (Math.min(wa, wb, wc) >= -EPS) return [0, 0, wa * a[2] + wb * b[2] + wc * c[2]];
        }
    }
    let best = hull[0], distance = Infinity;
    for (let i = 0; i < hull.length; i++) {
        const a = hull[i], b = hull[(i + 1) % hull.length], d = minus(b, a);
        const length = d[0] ** 2 + d[1] ** 2;
        const t = length < EPS ? 0 : Math.max(0, Math.min(1, -(a[0] * d[0] + a[1] * d[1]) / length));
        const p = lerp(a, b, t), r = Math.hypot(p[0], p[1]);
        if (r < distance) { best = p; distance = r; }
    }
    return best;
}

export function ringBoxContact(ring: ModelRing, box: ModelBox): Vec3 | null {
    // Clip the oriented box to the ring's finite axial slab, then find the radial interval of its convex projection.
    // This preserves the hole, unlike an enclosing box or a filled outer cylinder.
    const vertices = boxVertices(box).map(p => ringLocal(ring, p));
    const clipped = vertices.filter(p => Math.abs(p[2]) <= ring.halfDepth + EPS);
    for (let i = 0; i < 8; i++) for (const bit of [1, 2, 4]) {
        const j = i ^ bit;
        if (i > j) continue;
        const a = vertices[i], b = vertices[j], dz = b[2] - a[2];
        if (Math.abs(dz) < EPS) continue;
        for (const z of [-ring.halfDepth, ring.halfDepth]) {
            const t = (z - a[2]) / dz;
            if (t >= -EPS && t <= 1 + EPS) clipped.push(lerp(a, b, Math.max(0, Math.min(1, t))));
        }
    }
    if (!clipped.length) return null;
    const hull = projectedHull(clipped), near = nearestToAxis(hull);
    const far = hull.reduce((best, p) => Math.hypot(p[0], p[1]) > Math.hypot(best[0], best[1]) ? p : best);
    const minimum = Math.hypot(near[0], near[1]), maximum = Math.hypot(far[0], far[1]);
    const low = Math.max(minimum, ring.inner), high = Math.min(maximum, ring.outer);
    if (low > high + EPS) return null;
    const radius = (low + high) / 2, d = minus(far, near);
    const a = d[0] ** 2 + d[1] ** 2, b = 2 * (near[0] * d[0] + near[1] * d[1]);
    const c = minimum ** 2 - radius ** 2;
    const t = a < EPS ? 0 : Math.max(0, Math.min(1, (-b + Math.sqrt(Math.max(0, b * b - 4 * a * c))) / (2 * a)));
    return ringToWorld(ring, lerp(near, far, t));
}

export function boxesOverlap(a: ModelBox, b: ModelBox): boolean {
    const axes = [...a.axes, ...b.axes, ...a.axes.flatMap(x => b.axes.map(y => cross(x, y)))];
    const delta = minus(b.center, a.center);
    return axes.every(axis => {
        if (dot(axis, axis) < EPS) return true;
        const ra = a.axes.reduce((sum, unit, i) => sum + a.half[i] * Math.abs(dot(unit, axis)), 0);
        const rb = b.axes.reduce((sum, unit, i) => sum + b.half[i] * Math.abs(dot(unit, axis)), 0);
        return Math.abs(dot(delta, axis)) <= ra + rb + EPS;
    });
}

function nearestOnBox(box: ModelBox, p: Vec3): Vec3 {
    const delta = minus(p, box.center);
    return box.axes.reduce((result, axis, i) => plus(result, times(axis, Math.max(-box.half[i], Math.min(box.half[i], dot(delta, axis))))), box.center);
}

export function createModelScene(parameters: ModelParameters): ModelScene {
    const base = 45 + parameters.x * 6.05, lift = (parameters.z - 50) * 1.7;
    const a = radians(parameters.arm);
    const armEnd: Vec3 = [base + 215 * Math.sin(a), 0, 370 - 215 * Math.cos(a)];
    // Coplanar axes and a vertical carriage are explicit illustration assumptions, not installed linkage geometry.
    const ring: ModelRing = { center: plus(armEnd, [0, 0, lift]), angle: parameters.arm + parameters.ring, outer: 88, inner: 61, halfDepth: 13 };
    const chairHeight = 45 + parameters.chair, bedHeight = 65 + parameters.bed;
    // The complete chair is turned 180 degrees about its unchanged X0 installation reference.
    const chairPoint = (forward: number, z: number): Vec3 => [88 + CHAIR_FORWARD_X * forward, 0, z];
    const legPivot = chairPoint(34, chairHeight - 4);
    const legAngle = radians(parameters.leg), direction: Vec3 = [CHAIR_FORWARD_X * Math.cos(legAngle), 0, -Math.sin(legAngle)];
    const legrest = makeBox('chair-legrest', '座椅腿托', plus(legPivot, times(direction, 36)), [36, 24, 3]);
    legrest.axes = [direction, [0, CHAIR_FORWARD_X, 0], [CHAIR_FORWARD_X * Math.sin(legAngle), 0, Math.cos(legAngle)]];
    const boxes = [
        makeBox('chair-seat', '座椅椅面', chairPoint(0, chairHeight - 4), [34, 29, 4], 180),
        makeBox('chair-back', '座椅靠背', chairPoint(-35, chairHeight + 24), [4, 29, 26], 180),
        makeBox('chair-column', '座椅立柱', chairPoint(0.5, chairHeight / 2), [7.5, 10, (chairHeight - 16) / 2], 180),
        makeBox('chair-base', '座椅底座', chairPoint(1, 4), [27, 33, 4], 180),
        legrest,
        makeBox('bed-board', '治疗床床板', [580, 0, bedHeight - 4.5], [130, 35, 4.5], parameters.yaw),
        makeBox('bed-column', '治疗床立柱', [581.5, 0, (bedHeight + 1) / 2], [18.5, 23, (bedHeight - 19) / 2]),
        makeBox('bed-base', '治疗床底座', [581.5, 0, 5], [36.5, 44, 5]),
        makeBox('housing', '顶部支架', [base, 0, 404], [68, 114, 26]),
        makeBox('mount', '顶部连接座', [base, 0, 451], [15, 17, 23]),
    ];
    for (const [i, y] of [-88, 88].entries()) {
        const arm = makeBox(`arm-${i}`, `双臂${i + 1}`, [(base + armEnd[0]) / 2, y, (370 + armEnd[2]) / 2], [9, 7, 107.5]);
        arm.axes = [[Math.cos(a), 0, Math.sin(a)], [0, 1, 0], [Math.sin(a), 0, -Math.cos(a)]];
        boxes.push(arm, makeBox(`joint-${i}`, '上连接座', [base, y, 369.5], [16, 15, 12.5]));
        if (Math.abs(lift) > EPS) boxes.push(makeBox(`lift-${i}`, `升降连接件${i + 1}`, [armEnd[0], y, armEnd[2] + lift / 2], [7, 7, Math.abs(lift) / 2]));
    }
    const furniture = boxes.filter(b => /^(chair|bed)-/.test(b.id));
    const contacts: ModelContact[] = [];
    for (const box of [...furniture, ...boxes.filter(b => b.id === 'housing' || b.id === 'mount')]) {
        const point = ringBoxContact(ring, box);
        if (point) contacts.push({ ids: ['ring', box.id], names: ['扫描环实体', box.name], point });
    }
    for (const moving of boxes.filter(b => /^(arm|lift)-/.test(b.id))) for (const fixed of furniture) {
        if (boxesOverlap(moving, fixed)) contacts.push({ ids: [moving.id, fixed.id], names: [moving.name, fixed.name], point: times(plus(nearestOnBox(moving, fixed.center), nearestOnBox(fixed, moving.center)), 0.5) });
    }
    const angle = radians(ring.angle);
    const lowest = ringToWorld(ring, [-(Math.sign(Math.sin(angle)) || 1) * ring.outer, 0, -Math.sign(Math.cos(angle)) * ring.halfDepth]);
    if (lowest[2] <= 0) contacts.push({ ids: ['ring', 'floor'], names: ['扫描环实体', '地面'], point: [lowest[0], lowest[1], 0] });
    const legBottom = boxVertices(legrest).reduce((low, vertex) => vertex[2] < low[2] ? vertex : low);
    if (legBottom[2] <= 0) contacts.push({ ids: ['chair-legrest', 'floor'], names: ['座椅腿托', '地面'], point: [legBottom[0], legBottom[1], 0] });
    return { ring, boxes, contacts, armEnd, legPivot, base, chairHeight, bedHeight };
}
