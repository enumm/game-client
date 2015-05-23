(function() {

function Unit(data, ours) {
	this.Container_constructor();
	this.unitData = data;
	this.name = data.name;
	this.ours = ours;
	this.setup();
}
var p = createjs.extend(Unit, createjs.Container);

p.setup = function() {
	var sprite = null;

	//debug//
    // var circle = new createjs.Shape();
    // circle.graphics.beginFill("red").drawCircle(0, 0, UnitTypes[this.unitData.unitType].range);
    // this.addChild(circle);
	//debug//

	switch (this.unitData.unitType){
		case 'Pleb':
			sprite = tilePlebGround.clone();
			break;
		case 'Bla':
			sprite = tileBlaGround.clone();
			break;
		case 'RangedPleb':
			sprite = tilePlebRanged.clone();
			break;
		case 'RangedBla':
			sprite = tileBlaRanged.clone();
			break;
		case 'FlyingPleb':
			sprite = tilePlebFlying.clone();
			break;
		case 'FlyingBla':
			sprite = tileBlaFlying.clone();
			break;
	}

	if(sprite){
		sprite.name = 'texture';
		sprite.x = 52;
		sprite.y = 50;

		this.addChild(sprite);
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
    var animationMode = 'walk';

    if(this.ours){
		var opponentStructures = opponentData.units.concat(opponentData.buildings);

		for(var i = 0, len = opponentStructures.length; i < len; i++){
		 	if(!opponentStructures[i].kill){
            	if(UnitTypes[unitData.unitType].type == 'ground' && UnitTypes[opponentStructures[i].unitType] &&  UnitTypes[opponentStructures[i].unitType].type == 'flying'){ 

            	}else{
                	var dst = assets.getDistance(unitData.x, unitData.y, opponentStructures[i].x, opponentStructures[i].y);
                	if(distanceToEnemy > dst) {
                		if(enemy && distanceToEnemy < 30){
                			if(opponentStructures[i].hp < enemy.hp){
	                			distanceToEnemy = dst;
	                    		enemy = opponentStructures[i]; 	
                			}
                		}else{
                			distanceToEnemy = dst;
                    		enemy = opponentStructures[i]; 
                    	}
                	}
            	}
            }
		}
    }else{
    	var ourStructures = instanceData.units.concat(instanceData.buildings);
    	
    	for(var i = 0, len = ourStructures.length; i < len; i++){
    		if(!ourStructures[i].kill){
            	if(UnitTypes[unitData.unitType].type == 'ground' && UnitTypes[ourStructures[i].unitType] &&  UnitTypes[ourStructures[i].unitType].type == 'flying'){ 
            		
            	}else{
                	var dst = assets.getDistance(unitData.x, unitData.y, ourStructures[i].x, ourStructures[i].y);
                	if(distanceToEnemy > dst) {
                		if(enemy && distanceToEnemy < 30){
                			if(ourStructures[i].hp < enemy.hp){
	                			distanceToEnemy = dst;
	                    		enemy = ourStructures[i]; 	
                			}
                		}else{
                			distanceToEnemy = dst;
                    		enemy = ourStructures[i]; 
                    	}
                	}
            	}
            }
    	}
    }

    if(distanceToEnemy < 130){
        if(enemy){
            if(distanceToEnemy < UnitTypes[unitData.unitType].range){
            	//animate attack
            	animationMode = 'attack';
                var dx = enemy.x - unitData.x;
                var dy = enemy.y - unitData.y;
				this.animate(dx, dy, animationMode);

                unitData.attackTimer += delta;

                if(unitData.attackTimer >= UnitTypes[unitData.unitType].attackSpeed){
                    unitData.attackTimer = 0;
                    enemy.hp -= UnitTypes[unitData.unitType].damage;

                    if (enemy.hp <= 0) {
                        enemy.kill = true;
                    }
                }
            }else{
            	unitData.attackTimer = 0;

                //walk to enemy
                animationMode = 'walk';
                var dx = enemy.x - unitData.x;
                var dy = enemy.y - unitData.y;
				this.animate(dx, dy, animationMode);

                var length = Math.sqrt(dx*dx+dy*dy);

                if(length != 0 ){
                    dx/=length;
                    dy/=length;

                    dx *= UnitTypes[unitData.unitType].movementSpeed * delta;
                    dy *= UnitTypes[unitData.unitType].movementSpeed * delta;

                    unitData.x += dx;
                    unitData.y += dy;             
                 }
            }
        }
    }else{

    	if(this.ours){
    		if(gameInstanceScreen.connectionData.host){
    			//kaire
    			if(assets.getDistance(unitData.x, unitData.y, CastleOpponent.x, CastleOpponent.y) - CastleOpponent.range < UnitTypes[unitData.unitType].range){
    				unitData.path = [];
		            unitData.attackTimer += delta;
		            animationMode = 'attack';
		            var dx = CastleOpponent.x - unitData.x;
                	var dy = CastleOpponent.y - unitData.y;
                	this.animate(dx, dy, animationMode);

		            if(unitData.attackTimer >= UnitTypes[unitData.unitType].attackSpeed){
		                unitData.attackTimer = 0;
		               	opponentData.castleHp -= UnitTypes[unitData.unitType].damage;
		            }
		        }
    		}
    		else{
    			//desine
    			if(assets.getDistance(unitData.x, unitData.y, CastleHost.x, CastleHost.y) - CastleHost.range < UnitTypes[unitData.unitType].range){
		            unitData.path = [];
		            unitData.attackTimer += delta;
		            animationMode = 'attack';
		            var dx = CastleHost.x - unitData.x;
                	var dy = CastleHost.y - unitData.y;
                	this.animate(dx, dy, animationMode);

		            if(unitData.attackTimer >= UnitTypes[unitData.unitType].attackSpeed){
		                unitData.attackTimer = 0;
		               	opponentData.castleHp -= UnitTypes[unitData.unitType].damage;
		            }
		        }
    		}
    	}else{
    		if(gameInstanceScreen.connectionData.host){
    			//desine
    			if(assets.getDistance(unitData.x, unitData.y, CastleHost.x, CastleHost.y) - CastleHost.range < UnitTypes[unitData.unitType].range){
		            unitData.path = [];
		            unitData.attackTimer += delta;
		            animationMode = 'attack';
		            var dx = CastleHost.x - unitData.x;
                	var dy = CastleHost.y - unitData.y;
                	this.animate(dx, dy, animationMode);

		            if(unitData.attackTimer >= UnitTypes[unitData.unitType].attackSpeed){
		                unitData.attackTimer = 0;
		               	instanceData.castleHp -= UnitTypes[unitData.unitType].damage;
		            }
		        }
    		}
    		else{
    			//kaire
    			if(assets.getDistance(unitData.x, unitData.y, CastleOpponent.x, CastleOpponent.y) - CastleOpponent.range < UnitTypes[unitData.unitType].range){
		            unitData.path = [];
		            unitData.attackTimer += delta;
		            animationMode = 'attack';
		            var dx = CastleOpponent.x - unitData.x;
                	var dy = CastleOpponent.y - unitData.y;
                	this.animate(dx, dy, animationMode);

		            if(unitData.attackTimer >= UnitTypes[unitData.unitType].attackSpeed){
		                unitData.attackTimer = 0;
		               	instanceData.castleHp -= UnitTypes[unitData.unitType].damage;
		            }
		        }
    		}
    	}


		if(unitData.path.length != 0){
			var mapPositionToGo = unitData.path[0];
			var positionToGo = assets.mapToScreen(mapPositionToGo[0], mapPositionToGo[1]);

			var dx = positionToGo[0]-this.x;
			var dy = positionToGo[1]-this.y;
			this.animate(dx, dy, animationMode);

			var length = Math.sqrt(dx*dx+dy*dy);

			if(length != 0 ){
				dx/=length;
				dy/=length;

				dx *= UnitTypes[unitData.unitType].movementSpeed * delta;
				dy *= UnitTypes[unitData.unitType].movementSpeed * delta;

				unitData.x += dx;
				unitData.y += dy;
			}

			if(this.x - positionToGo[0] < 1 && this.x - positionToGo[0] > - 1 && this.y - positionToGo[1] < 1 && this.y - positionToGo[1] > -1){
				unitData.path.shift();
			}
		}
    }

	this.x  = unitData.x;
	this.y = unitData.y;
};

p.animate = function(dx, dy, animationMode){
var sprite = this.getChildByName('texture');

	if(sprite){
		var direction;
		// console.log(dx.toFixed(0) + ' ' +dy.toFixed(0));
		if(dx.toFixed(0) == 0 && dy.toFixed(0) > 0){
			direction = 'Bot';
		}else if(dx.toFixed(0) == 0 && dy.toFixed(0) < 0){
			direction = 'Top';
		}else if(dx.toFixed(0) > 0 && dy.toFixed(0) == 0){
			direction = 'Right';
		}else if(dx.toFixed(0) < 0 && dy.toFixed(0) == 0){
			direction = 'Left';
		}else if(dx.toFixed(0) > 0 && dy.toFixed(0) > 0 ){
			direction = 'BotRight';
		}else if(dx.toFixed(0) > 0 && dy.toFixed(0) < 0){
			direction = 'TopRight';
		}else if(dx.toFixed(0) < 0 && dy.toFixed(0) > 0 ){
			direction = 'BotLeft';
		}else if(dx.toFixed(0) < 0 && dy.toFixed(0) < 0){
			direction = 'TopLeft';
		}

		var animation = animationMode + direction;
		if(sprite.currentAnimation != animation){
			sprite.gotoAndPlay(animation);
		}
	}
		
};

window.Unit = createjs.promote(Unit, "Container");
}());