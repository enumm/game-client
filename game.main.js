var tileset;
var tilesetPlebs;
var tilesetBlaBlas;

var tilePlebGround, tilePlebRanged, tilePlebFlying, tileBlaGround, tileBlaRanged, tileBlaFlying;

var buttonImg;
var btnRacePlebsImg = [];
var btnRaceBlablasImg = [];
var btnMmCasualImg = [];
var btnMmRankedImg = [];
var btnMmPrivateImg = [];
var btnFindGameImg = [];
var btnCancelImg = [];
var buttons = {
    btnRaceBlabla: null,
    btnRacePleb:null,
    btnCancel:null,
    btnLogout:null,
    btnHelp:null,
    btnCasual:null,
    btnRanked:null,
    btnPlay:null
    };

var loginBackGround;
var overlayImg;
var stage;
var mapData;

//debug vars
var debug = true;
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
var userCurrentSelection;
var statsString = '';

//check other places
var instanceData = {money: 5, castleHp: 1000, buildings: [], units: [], buildingCount: 0, unitCount: 0};
var opponentData = {money: 5, castleHp: 1000, buildings: [], units: [], buildingCount: 0, unitCount: 0};
    
//proton vars
var renderer;
var proton;
var emitter;
var textures = [];

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
        {rank:"kappa", strength:0}
    ];

    var yourRank = ranks[0].rank;

    for(var i = 0; i < ranks.length; i++){
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
}

function hideMenu(){
    var chatElement = document.getElementById("mainChat");
    $(chatElement).hide();
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
    }

   //hideAddressbar('#canvasHolder');
}

window.onload = function(){
    //setting stage
    fpsLabel = new createjs.Text('', "20px Arial", "#0f0");
    fpsLabel.x = 10;
    fpsLabel.y = 10;

    //stage
    stage = new createjs.Stage("canvas");
    createjs.Touch.enable(stage);
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true;

    loadingLabel = new createjs.Text("Loading", "bold 24px Arial", "#FFFFFF");
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

    manifest = [
        {id: "jquery-2", src: "js/jquery-2.1.3.min.js"},
        {id: "assets", src: "js/proton-1.0.0.min.js"},
        {id: "pathFinding", src: "js/pathfinding-browser.min.js"},

        {id: "button", src: "js/button.js"},
        {id: "buttonNX", src: "js/butonPisauAntMergeNX.js"},
        {id: "chatWindow", src: "js/chatWindow.js"},
        {id: "assets", src: "js/assets.js"},
        {id: "debugScreen", src: "js/debugScreen.js"},
        {id: "mainPanel", src: "js/mainPanel.js"},
        {id: "menuScreen", src: "js/menuScreen.js"},
        {id: "castle", src: "js/castle.js"},
        {id: "unit", src: "js/unit.js"},
        {id: "building", src: "js/building.js"},
        {id: "instanceScreen", src: "js/gameInstanceScreen.js"},
        {id: "serverInterp", src: "js/serverInterpreter.js"},
        {id: "gameOverlay", src: "js/gameOverlay.js"},
        {id: "friendScreen", src: "js/friendScreen.js"},
        {id: "constants", src: "js/constants.js"},

        {id: "css", src: "css/style.css"},

        {id: "tileset", src: "img/tileCheck.png"},
        {id: "tilesetPlebs", src: "img/plebsTile.png"},
        {id: "tilesetBlaBlas", src: "img/blablasTile.png"},

        {id: "tilesetPlebGround", src: "img/groundPleb.png"},
        {id: "tilesetPlebFlying", src: "img/flyingPleb.png"},
        {id: "tilesetPlebRanged", src: "img/rangedPleb.png"},

        {id: "tilesetBlaGround", src: "img/groundBla.png"},
        {id: "tilesetBlaFlying", src: "img/flyingBla.png"},
        {id: "tilesetBlaRanged", src: "img/rangedBla.png"},

        {id: "btnSheetBlaBlaRace", src: "img/buttons/raceButtons_blablaBtnSheet.jpg"},
        {id: "btnSheetPlebRace", src: "img/buttons/raceButtons_plebBtnSheet.jpg"},
        {id: "btnSheetCancel", src: "img/buttons/textButtons_cancelBtnSheet.jpg"},
        {id: "btnSheetLogout", src: "img/buttons/sqButtons_logoutBtnSheet.jpg"},
        {id: "btnSheetHelp", src: "img/buttons/textButtons_helpBtnSheet.jpg"},
        {id: "btnSheetCasual", src: "img/buttons/sqButtons_casualBtnSheet.jpg"},
        {id: "btnSheetRanked", src: "img/buttons/sqButtons_rankedBtnSheet.jpg"},
        {id: "btnSheetPlay", src: "img/buttons/sqButtons_playBtnSheet.jpg"},

        // {id: "btnSheetRanked", src: "img/rangedBla.png"},
        // {id: "btnSheetCasual", src: "img/rangedBla.png"},
        // {id: "btnSheetPlay", src: "img/rangedBla.png"},

        {id: "overlay", src: "img/overlay.png"},
        {id: "buttonImg", src: "img/button.png"},
        {id: "btnRacePlebs", src: "img/race_plebs.jpg"},
        {id: "btnRaceBlablas", src: "img/race_blablas.jpg"},
        {id: "btnMmCasual", src: "img/mmBtnCasual.jpg"},
        {id: "btnMmRanked", src: "img/mmBtnRanked.jpg"},
        {id: "btnMmPrivate", src: "img/mmBtnPrivate.jpg"},
        {id: "btnFindGame", src: "img/btnFindGame.jpg"},
        {id: "btnCancel", src: "img/btnCancel.jpg"},

        {id: "loginBackGround", src: "img/bg1.jpg"},
        {id: "texture1", src : "img/c1.png"},

        {id: "mapData", src: "json/map.json"},
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
    tileset = preload.getResult("tileset");
    btnMmCasualImg[0] = preload.getResult("btnMmCasual");
    btnMmRankedImg[0] = preload.getResult("btnMmRanked");
    btnMmPrivateImg[0] = preload.getResult("btnMmPrivate");
    btnRacePlebsImg[0] = preload.getResult("btnRacePlebs");
    btnFindGameImg[0] = preload.getResult("btnFindGame");
    btnCancelImg[0] = preload.getResult("btnCancel");
    btnRaceBlablasImg[0] = preload.getResult("btnRaceBlablas");
    overlayImg = preload.getResult("overlay");
    loginBackGround = preload.getResult("loginBackGround");

    tilesetPlebs = preload.getResult("tilesetPlebs");
    tilesetBlaBlas = preload.getResult("tilesetBlaBlas");

    //create sprites
    var data = {
        images: [preload.getResult("tilesetPlebGround")],
        frames: {width:24, height:60},
        animations: {
            stand:0,
            runBotLeft:[0, 15],
            runBotRight:[16, 31],
            runTopLeft:[32, 47],
            runTopRight:[48, 63],
            runRight:[64, 79],
            runLeft:[80, 95],
            runBot:[96, 111],
            runTop:[112, 127]
        }
    };

    buttons.btnRaceBlabla = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetBlaBlaRace")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.btnRacePleb = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetPlebRace")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.btnCancel = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetCancel")],
                                   frames: {width: 240, height: 90},
                                   animations: { out: 0, over: 1, down: 2 }
                               });

    buttons.btnLogout = new createjs.SpriteSheet({
                                   images: [preload.getResult("btnSheetLogout")],
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

    tilePlebGround = new createjs.Sprite(new createjs.SpriteSheet(data), "runBot");

    data.images = [preload.getResult("tilesetPlebRanged")];
    tilePlebRanged = new createjs.Sprite(new createjs.SpriteSheet(data), "runBot");

    data.images = [preload.getResult("tilesetPlebFlying")];
    tilePlebFlying = new createjs.Sprite(new createjs.SpriteSheet(data), "runBot");

    data.images = [preload.getResult("tilesetBlaGround")];
    tileBlaGround = new createjs.Sprite(new createjs.SpriteSheet(data), "runBot");

    data.images = [preload.getResult("tilesetBlaRanged")];
    tileBlaRanged = new createjs.Sprite(new createjs.SpriteSheet(data), "runBot");

    data.images = [preload.getResult("tilesetBlaFlying")];
    tileBlaFlying = new createjs.Sprite(new createjs.SpriteSheet(data), "runBot");

    //other loaded data
    var texture = new createjs.Shape(new createjs.Graphics().beginBitmapFill(preload.getResult("texture1")).drawRect(0, 0, 80, 80));
    texture.regX = 40;
    texture.regY = 40;

    textures.push(texture);

    mapData = preload.getResult("mapData");

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
    fpsLabel.text = 'fps   : ' + ((createjs.Ticker.getMeasuredFPS()|0) + ' time: ' + event.delta/1000);
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