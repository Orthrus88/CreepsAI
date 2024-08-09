var helper = require('helper');

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
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

        if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
            creep.say('🚧 repair');
        }

        if (creep.memory.repairing) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });

            targets.sort((a, b) => a.hits - b.hits);

            // Prioritize ramparts and walls below a certain threshold
            var criticalTarget = targets.find(target => 
                (target.structureType == STRUCTURE_RAMPART && target.hits < 10000) || 
                (target.structureType == STRUCTURE_WALL && target.hits < 10000)
            );

            if (criticalTarget) {
                if (creep.repair(criticalTarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(criticalTarget, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else if (targets.length > 0) {
                var repairTarget = targets[0];
                if (creep.repair(repairTarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairTarget, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                // No structures to repair, move to idle location
                creep.moveTo(Game.flags['IdleFlag'], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else {
            var storage = creep.room.storage;
            if (storage && storage.store[RESOURCE_ENERGY] > 0) {
                if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            } else {
                helper.assignSource(creep);
                var source = Game.getObjectById(creep.memory.sourceId);
                if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        }
    }
};

module.exports = roleRepairer;