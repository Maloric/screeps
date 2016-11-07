export class Harvester {
    static run(creep: Creep) {
        if (!creep.memory.target) {
            let sourceIds: string[] = _.map(creep.room.find(FIND_SOURCES), (s: Source) => s.id);
            let harvestersWithTargets = _.filter(_.values(Game.creeps), (c: Creep) => {
                return c.memory
                    && c.memory.role === 'harvester'
                    && c.memory.target;
            });
            let targets: string[] = _.map(harvestersWithTargets, (c: Creep) => <string>c.memory.target);
            let freeTargets = _.difference(sourceIds, targets);

            if (freeTargets && freeTargets.length > 0) {
                creep.memory.target = <string>freeTargets[0];
            }
        }

        if (creep.memory.target) {
            let target = creep.memory.target;
            if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else {
                creep.drop(RESOURCE_ENERGY, creep.carry.energy);
            }
        }
    }
}
