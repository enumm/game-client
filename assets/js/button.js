//# sourceURL=buttonNX.js
(function() {

function InitButton(title, buttonSheet, OnClick, selected) {
	this.Container_constructor();

	this.title = title;
	this.selected = selected ? true : false;
	this.buttonSheet = buttonSheet;
	this.OnClick = OnClick;
		
	this.setup();
}

var p = createjs.extend(InitButton, createjs.Container);

p.setup = function() {
	if(!this.buttonSheet){
		this.buttonSheet = buttons.btnEmpty;	
	}

	this.btn = new createjs.Sprite(this.buttonSheet);
    this.bitmapHelper = new createjs.ButtonHelper(this.btn);
    if(this.selected){
    	this.select();
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