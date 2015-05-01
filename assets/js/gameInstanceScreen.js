(function() {

function GameInstanceScreen(data) {
    this.connectionData = data;
	this.Container_constructor();	
	this.setup();
}

var p = createjs.extend(GameInstanceScreen, createjs.Container);

p.setup = function() {
    var aa = this.connectionData.host ? 'You are host, Opponent: ' : 'You are guest, Opponent: ' ;
    var opponentName = new createjs.Text(aa + this.connectionData.opponent, "20px Arial", "#fff");
    opponentName.y = 0;
    opponentName.x = 1000;
    
    var money = new createjs.Text(instanceData.money + '$', "20px Arial", "#ff0");
    money.name = 'moneyLabel';
    money.y = 0;
    money.x = 800;

    var map = assets.buildMap();


    this.addChild(map); 

    //build castles
    var castleGood = new Castle(true);
    castleGood.name = 'castleGood';
    castleGood.x = assets.mapToScreen(13,33)[0];
    castleGood.y = assets.mapToScreen(13,33)[1];
    var castleBaad = new Castle(false);
    castleBaad.name = 'castleBad';
    castleBaad.x = assets.mapToScreen(32,14)[0];
    castleBaad.y = assets.mapToScreen(32,14)[1];

    map.addChild(castleGood, castleBaad);


    //pathfinder
    finder = new PF.AStarFinder({
        allowDiagonal: true
    });

    var btnBuilding1 = new Button1('Pleb hut  - 2$', '#fff', function(){
        $.each(map.getChildByName('bottom').children, function( index, value ) {
            if(value.base1 && gameInstanceScreen.connectionData.host || value.base2 && !gameInstanceScreen.connectionData.host ){
                value.alpha = 0.5;
                value.on("mouseover", function(){ this.alpha = 1;});
                value.on("mouseout", function(){ this.alpha = 0.5;});
                value.on("click", function(){
                    assets.tileRemoveAllEventListeners(map.getChildByName('bottom'));

                    if(instanceData.money >= 2){
                        instanceData.buildings.push({
                        name: gameInstanceScreen.connectionData.host ? 'hbuilding' + instanceData.buildings.length: 'obuilding' + instanceData.buildings.length,
                            x: this.x,
                            y: this.y,
                            frame: 10,
                            price: 2,
                            old: false
                        });
                    }

                    assets.sendData();

                    $.each(map.getChildByName('bottom').children, function( index, value ) {
                        value.alpha = 1;
                    });
                });
            }
        });
    });

    btnBuilding1.x = 10;
    btnBuilding1.y = 80;

    // var btntemp = new Button1("-- money", "#00F", function() {instanceData.money--; assets.sendData()});

    // btntemp.x = 720;
    // btntemp.y = 40;

    this.addChild(btnBuilding1, opponentName, money);

    if(this.connectionData.host){
        map.x = 1400;
        map.y = -1210;
    }else{
        map.x = -250;
        map.y = -1210;
    }
};

p.drawUpdate = function(delta){
    gameInstanceScreen.getChildByName('moneyLabel').text = instanceData.money + '$';
    var map = gameInstanceScreen.getChildByName('map').getChildByName('units');

    $.each(instanceData.units, function(index, value){
        var unit = map.getChildByName(value.name);

        if(!unit){
            unit = new Unit(value.name, true, value.x, value.y);
            map.addChild(unit);
        }else{
            unit.updateTime(delta);
        }
    });

    $.each(opponentData.units, function(index, value){
        var unit = map.getChildByName(value.name);

        if(!unit){
            unit = new Unit(value.name, false, value.x, value.y);
            map.addChild(unit);
        }else{
            unit.updateTime(delta);
        }
    });

    $.each(instanceData.buildings, function(index, value){
        var building = map.getChildByName(value.name);

        if(!building){
            building = new Building(value.name, true);
            building.x = value.x;
            building.y = value.y;
            map.addChild(building);
        }else if(building.isProducing()){
            building.updateTime(delta);
        }
    });

    $.each(opponentData.buildings, function(index, value){
       var building = map.getChildByName(value.name);

        if(!building){
            building = new Building(value.name, false);
            building.x = value.x;
            building.y = value.y;
            map.addChild(building);
        }else if(building.isProducing()){
            building.updateTime(delta);
        }
    });

    //instanceData
    //opponentData
};

window.GameInstanceScreen = createjs.promote(GameInstanceScreen, "Container");
}());