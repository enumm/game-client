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

    //labels--------------------------------------
    var lblSearchingForGame = new createjs.Text('', "20px Arial", "#fff");
    lblSearchingForGame.x = 550;
    lblSearchingForGame.y = 100;

    var lblRace = new createjs.Text('Select race:', "20px Arial", "#fff");
    lblRace.x = 200;
    lblRace.y = 200;

    var lblSelectedRace = new createjs.Text(raceSelected, "20px Arial", "#fff");
    lblSelectedRace.x = 200;
    lblSelectedRace.y = 220;

    assets.sendMSG('get_user_statistics');

    this.addChild(lblSearchingForGame, lblRace, lblSelectedRace);
    //--------------------------------------------

    //buttons-------------------------------------
    var btnRacePlebs =  new Button1("", "#00F", btnRacePlebsImg, function() {
        raceSelected = 'plebs';
        lblSelectedRace.text = raceSelected;
    });
    btnRacePlebs.x = 200;
    btnRacePlebs.y = 250;

    var btnRaceBlablas =  new Button1("", "#00F", btnRaceBlablasImg,  function() {
        raceSelected = 'blablas'; 
        lblSelectedRace.text = raceSelected;
    });
    btnRaceBlablas.x = 200;
    btnRaceBlablas.y = 350;

    var btnMmCasual =  new Button1("", "#00F", btnMmCasualImg, function() {
        gameType = 'casual';
    });
    btnMmCasual.x = 200;
    btnMmCasual.y = 450;

    var btnMmRanked =  new Button1("", "#00F", btnMmRankedImg, function() {
        gameType = 'ranked';
    });
    btnMmRanked.x = 283;
    btnMmRanked.y = 450;

    var btnMmPrivate =  new Button1("", "#00F", btnMmPrivateImg, function() {
        gameType = 'private';
    });
    btnMmPrivate.x = 366;
    btnMmPrivate.y = 450;

    var btnFindGame = new Button1("", "#00F", btnFindGameImg, function() {
        lblSearchingForGame.text = 'searching for a game';
        assets.sendMSG('find_game', {gameType: gameType});
        this.parent.addChild(btnCancel);
    });
    btnFindGame.x = 200;
    btnFindGame.y = 530;

    var btnCancel =  new Button1("", "#00F", btnCancelImg, function() {
        assets.sendMSG('cancel_matchmaking');
        lblSearchingForGame.text = '';
        this.parent.removeChild(this);
    });
    btnCancel.x = 200;
    btnCancel.y = 630;

    var btnLogOut =  new Button1("", "#00F", btnCancelImg, function() {
	    gapi.auth.signOut();

	    if(FB.getAccessToken()){
		    FB.logout(function(response) {
			});
	    }

	    mainPanel.show();
	    hideMenu();
	    showDebug();
    });
    btnLogOut.x = 800;
    btnLogOut.y = 630;

    var btnAddFriend =  new Button1("Add Friend", "#00F", null, function() {
        friendScreen.showAddFriendInput()
        //assets.sendMSG('cancel_matchmaking');
    });
    btnAddFriend.x = 200;
    btnAddFriend.y = 150;

    var btnFriends =  new Button1("Friends", "#00F", null, function() {
        //assets.sendMSG('cancel_matchmaking');
    });
    btnFriends.x = 200;
    btnFriends.y = 100;
    
    this.addChild(btnFriends,btnAddFriend);
    this.addChild(btnRacePlebs, btnRaceBlablas);
    this.addChild(btnMmCasual, btnMmRanked, btnMmPrivate);
    this.addChild(btnFindGame);
    this.addChild(btnLogOut);
    //--------------------------------------------
};

p.msgStartGame = function(data){
    hideMenu();
    showGameInstance(data);
};

window.MenuScreen = createjs.promote(MenuScreen, "Container");
}());