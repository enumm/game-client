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

    map.getChildByName('bottom').addChild(castleGood, castleBaad);

    //pathfinder
    finder = new PF.AStarFinder({
        allowDiagonal: true
    });

    var btnBuilding1 = new Button1('Pleb hut  - 2$', '#fff', null, function(){
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

    // var btntemp = new Button1("-- money", "#00F", null,function() {instanceData.money--; assets.sendData()});

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

    for(i = instanceData.units.length - 1; i >= 0; i--){
        var unit = map.getChildByName(instanceData.units[i].name);

        if(instanceData.units[i].kill){
            if(unit){
                unit.parent.removeChild(unit);
            }
            instanceData.units.splice(i,1);
        }else{
            if(!unit){
                unit = new Unit(instanceData.units[i].name, true, instanceData.units[i].x, instanceData.units[i].y);
                map.addChild(unit);
            }else{
                unit.updateTime(delta, instanceData.units[i]);
            }
        }
    }
    
    for(i = opponentData.units.length - 1; i >= 0; i--){
        var unit = map.getChildByName(opponentData.units[i].name);

        if(opponentData.units[i].kill){
            if(unit){
                unit.parent.removeChild(unit);
            }
            opponentData.units.splice(i,1);
        }else{
            if(!unit){
                unit = new Unit(opponentData.units[i].name, false, opponentData.units[i].x, opponentData.units[i].y);
                map.addChild(unit);
            }else{
                unit.updateTime(delta, opponentData.units[i]);
            }
        }
    }        


    // $.each(instanceData.units, function(index, value){
    //     var unit = map.getChildByName(value.name);

    //     if(!value.kill){

    //         for( i = instanceData.units.length-1; i>=0; i--) {
    //             if( instanceData.units[i].name == this.name) instanceData.units.splice(i,1);
    //         }
    //     }else{
    //         if(!unit){
    //             unit = new Unit(value.name, true, value.x, value.y);
    //             map.addChild(unit);
    //         }else{
    //             unit.updateTime(delta, value);
    //         }
    //     }
    // });

    // $.each(opponentData.units, function(index, value){
    //     if(!value.isDead){
    //         var unit = map.getChildByName(value.name);

    //         if(!unit){
    //             unit = new Unit(value.name, false, value.x, value.y);
    //             map.addChild(unit);
    //         }else{
    //             unit.updateTime(delta, value);
    //         }
    //     }
    // });

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