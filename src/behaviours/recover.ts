import { MoveTo } from '../util';
import { RecoverDropped } from './recoverDropped';
export function Recover(creep: Creep) {
    let harvesters: string[] = Memory['roster']['harvester'];

    let needyHarvesters = _.filter(harvesters, (h) => Game.creeps[h].memory['distributors'].length === 0);
    let greedyHarvesters = _.filter(harvesters, (h) => Game.creeps[h].memory['distributors'].length > 1);

    if (needyHarvesters.length > 0 && greedyHarvesters.length > 0) {
        let surplus: string[] = Game.creeps[greedyHarvesters[0]].memory.distributors;
        let reassigned: string = _.takeRight(surplus)[0];
        delete Game.creeps[reassigned].memory.harvester;
    }

    if (creep.memory.harvester && creep.carry.energy < creep.carryCapacity) {
        let h = <Creep>Game.creeps[creep.memory.harvester];
        if (!h) {
            delete creep.memory.harvester;
            console.log('Removed stale harvester from ' + creep.name);
            return;
        }

        if (!RecoverDropped(creep)) {
            if (creep.pos.getRangeTo(h) > 1) {
                MoveTo(creep, h);
                return;
            }
        }

        h.transfer(creep, RESOURCE_ENERGY);
    } else if (!creep.memory.harvester) {
        if (!harvesters || harvesters.length === 0) {
            console.log('No harvesters to assign ' + creep.name + ' to.');
            return;
        }

        let sorted = _.sortBy(harvesters, (h: string) => {
            let harvester = Game.creeps[h];
            if (!harvester.memory.distributors) {
                harvester.memory.distributors = [];
            }
            return harvester.memory.distributors.length;
        });

        creep.memory.harvester = sorted[0];
        Game.creeps[sorted[0]].memory.distributors.push(creep.name);
    }
}
