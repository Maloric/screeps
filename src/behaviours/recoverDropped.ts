import { MoveTo } from '../util';
export function RecoverDropped(creep: Creep): boolean {
    let droppedEnergy = _.sortBy(creep.room.find(FIND_DROPPED_ENERGY, {
        filter: (x: any) => {
            return x.energy > 1000;
        }
    }), (x: any) => {
        return 0 - x.energy;
    });

    if (droppedEnergy.length === 0) {
        droppedEnergy = creep.pos.findInRange(FIND_DROPPED_ENERGY, 10);
    }

    if (droppedEnergy.length) {
        if (creep.pickup(<Resource>droppedEnergy[0]) === ERR_NOT_IN_RANGE) {
            MoveTo(creep, <Resource>droppedEnergy[0]);
        }
        return true;
    }

    return false;
}
