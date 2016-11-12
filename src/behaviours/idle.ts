export function Idle(creep: Creep) {
    if (!creep.pos.inRangeTo(Game.flags['camp'].pos, 3)) {
        creep.moveTo(Game.flags['camp']);
    }
};
