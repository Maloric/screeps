import { Harvester, Upgrader, Builder, Archer, Serf, Distributor, Healer } from './roles/index';
import { Spawner } from './spawner';

export function loop() {
    Memory['enoughEnergyInReserve'] = Spawner.isEnoughEnergyInReserve();
    Spawner.cleanup();
    let tower = <StructureTower>Game.getObjectById('5819fe430de1de3555de348d');
    if (tower) {
        let closestHostile = <Creep>tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }

        if (tower.energy > tower.energyCapacity * 0.85) {
            let closestDamagedStructure = <Structure>tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure: any) => structure.hits < structure.hitsMax
            });
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        }
    }

    let creepRoster: any = {};
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        let role = creep.memory.role;
        if (!creepRoster[role]) {
            creepRoster[role] = [];
        }
        creepRoster[role].push(creep.name);
        switch (role) {
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
            case 'healer':
                Healer.run(creep);
                break;
            default:
                console.warn(`Invalid creep role on ${name}: ${creep.memory.role}`);
        }
    }
    Memory['roster'] = creepRoster;
    Spawner.autoSpawn();
};
