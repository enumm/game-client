//@ sourceURL=login.js

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
    
    //initLayers();
    var map = assets.buildMap();
    this.addChild(map);  

    var buttonBuild; 
    buttonBuild = new createjs.Text("Build", "48px Arial", "#00F");
    buttonBuild.x = 10;
    buttonBuild.y = 80;
    buttonBuild.alpha = 1;

    var buildHit = new createjs.Shape();
    buildHit.graphics.beginFill("#000").drawRect(0, 0, buttonBuild.getMeasuredWidth(), buttonBuild.getMeasuredHeight());       
    buttonBuild.hitArea = buildHit;
    buttonBuild.on("click", function() {
        map.alpha = 0.5;

        $.each(map.children, function( index, value ) {
            value.on("mouseover", function(){ this.alpha = 2;});
            value.on("mouseout", function(){ this.alpha = 1;});
            value.on("click", function(){
                tileRemoveAllEventListeners(map);
                var tree = this.clone(true);
                tree.gotoAndStop(11);
                map.addChild(tree);
                this.alpha = 1;
            });
        });
    });

    this.addChild(buttonBuild, opponentName);

    if(this.connectionData.host){
        map.x = 1400;
        map.y = -1210;
    }else{
        map.x = -250;
        map.y = -1210;
    }
};

window.GameInstanceScreen = createjs.promote(GameInstanceScreen, "Container");
}());