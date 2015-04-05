var tileset;
var stage;
var mapData;
var map = new createjs.Container();
var lastX = 0;
var lastY = 0;
var tree;
var fpsLabel;



// file loading
var manifest;
var preload;

//game screens
var loginScreen;
var registerScreen;
var menuScreen;
var gameInstanceScreen = new createjs.Container();

function showLogin(){
    if(!loginScreen){
        loginScreen = new LoginScreen();
    }

    stage.addChild(loginScreen);
}

function hideLogin(){
     stage.removeChild(loginScreen);
}

function showRegister(){
    if(!registerScreen) {
        registerScreen = new RegisterScreen();
    }

    stage.addChild(registerScreen);
}

function hideRegister(){
     stage.removeChild(registerScreen);
}

function showMenu(){
    if(!menuScreen){
       menuScreen = new MenuScreen();
    }

    stage.addChild(menuScreen);
}

function hideMenu(){
     stage.removeChild(menuScreen);
}

window.onload = function(){
    //loading files
    var assetsPath = "assets/";

    manifest = [
        {id: "button", src: "js/button.js"},
        {id: "assets", src: "js/assets.js"},
        {id: "css", src: "css/style.css"},
        {id: "tileset", src: "img/tileCheck.png"},
        {id: "jquery-2", src: "js/jquery-2.1.3.min.js"},
        {id: "loginScreen", src: "js/loginScreen.js"},
        {id: "registerScreen", src: "js/registerScreen.js"},
        {id: "menuScreen", src: "js/menuScreen.js"},
        {id: "mapData", src: "json/map.json"}
    ];

    preload = new createjs.LoadQueue(true, assetsPath);
    preload.on("complete", handleComplete);
    preload.on("fileload", handleFileLoad);

    preload.loadManifest(manifest);
}

function handleFileLoad(event) {
    var item = event.item;
    var result = event.result;

    switch (item.type) {
        case createjs.AbstractLoader.CSS:
            document.body.appendChild(result);
            break;
        case createjs.AbstractLoader.JAVASCRIPT:
            document.body.appendChild(result);
            break;
        case createjs.AbstractLoader.IMAGE:
            tileset = result;
            break;
        case createjs.AbstractLoader.JSON:
            mapData = result;
            break;

    }
}

function handleComplete(event) {
    console.log('Loading complete');

    fpsLabel = new createjs.Text('', "20px Arial", "#0f0");
    fpsLabel.x = 10;
    fpsLabel.y = 10;

    //stage
    stage = new createjs.Stage("canvas");
    createjs.Touch.enable(stage);
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true;

    stage.addChild(fpsLabel);

    //init login screen
    showLogin();

    //start ticker
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.setFPS(60);
    // createjs.Ticker.addEventListener("tick", stage);
    createjs.Ticker.addEventListener("tick", tick);   
}

function tick() {
    stage.update();
    fpsLabel.text = 'fps: ' + (createjs.Ticker.getMeasuredFPS()|0);
}

function showGameInstance(){
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

    stage.addChild(gameInstanceScreen ,buttonBuild);

    stage.swapChildren(gameInstanceScreen, fpsLabel);

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
     stage.removeChild(gameInstanceScreen);
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