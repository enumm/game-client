(function() {

function Castle(ours, data) {
	this.Container_constructor();
	this.ours = ours;
	this.connectionData = data;
	this.setup();
}
var p = createjs.extend(Castle, createjs.Container);

p.setup = function() {
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

  	sprite11.x = 0 * 64 - 0 * 64;		
    sprite11.y = 0 * 32 + 0 * 32;
  	sprite12.x = 1 * 64 - -1 * 64;		
    sprite12.y = -1 * 32 + 1 * 32;
    sprite21.x = -2 * 64 - -2 * 64;		
    sprite21.y = -2 * 32 + -2 * 32;
    sprite22.x = -1 * 64 - -3 * 64;		
    sprite22.y = -3 * 32 + -1 * 32;

	this.addChild(sprite11, sprite12, sprite21, sprite22); 

	var rect = new createjs.Shape();
 	rect.name = 'greenHP';
 	var rect1 = new createjs.Shape();
 	rect1.name = 'redHP';

 	if (this.ours){
 		rect1.graphics.beginFill("#f00").drawRect(20, -119, 0.2 * instanceData.castleHp, 5);
 		rect.graphics.beginFill("#0f0").drawRect(20, -119, 0.2 * instanceData.castleHp, 5);
	}else{
		rect1.graphics.beginFill("#f00").drawRect(20, -119, 0.2 * opponentData.castleHp, 5);
	 	rect.graphics.beginFill("#0f0").drawRect(20, -119, 0.2 * opponentData.castleHp, 5);
	}
 	
 	this.addChild(rect1, rect);

 	if(this.connectionData.host && this.ours){
	 	this.on("click", function(){
	 		userCurrentSelection = this.name;
	 	});	
 	}else if(!this.connectionData.host && this.ours){
 		this.on("click", function(){
	 		userCurrentSelection = this.name;
	 	});	
 	}
};


p.update = function(){
	var rectHP = this.getChildByName('greenHP');
	rectHP.graphics.clear()

	if (this.ours){
 		rectHP.graphics.beginFill("#0f0").drawRect(20, -119, 0.2 * instanceData.castleHp, 5);
	}else{
		rectHP.graphics.beginFill("#0f0").drawRect(20, -119, 0.2 * opponentData.castleHp, 5);
	}
	
}

window.Castle = createjs.promote(Castle, "Container");
}());