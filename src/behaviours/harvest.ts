export function Harvest(creep: Creep): Source {
    let target = <Source>creep.pos.findClosestByPath(FIND_SOURCES);
    // let target = <Source>creep.room.find(FIND_SOURCES)[1];
    if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
    return target;
}
