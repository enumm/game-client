var tileset;
var buttonImg;
var loginBackGround;
var stage;
var mapData;

var lastX = 0;
var lastY = 0;
var tree;
var socket;

var serverUpdateTimer = 0;
var moneyUpdateTimer = 0;

var raceSelected = 'human';

//check other places
var instanceData = {money: 5, buildings: [], units: []};
var opponentData = {money: 5, buildings: [], units: []};
    
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
var registerScreen;
var menuScreen;
var gameInstanceScreen;

function showLogin(){
    loginScreen = null;
    delete loginScreen;
    loginScreen = new LoginScreen();
    stage.addChild(loginScreen);
    stage.setChildIndex ( fpsLabel,  1);
}

function hideLogin(){
    loginScreen.destroy();
 	stage.removeChild(loginScreen);
    loginScreen = null;
    delete loginScreen;
}

function showRegister(){
    registerScreen = null;
    delete registerScreen;
    registerScreen = new RegisterScreen();
    stage.addChild(registerScreen);
    stage.setChildIndex ( fpsLabel,  1);
}

function hideRegister(){
    registerScreen.destroy();
    stage.removeChild(registerScreen);
    registerScreen = null;
    delete registerScreen;
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
    instanceData = {money: 5, buildings: [], units: []};
    opponentData = {money: 5, buildings: [], units: []};

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

	if(loginScreen) {
		var loginDiv = $('#loginForm');
		var loginBlock = loginScreen.getChildByName('LoginBlock');
        if(loginBlock){
        loginBlock.x = ((parseInt(canvas.style.width) * 0.5) - loginDiv.width() * 0.5) + margin;
        loginBlock.y = -(parseInt(canvas.style.height) * 0.5) - loginDiv.height() * 0.5;    
        }
	}
	if(registerScreen) {
		var registerDiv = $('#registerForm');
		var registerBlock = registerScreen.getChildByName('registerBlock');
        if(registerBlock){
            registerBlock.x = ((parseInt(canvas.style.width) * 0.5) - registerDiv.width() * 0.5) + margin;
            registerBlock.y = -(parseInt(canvas.style.height) * 0.5) - registerDiv.height() * 0.5;    
        }
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
        {id: "button", src: "js/button.js"},
        {id: "assets", src: "js/assets.js"},
        {id: "assets", src: "js/proton-1.0.0.min.js"},
        {id: "css", src: "css/style.css"},
        {id: "tileset", src: "img/tileCheck.png"},
        {id: "jquery-2", src: "js/jquery-2.1.3.min.js"},
        {id: "loginScreen", src: "js/loginScreen.js"},
        {id: "registerScreen", src: "js/registerScreen.js"},
        {id: "mainPanel", src: "js/mainPanel.js"},
        {id: "menuScreen", src: "js/menuScreen.js"},
        {id: "castle", src: "js/castle.js"},
        {id: "unit", src: "js/unit.js"},
        {id: "building", src: "js/building.js"},
        {id: "instanceScreen", src: "js/gameInstanceScreen.js"},
        {id: "serverInterp", src: "js/serverInterpreter.js"},
        {id: "pathFinding", src: "js/pathfinding-browser.min.js"},
        {id: "buttonImg", src: "img/button.png"},
        {id: "loginBackGround", src: "img/bg1.jpg"},
        {id: "mapData", src: "json/map.json"},
        {id: "texture1", src : "img/c1.png"},
        {id: "adressBar", src : "js/hideAddressbar.min.js"}
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

    showLogin();
    mainPanel.show();

    OnResizeCalled();
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