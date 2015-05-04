(function() {

function GameOverlay(data) {
	this.Container_constructor();
	this.connectionData = data;
	this.setup();
}
var p = createjs.extend(GameOverlay, createjs.Container);

p.setup = function() {

    // var overlay = new createjs.Bitmap(overlayImg);
    // overlay.name = 'overlayImg'; 
    // overlay.y = 446;
    // this.addChild(overlay);
	
    var btnBuilding1 = new Button1('Pleb hut  - 2$', '#fff', null, function(){
		var map = gameInstanceScreen.getChildByName('map');

        $.each(map.getChildByName('bottom').children, function( index, value ) {
            if(value.base1 && gameInstanceScreen.connectionData.host || value.base2 && !gameInstanceScreen.connectionData.host ){
                value.alpha = 0.5;
                value.on("mouseover", function(){ this.alpha = 1;});
                value.on("mouseout", function(){ this.alpha = 0.5;});
                value.on("click", function(){
                    assets.tileRemoveAllEventListeners(map.getChildByName('bottom'));

                    if(instanceData.money >= 2){
                        instanceData.buildings.push({
                        name: gameInstanceScreen.connectionData.host ? 'hbuilding' + instanceData.buildingCount++: 'obuilding' + instanceData.buildingCount++,
                            x: this.x,
                            y: this.y,
                            frame: 10,
                            price: 2,
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

    btnBuilding1.x = 10;
    btnBuilding1.y = 80;

    this.addChild(btnBuilding1);

	var aa = this.connectionData.host ? 'You are host, Opponent: ' : 'You are guest, Opponent: ' ;
    var opponentName = new createjs.Text(aa + this.connectionData.opponent, "20px Arial", "#fff");
    opponentName.y = 0;
    opponentName.x = 1000;
    
    var money = new createjs.Text(instanceData.money + '$', "20px Arial", "#ff0");
    money.name = 'moneyLabel';
    money.y = 0;
    money.x = 800;

    var selection = new createjs.Text('', "20px Arial", "#fff");
    selection.name = 'selection';
    selection.y = 600;
    selection.x = 500;

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
    stopProduction.y = 650;
    stopProduction.x = 500;

    if(!userCurrentSelection){
        stopProduction.visible = false;
    }

    this.addChild(opponentName, money, selection, stopProduction);
};

p.update = function() {
    if(userCurrentSelection){
        if(userCurrentSelection.indexOf('building') == 1){
             this.getChildByName('btnStopProduction').visible = true;
        }else{
            this.getChildByName('btnStopProduction').visible = false;    
        }
    }else{
         this.getChildByName('btnStopProduction').visible = false;    
    }
    
	this.getChildByName('moneyLabel').text = instanceData.money + '$';
	this.getChildByName('selection').text = userCurrentSelection;
};

window.GameOverlay = createjs.promote(GameOverlay, "Container");
}());