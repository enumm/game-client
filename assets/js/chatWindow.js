(function() {
function ChatWindow() {
	this.Container_constructor();	
	this.name = 'chatWindow';
	this.setup();
}

var p = createjs.extend(ChatWindow, createjs.Container);

p.setup = function() {
    $("#chatInputBox").keyup(function(event){
        if(event.keyCode == 13){
            if(this.value){
                assets.sendMainChat(this.value)
                this.value = '';    
            }
        }
    });

    //button
    var chatButton =  new InitButton("chatButton", buttons.Chat, function() {
        var chatWindow = this.parent;
        if(chatWindow.animationComplete){
            chatWindow.onOpenClosed();
            chatWindow.animationComplete = false;
            chatWindow.setChatPosition(true);
        }
    });

    chatButton.x = 1230;
    chatButton.y = 310;

    chatButton.name = 'chatButton';

    this.addChild(chatButton);

    //panel
    var chatElement = document.getElementById("mainChat");
    $(chatElement).show();

    var chatDOM = new createjs.DOMElement(chatElement);
    chatDOM.name = 'chatDOM';

    chatDOM.x = this.getChatX();
    chatDOM.y = 110 * parseInt(canvas.style.height)/720;

    chatDOM.scaleX = 0;
    chatDOM.scaleY = parseInt(canvas.style.height)/720;

    this.addChild(chatDOM);

    //vars
    this.open = false;
    this.animationComplete = true;
};

p.setChatScale = function(){
    var chatDOM = this.getChildByName('chatDOM');
    if (this.open) {
        chatDOM.scaleX = parseInt(canvas.style.width)/1280;
    }else{
        chatDOM.scaleX = 0;
    }

    chatDOM.scaleY = parseInt(canvas.style.height)/720;
};

p.setChatPosition = function(clicked){
    var chatDOM = this.getChildByName('chatDOM');
    var chatButton = this.getChildByName('chatButton');
    if(!clicked){
        chatDOM.x = this.getChatX();
        chatDOM.y = 110 * parseInt(canvas.style.height)/720; 

    }else{
        createjs.Tween.get(chatButton, { loop: false })
        .to({ x: chatButton.x == 930 ? 1230 : 930}, 1000, createjs.Ease.getPowInOut(4));

        createjs.Tween.get(chatDOM, { loop: false })
        .to({ x: this.getChatX(), scaleX: this.getChatScaleX()}, 1000, createjs.Ease.getPowInOut(4))
        .call(function(){
            this.parent.animationComplete = true;
        });
    }
};

p.onOpenClosed = function(){
    if(!this.open){
        this.open = true;
    }else{
        this.open = false;
    }
};

p.getChatX = function(){
    //TODO: 200 hardcoded chatDOM width.
    var scale = $(canvas).width()/1280;
    if(this.open){
        return $(window).width()/2+parseInt(canvas.style.width)/2-(300*scale);
    }else{
        return $(window).width()/2+parseInt(canvas.style.width)/2;
    }
};

p.getChatScaleX = function(){
    if(this.open){
        return parseInt(canvas.style.width)/1280;
    }else{
        return 0;
    }
};

window.ChatWindow = createjs.promote(ChatWindow, "Container");
}());