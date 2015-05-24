//# sourceURL=gameOverlay.js
(function() {

function GameOverlay(data) {
	this.Container_constructor();
	this.connectionData = data;
	this.setup();
}
var p = createjs.extend(GameOverlay, createjs.Container);

p.setup = function() {
    var outer = this;

    var btnBuild =  new InitButton("btnBuild", buttons.Build, function() {
        var btnCont = outer.getChildByName('btnContainer');
        btnCont.visible = true;

        createjs.Tween.get(btnCont, { loop: false })
        .to({alpha: 1}, 1000, createjs.Ease.getPowInOut(4));
    });

    btnBuild.x = 25;
    btnBuild.y = 25;
    btnBuild.name = "btnBuild"

    this.addChild(btnBuild);

    var rectBlack = new createjs.Shape();
    rectBlack.name = 'rectBlack';
    rectBlack.alpha = 0.5;
    rectBlack.graphics.beginFill("#000").drawRect(610, 570, 300, 180);
    this.addChild(rectBlack);

    var btnContainer = new createjs.Container();
    btnContainer.name = 'btnContainer';
    btnContainer.alpha = 0;
    btnContainer.visible = false;
    this.addChild(btnContainer);
    // building buttons
    $.each(Races[raceSelected].buildings, function(index, item){
        var btnBuilding =  new InitButton('', buttons[item], function() {
            outer.getChildByName('btnContainer').alpha = 0;
            outer.getChildByName('btnContainer').visible = false;

            var map = gameInstanceScreen.getChildByName('map');

            mapTiles = map.getChildByName('bottom').children;

            for(var i = 0, len = mapTiles.length; i < len; i++){
                if(mapTiles[i].base1 && gameInstanceScreen.connectionData.host || mapTiles[i].base2 && !gameInstanceScreen.connectionData.host ){
                    mapTiles[i].removeAllEventListeners();
                    
                    var tilePos = assets.screenToMap(mapTiles[i].x, mapTiles[i].y);
                    var matrix = assets.getMapMatrix(true);

                    if( matrix[tilePos[1]][tilePos[0]] != 1){
                        mapTiles[i].alpha = 0.5;
                        mapTiles[i].on("mouseover", function(){ this.alpha = 1;});
                        mapTiles[i].on("mouseout", function(){ this.alpha = 0.5;});
                        mapTiles[i].on("click", function(){

                            if(instanceData.money >= BuildingTypes[item].cost){
                                instanceData.buildings.push({
                                name: gameInstanceScreen.connectionData.host ? 'hbuilding' + instanceData.buildingCount++: 'obuilding' + instanceData.buildingCount++,
                                    x: this.x,
                                    y: this.y,
                                    buildingType: BuildingTypes[item].name,
                                    hp: BuildingTypes[item].life,
                                    old: false, 
                                    producing: true
                                });
                            }

                            assets.sendData();

                            for(var i = 0, len = mapTiles.length; i < len; i++){
                                mapTiles[i].removeAllEventListeners();
                                mapTiles[i].alpha = 1;
                            }
                        });
                    }
                }
            }
        });
        
        btnBuilding.name = 'Button' + BuildingTypes[item].name ;
        btnBuilding.x = 120;
        btnBuilding.y = 25 + 95 * index;

        outer.getChildByName('btnContainer').addChild(btnBuilding);
    });
    
    var money = new createjs.Text(instanceData.money + '$', "20px Almendra", "#ff0");
    money.name = 'moneyLabel';
    money.y = 0;
    money.x = 800;

    var selection = new createjs.Text('', "20px Almendra", "#fff");
    selection.name = 'selection';
    selection.y = 600;
    selection.x = 650;

    //debug
    // var pos = new createjs.Text('', "20px Almendra", "#fff");
    // pos.name = 'pos';
    // pos.y = 500;
    // pos.x = 500;

    //building stop production--------------------------------------------------------
    
    var stopProduction =  new InitButton('btnStopProduction', buttons.Stop, function(){
        //instanceData.buildings[i].producing ? buttons.Start : buttons.Stop
            for(var i = 0, len = instanceData.buildings.length; i < len; i++){
                if(instanceData.buildings[i].name == userCurrentSelection){
                    instanceData.buildings[i].producing = !instanceData.buildings[i].producing;
                }
            }

            assets.sendData();
    });

    stopProduction.name = 'btnStopProduction';
    stopProduction.x = 620;
    stopProduction.y = 565;
    

    if(!userCurrentSelection){
        stopProduction.visible = false;
    }

    //building destroy --------------------------------------------------------------
    var destroyBuilding =  new InitButton('Destroy', buttons.Sell, function(){
        if(userCurrentSelection){
            for(var i = 0, len = instanceData.buildings.length; i < len; i++){
                if(instanceData.buildings[i].name == userCurrentSelection){
                    instanceData.buildings[i].kill = true;
                }
            }

            userCurrentSelection = null;
            assets.sendData();
        }
    });

    destroyBuilding.name = 'btnDestroyBuilding';
    destroyBuilding.x = stopProduction.x;
    destroyBuilding.y = stopProduction.y+70+10;


    this.addChild(money, selection, stopProduction, destroyBuilding);
};

p.update = function() {
    if(userCurrentSelection){
        if(userCurrentSelection.indexOf('building') == 1){
             this.getChildByName('btnStopProduction').visible = true;
             this.getChildByName('btnDestroyBuilding').visible = true;
        }else{
            this.getChildByName('btnStopProduction').visible = false; 
            this.getChildByName('btnDestroyBuilding').visible = false;    
        }
    }else{
         this.getChildByName('btnStopProduction').visible = false;
         this.getChildByName('btnDestroyBuilding').visible = false;    
    }
    
	this.getChildByName('moneyLabel').text = instanceData.money + '$';
	this.getChildByName('selection').text = userCurrentSelection;

    var map = gameInstanceScreen.getChildByName('map').getChildByName('units').getChildByName(userCurrentSelection);
    if(map){
        var item = $.grep(instanceData.units, function (el, i) {
            if(el.name == map.name){
                return true;
            }
        });

        if(item.length > 0){
            this.getChildByName('pos').text = 'c- x: ' + map.x + ' y: ' + map.y + ' s- x: ' + item[0].x + ' y: ' + item[0].y;        
        }   
    }
};

window.GameOverlay = createjs.promote(GameOverlay, "Container");
}());