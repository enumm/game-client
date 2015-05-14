(function() {
function ChatWindow() {
	this.Container_constructor();	
	this.name = 'chatWindow';
	this.setup();
}

var p = createjs.extend(ChatWindow, createjs.Container);

p.setup = function() {
	//
	var shape = new createjs.Shape();
    shape.graphics.beginFill('black');
    shape.graphics.drawRect(0, 0, 200, 500);
    shape.graphics.endFill();
    shape.x = 1280;
    shape.y = 110;
    shape.name = 'rekt';

    this.addChild(shape);

    var shape1 = new createjs.Shape();
    shape1.graphics.beginFill('green');
    shape1.graphics.drawRect(0, 0, 50, 100);
    shape1.graphics.endFill();
    shape1.x = 1230;
    shape1.y = 310;
    shape1.name = 'rekt1';

    this.addChild(shape1);

    shape1.on("click", function(){
    	createjs.Tween.get(shape, { loop: false })
		.to({ x: shape.x == 1080 ? 1280: 1080}, 1000, createjs.Ease.getPowInOut(4));

		createjs.Tween.get(shape1, { loop: false })
		.to({ x: shape1.x == 1030 ? 1230 : 1030}, 1000, createjs.Ease.getPowInOut(4));
	});
};

window.ChatWindow = createjs.promote(ChatWindow, "Container");
}());