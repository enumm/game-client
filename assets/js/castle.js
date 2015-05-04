(function() {

function Castle(good, data) {
	this.Container_constructor();
	this.good = good;
	this.connectionData = data;
	this.setup();
}
var p = createjs.extend(Castle, createjs.Container);

p.setup = function() {
	this.life = 1000;

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
  	sprite12.x = 1 * mapData.tilewidth/2 - -1 * mapData.tilewidth/2;		
    sprite12.y = -1 * mapData.tileheight/2 + 1 * mapData.tileheight/2;
    sprite21.x = -2 * mapData.tilewidth/2 - -2 * mapData.tilewidth/2;		
    sprite21.y = -2 * mapData.tileheight/2 + -2 * mapData.tileheight/2;
    sprite22.x = -1 * mapData.tilewidth/2 - -3 * mapData.tilewidth/2;		
    sprite22.y = -3 * mapData.tileheight/2 + -1 * mapData.tileheight/2;

	this.addChild(sprite11, sprite12, sprite21, sprite22); 
	this.name = 'castle';

	var rect = new createjs.Shape();
 	rect.graphics.beginFill("#0f0").drawRect(20, -119, 0.2 * this.life, 5);
 	rect.name = 'greenHP';
 	var rect1 = new createjs.Shape();
 	rect1.graphics.beginFill("#f00").drawRect(20, -119, 0.2 * this.life, 5);
 	rect1.name = 'redHP';
 	
 	this.addChild(rect1, rect);

 	if(this.connectionData.host && this.good){
	 	this.on("click", function(){
	 		userCurrentSelection = this.name;
	 	});	
 	}else if(!this.connectionData.host && !this.good){
 		this.on("click", function(){
	 		userCurrentSelection = this.name;
	 	});	
 	}
};

p.doDamage = function(dmg){
	this.life -= dmg;

	var rectHP = this.getChildByName('greenHP');
	rectHP.graphics.clear()
	rectHP.graphics.beginFill("#0f0").drawRect(20, -119, 0.2 * this.life, 5);
	
	if(this.life <= 0){
		// for( i = instanceData.buildings.length-1; i>=0; i--) {
		// 	if( instanceData.buildings[i].name == this.name) {instanceData.buildings[i].kill = true;}
		// }
		var name = this.name;

		// $.each(instanceData.buildings, function(index, value){
		// 	if( value.name == name) {value.kill = true;}
		// });

		assets.sendData();
	}
};

window.Castle = createjs.promote(Castle, "Container");
}());