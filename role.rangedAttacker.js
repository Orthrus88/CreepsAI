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
            // Attack the closest hostile creep
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

            if (target) {
                if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
                }
            } else {
                // Patrol around the energy sources in the room
                const sources = creep.room.find(FIND_SOURCES);
                if (sources.length > 0) {
                    const source = sources[0];
                    const terrain = creep.room.getTerrain();
                    const openPositions = [];

                    // Find open terrain spots around the resource, ensuring at least 2 spaces distance
                    for (let x = source.pos.x - 3; x <= source.pos.x + 3; x++) {
                        for (let y = source.pos.y - 3; y <= source.pos.y + 3; y++) {
                            if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
                                openPositions.push(new RoomPosition(x, y, targetRoom));
                            }
                        }
                    }

                    if (openPositions.length > 0) {
                        const patrolPosition = creep.pos.findClosestByRange(openPositions);
                        if (patrolPosition) {
                            creep.moveTo(patrolPosition, { visualizePathStyle: { stroke: '#00ff00' } });
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleRangedAttacker;