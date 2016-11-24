export class CacheCleaner implements Task {
    name: string = 'CACHE_CLEANER';

    interval: number = 5;

    run(): void {
        Memory['cache'] = {};
    }
}
