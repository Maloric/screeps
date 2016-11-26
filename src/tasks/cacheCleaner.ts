export class CacheCleaner implements Task {
    name: string = 'CACHE_CLEANER';

    interval: number = 5;

    run(): void {
        Memory['cache'] = {};

        // TODO: fix this
        // Memory['routeCache'] = _.pickBy(Memory['routeCache'], (x) => {
        //     return Game.time - x < 1000;
        // });
    }
}
