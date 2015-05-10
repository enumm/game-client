(function() {

function Unit(name, ours, x, y) {
	this.Container_constructor();
	this.unitName = name;
	this.posX = x;
	this.posY = y;
	this.ours = ours;
	this.setup();
}
var p = createjs.extend(Unit, createjs.Container);

p.setup = function() {
	this.name = this.unitName;
	var circle = new createjs.Shape();

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

	this.x = this.posX;
	this.y = this.posY;

	this.addChild(circle);

	//life
	this.life = 100;
	
	var rect = new createjs.Shape();
 	rect.graphics.beginFill("#0f0").drawRect(50, 64, 0.3 * this.life, 5);
 	rect.name = 'greenHP';
 	var rect1 = new createjs.Shape();
 	rect1.graphics.beginFill("#f00").drawRect(50, 64, 0.3 * this.life, 5);
 	rect1.name = 'redHP';
 	
 	this.addChild(rect1, rect);

 	// if(this.ours){
	 	this.on("click", function(){
	 		userCurrentSelection = this.name;
	 	});	
 	// }
};

p.updateTime = function(delta, unitData) {
	//hp
	var rectHP = this.getChildByName('greenHP');
	rectHP.graphics.clear()
	rectHP.graphics.beginFill("#0f0").drawRect(50, 64, 0.3 * unitData.hp, 5);
	var name = this.name;

    var distanceToEnemy = 100000;
    var enemy;
    // var outer = this;

    UnitTypes[unitData.unitType].type


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

    if(distanceToEnemy < 200){
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





	// var x = this.x;
	// var y = this.y;

	//this.x = unitData.x;
	//this.y = unitData.y;	
	//unitData.x += 10 * delta;

	// var distanceToEnemy = 100000;
	// var enemyName;
	// var enemyX;
	// var enemyY;

	// if(this.ours){
	// 	$.each(opponentData.units.concat(opponentData.buildings), function(index, value){
	// 		if(!value.kill && value.name != name){
	// 			//console.log(name + ' distance to ' + value.name + ' = ' + assets.getDistance(x, y, value.x, value.y));
	// 			var dst = assets.getDistance(x, y, value.x, value.y);
	// 			if(distanceToEnemy > dst){
	// 				distanceToEnemy = dst;
	// 				enemyName = value.name; 
	// 				enemyX = value.x;
	// 				enemyY = value.y;
	// 			}
				
	// 		}
	// 	});

	// 	// if(gameInstanceScreen.connectionData.host){
	// 	// 	if((assets.screenToMap(x, y)[0]|0) == 30 && (assets.screenToMap(x, y)[1]|0) == 14){
	// 	// 		enemyName = 'castleBad'; 
	// 	// 		distanceToEnemy = 9;
	// 	// 	}
	// 	// }else{
	// 	// 	if((assets.screenToMap(x, y)[0]|0) == 14 && (assets.screenToMap(x, y)[1]|0) == 30){
	// 	// 		enemyName = 'castleGood'; 
	// 	// 		distanceToEnemy = 9;
	// 	// 	}
	// 	// }
	// }else{
	// 	$.each(instanceData.units.concat(instanceData.buildings), function(index, value){
	// 		if(!value.kill && value.name != name){
	// 			//console.log(name + ' distance to ' + value.name + ' = ' + assets.getDistance(x, y, value.x, value.y));
	// 			var dst = assets.getDistance(x, y, value.x, value.y);
	// 			if(distanceToEnemy > dst){
	// 				distanceToEnemy = dst;
	// 				enemyName = value.name;
	// 				enemyX = value.x;
	// 				enemyY = value.y;
	// 			}
	// 		}
	// 	});

	// 	// if(gameInstanceScreen.connectionData.host){
	// 	// 	if((assets.screenToMap(x, y)[0]|0) == 14 && (assets.screenToMap(x, y)[1]|0) == 30){
	// 	// 		enemyName = 'castleGood'; 
	// 	// 		distanceToEnemy = 9;
	// 	// 	}
	// 	// }else{
	// 	// 	if((assets.screenToMap(x, y)[0]|0) == 30 && (assets.screenToMap(x, y)[1]|0) == 14){
	// 	// 		enemyName = 'castleBad'; 
	// 	// 		distanceToEnemy = 9;
	// 	// 	}
	// 	// }
	// }

	// if(distanceToEnemy < 10){
	// 	var enemy = gameInstanceScreen.getChildByName('map').getChildByName('units').getChildByName(enemyName);
	// 	if(enemy){
	// 		//enemy.doDamage(0.5);
	// 	}
		
	// 	//fight
	// }else if(distanceToEnemy < 100){
	// 	//walk to enemy
	// 	var dx = enemyX - this.x;
	// 	var dy = enemyY - this.y;

	// 	var length = Math.sqrt(dx*dx+dy*dy);

	// 	if(length != 0 ){
	// 		dx/=length;
	// 		dy/=length;


	// 		dx *= 60 * delta;
	// 		dy *= 60 * delta;

	// 		this.x += dx;
	// 		this.y += dy;

	// 		unitData.x = this.x;
	// 		unitData.y = this.y;
	// 	}

	// }else{
	// 	//pathfinding
		// if(unitData.path.length != 0){
		// 	var mapPositionToGo = unitData.path[0];
		// 	var positionToGo = assets.mapToScreen(mapPositionToGo[0], mapPositionToGo[1]);

		// 	var dx = positionToGo[0]-this.x;
		// 	var dy = positionToGo[1]-this.y;

		// 	var length = Math.sqrt(dx*dx+dy*dy);

		// 	if(length != 0 ){
		// 		dx/=length;
		// 		dy/=length;


		// 		dx *= 60 * delta;
		// 		dy *= 60 * delta;

		// 		unitData.x += dx;
		// 		unitData.y += dy;

		// 		this.x  = unitData.x;
		// 		this.y = unitData.y;
		// 	}

		// 	//console.log('skirtumas x: ' +(this.x -  positionToGo[0]) + ' y: ' + (this.y - positionToGo[1]));
		// 	if(this.x - positionToGo[0] < 1 && this.x - positionToGo[0] > - 1 && this.y - positionToGo[1] < 1 && this.y - positionToGo[1] > -1){
		// 		unitData.path.shift();
		// 	}
		// }

		// //fallback, update position from server
		// this.x  = unitData.x;
		// this.y = unitData.y;

	// }
};

p.setLife = function(life){
	this.life = life;
};


p.doDamage = function(dmg){
	this.life -= dmg;
	
	if(this.life <= 0){
		//this.parent.removeChild(this);

		// for( i = instanceData.units.length-1; i>=0; i--) {
		// 	if( instanceData.units[i].name == this.name) instanceData.units.splice(i,1);
		// }

		// assets.sendData();
		var name = this.name

		$.each(instanceData.units, function(index, value){
			if( value.name == name) {value.kill = true;}
		});

		// for( i = instanceData.units.length-1; i>=0; i--) {
		// 	if( instanceData.units[i].name == this.name) {instanceData.units[i].kill = true;}
		// }

		assets.sendData();
	}
};


window.Unit = createjs.promote(Unit, "Container");
}());