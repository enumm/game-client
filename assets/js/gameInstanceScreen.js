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
    var castleGood = new Castle(true, this.connectionData);
    castleGood.name = 'castleGood';
    castleGood.x = assets.mapToScreen(13,33)[0];
    castleGood.y = assets.mapToScreen(13,33)[1];
    var castleBaad = new Castle(false, this.connectionData);
    castleBaad.name = 'castleBad';
    castleBaad.x = assets.mapToScreen(32,14)[0];
    castleBaad.y = assets.mapToScreen(32,14)[1];

    map.getChildByName('units').addChild(castleGood, castleBaad);

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
            unit = new Unit(el.name, true, el.x, el.y);
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
            unit = new Unit(el.name, false, el.x, el.y);
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
            building = new Building(el.name, el.type, true);
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
            building = new Building(el.name, el.type, false);
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