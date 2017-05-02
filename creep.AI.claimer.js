var BCF = require("creep.AI.basefunctions");
var upgraderAI = require("creep.AI.upgrader");
var transportAI = require("creep.AI.transport");
var builderAI = require("creep.AI.builder");


var claimer = function(creep){
    // creep.memory.transportType = "spawn";
    // creep.suicide();
    // return;
    //flag 1: rally point
    //flag 2: resource to use
    //flag 3: initial landing zone
    // creep.say("BIGDEV SUX");
    // creep.memory.resource = null;
    // creep.memory.resource = '6bb50772cca441b';
    creep.memory.travelTicks = 300;


    if(!creep.memory.test){
        creep.moveTo(Game.flags.Flag4);
        if(creep.room === Game.flags.Flag4.room){
            creep.memory.test = true;
        }
        return;
    }

    //all creeps go to flag3
    if(Game.flags.Flag3 != null){
        if(creep.room === Game.flags.Flag3.room){
            // creep.memory.resource = '6bb50772cca441b';
            //main process
            // creep.moveTo(Game.flags.Flag3);
            
            if(creep.memory.hasClaim == true)
                BCF.action(creep,creep.claimController,[creep.room.controller]);
            else{
                switch (creep.memory.state) {
                    case "Full":
                        // return builderAI(creep);
                        //var error  = creep.build(creep.memory.buildTarget);
                        // var spawns = creep.room.find(FIND_MY_SPAWNS);
                        // if(spawns.length > 0)
                        //     creep.memory.spawnID = creep.room.find(FIND_MY_SPAWNS)[0].id;
                        if(creep.room.controller && creep.room.controller.ticksToDowngrade < 500){
                            BCF.action(creep,creep.upgradeController,[creep.room.controller]);
                        }
                        
                        var sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
                        if(sites.length > 0){
                            creep.memory.buildTarget = creep.room.find(FIND_MY_CONSTRUCTION_SITES)[0].id;
                        }
                        else{
                            if(!Game.getObjectById(creep.memory.spawnID))
                                creep.memory.spawnID = creep.room.find(FIND_MY_SPAWNS)[0].id;

                            transportAI(creep);
                            return;
                        }
                        

                        BCF.action(creep,creep.build,[Game.getObjectById(creep.memory.buildTarget)]);
                        break;
                    case "Empty":
                        // var dropped = creep.pos.findInRange(FIND_DROPPED_ENERGY,3);
                        // if(dropped.length > 0){
                        //     BCF.action(creep,creep.pickup,[dropped[0]]);
                        //     return;
                        // }

                        var cont = _.filter(creep.pos.lookFor(LOOK_STRUCTURES),(s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0);

                        if(cont.length > 0){
                            BCF.action(creep,creep.withdraw,[cont[0],RESOURCE_ENERGY]);
                            return;
                        }

                        if(!creep.memory.resource){
                            creep.memory.resource = Game.flags.Flag2.pos.lookFor(LOOK_SOURCES)[0].id;
                        }
                        var s1 = BCF.action(creep,creep.harvest,[Game.getObjectById(creep.memory.resource),RESOURCE_ENERGY]);
                        break;
                }
            }
        }
        else{
            creep.moveTo(Game.flags.Flag3);
        }
    }

    else if(Game.flags.Flag1){
        creep.moveTo(Game.flags.Flag1);
    }

    
}

module.exports = claimer;