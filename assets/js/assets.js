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
        // if(!renderer){
        //     proton = null;
        //     emitter = null;
        //     renderer = null;
        //     delete proton;
        //     delete emitter;
        //     delete renderer;
        //     proton = new Proton;
        //     emitter = new Proton.Emitter();
        //     emitter.damping = 0.0075;
        //     emitter.rate = new Proton.Rate(15);
        //     emitter.addInitialize(new Proton.ImageTarget(textures));
        //     emitter.addInitialize(new Proton.Position(new Proton.RectZone(0, 0, 1280, 720)));
        //     emitter.addInitialize(new Proton.Mass(1), new Proton.Radius(Proton.getSpan(5, 10)));
        //     var repulsionBehaviour = new Proton.Repulsion({x : canvas.width / 2,y : canvas.height / 2}, 0, 0);
        //     var crossZoneBehaviour = new Proton.CrossZone(new Proton.RectZone(-2, 0, 1280, 720), 'cross');
        //     emitter.addBehaviour(repulsionBehaviour, crossZoneBehaviour);
        //     emitter.addBehaviour(new Proton.Scale(Proton.getSpan(.1, .6)));
        //     emitter.addBehaviour(new Proton.Alpha(.5));
        //     emitter.addBehaviour(new Proton.RandomDrift(10, 10, .2));
        //     emitter.addBehaviour({
        //         initialize : function(particle) {
        //             particle.tha = Math.random() * Math.PI;
        //             particle.thaSpeed = 0.015 * Math.random() + 0.005;
        //         },

        //         applyBehaviour : function(particle) {
        //             particle.tha += particle.thaSpeed;
        //             particle.alpha = Math.abs(Math.cos(particle.tha));
        //         }
        //     });
        //     emitter.emit('once');
        //     proton.addEmitter(emitter);

        //     renderer = new Proton.Renderer('easel', proton, stage);
        //     renderer.start();
        // }

         if(!renderer){
            proton = null;
            emitterFire = null;
            emitterRain = null;
            emitterRain1 = null;
            emitterRain2 = null;
            renderer = null;
            delete proton;
            delete emitter;
            delete renderer;
            proton = new Proton;

            emitterFire = new Proton.Emitter();
            emitterFire.rate = new Proton.Rate(new Proton.Span(1, 3), new Proton.Span(.05, .2));
            emitterFire.addInitialize(new Proton.ImageTarget(fireParticles));
            emitterFire.addInitialize(new Proton.Mass(1));
            emitterFire.addInitialize(new Proton.Life(12, 16));
            emitterFire.addInitialize(new Proton.V(new Proton.Span(0.5, 2.4), new Proton.Span(-260, 0), 'polar'));
            emitterFire.addBehaviour(new Proton.Alpha(1, [0, .4]));
            emitterFire.addBehaviour(new Proton.Scale(0.4, 0.1));
            emitterFire.addBehaviour(new Proton.Rotate(0.7, 1));
            emitterFire.p.x = canvas.width + 50 ;
            emitterFire.p.y = canvas.height + 50;
            emitterFire.emit();
            proton.addEmitter(emitterFire);

            emitterRain = new Proton.Emitter();
            emitterRain.rate = new Proton.Rate(new Proton.Span(1, 3), new Proton.Span(.2, .2));
            emitterRain.addInitialize(new Proton.ImageTarget(rainParticles));
            emitterRain.addInitialize(new Proton.Mass(1));
            emitterRain.addInitialize(new Proton.Life(5, 7));
            emitterRain.addInitialize(new Proton.V(new Proton.Span(1.5, 2), new Proton.Span(170, 190), 'polar'));
            emitterRain.addBehaviour(new Proton.Alpha(0.2, [1, .8]));
            emitterRain.addBehaviour(new Proton.Scale([0.2, 0.5], 0.2));
            emitterRain.p.x = 80;
            emitterRain.p.y = -100;
            emitterRain.emit();
            proton.addEmitter(emitterRain);

            emitterRain1 = new Proton.Emitter();
            emitterRain1.rate = new Proton.Rate(new Proton.Span(1, 3), new Proton.Span(.2, .2));
            emitterRain1.addInitialize(new Proton.ImageTarget(rainParticles));
            emitterRain1.addInitialize(new Proton.Mass(1));
            emitterRain1.addInitialize(new Proton.Life(5, 7));
            emitterRain1.addInitialize(new Proton.V(new Proton.Span(1.5, 2), new Proton.Span(170, 190), 'polar'));
            emitterRain1.addBehaviour(new Proton.Alpha(0.2, [1, .8]));
            emitterRain1.addBehaviour(new Proton.Scale([0.2, 0.5], 0.2));
            emitterRain1.p.x = 200;
            emitterRain1.p.y = -100;
            emitterRain1.emit();
            proton.addEmitter(emitterRain1);

            emitterRain2 = new Proton.Emitter();
            emitterRain2.rate = new Proton.Rate(new Proton.Span(1, 3), new Proton.Span(.2, .2));
            emitterRain2.addInitialize(new Proton.ImageTarget(rainParticles));
            emitterRain2.addInitialize(new Proton.Mass(1));
            emitterRain2.addInitialize(new Proton.Life(5, 7));
            emitterRain2.addInitialize(new Proton.V(new Proton.Span(1.5, 2), new Proton.Span(170, 190), 'polar'));
            emitterRain2.addBehaviour(new Proton.Alpha(0.2, [1, .8]));
            emitterRain2.addBehaviour(new Proton.Scale([0.2, 0.5], 0.2));
            emitterRain2.p.x = 420;
            emitterRain2.p.y = -100;
            emitterRain2.emit();
            proton.addEmitter(emitterRain2);

            renderer = new Proton.Renderer('easel', proton, stage);
            renderer.start();
        }
    }

    o.destroyParticles = function() {
    	proton.destory();
        emitterFire.destory();
        emitterRain.destory();
        emitterRain1.destory();
        emitterRain2.destory();
    	proton = null;
        emitterFire = null;
        emitterRain = null;
        emitterRain1 = null;
        emitterRain2 = null;
        renderer = null;
        delete proton;
        delete emitter;
        delete renderer;
    }

    o.showMenuBackground = function() {
        if(!stage.getChildByName('backgroundImage')){
            var bg = new createjs.Bitmap(loginBackGround);
            bg.name = 'backgroundImage';
            stage.addChild(bg);    
        }
    }

    o.hideMenuBackground = function() {
    	stage.removeChild(stage.getChildByName('backgroundImage'))
    }

    o.sendMSG = function( name, data){
        if(socket && socket.connected){
            socket.emit(name, data);            
        }
    }

    o.sendEndGameCheck = function(){
        if(socket && socket.connected){
            socket.emit('check_game_status', '');            
        }
    }

    o.socketLogOut = function(){
        socket.disconnect();
        socket.connect(GameServerAdress);
    }
    
    o.sendMainChat = function(msg){
        if(socket && socket.connected){
            socket.emit('mainChat', {message: msg});            
        }
    }

    o.sendIngameChat = function(msg){
        if(socket && socket.connected){
            socket.emit('ingameChat', {message: msg});            
        }
    }

    o.gibKongo = function(pswd, user){
        if(socket && socket.connected){
            socket.emit('gibKongo', {psw: pswd, user: user});            
        }
    }

    o.sendData = function(){
        if(socket && socket.connected){
            socket.emit('message', instanceData);            
        }
    }

    o.buildMap = function(){
        var map = new createjs.Container();
        map.name = 'map';

        var top = new createjs.Container();
        var units = new createjs.Container();
        var bottom = new createjs.Container();
        units.name = 'units';
        top.name = 'top';
        bottom.name = 'bottom';

        map.addChild(bottom, units, top);
        // loading each layer at a time
        for (var idx = 0; idx < mapData.layers.length; idx++) {
            var layerData = mapData.layers[idx];
            if (layerData.type == 'tilelayer'){
                if(layerData.name == 'ground' || layerData.name == 'base1' || layerData.name == 'base2' || layerData.name == 'treesBot'){
                    assets.initLayer(bottom, layerData, mapData.tilewidth, mapData.tileheight);    
                }else{
                    assets.initLayer(top, layerData, mapData.tilewidth, mapData.tileheight);    
                }
            }
        }

        // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
        map.on("pressmove", function (evt) {
            if(lastX != 0 || lastY !=0){
                this.x -= lastX - evt.stageX;
                this.y -= lastY - evt.stageY;

                if(this.x <= -255){
                    this.x = -255;
                } 
                if(this.x >= 1400){
                    this.x = 1400;
                }

                if(this.y >= -935){
                    this.y = -935;
                }
                if(this.y <= -1390){
                    this.y = -1390;  
                }            
            }

            lastX = evt.stageX;
            lastY = evt.stageY;
        });

        map.on("pressup", function (evt) {
            lastX = 0;
            lastY = 0;
        });

        top.on("click", function(){
            userCurrentSelection = null;
        }); 
        bottom.on("click", function(){
            userCurrentSelection = null;
        }); 

        return map;
    } 

    o.initLayer = function (map, layerData, tilewidth, tileheight) {
        for ( var y = 0; y < layerData.height; y++) {
            for ( var x = 0; x < layerData.width; x++) {
                // layer data has single dimension array
                var idx = x + y * layerData.width;
                if(layerData.data[idx] != 0){
                    // create a new Bitmap for each cell
                    // var cellBitmap = new createjs.Sprite(tilesetSheet);
                    var cellBitmap = tileset.clone();
                    // tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
                    cellBitmap.gotoAndStop(layerData.data[idx] - 1);
                    // isometrix tile positioning based on X Y order from Tiled
                    cellBitmap.x = x * tilewidth/2 - y * tilewidth/2;
                    cellBitmap.y = y * tileheight/2 + x * tileheight/2;

                    if(layerData.name == 'base1'){ cellBitmap.base1 = true;}
                    if(layerData.name == 'base2'){ cellBitmap.base2 = true;}
                    
                    map.addChild(cellBitmap);
                }
            }
        }
    }

    o.tileRemoveAllEventListeners = function (map){
        $.each(map.children, function( index, value ) {
            value.removeAllEventListeners();
        });
    }

    o.createBuilding = function(race, frame){
        var sprite;
        switch(race){
            case 'Plebs':
                 sprite =  tilesetPlebs.clone()
                break;
            case 'BlaBlas':
                sprite = tilesetBlaBlas.clone();
                break;
        }   

        sprite.gotoAndStop(frame);
        return sprite;
    }

    o.getBuilding = function(name){
        var map = gameInstanceScreen.getChildByName('map');
        return map.getChildByName(value.name);
    }

    o.getMapMatrix = function(includeOpponent){
        //reikalinga!!!!
        // var matrix = [];
        // for ( var y = 0; y < mapData.height; y++) {
        //     var row = [];
        //     for ( var x = 0; x < mapData.width; x++) {
        //         row.push(0);
        //     }
        //     matrix.push(row);
        // }

        // for (var idx = 0; idx < mapData.layers.length; idx++) {
        //     var layerData = mapData.layers[idx];
        //     if (layerData.name == 'treesBot' || layerData.name == 'treesTop' ){
        //         for ( var y = layerData.height - 1; y >= 0; y--) {
        //             for ( var x = layerData.width - 1; x >= 0; x--) {
        //                 var tx = x + y * layerData.width;

        //                 if(matrix[y][x] != 1){
        //                     matrix[y][x] = (layerData.data[tx] != 0 ? 1 : 0); 
        //                 }
        //             }
        //         }
        //     }
        // }

        // return matrix;

        //code above used to generate mapMatrix

        var mapMatrix = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0],[0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0],[0,0,0,0,0,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,0,0,0,0,0],[0,0,1,1,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,0,0,0,0,0,0],[0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],[0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

        for (var i = 0, len = instanceData.buildings.length; i < len; i++) {
            var pos = assets.screenToMap(instanceData.buildings[i].x, instanceData.buildings[i].y);
            mapMatrix[pos[1]][pos[0]] = 1;
        }

        if(includeOpponent){
            for (var i = 0, len = opponentData.buildings.length; i < len; i++) {
                var pos = assets.screenToMap(opponentData.buildings[i].x, opponentData.buildings[i].y);
                mapMatrix[pos[1]][pos[0]] = 1;
            }
        }

        return mapMatrix;
    }

    o.mapToScreen = function(x, y ){
        return [x * mapData.tilewidth/2 - y * mapData.tilewidth/2, y * mapData.tileheight/2 + x * mapData.tileheight/2];
    }

    o.screenToMap = function(x, y ){
        //todo: custom x,y
        mapx = (x / mapData.tilewidth + y / mapData.tileheight);
        mapy = (y / mapData.tileheight -(x / mapData.tilewidth));
        return([mapx, mapy])
    }

    o.getFreeTilePOS =  function(tX, tY, host, ours){
        var matrix = assets.getMapMatrix(true);
        //todo: review possitions...
        if(host){
            if(ours){
                if(matrix[tY][tX + 1] == 0) return [tX + 1, tY];
                if(matrix[tY -1][tX] == 0) return [tX, tY - 1];
                if(matrix[tY + 1][tX] == 0) return [tX, tY + 1];
                if(matrix[tY][tX - 1] == 0) return [tX - 1, tY];    
            }else{
                if(matrix[tY + 1][tX] == 0) return [tX, tY + 1];
                if(matrix[tY][tX - 1] == 0) return [tX - 1, tY];
                if(matrix[tY][tX + 1] == 0) return [tX + 1, tY];
                if(matrix[tY -1 ][tX] == 0) return [tX, tY - 1];    
            }
        }else{
            if(ours){
                if(matrix[tY + 1][tX] == 0) return [tX, tY + 1];
                if(matrix[tY][tX - 1] == 0) return [tX - 1, tY];
                if(matrix[tY][tX + 1] == 0) return [tX + 1, tY];
                if(matrix[tY -1 ][tX] == 0) return [tX, tY - 1];   
            }else{
                if(matrix[tY][tX + 1] == 0) return [tX + 1, tY];
                if(matrix[tY -1][tX] == 0) return [tX, tY - 1];
                if(matrix[tY + 1][tX] == 0) return [tX, tY + 1];
                if(matrix[tY][tX - 1] == 0) return [tX - 1, tY];   
            }
        }
        
        return null;
    }

    o.orderCanvas = function(){
        var sort = function(array) {
            var len = array.length;

            if(len < 2) { 
                return array;
            }

            var pivot = Math.ceil(len/2);

            return merge(sort(array.slice(0,pivot)), sort(array.slice(pivot)));
        };

        var merge = function(left, right) {
            var result = [];
            while((left.length > 0) && (right.length > 0)) {
                if(left[0].y < right[0].y) {
                result.push(left.shift());
                }else {
                    result.push(right.shift());
                }
            }

            result = result.concat(left, right);
            return result;
        };
// gameInstanceScreen.getChildByName('map');
    var layer = gameInstanceScreen.getChildByName('map').getChildByName('units').children;
    gameInstanceScreen.getChildByName('map').getChildByName('units').children = sort(layer);
        //var largeList = sort(array);


        //gameInstanceScreen.getChildByName('map').getChildByName('units').children.sort(function(a, b){return a.y > b.y});
    }

    o.getDistance = function(x1, y1, x2, y2)
    {
        var xs = 0;
        var ys = 0;

        xs = x2 - x1;
        xs = xs * xs;

        ys = y2 - y1;
        ys = ys * ys;

        return Math.sqrt( xs + ys );
    }

    o.getPath = function(tx, ty, ours){
        var path = [];
        var grid;
        if(ours){
            grid = new PF.Grid(assets.getMapMatrix());
        }else{
            grid = new PF.Grid(assets.getMapMatrix());
        }

        if(gameInstanceScreen.connectionData.host){
            if(ours){
                path = finder.findPath(Math.ceil(tx), Math.ceil(ty), 32, 13, grid);
            }else{
                path = finder.findPath(Math.ceil(tx), Math.ceil(ty), 13, 32, grid);
            }
        }else{
            if(ours){
                path = finder.findPath(Math.ceil(tx), Math.ceil(ty), 13, 32, grid);  
            }else{
                path = finder.findPath(Math.ceil(tx), Math.ceil(ty), 32, 13, grid);      
            }
        }
        return path;
    }

    o.gameEnded = function(data){
        if (gameInstanceScreen) {
            var shape = new createjs.Shape();
            shape.graphics.beginFill('black');
            shape.graphics.drawRect(0, 0, 1280, 720);
            shape.graphics.endFill();
            shape.alpha = 0.5;

            var text = new createjs.Text(data.msg, "50px Almendra", "#ff7700");
            text.x = (1280/2) - (text.getMeasuredWidth()/2) ;
            text.y = 720/2 - 50;

            var cont =  new InitButton('Continue', buttons.Continue, function(){
                hideGameInstance();
                showMenu();    
            });

            cont.x =  (1280/2) - 150;
            cont.y = 720/2 + 50;

            gameInstanceScreen.addChild(shape, text, cont);

        }else{
            hideGameInstance();
            showMenu();    
        }
    }

    o.createPrivateGame = function(friendName){
        if(menuScreen){
            if(!menuScreen.gamePending){
                menuScreen.initPrivateGame();
                assets.sendMSG('find_game', {gameType: 'private', race: raceSelected, friend: friendName});      
            }
            else{
                alert('Game already pending.');
            }
        }
    }

    // o.cancelPrivateGame = function(){
    //     assets.sendMSG('calcel_private_game', '');      
    // }
}
)();