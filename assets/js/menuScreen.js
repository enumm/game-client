//# sourceURL=menuScreen.js
(function() {

function MenuScreen() {
	this.Container_constructor();	
    this.gamePending = false;
	this.setup();
}

var p = createjs.extend(MenuScreen, createjs.Container);

p.setup = function() {
    var raceButtons = [];
    var leftMargin = 365;
    var topMargin = 110;

    assets.showMenuBackground();
    assets.showParticles();

    var lblSearchingForGame = new createjs.Text('', "20px Almendra", "#fff");
    var blackBox = new createjs.Shape();
    blackBox.name = 'blackBox';

    //var lblRace = new createjs.Text('Races:', "20px Almendra", "#fff");
    assets.sendMSG('get_user_statistics');
    var lblStats = new createjs.Text(statsString, "20px Almendra", "#fff");

    var btnRacePlebs =  new InitButton('btnRacePlebs', buttons.btnRacePlebs, function() {
        raceSelected = 'Plebs';
        var btnRP = menuScreen.getChildByName("btnRacePlebs");
        var btnRB = menuScreen.getChildByName("btnRaceBlablas")
        btnRP.bitmapHelper._isPressed  = true;
		btnRP.children[0].gotoAndStop(2);
		btnRB.bitmapHelper._isPressed  = false;
        btnRB.children[0].gotoAndStop(0);
    }, true);

    var btnRaceBlablas =  new InitButton('btnRaceBlablas', buttons.btnRaceBlablas, function() {
        raceSelected = 'BlaBlas'; 
        var btnRP = menuScreen.getChildByName("btnRacePlebs");
        var btnRB = menuScreen.getChildByName("btnRaceBlablas")
        btnRP.bitmapHelper._isPressed  = false;
		btnRP.children[0].gotoAndStop(0);
		btnRB.bitmapHelper._isPressed  = true;
        btnRB.children[0].gotoAndStop(2);
    }, true);

    var btnRaceLocked1 =  new InitButton('btnRaceLocked1', buttons.btnLocked, function() {
        console.log('not available yet');
    });

    lblSearchingForGame.y = 50;
    lblSearchingForGame.name = 'lblSearchingForGame';

    //TODO remove lblRace, lblSelectedRace
    // lblRace.x = 450;
    // lblRace.y = 80;

    btnRacePlebs.x = leftMargin;
    btnRacePlebs.y = topMargin;
    btnRacePlebs.name = "btnRacePlebs"
    btnRaceBlablas.x = leftMargin;
    btnRaceBlablas.y = topMargin + 100;
    btnRaceBlablas.name = "btnRaceBlablas"
    btnRaceLocked1.x = leftMargin;
    btnRaceLocked1.y = btnRaceBlablas.y + 100;
    btnRaceLocked1.name = "btnRaceLocked1"

    this.addChild(btnRacePlebs,btnRaceBlablas);
    this.addChild(btnRaceLocked1);
    this.addChild(blackBox, lblSearchingForGame);

    var btnMmCasual =  new InitButton("btnCasual", buttons.btnCasual, function() {
        gameType = 'casual';
        var btnMC = menuScreen.getChildByName("btnMmCasual");
        var btnMR = menuScreen.getChildByName("btnMmRanked")
        btnMC.bitmapHelper._isPressed  = true;
		btnMC.children[0].gotoAndStop(2);
		btnMR.bitmapHelper._isPressed  = false;
        btnMR.children[0].gotoAndStop(0);
    }, true);

    btnMmCasual.x = leftMargin+240+10;
    btnMmCasual.y = topMargin+240+70+20;
    btnMmCasual.name = "btnMmCasual"

    var btnMmRanked =  new InitButton("btnRanked", buttons.btnRanked, function() {
        gameType = 'ranked';
        var btnMC = menuScreen.getChildByName("btnMmCasual");
        var btnMR = menuScreen.getChildByName("btnMmRanked")
        btnMR.bitmapHelper._isPressed  = true;
		btnMR.children[0].gotoAndStop(2);
		btnMC.bitmapHelper._isPressed  = false;
        btnMC.children[0].gotoAndStop(0);
    }, true);
    btnMmRanked.x = leftMargin+240+10;
    btnMmRanked.y = topMargin+240+70+90+30;
    btnMmRanked.name = "btnMmRanked"

    var btnFindGame = new InitButton("btnPlay", buttons.btnPlay, function() {
        if(!this.parent.gamePending ){
            this.parent.SetStatusLabel('Searching for a game', false);
            assets.sendMSG('find_game', {gameType: gameType, race: raceSelected, statistics: userStats});
            this.parent.addChild(btnCancel);
            this.parent.gamePending = true;
        }else{
            alert('Game already pending.');
        }
    });
    btnFindGame.x = leftMargin+240+10+90+10;
    btnFindGame.y = topMargin+240+70+20;

    var btnHelp = new InitButton("btnHelp", buttons.btnHelp, function() {
        //TODO open help window
    });
    btnHelp.x = leftMargin;
    btnHelp.y = topMargin+430;

    //TODO make searching opponent window, move lblSearchingForGame, btnCancel
    var btnCancel =  new InitButton("btnCancel",buttons.Decline, function() {
        assets.sendMSG('cancel_matchmaking');
        this.parent.SetStatusLabel('', false);
        this.parent.gamePending = false;
        this.parent.removeChild(this);
        
    });
    btnCancel.x = 775;
    btnCancel.y = 25;

    var btnLogOut =  new InitButton("btnLogout", buttons.Logout, function() {
	    gapi.auth.signOut();

	    if(FB.getAccessToken()){
		    FB.logout(function(response) {
			});
	    }

        assets.socketLogOut();
	    mainPanel.show();
	    hideMenu();
	    showDebug();
    });
    btnLogOut.x = 1200;
    btnLogOut.y = 10;

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

p.initPrivateGame = function(){

    this.gamePending = true;
    var topMargin = 110;
    
    var lblSearchingForGame = this.getChildByName('lblSearchingForGame');

    this.SetStatusLabel('Waiting for friend to accept', true);

    var btnCancel =  new InitButton("cancel_private_send", buttons.Decline, function() {
        assets.sendMSG('cancel_matchmaking');
        this.parent.SetStatusLabel('', false);
        this.parent.gamePending = false;
        this.parent.removeChild(this);      
    });

    btnCancel.x = 450;
    btnCancel.y = 25;

    btnCancel.name = 'cancel_private_send';

    this.addChild(btnCancel);
};

p.showInvite = function(data){
    //alert('Game invite from: ' +data.user + ' game id: ' + data.gameId);
    if(!this.gamePending){
        var lblSearchingForGame = this.getChildByName('lblSearchingForGame');
        this.SetStatusLabel(data.user + ' wants to play private game with you', true);

        var btnCancel =  new InitButton("cancel_private", buttons.Decline, function() {
            assets.sendMSG('cancel_invite', {gameId: data.gameId});
            this.parent.SetStatusLabel('', false);
            this.parent.gamePending = false;

            var acceptButton = this.parent.getChildByName('btnAccept');

            if(acceptButton){
                this.parent.removeChild(acceptButton);  
            }

            this.parent.removeChild(this);      
        });

        var btnAccept =  new InitButton("btnAccept", buttons.Accept, function() {
            assets.sendMSG('accept_invite', {gameId: data.gameId, race: raceSelected});
        });

        btnAccept.x = 365;
        btnAccept.y =  25;
        btnAccept.name = 'btnAccept';
        
        btnCancel.x = btnAccept.x+ 70 +10;
        btnCancel.y = btnAccept.y;
        btnCancel.name = 'cancel_private';

        this.addChild(btnCancel, btnAccept);
    }
};

p.revokeInvite = function(){
    var lblSearchingForGame = this.getChildByName('lblSearchingForGame');
    this.SetStatusLabel('Invitation Canceled', false);
    this.gamePending = false;

    var btn = this.getChildByName('cancel_private');
    if(btn){
        this.removeChild(btn);  
    }

    var btn2 = this.getChildByName('cancel_private_send');
    if(btn2){
        this.removeChild(btn2);  
    }

    var btn3 = this.getChildByName('btnAccept');
    if(btn3){
        this.removeChild(btn3);  
    }
};

p.SetStatusLabel = function(text, buttons){
    var lblSearchingForGame = this.getChildByName('lblSearchingForGame');
    var blackBox = this.getChildByName('blackBox');

    if(!text){
        if(blackBox){
            blackBox.graphics.clear();    
        }

        lblSearchingForGame.text = '';
    }else{
        lblSearchingForGame.text = text;

        var lableWidth = lblSearchingForGame.getMeasuredWidth();
        var lableHeight = lblSearchingForGame.getMeasuredHeight();

        lblSearchingForGame.x = 640 - (lableWidth/2) + (buttons?80:0);

        if(blackBox){
            blackBox.graphics.clear();
            blackBox.graphics.beginFill('black');
            blackBox.graphics.drawRect(lblSearchingForGame.x - (buttons?200:30), lblSearchingForGame.y - 30, lableWidth + (buttons? 230:60), lableHeight + 60);
            blackBox.graphics.endFill();
            blackBox.alpha = 0.5;
        } 
    }
};

window.MenuScreen = createjs.promote(MenuScreen, "Container");
}());