(function() {

function Building(name, buildingType, ours) {
	this.Container_constructor();
	this.buildingName = name;
	this.ours = ours;
	this.buildingType = buildingType;
	this.buildTimer = 0;
	this.setup();
}
var p = createjs.extend(Building, createjs.Container);

p.setup = function() {
	this.name = this.buildingName;
	var building = null;

	if(gameInstanceScreen.connectionData.host){
		building = assets.createBuilding(this.ours ? this.buildingType.hframe : this.buildingType.oframe);
	}else{
		building = assets.createBuilding(this.ours ? this.buildingType.oframe : this.buildingType.hframe);
	}
	
    this.addChild(building);

	this.life = this.buildingType.life;
    var rect = new createjs.Shape();
 	rect.graphics.beginFill("#0f0").drawRect(35, 30, 0.3 * this.life, 5);
 	rect.name = 'greenHP';
 	var rect1 = new createjs.Shape();
 	rect1.graphics.beginFill("#f00").drawRect(35, 30, 0.3 * this.life, 5);
 	rect1.name = 'redHP';
 	
 	this.addChild(rect1, rect);

 	if(this.ours){
	 	this.on("click", function(){
	 		userCurrentSelection = this.name;
	 	});	
 	}
};

p.updateTime = function(delta, element) {
	//hp
	var rectHP = this.getChildByName('greenHP');
	rectHP.graphics.clear()
	rectHP.graphics.beginFill("#0f0").drawRect(35, 30, 0.3 * this.life, 5);


	if(element.producing){
		this.buildTimer += delta;

		if(this.buildTimer >=  this.buildingType.buildTime){
			this.buildTimer = 0;
			var tilePos = assets.screenToMap(this.x, this.y);
			var unitTilePos = assets.getFreeTilePOS(tilePos[0], tilePos[1], gameInstanceScreen.connectionData.host, this.ours);
			if(unitTilePos){
				var unitPos = assets.mapToScreen(unitTilePos[0], unitTilePos[1]);
				if(this.ours){
					instanceData.units.push({
						name: gameInstanceScreen.connectionData.host ? 'hunit' + instanceData.unitCount++: 'ounit' + instanceData.unitCount++,
						x: unitPos[0],
						y: unitPos[1]
					});	
				}else{
					opponentData.units.push({
						name: gameInstanceScreen.connectionData.host ? 'hunit' + instanceData.unitCount++: 'ounit' + instanceData.unitCount++,
						x: unitPos[0],
						y: unitPos[1]
					});	
				}
			}
		}
	}else{
		this.buildTimer = 0;
	}
};

p.doDamage = function(dmg){
	// this.life -= dmg;
	
	// if(this.life <= 0){
	// 	// for( i = instanceData.buildings.length-1; i>=0; i--) {
	// 	// 	if( instanceData.buildings[i].name == this.name) {instanceData.buildings[i].kill = true;}
	// 	// }
	// 	var name = this.name;

	// 	$.each(instanceData.buildings, function(index, value){
	// 		if( value.name == name) {value.kill = true;}
	// 	});

	// 	assets.sendData();
	// }
};

window.Building = createjs.promote(Building, "Container");
}());