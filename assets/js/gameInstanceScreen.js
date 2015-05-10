(function() {

function GameInstanceScreen(data) {
    this.connectionData = data;
	this.Container_constructor();	
	this.setup();
}

var p = createjs.extend(GameInstanceScreen, createjs.Container);

p.setup = function() {
    var map = assets.buildMap();
    this.addChild(map); 

    var overlay = new GameOverlay(this.connectionData);
    overlay.name = 'overlay';
    this.addChild(overlay);     

    //build castles
    var castleOurs;
    var castleEnemy;

    if(this.connectionData.host){
        castleOurs = new Castle(true, this.connectionData);
        castleOurs.name = 'castleOurs';
        castleOurs.x = assets.mapToScreen(13,33)[0];
        castleOurs.y = assets.mapToScreen(13,33)[1];

        castleEnemy = new Castle(false, this.connectionData);
        castleEnemy.name = 'castleEnemy';
        castleEnemy.x = assets.mapToScreen(32,14)[0];
        castleEnemy.y = assets.mapToScreen(32,14)[1];
    }
    else{
        castleOurs = new Castle(true, this.connectionData);
        castleOurs.name = 'castleOurs';
        castleOurs.x = assets.mapToScreen(32,14)[0];
        castleOurs.y = assets.mapToScreen(32,14)[1];
    

        castleEnemy = new Castle(false, this.connectionData);
        castleEnemy.name = 'castleEnemy';
        castleEnemy.x = assets.mapToScreen(13,33)[0];
        castleEnemy.y = assets.mapToScreen(13,33)[1];
    }

    map.getChildByName('units').addChild(castleOurs, castleEnemy);

    //pathfinder
    finder = new PF.AStarFinder({
        allowDiagonal: true
    });


    if(this.connectionData.host){
        map.x = 1400;
        map.y = -1210;
    }else{
        map.x = -250;
        map.y = -1210;
    }
};

p.drawUpdate = function(delta){
    this.getChildByName('overlay').update();

    var map = gameInstanceScreen.getChildByName('map').getChildByName('units');

    //units
    instanceData.units = $.grep(instanceData.units, function (el, i) {
        var unit = map.getChildByName(el.name);

        if (el.kill) { // or whatever
            if(unit){
                unit.parent.removeChild(unit);
            }
            
            return false;
        }

        if(!unit){
            unit = new Unit(el, true);
            map.addChild(unit);
        }else{
            unit.updateTime(delta, instanceData.units[i]);
        }

        return true;
    });

    opponentData.units = $.grep(opponentData.units, function (el, i) {
        var unit = map.getChildByName(el.name);

        if (el.kill) { // or whatever
            if(unit){
                unit.parent.removeChild(unit);
            }
            
            return false;
        }

        if(!unit){
            unit = new Unit(el, false);
            map.addChild(unit);
        }else{
            unit.updateTime(delta, opponentData.units[i]);
        }

        return true;
    });

    //buildings

    instanceData.buildings = $.grep(instanceData.buildings, function (el, i) {
        var building = map.getChildByName(el.name);

        if (el.kill) { // or whatever
            if(building){
                building.parent.removeChild(building);
            }
            
            return false;
        }

        if(!building){
            building = new Building(el.name, el.buildingType, true);
            building.x = el.x;
            building.y = el.y;
            map.addChild(building);
        }else{
            building.updateTime(delta, instanceData.buildings[i]);
        }

        return true;
    });

    opponentData.buildings = $.grep(opponentData.buildings, function (el, i) {
        var building = map.getChildByName(el.name);

        if (el.kill) { // or whatever
            if(building){
                building.parent.removeChild(building);
            }
            
            return false;
        }

        if(!building){
            building = new Building(el.name, el.buildingType, false);
            building.x = el.x;
            building.y = el.y;
            map.addChild(building);
        }else{
            building.updateTime(delta, opponentData.buildings[i]);
        }

        return true;
    });
};

window.GameInstanceScreen = createjs.promote(GameInstanceScreen, "Container");
}());