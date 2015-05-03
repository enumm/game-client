(function() {

function Building(name, ours) {
	this.Container_constructor();
	this.buildingName = name;
	this.ours = ours;
	this.buildTimer = 0;
	this.producing = true;
	this.setup();
}
var p = createjs.extend(Building, createjs.Container);

p.setup = function() {
	this.name = this.buildingName;
	var building = null;

	if(gameInstanceScreen.connectionData.host){
		building = assets.createBuilding(this.ours ? 56 : 57);
	}else{
		building = assets.createBuilding(this.ours ? 57 : 56);
	}
	
    this.addChild(building);

	this.life = 200;
    var rect = new createjs.Shape();
 	rect.graphics.beginFill("#0f0").drawRect(35, 30, 0.3 * this.life, 5);
 	rect.name = 'greenHP';
 	var rect1 = new createjs.Shape();
 	rect1.graphics.beginFill("#f00").drawRect(35, 30, 0.3 * this.life, 5);
 	rect1.name = 'redHP';
 	
 	this.addChild(rect1, rect);
};

p.updateTime = function(delta) {
	//hp
	var rectHP = this.getChildByName('greenHP');
	rectHP.graphics.clear()
	rectHP.graphics.beginFill("#0f0").drawRect(35, 30, 0.3 * this.life, 5);

	this.buildTimer += delta;
	if(this.buildTimer >= 10){
		this.buildTimer = 0;

		// console.log(this.name + '  ours: ' +this.ours);
		if(this.ours){
			var tilePos = assets.screenToMap(this.x, this.y);
			var unitTilePos = assets.getFreeTilePOS(tilePos[0], tilePos[1], gameInstanceScreen.connectionData.host);
			if(unitTilePos){
				var unitPos = assets.mapToScreen(unitTilePos[0], unitTilePos[1]);
				instanceData.units.push({
					name: gameInstanceScreen.connectionData.host ? 'hunit' + instanceData.unitCount++: 'ounit' + instanceData.unitCount++,
					x: unitPos[0],
					y: unitPos[1]
				});	
			}
		}
		//else{
		// 	//opponentData.units.push({name: gameInstanceScreen.connectionData.host ? 'hunit' + instanceData.buildings.length: 'ounit' + instanceData.units.length, x: this.x, y: this.y});
		// 	// console.log('enemy units + 1');
		// }

		assets.sendData();
	}
};

p.isProducing = function(){
	return this.producing; // todo stop production
};

p.setProducing = function(producing){
	this.producing = producing;
	this.buildTimer = 0;
};

p.doDamage = function(dmg){
	this.life -= dmg;
	
	if(this.life <= 0){
		// for( i = instanceData.buildings.length-1; i>=0; i--) {
		// 	if( instanceData.buildings[i].name == this.name) {instanceData.buildings[i].kill = true;}
		// }
		var name = this.name;

		$.each(instanceData.buildings, function(index, value){
			if( value.name == name) {value.kill = true;}
		});

		assets.sendData();
	}
};

window.Building = createjs.promote(Building, "Container");
}());