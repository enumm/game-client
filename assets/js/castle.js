(function() {

function Castle(good) {
	this.Container_constructor();
	this.good = good;
	this.setup();
}
var p = createjs.extend(Castle, createjs.Container);

p.setup = function() {
	this.hp = 100;

	var w = mapData.tilesets[0].tilewidth;
	var h = mapData.tilesets[0].tileheight;
	var imageData = {
	    images : [ tileset ],
	    frames : {
	        width : w,
	        height : h
	    }
	};

	var tilesetSheet = new createjs.SpriteSheet(imageData);
	var sprite11 =  new createjs.Sprite(tilesetSheet);
	var sprite12 = sprite11.clone();
	var sprite21 = sprite11.clone();
	var sprite22 = sprite11.clone();

    sprite21.gotoAndStop(this.good ? 38 : 54); 
    sprite22.gotoAndStop(this.good ? 39 : 55);
    sprite11.gotoAndStop(this.good ? 46 : 62);
    sprite12.gotoAndStop(this.good ? 47 : 63);

  	sprite11.x = 0 * mapData.tilewidth/2 - 0 * mapData.tilewidth/2;		
    sprite11.y = 0 * mapData.tileheight/2 + 0 * mapData.tileheight/2;
	console.log('x,y: ' + sprite11.x + ' ' +sprite11.y);
  	sprite12.x = 1 * mapData.tilewidth/2 - -1 * mapData.tilewidth/2;		
    sprite12.y = -1 * mapData.tileheight/2 + 1 * mapData.tileheight/2;
	console.log('x,y: ' + sprite12.x + ' ' +sprite12.y );
    sprite21.x = -2 * mapData.tilewidth/2 - -2 * mapData.tilewidth/2;		
    sprite21.y = -2 * mapData.tileheight/2 + -2 * mapData.tileheight/2;
	console.log('x,y: ' + sprite21.x + ' ' +sprite21.y);
    sprite22.x = -1 * mapData.tilewidth/2 - -3 * mapData.tilewidth/2;		
    sprite22.y = -3 * mapData.tileheight/2 + -1 * mapData.tileheight/2;
	console.log('x,y: ' + sprite22.x + ' ' +sprite22.y );


	this.addChild(sprite11, sprite12, sprite21, sprite22); 
	this.name = 'castle';
};

p.setHp = function(hp){
	this.hp = hp;

};

window.Castle = createjs.promote(Castle, "Container");
}());