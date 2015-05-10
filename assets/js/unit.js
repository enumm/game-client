(function() {

function Unit(data, ours) {
	this.Container_constructor();
	this.unitData = data;
	this.ours = ours;
	this.setup();
}
var p = createjs.extend(Unit, createjs.Container);

p.setup = function() {
	this.name = this.unitData.name;
	var circle = new createjs.Shape();

	if(this.unitData.unitType == 'Pleb')
	{
		var data = {
		    images: [PlebTile],
		    frames: {width:24, height:60},
		    animations: {
		        stand:0,
		        runBotLeft:[0, 15],
		        runBotRight:[16, 31],
		        runTopLeft:[32, 47],
		        runTopRight:[47, 62],
		        runRight:[62, 77],
		        runLeft:[77, 92],
		        runBot:[92, 107],
		        runTop:[107, 122]
		    }
		};

		var spriteSheet = new createjs.SpriteSheet(data);

		var sprite = new createjs.Sprite(spriteSheet, "runBotLeft");
		sprite.name = 'texture';
		sprite.x = 52;
		sprite.y = 50;

		this.addChild(sprite);
	}else{
		if(gameInstanceScreen.connectionData.host){
			if(this.ours){
				circle.graphics.beginFill("yellow").drawCircle(0, 0, 10);
			}else{
				circle.graphics.beginFill("red").drawCircle(0, 0, 10);
			}
		}else{
			if(this.ours){
				circle.graphics.beginFill("red").drawCircle(0, 0, 10);
			}else{
				circle.graphics.beginFill("yellow").drawCircle(0, 0, 10);
			}
		}
		circle.x = 64;
		circle.y = 84;
		this.addChild(circle);
	}

	this.x = this.unitData.x;
	this.y = this.unitData.y;

	var rect = new createjs.Shape();
 	rect.graphics.beginFill("#0f0").drawRect(50, 30, 0.3 * this.unitData.hp, 5);
 	rect.name = 'greenHP';
 	var rect1 = new createjs.Shape();
 	rect1.graphics.beginFill("#f00").drawRect(50, 30, 0.3 * this.unitData.hp, 5);
 	rect1.name = 'redHP';
 	
 	this.addChild(rect1, rect);

 	if(this.ours){
	 	this.on("click", function(){
	 		userCurrentSelection = this.name;
	 	});	
 	}
};

p.updateTime = function(delta, unitData) {
	//hp
	var rectHP = this.getChildByName('greenHP');
	rectHP.graphics.clear()
	rectHP.graphics.beginFill("#0f0").drawRect(50, 30, 0.3 * unitData.hp, 5);
	var name = this.name;

    var distanceToEnemy = 100000;
    var enemy;
    // var outer = this;

    if(this.ours){
        opponentData.units.concat(opponentData.buildings).forEach(function(value){   
            if(!value.kill){
            	if(UnitTypes[unitData.unitType].type == 'ground' && UnitTypes[value.unitType] &&  UnitTypes[value.unitType].type == 'flying'){ 

            	}else{
                	var dst = assets.getDistance(unitData.x, unitData.y, value.x, value.y);
                	if(distanceToEnemy > dst){
                    	distanceToEnemy = dst;
                    	enemy = value; 
                	} 
            	}
            }
        });
    }else{
       instanceData.units.concat(instanceData.buildings).forEach(function(value){
            if(!value.kill){
            	if(UnitTypes[unitData.unitType].type == 'ground' && UnitTypes[value.unitType] &&  UnitTypes[value.unitType].type == 'flying'){ 
            		
            	}else{
                	var dst = assets.getDistance(unitData.x, unitData.y, value.x, value.y);
                	if(distanceToEnemy > dst){
                    	distanceToEnemy = dst;
                    	enemy = value; 
                	} 
            	}
            }
        });
    }

    if(distanceToEnemy < 130){
        if(enemy){
            if(distanceToEnemy < UnitTypes[unitData.unitType].range){
                //fight
            }else{
                //walk to enemy
                var dx = enemy.x - unitData.x;
                var dy = enemy.y - unitData.y;

                var length = Math.sqrt(dx*dx+dy*dy);

                if(length != 0 ){
                    dx/=length;
                    dy/=length;


                    dx *= UnitTypes[unitData.unitType].movementSpeed * delta;
                    dy *= UnitTypes[unitData.unitType].movementSpeed * delta;

                    unitData.x += dx;
                    unitData.y += dy;
                    this.animate(dx, dy);
                 }
            }
        }
    }else{
		if(unitData.path.length != 0){
			var mapPositionToGo = unitData.path[0];
			var positionToGo = assets.mapToScreen(mapPositionToGo[0], mapPositionToGo[1]);

			var dx = positionToGo[0]-this.x;
			var dy = positionToGo[1]-this.y;

			var length = Math.sqrt(dx*dx+dy*dy);

			if(length != 0 ){
				dx/=length;
				dy/=length;


				dx *= UnitTypes[unitData.unitType].movementSpeed * delta;
				dy *= UnitTypes[unitData.unitType].movementSpeed * delta;

				unitData.x += dx;
				unitData.y += dy;
				this.animate(dx, dy);

				// this.x  = unitData.x;
				// this.y = unitData.y;
			}

			if(this.x - positionToGo[0] < 1 && this.x - positionToGo[0] > - 1 && this.y - positionToGo[1] < 1 && this.y - positionToGo[1] > -1){
				unitData.path.shift();
			}
		}
    }

	this.x  = unitData.x;
	this.y = unitData.y;
};

p.animate = function(dx, dy){
	var sprite = this.getChildByName('texture');

	if(sprite){
		var anim;
		// console.log(dx|0 + ' ' +dy|0);
		if(dx|0 == 0 && dy|0 > 0){
			anim = 'runTop';
		}else if(dx|0 == 0 && dy|0 < 0){
			anim = 'runBot';
		}else if(dx|0 > 0 && dy|0 == 0){
			anim = 'runRight';
		}else if(dx|0 < 0 && dy|0 == 0){
			anim = 'runLeft';
		}else if(dx|0 > 0 && dy|0 > 0 ){
			anim = 'runTopRight';
		}else if(dx|0 > 0 && dy|0 < 0){
			anim = 'runBotRight';
		}else if(dx|0 < 0 && dy|0 > 0 ){
			anim = 'runTopLeft';
		}else if(dx|0 < 0 && dy|0 < 0){
			anim = 'runBotLeft';
		}

		if(sprite.currentAnimation != anim){
			sprite.gotoAndPlay(anim);
		}
	}
};

p.doDamage = function(dmg){
	// this.life -= dmg;
	
	// if(this.life <= 0){
	// 	//this.parent.removeChild(this);

	// 	// for( i = instanceData.units.length-1; i>=0; i--) {
	// 	// 	if( instanceData.units[i].name == this.name) instanceData.units.splice(i,1);
	// 	// }

	// 	// assets.sendData();
	// 	var name = this.name

	// 	$.each(instanceData.units, function(index, value){
	// 		if( value.name == name) {value.kill = true;}
	// 	});

	// 	// for( i = instanceData.units.length-1; i>=0; i--) {
	// 	// 	if( instanceData.units[i].name == this.name) {instanceData.units[i].kill = true;}
	// 	// }

	// 	assets.sendData();
	// }
};

window.Unit = createjs.promote(Unit, "Container");
}());