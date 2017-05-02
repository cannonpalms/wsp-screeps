var creepSpecs = {
    builder: {
        bodyBase:[MOVE,WORK,CARRY,MOVE],
        bodyBaseCost:250,
        bodyGoal: [MOVE,WORK,CARRY,MOVE,MOVE,WORK,CARRY,MOVE,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY],
        // bodyGoal: [MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY],
        
    },
    claimer:{
        bodyBase:[MOVE,WORK,CARRY],
        bodyBaseCost:200,
        bodyGoal: [MOVE,WORK,CARRY,MOVE,WORK,CARRY]
    },
    controlClaimer:{
        bodyBase:[MOVE,CLAIM],
        bodyBaseCost:650,
        bodyGoal: []
    },
    defender:{
        bodyBase:[ATTACK,MOVE,ATTACK,MOVE],
        bodyBaseCost:260,
        bodyGoal: [ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE]
    },
    drainer:{
        bodyBase:[TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
        bodyBaseCost:2170,
        bodyGoal: []
    },
    explorer: {
        bodyBase:[MOVE],
        bodyBaseCost:50,
        bodyGoal: []
    },
    harvester: {
        bodyBase:[MOVE,WORK,WORK],
        bodyBaseCost:250,
        bodyGoal: [WORK,WORK,WORK]        
    },
    remoteHarvester: {
        bodyBase:[MOVE,WORK,MOVE,WORK],
        bodyBaseCost:300,
        // bodyGoal: [CARRY,CARRY,WORK,WORK,WORK,MOVE,MOVE,MOVE]
        bodyGoal: [CARRY,CARRY,WORK]
    },
    remoteTransport: {
        bodyBase:[MOVE,CARRY,MOVE,CARRY],
        bodyBaseCost:200,
        bodyGoal: [MOVE,CARRY,MOVE,CARRY,MOVE,CARRY]
    },
    reserver:{
        bodyBase:[MOVE,CLAIM,MOVE,CLAIM],
        bodyBaseCost:1300,
        bodyGoal: []
    },
    thief: {
        bodyBase:[MOVE,CARRY,MOVE,CARRY],
        bodyBaseCost:200,
        bodyGoal: [MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY],
        buildFunction: function(creep,distance){

        }
    },
    transport: {
        bodyBase:[MOVE,CARRY,MOVE,CARRY],
        bodyBaseCost:200,
        bodyGoal: [MOVE,CARRY,MOVE,CARRY,MOVE,CARRY],
        buildFunction: function(creep,distance){

        }
    },
    scavenger: {
        bodyBase:[MOVE,CARRY,MOVE,CARRY],
        bodyBaseCost:200,
        bodyGoal: [MOVE,CARRY,MOVE,CARRY,MOVE,CARRY],
        buildFunction: function(creep,distance){

        }
    },
    upgradeTransport: {
        bodyBase:[MOVE,CARRY],
        bodyBaseCost:100,
        bodyGoal: [MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY]
    },
    upgrader: {
        bodyBase:[MOVE,WORK,CARRY],
        bodyBaseCost:200,
        bodyGoal: [WORK,WORK,WORK,MOVE,WORK,WORK,MOVE,WORK,WORK,WORK,MOVE,WORK]
    },
    humanControl: {
        bodyBase:[ATTACK,MOVE,ATTACK,MOVE],
        bodyBaseCost:260,
        bodyGoal: [ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE]
    },
    humanControl2: {
        bodyBase:[MOVE,HEAL],
        bodyBaseCost:300,
        bodyGoal: [MOVE,HEAL]
    },
    humanControl3: {
        bodyBase:[WORK,MOVE],
        bodyBaseCost:150,
        bodyGoal: [WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE]
    }
}

module.exports = creepSpecs;