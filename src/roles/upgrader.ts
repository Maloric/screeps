import { MoveTo } from '../util';
import { CheckoutEnergy } from '../behaviours/index';
export class Upgrader {
    static run(creep: Creep) {
        if (creep.memory.upgrading && creep.carry.energy === 0) {
            creep.memory.upgrading = false;
            creep.say('getting energy');
        } else if (!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('upgrading');
        }

        if (creep.memory.upgrading && creep.room.controller) {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                MoveTo(creep, creep.room.controller);
            }
        } else {
            CheckoutEnergy(creep);
        }
    }
}
