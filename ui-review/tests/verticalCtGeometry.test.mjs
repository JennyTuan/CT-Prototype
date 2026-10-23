import test from 'node:test';
import assert from 'node:assert/strict';
import { makeBox, ringBoxContact, boxesOverlap, createModelScene, DEFAULT_PARAMETERS } from '../src/lib/verticalCtGeometry.ts';

const ring = { center: [0, 0, 0], angle: 0, outer: 88, inner: 61, halfDepth: 13 };

test('an object entirely inside the aperture does not touch the annular body', () => {
    assert.equal(ringBoxContact(ring, makeBox('inside', '内孔中的部件', [0, 0, 0], [40, 20, 4])), null);
});

test('the radial wall and both axial faces have physical thickness', () => {
    for (const [center, half] of [
        [[70, 0, 0], [3, 3, 3]],
        [[89, 0, 0], [2, 2, 2]],
        [[60, 0, 0], [2, 2, 2]],
        [[72, 0, 14], [2, 2, 2]],
        [[72, 0, -14], [2, 2, 2]],
    ]) assert.ok(ringBoxContact(ring, makeBox('wall', '环壁附近', center, half)));
});

test('plan overlap without axial overlap is not a solid overlap', () => {
    assert.equal(ringBoxContact(ring, makeBox('above', '轴向分离', [72, 0, 19], [3, 3, 3])), null);
    assert.equal(ringBoxContact(ring, makeBox('outside', '外径之外', [100, 0, 0], [3, 3, 3])), null);
});

test('a wide box crossing the aperture still hits the ring even if its center is in the hole', () => {
    assert.ok(ringBoxContact(ring, makeBox('crossing', '穿越环壁', [0, 0, 0], [100, 8, 4])));
});

test('tilting the ring rotates its aperture and thickness together', () => {
    const tilted = { ...ring, center: [200, 0, 150], angle: 90 };
    assert.equal(ringBoxContact(tilted, makeBox('inside', '内孔', [200, 0, 150], [4, 20, 30])), null);
    assert.ok(ringBoxContact(tilted, makeBox('wall', '内壁', [200, 0, 220], [4, 4, 4])));
    assert.equal(ringBoxContact(tilted, makeBox('separate', '轴向分离', [220, 0, 220], [3, 3, 3])), null);
});

test('a rotated bed corner can touch the ring while its center stays outside', () => {
    assert.ok(ringBoxContact(ring, makeBox('corner', '床板', [100, 0, 0], [35, 8, 3], 45)));
});

test('arm boxes use three dimensional overlap rather than their screen projection', () => {
    const a = makeBox('a', '臂', [0, 0, 0], [4, 4, 20]);
    assert.equal(boxesOverlap(a, makeBox('b', '床', [0, 0, 30], [5, 5, 5])), false);
    assert.equal(boxesOverlap(a, makeBox('c', '床', [0, 0, 21], [5, 5, 5])), true);
});

test('combined translation, independent lift and arm swing preserve all parameter values', () => {
    const initial = createModelScene(DEFAULT_PARAMETERS);
    const combined = createModelScene({ ...DEFAULT_PARAMETERS, x: 60, z: 70, arm: 30 });
    assert.ok(combined.ring.center[0] > initial.ring.center[0]);
    assert.ok(combined.ring.center[2] > initial.ring.center[2]);
    const rotated = createModelScene({ ...DEFAULT_PARAMETERS, ring: 65 });
    assert.deepEqual(rotated.ring.center, initial.ring.center);
    const raisedFurniture = createModelScene({ ...DEFAULT_PARAMETERS, chair: 90, bed: 90, yaw: 47 });
    assert.deepEqual(raisedFurniture.ring.center, initial.ring.center);
    assert.equal(raisedFurniture.boxes.find(b => b.id === 'bed-board').center[0], 580);
});

test('reference posture has no mock interference and lowered chair-side ring has named contacts', () => {
    assert.equal(createModelScene(DEFAULT_PARAMETERS).contacts.length, 0);
    const scene = createModelScene({ ...DEFAULT_PARAMETERS, x: 13, z: 20, chair: 60 });
    assert.ok(scene.contacts.some(contact => contact.ids.includes('ring') && contact.ids.some(id => id.startsWith('chair-'))));
    for (const contact of scene.contacts) assert.ok(contact.point.every(Number.isFinite));
});

test('independent lift leaves the rigid arms unchanged and can bring the ring to the floor', () => {
    const initial = createModelScene(DEFAULT_PARAMETERS);
    const lowered = createModelScene({ ...DEFAULT_PARAMETERS, z: 0, ring: 90 });
    assert.deepEqual(lowered.boxes.find(b => b.id === 'arm-0'), initial.boxes.find(b => b.id === 'arm-0'));
    assert.ok(lowered.contacts.some(c => c.ids.includes('floor')));
});

test('the legrest pivots at the fixed front of the seat and follows chair height', () => {
    const horizontal = createModelScene({ ...DEFAULT_PARAMETERS, leg: 0 });
    const down = createModelScene({ ...DEFAULT_PARAMETERS, leg: 90 });
    const part = horizontal.boxes.find(b => b.id === 'chair-legrest');
    const tilted = down.boxes.find(b => b.id === 'chair-legrest');
    assert.ok(part, 'Chair legrest must be included in the scene');
    assert.deepEqual(part.center, [18, 0, 71]);
    assert.ok(Math.abs(tilted.center[0] - 54) < 1e-7);
    assert.ok(Math.abs(tilted.center[2] - 35) < 1e-7);
    const raised = createModelScene({ ...DEFAULT_PARAMETERS, leg: 90, chair: 50 });
    assert.equal(raised.boxes.find(b => b.id === 'chair-legrest').center[2] - tilted.center[2], 20);
    assert.deepEqual(raised.ring.center, down.ring.center);
    assert.deepEqual(raised.boxes.find(b => b.id === 'chair-base'), down.boxes.find(b => b.id === 'chair-base'));
});

test('legrest inclination changes ring interference and the floor is checked separately', () => {
    const horizontal = createModelScene({ ...DEFAULT_PARAMETERS, x: 0, z: 0, leg: 0 });
    const down = createModelScene({ ...DEFAULT_PARAMETERS, x: 0, z: 0, leg: 90 });
    assert.ok(horizontal.contacts.some(c => c.ids.includes('ring') && c.ids.includes('chair-legrest')));
    assert.equal(down.contacts.some(c => c.ids.includes('ring') && c.ids.includes('chair-legrest')), false);
    assert.ok(down.contacts.some(c => c.ids.includes('chair-legrest') && c.ids.includes('floor')));
});

test('the fixed chair faces away from the bed after the 180 degree installation correction', () => {
    const scene = createModelScene({ ...DEFAULT_PARAMETERS, leg: 0 });
    assert.deepEqual(scene.boxes.find(b => b.id === 'chair-seat').center, [88, 0, 71]);
    assert.deepEqual(scene.boxes.find(b => b.id === 'chair-back').center, [123, 0, 99]);
    assert.deepEqual(scene.boxes.find(b => b.id === 'chair-column').center, [87.5, 0, 37.5]);
    assert.deepEqual(scene.boxes.find(b => b.id === 'chair-base').center, [87, 0, 4]);
    assert.deepEqual(scene.legPivot, [54, 0, 71]);
    const legrest = scene.boxes.find(b => b.id === 'chair-legrest');
    assert.equal(legrest.axes[0][0], -1);
    assert.equal(legrest.axes[1][1], -1);
});
