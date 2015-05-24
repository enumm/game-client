var tileset;
var tilesetPlebs;
var tilesetBlaBlas;

var tilePlebGround, tilePlebRanged, tilePlebFlying, tileBlaGround, tileBlaRanged, tileBlaFlying;

var buttons = {
    btnRaceBlablas: null,
    btnRacePlebs:null,
    btnLocked: null,
    btnCancel:null,
    btnLogout:null,
    btnHelp:null,
    btnCasual:null,
    btnRanked:null,
    btnPlay:null,
    btnEmpty:null
};

var loginBackGround;
var overlayImg;
var stage;
var mapData;

//debug vars
var debug = false;
var debugChatDOM; //this is chatDOM
//debug vars end

var lastX = 0;
var lastY = 0;
var tree;
var socket;

var serverUpdateTimer = 0;
var moneyUpdateTimer = 0;

var username;
var raceSelected = 'Plebs';
var gameType = 'casual';
var userFriends = [];
var userStats = [];
var userCurrentSelection;
var statsString = '';

//check other places
var instanceData = {money: 5, castleHp: 1000, buildings: [], units: [], buildingCount: 0, unitCount: 0};
var opponentData = {money: 5, castleHp: 1000, buildings: [], units: [], buildingCount: 0, unitCount: 0};
    
//proton vars
var renderer;
var proton;
emitterFire = null;
emitterRain = null;
emitterRain1 = null;
emitterRain2 = null;
var fireParticles = [];
var rainParticles = [];

//pathfinding
var finder;

//fields
var fpsLabel;
var loadingLabel;

// file loading
var manifest;
var preload;

//game screens
var loginScreen;
var debugScreen;
var menuScreen;
var gameInstanceScreen;

function translateRank(rank){
    var ranks = [
        {rank:"potato", strength:2},
        {rank:"pleb", strength:2},
        {rank:"wooden", strength:3},
        {rank:"plastic", strength:3},
        {rank:"bronze", strength:3},
        {rank:"silver", strength:4},
        {rank:"gold", strength:4},
        {rank:"platinum", strength:5},
        {rank:"diamond", strength:5},
        {rank:"keepo", strength:5},
        {rank:"klappa", strength:5},
        {rank:"pogchamp", strength:5},
        {rank:"dank memes", strength:5},
        {rank:"broken dreams", strength:8},
        {rank:"kappa", strength:5000}
    ];

    var yourRank = ranks[0].rank;

    for (var i = 0, len = ranks.length; i < len; i++) {
        if(rankCalculation(rank, ranks[i].strength)){
            return ranks[i].rank;
        }else{
            rank -= ranks[i].strength;
        }
    }

    function rankCalculation(rank, rankStrength){
        for(var wins = 0; wins < rankStrength; wins++){
            if(!rank){
                return true;
            }
            rank--;
        }
        return false;
    };
}

function showDebug(){
    debugScreen = null;
    delete debugScreen;
    debugScreen = new DebugScreen();
    stage.addChild(debugScreen);
    stage.setChildIndex ( fpsLabel,  1);
}

function hideDebug(){
    debugScreen.destroy();
 	stage.removeChild(debugScreen);
    debugScreen = null;
    delete debugScreen;
}

function showMenu(){
    menuScreen = null;
    delete menuScreen;
    menuScreen = new MenuScreen();
    stage.addChild(menuScreen);
    stage.setChildIndex ( fpsLabel,  1);
    debugChatDOM = menuScreen.getChildByName('chatWindow').children[2];
    var btnRP = menuScreen.getChildByName("btnRacePlebs");
	var btnMC = menuScreen.getChildByName("btnMmCasual");

	btnRP.OnClick()
	btnMC.OnClick()
}

function hideMenu(){
    var chatElement = document.getElementById("mainChat");
    $(chatElement).hide();
    var friendsElement = document.getElementById("mainFriends");
    $(friendsElement).hide();
    stage.removeChild(menuScreen);
    menuScreen = null;
    delete menuScreen;
}

function showGameInstance(data){
    assets.destroyParticles();
    assets.hideMenuBackground();
    stage.removeAllChildren();

    serverUpdateTimer = 0;
    moneyUpdateTimer = 0;
    instanceData = {money: 5, castleHp: 1000, buildings: [], units: [], buildingCount: 0, unitCount: 0};
    opponentData = {money: 5, castleHp: 1000, buildings: [], units: [], buildingCount: 0, unitCount: 0};

    gameInstanceScreen = null;
    delete gameInstanceScreen;
    gameInstanceScreen = new GameInstanceScreen(data);
    stage.addChild(gameInstanceScreen);
    stage.addChild(fpsLabel);
    stage.setChildIndex ( fpsLabel,  1);
}

function hideGameInstance(){
    var chatElement = document.getElementById("ingameChat");
    $(chatElement).hide();
    var chatArea = document.getElementById("chatAreaIngame");
    $(chatArea ).html('');
    
    stage.removeChild(gameInstanceScreen);
    gameInstanceScreen = null;
    delete gameInstanceScreen;
}

function OnResizeCalled() {
    var gameWidth = window.innerWidth;
	var gameHeight = window.innerHeight;
	var scaleToFitX = gameWidth / 1280;
	var scaleToFitY = gameHeight / 720;

	var currentScreenRatio = gameWidth / gameHeight;
	var optimalRatio = Math.min(scaleToFitX, scaleToFitY);

	if (currentScreenRatio >= 1.77 && currentScreenRatio <= 1.79) {
	    canvas.style.width = gameWidth + "px";
	    canvas.style.height = gameHeight + "px";
	}
	else {
	    canvas.style.width = 1280 * optimalRatio + "px";
	    canvas.style.height = 720 * optimalRatio + "px";
	}
    var pageWidth = $('.canvasHolder').width();
    var margin = (pageWidth - parseInt(canvas.style.width))/2;
    canvas.style.marginLeft = margin + 'px';

    var loginDiv = $('#mainPanelContainer');
    var loginBlock = stage.getChildByName('MainPanel');

    if(loginBlock){
        loginBlock.x = ((parseInt(canvas.style.width) * 0.5) - loginDiv.width() * 0.5) + margin;
        loginBlock.y = -(parseInt(canvas.style.height) * 0.5) - loginDiv.height() * 0.5;
    }

    if(menuScreen){
        menuScreen.getChildByName('chatWindow').setChatScale();
        menuScreen.getChildByName('chatWindow').setChatPosition();
        menuScreen.getChildByName('friendWindow').setFriendScale();
        menuScreen.getChildByName('friendWindow').setFriendPosition();
    }

    if(gameInstanceScreen){
        gameInstanceScreen.getChildByName('ingameChat').setChatScale();
        gameInstanceScreen.getChildByName('ingameChat').setChatPosition();
    }

   //hideAddressbar('#canvasHolder');
}

function loadSound(event) {
    createjs.Sound.play('theme', {loop: -1});
}

window.onload = function(){
    createjs.Sound.on("fileload", loadSound);
    createjs.Sound.registerSound("assets/sound/theme.mp3", 'theme');
    createjs.Sound.setVolume(0.2);

    //setting stage
    fpsLabel = new createjs.Text('', "20px Almendra", "#fff");
    fpsLabel.x = 2;
    fpsLabel.y = 2;

    //stage
    stage = new createjs.Stage("canvas");
    createjs.Touch.enable(stage);
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true;

    loadingLabel = new createjs.Text("Loading", "bold 24px Almendra", "#FFFFFF");
    loadingLabel.name = 'loadingLabel';
    loadingLabel.maxWidth = 1000;
    loadingLabel.textAlign = "center";
    loadingLabel.textBaseline = "middle";
    loadingLabel.x = canvas.width / 2;
    loadingLabel.y = canvas.height / 2;

    stage.addChild(loadingLabel);
    stage.update();     //update the stage to show text

    //loading files
    var assetsPath = "assets/";

    //loading files
    var assetsPath = "assets/";

    manifest = [
        {id: "constants", src: "js/constants.js"},

        {id: "jquery-2", src: "js/jquery-2.1.3.min.js"},
        {id: "assets", src: "js/proton-1.0.0.min.js"},
        {id: "pathFinding", src: "js/pathfinding-browser.min.js"},

        {id: "button", src: "js/buttonDeprecated.js"},
        {id: "buttonNX", src: "js/button.js"},
        {id: "buttonHelper", src: "js/buttonHelper.js"},
        {id: "chatWindow", src: "js/chatWindow.js"},
        {id: "helpWindow", src: "js/helpWindow.js"},
        {id: "ingameChatWindow", src: "js/ingameChat.js"},
        {id: "friendsWindow", src: "js/friendsWindow.js"},
        {id: "assets", src: "js/assets.js"},
        {id: "debugScreen", src: "js/debugScreen.js"},
        {id: "mainPanel", src: "js/mainPanel.js"},
        {id: "menuScreen", src: "js/menuScreen.js"},
        {id: "userInfo", src: "js/userInfo.js"},
        {id: "castle", src: "js/castle.js"},
        {id: "unit", src: "js/unit.js"},
        {id: "building", src: "js/building.js"},
        {id: "instanceScreen", src: "js/gameInstanceScreen.js"},
        {id: "serverInterp", src: "js/serverInterpreter.js"},
        {id: "gameOverlay", src: "js/gameOverlay.js"},
        
        {id: "css", src: "css/style.css"},

        {id: "tileset", src: "img/tileCheck.png"},
        {id: "tilesetPlebs", src: "img/plebsTile.png"},
        {id: "tilesetBlaBlas", src: "img/blablasTile.png"},

        {id: "tilesetPlebGround", src: "img/groundPleb1.png"},
        {id: "tilesetPlebGround2", src: "img/groundPleb2.png"},
        {id: "tilesetPlebRanged", src: "img/rangedPleb1.png"},
        {id: "tilesetPlebRanged2", src: "img/rangedPleb2.png"},
        {id: "tilesetPlebFlying", src: "img/groundPleb2.png"},
        {id: "tilesetPlebFlying2", src: "img/groundPleb2.png"},

        {id: "tilesetBlaGround", src: "img/groundPleb1.png"},
        {id: "tilesetBlaGround2", src: "img/groundPleb2.png"},
        {id: "tilesetBlaRanged", src: "img/rangedPleb1.png"},
        {id: "tilesetBlaRanged2", src: "img/rangedPleb2.png"},
        {id: "tilesetBlaFlying", src: "img/groundPleb1.png"},
        {id: "tilesetBlaFlying2", src: "img/groundPleb1.png"},

        {id: "btnSheetBlaBlaRace", src: "img/buttons/shtBtnBlablas.png"},
        {id: "btnSheetPlebRace", src: "img/buttons/shtBtnPlebs.png"},
        {id: "btnSheetCancel", src: "img/buttons/shtBtnCancel.png"},
        {id: "btnSheetHelp", src: "img/buttons/shtBtnHelp.png"},
        {id: "btnSheetCasual", src: "img/buttons/shtBtnCasual.png"},
        {id: "btnSheetRanked", src: "img/buttons/shtBtnRanked.png"},
        {id: "btnSheetLocked", src: "img/buttons/shtBtnLocked.png"},
        {id: "btnSheetEmpty", src: "img/buttons/shtBtnEmpty.png"},
        {id: "btnSheetPlay", src: "img/buttons/shtBtnPlay.png"},
        {id: "btnSheetAccept", src: "img/buttons/shtBtnAccept.png"},
        {id: "btnSheetDecline", src: "img/buttons/shtBtnDecline.png"},
        {id: "btnSheetChat", src: "img/buttons/shtBtnChat.png"},
        {id: "btnSheetFriends", src: "img/buttons/shtBtnFriends.png"},
        {id: "btnSheetBuild", src: "img/buttons/shtBtnBuild.png"},
        {id: "btnSheetStart", src: "img/buttons/shtBtnStart.png"},
        {id: "btnSheetStop", src: "img/buttons/shtBtnStop.png"},
        {id: "btnSheetSell", src: "img/buttons/shtBtnSell.png"},
        {id: "btnSheetLeft", src: "img/buttons/shtBtnLeft.png"},
        {id: "btnSheetMusic", src: "img/buttons/shtBtnMusic.png"},
        {id: "btnSheetContinue", src: "img/buttons/shtBtnContinue.png"},

        {id: "btnSheetPlebGround1", src: "img/buttons/shtBtnPlebGround1.png"},
        {id: "btnSheetPlebGround2", src: "img/buttons/shtBtnPlebGround2.png"},
        {id: "btnSheetPlebRanged1", src: "img/buttons/shtBtnPlebRanged1.png"},
        {id: "btnSheetPlebRanged2", src: "img/buttons/shtBtnPlebRanged2.png"},
        {id: "btnSheetPlebFlying1", src: "img/buttons/shtBtnPlebFlying1.png"},
        {id: "btnSheetPlebFlying2", src: "img/buttons/shtBtnPlebFlying2.png"},

        {id: "btnSheetBlaGround1", src: "img/buttons/shtBtnBlaGround1.png"},
        {id: "btnSheetBlaGround2", src: "img/buttons/shtBtnBlaGround2.png"},
        {id: "btnSheetBlaRanged1", src: "img/buttons/shtBtnBlaRanged1.png"},
        {id: "btnSheetBlaRanged2", src: "img/buttons/shtBtnBlaRanged2.png"},
        {id: "btnSheetBlaFlying1", src: "img/buttons/shtBtnBlaFlying1.png"},
        {id: "btnSheetBlaFlying2", src: "img/buttons/shtBtnBlaFlying2.png"},

        {id: "bOptions", src: "img/bOptions.png"},
        {id: "bSelection", src: "img/bSelection.png"},
        {id: "mainMenu", src: "img/mainMenu.jpg"},

        {id: "overlay", src: "img/overlay.png"},
        {id: "buttonImg", src: "img/button.png"},
        {id: "btnCancel", src: "img/btnCancel.jpg"},

        {id: "loginBackGround", src: "img/bg1.jpg"},
        {id: "texture1", src : "img/c1.png"},
        {id: "texture2", src : "img/r1.png"},

        {id: "mapData", src: "json/map.json"}
    ];

    preload = new createjs.LoadQueue(true, assetsPath);
    preload.on("complete", handleComplete);
    preload.on("fileload", handleFileLoad);
    preload.on("progress", handleProgress);

    window.addEventListener("resize", OnResizeCalled, false);

    preload.loadManifest(manifest);
}

function handleProgress(event) {
    loadingLabel.text = "Loading " + (preload.progress * 100 | 0) + "%";
    stage.update();
}

function handleFileLoad(event) {
    var item = event.item;
    var result = event.result;
    var id = event.item.id;

    switch (item.type) {
        case createjs.AbstractLoader.CSS:
            document.body.appendChild(result);
            break;
        case createjs.AbstractLoader.JAVASCRIPT:
            document.body.appendChild(result);
            break;
    }
}

function handleComplete(event) {
    buttonImg = preload.getResult("buttonImg");
    overlayImg = preload.getResult("overlay");
    loginBackGround = preload.getResult("loginBackGround");

    var animationSpeed = {
        Attack: 0.06,
        Walk: 0.15,
        Death: 0.05
    };

    //create sprites
    var data = {
        images: [preload.getResult("tilesetPlebGround")],
        frames: {width:45, height:60},
        animations: {
            stand:0,
            walkBotLeft:[0, 4, "walkBotLeft", animationSpeed.Walk],
            attackBotLeft:[5,8,"walkBotLeft", animationSpeed.Attack],
            dieBotLeft:[9,11,11,0.05],

            walkBotRight:[12, 16, "walkBotRight", animationSpeed.Walk],
            attackBotRight:[17,20,"walkBotRight", animationSpeed.Attack],
            dieBotRight:[21,23,23,animationSpeed.Death],

            walkTopLeft:[24, 28, "walkTopLeft", animationSpeed.Walk],
            attackTopLeft:[29,32,"walkTopLeft", animationSpeed.Attack],
            dieTopLeft:[33,35,35,animationSpeed.Death],

            walkTopRight:[36, 40, "walkTopRight", animationSpeed.Walk],
            attackTopRight:[41, 44, "walkTopRight", animationSpeed.Attack],
            dieTopRight:[45, 47, 47, animationSpeed.Death],

            walkRight:[48, 52, "walkRight", animationSpeed.Walk],
            attackRight:[53, 56, "walkRight", animationSpeed.Attack],
            dieRight:[57, 59, 59, animationSpeed.Death],

            walkLeft:[60, 64, "walkLeft", animationSpeed.Walk],
            attackLeft:[65, 68, "walkLeft", animationSpeed.Attack],
            dieLeft:[69, 71, 71, animationSpeed.Death],

            walkBot:[72, 76, "walkBot", animationSpeed.Walk],
            attackBot:[77, 80, "walkBot", animationSpeed.Attack],
            dieBot:[81, 83, 83, animationSpeed.Death],

            walkTop:[84, 88, "walkTop", animationSpeed.Walk],
            attackTop:[89, 92, "walkTop", animationSpeed.Attack],
            dieTop:[93, 95, 95, animationSpeed.Death],
        }
    };

    buttons.BlaHut = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetBlaGround1")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.BlaHut2 = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetBlaGround2")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.BlaRanger = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetBlaRanged1")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.BlaRanger2 = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetBlaRanged2")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.BlaFlying = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetBlaFlying1")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.BlaFlying2 = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetBlaFlying2")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.PlebHut = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetPlebGround1")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.PlebHut2 = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetPlebGround2")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.PlebRanger = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetPlebRanged1")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.PlebRanger2 = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetPlebRanged2")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.PlebFlying = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetPlebFlying1")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.PlebFlying2 = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetPlebFlying2")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });


    buttons.Accept = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetAccept")],
                                   frames: {width: 70, height: 70},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.Decline = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetDecline")],
                                   frames: {width: 70, height: 70},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.Friends = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetFriends")],
                                   frames: {width: 50, height: 100},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.Chat = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetChat")],
                                   frames: {width: 50, height: 100},
                                   animations: { out: 2, over: 1, down: 0 }
                               });

    buttons.btnRaceBlablas = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetBlaBlaRace")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.btnRacePlebs = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetPlebRace")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.Cancel = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetDecline")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.Logout = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetDecline")],
                                   frames: {width: 70, height: 70},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.btnHelp = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetHelp")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.btnCasual = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetCasual")],
                                   frames: {width: 90, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.btnRanked = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetRanked")],
                                   frames: {width: 90, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.btnPlay = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetPlay")],
                                   frames: {width: 190, height: 190},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.btnEmpty = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetEmpty")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.Continue = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetContinue")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.btnLocked = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetLocked")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.Build = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetBuild")],
                                   frames: {width: 90, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.Start = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetStart")],
                                   frames: {width: 70, height: 70},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.Stop = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetStop")],
                                   frames: {width: 70, height: 70},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.Sell = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetSell")],
                                   frames: {width: 70, height: 70},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.MusicOn = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetMusic")],
                                   frames: {width: 70, height: 70},
                                   animations: { out: 0, over: 1, down: 1 }
                               });

    buttons.MusicOff = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetMusic")],
                                   frames: {width: 70, height: 70},
                                   animations: { out: 1, over: 0, down: 0 }
                               });

    buttons.Music = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetMusic")],
                                   frames: {width: 70, height: 70},
                                   animations: { out: 0, over: 1, down: 1 }
                               });

    buttons.Left = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetLeft")],
                                   frames: {width: 70, height: 70},
                                   animations: { out: 0, over: 1, down: 1 }
                               });

    tilePlebGround = new createjs.Sprite(new createjs.SpriteSheet(data), "walkBot");

    data.images = [preload.getResult("tilesetPlebRanged")];
    tilePlebRanged = new createjs.Sprite(new createjs.SpriteSheet(data), "walkBot");

    data.images = [preload.getResult("tilesetPlebFlying")];
    tilePlebFlying = new createjs.Sprite(new createjs.SpriteSheet(data), "walkBot");

    data.images = [preload.getResult("tilesetBlaGround")];
    tileBlaGround = new createjs.Sprite(new createjs.SpriteSheet(data), "walkBot");

    data.images = [preload.getResult("tilesetBlaRanged")];
    tileBlaRanged = new createjs.Sprite(new createjs.SpriteSheet(data), "walkBot");

    data.images = [preload.getResult("tilesetBlaFlying")];
    tileBlaFlying = new createjs.Sprite(new createjs.SpriteSheet(data), "walkBot");

    //other loaded data
    var texture1 = new createjs.Shape(new createjs.Graphics().beginBitmapFill(preload.getResult("texture1")).drawRect(0, 0, 80, 80));
    texture1.regX = 40;
    texture1.regY = 40;

    fireParticles.push(texture1);

    var texture2 = new createjs.Shape(new createjs.Graphics().beginBitmapFill(preload.getResult("texture2")).drawRect(0, 0, 80, 80));
    texture2.regX = 40;
    texture2.regY = 40;

    rainParticles.push(texture2);

    mapData = preload.getResult("mapData");

    var w = mapData.tilesets[0].tilewidth;
    var h = mapData.tilesets[0].tileheight;
    var imageData = {
        images : [ preload.getResult("tileset") ],
        frames : {
            width : w,
            height : h
        }
    };

    tileset = new createjs.Sprite(new createjs.SpriteSheet(imageData));
   
    var imageDataRace = {
        images : [  preload.getResult("tilesetPlebs") ],
        frames : {
            width : 128,
            height : 128
        }
    };
    
    tilesetPlebs = new createjs.Sprite(new createjs.SpriteSheet(imageDataRace));

    imageDataRace.images = [preload.getResult("tilesetBlaBlas")];
    tilesetBlaBlas = new createjs.Sprite(new createjs.SpriteSheet(imageDataRace));

    console.log('Loading complete');

    stage.removeChild(loadingLabel);
    loadingLabel = null;

    stage.addChild(fpsLabel);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tick);

    assets.showMenuBackground();
    assets.showParticles();

    if(debug){
        showDebug();
    }

    mainPanel.init();

    FB.getLoginStatus(function(response) {
        mainPanel.statusChangeCallback(response);
    });

    render_google_btn();

    OnResizeCalled();
}

var hideAddressbar = function () {
	if (!location.hash && window.addEventListener) {
	var zero_or_one = ( /iPhone|iPad/.test(navigator.userAgent) && !/Opera Mini/.test(navigator.userAgent) ) ? 0 : 1;

	window.addEventListener( "load", function(){
		setTimeout(function(){
			if( window.pageYOffset < 20 ){
						window.scrollTo( 0, zero_or_one );
					}
				}, 0);
			}, false );
		}
};

function render_google_btn() {
    gapi.signin.render('customBtn', {
        'redirecturi':  "postmessage",
        'accesstype':   "offline",
        'callback':     "signinCallback",
        'scope':        "https://www.googleapis.com/auth/plus.login",
        'clientid':     "366641623880-nk0vnd991ajmhe5sg8fhkcr8b8bjnlbi.apps.googleusercontent.com",
        'cookiepolicy': "single_host_origin"
    });
}

function tick(event) {
    stage.update();
    fpsLabel.text = (createjs.Ticker.getMeasuredFPS()|0);

    //particles behind menu elements
    if(menuScreen)
    {
        stage.swapChildrenAt(stage.children.length - 1, stage.getChildIndex(menuScreen));
    }

    if(gameInstanceScreen){

        moneyUpdateTimer += event.delta/1000;
        if(moneyUpdateTimer >= 10)
        {
            instanceData.money += 5;
            moneyUpdateTimer = 0;
        }

        gameInstanceScreen.drawUpdate(event.delta/1000);
        assets.orderCanvas();
    }

    if (proton) {
        proton.update();
    }
}