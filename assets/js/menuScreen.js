(function() {

function MenuScreen() {
	this.Container_constructor();	
	this.setup();
}

var p = createjs.extend(MenuScreen, createjs.Container);

p.setup = function() {
    var text = new createjs.Text('', "20px Arial", "#fff");
    
    text.x = 550;
    text.y = 100;

    var buttonPlay = new Button1("Find game", "#00F", function() {
        text.text = 'searching for a game';
        assets.sendMSG('find_game');
        //hideMenu();
        //showGameInstance();
    });

    buttonPlay.x = 500;
    buttonPlay.y = 200;

    this.addChild(buttonPlay, text);
};

p.msgStartGame = function(data){
    hideMenu();
    showGameInstance(data);
};

window.MenuScreen = createjs.promote(MenuScreen, "Container");
}());