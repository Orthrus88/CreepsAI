var roleHydrogenHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // Clear previous target resource to avoid conflicts
        delete creep.memory.targetResourceId;

        // If the creep is about to die, send it to recycle
        if (creep.ticksToLive < 50) {
            var spawn = Game.spawns['Spawn1'];
            if (creep.pos.isNearTo(spawn)) {
                creep.say('♻️ recycle');
                spawn.recycleCreep(creep);
                return; // Skip further actions
            } else {
                creep.say('🚶 to recycle');
                creep.moveTo(spawn, { visualizePathStyle: { stroke: '#ff0000' } });
                return; // Skip further actions
            }
        }

        // If the creep is in transferring state and out of energy, switch to harvesting
        if (creep.memory.transferring && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transferring = false;
            creep.say('🔄 harvest');
        }

        // If the creep is full, switch to transferring state
        if (!creep.memory.transferring && creep.store.getFreeCapacity() == 0) {
            creep.memory.transferring = true;
            creep.say('🚚 transfer');
        }

        // If the creep is in transferring state
        if (creep.memory.transferring) {
            var target = creep.room.storage || creep.room.terminal || creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: (structure) => structure.structureType == STRUCTURE_LAB &&
                                       structure.store.getFreeCapacity(RESOURCE_HYDROGEN) > 0
            });

            if (target) {
                if (creep.transfer(target, RESOURCE_HYDROGEN) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                } else {
                    creep.say('🔋 storing');
                }
            } else {
                // If no target is available, just wait in place
                creep.say('💤 idle');
                creep.moveTo(Game.flags['IdleFlag'] || creep.room.controller); // Move to a safe spot
            }
        } else {
            // Harvest from the extractor
            var extractor = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => structure.structureType == STRUCTURE_EXTRACTOR
            })[0];
            var mineral = extractor.pos.findInRange(FIND_MINERALS, 1)[0];

            if (mineral && creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
                creep.moveTo(mineral, { visualizePathStyle: { stroke: '#ffaa00' } });
                creep.say('⛏️ harvest');
            }
        }
    }
};

module.exports = roleHydrogenHarvester;