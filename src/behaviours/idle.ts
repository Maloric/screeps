export function Idle(creep: Creep) {
    if (!creep.pos.inRangeTo(Game.flags['camp'].pos, 5)) {
        creep.moveTo(Game.flags['camp']);
    }
};
