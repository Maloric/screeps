export function Harvest(creep: Creep): Source {
    let target = <Source>creep.pos.findClosestByPath(FIND_SOURCES);
    if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
    return target;
}
