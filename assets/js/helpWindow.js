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
	container.x = 365;
	container.y = 652;
	container.regY = 542;
	container.scaleY = 0;
	container.setBounds(0, 0, 542, 521);
	var b = container.getBounds();

	container.addEventListener("click", function(event) { 
	});

	this.setPage(container, this.pageNumber);

	this.addChild(container);
};

p.setPage = function (container, pageNumber) {
	container.removeAllChildren();

	var b = container.getBounds();	
	var rect = new createjs.Shape();
	rect.graphics.beginFill('Black').drawRect(0, 0, 542, 521);
	container.addChild(rect);

    var btnCloseHelp = new InitButton("btnCloseHelp", buttons.Decline, function() {

        createjs.Tween.get(container, { loop: false })
        .to({scaleY: 0}, 1000, createjs.Ease.getPowInOut(4)).call(function(){
    					var help = container.parent;
						help.removeAllChildren();
						delete help;
	        		});;

    });

	btnCloseHelp.x = 450;
	btnCloseHelp.y = 10;
	container.addChild(btnCloseHelp);

	switch(pageNumber) {
    case 1:
    		this.nextButton(container);

            credits = "Game developers: \n"
            + "Paulius Veliulis\n"
            + "Rytis Daskevicius\n"
            + "Tomas Liutvinas\n"
            + "\n"
            + "UI/Art/Effects:\n"
            + "Mergaite\n"
            + "Tomas Liutvinas\n"
            + "Rytis Daskevicius\n"
            + "Paulius Veliulis";

    		var creditsLable = new createjs.Text("CREDITS", "50px Almendra", "#FFFFFF");
			creditsLable.x = b.width/2 - 75; 
			creditsLable.y = b.height/2 -200;

			container.addChild(creditsLable);

    		var creditsText = new createjs.Text(credits, "20px Almendra", "#FFFFFF");
			creditsText.x = 40; 
			creditsText.y = b.height/2 -140;

			container.addChild(creditsText);

    		var tutorialLabel = new createjs.Text("TUTORIAL ----->>", "50px Almendra", "#FFFFFF");
			tutorialLabel.x =  b.width/2 - 95; 
			tutorialLabel.y = b.height/2 + 200;

			container.addChild(tutorialLabel);

        break;
    case 2:
    		this.nextButton(container);
    		this.prevButton(container);

			var bitmap = new createjs.Bitmap("assets/img/mainMenu.jpg");
			bitmap.x = b.width/2 - 150; 
			bitmap.y = b.height/2 - 125;
			container.addChild(bitmap);

    		var mainPanelLabel = new createjs.Text("Main panel", "50px Almendra", "#FFFFFF");
			mainPanelLabel.x = b.width/2 - 120; 
			mainPanelLabel.y = b.height/2 -200;

			container.addChild(mainPanelLabel);
        break;
    case 3:
    		this.nextButton(container);
    		this.prevButton(container);

	    	var bitmap = new createjs.Bitmap("assets/img/bOptions.jpg");
			bitmap.x = b.width/2 - 151; 
			bitmap.y = b.height/2 - 133;
			container.addChild(bitmap);

    		var mainPanelLabel = new createjs.Text("Building options", "50px Almendra", "#FFFFFF");
			mainPanelLabel.x = b.width/2 - 170; 
			mainPanelLabel.y = b.height/2 -200;

			container.addChild(mainPanelLabel);
        break;
    case 4:
    		this.prevButton(container);

	    	var bitmap = new createjs.Bitmap("assets/img/bSelection.jpg");
			bitmap.x = b.width/2 - 150; 
			bitmap.y = b.height/2 - 150;
			container.addChild(bitmap);

    		var mainPanelLabel = new createjs.Text("Building selection", "50px Almendra", "#FFFFFF");
			mainPanelLabel.x = b.width/2 - 180; 
			mainPanelLabel.y = b.height/2 -200;

			container.addChild(mainPanelLabel);
        break;
	}
}

p.nextButton = function (container) {
	var b = container.getBounds();	

    var btnNextPage = new InitButton("btnNextPage", buttons.Accept, function() {
    	this.parent.parent.pageNumber++;

    	this.parent.parent.setPage(container, this.parent.parent.pageNumber)
    });

	btnNextPage.x = 450;
	btnNextPage.y = b.height/2;

	container.addChild(btnNextPage);
}

p.prevButton = function (container) {
	var b = container.getBounds();	

    var btnPrevPage = new InitButton("btnPrevPage", buttons.Decline, function() {
    	this.parent.parent.pageNumber--;

    	this.parent.parent.setPage(container, this.parent.parent.pageNumber)
    });

	btnPrevPage.x = 10; 
	btnPrevPage.y = b.height/2;

	container.addChild(btnPrevPage);
}

window.HelpWindow = createjs.promote(HelpWindow, "Container");
}());