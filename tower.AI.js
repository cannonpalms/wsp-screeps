var towerAI = {
    run: function(tower){
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        if(closestHostile) {
            tower.attack(closestHostile);
            return;
        }
        var woundedCreeps = tower.room.find( FIND_MY_CREEPS, { filter: (creep) => {return ( creep.hits < creep.hitsMax ); } } );

        if(woundedCreeps){
            tower.heal(woundedCreeps[0]);
        }

    }
}

module.exports = towerAI