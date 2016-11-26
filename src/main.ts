import { Harvester, Upgrader, Builder, Archer, Serf, Distributor, Healer } from './roles/index';
import { Spawner } from './spawner';
import { ReportStep } from './behaviours';
import { Scheduler } from './scheduler';
import { RoadBuilder, CacheCleaner, SpawnSchedule } from './tasks';
import { RunTowers } from './towers';

const profiler = require('screeps-profiler');
// profiler.enable();

let scheduler = new Scheduler();
scheduler.schedule(new RoadBuilder());
scheduler.schedule(new CacheCleaner());
scheduler.schedule(new SpawnSchedule());
export function loop() {
    profiler.wrap(function() {
        Spawner.cleanup();

        for (let roomName in Game.rooms) {
            RunTowers(roomName);
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
                    console.log(`Invalid creep role on ${name}: ${creep.memory.role}`);
            }
            ReportStep(creep);
        }
        scheduler.tick();
        Memory['roster'] = creepRoster;
    });
};

