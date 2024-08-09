var roleDefender = {

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
        
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
            }
        } else {
            // Optionally, you can add code here for the defender to patrol or move to a specific location
            creep.moveTo(Game.flags.DefendFlag, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }
};

module.exports = roleDefender;
