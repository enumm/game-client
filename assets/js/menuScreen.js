(function() {

function MenuScreen() {
	this.Container_constructor();	
	this.setup();
}

var p = createjs.extend(MenuScreen, createjs.Container);

p.setup = function() {
    var buttonFindGame;
    buttonFindGame = new createjs.Text("Find game", "48px Arial", "#00F");
    buttonFindGame.x = 10;
    buttonFindGame.y = 80;
    buttonFindGame.alpha = 0.5;
    var loginHit = new createjs.Shape();
    loginHit.graphics.beginFill("#000").drawRect(0, 0, buttonFindGame.getMeasuredWidth(), buttonFindGame.getMeasuredHeight());       
    buttonFindGame.hitArea = loginHit;
    buttonFindGame.on("mouseover", textMouseOver);
    buttonFindGame.on("mouseout", textMouseOver);
    buttonFindGame.on("click", function() { hideMenu(); showGameInstance();});
    
    this.addChild(buttonFindGame);
} ;

window.MenuScreen = createjs.promote(MenuScreen, "Container");
}());