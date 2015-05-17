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

    if(this.ours){
        opponentData.units.concat(opponentData.buildings).forEach(function(value){   
            if(!value.kill){
            	if(UnitTypes[unitData.unitType].type == 'ground' && UnitTypes[value.unitType] &&  UnitTypes[value.unitType].type == 'flying'){ 

            	}else{
                	var dst = assets.getDistance(unitData.x, unitData.y, value.x, value.y);
                	if(distanceToEnemy > dst) {
                		if(enemy && distanceToEnemy < 30){
                			if(value.hp < enemy.hp){
	                			distanceToEnemy = dst;
	                    		enemy = value; 	
                			}
                		}else{
                			distanceToEnemy = dst;
                    		enemy = value; 
                    	}
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
                	if(distanceToEnemy > dst) {
                		if(enemy && distanceToEnemy < 30){
                			if(value.hp < enemy.hp){
	                			distanceToEnemy = dst;
	                    		enemy = value; 	
                			}
                		}else{
                			distanceToEnemy = dst;
                    		enemy = value; 
                    	}
                	}
            	}
            }
        });
    }

    if(distanceToEnemy < 130){
        if(enemy){
            if(distanceToEnemy < UnitTypes[unitData.unitType].range){
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
                var dx = enemy.x - unitData.x;
                var dy = enemy.y - unitData.y;
				this.animate(dx, dy);

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
		if(unitData.path.length != 0){
			var mapPositionToGo = unitData.path[0];
			var positionToGo = assets.mapToScreen(mapPositionToGo[0], mapPositionToGo[1]);

			var dx = positionToGo[0]-this.x;
			var dy = positionToGo[1]-this.y;
			this.animate(dx, dy);

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

p.animate = function(dx, dy){
	var sprite = this.getChildByName('texture');

	if(sprite){
		var anim;
		// console.log(dx.toFixed(0) + ' ' +dy.toFixed(0));
		if(dx.toFixed(0) == 0 && dy.toFixed(0) > 0){
			anim = 'runBot';
		}else if(dx.toFixed(0) == 0 && dy.toFixed(0) < 0){
			anim = 'runTop';
		}else if(dx.toFixed(0) > 0 && dy.toFixed(0) == 0){
			anim = 'runRight';
		}else if(dx.toFixed(0) < 0 && dy.toFixed(0) == 0){
			anim = 'runLeft';
		}else if(dx.toFixed(0) > 0 && dy.toFixed(0) > 0 ){
			anim = 'runBotRight';
		}else if(dx.toFixed(0) > 0 && dy.toFixed(0) < 0){
			anim = 'runTopRight';
		}else if(dx.toFixed(0) < 0 && dy.toFixed(0) > 0 ){
			anim = 'runBotLeft';
		}else if(dx.toFixed(0) < 0 && dy.toFixed(0) < 0){
			anim = 'runTopLeft';
		}

		if(sprite.currentAnimation != anim){
			sprite.gotoAndPlay(anim);
		}
	}
};

window.Unit = createjs.promote(Unit, "Container");
}());