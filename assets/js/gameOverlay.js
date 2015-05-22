(function() {

function GameOverlay(data) {
	this.Container_constructor();
	this.connectionData = data;
	this.setup();
}
var p = createjs.extend(GameOverlay, createjs.Container);

p.setup = function() {
    var outer = this;
    //building buttons
    $.each(Races[raceSelected].buildings, function(index, item){
        var btnBuilding = new Button1(item + ' - ' + BuildingTypes[item].cost + '$', '#fff', null, function(){
            var map = gameInstanceScreen.getChildByName('map');

            $.each(map.getChildByName('bottom').children, function( index, value ) {
                if(value.base1 && gameInstanceScreen.connectionData.host || value.base2 && !gameInstanceScreen.connectionData.host ){
                    value.alpha = 0.5;
                    value.on("mouseover", function(){ this.alpha = 1;});
                    value.on("mouseout", function(){ this.alpha = 0.5;});
                    value.on("click", function(){
                        assets.tileRemoveAllEventListeners(map.getChildByName('bottom'));

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

                        $.each(map.getChildByName('bottom').children, function( index, value ) {
                            value.alpha = 1;
                        });
                    });
                }
            });
        });
        
        btnBuilding.name = 'Button' +BuildingTypes[item].name ;
        btnBuilding.x = 10;
        btnBuilding.y = 80 + 45 * index;
        outer.addChild(btnBuilding);
    });

	var aa = this.connectionData.host ? 'You are host, Opponent: ' : 'You are guest, Opponent: ' ;
    var opponentName = new createjs.Text(aa + this.connectionData.opponent, "20px Almendra", "#fff");
    opponentName.y = 0;
    opponentName.x = 1000;
    
    var money = new createjs.Text(instanceData.money + '$', "20px Almendra", "#ff0");
    money.name = 'moneyLabel';
    money.y = 0;
    money.x = 800;

    var selection = new createjs.Text('', "20px Almendra", "#fff");
    selection.name = 'selection';
    selection.y = 600;
    selection.x = 500;

    //debug
    var pos = new createjs.Text('', "20px Almendra", "#fff");
    pos.name = 'pos';
    pos.y = 500;
    pos.x = 500;

    //building stop production--------------------------------------------------------
    var stopProduction = new Button1('Start/Stop Prod.', '#fff', null, function(){
        if(userCurrentSelection){
            $.each(instanceData.buildings, function(index, value){
                if(value.name == userCurrentSelection){
                    value.producing = !value.producing;
                }
            }); 

            assets.sendData();
        }
    });

    stopProduction.name = 'btnStopProduction';
    stopProduction.y = 630;
    stopProduction.x = 500;

    if(!userCurrentSelection){
        stopProduction.visible = false;
    }

    //building destroy --------------------------------------------------------------
    var destroyBuilding = new Button1('Destroy', '#fff', null, function(){
        if(userCurrentSelection){
            $.each(instanceData.buildings, function(index, value){
                if(value.name == userCurrentSelection){
                    value.kill = true;
                }
            }); 

            userCurrentSelection = null;

            assets.sendData();
        }
    });

    destroyBuilding.name = 'btnDestroyBuilding';
    destroyBuilding.y = 680;
    destroyBuilding.x = 500;

    //building destroy --------------------------------------------------------------
    var destroyBuilding = new Button1('Sell', '#fff', null, function(){
        if(userCurrentSelection){
            $.each(instanceData.buildings, function(index, value){
                if(value.name == userCurrentSelection){
                    value.kill = true;
                    value.sell = true;
                    instanceData.money += BuildingTypes[value.buildingType].cost/2;
                }
            }); 

            userCurrentSelection = null;

            assets.sendData();
        }
    });

    destroyBuilding.name = 'btnDestroyBuilding';
    destroyBuilding.y = 680;
    destroyBuilding.x = 500;

    if(!userCurrentSelection){
        destroyBuilding.visible = false;
    }

    this.addChild(opponentName, money, selection, stopProduction, destroyBuilding, pos);
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