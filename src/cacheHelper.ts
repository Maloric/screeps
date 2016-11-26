export class Cache {
    static get(cacheKey: string, dataFn: any = null): any {
        let res = Memory['cache'][cacheKey];
        if (!res) {
            if (dataFn !== null) {
                res = dataFn();
                if (res && res.id) {
                    res = res.id;
                } else if (res && res.map && res[0] && res[0].id) {
                    res = res.map((x: any) => x.id);
                }

                Memory['cache'][cacheKey] = res;
            } else {
                console.log(`Error caching ${cacheKey}.  No dataFn defined.`);
            }
        }

        if (res && res.map) {
            res = res.map((x: any) => Game.getObjectById(x));
        } else {
            res = Game.getObjectById(res);
        }
        return res;
    }
}
