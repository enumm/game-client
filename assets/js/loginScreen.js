(function() {

function LoginScreen() {
	this.Container_constructor();	
	this.setup();
}

var p = createjs.extend(LoginScreen, createjs.Container);

p.setup = function() {
    var buttonLogin;
    var buttonRegister;

    buttonLogin = new createjs.Text("Login", "48px Arial", "#00F");
    buttonLogin.x = 256;
    buttonLogin.y = 480;
    buttonLogin.alpha = 0.5;
    var loginHit = new createjs.Shape();
    loginHit.graphics.beginFill("#000").drawRect(0, 0, buttonLogin.getMeasuredWidth(), buttonLogin.getMeasuredHeight());       
    buttonLogin.hitArea = loginHit;
    buttonLogin.on("mouseover", textMouseOver);
    buttonLogin.on("mouseout", textMouseOver);
    buttonLogin.on("click", function() { hideLogin(); showMenu(); });

    buttonRegister = new createjs.Text("Register", "48px Arial", "#00F");
    buttonRegister.x = 768;
    buttonRegister.y = 480;
    buttonRegister.alpha = 0.5;
    var registerHit = new createjs.Shape();
    registerHit.graphics.beginFill("#000").drawRect(0, 0, buttonRegister.getMeasuredWidth(), buttonRegister.getMeasuredHeight());       
    buttonRegister.hitArea = registerHit;
    buttonRegister.on("mouseover", textMouseOver);
    buttonRegister.on("mouseout", textMouseOver);
    buttonRegister.on("click", function() { hideLogin(); showRegister(); });

    this.addChild(buttonLogin, buttonRegister);
} ;

window.LoginScreen = createjs.promote(LoginScreen, "Container");
}());