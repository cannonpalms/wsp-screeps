//Creep Types
var builderAI = require("creep.AI.builder");
var claimerAI = require("creep.AI.claimer");
var defenderAI = require("creep.AI.defender");
var explorerAI = require("creep.AI.explorer");
var harvesterAI = require("creep.AI.harvester");
var transportAI = require("creep.AI.transport");
var upgraderAI = require("creep.AI.upgrader");
var reserverAI = require("creep.AI.reserver");
var upgradeTransportAI = require("creep.AI.upgradeTransport");

var BCF = require("creep.AI.basefunctions");

var creepAI = {
    //Decides how a creep will act
    run: function(creep) {

        // var start = Game.cpu.getUsed();
        validateCreepState(creep);

        if(creep.spawning){
            creep.memory.travelTicks++;
        }
        else{
            if(!this[creep.memory.creepType]){
                console.log('ERR: ' + creep.memory.creepType);
            }
            else
                this[creep.memory.creepType](creep);
        }

        // if(!global.test[creep.memory.creepType])
        //     global.test[creep.memory.creepType] = 0;

        // global.test[creep.memory.creepType] += Game.cpu.getUsed() - start;
    }
    ,upgrader: upgraderAI
    ,transport: transportAI    
    ,upgradeTransport: upgradeTransportAI    
    ,harvester: harvesterAI    
    ,claimer: claimerAI
    ,controlClaimer: claimerAI
    ,defender: defenderAI
    ,drainer: function(creep){
        var damaged = creep.hitsMax - creep.hits;
        creep.memory.travelTicks = 100;

        // console.log(!damaged);

        if(!creep.memory.test){
            creep.moveTo(Game.flags.Flag4);
            if(creep.room === Game.flags.Flag4.room){
                creep.memory.test = true;
                return
            }
            return
        }

        //if undamaged
        if(!damaged){
            //goto drain room (flag 1)
            //update oneStep
            if(creep.room !== Game.flags.Flag6.room){
                creep.moveTo(Game.flags.Flag6);
            }
            creep.moveTo(Game.flags.Flag6);
            creep.memory.oneStep = true;
        }
        else{
            creep.heal(creep);
            if(creep.room !== Game.flags.Flag8.room){
                creep.moveTo(Game.flags.Flag8);
            }
            else if(creep.memory.oneStep){
                var center = new RoomPosition(25, 25, Game.flags.Flag8.room.name);
                creep.moveTo(center);
                creep.memory.oneStep = false;
            }

        }
        //if damaged
            //heal self
            //if oneStep
                //take one step to center of the safe room (flagged)
    }
    ,builder: builderAI
    ,explorer: function(creep){

        //if undamaged
            //goto drain room (flag 1)
            //update oneStep
        //if damaged
            //heal self
            //if oneStep
                //take one step to center of the safe room (flagged)


        creep.moveTo(Game.flags.Flag1);
        // creep.signController(creep.room.controller,"(╯°□°）╯︵ ┻━┻)");

    }
    ,remoteHarvester: harvesterAI
    ,remoteTransport: transportAI
    ,reserver: reserverAI
    ,scavenger: function(creep){
        switch (creep.memory.state) {
            case "Empty":
                BCF.action(creep,creep.transfer,[Game.getObjectById('59e4073df11a399'),RESOURCE_ENERGY]);
                return;
                var dropped = creep.pos.findInRange(FIND_DROPPED_ENERGY,3);
                if(dropped.length > 0){
                    BCF.action(creep,creep.pickup,[dropped[0]]);
                    return;
                }
                break;
            case "Full":
                BCF.action(creep,creep.transfer,[Game.getObjectById(creep.memory.spawnID),RESOURCE_ENERGY]);
                break;
        return;

        }
    }
    ,thief: function(creep){
        switch (creep.memory.state) {
            case "Empty":
                if(creep.room === Game.flags.goodz.room){
                    var lookContainerArray = Game.flags.goodz.pos.lookFor(LOOK_STRUCTURES);
                    if(lookContainerArray.length){
                        //look for stuff in the container
                        //withdraw stuff
                        retVal = BCF.action(creep,creep.withdraw,[lookContainerArray[0],RESOURCE_ENERGY]);
                    }
                }
                else{
                    creep.moveTo(Game.flags.goodz);
                }
                break;
            case "Full":
                //todo make work for other creep types
                var homeRoom = Game.rooms[creep.memory.homeRoom];
                if(homeRoom){
                    var storageBig = Game.getObjectById(homeRoom.memory.storageBig);
                    var storageSmall = Game.getObjectById(homeRoom.memory.storageSmall);
                    var mainStore = storageBig || storageSmall;
                    
                    BCF.action(creep,creep.transfer,[mainStore,RESOURCE_ENERGY]);
                }
                break;
        }

    }
    ,humanControl3: function(creep){
        creep.memory.travelTicks = 100;  
         if(false){
            creep.moveTo(Game.flags.Flag1);
        }
        
        // creep.memory.test = true;

        if(!creep.memory.test){
            creep.moveTo(Game.flags.Flag4);
            if(creep.room === Game.flags.Flag4.room){
                creep.memory.test = true;
                return
            }
            return
        }
        else{
            // creep.memory.attack = '22a3f8a8d44de89';
            // creep.memory.attack = null;
            

            if(creep.room === Game.flags.Flag6.room){

                badies = _.filter(Game.flags.Flag6.pos.lookFor(LOOK_STRUCTURES));

                if(badies.length > 0){
                    BCF.action(creep,creep.dismantle,[badies[0]]);
                    return;
                }

                badies = _.filter(Game.flags.Flag7.pos.lookFor(LOOK_STRUCTURES));

                if(badies.length > 0){
                    BCF.action(creep,creep.dismantle,[badies[0]]);
                    return;
                }
                else
                    if(creep.room.controller && (!creep.room.controller.sign || creep.room.controller.sign.username !== 'Jmeigs')){
                        BCF.action(creep,creep.signController,[creep.room.controller,'Here lies Mark Davis. RIP!']);

                    }
                    else
                        creep.moveTo(Game.flags.Flag6);
            }
            else    
                creep.moveTo(Game.flags.Flag6);
                
        }
    }
    ,humanControl2:function(creep){
        creep.memory.travelTicks = 100;        
        if(creep.room !== Game.flags.Flag6.room){
            return this.humanControl(creep);
        }
        // BCF.action(creep,creep.heal,[creep]);
        // return;

        // console.log(creep.room.find(FIND_MY_CREEPS));

        var damCreep = _.filter((creep.room.find(FIND_MY_CREEPS)),(creep) => creep.hits < creep.hitsMax);

        if(damCreep.length > 0){
            BCF.action(creep,creep.heal,[damCreep[0]]);
            creep.moveTo(damCreep[0]);
        }
        else
            creep.moveTo(Game.flags.Flag8);

    }
    ,humanControl: function(creep){
        // creep.say("ERP RULEZ",true);
        creep.memory.travelTicks = 100;

        if(false){
            creep.moveTo(Game.flags.Flag1);
            return
        }
        
        // creep.memory.test = false;

        if(!creep.memory.test){
            creep.moveTo(Game.flags.Flag4);
            if(creep.room === Game.flags.Flag4.room){
                creep.memory.test = true;
                return
            }
            return
        }
        else{
            // creep.memory.attack = '22a3f8a8d44de89';
            // creep.memory.attack = null;
            

            if(creep.room === Game.flags.Flag6.room){



                badies = _.filter(Game.flags.Flag6.pos.lookFor(LOOK_STRUCTURES));

                if(badies.length > 0){
                    BCF.action(creep,creep.attack,[badies[0]]);
                    creep.moveTo(badies[0]);
                    return;
                }
                
                var baddie = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(baddie){
                    BCF.action(creep,creep.attack,[baddie],{maxRooms:1}); 
                    creep.moveTo(baddie);
                    return;
                }

                var baddie = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,{
                    // filter: { structureType: STRUCTURE_EXTENSION}
                    filter: function(structure){
                        return structure.structureType === STRUCTURE_SPAWN;
                    }
                    
                });
                if(baddie){
                    BCF.action(creep,creep.attack,[baddie],{maxRooms:1});  
                    return;
                }

                if(!creep.room.controller.sign || creep.room.controller.sign.username !== 'Jmeigs')
                    BCF.action(creep,creep.signController,[creep.room.controller,"FOR HIEU"]);
            }
            else{
                creep.moveTo(Game.flags.Flag6);
                
                    
            }

        //     if(!creep.room.controller.sign || creep.room.controller.sign.username !== 'Jmeigs')
        //         BCF.action(creep,creep.signController,[creep.room.controller,"FOR HIEU"]);
        }
    }

}

function validateCreepState(creep){
    if(creep.carry.energy == creep.carryCapacity){
        creep.memory.state = "Full";
    }
    else if(creep.carry.energy == 0){
        creep.memory.state = "Empty";        
    }

    if(!creep.memory.travelTicks){
        creep.memory.travelTicks = 0;
    }
}

module.exports = creepAI