export class RoadBuilder implements Task {

    name: string = "ROAD_BUILDER";

    interval: number = 200;

    run(): void {
        let highPriorityPaths = _.filter(Memory['paths'], (path: any) => {
            return path.count > 10;
        });

        let sorted = _.sortBy(highPriorityPaths, (path: any) => {
            return 0 - path.count;
        });

        let top3 = _.take(sorted, 3);

        _.each(top3, (path) => {
            console.log(path.x, path.y, path.room);
            let pos = new RoomPosition(path.x, path.y, path.room);
            let res = pos.createConstructionSite(STRUCTURE_ROAD);

            let posKey = `${path.room}_${path.x}_${path.y}`;
            if (res === OK) {
                console.log(`Building road at ${posKey}`);
            } else {
                console.log(`Cannot build road at ${posKey}: ${res}`);
            }
            console.log(posKey);
            Memory['paths'][posKey].count = -1;
        })
    }
};
