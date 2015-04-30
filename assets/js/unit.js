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
		if(this.ours){
			this.path = finder.findPath(pos[0], pos[1], 31, 14, grid);
		}else{
			this.path = finder.findPath(pos[0], pos[1], 14, 31, grid);
		}
	}else{
		if(this.ours){
			this.path = finder.findPath(pos[0], pos[1], 14, 31, grid);	
		}else{
			this.path = finder.findPath(pos[0], pos[1], 31, 14, grid);		
		}
	}

	this.addChild(circle);
};

p.updateTime = function(delta) {
	if(this.path.length != 0){
		var mapPositionToGo = this.path[0];
		var positionToGo = assets.mapToScreen(mapPositionToGo[0], mapPositionToGo[1]);

		var dx = positionToGo[0]-this.x;
		var dy = positionToGo[1]-this.y;

		var length = Math.sqrt(dx*dx+dy*dy);

		if(length != 0 ){
			dx/=length;
			dy/=length;


			dx *= 60 * delta;
			dy *= 60 * delta;

			this.x += dx|0;
			this.y += dy|0;
		}

		if(this.x == positionToGo[0] && this.y == positionToGo[1]){
			this.path.shift();
		}
	}

	// if(this.ours){
	// 	if(gameInstanceScreen.connectionData.host){
	// 		//move right
	// 		this.x += 10 * delta;
	// 	}else{
	// 		//move left
	// 		this.x -= 10 * delta;
	// 	}
	// }
	// else{
	// 	if(gameInstanceScreen.connectionData.host){
	// 			//move left
	// 			this.x -= 10 * delta;
	// 		}else{
	// 			//move right
	// 			this.x += 10 * delta;
	// 		}	
	// 	}
	// }
};

window.Unit = createjs.promote(Unit, "Container");
}());