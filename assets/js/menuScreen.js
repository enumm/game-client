//# sourceURL=menuScreen.js
(function() {

function MenuScreen() {
	this.Container_constructor();	
	this.setup();
}

var p = createjs.extend(MenuScreen, createjs.Container);

p.setup = function() {
    var raceButtons = [];
    var leftMargin = 400;
    var topMargin = 110;

    assets.showMenuBackground();
    assets.showParticles();

    var lblSearchingForGame = new createjs.Text('', "20px Arial", "#fff");
    var lblRace = new createjs.Text('Select race:', "20px Arial", "#fff");
    var lblSelectedRace = new createjs.Text(raceSelected, "20px Arial", "#fff");
    assets.sendMSG('get_user_statistics');
    var lblStats = new createjs.Text(statsString, "20px Arial", "#fff");

    var btnRacePlebs =  new InitButton('btnRacePlebs', buttons.btnRacePlebs, function() {
        raceSelected = 'Plebs';
        lblSelectedRace.text = raceSelected;
    });

    var btnRaceBlablas =  new InitButton('btnRaceBlablas', buttons.btnRaceBlablas, function() {
        raceSelected = 'BlaBlas'; 
        lblSelectedRace.text = raceSelected;
    });

    var btnRaceLocked1 =  new InitButton('btnRaceLocked1', buttons.btnLocked, function() {
        console.log('not available yet');
    });

    lblSearchingForGame.x = 550;
    lblSearchingForGame.y = 50;

    //TODO remove lblRace, lblSelectedRace
    lblRace.x = 50;
    lblRace.y = 50;
    lblSelectedRace.x = 50;
    lblSelectedRace.y = 75;

    btnRacePlebs.x = leftMargin;
    btnRacePlebs.y = topMargin;
    btnRaceBlablas.x = leftMargin;
    btnRaceBlablas.y = topMargin + 100;
    btnRaceLocked1.x = leftMargin;
    btnRaceLocked1.y = btnRaceBlablas.y + 100;

    this.addChild(btnRacePlebs,btnRaceBlablas);
    this.addChild(btnRaceLocked1);
    this.addChild(lblSearchingForGame, lblRace, lblSelectedRace);

    var btnMmCasual =  new InitButton("btnCasual", buttons.btnCasual, function() {
        gameType = 'casual';
    });

    btnMmCasual.x = leftMargin+240+10;
    btnMmCasual.y = topMargin+240+70+20;

    var btnMmRanked =  new InitButton("btnRanked", buttons.btnRanked, function() {
        gameType = 'ranked';
    });
    btnMmRanked.x = leftMargin+240+10;
    btnMmRanked.y = topMargin+240+70+90+30;

    var btnFindGame = new InitButton("btnPlay", buttons.btnPlay, function() {
        lblSearchingForGame.text = 'searching for a game';
        assets.sendMSG('find_game', {gameType: gameType, race: raceSelected});
        this.parent.addChild(btnCancel);
    });
    btnFindGame.x = leftMargin+240+10+90+10;
    btnFindGame.y = topMargin+240+70+20;

    var btnHelp = new InitButton("btnHelp", buttons.btnHelp, function() {
        //TODO open help window
    });
    btnHelp.x = leftMargin;
    btnHelp.y = topMargin+430;

    //TODO make searching opponent window, move lblSearchingForGame, btnCancel
    var btnCancel =  new Button1("", "#00F", btnCancelImg, function() {
        assets.sendMSG('cancel_matchmaking');
        lblSearchingForGame.text = '';
        this.parent.removeChild(this);
    });
    btnCancel.x = 100;
    btnCancel.y = topMargin+430;

    var btnLogOut =  new InitButton("btnLogout", buttons.btnLogout, function() {
	    gapi.auth.signOut();

	    if(FB.getAccessToken()){
		    FB.logout(function(response) {
			});
	    }

	    mainPanel.show();
	    hideMenu();
	    showDebug();
    });
    btnLogOut.x = 1200;
    btnLogOut.y = 10;

    //TODO friends panel
    // var btnAddFriend =  new Button1("Add Friend", "#00F", null, function() {
    //     friendScreen.showAddFriendInput()
    // });
    // btnAddFriend.x = 100;
    // btnAddFriend.y = 150;

    // var btnFriends =  new Button1("Friends", "#00F", null, function() {
    //     friendScreen.showFriendPanel();
    // });
    // btnFriends.x = 100;
    // btnFriends.y = 100;
    
    // this.addChild(btnFriends,btnAddFriend);

    this.addChild(btnMmCasual, btnMmRanked);
    this.addChild(btnFindGame);
    this.addChild(btnLogOut, btnHelp);

    var friendWindow = new FriendWindow();
    this.addChild(friendWindow);

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