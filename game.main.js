var tileset;
var buttonImg;
var loginBackGround;
var stage;
var mapData;
var map;
var lastX = 0;
var lastY = 0;
var tree;
var socket;

           
//proton vars
var renderer;
var proton;
var emitter;
var textures = [];

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
var gameInstanceScreen = new createjs.Container();

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
    if(!menuScreen){
       menuScreen = new MenuScreen();
    }

    stage.addChild(menuScreen);
    stage.setChildIndex ( fpsLabel,  1);}

function hideMenu(){
     stage.removeChild(menuScreen);
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
	    loginBlock.x = ((parseInt(canvas.style.width) * 0.5) - loginDiv.width() * 0.5) + margin;
    	loginBlock.y = -(parseInt(canvas.style.height) * 0.5) - loginDiv.height() * 0.5;
	}
	if(registerScreen) {
		var registerDiv = $('#registerForm');
		var registerBlock = registerScreen.getChildByName('registerBlock');
	    registerBlock.x = ((parseInt(canvas.style.width) * 0.5) - registerDiv.width() * 0.5) + margin;
    	registerBlock.y = -(parseInt(canvas.style.height) * 0.5) - registerDiv.height() * 0.5;
	}

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
        {id: "menuScreen", src: "js/menuScreen.js"},
        {id: "serverInterp", src: "js/serverInterpreter.js"},
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

    OnResizeCalled();
}

function tick() {
    stage.update();
    fpsLabel.text = 'fps: ' + (createjs.Ticker.getMeasuredFPS()|0);

    if (proton) {
        proton.update();
    }
}

function showGameInstance(data){
    var aa = data.host ? 'You are host, Opponent: ' : 'You are guest, Opponent: ' ;
    var opponentName = new createjs.Text(aa + data.opponent, "20px Arial", "#fff");
    opponentName.y = 0;
    opponentName.x = 1000;

    assets.destroyParticles();
    assets.hideMenuBackground();

    stage.removeAllChildren();
    initLayers();

    var buttonBuild; 
    buttonBuild = new createjs.Text("Build", "48px Arial", "#00F");
    buttonBuild.x = 10;
    buttonBuild.y = 80;
    buttonBuild.alpha = 1;

    var buildHit = new createjs.Shape();
    buildHit.graphics.beginFill("#000").drawRect(0, 0, buttonBuild.getMeasuredWidth(), buttonBuild.getMeasuredHeight());       
    buttonBuild.hitArea = buildHit;
    buttonBuild.on("click", function() {
        map.alpha = 0.5;

        $.each(map.children, function( index, value ) {
            value.on("mouseover", function(){ this.alpha = 2;});
            value.on("mouseout", function(){ this.alpha = 1;});
            value.on("click", function(){
                tileRemoveAllEventListeners();
                var tree = this.clone(true);
                tree.gotoAndStop(11);
                map.addChild(tree);
                this.alpha = 1;
            });
        });
    });

    stage.addChild(gameInstanceScreen ,buttonBuild, fpsLabel, opponentName);
    map.x = 1400;
    map.y = -1210;
}

function tileRemoveAllEventListeners(){
    $.each(map.children, function( index, value ) {
        value.removeAllEventListeners();
    });

  map.alpha = 1;
}

function hideGameInstance(){
    map = null;
    delete map;
    //gameInstanceScreen.destroy();
    stage.removeChild(gameInstanceScreen);
    gameInstanceScreen = null;
    delete gameInstanceScreen;
}

function textMouseOver(event) {
    event.target.alpha = (event.type == "mouseover") ? 1 : 0.5; 
}

// loading layers
function initLayers() {
	// compose EaselJS tileset from image (fixed 64x64 now, but can be parametized)
	var w = mapData.tilesets[0].tilewidth;
	var h = mapData.tilesets[0].tileheight;
	var imageData = {
		images : [ tileset ],
		frames : {
			width : w,
			height : h
		}
	};

	// create spritesheet
	var tilesetSheet = new createjs.SpriteSheet(imageData);
    var tilesetSheet1 = new createjs.Sprite(tilesetSheet);
	
    //map = new createjs.SpriteContainer(tilesetSheet);
    if(!map){
        map = new createjs.Container();
    }

	// loading each layer at a time
	for (var idx = 0; idx < mapData.layers.length; idx++) {
		var layerData = mapData.layers[idx];
		if (layerData.type == 'tilelayer')
			initLayer(layerData, tilesetSheet1, mapData.tilewidth, mapData.tileheight);
	}

    // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
    map.on("pressmove", function (evt) {
        if(lastX != 0 || lastY !=0){
            this.x -= lastX - evt.stageX;
            this.y -= lastY - evt.stageY;

            if(this.x <= -255){
                this.x = -255;
            } 
            if(this.x >= 1400){
                this.x = 1400;
            }

            if(this.y >= -935){
                this.y = -935;
            }
            if(this.y <= -1390){
                this.y = -1390;  
            }            
        }

        lastX = evt.stageX;
        lastY = evt.stageY;
    });

    map.on("pressup", function (evt) {
        lastX = 0;
        lastY = 0;
    });

    gameInstanceScreen.addChild(map);  
}

// layer initialization
function initLayer(layerData, tilesetSheet, tilewidth, tileheight) {
	for ( var y = 0; y < layerData.height; y++) {
		for ( var x = 0; x < layerData.width; x++) {
			// layer data has single dimension array
			var idx = x + y * layerData.width;

            if(layerData.data[idx] != 0){
                // create a new Bitmap for each cell
                // var cellBitmap = new createjs.Sprite(tilesetSheet);
                var cellBitmap = tilesetSheet.clone();
    			// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
    			cellBitmap.gotoAndStop(layerData.data[idx] - 1);
    			// isometrix tile positioning based on X Y order from Tiled
    			cellBitmap.x = x * tilewidth/2 - y * tilewidth/2;
    			cellBitmap.y = y * tileheight/2 + x * tileheight/2;
    			// add bitmap to stage
    			//stage.addChild(cellBitmap);
                map.addChild(cellBitmap);
            }
		}
	}
}