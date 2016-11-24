import { Recover, Distribute } from '../behaviours/index';
export class Distributor {
    static run(creep: Creep) {
        if (creep.carry.energy > 0) {
            Distribute(creep);
        } else {
            Recover(creep);
        }
    }
}
