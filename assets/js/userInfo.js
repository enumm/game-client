//# sourceURL=userInfo.js

(function() {
function UserInfo(name, stats) {
	this.Container_constructor();	
	this.name = 'userInfo';
	this.userName = name;
	this.stats = stats;
	this.setup();
	this.animationComplete = true;
}

var p = createjs.extend(UserInfo, createjs.Container);

p.setup = function() {
	var container = new createjs.Container();
	container.x = 760;
	container.y = 255;
	container.setBounds(0, 0, 290, 290);
	var b = container.getBounds();
	container.regX = b.width/2;
	container.regY = b.height/2;
	this.fliped = false;


	this.setPicture(container);

	container.addEventListener("click", function(event) { 
        if(container.parent.animationComplete){
            container.parent.animationComplete = false;
            
        	createjs.Tween.get(container, { loop: false }) 
        	.to({skewY: 90}, 1000, createjs.Ease.linear).call(function(){
	        	if(!this.parent.fliped)
	        	{
	        		container.removeAllChildren();
					this.parent.setStats(container);
	        		this.parent.fliped = true;

	        		createjs.Tween.get(container, { loop: false }) 
	        		.to({skewY: 180}, 1000, createjs.Ease.linear).call(function(){
	        			container.parent.animationComplete = true;
	        		});
	        	}
	        	else
	        	{
	        		container.removeAllChildren();
	        		this.parent.setPicture(container);
	        		this.parent.fliped = false;
	        		createjs.Tween.get(container, { loop: false }) 
	        		.to({skewY: 0}, 1000, createjs.Ease.linear).call(function(){
	        			container.parent.animationComplete = true;
	        		});
	        	}
	    	});
        }

	});

	this.addChild(container);
};

p.setPicture = function (container) {
	var b = container.getBounds();	
	var rect = new createjs.Shape();
	rect.graphics.beginFill('Black').drawRect(0, 0, 290, 290);
	rect.alpha = 0.8; 
	container.addChild(rect);

	var bitmap = new createjs.Bitmap("assets/img/userPicture2.png");
	bitmap.x = b.width/2 - 100; 
	bitmap.y = b.height/2 - 140;
	container.addChild(bitmap);

	var text = new createjs.Text(this.userName, "50px Almendra", "#FFFFFF");

	text.x = b.width/2 - text.getMeasuredWidth()/2; 
	text.y = b.height/2 + 65;

	container.addChild(text);
}

p.setStats = function (container) {
	var b = container.getBounds();
	var rect = new createjs.Shape();
	rect.graphics.beginFill('Black').drawRect(0, 0, 290, 290);
	rect.alpha = 0.8; 
	container.addChild(rect);

	var text = new createjs.Text(this.stats, "20px Almendra", "#FFFFFF");
	text.skewY = 180;
	text.x = b.x + 280; 
	text.y = b.height/2 - text.getMeasuredHeight()/2;

	container.addChild(text);
}

window.UserInfo = createjs.promote(UserInfo, "Container");
}());