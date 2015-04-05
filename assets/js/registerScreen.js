(function() {

function RegisterScreen() {
	this.Container_constructor();	
	this.setup();
}

var p = createjs.extend(RegisterScreen, createjs.Container);

p.setup = function() {
    var buttonRegister;
        var buttonBack;

        buttonRegister = new createjs.Text("Register", "48px Arial", "#00F");
        buttonRegister.x = 256;
        buttonRegister.y = 480;
        buttonRegister.alpha = 0.5;
        var registerHit = new createjs.Shape();
        registerHit.graphics.beginFill("#000").drawRect(0, 0, buttonRegister.getMeasuredWidth(), buttonRegister.getMeasuredHeight());       
        buttonRegister.hitArea = registerHit;
        buttonRegister.on("mouseover", textMouseOver);
        buttonRegister.on("mouseout", textMouseOver);
        buttonRegister.on("click", function() { alert('Registering'); });

        buttonBack = new createjs.Text("Back", "48px Arial", "#00F");
        buttonBack.x = 768;
        buttonBack.y = 480;
        buttonBack.alpha = 0.5;
        var backHit = new createjs.Shape();
        backHit.graphics.beginFill("#000").drawRect(0, 0, buttonBack.getMeasuredWidth(), buttonBack.getMeasuredHeight());       
        buttonBack.hitArea = backHit;
        buttonBack.on("mouseover", textMouseOver);
        buttonBack.on("mouseout", textMouseOver);
        buttonBack.on("click", function() { hideRegister(); showLogin(); });
        
        this.addChild(buttonBack, buttonRegister);
} ;

window.RegisterScreen = createjs.promote(RegisterScreen, "Container");
}());