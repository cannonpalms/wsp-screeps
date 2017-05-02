var creepSpecs = require("creep.specs");

var spawnAI = {
    //Decides what to build at a spawn

    run: function(spawn){
        return true;
    },

    trySpawn: function(spawn,creepType,memoryVars,baseOnly,buildFunctionArgs = null){
        //get body parts from creep type and spawn max energy
        if(spawn.spawning != null)
            return false;
        var bodyParts = new Array(50);
        if(buildFunctionArgs){
            console.log('test');
        }
        bodyParts = getBodyParts(spawn,creepType,baseOnly);
        
        if(bodyParts && spawn.canCreateCreep(bodyParts) == OK){
            spawn.createCreep(_.sortBy(bodyParts,(part) => BODYPART_COST[part])
                                ,null
                                ,memoryVars);

            console.log("Creating creep of type: " + creepType);

            if(!spawn.room.memory.creepSize)
                spawn.room.memory.creepSize = {};

            spawn.room.memory.creepSize[creepType] = _.countBy(bodyParts);

            return true;
        }
        else{
            spawn.room.memory.spawning = true;
            return false;
        }
    }
}

function getBodyParts(spawn,creepType,baseOnly){
    //need to break this out more
    //many metrics are more usfully measured in body parts than creeps

    var attributes = creepSpecs[creepType];

    var totalCost = 0;
    totalCost += attributes.bodyBaseCost;

    var retVal = new Array();
    retVal = retVal.concat(attributes.bodyBase);

    if(!baseOnly){
        for(var i = 0; i < attributes.bodyGoal.length;i++){

            totalCost = totalCost + BODYPART_COST[attributes.bodyGoal[i]];

            if(totalCost > spawn.room.energyCapacityAvailable){
                return retVal;
            }
            else{
                var part = attributes.bodyGoal[i];
                var val = retVal.push(part);
            }
        }
    }
    
    return retVal;
}

module.exports = spawnAI