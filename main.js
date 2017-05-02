var creepAI = require("creep.AI");
var towerAI = require("tower.AI");
var roomAI = require("room.AI");
var roomscanner = require("room.scan");
var constants = require("reference");
var creepSpecs = require("creep.specs");
var pathfinderCB = require("pathfinderCB");

module.exports.loop = function () {
	//Loop through objects and define behavior

    //Every so many ticks run a scan tick.  Scans all available rooms and update memory

    //Change scan to be based on only rooms with spawns.
        PathFinder.use(true);

        // var test = new RoomPosition(30,14,'E45N63');
        // var test2 = new RoomPosition(4,26,'E45N62');

        // var test = new RoomPosition(39,44,'W2N4');


        // This does not work.  Flags are not consistantly updated for some reason.  Takes 20-30 ticks for the delete actually happens
        // if(Game.flags.dEnd && Game.flags.dStart){
        //     var test = Game.flags.dStart.pos;
        //     var test2 = Game.flags.dEnd.pos;

        //     var path = PathFinder.search(test2, test,{roomCallback: pathfinderCB});  

        //     console.log(path.path.length);

        //     Game.flags.dEnd.remove();
        //     delete Game.flags.dEnd;
        // }

        // Memory.test2 = path.path.length;

        // new RoomVisual('E45N63').poly(_.filter(path.path,(pos) => pos.roomName === 'E45N63'),{stroke: '#fff', strokeWidth: .15,
        // opacity: .2, lineStyle: 'dashed'});
        // new RoomVisual('E45N62').poly(_.filter(path.path,(pos) => pos.roomName === 'E45N62'),{stroke: '#fff', strokeWidth: .15,
        // opacity: .2, lineStyle: 'dashed'});

        // new RoomVisual('E47N65').poly(_.filter(path.path,(pos) => pos.roomName === 'E47N65'),{stroke: '#fff', strokeWidth: .15,
        // opacity: .2, lineStyle: 'dashed'});
        // new RoomVisual('E48N65').poly(_.filter(path.path,(pos) => pos.roomName === 'E48N65'),{stroke: '#fff', strokeWidth: .15,
        // opacity: .2, lineStyle: 'dashed'});

    // Game.rooms.W3N4.memory.externalSources = {};
    // Game.rooms.W1N4.memory.externalSources = {};
    // // Game.rooms.W4N4.memory.externalSources = {};

    // Game.rooms.W3N4.memory.externalSources.W2N4 = { '360135034cdb766':{x:11,y:16,room:'W2N4',path:null,distance:37},
    //                                                 'db7635034cdce7d':{x:39,y:44,room:'W2N4',path:null,distance:58}}

    // Game.rooms.W3N4.memory.externalSources.W4N4 = { 'cebb350107b50ed':{x:16,y:7,room:'W4N4',path:null,distance:64},
    //                                                 '78f8350107b7607':{x:11,y:6,room:'W4N4',path:null,distance:66}}

    // Game.rooms.W1N4.memory.externalSources.W0N4 = { '88d335052ba1cd6':{x:34,y:21,room:'W0N4',path:null,distance:51},
    //                                                 '23d135052baaf56':{x:30,y:8,room:'W4N4',path:null,distance:47}}


    //51
    //

    // Game.rooms.W4N4.memory.externalSources.W4N3 = { 'e87ee8e2ed1b59a':{x:26,y:9,room:'W4N3',path:null,distance:25},
    //                                                 '37fbe8e2ed2583c':{x:34,y:23,room:'W4N3',path:null,distance:39}};
                                                    
    // Game.rooms.E45N63.memory.externalSources = {};

    // Game.rooms.E45N63.memory.externalSources.E45N62 = {'57ef9e2a86f108ae6e60ee4b':{x:4,y:26,room:'E45N62',path:null,distance:72}};

    // delete Memory;
    
    global.test = {};

    var printCpu = false;

    creepCounts = {};

    if(printCpu){
        console.log("----------------");    
        console.log("No Code:" + Game.cpu.getUsed());    
    }

    _.forEach(Game.creeps,function(creep){
        //add to creepType count
        if(!creepCounts[creep.memory.homeRoom]){
            creepCounts[creep.memory.homeRoom] = {};
        }

        if(!creepCounts[creep.memory.homeRoom][creep.memory.creepType]){
            if(creep.memory.creepType === 'transport' || creep.memory.creepType === 'harvester' || creep.memory.creepType === 'remoteHarvester'|| creep.memory.creepType === 'remoteTransport'){
                creepCounts[creep.memory.homeRoom][creep.memory.creepType] = {};                
            }
            else{
                creepCounts[creep.memory.homeRoom][creep.memory.creepType] = 0;
            }
        }

        if(creep.spawning || ((creep.ticksToLive||1500) - creep.memory.travelTicks > 0)){

            if(creep.memory.creepType === 'transport' || creep.memory.creepType === 'harvester' || creep.memory.creepType === 'remoteHarvester'|| creep.memory.creepType === 'remoteTransport'){
                if(!creepCounts[creep.memory.homeRoom][creep.memory.creepType][creep.memory.resource]){
                    creepCounts[creep.memory.homeRoom][creep.memory.creepType][creep.memory.resource] = 0;
                }
                creepCounts[creep.memory.homeRoom][creep.memory.creepType][creep.memory.resource]++;
            }
            else{
                creepCounts[creep.memory.homeRoom][creep.memory.creepType]++;
            }
        }
    });

    Memory.creepCounts = creepCounts;

    if(printCpu){  
        console.log("Creep Counts:" + Game.cpu.getUsed());    
    }

    if(Memory.invaderTime && Game.time - Memory.invaderTime > 1500){
        Memory.invaderTime = null;
        console.log(Game.time - Memory.invaderTime);
    }

    for(var roomID in Game.rooms) {
        var room = Game.rooms[roomID];
        if(room.controller && room.controller.my === true){
            roomscanner.scanRoom(room);
        }
        else{
            var invaders = _.filter((Game.rooms[roomID].find(FIND_CREEPS)),(creep) => creep.owner.username === 'Invader');

            if(invaders.length > 0 && !Memory.invaderTime){
                Memory.invaderTime = Game.time;
            }
        }     

        room.memory.builderPickup = false;

        roomAI.run(room);
        displayControlLevel(room);
    }

    if(printCpu)
        console.log("Room Code:" + Game.cpu.getUsed());
    

    //cleanup
    for (var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    for (var name in Memory.rooms) {
        if(!Game.rooms[name]) {
            delete Memory.rooms[name];
        }
    }

    //creeps
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        creepAI.run(creep);
    }

    if(printCpu)
        console.log("Creep Code:" + Game.cpu.getUsed());    

    for (var name in Game.structures) {
        //towers
        if (Game.structures[name].structureType == STRUCTURE_TOWER) {
            towerAI.run(Game.structures[name]);
        }

        // if (Game.structures[name].structureType == STRUCTURE_ROAD) {
        //     Game.structures[name].destroy();
        // }
        //labs
    }

    if(printCpu)
        console.log("All Code:" + Game.cpu.getUsed());    

    // console.log("All Code:" + Game.cpu.getUsed());    

        // console.log(JSON.stringify(global.test));
}

function displayControlLevel(room){

    var spawns = room.memory.spawns;

    if(room.controller && room.controller.my === true && spawns.length > 0){
        var lProg = Math.floor(100.0*room.controller.progress/room.controller.progressTotal);
        var lLevel = room.controller.level
        var gProg = Math.floor(100.0*Game.gcl.progress/Game.gcl.progressTotal);
        var gLevel = Game.gcl.level  

        var align;
        var textAdjustment;

        if(room.controller.pos.x < Game.getObjectById(spawns[0]).pos.x){
            var alignment = "right";
            var textAdjustment= -1;
        }
        else{
            var alignment = "left";
            var textAdjustment= 1;

        }      

        room.visual.text(("0" + lProg).slice(-2) + "% L: " + lLevel,room.controller.pos.x + textAdjustment,room.controller.pos.y,{align:alignment,color:"White",size:1});
        room.visual.text(("0" + gProg).slice(-2) + "% G: " + gLevel,room.controller.pos.x + textAdjustment,room.controller.pos.y-1,{align:alignment,color:"#ffd493",size:1});
    }

}