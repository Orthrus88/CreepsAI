var roleTower = {
    /** @param {StructureTower} tower **/
    run: function(tower) {
        // Find the closest hostile creep
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        
        // If there's a hostile creep, attack it
        if (closestHostile) {
            tower.attack(closestHostile);
        }
        // No other actions; the tower will only attack hostiles
    }
};

module.exports = roleTower;