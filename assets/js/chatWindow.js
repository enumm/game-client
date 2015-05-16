//# sourceURL=chatWindow.js
(function() {
function ChatWindow() {
	this.Container_constructor();	
	this.name = 'chatWindow';
	this.setup();
}

var p = createjs.extend(ChatWindow, createjs.Container);

p.setup = function() {
	var shape = new createjs.Shape();
    shape.graphics.beginFill('black');
    shape.graphics.drawRect(0, 0, 200, 500);
    shape.graphics.endFill();
    shape.x = 1280;
    shape.y = 110;
    shape.name = 'rekt';

    this.addChild(shape);

    var chatButton = new createjs.Shape();
    chatButton.graphics.beginFill('green');
    chatButton.graphics.drawRect(0, 0, 50, 100);
    chatButton.graphics.endFill();
    chatButton.x = 1230;
    chatButton.y = 310;
    chatButton.name = 'chatButton';

    this.addChild(chatButton);

    //TODO PV, AR REIK CIA COMMENTS?

    //    chatButton.on("click", function(){
    //    	createjs.Tween.get(shape, { loop: false })
	// 	.to({ x: shape.x == 1080 ? 1280: 1080}, 1000, createjs.Ease.getPowInOut(4));

	// 	createjs.Tween.get(chatButton, { loop: false })
	// 	.to({ x: chatButton.x == 1030 ? 1230 : 1030}, 1000, createjs.Ease.getPowInOut(4));
	// });

    var chatElement = document.getElementById("mainChat");
    $(chatElement).show();
    var chatDOM = new createjs.DOMElement(chatElement);
    chatDOM.name = 'chatDOM';

    // if(window.innerWidth > parseInt(canvas.style.width)){
    //     chatDOM.regX = -(window.innerWidth - parseInt(canvas.style.width))/2;
    // }else{
    //     chatDOM.regX = 0;
    // }

    chatDOM.x = this.getChatX();
    chatDOM.y = 110 * parseInt(canvas.style.height)/720;

    chatDOM.scaleX = parseInt(canvas.style.width)/1280;
    chatDOM.scaleY = parseInt(canvas.style.height)/720;

    this.addChild(chatDOM);
    this.open = false;
    this.animationComplete = true;

    chatButton.on("click", function(){
        var chatWindow = this.parent;
        if(chatWindow.animationComplete){
            chatWindow.onOpenClosed();
            chatWindow.animationComplete = false;
            chatWindow.setChatPosition(true);
        }
    });
};

p.setChatScale = function(){
    var chatDOM = this.getChildByName('chatDOM');
    chatDOM.scaleX = parseInt(canvas.style.width)/1280;
    chatDOM.scaleY = parseInt(canvas.style.height)/720;
};

p.setChatPosition = function(clicked){
    var chatDOM = this.getChildByName('chatDOM');
    var chatButton = this.getChildByName('chatButton');
    if(!clicked){
        chatDOM.x = this.getChatX();
        chatDOM.y = 110 * parseInt(canvas.style.height)/720; 

    }else{
        // var toAlpha;
        // toAlpha = this.open ? 1 : 0;

        createjs.Tween.get(chatButton, { loop: false })
        .to({ x: chatButton.x == 1030 ? 1230 : 1030}, 1000, createjs.Ease.getPowInOut(4));

        createjs.Tween.get(chatDOM, { loop: false })
        .to({ x: this.getChatX()}, 1000, createjs.Ease.getPowInOut(4))
        .call(function(){
            this.parent.animationComplete = true;
        });
    }
}

p.onOpenClosed = function(){
    if(!this.open){
        this.open = true;
    }else{
        this.open = false;
    }
}

p.getChatX = function(){
    var scale = $(canvas).width()/1280;
    if(this.open){
        return $(window).width()/2+parseInt(canvas.style.width)/2-(200*scale);
    }else{
        return $(window).width()/2+parseInt(canvas.style.width)/2;
    }
}

window.ChatWindow = createjs.promote(ChatWindow, "Container");
}());