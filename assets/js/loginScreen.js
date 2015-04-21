(function() {

function LoginScreen() {
	this.Container_constructor();	
	this.setup();
}

var p = createjs.extend(LoginScreen, createjs.Container);

p.setup = function() {
    var loginDiv = $('#loginForm');
    
    loginDOMElement = new createjs.DOMElement(loginDiv[0]);
    loginDOMElement.x = (parseInt(canvas.style.width) * 0.5) - loginDiv.width() * 0.5;
	loginDOMElement.y = -(parseInt(canvas.style.height) * 0.5) - loginDiv.height() * 0.5;
    loginDOMElement.htmlElement.style.display = "block"
    loginDOMElement.name = "LoginBlock"

    var buttonLogin = new Button1("Login", "#00F", function() { loginScreen.showLoading(); assets.sendMSG('user_login', {name: $('#txtUser').val(), pass: $('#txtPassword').val()}) });

    buttonLogin.x = 256;
    buttonLogin.y = 480;

    var buttonRegister = new Button1("Register", "#00F", function() { hideLogin(); showRegister(); });
    buttonRegister.x = 768;
    buttonRegister.y = 480;

   
    this.addChild(buttonLogin, buttonRegister, loginDOMElement);
} ;

p.msgLoggedIn = function(){
    hideLogin();
    showMenu();
}

p.msgLogginFailed = function(msg){
    $('#messageAreaLogin').css('color', '#f00');
    $('#messageAreaLogin').text(msg); 
}

p.showLoading = function(){
    $('#messageAreaLogin').css('color', '#000');
    $('#messageAreaLogin').text('Connecting'); 
}

p.destroy = function(){
    loginScreen.getChildByName('LoginBlock').htmlElement.style.display = "none";
}

window.LoginScreen = createjs.promote(LoginScreen, "Container");
}());