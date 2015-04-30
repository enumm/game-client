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
	circle.graphics.beginFill("yellow").drawCircle(0, 0, 10);
	circle.x = 64;
	circle.y = 84;

	this.x = this.posX;
	this.y = this.posY;

	var grid = new PF.Grid(assets.getMapMatrix());
	var pos = assets.screenToMap(this.x, this.y);
	if(gameInstanceScreen.connectionData.host){
		debugger;
		this.path = finder.findPath(pos[0], pos[1], 31, 14, grid);	
	}else{
		this.path = finder.findPath(pos[0], pos[1], 14, 13, grid);	
	}

	this.addChild(circle);
};

p.updateTime = function(delta) {
	if(this.ours){
		if(gameInstanceScreen.connectionData.host){
			//move right
			this.x += 10 * delta;
		}else{
			//move left
			this.x -= 10 * delta;
		}
	}
	else{
		if(gameInstanceScreen.connectionData.host){
				//move left
				this.x -= 10 * delta;
			}else{
				//move right
				this.x += 10 * delta;
			}	
		}
};

window.Unit = createjs.promote(Unit, "Container");
}());