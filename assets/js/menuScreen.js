//# sourceURL=menuScreen.js
(function() {

function MenuScreen() {
	this.Container_constructor();	
	this.setup();
}

var p = createjs.extend(MenuScreen, createjs.Container);

p.setup = function() {
    var raceButtons = [];
    var leftMargin = 450;
    var topMargin = 110;

    assets.showMenuBackground();
    assets.showParticles();

    var lblSearchingForGame = new createjs.Text('', "20px Arial", "#fff");
    var lblRace = new createjs.Text('Select race:', "20px Arial", "#fff");
    var lblSelectedRace = new createjs.Text(raceSelected, "20px Arial", "#fff");
    assets.sendMSG('get_user_statistics');
    var lblStats = new createjs.Text(statsString, "20px Arial", "#fff");

    var btnRacePlebs =  new InitButton('btnRacePlebs', buttons.btnRacePleb, function() {
        raceSelected = 'Plebs';
        lblSelectedRace.text = raceSelected;
    });

    var btnRaceBlablas =  new InitButton('btnRaceBlablas', buttons.btnRaceBlablas, function() {
        raceSelected = 'BlaBlas'; 
        lblSelectedRace.text = raceSelected;
    });

    lblSearchingForGame.x = 550;
    lblSearchingForGame.y = 100;
    //lblRace.x = leftMargin+240+10;
    //lblRace.y = 200;
    //lblSelectedRace.x = leftMargin+240+10;
    // lblSelectedRace.y = 220;

    btnRacePlebs.x = leftMargin;
    btnRacePlebs.y = topMargin;
    btnRaceBlablas.x = leftMargin;
    btnRaceBlablas.y = topMargin + 100;
    
    this.addChild(btnRacePlebs,btnRaceBlablas);
    this.addChild(lblSearchingForGame, lblRace, lblSelectedRace);

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
        assets.sendMSG('find_game', {gameType: gameType, race: raceSelected});
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
        friendScreen.showFriendPanel();
        //assets.sendMSG('cancel_matchmaking');
    });
    btnFriends.x = 200;
    btnFriends.y = 100;
    
    this.addChild(btnFriends,btnAddFriend);

    this.addChild(btnMmCasual, btnMmRanked, btnMmPrivate);
    this.addChild(btnFindGame);
    this.addChild(btnLogOut);

    var chatWindow = new ChatWindow();
    this.addChild(chatWindow);
    //--------------------------------------------
};

p.msgStartGame = function(data){
    hideMenu();
    showGameInstance(data);
};

window.MenuScreen = createjs.promote(MenuScreen, "Container");
}());