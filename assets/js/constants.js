(function() {
    //kazkaip atrodo hack

    CastleHost = {
        x: -1280, 
        y: 1440,
        range: 95
    };

    CastleOpponent= {
        x: 1216,
        y: 1440,
        range: 95
    };

    Races = {
    	Plebs: {name :'Plebs', buildings: ['PlebHut', 'PlebRanger', 'PlebFlying']},
    	BlaBlas: {name :'BlaBlas', buildings: ['BlaHut', 'BlaRanger', 'BlaFlying']}
    };

	UnitTypes = {
    	Pleb: {name: 'Pleb', type: 'ground', damage: 10, armor: 10, movementSpeed: 60, life: 100, attackSpeed: 1, range: 15},
    	RangedPleb: {name: 'RangedPleb', type: 'ranged', damage: 8, armor: 5, movementSpeed: 60, life: 100, attackSpeed: 2, range: 120},
        FlyingPleb: {name: 'FlyingPleb', type: 'flying', damage: 5, armor: 4, movementSpeed: 60, life: 100, attackSpeed: 3, range: 35},


        Bla: {name: 'Bla', type: 'ground', damage: 10, armor: 10, movementSpeed: 60, life: 100, attackSpeed: 1, range: 15},
        RangedBla: {name: 'RangedBla', type: 'ranged', damage: 8, armor: 5, movementSpeed: 60, life: 100, attackSpeed: 2, range: 120},
        FlyingBla: {name: 'FlyingBla', type: 'flying', damage: 5, armor: 4, movementSpeed: 60, life: 100, attackSpeed: 3, range: 35}
	};

    BuildingTypes = {
        PlebHut : {name: 'PlebHut', cost: 2, frame: 2, life: 200, armor: 20, buildTime: 10, unitType: 'Pleb'},
        PlebRanger : {name: 'PlebRanger', cost: 5, frame: 3, life: 200, armor: 20, buildTime: 10, unitType: 'RangedPleb'},
        PlebFlying : {name: 'PlebFlying', cost: 10, frame: 4, life: 200, armor: 20, buildTime: 10, unitType: 'FlyingPleb'},

        BlaHut : {name: 'BlaHut', cost: 2, frame: 2, life: 200, armor: 20, buildTime: 10, unitType: 'Bla'},
        BlaRanger : {name: 'BlaRanger', cost: 5, frame: 3, life: 200, armor: 20, buildTime: 10, unitType: 'RangedBla'},
        BlaFlying : {name: 'BlaFlying', cost: 10, frame: 4, life: 200, armor: 20, buildTime: 10, unitType: 'FlyingBla'}
    };
}
)();