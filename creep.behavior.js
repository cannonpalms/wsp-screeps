var creepAI = {
    //Core creep ai with branching to specific roles
    run: function(creep) {

        switch (creep.memory.state) {
            case "Empty":
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[creep.memory.resource]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[creep.memory.resource]);
                    creep.say("Moving");
                }

                else if(creep.carry.energy < creep.carryCapacity) {
                    creep.harvest(sources[creep.memory.resource]);
                    creep.say("Harvesting");
                }

                else if(creep.carry.energy >= creep.carryCapacity) {
                    creep.memory.state = "Full";
                }

                else{
                    creep.memory.state = "Full"
                }
                break;
            case "Full":
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                    creep.say("Moving");
                }
                else if (creep.carry.energy > 0){
                    creep.upgradeController(creep.room.controller);
                    creep.say("Upgrading")
                }
                else if (creep.carry.energy == 0){
                    creep.memory.state = "Empty"                    
                }
                else{
                    creep.memory.state = "Empty"
                }
                break;
            default:
                console.log("Error");
                break;
        }
    }
}

var creepType = {
    //Contains functions for different types of creep behavior
}


module.exports = creepAI