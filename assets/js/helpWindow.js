//# sourceURL=helpWindow.js

(function() {
function HelpWindow() {
	this.Container_constructor();	
	this.name = 'helpWindow';
	this.pageNumber = 1;
	this.setup();
}

var p = createjs.extend(HelpWindow, createjs.Container);

p.setup = function() {
	var container = new createjs.Container();
	container.x = 0;
	container.y = 0;
	//container.regY = 542;
	container.scaleY = 0;
	container.setBounds(0, 0, 1280, 720);
	var b = container.getBounds();

	container.addEventListener("click", function(event) { 
	});

	this.setPage(container, this.pageNumber);

	this.addChild(container);
};

p.setPage = function (container, pageNumber) {
	container.removeAllChildren();

	var b = container.getBounds();	
	var bitmap = new createjs.Bitmap("assets/img/credits.jpg");

	container.addChild(bitmap);
	this.helpButton(container);

	switch(pageNumber) {
    case 1:
    		this.tutorialButton(container);
    		this.helpButton(container);

        break;
    case 2:
			var bitmap = new createjs.Bitmap("assets/img/mainMenuHelp.jpg");
			bitmap.x = 0; 
			bitmap.y = 0;
			container.addChild(bitmap);

    		this.nextButton(container);
    		this.prevButton(container);
    		this.helpButton(container);
        break;
    case 3:
	    	var bitmap = new createjs.Bitmap("assets/img/ingame1.jpg");
			bitmap.x = 0; 
			bitmap.y = 0;
			container.addChild(bitmap);

    		this.nextButton(container);
    		this.prevButton(container);
    		this.helpButton(container);
        break;
    case 4:
	    	var bitmap = new createjs.Bitmap("assets/img/ingame2.jpg");
			bitmap.x = 0; 
			bitmap.y = 0;
			container.addChild(bitmap);

    		this.prevButton(container);
    		this.helpButton(container);
        break;
    }
}

p.nextButton = function (container) {
	var b = container.getBounds();	

    var btnNextPage = new InitButton("btnNextPage", buttons.Start, function() {
    	this.parent.parent.pageNumber++;

    	this.parent.parent.setPage(container, this.parent.parent.pageNumber)
    });

	btnNextPage.x = 1255 - 70;
	btnNextPage.y = 360;

	container.addChild(btnNextPage);
}

p.prevButton = function (container) {
	var b = container.getBounds();	

    var btnPrevPage = new InitButton("btnPrevPage", buttons.Left, function() {
    	this.parent.parent.pageNumber--;

    	this.parent.parent.setPage(container, this.parent.parent.pageNumber)
    });

	btnPrevPage.x = 25; 
	btnPrevPage.y = 360;

	container.addChild(btnPrevPage);
}

p.tutorialButton = function (container) {
	var b = container.getBounds();	

    var btnPrevPage = new InitButton("btnSheetEmpty", buttons.btnEmpty, function() {
    	this.parent.parent.pageNumber++;

    	this.parent.parent.setPage(container, this.parent.parent.pageNumber)
    });

	btnPrevPage.x = 640 - 120; 
	btnPrevPage.y = 480 + 45;

	container.addChild(btnPrevPage);
}

p.helpButton = function (container) {
	var b = container.getBounds();	

    var btnCloseHelp = new InitButton("btnCloseHelp", buttons.Decline, function() {

        createjs.Tween.get(container, { loop: false })
        .to({scaleY: 0}, 1000, createjs.Ease.getPowInOut(4)).call(function(){
    					var help = container.parent;
						help.removeAllChildren();
						delete help;
	        		});;

    });

	btnCloseHelp.x = 1255 - 70;
	btnCloseHelp.y = 25;
	container.addChild(btnCloseHelp);
}

window.HelpWindow = createjs.promote(HelpWindow, "Container");
}());