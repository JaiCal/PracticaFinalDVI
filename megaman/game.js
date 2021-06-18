

var game = function() {

	var Q = window.Q = Quintus()
		.include(["Sprites", "Scenes", "Input", "2D", "UI", "Anim", "TMX", "Touch", "Audio"])
		.include(["Enemies", "Sensores", "Megaman", "Bosses"])
		.setup("myGame",{
				width: 256,
				height: 200,
				scaleToFit: true
		})
		.controls(true)
		.touch()
		.enableSound();


	SPRITE_PLAYER = 1;
	SPRITE_ENEMY = 2;

	Q.SPRITE_PLAYER = 2;
	Q.SPRITE_ENEMY = 4;
	Q.SPRITE_BOLA = 8;
	Q.SPRITE_SENSOR = 16;
	Q.SPRITE_PROYECTILE = 32;
	Q.SPRITE_BOSS = 64;
	Q.SPRITE_DECORACION = 128;

	Q.Sprite.extend("Proyectile", {

		init: function(p) {
			this._super(p, {
				// asset
				// damage
				// dir
				frame: 0,
				gravity: 0,
				type: Q.SPRITE_PROYECTILE,
				collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_DEFAULT | Q.SPRITE_BOSS | Q.SPRITE_PROYECTILE,
				taken: false,
				muerto: false,
				damage: 1
			});
			this.p.posAnt = 0;
			this.p.posIni = this.p.x;
			this.add("2d");
			this.on("bump.top,bump.bottom,bump.left,bump.right",this,"hit");

		},
		hit: function (collision) {
			if(this.p.muerto) return;
			if(collision.obj.isA("Proyectile")){
				collision.obj.die();
				this.p.muerto = true;
				this.destroy();
			} else if (collision.obj.p.type == Q.SPRITE_PLAYER && this.p.tipo == SPRITE_PLAYER) {
				// Nada
			} else if (collision.obj.p.type == Q.SPRITE_PLAYER || collision.obj.p.type == Q.SPRITE_ENEMY || collision.obj.p.type == Q.SPRITE_BOSS){
				if (this.p.tipo == SPRITE_ENEMY && !collision.obj.isA("Megaman")) {
					this.destroy();
					return;
				}
				if (collision.obj.p.type == Q.SPRITE_PLAYER) {
					if (!collision.obj.p.inmune) {
						collision.obj.golpeado(this.p.damage);
						this.destroy();
					}
				} else {
					collision.obj.golpeado(this.p.damage);
					this.destroy();
				}
			} else {
				this.destroy();
			}
		},

		die: function(){
			
			this.destroy();
			
		},

		step: function(dt){
	
			if (Math.abs(this.p.posIni - this.p.x) > 150) { this.destroy(); }
			else {
				this.p.posAnt = this.p.x;
			}
			
		}

	});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	Q.load(["megaman.png",             	"megaman.json", 
			"metall.png",             			"metall.json",
			"blader.png",             "blader.json",
			"bigEye.png",            "bigEye.json",            "button.png",
	"door.png",             "door.json",            "b_level2.png",
	"vida.png",             "vida.json",            "b_level1.png",
	"muerte.png",            "muerte.json",
	"proyectileP.png",      "proyectileM.png",        "metallMissile.png",
	"mapa.tmx",             "mapa.png",               
	"background.png",       "camara.png",             "tiles_megaman.png", 
	"title_credits_1.png", "title_credits_2.png", "title_screen_1.png", "title_screen_2.png",
	"jump_megaman.mp3", "proyectile_megaman_1.mp3", "proyectile_megaman_2.mp3", "proyectile_fireman_1.mp3", "proyectile_fireman_2.mp3",
	"main_fireman.mp3", "main_stage.mp3", "intro.mp3", "game_over.mp3", "die_enemy.mp3", "metall.mp3", "big_eye_jump.mp3",
	"hurt_enemy.mp3", "credits.mp3", "main.png", "game_over_1.png", "game_over_2.png", "boss.tmx", "fireman.png", "fireman.json", 
	"fireman_fire.png", "fireman_fire.json", "fireman_fire_floor.json",
	"bomb.png","bombMan.png", "BombMan.json","explosion.png", "Explosion.json",
	"bomb_man_stage.png", "bomb_man_stage.tmx", "tiles_fireman.png", "vida_bomb_man.png", "vida_bomb_man.json",
	"picketMan.png", "picketMan.json" ,"picos.png", "picos.json",
	"footholderproyectile.png","mapa2.tmx","tiles_map2.png","footholder.png","footholder.json",
	"foot_holder.mp3", "bomb.mp3", "explosion.mp3", "pico.mp3", "throw_bomb.mp3", "vida.mp3", "victory.mp3",
	"boss_bomb.mp3", "second_stage.mp3", "lift.png","megamanLifeItem.png", "sniper_joe.png", "sniper_joe.json", 
	"octopus.png", "octopus.json", "blaster.png", "blaster.json", "sniperjoeshot.png", "blasterMissile.png",
	"jump_sniper.mp3", "shoot_blaster.mp3", "shoot_sniper.mp3"

	], function () {
		//////////////COMPILACONES/////////////
        Q.compileSheets("picketMan.png", "picketMan.json");
        Q.compileSheets("picos.png", "picos.json");
        Q.compileSheets("footholder.png", "footholder.json");

		Q.compileSheets("muerte.png", "muerte.json");
		Q.compileSheets("vida.png","vida.json");
		Q.compileSheets("vida_bomb_man.png","vida_bomb_man.json");
		Q.compileSheets("megaman.png","megaman.json");
		Q.compileSheets("door.png","door.json");
		/////////////////////////////////////////////
		Q.compileSheets("metall.png","metall.json");
		Q.compileSheets("bigEye.png","bigEye.json");
		//////////////////////////////////
		Q.compileSheets("blader.png", "blader.json");
		//////////////////////////////////
		Q.compileSheets("fireman.png", "fireman.json");
	  	Q.compileSheets("fireman_fire.png", "fireman_fire.json");
	  	Q.compileSheets("fireman_fire.png", "fireman_fire_floor.json");
		//////////////////////////////////
		Q.compileSheets("bombMan.png", "BombMan.json");
		Q.compileSheets("explosion.png", "Explosion.json");

		Q.compileSheets("sniper_joe.png", "sniper_joe.json");
        Q.compileSheets("octopus.png", "octopus.json");
        Q.compileSheets("blaster.png", "blaster.json");
		///////////ANIMACIONES///////////////////////

		Q.animations("sniper_joe_anim",{
            mov_shoot: {frames: [1,2], loop: false, rate:2.5, trigger: "shootB"},
            mov_jump: {frames: [3], loop: false, rate: 1, trigger: "jump"},
            mov_idle: {frames: [0], loop: false, rate: 1}
        });
		
		Q.animations("blaster_anim",{
			animopen: {frames: [0, 1, 2, 3], loop: false, rate: 1, trigger:"shoot"},
			animclose: {frames: [3, 2, 1, 0], loop: false, rate: 1, trigger:"wakeup"}
		});
		
		Q.animations("octopus_anim",{
			awake: {frames: [0, 1, 2], loop:false, rate:2, trigger:"move"},
			asleep: {frames: [2, 1, 0], loop:false, rate: 2, trigger:"wakeup"}
		});

		Q.animations("pickman_anim",{
		pickman_mov: {frames: [1,2],loop:false, rate: 1,trigger: "throwP"},
		pickman_def:{frames: [0,0,0],loop:false, rate: 2,trigger: "continue"}

		});

		Q.animations("pico_anim",{
			pico_mov: {frames: [0,1,2,3],loop:true, rate: 1/4}
		});

		Q.animations("footholder_anim",{
            footholder_mov: {frames: [0,1,2,3],loop:false, rate: 1/2,next: "footholder_mov2"},
            footholder_mov2: {frames: [0,1,2,3],loop:false, rate: 1/2,next: "footholder_mov3"},
            footholder_mov3: {frames: [0,1,2,3],loop:false, rate: 1/2, trigger: "shootPry"}
        });

		Q.animations("bombman_anim",{
            jump_mov: {frames: [1],loop:true, rate: 1},
            throwbomb_mov:{frames: [0,2,3],loop:false, rate: 1,trigger: "throwB"}
        });

        Q.animations("explosion_anim",{
            explode:{frames: [0,1,2,3],loop:false, rate: 1/3,trigger:"endExp"}
        });

		Q.animations("metall_anim",{
			metall_mov: {frames: [0,1],loop:false, rate: 5,trigger: "shoot"}
			
		});
		Q.animations("bigEye_anim",{
			bigEye_mov: {frames: [0,1],loop:false, rate: 1/3,trigger:"jump"},
			bigEye_shift:{frames: [0,1,0],loop:false, rate: 1/3,trigger:"target"}			
		});

		Q.animations("blader_anim",{
            blader_blue: {frames: [0,1], loop:true, rate: 1/6},
            blader_green: {frames: [2,3], loop:true, rate: 1/6}
        });

		Q.animations("muerte_anim", {
			muerte: {frames: [0,1,2,3], loop: true, rate: 1/8}
		});

		Q.animations("megaman_anim",{
			////////////////////////////////////////////////
			walk_right: { 	frames: [24,23,22], rate: 1/6, next: "stand_right" },
			walk_left: {	frames: [1,2,3], rate: 1/6, next: "stand_left" },
			jump_right: { 	frames: [21], 	rate: 1/10, next: "stand_right" },
			jump_left: {	frames: [4], rate: 1/10, next: "stand_left" },
			stand_right: { frames: [25], rate: 1 },
			stand_left: {	frames: [0], rate: 1 },
			escalar: {		frames: [14,11], rate: 1/2, next: "climb_right" },
			climb_left: { frames: [14], rate: 1/2 },
			climb_right: { frames: [11], rate: 1/2 },
			////////////////////////////////////////////////
			walk_shoot_right: { frames: [17,16,15], rate: 1/6, loop: false },
			walk_shoot_left: {	frames: [8,9,10], rate: 1/6, loop: false },
			jump_shoot_right: { frames: [20], 	rate: 1/10, loop: false },
			jump_shoot_left: {	frames: [5], rate: 1/10, loop: false },
			shoot_stand_right: { frames: [18], rate: 1/10, loop: false },
			shoot_stand_left: {	frames: [7], rate: 1/10, loop: false },
			shoot_climb_right: { frames: [19], rate: 1, loop: false },
			shoot_climb_left: { frames: [6], rate: 1, loop: false}
		});

		Q.animations("door_anim", {
			closed: { frames: [0], rate: 1/10 },
			opening: { frames: [1,2,3], loop: false , rate: 9/10, trigger: "kill" },
			closing: { frames: [3,2,1], loop: false, rate: 9/10},
			opened: { frames: [4], rate: 1/10 }
		});

		Q.animations("fireman_anim",{
			walk_right: {frames: [4,5,6], rate: 1/6, next: "parado_r"},
			walk_left: {frames: [7,8,9], rate: 1/6, next: "parado_l"},
			shoot_right: {frames: [12,13], rate: 1/6, loop:false, trigger: "launchFire_event"},
			shoot_left: {frames: [0,1], rate: 1/6, loop:false, trigger: "launchFire_event"},
			parado_r: {frames: [10,11], loop:true, rate:1 },
			parado_l: {frames: [2,3], loop:true, rate:1},
		});

		Q.animations("fireman_fire_anim",{
			fire_left: {frames: [0,1,2], loop:true, rate:1/6},
			fire_right: {frames: [3,4,5], loop:true, rate:1/6}
		});

		Q.animations("fireman_fire_floor_anim",{
			fire_floor: {frames: [0,1], loop:true, rate:1/6},
		});

		Q.scene("level1", function(stage) {
			Q.stageTMX("mapa.tmx", stage);

			megaman = new Q.Megaman({x: 128,y: 1000});
			stage.insert(megaman);

			stage.add("viewport").follow(megaman,{x:true, y:false});
			stage.viewport.scale = 1;
			stage.viewport.offsetX = -50;
			stage.viewport.y = 1040;

			stage.on("destroy",function() {
				megaman.destroy();
			});

			Q.state.reset({"lives":8,"score":0});

			//Iniciamos la música
			Q.audio.stop();
		    Q.audio.play("main_stage.mp3", {loop:true});	

		});

		Q.scene("level2", function(stage) {
			Q.stageTMX("mapa2.tmx", stage);

			megaman = new Q.Megaman({x: 45, y: 304});
			stage.insert(megaman);

			stage.add("viewport").follow(megaman,{x:true, y:true});

			stage.on("destroy",function() {
				megaman.destroy();
			});

			Q.state.reset({"lives":8,"score":0});

			//Iniciamos la música
			Q.audio.stop();
		    Q.audio.play("second_stage.mp3", {loop:true});	

		});

		Q.scene("boss_bomb_man", function(stage) {
            Q.stageTMX("bomb_man_stage.tmx", stage);

            megaman = new Q.Megaman({x: 48, y: 144});
            stage.insert(megaman);

            //Iniciamos variables globales
            Q.state.reset({"lives": 8, "boss": 8});

            stage.on("destroy",function() {
                megaman.destroy();
            });
            
            stage.add("viewport").follow(megaman,{x:false, y:false});
            stage.viewport.scale = 1;
            stage.viewport.x = 16;
            stage.viewport.y = 16;

            //Iniciamos la música
            Q.audio.stop();
            Q.audio.play("boss_bomb.mp3", {loop:true});

        });

		Q.scene("boss_fireman", function(stage) {
            Q.stageTMX("boss.tmx", stage);

            megaman = new Q.Megaman({x: 10, y: 100});
            stage.insert(megaman);
            stage.insert(new Q.Fireman());

            //Iniciamos variables globales
			Q.state.reset({"lives":8, "boss": 8});

            stage.on("destroy",function() {
                megaman.destroy();
            });

            stage.add("viewport").follow(megaman,{x:false, y:false});
            stage.viewport.scale = 1;
            stage.viewport.x = 16;
            stage.viewport.y = 16;

            //Iniciamos la música
            Q.audio.stop();
            Q.audio.play("main_fireman.mp3", {loop:true});

        });

		//Creamos una escena para que muestre las vidas
		Q.scene("hub_boss", function(stage) {

			boss_man_live1 = stage.insert( new Q.UI.Button({
				sheet: "vida_bomb_man",
				x: 10,
				y: 20,
				frame: 0
			}));
			boss_man_live2 = stage.insert( new Q.UI.Button({
				sheet: "vida_bomb_man",
				x: 18,
				y: 20,
				frame: 0
			}));
	
			stage.insert(boss_man_live1);
			stage.insert(boss_man_live2);

			Q.state.on("change.boss", this, function() {
				if (Q.state.get("boss") <= 4) {
					boss_man_live2.p.frame = 4;
					var rest = ((4 - Q.state.get("boss")) < 0) ? 0 : (4 - Q.state.get("boss"));
					boss_man_live1.p.frame = rest;
				} else {
					boss_man_live2.p.frame = 4 - ((Q.state.get("boss") + 1) % 5);
				}
				
			});

		});

		Q.scene("hub", function(stage) {
			megaman_live1 = stage.insert( new Q.UI.Button({
				sheet: "vida",
				x: 10,
				y: 10,
				frame: 0
			}));
			megaman_live2 = stage.insert( new Q.UI.Button({
				sheet: "vida",
				x: 18,
				y: 10,
				frame: 0
			}));

			stage.insert(megaman_live1);
			stage.insert(megaman_live2);
			Q.state.on("change.lives", this, function() {
				megaman_live2.p.frame = 4;
				var rest = ((4 - Q.state.get("lives")) < 0) ? 0 : (4 - Q.state.get("lives"));
				if (Q.state.get("lives") <= 4) {
					megaman_live1.p.frame = rest;
				} else {
					megaman_live2.p.frame = 4 - ((Q.state.get("lives") + 1) % 5);
				}
				
			});

			label_score = stage.insert( new Q.UI.Text({x: 125, y: 0,color: "#FFFFFF",size:12, label : "score: 0"}));
            stage.insert(label_score);
            Q.state.on("change.score", this, function(){
                label_score.p.label = "score: " + Q.state.get("score");
            });

		});

		//Creamos la escena principal
		Q.scene("main", function(stage){
			var button = new Q.UI.Button({
				x: Q.width/2,
				y: Q.height/2,
				w: Q.width, 
				h: Q.height,
				asset: "main.png"
			});
			Q.audio.stop();
			stage.insert(button);
			button.on("click", function(){
				Q.clearStages();
				Q.stageScene("mainTitle", 1);
			});
		});

		Q.scene("mainTitle", function(stage){
            var button = new Q.UI.Button({
                x: Q.width/2,
                y: 50,
                scale: 0.7,
                asset: "button.png"
            });

            var b_level1 = new Q.UI.Button({
                x: Q.width/2,
                y: 110,
                asset: "b_level1.png"
            });

            var b_level2 = new Q.UI.Button({
                x: Q.width/2,
                y: 145,
                asset: "b_level2.png"
            });
            //Iniciamos la música
            Q.audio.stop();
            Q.audio.play("intro.mp3");    
            stage.insert(button);
            stage.insert(b_level1);
            stage.insert(b_level2);

            b_level1.on("click", function(){
                Q.clearStages();
				/*
				Q.stageScene("level1", 1);	
				Q.stageScene("hub", 2);	  	*/
				Q.stageScene("level1", 1);	
				Q.stageScene("hub", 2); 
				 
            });

            b_level2.on("click", function(){
                Q.clearStages();
				Q.stageScene("level2", 1);	
				Q.stageScene("hub", 2);	       
            });
        });

		Q.scene("creditsTitle", function(stage){
			var button = new Q.UI.Button({
				x: Q.width/2,
				y: Q.height/2,
				w: Q.width, 
				h: Q.height,
				asset: "title_credits_1.png"
			});
			//Iniciamos la música
			Q.audio.stop();
		 	Q.audio.play("credits.mp3", {loop:true});	
			stage.insert(button);
			button.on("click", function(){
				Q.clearStages();
				Q.stageScene("mainTitle", 1);
			});
		});

		Q.scene("gameOver", function(stage){
            var button = new Q.UI.Button({
                x: Q.width/2,
                y: Q.height/2,
                w: Q.width, 
                h: Q.height,
                asset: "game_over_2.png"
            });
            //Iniciamos la música
            Q.audio.stop();
             Q.audio.play("game_over.mp3");    
            stage.insert(button);
            button.on("click", function(){
                Q.clearStages();
                Q.stageScene("mainTitle", 1);
            });
        });

		Q.scene('winGame',function(stage) {
            
            var container = stage.insert(new Q.UI.Container({
                x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
            }));

            var button2 = container.insert(new Q.UI.Button({
                x: 0, y: 0, fill: "#CCCCCC", label: "Play Again"
            }));

            var label = container.insert(new Q.UI.Text({
                x:10, y: -10 - button2.p.h, label: "You Win!"
            }));

            // When the button is clicked, clear all the stages
            // and restart the game.
            Q.audio.stop();
             Q.audio.play("victory.mp3");    
            button2.on("click",function() {
                Q.clearStages();
                Q.stageScene("creditsTitle", 1);
            });

            // Expand the container to visibly fit it's contents
            // (with a padding of 20 pixels)
            container.fit(20);
         });

		Q.clearStages();
		Q.stageScene("main", 1);

	});


}