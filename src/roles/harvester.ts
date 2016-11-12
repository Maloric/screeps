import { Harvest } from '../behaviours';
export class Harvester {
    static run(creep: Creep) {
        Harvest(creep);
    }
}
