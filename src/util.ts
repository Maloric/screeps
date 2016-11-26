export function GetPositionByDirection(pos: RoomPosition, direction: number): RoomPosition {
    // TODO: Handle the case where the room changes
    let newPos = pos;
    switch (direction) {
        case (TOP_LEFT):
            newPos.y--;
            newPos.x--;
            break;
        case (TOP):
            newPos.y--;
            break;
        case (TOP_RIGHT):
            newPos.y--;
            newPos.x++;
            break;
        case (LEFT):
            newPos.x--;
            break;
        case (RIGHT):
            newPos.x++;
            break;
        case (BOTTOM_LEFT):
            newPos.y++;
            newPos.x--;
            break;
        case (BOTTOM):
            newPos.y++;
            break;
        case (BOTTOM_RIGHT):
            newPos.y++;
            newPos.x++;
            break;
    }

    return newPos;
}


export function MoveTo(creep: Creep, target: any): number {
    function CalculateRoute(cacheKey: string, start: RoomPosition, end: RoomPosition) {
        let route = Game.rooms[start.roomName].findPath(start, end, {
            ignoreCreeps: true
        });
        let firstStep = route[0];
        Memory['routeCache'][cacheKey] = {
            createdAt: Game.time,
            direction: firstStep.direction
        };
    }

    if (!Memory['routeCache']) {
        Memory['routeCache'] = {};
    }
    let start = creep.pos;
    let end = target;

    if (!!target.pos) {
        end = target.pos;
    }

    let startKey = `${start.roomName}_${start.x}_${start.y}`;
    let endKey = `${end.roomName}_${end.x}_${end.y}`;

    let res: number;

    let cacheKey = `${startKey}:${endKey}`;
    if (!Memory['routeCache'][cacheKey]) {
        CalculateRoute(cacheKey, start, end);
    }

    let direction = Memory['routeCache'][cacheKey].direction;

    let nextPos = GetPositionByDirection(creep.pos, direction);
    let blockingStructures = nextPos.lookFor(LOOK_STRUCTURES);
    let blockingConstructions = nextPos.lookFor(LOOK_CONSTRUCTION_SITES);
    let blockingCreeps = nextPos.lookFor(LOOK_CREEPS);

    blockingStructures = _.reject(blockingStructures, (x: Structure) => {
        return x.structureType !== STRUCTURE_ROAD;
    });

    if (blockingStructures.length > 0 || blockingConstructions.length > 0) {
        creep.say(`Recalculating path`);
        delete Memory['routeCache'][cacheKey];
        CalculateRoute(cacheKey, start, end);
        res = creep.move(Memory['routeCache'][cacheKey].direction);
    } else {
        if (blockingCreeps.length > 0) {
            res = creep.move(Math.floor(Math.random() * 8));
        } else {
            res = creep.move(Memory['routeCache'][cacheKey].direction);
        }
    }

    return res;
}
