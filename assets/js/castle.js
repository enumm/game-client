(function() {

function Castle(ours, data) {
	this.Container_constructor();
	this.ours = ours;
	this.connectionData = data;
	this.setup();
}
var p = createjs.extend(Castle, createjs.Container);

p.setup = function() {
	this.life = 1000;

	var racetileset;
	if(this.ours){
		switch(raceSelected){
			case 'Plebs':
				racetileset = tilesetPlebs;
				break;
			case 'BlaBlas':
				racetileset = tilesetBlaBlas;
				break;
		}	
	}else{
		switch(this.connectionData.enemyRace){
			case 'Plebs':
				racetileset = tilesetPlebs;
				break;
			case 'BlaBlas':
				racetileset = tilesetBlaBlas;
				break;
		}	
	}
	

	var imageData = {
	    images : [ racetileset ],
	    frames : {
	        width : 128,
	        height : 128
	    }
	};

	var tilesetSheet = new createjs.SpriteSheet(imageData);
	var sprite11 =  new createjs.Sprite(tilesetSheet);
	var sprite12 = sprite11.clone();
	var sprite21 = sprite11.clone();
	var sprite22 = sprite11.clone();


	if(this.connectionData.host){
	    sprite21.gotoAndStop(this.ours ? 0 : 10); 
	    sprite22.gotoAndStop(this.ours ? 1 : 11);
	    sprite11.gotoAndStop(this.ours ? 5 : 15);
	    sprite12.gotoAndStop(this.ours ? 6 : 16);
	}else{
	    sprite21.gotoAndStop(this.ours ? 10 : 0); 
	    sprite22.gotoAndStop(this.ours ? 11 : 1);
	    sprite11.gotoAndStop(this.ours ? 15 : 5);
	    sprite12.gotoAndStop(this.ours ? 16 : 6);
	}

    // sprite21.gotoAndStop(this.connectionData.host && this.ours ? 0 : 10); 
    // sprite22.gotoAndStop(this.connectionData.host && this.ours ? 1 : 11);
    // sprite11.gotoAndStop(this.connectionData.host && this.ours ? 5 : 15);
    // sprite12.gotoAndStop(this.connectionData.host && this.ours ? 6 : 16);

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

 	if(this.connectionData.host && this.ours){
	 	this.on("click", function(){
	 		userCurrentSelection = this.name;
	 	});	
 	}else if(!this.connectionData.host && !this.ours){
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