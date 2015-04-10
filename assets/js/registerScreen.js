(function() {

function RegisterScreen() {
	this.Container_constructor();	
	this.setup();
}

var p = createjs.extend(RegisterScreen, createjs.Container);

p.setup = function() {
    var registerForm = $('#registerForm');
    
    registerDOMElement = new createjs.DOMElement(registerForm[0]);
    registerDOMElement.x = (parseInt(canvas.style.width) * 0.5) - registerForm.width() * 0.5;
	registerDOMElement.y = -(parseInt(canvas.style.height) * 0.5) - registerForm.height() * 0.5;
    registerDOMElement.htmlElement.style.display = "block"
    registerDOMElement.name = "registerBlock"


    var registerFunction = function(){
        registerScreen.showLoading();
        if($('#txtRegisterPassword').val() ==  $('#txtRegisterPassword2').val()){
            assets.sendMSG('user_register', {name: $('#txtRegisterUser').val(), pass: $('#txtRegisterPassword').val()});
        }else{
            $('#messageAreaRegister').css('color', '#f00');
            $('#messageAreaRegister').text('Password doesnt match'); 
        }
    };

    var buttonRegister = new Button1("Register", "#00F", registerFunction);
    buttonRegister.x = 256;
    buttonRegister.y = 480;

    var buttonBack = new Button1("Back", "#00F", function() { hideRegister(); showLogin(); });
    buttonBack.x = 768;
    buttonBack.y = 480;

    this.addChild(buttonBack, buttonRegister, registerDOMElement);
} ;

p.msgRegisterResponce = function(msg){
    $('#messageAreaRegister').css('color', '#000');
    $('#messageAreaRegister').text(msg); 
}

p.showLoading = function(){
    $('#messageAreaRegister').css('color', '#000');
    $('#messageAreaRegister').text('Registering'); 
}

p.destroy = function(){
    registerScreen.getChildByName('registerBlock').htmlElement.style.display = "none";
}

window.RegisterScreen = createjs.promote(RegisterScreen, "Container");
}());