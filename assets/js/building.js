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
		building = assets.createBuilding(this.ours ? 27 : 28);
	}else{
		building = assets.createBuilding(this.ours ? 28 : 27);
	}
	
    this.addChild(building);
};

p.updateTime = function(delta) {
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
					name: gameInstanceScreen.connectionData.host ? 'hunit' + instanceData.units.length: 'ounit' + instanceData.units.length,
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

window.Building = createjs.promote(Building, "Container");
}());