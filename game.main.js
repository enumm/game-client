var tileset;
var stage;
var mapData;
var map = new createjs.Container();
var lastX = 0;
var lastY = 0;
var stats = new Stats();
var tree;

//screens
var loginScreen = new createjs.Container();
var registerScreen = new createjs.Container();
var menuScreen = new createjs.Container();
var gameInstanceScreen = new createjs.Container();

window.onload = function(){
    //stats
    stats.setMode(0); 
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild( stats.domElement );
    var update = function () {
        stats.begin();
        stats.end();
        requestAnimationFrame( update );
    };
    requestAnimationFrame( update );
    mapData = mapData3;

    //stage
	stage = new createjs.Stage("canvas");
    createjs.Touch.enable(stage);
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true;

    //init login screen
    showLogin();

    //start ticker
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", stage);   
}

function showGameInstance(){
    //gameInstanceScreen
    // // create EaselJS image for tileset
    tileset = new Image();
    // // getting imagefile from first tileset
    tileset.src = mapData.tilesets[0].image;
    // // callback for loading layers after tileset is loaded
    tileset.onLoad = initLayers();

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
                tree.gotoAndStop(12);
                map.addChild(tree);
                this.alpha = 1;
            });
        });
    });

    stage.addChild(gameInstanceScreen ,buttonBuild);
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

function showRegister(){
  if(!registerScreen.initialized) {
        var buttonRegister;
        var buttonBack;

        buttonRegister = new createjs.Text("Register", "48px Arial", "#00F");
        buttonRegister.x = 256;
        buttonRegister.y = 480;
        buttonRegister.alpha = 0.5;
        var registerHit = new createjs.Shape();
        registerHit.graphics.beginFill("#000").drawRect(0, 0, buttonRegister.getMeasuredWidth(), buttonRegister.getMeasuredHeight());       
        buttonRegister.hitArea = registerHit;
        buttonRegister.on("mouseover", textMouseOver);
        buttonRegister.on("mouseout", textMouseOver);
        buttonRegister.on("click", function() { alert('Registering'); });

        buttonBack = new createjs.Text("Back", "48px Arial", "#00F");
        buttonBack.x = 768;
        buttonBack.y = 480;
        buttonBack.alpha = 0.5;
        var backHit = new createjs.Shape();
        backHit.graphics.beginFill("#000").drawRect(0, 0, buttonBack.getMeasuredWidth(), buttonBack.getMeasuredHeight());       
        buttonBack.hitArea = backHit;
        buttonBack.on("mouseover", textMouseOver);
        buttonBack.on("mouseout", textMouseOver);
        buttonBack.on("click", function() { hideRegister(); showLogin(); });
        
        registerScreen.addChild(buttonBack, buttonRegister);
        registerScreen.initialized = true;
    }

    stage.addChild(registerScreen);
}

function hideRegister(){
     stage.removeChild(registerScreen);
}

function showMenu(){
    if(!menuScreen.initialized){
        var buttonFindGame;
        buttonFindGame = new createjs.Text("Find game", "48px Arial", "#00F");
        buttonFindGame.x = 10;
        buttonFindGame.y = 80;
        buttonFindGame.alpha = 0.5;
        var loginHit = new createjs.Shape();
        loginHit.graphics.beginFill("#000").drawRect(0, 0, buttonFindGame.getMeasuredWidth(), buttonFindGame.getMeasuredHeight());       
        buttonFindGame.hitArea = loginHit;
        buttonFindGame.on("mouseover", textMouseOver);
        buttonFindGame.on("mouseout", textMouseOver);
        buttonFindGame.on("click", function() { hideMenu(); showGameInstance();});
        menuScreen.initialized = true;
        menuScreen.addChild(buttonFindGame);
    }

    stage.addChild(menuScreen);
}

function hideMenu(){
     stage.removeChild(menuScreen);
}

function showLogin(){
    if(!loginScreen.initialized) {
        var buttonLogin;
        var buttonRegister;

        buttonLogin = new createjs.Text("Login", "48px Arial", "#00F");
        buttonLogin.x = 256;
        buttonLogin.y = 480;
        buttonLogin.alpha = 0.5;
        var loginHit = new createjs.Shape();
        loginHit.graphics.beginFill("#000").drawRect(0, 0, buttonLogin.getMeasuredWidth(), buttonLogin.getMeasuredHeight());       
        buttonLogin.hitArea = loginHit;
        buttonLogin.on("mouseover", textMouseOver);
        buttonLogin.on("mouseout", textMouseOver);
        buttonLogin.on("click", function() { hideLogin(); showMenu(); });

        buttonRegister = new createjs.Text("Register", "48px Arial", "#00F");
        buttonRegister.x = 768;
        buttonRegister.y = 480;
        buttonRegister.alpha = 0.5;
        var registerHit = new createjs.Shape();
        registerHit.graphics.beginFill("#000").drawRect(0, 0, buttonRegister.getMeasuredWidth(), buttonRegister.getMeasuredHeight());       
        buttonRegister.hitArea = registerHit;
        buttonRegister.on("mouseover", textMouseOver);
        buttonRegister.on("mouseout", textMouseOver);
        buttonRegister.on("click", function() { hideLogin(); showRegister(); });
        
        loginScreen.addChild(buttonLogin, buttonRegister);
        loginScreen.initialized = true;
    }

    stage.addChild(loginScreen);
}

function hideLogin(){
     stage.removeChild(loginScreen);
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
	
	// loading each layer at a time
	for (var idx = 0; idx < mapData.layers.length; idx++) {
		var layerData = mapData.layers[idx];
		if (layerData.type == 'tilelayer')
			initLayer(layerData, tilesetSheet, mapData.tilewidth, mapData.tileheight);
	}
    // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
    map.on("pressmove", function (evt) {
        if(lastX != 0 || lastY !=0){

            this.x -= lastX - evt.stageX;
            this.y -= lastY - evt.stageY;
        }

        lastX = evt.stageX;
        lastY = evt.stageY;
    });

    map.on("pressup", function (evt) {
        lastX = 0;
        lastY = 0;
    });

    gameInstanceScreen.addChild(map);

    //stage.addChild(map);
	// stage updates (not really used here)
  
}

// layer initialization
function initLayer(layerData, tilesetSheet, tilewidth, tileheight) {
	for ( var y = 0; y < layerData.height; y++) {
		for ( var x = 0; x < layerData.width; x++) {
			// create a new Bitmap for each cell
			var cellBitmap = new createjs.Sprite(tilesetSheet);
			// layer data has single dimension array
			var idx = x + y * layerData.width;
			// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
			cellBitmap.gotoAndStop(layerData.data[idx] - 1);
			// isometrix tile positioning based on X Y order from Tiled
			cellBitmap.x = 600 + x * tilewidth/2 - y * tilewidth/2;
			cellBitmap.y = y * tileheight/2 + x * tileheight/2;
			// add bitmap to stage
			//stage.addChild(cellBitmap);
            map.addChild(cellBitmap);
		}
	}
}

// utility function for loading assets from server
// function httpGet(theUrl) {
// 	var xmlHttp = null;
// 	xmlHttp = new XMLHttpRequest();
// 	xmlHttp.open("GET", theUrl, false);
// 	xmlHttp.send(null);
// 	return xmlHttp.responseText;
// }

// // utility function for loading json data from server
// function httpGetData(theUrl) {
// 	var responseText = httpGet(theUrl);
// 	return JSON.parse(responseText);
// }

// Map data created on Tiled map editor (mapeditor.org). Use export for JSON format
var mapData3 = { "height":20,
 "layers":[
        {
         "data":[7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 3, 3, 3, 3, 3, 3, 3, 3, 3, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 3, 3, 3, 3, 3, 3, 3, 3, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 3, 3, 3, 3, 3, 3, 3, 1, 1, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 3, 3, 3, 3, 3, 3, 1, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 3, 3, 3, 3, 1, 1, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 3, 3, 3, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 3, 3, 1, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 3, 1, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 4, 1, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 4, 4, 4, 1, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 7, 7, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 7, 7, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 7, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 7, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 7, 7, 7, 7, 7, 7],
         "height":20,
         "name":"ground",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":20,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 20, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":20,
         "name":"plants",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":20,
         "x":0,
         "y":0
        }],
 "nextobjectid":1,
 "orientation":"isometric",
 "properties":
    {
     "name":"Caatinga"
    },
 "renderorder":"right-down",
 "tileheight":32,
 "tilesets":[
        {
         "firstgid":1,
         "image":"tileset.png",
         "imageheight":288,
         "imagewidth":320,
         "margin":0,
         "name":"tileset",
         "properties":
            {

            },
         "spacing":0,
         "tileheight":72,
         "tilewidth":64
        }],
 "tilewidth":64,
 "version":1,
 "width":20
};