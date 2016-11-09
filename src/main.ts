import { Harvester, Upgrader, Builder, Archer, Serf, Distributor } from './roles/index';
import { Spawner } from './spawner';

module.exports.loop = () => {
    Spawner.autoSpawn();

    let tower = <StructureTower>Game.getObjectById('5819fe430de1de3555de348d');
    if (tower) {
        let closestHostile = <Creep>tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }

        if (tower.energy > tower.energyCapacity / 1.2) {
            let closestDamagedStructure = <Structure>tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure: any) => structure.hits < structure.hitsMax
            });
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        }
    }

    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        switch (creep.memory.role) {
            case 'harvester':
                Harvester.run(creep);
                break;
            case 'distributor':
                Distributor.run(creep);
                break;
            case 'serf':
                Serf.run(creep);
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
