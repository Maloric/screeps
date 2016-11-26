export function ReportStep(creep: Creep) {
    let posKey = `${creep.pos.roomName}_${creep.pos.x}_${creep.pos.y}`;

    if (creep.memory.lastPos === posKey) {
        if (!creep.memory.ticksWithoutMoving) {
            creep.memory.ticksWithoutMoving = 0;
        }
        creep.memory.ticksWithoutMoving++;
        return;
    }

    creep.memory.lastPos = posKey;
    creep.memory.ticksWithoutMoving = 0;

    if (!Memory['paths']) {
        Memory['paths'] = {};
    }

    if (!Memory['paths'][posKey]) {
        Memory['paths'][posKey] = {
            room: creep.pos.roomName,
            x: creep.pos.x,
            y: creep.pos.y,
            count: 1
        };
    } else if (Memory['paths'][posKey]['count'] >= 0) {
        Memory['paths'][posKey]['count']++;
    }
}
