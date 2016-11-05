import { Harvester, Upgrader, Builder, Archer } from './roles/index';
import { Spawner } from './spawner';
module.exports.loop = () => {
    Spawner.autoSpawn();
    let tower = Game.getObjectById('5819fe430de1de3555de348d');
    if (tower) {
        let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
        let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        switch (creep.memory.role) {
            case 'harvester':
            case 'serf':
                Harvester.run(creep);
                break;
            case 'upgrader':
                Upgrader.run(creep);
                break;
            case 'builder':
                Builder.run(creep);
                break;
            case 'archer':
                Archer.run(creep);
                break;
            default:
                console.warn(`Invalid creep role on ${name}: ${creep.memory.role}`);
        }
    }
};
