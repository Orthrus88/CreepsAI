var roleRangedAttacker = {
    /** @param {Creep} creep **/
    run: function(creep) {
        const targetRoom = 'W37N44';

        // Move to the target room if not already there
        if (creep.room.name != targetRoom) {
            const exitDir = Game.map.findExit(creep.room, targetRoom);
            const exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffffff' } });
        } else {
            // Attack closest hostile creep with attack or ranged attack parts
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: (hostile) => hostile.getActiveBodyparts(ATTACK) > 0 || hostile.getActiveBodyparts(RANGED_ATTACK) > 0
            });

            if (target) {
                if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
                }
            } else {
                // Positioning near the energy source in open terrain for defense, at least 2 spaces away
                const terrain = Game.map.getRoomTerrain(targetRoom);
                const resource = creep.pos.findClosestByRange(FIND_SOURCES);

                if (resource) {
                    const openPositions = [];

                    // Find open terrain spots around the resource, ensuring at least 2 spaces distance
                    for (let x = resource.pos.x - 2; x <= resource.pos.x + 2; x++) {
                        for (let y = resource.pos.y - 2; y <= resource.pos.y + 2; y++) {
                            if ((Math.abs(x - resource.pos.x) > 1 || Math.abs(y - resource.pos.y) > 1) && terrain.get(x, y) !== TERRAIN_MASK_WALL) {
                                openPositions.push(new RoomPosition(x, y, targetRoom));
                            }
                        }
                    }

                    if (openPositions.length > 0) {
                        const closestOpenPos = creep.pos.findClosestByRange(openPositions);
                        if (closestOpenPos) {
                            creep.moveTo(closestOpenPos, { visualizePathStyle: { stroke: '#00ff00' } });
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleRangedAttacker;