import { MoveTo } from '../util';
export function Idle(creep: Creep) {
    if (!creep.pos.inRangeTo(Game.flags['camp'].pos, 3)) {
        MoveTo(creep, Game.flags['camp']);
    }
};
