//# sourceURL=menuScreen.js
(function() {

function MenuScreen() {
	this.Container_constructor();	
	this.setup();
}

var p = createjs.extend(MenuScreen, createjs.Container);

p.setup = function() {
    assets.showMenuBackground();
    assets.showParticles();

    var text = new createjs.Text('', "20px Arial", "#fff");
    text.x = 550;
    text.y = 100;

    var race = new createjs.Text('Select race:', "20px Arial", "#fff");
    race.x = 200;
    race.y = 200;

    var srace = new createjs.Text(raceSelected, "20px Arial", "#fff");
    srace.x = 200;
    srace.y = 220;

    var raceHumans =  new Button1("", "#00F", btnRacePlebs, function() {
        raceSelected = 'plebs';
        srace.text = raceSelected;
    });
    raceHumans.x = 200;
    raceHumans.y = 250;

    var raceBlabla =  new Button1("", "#00F", btnRaceBlablas,  function() {
        raceSelected = 'blablas'; 
        srace.text = raceSelected;
    });
    raceBlabla.x = 200;
    raceBlabla.y = 350;

    var buttonMmCasual =  new Button1("", "#00F", btnMmCasual, function() {
        gameType = 'casual';
    });
    buttonMmCasual.x = 200;
    buttonMmCasual.y = 450;

    var buttonMmRanked =  new Button1("", "#00F", btnMmRanked, function() {
        gameType = 'ranked';
    });
    buttonMmRanked.x = 283;
    buttonMmRanked.y = 450;

    var buttonMmPrivate =  new Button1("", "#00F", btnMmPrivate, function() {
        gameType = 'private';
    });
    buttonMmPrivate.x = 366;
    buttonMmPrivate.y = 450;

    var buttonPlay = new Button1("", "#00F", btnFindGame, function() {
        text.text = 'searching for a game';
        assets.sendMSG('find_game', {gameType: gameType});
        this.parent.addChild(buttonCancel);
    });
    buttonPlay.x = 200;
    buttonPlay.y = 530;

    var buttonCancel =  new Button1("", "#00F", btnCancel, function() {
        assets.sendMSG('cancel_matchmaking');
        text.text = '';
        this.parent.removeChild(this);
    });
    buttonCancel.x = 200;
    buttonCancel.y = 630;

    this.addChild(buttonPlay, text, race, srace);
    this.addChild(raceHumans, raceBlabla);
    this.addChild(buttonMmCasual, buttonMmRanked, buttonMmPrivate);
};

p.msgStartGame = function(data){
    hideMenu();
    showGameInstance(data);
};

window.MenuScreen = createjs.promote(MenuScreen, "Container");
}());