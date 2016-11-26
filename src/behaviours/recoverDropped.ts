import { MoveTo } from '../util';
import { Cache } from '../cacheHelper';
export function RecoverDropped(creep: Creep): boolean {
    let cacheKey = `${creep.room.name}_droppedEnergy`;
    let droppedEnergy = Cache.get(
        cacheKey,
        () => {
            return creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, {
                filter: (x: any) => {
                    return x.energy > 1000;
                }
            });
        }
    );

    if (!droppedEnergy) {
        let arrDropped = creep.pos.findInRange(FIND_DROPPED_ENERGY, 10);
        if (arrDropped.length > 0) {
            droppedEnergy = arrDropped[0];
        }
    }

    if (!!droppedEnergy) {
        if (creep.pickup(<Resource>droppedEnergy) === ERR_NOT_IN_RANGE) {
            MoveTo(creep, <Resource>droppedEnergy);
        }
        return true;
    }

    return false;
}
