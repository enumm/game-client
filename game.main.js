var tileset;
var buttonImg;
var btnRacePlebsImg = [];
var btnRaceBlablasImg = [];
var btnMmCasualImg = [];
var btnMmRankedImg = [];
var btnMmPrivateImg = [];
var btnFindGameImg = [];
var btnCancelImg = [];
var loginBackGround;
var overlayImg;
var stage;
var mapData;

var debug = true;

var lastX = 0;
var lastY = 0;
var tree;
var socket;

var serverUpdateTimer = 0;
var moneyUpdateTimer = 0;

var raceSelected = 'plebs';
var gameType = 'casual';
var userFriends = [];
var userCurrentSelection;

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
}

function hideMenu(){
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
        {id: "adressBar", src : "js/hideAddressbar.min.js"},

        {id: "button", src: "js/button.js"},
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
        case createjs.AbstractLoader.IMAGE:
            if(id == "buttonImg")
            {
            	buttonImg = result;
            }
            else if (id == "tileset"){
            	tileset = result;
            }
            else if(id == 'texture1'){
                var texture = new createjs.Shape(new createjs.Graphics().beginBitmapFill(result).drawRect(0, 0, 80, 80));
                        texture.regX = 40;
                        texture.regY = 40;

                textures.push(texture);
            }
            else if(id =="btnMmCasual"){
                btnMmCasualImg[0] = result;
            }
            else if(id =="btnMmRanked"){
                btnMmRankedImg[0] = result;
            }
            else if(id =="btnMmPrivate"){
                btnMmPrivateImg[0] = result;
            }
            else if(id =="btnRacePlebs"){
                btnRacePlebsImg[0] = result;
            }
            else if(id =="btnFindGame"){
                btnFindGameImg[0] = result;
            }
            else if(id =="btnCancel"){
                btnCancelImg[0] = result;
            }
            else if(id =="btnRaceBlablas"){
                btnRaceBlablasImg[0] = result;
            }else if(id =="overlay"){
                overlayImg = result;
            }else{
                loginBackGround = result;
            }
            break;
        case createjs.AbstractLoader.JSON:
            mapData = result;
            break;

    }
}

function handleComplete(event) {
    console.log('Loading complete');
    hideAddressbar('#canvasHolder');
    stage.removeChild(loadingLabel);
    loadingLabel = null;

    stage.addChild(fpsLabel);
    //start ticker
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.setFPS(60);
    // createjs.Ticker.addEventListener("tick", stage);
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