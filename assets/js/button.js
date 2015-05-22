//# sourceURL=buttonNX.js
(function() {

function InitButton(title, buttonSheet, OnClick, isCustom) {
	this.Container_constructor();

	this.title = title;
	this.buttonSheet = buttonSheet;
	this.OnClick = OnClick;
	this.isCustom = isCustom;	
		
	this.setup();
}

var p = createjs.extend(InitButton, createjs.Container);

p.setup = function() {
	if(!this.buttonSheet){
		this.buttonSheet = buttons.btnEmpty;	
	}

	this.btn = new createjs.Sprite(this.buttonSheet);

	if(this.isCustom){
		this.bitmapHelper = new ButtonHelper(this.btn);
	}
	else{
		this.bitmapHelper = new createjs.ButtonHelper(this.btn);
	}

    this.addChild(this.btn);
	this.btn.on("click", this.handleClick);
} ;

p.handleClick = function (event) {
	function isFunction(functionToCheck) {
 		var getType = {};
 		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}
	var button = this.parent;

	if(isFunction(button.OnClick)){
		button.OnClick();
	}

	button.select();
};

p.deselect = function(){
	// this.bitmapHelper.outLabel = 'out';
	// this.bitmapHelper.overLabel = 'over';
}

p.select = function(){
	// this.bitmapHelper.outLabel = 'down';
	// this.bitmapHelper.overLabel = 'down';
}

window.InitButton = createjs.promote(InitButton, "Container");
}());