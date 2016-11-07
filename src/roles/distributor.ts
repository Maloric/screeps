import { Recover, Distribute } from '../behaviours/index';
export class Distributor {
    static run(creep: Creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            Recover(creep);
        } else {
            Distribute(creep);
        }
    }
}
