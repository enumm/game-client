(function() {

function MenuScreen() {
	this.Container_constructor();	
	this.setup();
}

var p = createjs.extend(MenuScreen, createjs.Container);

p.setup = function() {

    var buttonPlay = new Button1("Find game", "#00F", function() {hideMenu(); showGameInstance();});
    buttonPlay.x = 500;
    buttonPlay.y = 200;

    this.addChild(buttonPlay);
} ;

window.MenuScreen = createjs.promote(MenuScreen, "Container");
}());