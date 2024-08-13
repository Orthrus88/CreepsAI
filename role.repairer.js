var helper = require('helper');

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // Recycle if the creep is near the end of its life
        if (creep.ticksToLive < 50) {
            var spawn = Game.spawns['Spawn1'];
            if (creep.pos.isNearTo(spawn)) {
                creep.say('♻️ recycle');
                spawn.recycleCreep(creep);
                return;
            } else {
                creep.say('🚶 to recycle');
                creep.moveTo(spawn, { visualizePathStyle: { stroke: '#ff0000' } });
                return;
            }
        }

        // Switch between harvesting and repairing states
        if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
            creep.say('🚧 repair');
        }

        if (creep.memory.repairing) {
            let target;

            // Check if the creep already has a target structure
            if (creep.memory.repairTargetId) {
                target = Game.getObjectById(creep.memory.repairTargetId);
            }

            if (!target || target.hits >= target.hitsMax) {
                // Prioritize critical structures that are close to decaying
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });

                targets.sort((a, b) => a.hits - b.hits);

                target = targets.find(target => 
                    (target.structureType == STRUCTURE_RAMPART && target.hits < 5000) || 
                    (target.structureType == STRUCTURE_WALL && target.hits < 5000) ||
                    (target.structureType == STRUCTURE_ROAD && target.hits < target.hitsMax * 0.5)
                );

                if (!target && targets.length > 0) {
                    target = targets[0];
                }

                if (target) {
                    creep.memory.repairTargetId = target.id;
                }
            }

            if (target) {
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                // No structures to repair, move to idle location
                delete creep.memory.repairTargetId;
                var idleFlag = Game.flags['IdleFlag'];
                if (idleFlag) {
                    creep.moveTo(idleFlag, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        } else {
            // Harvest energy from storage or source
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