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
        raceSelected = 'human';
        srace.text = raceSelected;
    });
    raceHumans.x = 200;
    raceHumans.y = 250;

    var raceBlabla =  new Button1("", "#00F", btnRaceBlablas,  function() {
        raceSelected = 'blabla'; 
        srace.text = raceSelected;
    });
    raceBlabla.x = 200;
    raceBlabla.y = 350;


    var buttonCancel =  new Button1("Cancel", "#00F", null, function() {
        assets.sendMSG('cancel_matchmaking');
        text.text = '';
        this.parent.removeChild(this);
    });
    buttonCancel.x = 500;
    buttonCancel.y = 300;

    var buttonPlay = new Button1("Find game", "#00F", null, function() {
        text.text = 'searching for a game';
        assets.sendMSG('find_game');
        this.parent.addChild(buttonCancel);
        //hideMenu();
        //showGameInstance();
    });
    buttonPlay.x = 500;
    buttonPlay.y = 200;

    this.addChild(buttonPlay, text, race, srace, raceHumans, raceBlabla);
};

p.msgStartGame = function(data){
    hideMenu();
    showGameInstance(data);
};

window.MenuScreen = createjs.promote(MenuScreen, "Container");
}());