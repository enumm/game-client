(function() {

function Unit(name, ours) {
	this.Container_constructor();
	this.unitName = name;
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