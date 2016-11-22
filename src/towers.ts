export function RunTowers(roomName: string) {
    var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
    for (let i = 0; i < towers.length; i++) {
        let tower = <StructureTower>towers[i];
        let closestHostile = <Creep>tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        } else {
            let crumblingWalls = tower.room.find(FIND_STRUCTURES, {
                filter: (structure: Structure) => {
                    return structure.structureType === STRUCTURE_WALL
                        && ((structure.hits < 50000) && (structure.hits > 0));
                }
            });

            if (crumblingWalls.length > 0) {
                let target = <Structure>_.sortBy(crumblingWalls, (wall: Structure) => {
                    return wall.hits;
                })[0];
                tower.repair(target);
            } else if (tower.energy > tower.energyCapacity * 0.85) {
                let closestDamagedStructure = <Structure>tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure: any) => structure.hits < structure.hitsMax
                });
                if (closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
            }
        }
    }
}
