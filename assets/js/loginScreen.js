//@ sourceURL=login.js

(function() {

function LoginScreen() {
	this.Container_constructor();	
	this.setup();
}

var p = createjs.extend(LoginScreen, createjs.Container);

p.setup = function() {
    var buttonLogin;
    var buttonRegister;
    var loginBlock = $('.formStyle')[0];
    var loginDiv = $('#myform');
    
    loginDOMElement = new createjs.DOMElement(loginBlock);
    loginDOMElement.x = (canvas.width * 0.5) - loginDiv.width() * 0.5;
    loginDOMElement.y = -(canvas.height * 0.5) - loginDiv.height() * 0.5;
    loginDOMElement.htmlElement.style.display = "block"
    loginDOMElement.name = "LoginBlock"

    buttonLogin = new Button1("Login", "#00F", function() { hideLogin(); showMenu(); });
    buttonLogin.x = 256;
    buttonLogin.y = 480;

    buttonRegister = new Button1("Register", "#00F", function() { hideLogin(); showRegister(); });
    buttonRegister.x = 768;
    buttonRegister.y = 480;

    back = new createjs.Shape();
	stage.addChild(back);
	back.x = 0;back.y = 0;
	back.graphics.beginBitmapFill(loginBackGround,'repeat').drawRect(0,0,canvas.width,canvas.height);

    this.addChild(buttonLogin, buttonRegister, loginDOMElement);
} ;

window.LoginScreen = createjs.promote(LoginScreen, "Container");
}());