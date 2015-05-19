//# sourceURL=chatWindow.js
(function() {
function FriendWindow() {
	this.Container_constructor();	
	this.name = 'friendWindow';
	this.setup();
}

var p = createjs.extend(FriendWindow, createjs.Container);

p.setup = function() {

    var friendButton = new createjs.Shape();
    friendButton.graphics.beginFill('red');
    friendButton.graphics.drawRect(0, 0, 50, 100);
    friendButton.graphics.endFill();
    friendButton.x = 0;
    friendButton.y = 310;
    friendButton.name = 'friendButton';

    this.addChild(friendButton);

    //panel
    var friendElement = document.getElementById("mainFriends");
    $(friendElement).show();

    var friendDOM = new createjs.DOMElement(friendElement);
    friendDOM.name = 'friendDOM';

    friendDOM.x = this.getFriendX();
    friendDOM.y = 110 * parseInt(canvas.style.height)/720;

    friendDOM.scaleX = 0;
    friendDOM.scaleY = parseInt(canvas.style.height)/720;

    this.addChild(friendDOM);


    this.open = false;
    this.animationComplete = true;

    friendButton.on("click", function(){
        var friendsWindow = this.parent;
        if(friendsWindow.animationComplete){
            friendsWindow.onOpenClosed();
            friendsWindow.animationComplete = false;
            friendsWindow.setFriendPosition(true);
        }
    });

    $("#friendInputBox").keyup(function(event){
        if(event.keyCode == 13){
            if(this.value){
                assets.sendMSG('add_friend', {friendName : this.value});
                this.value = '';    
            }
        }
    });

    assets.sendMSG('get_user_friends');

//     assets.sendMSG('add_friend', {friendName : $('#addFriendUsername').val()});
// //# sourceURL=friendScreen.js
// (function() {

//     var o = window.friendScreen = {};
    
//     o.add = function(){
//     assets.sendMSG('add_friend', {friendName : $('#addFriendUsername').val()});
//     $('#addFriend').css('display','none');
//     }

//     o.showFriendPanel = function(){
//         assets.sendMSG('get_user_friends');
//     }

//     o.destroy = function(){
//     //registerScreen.getChildByName('registerBlock').htmlElement.style.display = "none";
//     }

// }());


};

p.setFriendScale = function(){
    var friendDOM = this.getChildByName('friendDOM');
    if (this.open) {
        friendDOM.scaleX = parseInt(canvas.style.width)/1280;
    }else{
        friendDOM.scaleX = 0;
    }

    friendDOM.scaleY = parseInt(canvas.style.height)/720;
};

p.onOpenClosed = function(){
    if(!this.open){
        this.open = true;
    }else{
        this.open = false;
    }
};

p.getFriendX = function(){
    var scale = $(canvas).width()/1280;
    return $(window).width()/2-parseInt(canvas.style.width)/2;
};

p.setFriendPosition = function(clicked){
    var friendDOM = this.getChildByName('friendDOM');
    var friendButton = this.getChildByName('friendButton');

    if(!clicked){
         friendDOM.x = this.getFriendX();
         friendDOM.y = 110 * parseInt(canvas.style.height)/720; 

    }else{
        createjs.Tween.get(friendButton, { loop: false })
        .to({ x: friendButton.x == 0 ? 200 : 0}, 1000, createjs.Ease.getPowInOut(4)).call(function(){
            this.parent.animationComplete = true;
        });

        createjs.Tween.get(friendDOM, { loop: false })
        .to({scaleX: this.getFriendScaleX()}, 1000, createjs.Ease.getPowInOut(4))
        .call(function(){
            this.parent.animationComplete = true;
        });
    }
};

p.getFriendScaleX = function(){
    if(this.open){
        return parseInt(canvas.style.width)/1280;
    }else{
        return 0;
    }
};

window.FriendWindow = createjs.promote(FriendWindow, "Container");
}());