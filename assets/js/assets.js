(function() {
	if (document.body) { setupEmbed(); }
	else { document.addEventListener("DOMContentLoaded", setupEmbed); }
	
	function setupEmbed() {
		if (window.top != window) {
			document.body.className += " embedded";
		}
	}
	
	var o = window.assets = {};
	o.showLoading = function(id) {
		var div = id ? document.getElementById(id) : document.querySelector("div canvas").parentNode;
		div.className += " loading";
	};
	
	o.hideLoading = function() {
		var div = document.querySelector(".loading");
		div.className = div.className.replace(/\bloading\b/);
	};

    o.showParticles = function() {
        proton = null;
        emitter = null;
        renderer = null;
        delete proton;
        delete emitter;
        delete renderer;
        proton = new Proton;
        emitter = new Proton.Emitter();
        emitter.damping = 0.0075;
        emitter.rate = new Proton.Rate(15);
        emitter.addInitialize(new Proton.ImageTarget(textures));
        emitter.addInitialize(new Proton.Position(new Proton.RectZone(0, 0, 1280, 720)));
        emitter.addInitialize(new Proton.Mass(1), new Proton.Radius(Proton.getSpan(5, 10)));
        var repulsionBehaviour = new Proton.Repulsion({x : canvas.width / 2,y : canvas.height / 2}, 0, 0);
        var crossZoneBehaviour = new Proton.CrossZone(new Proton.RectZone(-2, 0, 1280, 720), 'cross');
        emitter.addBehaviour(repulsionBehaviour, crossZoneBehaviour);
        emitter.addBehaviour(new Proton.Scale(Proton.getSpan(.1, .6)));
        emitter.addBehaviour(new Proton.Alpha(.5));
        emitter.addBehaviour(new Proton.RandomDrift(10, 10, .2));
        emitter.addBehaviour({
            initialize : function(particle) {
                particle.tha = Math.random() * Math.PI;
                particle.thaSpeed = 0.015 * Math.random() + 0.005;
            },

            applyBehaviour : function(particle) {
                particle.tha += particle.thaSpeed;
                particle.alpha = Math.abs(Math.cos(particle.tha));
            }
        });
        emitter.emit('once');
        proton.addEmitter(emitter);

        renderer = new Proton.Renderer('easel', proton, stage);
        renderer.start();
    }

    o.destroyParticles = function() {
    	proton.destory();
    	emitter.destory();
    	proton = null;
        emitter = null;
        renderer = null;
        delete proton;
        delete emitter;
        delete renderer;
    }

    o.showMenuBackground = function() {
    	var bg = new createjs.Bitmap(loginBackGround);
    	bg.name = 'backgroundImage';
    	stage.addChild(bg);
    }

    o.hideMenuBackground = function() {
    	stage.removeChild(stage.getChildByName('backgroundImage'))
    }

    o.sendMSG = function( name, data){
        if(socket && socket.connected){
            socket.emit(name, data);            
        }
    }

})();