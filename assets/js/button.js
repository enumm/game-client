//@ sourceURL=button.js
(function() {

function Button1(label, color, OnClick) {
	this.Container_constructor();
	
	this.color = color;
	this.label = label;
	this.OnClick = OnClick;
	
	this.setup();
}
var p = createjs.extend(Button1, createjs.Container);

p.setup = function() {
	var text = new createjs.Text(this.label, "20px Arial", "#000");
	text.textBaseline = "top";
	text.textAlign = "center";
	
	var width = text.getMeasuredWidth() + 30;
	var height = text.getMeasuredHeight() + 20;
	
	text.x = width/2;
	text.y = 10;
	
	var background = new createjs.Shape();
	background.graphics.beginFill(this.color).drawRoundRect(0,0,width,height,10);
	
	this.addChild(background, text); 
	this.on("click", this.handleClick);
	this.on("rollover", this.handleRollOver);
	this.on("rollout", this.handleRollOver);
	this.cursor = "pointer";

	this.mouseChildren = false;
	
	this.offset = Math.random()*10;
	this.count = 0;
} ;

p.handleClick = function (event) {
	function isFunction(functionToCheck) {
 		var getType = {};
 		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}

	if(isFunction(this.OnClick)){
		this.OnClick();
	}
	console.log('You clicked on a button: ' + this.label);
} ;

p.handleRollOver = function(event) {       
	this.alpha = event.type == "rollover" ? 0.4 : 1;
};

window.Button1 = createjs.promote(Button1, "Container");
}());