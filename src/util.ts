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
    if (creep.memory.ticksWithoutMoving > 0) {
        console.log(`${creep.name} may be stuck.  Recalculating path...`);
        // res = creep.moveTo(target);
        res = creep.move(Math.floor(Math.random() * 8));
    } else {
        let cacheKey = `${startKey}:${endKey}`;
        if (!Memory['routeCache'][cacheKey]) {
            let route = Game.rooms[start.roomName].findPath(start, end, {
                ignoreCreeps: true
            });
            let firstStep = route[0];
            Memory['routeCache'][cacheKey] = firstStep.direction;
        }

        res = creep.move(Memory['routeCache'][cacheKey]);
    }
    return res;
}
