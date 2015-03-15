var tileset;
var stage;
var mapData;
var map = new createjs.Container();
var lastX = 0;
var lastY = 0;

$( document ).ready(function() {
    var stats = new Stats();
stats.setMode(1); // 0: fps, 1: ms

// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild( stats.domElement );

var update = function () {

    stats.begin();

    // monitored code goes here

    stats.end();

    requestAnimationFrame( update );

};

requestAnimationFrame( update );
});




window.onload = function()
{
	// json map data at the end of this file for ease of understanding (created on Tiled map editor)
	//mapData = mapDataJson;

    mapData = mapData3;

	// uncomment this to a second example
	//mapData = mapData2;
	
	// creating EaselJS stage
	stage = new createjs.Stage("canvas");
	// create EaselJS image for tileset
	tileset = new Image();
	// getting imagefile from first tileset
	tileset.src = mapData.tilesets[0].image;
	// callback for loading layers after tileset is loaded
	tileset.onLoad = initLayers();

    createjs.Touch.enable(stage);
    // enabled mouse over / out events
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas
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

    stage.addChild(map);
	// stage updates (not really used here)
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.setFPS(60);

	// createjs.Ticker.addEventListener(stage);
    createjs.Ticker.addEventListener("tick", stage);
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