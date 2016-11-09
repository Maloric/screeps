export function Recover(creep: Creep) {
    if (creep.memory.harvester && creep.carry.energy < creep.carryCapacity) {
        let h = <Creep>Game.creeps[creep.memory.harvester];
        if (!h) {
            delete creep.memory.harvester;
            console.log('Removed stale harvester from ' + creep.name);
            return;
        }

        if (creep.pos.getRangeTo(h) > 1) {
            creep.moveTo(h);
            return;
        }

        let droppedEnergy = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1);
        if (droppedEnergy.length) {
            creep.pickup(<Resource>droppedEnergy[0]);
        }

        h.transfer(creep, RESOURCE_ENERGY);
    } else if (!creep.memory.harvester) {
        let harvesters = _.filter(Game.creeps, (c: Creep) => {
            return c.memory.role === 'harvester';
        });

        if (harvesters.length === 0) {
            console.log('No harvesters to assign ' + creep.name + ' to.');
            return;
        }

        let sorted = _.sortBy(harvesters, (h: Creep) => {
            if (!h.memory.distributors) {
                h.memory.distributors = [];
            }
            return h.memory.distributors.length;
        });

        creep.memory.harvester = sorted[0].name;
        sorted[0].memory.distributors.push(creep.name);
    }
}
