//# sourceURL=chatWindow.js
(function() {
function IngameChatWindow() {
	this.Container_constructor();	
	this.name = 'IngameChatWindow';
	this.setup();
}

var p = createjs.extend(IngameChatWindow, createjs.Container);

p.setup = function() {
    $("#ingameInputBox").keyup(function(event){
        if(event.keyCode == 13){
            if(this.value){
                assets.sendIngameChat(this.value)
                this.value = '';    
            }
        }
    });

    //panel
    var chatElement = document.getElementById("ingameChat");
    $(chatElement).show();

    var chatDOM = new createjs.DOMElement(chatElement);
    chatDOM.name = 'chatDOM';

    var scale = $(canvas).width()/1280;
    chatDOM.x = $(window).width()/2-parseInt(canvas.style.width)/2+(10*scale);
    chatDOM.y = 500 * parseInt(canvas.style.height)/720;

    // chatDOM.scaleX = 0;
    chatDOM.scaleX = parseInt(canvas.style.width)/1280;
    chatDOM.scaleY = parseInt(canvas.style.height)/720;

    this.addChild(chatDOM);
};

p.setChatScale = function(){
    var chatDOM = this.getChildByName('chatDOM');
    chatDOM.scaleX = parseInt(canvas.style.width)/1280;
    chatDOM.scaleY = parseInt(canvas.style.height)/720;
};

p.setChatPosition = function(clicked){
    var chatDOM = this.getChildByName('chatDOM');

    var scale = $(canvas).width()/1280;
    chatDOM.x = $(window).width()/2-parseInt(canvas.style.width)/2+(10*scale);
    chatDOM.y = 500 * parseInt(canvas.style.height)/720;
};

window.IngameChatWindow = createjs.promote(IngameChatWindow, "Container");
}());