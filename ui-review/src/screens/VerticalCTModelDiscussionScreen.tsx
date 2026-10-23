import { useId, useMemo, useRef, useState } from "react";
import {
    Armchair, ArrowDownUp, BedDouble, Box, Check, CircleHelp,
    Info, MoveHorizontal, MoveUpRight, Rotate3D, RotateCw, RotateCcw, SlidersHorizontal, ScanLine, X,
} from "lucide-react";
import { boxVertices, CHAIR_FORWARD_X, CONFIRMED_DIMENSIONS, createModelScene, DEFAULT_PARAMETERS, ringLocal, ringToWorld, type ModelParameters, type ModelRing, type ModelScene } from "../lib/verticalCtGeometry";

type Motion = "all" | "x" | "z" | "arm" | "ring" | "yaw" | "chair" | "leg" | "bed";
type Point = [number, number, number];
type Point2 = [number, number];
type Face = { points: Point[]; fill: string; stroke: string; width: number; depth: number; part: string };

const motions = [
    { id: "all", name: "整体关系", symbol: "Σ", icon: Box, description: "固定基准 X0、X1；平移、升降与双臂摆动，共同决定扫描环的实际位置。", effects: ["机构行程与环中心坐标分别记录", "几何坐标与治疗、待机等模式用途分开定义"], limits: ["各机构行程边界", "组合姿态与整机空间约束"] },
    { id: "x", name: "X向平移", symbol: "sX", icon: MoveHorizontal, description: "悬吊组件沿 X 方向平移。平移机构的端点，与扫描环中心的实际 X 位置需要分别描述。", effects: ["双臂与扫描环随组件沿 X 方向移动", "双臂摆动仍会继续改变环中心的实际 X"], limits: ["平移机构两端行程", "参考点、零位与正方向"] },
    { id: "z", name: "独立升降", symbol: "sZ", icon: ArrowDownUp, description: "扫描环可以独立上下升降。升降机构的行程，与双臂摆动引起的高度变化分别记录。", effects: ["独立升降改变环的高度", "环中心实际 Z 还取决于双臂姿态"], limits: ["独立升降上、下限位", "升降导向与机构装配关系"] },
    { id: "arm", name: "双臂摆动", symbol: "α", icon: MoveUpRight, description: "两根臂同步前后摆动，扫描环中心的 X、Z 同时改变；保持环面对地方向需要转角配合。", effects: ["一次摆动同时产生 ΔX 和 ΔZ", "臂体与连接件也有各自的运动占用"], limits: ["前摆、后摆角度边界", "双臂同步条件与反馈"] },
    { id: "ring", name: "环体翻转", symbol: "β", icon: Rotate3D, description: "扫描环绕两侧连接轴，相对双臂调整角度。环面对地面的方向由双臂姿态和相对转角共同决定。", effects: ["β 描述相对双臂的转角", "环体转动会改变整机的空间占用"], limits: ["环体相对转角范围", "转轴位置、偏置与零位"] },
    { id: "yaw", name: "床板旋转", symbol: "θ床", icon: RotateCw, description: "床板由人工绕竖直 Z 轴连续调角，旋转中心 X1 的平面位置保持不变。", effects: ["床板在 X/Y 平面内的占用随角度变化", "四个参考角不构成连续角度反馈"], limits: ["实际旋转范围与允许转向", "四角信号的实时性与离角行为"] },
    { id: "chair", name: "座椅升降", symbol: "h椅", icon: Armchair, description: "座椅在固定安装基准 X0 上下升降，座椅高度可读取；靠背保持固定，腿托随座椅升降。", effects: ["座椅只调整高度与腿托倾角", "高度反馈可获取，安装基准的平面位置不变"], limits: ["座椅上、下行程限位", "高度参考点、单位与零位"] },
    { id: "leg", name: "腿托调角", symbol: "θ腿", icon: Rotate3D, description: "腿托可调倾角，角度可读取。模型暂以座椅前缘为转轴，水平为示意零位，向下为正；实际转轴与角度定义待确认。", effects: ["腿托与座椅一起升降，并可独立调角", "腿托实体纳入扫描环、双臂及地面的示意干涉检查"], limits: ["腿托倾角行程范围", "转轴、零位与角度正方向"] },
    { id: "bed", name: "治疗床升降", symbol: "h床", icon: BedDouble, description: "治疗床只调整床板高度和床板旋转角；床板高度可读取，底座和旋转轴的平面位置固定。", effects: ["床板高度反馈可获取", "旋转中心 X1 的平面位置保持不变"], limits: ["治疗床上、下行程限位", "床板高度参考点、单位与零位"] },
] as const;

const palette = {
    background: "#ffffff", neutral: "#9ba3ad", edge: "#aeb5be", shade: "#e8eaed",
    light: "#f7f8fa", blue: "#4D94FF", ringFace: "#e6f0ff", ringSide: "#c1dbff", line: "#e4e9ef",
};
const rad = (value: number) => value * Math.PI / 180;
const round = (value: number) => Number(value.toFixed(2));

const sliders = [
    { key: "x", name: "扫描环X向平移", symbol: "sX", min: 0, max: 100, unit: "%", from: "X−", to: "X+" },
    { key: "z", name: "扫描环独立升降", symbol: "sZ", min: 0, max: 100, unit: "%", from: "低", to: "高" },
    { key: "arm", name: "双臂同步摆动", symbol: "α", min: -65, max: 65, unit: "°", from: "后摆", to: "前摆" },
    { key: "ring", name: "扫描环相对翻转", symbol: "β", min: -120, max: 120, unit: "°", from: "反向", to: "正向" },
    { key: "chair", name: "座椅高度", symbol: "h椅", min: 0, max: 100, unit: "%", from: "低", to: "高" },
    { key: "leg", name: "腿托倾角", symbol: "θ腿", min: 0, max: 90, unit: "°", from: "示意水平", to: "示意下垂" },
    { key: "bed", name: "床板高度", symbol: "h床", min: 0, max: 100, unit: "%", from: "低", to: "高" },
    { key: "yaw", name: "床板角度", symbol: "θ床", min: 0, max: 360, unit: "°", from: "0°", to: "360°" },
] as const;

const referenceRing = createModelScene(DEFAULT_PARAMETERS).ring;

function ringPoint(ring: ModelRing, radius: number, t: number, side = 0): Point {
    return ringToWorld(ring, [radius * Math.cos(t), radius * Math.sin(t), side * ring.halfDepth]);
}

function buildDrawings(motion: Motion, markerId: string, scene: ModelScene, parameters: ModelParameters, showReference: boolean) {
    const pose = { base: scene.base, arm: parameters.arm };
    const active = (id: Motion) => motion === id || motion === "all" ? palette.blue : palette.neutral;
    const project = (p: Point): Point2 => [round(110 + 0.75 * p[0] + 0.55 * p[1]), round(377 + 0.11 * p[0] - 0.2 * p[1] - 0.67 * p[2])];
    const xy = (p: Point) => project(p).join(",");
    const faces: Face[] = [];
    const depth = (p: Point) => 0.3685 * p[0] - 0.5025 * p[1] + 0.2105 * p[2];
    const face = (points: Point[], fill: string, stroke: string = palette.edge, width = 0.8, part = "") => {
        faces.push({ points, fill, stroke, width, part, depth: points.reduce((sum, p) => sum + depth(p), 0) / points.length });
    };
    const cylinder = (center: Point, radius: number, length: number) => {
        const a: Point[] = [], b: Point[] = [];
        for (let i = 0; i < 28; i++) {
            const t = i / 28 * Math.PI * 2;
            a.push([center[0] + radius * Math.cos(t), center[1] - length / 2, center[2] + radius * Math.sin(t)]);
            b.push([center[0] + radius * Math.cos(t), center[1] + length / 2, center[2] + radius * Math.sin(t)]);
        }
        face(a, palette.light); face(b, palette.light);
        for (let i = 0; i < 28; i++) face([a[i], a[(i + 1) % 28], b[(i + 1) % 28], b[i]], palette.shade, "none", 0);
    };

    const bedAngle = rad(parameters.yaw);
    const hitParts = new Set(scene.contacts.flatMap(contact => contact.ids));
    for (const body of scene.boxes) {
        const vertices = boxVertices(body);
        const ids = [[0, 2, 3, 1], [4, 5, 7, 6], [0, 1, 5, 4], [2, 6, 7, 3], [0, 4, 6, 2], [1, 3, 7, 5]];
        ids.forEach((indexes, i) => face(indexes.map(index => vertices[index]), body.id === "chair-legrest" && motion === "leg" ? palette.ringFace : i === 1 ? palette.light : i === 4 ? palette.shade : palette.background, body.id === "chair-legrest" && motion === "leg" ? palette.blue : palette.edge, 0.8, body.id));
    }
    face([[pose.base - 54, -114.2, 390], [pose.base + 54, -114.2, 390], [pose.base + 62, -114.2, 418], [pose.base - 62, -114.2, 418]], palette.ringSide, "none", 0);
    const center = scene.ring.center;
    for (const y of [-88, 88]) {
        cylinder([pose.base, y, 370], 11, 21);
        cylinder([center[0], y, center[2]], 12, 23);
    }
    cylinder(scene.legPivot, 4, 48);
    for (let i = 0; i < 64; i++) {
        const a = i / 64 * Math.PI * 2, b = (i + 1) / 64 * Math.PI * 2;
        const op = ringPoint(scene.ring, scene.ring.outer, a, 1), oq = ringPoint(scene.ring, scene.ring.outer, b, 1), om = ringPoint(scene.ring, scene.ring.outer, a, -1), on = ringPoint(scene.ring, scene.ring.outer, b, -1);
        const ip = ringPoint(scene.ring, scene.ring.inner, a, 1), iq = ringPoint(scene.ring, scene.ring.inner, b, 1), im = ringPoint(scene.ring, scene.ring.inner, a, -1), inner = ringPoint(scene.ring, scene.ring.inner, b, -1);
        face([op, oq, iq, ip], palette.ringFace, "none", 0, "ring-face");
        face([om, on, inner, im], palette.ringFace, "none", 0, "ring-face");
        face([op, oq, on, om], palette.ringSide, "none", 0, "ring-outer");
        face([ip, iq, inner, im], palette.shade, "none", 0, "ring-inner");
        for (const sign of [-1, 1]) {
            face([ringPoint(scene.ring, scene.ring.outer - 4, a, sign), ringPoint(scene.ring, scene.ring.outer - 4, b, sign), ringPoint(scene.ring, scene.ring.outer - 7, b, sign), ringPoint(scene.ring, scene.ring.outer - 7, a, sign)], palette.blue, "none", 0, "ring-stripe");
        }
    }
    faces.sort((a, b) => a.depth - b.depth);
    const renderFace = (f: Face, projection: (p: Point) => Point2) => {
        const isRing = f.part.startsWith("ring-");
        const hit = hitParts.has(isRing ? "ring" : f.part);
        const nearContact = isRing && scene.contacts.some(contact => contact.ids.includes("ring") && Math.hypot(...ringLocal(scene.ring, contact.point).slice(0, 2).map((value, i) => value - ringLocal(scene.ring, f.points[0])[i])) < 28);
        const fill = hit ? nearContact ? "#F27676" : isRing ? "#FAD9DC" : "#FFE5E5" : f.fill;
        return `<polygon data-model-part="${f.part}" points="${f.points.map(p => projection(p).join(",")).join(" ")}" fill="${fill}" stroke="${hit && f.stroke !== "none" ? "#ED9A9A" : f.stroke}" stroke-width="${f.width}" stroke-linejoin="round"/>`;
    };
    const solids = faces.map(f => renderFace(f, project)).join("");
    const arrow = `url(#${markerId}-side)`;
    const line = (points: Point[], color: string = palette.neutral, extra = "") => `<path d="M ${points.map(xy).join(" L ")}" fill="none" stroke="${color}" stroke-width="1.4" ${extra}/>`;
    const screenLine = (points: Point2[], color: string = palette.neutral, extra = "") => `<path d="M ${points.map((p) => p.join(",")).join(" L ")}" fill="none" stroke="${color}" stroke-width="1.3" ${extra}/>`;
    const text = (x: number, y: number, value: string, anchor = "start", secondary = false) => `<text x="${round(x)}" y="${round(y)}" text-anchor="${anchor}" fill="${secondary ? "#8b95a4" : "#25364a"}">${value}</text>`;
    const label = (point: Point, value: string, anchor = "start", secondary = false) => text(...project(point), value, anchor, secondary);
    const cap = (point: Point2, horizontal = true, color: string = palette.neutral) => screenLine(horizontal ? [[point[0] - 5, point[1]], [point[0] + 5, point[1]]] : [[point[0], point[1] - 5], [point[0], point[1] + 5]], color);
    const doubleArrow = (a: Point, b: Point, color: string) => line([a, b], color, `marker-start="${arrow}" marker-end="${arrow}"`);
    let underlay = "", overlay = "", labels = "";
    if (showReference) {
        for (const y of [-88, 88]) underlay += line([[referenceRing.center[0], y, 370], [referenceRing.center[0], y, referenceRing.center[2]]], palette.neutral, 'stroke-dasharray="5 4" opacity=".4"');
        const points: Point[] = [];
        for (let i = 0; i <= 64; i++) points.push(ringPoint(referenceRing, referenceRing.outer, i / 64 * Math.PI * 2));
        underlay += line(points, palette.neutral, 'stroke-dasharray="5 4" opacity=".4"');
    }
    const railA = project([40, 0, 484]), railB = project([650, 0, 484]);
    overlay += screenLine([railA, railB], active("x")) + cap(railA, false, active("x")) + cap(railB, false, active("x"));
    labels += text(railA[0], railA[1] - 12, "sX−", "start", true) + text(railB[0], railB[1] - 12, "sX+", "end", true);
    labels += text((railA[0] + railB[0]) / 2, (railA[1] + railB[1]) / 2 - 15, "X平移行程", "middle");
    overlay += screenLine([[688, 174], [688, 314]], active("z")) + cap([688, 174], true, active("z")) + cap([688, 314], true, active("z"));
    labels += text(679, 174, "sZ上限", "end", true) + text(679, 320, "sZ下限", "end", true) + text(679, 244, "独立升降行程", "end");
    if (motion === "all" || motion === "x") overlay += doubleArrow([180, 0, 485], [365, 0, 485], active("x"));
    if (motion === "all" || motion === "z") {
        overlay += doubleArrow([center[0] + 111, -15, 125], [center[0] + 111, -15, 220], active("z"));
        labels += label([center[0] + 128, -15, 218], "sZ");
    }
    if (motion === "arm") {
        const original = referenceRing.center;
        overlay += line([[original[0], 0, original[2]], [center[0], 0, original[2]]], palette.blue, `stroke-dasharray="4 4" marker-end="${arrow}"`);
        overlay += line([[center[0], 0, original[2]], [center[0], 0, center[2]]], palette.blue, `stroke-dasharray="4 4" marker-end="${arrow}"`);
        labels += label([(original[0] + center[0]) / 2, -7, original[2] - 24], "ΔX", "middle");
        labels += label([center[0] + 17, 0, (original[2] + center[2]) / 2], "ΔZ") + label([pose.base + 80, 5, 315], "α · 双臂同步");
    } else if (motion === "all") {
        const arc: Point[] = [];
        for (let i = 0; i <= 20; i++) { const a = rad(i * 1.5); arc.push([pose.base + 85 * Math.sin(a), -88, 370 - 85 * Math.cos(a)]); }
        overlay += line(arc, palette.blue, `marker-end="${arrow}"`);
        labels += label([pose.base + 60, -88, 300], "α");
    }
    if (motion === "ring") {
        const arc: Point[] = [];
        for (let i = 0; i <= 24; i++) { const a = rad(i * 3); arc.push([center[0] + 110 * Math.cos(a), 0, center[2] + 110 * Math.sin(a)]); }
        overlay += line(arc, palette.blue, `marker-end="${arrow}"`);
        labels += label([center[0] + 135, 0, center[2] + 58], "β · 环体转角");
    }
    if (motion === "all" || motion === "chair") {
        overlay += doubleArrow([16, -34, 36], [16, -34, 128], active("chair"));
        labels += label([16, -34, 150], "h椅 ↕", "middle");
    }
    if (motion === "leg") {
        const arc: Point[] = [];
        for (let i = 0; i <= 24; i++) {
            const angle = rad(parameters.leg * i / 24);
            arc.push([scene.legPivot[0] + CHAIR_FORWARD_X * 28 * Math.cos(angle), -28, scene.legPivot[2] - 28 * Math.sin(angle)]);
        }
        overlay += line(arc, palette.blue, `marker-end="${arrow}"`);
        overlay += line([[scene.legPivot[0], -28, scene.legPivot[2]], [scene.legPivot[0] + CHAIR_FORWARD_X * 45, -28, scene.legPivot[2]]], palette.neutral, 'stroke-dasharray="3 4"');
        labels += label([scene.legPivot[0] + CHAIR_FORWARD_X * 63, -24, scene.legPivot[2] + 8], "θ腿 · 腿托倾角");
    }
    if (motion === "all" || motion === "bed") {
        overlay += doubleArrow([690, -70, 24], [690, -70, 130], active("bed"));
        labels += label([690, -70, 152], "h床 ↕", "middle");
    }
    const ring = project(center);
    overlay += `<circle cx="${ring[0]}" cy="${ring[1]}" r="3.5" fill="#25364a"/>`;
    if (motion !== "arm") labels += text(ring[0] + 12, ring[1] + (motion === "ring" ? 38 : 52), "环中心 (X环, Z环)");
    for (const [x, value] of [[88, "X0 · 座椅基准"], [580, "X1 · 床旋转中心"]] as const) {
        const p = project([x, 0, 0]);
        overlay += screenLine([[p[0], p[1] + 8], [p[0], 472]], palette.neutral, 'stroke-dasharray="3 4"');
        labels += text(p[0], 492, value, "middle");
    }
    overlay += screenLine([[60, 442], [133, 452.7]], palette.neutral, `marker-end="${arrow}"`) + screenLine([[60, 442], [60, 377]], palette.neutral, `marker-end="${arrow}"`);
    labels += text(141, 456.7, "X") + text(56, 368, "Z");
    const floor = line([[-10, -100, 0], [745, -100, 0], [745, 100, 0], [-10, 100, 0], [-10, -100, 0]], palette.line);
    const contactPins = (projection: (p: Point) => Point2) => {
        const placed: Point2[] = [];
        return scene.contacts.map((contact, i) => {
            const [x, y] = projection(contact.point);
            let labelX = x, labelY = y;
            for (let attempt = 1; placed.some(p => Math.hypot(p[0] - labelX, p[1] - labelY) < 23) && attempt <= 48; attempt++) {
                const radius = 26 * Math.ceil(attempt / 6), angle = attempt * Math.PI / 3;
                labelX = round(x + radius * Math.cos(angle)); labelY = round(y + radius * Math.sin(angle));
            }
            placed.push([labelX, labelY]);
            return `<g data-collision-marker="${i + 1}"><path d="M${x},${y}L${labelX},${labelY}" stroke="#EA6060" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="2.5" fill="#EA6060"/><circle cx="${labelX}" cy="${labelY}" r="14" fill="#EF6464" opacity=".15"/><circle cx="${labelX}" cy="${labelY}" r="8" fill="#EA6060" stroke="#fff" stroke-width="1.4"/><text x="${labelX}" y="${labelY + 3.5}" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">${i + 1}</text></g>`;
        }).join("");
    };
    const side = floor + underlay + solids + overlay + labels + contactPins(project);

    const P = (x: number, y: number): Point2 => [round(110 + 0.75 * x), round(172 - 0.7 * y)];
    const planLine = (points: Point2[], color: string = palette.neutral, extra = "") => `<path d="M ${points.map((p) => p.join(",")).join(" L ")}" fill="none" stroke="${color}" stroke-width="1.4" ${extra}/>`;
    const bedPolygon = (angle: number) => [[-130, -35], [130, -35], [130, 35], [-130, 35]].map(([x, y]) => P(580 + x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)));
    const polygon = (points: Point2[], fill: string, stroke: string, extra = "") => `<polygon points="${points.map((p) => p.join(",")).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="1.5" ${extra}/>`;
    const bed = P(580, 0), chair = P(88, 0), ringProjection = P(center[0], 0);
    let plan = planLine([P(-10, 0), P(740, 0)], palette.line, 'stroke-dasharray="3 4"');
    const planProject = (p: Point) => P(p[0], p[1]);
    plan += faces.filter(f => /^(ring-|chair-|bed-|arm-|lift-)/.test(f.part)).slice().sort((a, b) => a.points.reduce((s, p) => s + p[2], 0) / a.points.length - b.points.reduce((s, p) => s + p[2], 0) / b.points.length).map(f => renderFace(f, planProject)).join("");
    for (const [radius, part] of [[scene.ring.outer, "outer"], [scene.ring.inner, "inner"]] as const) for (const side of [-1, 1]) {
        const points: Point2[] = [];
        for (let i = 0; i <= 64; i++) points.push(planProject(ringPoint(scene.ring, radius, i / 64 * Math.PI * 2, side)));
        plan += planLine(points, hitParts.has("ring") ? "#E77777" : palette.blue, `data-ring-contour="${part}" stroke-width="1.5"`);
    }
    if (motion === "all" || motion === "yaw") {
        const circle: Point2[] = [];
        for (let i = 0; i <= 72; i++) { const a = i / 72 * Math.PI * 2; circle.push(P(580 + 135 * Math.cos(a), 135 * Math.sin(a))); }
        plan += planLine(circle, palette.neutral, 'stroke-dasharray="4 5" opacity=".55"');
    }
    if (motion === "yaw") plan += polygon(bedPolygon(0), "none", palette.neutral, 'stroke-dasharray="5 4" opacity=".5"');
    plan += `<circle cx="${bed[0]}" cy="${bed[1]}" r="4" fill="#25364a"/>`;
    const angleArc: Point2[] = [];
    for (let i = 0; i <= 22; i++) { const a = i / 22 * bedAngle; angleArc.push(P(580 + 94 * Math.cos(a), 94 * Math.sin(a))); }
    plan += planLine(angleArc, active("yaw"), `marker-end="url(#${markerId}-plan)"`);
    plan += text(bed[0] - 20, bed[1] - 56, "θ床", "end");
    if (motion === "yaw") {
        for (const [a, value] of [[0, "0°"], [90, "90°"], [180, "180°"], [270, "270°"]] as const) {
            const q = P(580 + 155 * Math.cos(rad(a)), 155 * Math.sin(rad(a)));
            plan += text(q[0], q[1] + (a === 90 ? -3 : a === 270 ? 14 : 4), value, a === 0 ? "start" : a === 180 ? "end" : "middle", true);
        }
    }
    for (const [x, value] of [[88, "X0"], [580, "X1"]] as const) {
        const q = P(x, 0);
        plan += planLine([[q[0], q[1] + 26], [q[0], x === 580 && motion === "yaw" ? 270 : 302]], palette.neutral, 'stroke-dasharray="3 4"');
        plan += text(q[0], 326, value, "middle");
    }
    plan += text(chair[0], chair[1] - 42, "座椅", "middle") + text(ringProjection[0], ringProjection[1] - 83, "扫描环投影", "middle");
    if (motion !== "yaw") plan += text(bed[0], bed[1] - 115, "床板", "middle");
    plan += planLine([[40, 260], [110, 260]], palette.neutral, `marker-end="url(#${markerId}-plan)"`) + planLine([[40, 260], [40, 202]], palette.neutral, `marker-end="url(#${markerId}-plan)"`);
    plan += text(117, 264, "X") + text(36, 194, "Y");
    plan += contactPins(planProject);
    const geometry = faces.flatMap(f => f.points);
    const fitViewBox = (projection: (p: Point) => Point2, height: number, minimumTop: number) => {
        const points = geometry.map(projection);
        const left = Math.min(0, ...points.map(p => p[0] - 20)), top = Math.min(minimumTop, ...points.map(p => p[1] - 20));
        const right = Math.max(736, ...points.map(p => p[0] + 20)), bottom = Math.max(height, ...points.map(p => p[1] + 20));
        return `${left} ${top} ${right - left} ${bottom - top}`;
    };
    return { side, plan, sideViewBox: fitViewBox(project, 510, 25), planViewBox: fitViewBox(planProject, 342, 40) };
}

function ModelDrawing({ markup, view, id, viewBox }: { markup: string; view: "side" | "plan"; id: string; viewBox: string }) {
    const definition = '<defs><marker id="' + id + '-' + view + '" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L8 4L0 8Z" fill="context-stroke"/></marker></defs>';
    return <svg
        data-model-view={view}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={view === "side" ? "双臂结构与X、Z运动关系" : "床板水平旋转与固定基准"}
        className="block h-full min-h-0 w-full"
        style={{ fontFamily: '"Microsoft YaHei", "PingFang SC", sans-serif', fontSize: view === "side" ? 16 : 22 }}
        dangerouslySetInnerHTML={{ __html: definition + markup }}
    />;
}

export default function VerticalCTModelDiscussionScreen() {
    const [motion, setMotion] = useState<Motion>("all");
    const [parameters, setParameters] = useState<ModelParameters>(() => ({ ...DEFAULT_PARAMETERS }));
    const [showReference, setShowReference] = useState(false);
    const notesRef = useRef<HTMLDialogElement>(null);
    const id = useId().replaceAll(":", "");
    const scene = useMemo(() => createModelScene(parameters), [parameters]);
    const drawings = useMemo(() => buildDrawings(motion, id, scene, parameters, showReference), [motion, id, scene, parameters, showReference]);
    const current = motions.find((item) => item.id === motion) ?? motions[0];
    const angle = parameters.yaw % 360;
    return (
        <div data-testid="vertical-ct-model-screen" className="flex h-full min-h-0 w-full min-w-0 flex-col gap-2 bg-[#F4F7FB] p-2 text-[#25364A]" style={{ fontFamily: '"Microsoft YaHei", "PingFang SC", sans-serif' }}>
            <header className="flex shrink-0 items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#4D94FF]" />
                    <h2 className="m-0 text-[19px] font-semibold leading-8 tracking-tight">垂直CT模型</h2>
                    <span className="hidden text-[11px] text-[#95A2B4] xl:inline">双图同步 · 组合姿态讨论</span>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-[10px]">
                    <span className="rounded-full border border-[#D9E7FA] bg-white px-2.5 py-1 text-[#5686BC]">内孔 Ø{CONFIRMED_DIMENSIONS.ringInnerDiameterCm} cm</span>
                    <span className="hidden rounded-full border border-[#E1E6ED] bg-white px-2.5 py-1 text-[#8390A2] lg:inline">空载 · 其余尺寸待确认</span>
                    <button type="button" onClick={() => notesRef.current?.showModal()} className="flex items-center gap-1 rounded-md border border-[#D9E3F0] bg-white px-2.5 py-1.5 text-[#7A90AD] hover:bg-[#EFF5FE]"><Info size={12} />模型说明</button>
                </div>
            </header>

            <section aria-label="运动分类" className="shrink-0 rounded-lg border border-[#E1E8F1] bg-white p-1.5">
                <div className="grid grid-cols-3 gap-1 lg:grid-cols-9">
                    {motions.map(({ id: key, name, icon: Icon }) => <button key={key} type="button" aria-pressed={motion === key} onClick={() => setMotion(key)}
                        className={"flex min-h-7 min-w-0 items-center justify-center gap-1 rounded-md border px-1 py-1 text-[11px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 " + (motion === key ? "border-[#4D94FF] bg-[#4D94FF] text-white" : "border-transparent bg-[#F6F8FB] text-[#738298] hover:bg-[#EFF5FE]")}>
                        <Icon size={12} strokeWidth={1.7} className="shrink-0" /><span>{name}</span>
                    </button>)}
                </div>
                <div aria-live="polite" className="mt-1 flex min-w-0 items-center gap-2 rounded-md bg-[#F4F8FE] px-2 py-0.5">
                    <span className="min-w-6 shrink-0 text-center text-[12px] font-semibold text-[#4D94FF]">{current.symbol}</span>
                    <p title={current.description} className="m-0 truncate text-[11px] leading-5 text-[#7288A4]">{current.description}</p>
                </div>
            </section>

            <div data-testid="model-view-workspace" className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] gap-2">
                <section aria-label="斜侧图" className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-[#E1E8F1] bg-white">
                    <div className="flex min-h-8 shrink-0 items-center justify-between gap-2 border-b border-[#EFF2F6] px-3 py-1.5">
                        <h3 className="m-0 text-[12px] font-semibold"><span className="mr-2 text-[#4D94FF]">▏</span>斜侧视 · X / Z</h3>
                        <label className="flex cursor-pointer items-center gap-1 text-[10px] text-[#93A0B1]"><input type="checkbox" checked={showReference} onChange={event => setShowReference(event.target.checked)} className="accent-[#4D94FF]" />参考姿态</label>
                    </div>
                    <div className="min-h-0 flex-1 px-1 py-1"><ModelDrawing markup={drawings.side} view="side" id={id} viewBox={drawings.sideViewBox} /></div>
                    <div className="flex min-h-6 shrink-0 flex-wrap items-center gap-x-4 gap-y-0.5 border-t border-[#EFF2F6] px-3 py-1 text-[9px] text-[#96A1B0]">
                        <span className="flex items-center gap-1"><span className="h-0.5 w-3 rounded-full bg-[#4D94FF]" />所选运动 / 扫描环</span>
                        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#EA6060]" />红色编号：示意重叠</span>
                        <span>端线：演示边界</span>
                    </div>
                </section>

                <div className="flex min-h-0 min-w-0 flex-col gap-2">
                    <section aria-label="俯视图" className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-[#E1E8F1] bg-white">
                        <div className="flex min-h-8 shrink-0 items-center justify-between gap-2 border-b border-[#EFF2F6] px-3 py-1.5">
                            <h3 className="m-0 text-[12px] font-semibold"><span className="mr-2 text-[#4D94FF]">▏</span>俯视 · X / Y</h3>
                            <span className="hidden text-[10px] text-[#93A0B1] xl:inline">内外缘与厚度共同投影</span>
                        </div>
                        <div className="min-h-0 flex-1 px-1 py-1"><ModelDrawing markup={drawings.plan} view="plan" id={id} viewBox={drawings.planViewBox} /></div>
                        <div className="flex shrink-0 flex-wrap items-center gap-x-3 px-3 pb-1 text-[9px] text-[#93A1B3]">
                            <span className="flex items-center gap-1"><span className="h-2 w-2.5 border border-[#4D94FF] bg-[#E6F0FF]" />实体环壁</span><span>中间留空：内孔</span><span className="hidden xl:inline">投影重叠需结合高度判断</span>
                        </div>
                        <div className="flex min-h-7 shrink-0 flex-wrap items-center gap-1.5 border-t border-[#EFF2F6] px-3 py-1">
                            <span className="mr-1 text-[9px] text-[#96A2B4]">床角参考信号</span>
                            {[0, 90, 180, 270].map(reference => <span key={reference} className={"rounded border px-2 py-0.5 text-[9px] " + (angle === reference ? "border-[#A9CCFA] bg-[#ECF4FF] text-[#4D88CF]" : "border-[#E4EBF4] bg-[#F8FAFD] text-[#8D9CB0]")}>{reference}°</span>)}
                        </div>
                    </section>
                    <section aria-label="姿态干涉观察" className={"flex max-h-[100px] min-h-[60px] shrink-0 flex-col rounded-lg border px-3 py-2 " + (scene.contacts.length ? "border-[#F1D1D1] bg-[#FFF8F8]" : "border-[#E1E8F1] bg-white")}>
                        <div className="flex shrink-0 items-center justify-between gap-2"><h3 className="m-0 flex items-center gap-1.5 text-[11px] font-semibold"><ScanLine size={13} className={scene.contacts.length ? "text-[#E46D6D]" : "text-[#8DA4C2]"} />当前姿态 · 干涉观察</h3><span data-testid="collision-count" className={"text-[10px] " + (scene.contacts.length ? "text-[#DB6969]" : "text-[#8B99AB]")}>{scene.contacts.length ? scene.contacts.length + " 处示意重叠" : "未检出示意重叠"}</span></div>
                        <div aria-live="polite" className="mt-1 min-h-0 overflow-y-auto text-[10px]">
                            {scene.contacts.length ? scene.contacts.map((contact, i) => <div key={contact.ids.join("/")} data-testid="collision-item" className="flex items-center gap-1.5 py-0.5 leading-4 text-[#AA6868]"><span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#EA6060] text-[8px] font-semibold text-white">{i + 1}</span><span>{contact.names.join(" × ")}</span></div>) : <p className="m-0 leading-4 text-[#9AA7B8]">仅检查当前示意姿态，未检出不代表现场可通行。</p>}
                        </div>
                    </section>
                </div>
            </div>

            <section aria-label="姿态滑块" className="shrink-0 rounded-lg border border-[#E1E8F1] bg-white px-3 py-2">
                <div className="mb-1 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2"><h3 className="m-0 flex shrink-0 items-center gap-1.5 text-[12px] font-semibold"><SlidersHorizontal size={13} className="text-[#4D94FF]" />组合姿态调整</h3><span className="hidden truncate text-[9px] text-[#9AA7B8] lg:inline">百分比为相对演示量；滑块端点不是现场限位</span></div>
                    <button type="button" onClick={() => { setParameters({ ...DEFAULT_PARAMETERS }); setMotion("all"); }} className="flex shrink-0 items-center gap-1 rounded border border-[#E1E8F1] px-2 py-0.5 text-[10px] text-[#8293A9] hover:bg-[#F5F8FC]"><RotateCcw size={11} />恢复参考姿态</button>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 lg:grid-cols-4">
                    {sliders.map(slider => <div key={slider.key} className="min-w-0">
                        <div className="flex min-w-0 items-center justify-between gap-1">
                            <label htmlFor={id + "-" + slider.key} title={slider.name} className="min-w-0 truncate text-[11px] font-medium leading-4 text-[#677F9D]">{slider.name}<span className="ml-1 font-normal text-[#A0ADBE]">{slider.symbol}</span>{["chair", "leg", "bed"].includes(slider.key) ? <span title="现场已确认具备反馈能力；本页仍使用模型演示量" className="ml-1 text-[9px] font-normal text-[#8EA6BD]">可读取</span> : null}</label>
                            <output htmlFor={id + "-" + slider.key} className="min-w-10 shrink-0 rounded bg-[#EFF5FE] px-1.5 text-right text-[11px] leading-4 tabular-nums text-[#4D88CF]">{parameters[slider.key]}{slider.unit}</output>
                        </div>
                        <input
                            id={id + "-" + slider.key} type="range" min={slider.min} max={slider.max} step={1} value={parameters[slider.key]}
                            aria-valuetext={parameters[slider.key] + slider.unit + (slider.unit === "%" ? "，相对演示量" : "，模型角度")}
                            onChange={event => { const value = Number(event.target.value); setParameters(previous => ({ ...previous, [slider.key]: value })); setMotion(slider.key); }}
                            className="block h-4 w-full cursor-pointer appearance-none rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#A9CCFA] [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4D94FF] [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#4D94FF]"
                            style={{ background: "linear-gradient(to right, #4D94FF " + ((parameters[slider.key] - slider.min) / (slider.max - slider.min) * 100) + "%, #E5EDF8 0) center / 100% 6px no-repeat" }}
                        />
                        <div className="flex justify-between text-[8px] leading-[10px] text-[#ACB6C4]"><span>{slider.from}</span><span>{slider.to}</span></div>
                    </div>)}
                </div>
            </section>

            <footer className="flex shrink-0 items-center gap-1 px-1 text-[9px] leading-3 text-[#98A4B5]"><Info size={10} className="shrink-0" /><span>示意干涉仅针对当前姿态；其余尺寸、机构关系与经过路径仍待验证。</span></footer>

            <dialog ref={notesRef} aria-label="模型说明" className="m-auto max-h-[calc(100dvh-48px)] w-[min(780px,calc(100vw-32px))] overflow-y-auto rounded-xl border border-[#DDE6F2] bg-[#F7F9FC] p-5 text-[#516B8A] shadow-xl backdrop:bg-[#233B56]/25">
                <div className="mb-4 flex items-center justify-between gap-3"><h3 className="m-0 text-[16px] font-semibold">模型说明</h3><form method="dialog"><button type="submit" aria-label="关闭模型说明" className="rounded-md border border-[#DFE7F2] bg-white p-1.5 text-[#8B9BB0]"><X size={16} /></button></form></div>
                <div className="grid gap-3 sm:grid-cols-2">
                    <section className="rounded-lg border border-[#E1E8F1] bg-white p-4"><h4 className="mb-2 mt-0 text-[12px] font-semibold">{current.name} · 影响关系</h4><p className="text-[12px] leading-6">{current.description}</p>{current.effects.map(effect => <p key={effect} className="my-1 flex gap-2 text-[12px] leading-6"><Check size={12} className="mt-1.5 shrink-0 text-[#85AAD7]" />{effect}</p>)}</section>
                    <section className="rounded-lg border border-[#E1E8F1] bg-white p-4"><h4 className="mb-3 mt-0 flex items-center gap-2 text-[12px] font-semibold"><CircleHelp size={13} />限位与接口记录</h4>{current.limits.map(limit => <div key={limit} className="mb-3 flex justify-between gap-3 text-[12px] leading-5"><span>{limit}</span><span className="shrink-0 text-[10px] text-[#97A5B7]">待确认</span></div>)}<p className="mb-0 text-[11px] leading-5 text-[#95A3B5]">已确认可读取：腿托倾角、座椅高度、床板高度。床板角度仍为四个参考角信号。</p></section>
                    <section className="rounded-lg border border-[#E1E8F1] bg-white p-4"><h4 className="mb-2 mt-0 text-[12px] font-semibold">已确认信息与固定基准</h4><p className="my-1 text-[12px] leading-6">扫描环内孔直径：{CONFIRMED_DIMENSIONS.ringInnerDiameterCm} cm。</p><p className="my-1 text-[12px] leading-6">X0 为座椅固定安装基准，X1 为床板旋转中心的平面基准。</p><p className="my-1 text-[12px] leading-6">座椅仅调高度和腿托倾角；治疗床仅调床板高度和床板旋转角。模式用途与坐标定义分开记录。</p><p className="my-1 text-[12px] leading-6">两根摆臂各有一个障碍检测雷达。</p></section>
                    <section className="rounded-lg border border-[#DDE8F7] bg-[#EDF4FE] p-4"><h4 className="mb-2 mt-0 text-[12px] font-semibold">模型假设与检查范围</h4><p className="my-1 text-[12px] leading-6">内孔物理直径已记录，其他部件仍采用未标定的示意比例，不能据此推算现场尺寸或净距。</p><p className="my-1 text-[12px] leading-6">按有内孔和轴向厚度的环体检查与床椅、双臂、连接件、地面及顶架的示意重叠；不包含线缆、扶手、附件与全部结构自碰。</p><p className="my-1 text-[12px] leading-6">双臂与环体暂按共面转轴绘制，独立升降用竖直连接件占位。腿托暂以座椅前缘为轴、水平为零、向下为正。</p></section>
                    <section className="rounded-lg border border-[#E1E8F1] bg-white p-4 sm:col-span-2"><h4 className="mb-2 mt-0 text-[12px] font-semibold">双臂雷达安装参考 · V1</h4><p className="my-1 text-[12px] leading-6">按安装文档参考图：左侧雷达1连接 X19，右侧雷达2连接 X20，两只雷达均朝向圆心。文档采用逆时针角度约定；雷达局部坐标与模型坐标的对应关系仍待确认。</p><p className="my-1 text-[12px] leading-6">文档将避障边界分为7个区域，以角度对应的距离阈值 d 描述。原文参数为 a=941、b=600、r=450，另有半径300的局部区域；单位与是否适用于当前安装版本待核对。</p><p className="my-1 text-[12px] leading-6">当前内孔按新确认的100 cm记录。若文档 r=450 的单位为毫米，则对应直径90 cm；未将这组参考数值直接迁移为当前设备的雷达阈值。文档边界角存在28.5°、28.6°等不同写法，也需统一。</p><p className="mb-0 mt-1 text-[11px] leading-5 text-[#95A3B5]">页面当前显示的是几何重叠示意，尚未接入雷达测量或告警信号。</p></section>
                </div>
            </dialog>
        </div>
    );
}
