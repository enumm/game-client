//# sourceURL=debugScreen.js
(function() {

function DebugScreen() {
	this.Container_constructor();	
	this.setup();
}

var p = createjs.extend(DebugScreen, createjs.Container);

p.setup = function() {
    var loginDiv = $('#loginForm');
    
    loginDOMElement = new createjs.DOMElement(loginDiv[0]);
    loginDOMElement.x = (parseInt(canvas.style.width) * 0.5) - loginDiv.width() * 0.5;
	loginDOMElement.y = -(parseInt(canvas.style.height) * 0.5) - loginDiv.height() * 0.5;
    loginDOMElement.htmlElement.style.display = "block"
    loginDOMElement.name = "LoginBlock"

    var debug = true;

    var btnDebug1 = new Button1("Debug A", "#00F", function() { mainPanel.hide(); assets.sendMSG('user_login', {name: 'jesus', pass: 'jesus'}) });
        btnDebug1.x = 256;
        btnDebug1.y = 300;
        
    var btnDebug2 = new Button1("Debug B", "#00F", function() { mainPanel.hide(); assets.sendMSG('user_login', {name: 'vvvv', pass: 'vvvv'}) });
        btnDebug2.x = 256;
        btnDebug2.y = 350;

   if(debug){
    this.addChild(btnDebug1,btnDebug2);
   }

   //this.addChild(loginDOMElement);
} ;

p.destroy = function(){
    $(this.children).each(function(index, child){
        this.removeChild(child);
    });
}

window.DebugScreen = createjs.promote(DebugScreen, "Container");
}());