(function() {

function Building(name, ours) {
	this.Container_constructor();
	this.buildingName = name;
	this.ours = ours;
	this.buildTimer = 0;
	this.setup();
}
var p = createjs.extend(Building, createjs.Container);

p.setup = function() {
	this.name = this.buildingName;
	var building = assets.createBuilding(gameInstanceScreen.connectionData.host ? 27 : 28);
    this.addChild(building);
};

p.updateTime = function(delta) {
	this.buildTimer += delta;
	if(this.buildTimer >= 20){
		this.buildTimer = 0;
		if(this.ours){
			instanceData.units.push({name: 'unit'});
			console.log('our units + 1');	
		}else{
			opponentData.units.push({name: 'unit'});
			console.log('enemy units + 1');
		}
	}
};

window.Building = createjs.promote(Building, "Container");
}());