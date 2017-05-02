var BCF = require("creep.AI.basefunctions");
var transportAI = require("creep.AI.transport");
var upgraderAI = require("creep.AI.upgrader");


var builder = function(creep){

    // if(creep.carry.energy !== 0){
    //     creep.memory.state = "Full";
    // }

    // creep.memory.buildTarget = '07774b09836269b';

    var storageBig = Game.getObjectById(creep.room.memory.storageBig);
    var storageSmall = Game.getObjectById(creep.room.memory.storageSmall);

    var carryParts = _.filter(creep.body,(part) => part.type === CARRY);

    if(storageBig && storageSmall){
        if(_.sum(storageSmall.store)){
            //check for full
            if(_.sum(creep.carry) !== 0){
                for(var mineralIndex in creep.carry){
                    if(creep.carry[mineralIndex] === 0)
                        continue; 

                    retVal = BCF.action(creep,creep.transfer,[storageBig,mineralIndex]);
                    if(retVal !== OK){
                        break;
                    }
                }
                return; 
            }

            if(storageSmall.store){
                for(var mineralIndex in storageSmall.store){
                    retVal = BCF.action(creep,creep.withdraw,[storageSmall,mineralIndex]);
                    if(retVal !== OK)
                        break;
                }
                return;
            }

        }
    }

    var mainStore = storageBig || storageSmall;

    var mineralsCarried = _.filter(Object.keys(creep.carry),(item) => item !== RESOURCE_ENERGY);

    if(mineralsCarried.length && mainStore){
        for(var mineralIndex in mineralsCarried){
            retVal = BCF.action(creep,creep.transfer,[mainStore,mineralsCarried[mineralIndex]]);
            if(retVal !== OK)
                break;
        }
        return;
    }

    var droppedMinerals = _.filter(creep.room.find(FIND_DROPPED_RESOURCES),(item) => item.resourceType !== RESOURCE_ENERGY);

    if(droppedMinerals.length > 0 && mainStore){
        if(_.sum(creep.carry) === carryParts.length*50){
            retVal = BCF.action(creep,creep.transfer,[mainStore,RESOURCE_ENERGY]);         
            return;   
        }

        var retVal = BCF.action(creep,creep.pickup,[droppedMinerals[0]]);

        if(retVal == OK){
            for(index in droppedMinerals){
                creep.pickup(droppedMinerals[index]);
            }
        }
        return;
    }

    switch (creep.memory.state) {
        case "Full":

            var spawning = creep.room.memory.spawning;


            //Distribute energy to extensions

            var extension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                                filter: function (object) {
                                    return object.energy < object.energyCapacity && (object.structureType === STRUCTURE_EXTENSION);
                                }
                            });
            
            if(extension){
                retVal = BCF.action(creep,creep.transfer,[extension,RESOURCE_ENERGY]);
                if(retVal === OK){
                    var extension2 = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                                filter: function (object) {
                                    return object.energy < object.energyCapacity && (object.structureType == STRUCTURE_EXTENSION) && object.id !==extension.id;
                                }
                            });

                    if(extension2)
                        creep.moveTo(extension2);
                }
                return;
            }

            //Distribute energy to towers
            var towers = creep.room.find(FIND_MY_STRUCTURES, {
                            filter: function (object) {
                                return object.energy < object.energyCapacity && (object.structureType == STRUCTURE_TOWER);
                            }
                        });


            if(towers.length > 0){
                BCF.action(creep,creep.transfer,[towers[0],RESOURCE_ENERGY]);
                return;
            }

            if(storageBig || storageSmall){
                var spawn = Game.getObjectById(creep.memory.spawnID);
                if(spawn && spawn.energy < spawn.energyCapacity){
                    BCF.action(creep,creep.transfer,[Game.getObjectById(creep.memory.spawnID),RESOURCE_ENERGY]);
                    return;
                }
            }
            else{
                if(spawning)
                    return
            }
            
            var repairTarget =  Game.getObjectById(creep.memory.repairTarget);

            if(!repairTarget || repairTarget.hits == repairTarget.hitsMax){
                var damagedStructures = _.filter(creep.room.find(FIND_STRUCTURES),(building) => building.hits < building.hitsMax && building.structureType !== STRUCTURE_WALL && building.structureType !== STRUCTURE_ROAD);

                if(damagedStructures.length !== 0){
                    creep.memory.repairTarget = damagedStructures[0].id;
                    BCF.action(creep,creep.repair,[Game.getObjectById(creep.memory.repairTarget)]);
                    return;
                }
            }
            else{
                BCF.action(creep,creep.repair,[Game.getObjectById(creep.memory.repairTarget)]);
                return;
            }

            //Build if there are things to build
            if(!Game.getObjectById(creep.memory.buildTarget)){
                var sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);

                if(sites.length !== 0){
                    creep.memory.buildTarget = sites[0].id;
                    BCF.action(creep,creep.build,[Game.getObjectById(creep.memory.buildTarget)]);
                    return;
                }
                else{
                    // upgraderAI(creep);
                    return;
                }
            }
            else{
                BCF.action(creep,creep.build,[Game.getObjectById(creep.memory.buildTarget)]);
                return;
            }

            break;
        case "Empty":
            //check for container
            var retVal;
            var storageBig = Game.getObjectById(creep.room.memory.storageBig);
            var storageSmall = Game.getObjectById(creep.room.memory.storageSmall);

            // var dropped = creep.room.find(FIND_DROPPED_ENERGY);

            // if(dropped.length > 0){
            //     BCF.action(creep,creep.pickup,[dropped[0]]);
            //     return;
            // }
            
           if(storageBig){
                if(storageBig.store[RESOURCE_ENERGY] > 0){
                    retVal = BCF.action(creep,creep.withdraw,[storageBig,RESOURCE_ENERGY]);
                    if(retVal === OK){
                        // console.log('test');
                        creep.room.memory.builderPickup = true;
                        // creep.moveTo(creep.room.controller);
                    }
                }
                else
                    BCF.goTo(creep,storageBig.pos,1);
            }
            else if(storageSmall){
                if(storageSmall.store[RESOURCE_ENERGY] > 0){
                    retVal = BCF.action(creep,creep.withdraw,[storageSmall,RESOURCE_ENERGY]);
                    if(retVal === OK){
                        // creep.moveTo(creep.room.controller);
                    }
                }
                else
                    BCF.goTo(creep,storageSmall.pos,1);
            }
            else{
                var spawn = Game.getObjectById(creep.memory.spawnID);

                if(spawn.energy > 0){
                    retVal = BCF.action(creep,creep.withdraw,[spawn,RESOURCE_ENERGY]);
                    if(retVal === OK){
                        // creep.moveTo(creep.room.controller);
                    }
                }
                else
                    BCF.goTo(creep,spawn.pos,2);
            }
            //upgraderAI(creep);
        default:
            break;
    }
 
}

module.exports = builder;