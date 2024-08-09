var roleExplorer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.ticksToLive < 50) {
            var spawn = Game.spawns['Spawn1'];
            if (creep.pos.isNearTo(spawn)) {
                spawn.recycleCreep(creep);
                return; // Skip further actions
            } else {
                creep.moveTo(spawn, { visualizePathStyle: { stroke: '#ff0000' } });
                return; // Skip further actions
            }
        }
        
        // Initialize memory if not already set
        if (!creep.memory.exploredRooms) {
            creep.memory.exploredRooms = [];
        }

        // Auto-assign a new target room if needed
        if (!creep.memory.target || creep.memory.exploredRooms.includes(creep.memory.target)) {
            let newTarget = this.findNewTarget(creep);
            if (newTarget) {
                creep.memory.target = newTarget;
                creep.say(`🚀 to ${newTarget}`);
            } else {
                return;
            }
        }

        // Move to target room to explore
        if (creep.room.name != creep.memory.target) {
            var exit = creep.room.findExitTo(creep.memory.target);
            if (exit !== ERR_NO_PATH) {
                var exitPos = creep.pos.findClosestByRange(exit);
                // Check for obstacles at the exit position
                var look = creep.room.lookAt(exitPos);
                var isObstacle = look.some(item => item.type === LOOK_STRUCTURES && item.structure.structureType === STRUCTURE_WALL);
                
                if (!isObstacle) {
                    creep.moveTo(exitPos, { visualizePathStyle: { stroke: '#ffaa00' } });
                } else {
                    // Find an alternative path or take a different action
                    this.findAlternativeExit(creep);
                }
            } else {
                // Try to find another target room
                let newTarget = this.findNewTarget(creep);
                if (newTarget) {
                    creep.memory.target = newTarget;
                    creep.say(`🚀 to ${newTarget}`);
                }
            }
        } else {
            // Explore the room
            creep.memory.exploredRooms.push(creep.room.name);
            creep.memory.target = null; // Clear target to find a new one
        }
    },

    /** @param {Creep} creep **/
    findNewTarget: function(creep) {
        let exploredRooms = creep.memory.exploredRooms;
        let exits = Game.map.describeExits(creep.room.name);

        if (!exits) {
            return undefined;
        }

        for (let dir in exits) {
            let roomName = exits[dir];
            if (!exploredRooms.includes(roomName)) {
                return roomName;
            }
        }

        // If all neighboring rooms are explored, return undefined
        return undefined;
    },

    /** @param {Creep} creep **/
    findAlternativeExit: function(creep) {
        let exits = Game.map.describeExits(creep.room.name);
        if (!exits) {
            return;
        }

        for (let dir in exits) {
            let roomName = exits[dir];
            if (roomName !== creep.memory.target) {
                var exit = creep.room.findExitTo(roomName);
                if (exit !== ERR_NO_PATH) {
                    var exitPos = creep.pos.findClosestByRange(exit);
                    var look = creep.room.lookAt(exitPos);
                    var isObstacle = look.some(item => item.type === LOOK_STRUCTURES && item.structure.structureType === STRUCTURE_WALL);

                    if (!isObstacle) {
                        creep.moveTo(exitPos, { visualizePathStyle: { stroke: '#ffaa00' } });
                        return;
                    }
                }
            }
        }

    }
};

module.exports = roleExplorer;
