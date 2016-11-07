import { Harvest, Distribute } from '../behaviours/index';
export class Serf {
    static run(creep: Creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            Harvest(creep);
        }
        else {
            Distribute(creep);
        }
    }
}

