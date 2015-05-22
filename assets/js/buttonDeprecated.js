//# sourceURL=button.js
(function() {

function Button1(label, color, images, OnClick, width, height) {
	this.Container_constructor();
	
	this.selected = false;
	this.color = color;
	this.label = label;
	this.images = images;
	this.OnClick = OnClick;
	this.width = width;
	this.height = height;
	
	this.setup();
}
var p = createjs.extend(Button1, createjs.Container);

p.setup = function() {

	var sprites = this.images ? this.images : null;
	var sprite = this.images ? this.images[0] : buttonImg;
    

	var text = new createjs.Text(this.label, "20px Almendra", "#000");
	text.textBaseline = "top";
	text.textAlign = "center";
	
	var width = this.width ? this.width : text.getMeasuredWidth() + 30;
	var height = this.height ? this.height : text.getMeasuredHeight() + 20;

	text.x = width/2;
	text.y = 10;
	
	//var background = new createjs.Shape();
	//background.graphics.beginFill(this.color).drawRoundRect(0,0,width,height,10);
	
	var data = {
    images: [sprite],
    frames: { width: sprite.width, height: sprite.height},
	};
	var spriteSheet = new createjs.SpriteSheet(data);
	var button = new createjs.Sprite(spriteSheet);

	button.alpha = 1;

	this.addChild(button, text); 
	this.on("click", this.handleClick);
	this.on("rollover", this.handleRollOver);
	this.on("rollout", this.handleRollOver);
	this.cursor = "pointer";

	this.mouseChildren = false;
} ;

p.handleClick = function (event) {
	function isFunction(functionToCheck) {
 		var getType = {};
 		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}

	if(isFunction(this.OnClick)){
		this.OnClick();
	}

} ;

p.handleRollOver = function(event) {       
	this.alpha = event.type == "rollover" ? 0.4 : 1;
};

window.Button1 = createjs.promote(Button1, "Container");
}());