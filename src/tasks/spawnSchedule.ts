import { Spawner } from '../spawner';

export class SpawnSchedule implements Task {
    name: string = 'SPAWN_SCHEDULE';

    interval: number = 10;

    run(): void {
        Spawner.autoSpawn();
    }
}
