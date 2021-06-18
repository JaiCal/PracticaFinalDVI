var enemies = function(Quintus) {

    Quintus["Enemies"] = function(Q) {

        Q.component("defaultEnemy", {
            extend: {
                hit: function (collision) {
                    if(this.p.dead) return;
                    if(!collision.obj.isA("Proyectile")) return;
                    
                    if (collision.obj.type == "Enemy") {collision.obj.die(); return;}
                    
                    this.golpeado(collision.obj.p.damage);
                    collision.obj.die();			
                }
            }
        });
    
        Q.Sprite.extend("BigEye", {
            
            init: function(p) {
                this._super(p,{
                    sheet: "bigEye",
                    sprite: "bigEye_anim",
                    frame: 0,
                    vida: 4,
                    dir: -1,
                    puntos: 4,
                    tipo: SPRITE_ENEMY,
                    type: Q.SPRITE_ENEMY,
                    collisionMask: Q.SPRITE_DEFAULT,
                    targeting:false,
                    mposX:undefined,
                    dead:false,
                    scale: 1
                });
                
                this.add("2d, animation, tween");
                this.on("bump.bottom",this,"kill");
                this.on("jump", this, "smashJump");
                this.on("target", this, "setTargeting");
                
            },
    
            golpeado: function(dmg) {
                this.p.vida = this.p.vida - dmg;
                if(this.p.vida <= 0) {
                    this.p.sensor = true;
                    this.p.dead = true;
                    this.animate({gravity:9.8, angle:180},
                            1,
                            Q.Easing.Quadratic.Out,
                            {callback: function(){
                                Q.audio.play("die_enemy.mp3");
                                Q.state.inc("score", this.p.puntos);
                                this.destroy();
                            }});
                }
            },
    
            kill: function(collision){
                if(!this.p.dead && collision.obj.isA("Megaman")){
                    if (!collision.obj.p.inmune) {
                        collision.obj.golpeado(1);
                    } 
                }
            },
            smashJump: function(){
                Q.audio.play("big_eye_jump.mp3");
                this.animate({vy:-100,vx:this.p.dir*60,gravity:0},
                            1,
                            Q.Easing.Quadratic.In,
                            {callback: function(){
                                this.animate({vy:0,vx:this.p.dir*100,gravity:0.8},
                                1,
                                Q.Easing.Quadratic.In,
                                {callback: function(){
                                    this.play("bigEye_shift");}});
                            }});
    
            },
            setTargeting: function(){
                this.p.targeting = false;
                this.p.vx = 0;
            }
            ,
            step: function (dt) {
                if(Q.state.get("lives") > 0) {
                    var megaman = Q("Megaman").first();
                    var dist = Math.abs(this.p.x -  megaman.p.x);
        
                    if(!this.p.targeting && dist <= 100){
                        this.p.targeting = true;
                        if(megaman.p.x > this.p.x){
                            this.p.flip = "x";
                            this.p.dir = 1;
                        }else{
                            this.p.flip = "";
                            this.p.dir = -1;
                        }
                        
                        this.play("bigEye_mov");
                    }
                }
            }
    
        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
        Q.Sprite.extend("Metall", {
            
            init: function(p) {
                this._super(p,{
                    sheet: "metall_hidden",
                    sprite: "metall_anim",
                    frame: 0,
                    dir: -1,
                    hp: 100,
                    tipo: SPRITE_ENEMY,
                    type: Q.SPRITE_ENEMY,
                    collisionMask: Q.SPRITE_DEFAULT,
                    puntos: 2,
                    stopAnim: false,
                    dead:false,
                    scale: 1
                });
                
                this.add("2d, animation, tween");
                this.on("shoot", this, "shootMissile");
            
            },
    
            golpeado: function(dmg) {
                if(this.p.frame == 1){
                    this.p.dead = true;
                    this.p.sensor = true;
                    this.animate({y: this.p.y -50, angle:360},
                                1,
                                Q.Easing.Quadratic.Out,
                                {callback: function(){
                                    Q.audio.play("die_enemy.mp3"); 
                                    Q.state.inc("score", this.p.puntos);
                                    this.destroy()}});
                }
            },
    
            shootMissile: function () {
                if (this.p.dead) return;
                var m = new Q.Proyectile({asset: "metallMissile.png", x:this.p.x+(this.p.dir*30), y:this.p.y,vx:(this.p.dir*30), tipo: SPRITE_ENEMY});
                Q.audio.play("metall.mp3");
                this.stage.insert(m);
                this.p.stopAnim = false;                
            },
            
            step: function (dt) {
                if (Q.state.get("lives") > 0) {
                    var megaman = Q("Megaman").first();
                    var dist = Math.abs(this.p.x -  megaman.p.x);
        
                    if(!this.p.stopAnim && dist <= 300 ){
                        this.p.stopAnim = true;
                        this.play("metall_mov");	
                    }
        
                    if(megaman.p.x > this.p.x){
                        this.p.flip = "x";
                        this.p.dir = 1;
                    }else{
                        this.p.flip = "";
                        this.p.dir = -1;
                    }
                } 
                
            }
    
        });
    
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
        Q.Sprite.extend("Blader", {
            
            init: function(p) {
                this._super(p,{
                    sheet: "blader",
                    sprite: "blader_anim",
                    frame: 0,
                    scale: 1,    //Velocidad, tanto horizontal como vertical. Va hacia la izquierda, por eso es negativa
                    speed: -1,
                    tipo: SPRITE_ENEMY,
                    type: Q.SPRITE_ENEMY,
                    collisionMask: Q.SPRITE_PROYECTILE,
                    puntos: 1,
                    gravity: 0,
                    dado: false
                  });
            
                this.add("2d, animation, tween");
                this.on("bump.bottom, bump.top, bump.left, bump.right",this,"hit");
            },
    
            hit: function(collision) {
                if(!this.p.dead && collision.obj.isA("Megaman")){
                    if (!collision.obj.p.inmune) {
                        collision.obj.golpeado(1);
                    } 
                }
            },

            golpeado: function(dmg) {
                this.p.dead = true;
                this.animate({y: this.p.y -50, angle:360},
                            1,
                            Q.Easing.Quadratic.Out,
                            {callback: function(){
                                Q.state.inc("score", this.p.puntos);
                                this.destroy()}});
            },
    
            step: function(dt) {
                if (Q.state.get("lives") > 0) {
                    var megaman = Q("Megaman").first();
                    this.play("blader_blue");
                    if(this.p.x < (megaman.p.x+200)) {        //Solo se mueve si megaman esta cerca
                        this.p.x += this.p.speed;
                        if (this.p.x < (megaman.p.x-500)) {
                            this.destroy();
                        }
                    } 
                    if((this.p.x < megaman.p.x+60) && (this.p.x >  megaman.p.x-10) && (this.p.y > megaman.p.y)) {                //Cuando este muy cerca y debajo de megaman, sube a atacar
                        this.p.y += this.p.speed;
                    }
                    
                    if((this.p.x < megaman.p.x+16) && (this.p.x > megaman.p.x-16) && (this.p.y < megaman.p.y+16) && (this.p.y > megaman.p.y-16)) {
                        if (!this.p.dado){
                            this.p.dado = true;
                            megaman.golpeado(1);
                        }
                        
                    }
                }
            }
        });

        ////////////////////////////////////////////////////////////////////////////

        Q.Sprite.extend("Pico", {
                
            init: function(p) {
                this._super(p,{
                    sheet: "picoIni",
                    sprite: "pico_anim",
                    muerto: false,
                    eliminable:false,
                    type: Q.SPRITE_PROYECTILE,
				    collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT,
                    gravity:0,
                    scale: 1
                });
                this.p.posAnt = 0;
                this.p.Ini = this.p.x;
                this.add("2d,animation,tween");
                this.on("bump.top,bump.bottom,bump.left,bump.right",this,"hit");
                this.play("pico_mov");
                this.movPico();
            },
            hit: function (collision) {
                if(this.p.muerto) return;
                if(collision.obj.isA("Megaman")){
                    if (!collision.obj.p.inmune) {
                        collision.obj.golpeado(1);
                        this.p.muerto = true;
                    }
                }
                
            },
            movPico: function(){
                this.animate({vy:-70,vx:this.p.dir*15,gravity:0},
                            1,
                            Q.Easing.Quadratic.Out,
                            {callback: function(){
                                this.animate({vy:30,vx:this.p.dir*30,gravity:0.8},
                                1,
                                Q.Easing.Quadratic.In,{
                                    callback:function(){
                                        this.p.eliminable = true;
                                    }
                                });
                            }});
            },
            step: function (dt) {
                
                var distancia = 0;

                if(this.p.dir==-1){//Desplazamiento hacia la izquierda
                    distancia = this.p.Ini - this.p.x;
                }else{//Desplazamiento hacia la derecha
                    distancia = this.p.x - this.p.Ini;
                }

                if(this.p.muerto || (this.p.eliminable && this.p.posAnt == this.p.x) || distancia > 100){
                    this.p.pickman.p.numPicos++;
                    this.destroy();
                }

                this.p.posAnt = this.p.x;
            }

        });

        Q.Sprite.extend("PicketMan", {
            
            init: function(p) {
                this._super(p,{
                    sheet: "defense",
                    sprite: "pickman_anim",
                    dir: -1,
                    hp: 4,
                    stopAnim: false,
                    tipo: SPRITE_ENEMY,
                    type: Q.SPRITE_ENEMY,
                    collisionMask: Q.SPRITE_DEFAULT,
                    continuar: true,
                    dead:false,
                    puntos: 7,
                    numPicos: 2,
                    scale: 1
                });
                
                this.add("2d, animation, tween, defaultEnemy");
                this.on("throwP", this, "throwPicket");
                this.on("continue", this, "continueAttack");
            
            },

            golpeado: function(dmg) {
                if(this.p.frame != 0){  
                    this.p.hp = this.p.hp-dmg;            
                    if(this.p.hp <= 0){
                        this.p.dead = true;
                        this.animate({angle:180},
                                1,
                                Q.Easing.Quadratic.Out,
                                {callback: function(){                                    
                                    Q.audio.play("die_enemy.mp3");                                   
                                    Q.state.inc("score", this.p.puntos);
                                    this.destroy()}});
                    }
                    
                }
            },

            continueAttack: function(){
                this.p.continuar = true;
            }
            ,
            throwPicket: function () {
                Q.audio.play("pico.mp3");
                var p = new Q.Pico({pickman: this,dir: this.p.dir,x:this.p.x+(this.p.dir*32),y:this.p.y});
                this.stage.insert(p);
                this.p.numPicos--;
                this.p.stopAnim = false;
                
            },
            
            step: function (dt) {

                if (Q.state.get("lives") > 0) {
                    var megaman = Q("Megaman").first();
                    var dist = Math.abs(this.p.x -  megaman.p.x);
                    
                    if (this.p.numPicos == 0){
                        this.p.continuar = false;
                        this.play("pickman_def");
                    }
                    if(!this.p.stopAnim && dist <= 150 && this.p.numPicos > 0 && this.p.continuar){
                        this.p.stopAnim = true;
                        this.play("pickman_mov");    
                    }

                    if(megaman.p.x > this.p.x){
                        this.p.flip = "x";
                        this.p.dir = 1;
                    }else{
                        this.p.flip = "";
                        this.p.dir = -1;
                    }
                }
                
            }

        });

        Q.Sprite.extend("FootHolder", {
        
            init: function(p) {
                this._super(p,{
                    sheet: "footholder",
                    sprite: "footholder_anim",
                    frame: 0,
                    dir: -1,
                    hp: 2,
                    stopAnim: false,
                    type: Q.SPRITE_ENEMY,
                    collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_ENEMY | Q.SPRITE_PLAYER,
                    gravity:0,
                    puntos: 3,
                    dead:false,
                    scale: 1
                });
                this.posAnt = 0;
                this.posFinY = this.p.y;
                this.add("2d, animation, tween");
                this.on("shootPry", this, "shootProyect");
            
            },
    
            golpeado: function(dmg) {
                this.p.hp = this.p.hp-dmg ;
                if(this.p.hp <= 0){
                    this.p.dead = true;
                    this.animate({gravity: 1, angle:180},
                                1,
                                Q.Easing.Quadratic.Out,
                                {callback: function(){                                    
                                    Q.audio.play("die_enemy.mp3");
                                    Q.state.inc("score", this.p.puntos)
                                    this.destroy()}});
                }
            },
    
            shootProyect: function () {
                var m = new Q.Proyectile({asset: "footholderproyectile.png", x:this.p.x+(this.p.dir*30), y:this.p.y,vx:(this.p.dir*30), type: Q.SPRITE_ENEMY});
                this.stage.insert(m);
                this.p.stopAnim = false;
                
            },
            
            step: function (dt) {

                if(!this.p.stopAnim){
                    this.p.stopAnim = true;
                    this.play("footholder_mov");
                }

                if(megaman.p.x > this.p.x){
                    this.p.flip = "x";
                    this.p.dir = 1;
                }else{
                    this.p.flip = "";
                    this.p.dir = -1;
                }

                if (this.p.y < this.posFinY-72) {
                    this.p.vy = 60;
                } else if (this.p.y > this.posFinY+48) {
                    this.p.vy = -60;
                }

                if(this.p.y == this.posAnt){

                    if(this.p.y -32> this.posFinY){
                         this.p.vy = -60;
                    }else{
                        this.p.vy = 60;
                    }
                }

                this.posAnt = this.p.y;
                
            }
    
        });

        Q.Sprite.extend("Sniper_joe", {
        
            init: function(p) {
                this._super(p,{
                    sheet: "sniper_joe",
                    sprite: "sniper_joe_anim",
                    frame: 0,
                    scale: 1,
                    dir: -1,
                    type: Q.SPRITE_ENEMY,                  
                    collisionMask: Q.SPRITE_DEFAULT,
                    shooting: false,
                    jumping: false,
                    puntos: 3,
                    dead: false
                  });
            
                this.add("2d, animation, tween");
                this.on("shootB", this, "shootFunc");
                this.on("jump", this, "jumpFunc");
            },
             
            golpeado: function(dmg){

                if(this.p.shooting) {
                    this.p.dead = true;
                    this.p.sensor = true;
                    this.animate({y: this.p.y -50, angle:360},
                            1,
                            Q.Easing.Quadratic.Out,
                            {callback: function(){                                
                                Q.state.inc("score", this.p.puntos);
                                this.destroy()}});
                }
                
            },
            
            shootFunc: function() {
                
                this.p.jumping = true;
                Q.audio.play("shoot_sniper.mp3");  
                bala = new Q.Proyectile({asset: "sniperjoeshot.png", x:this.p.x +(this.p.dir*24), y:this.p.y + 4, vx:this.p.dir*30, tipo: SPRITE_ENEMY});
                this.stage.insert(bala);
                Q.audio.play("jump_sniper.mp3"); 
                this.play("mov_jump");
                this.p.shooting = false;
                this.p.vy = -300;
            },
            
            jumpFunc: function() {
                
                this.p.jumping = false;
                this.play("mov_idle");
                
            },           
             
            step: function(dt){
                if (Q.state.get("lives") > 0) {
                    var megaman = Q("Megaman").first();
                    var dist = Math.abs(this.p.x -  megaman.p.x);
                    if (dist < 100 && !this.p.jumping && !this.p.shooting) {
                        this.p.shooting = true;
                        this.play("mov_shoot");
                    }

                    if(megaman.p.x > this.p.x){
                        this.p.flip = "x";
                        this.p.dir = 1;
                    }else{
                        this.p.flip = "";
                        this.p.dir = -1;
                    }

                }
            }
            
        });
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
        Q.Sprite.extend("Octopus", {
	    
            init: function(p) {
                this._super(p,{
                    sheet: "octopus",
                    sprite: "octopus_anim",
                    frame: 0,
                    scale:1,
                    gravity:0,
                    type: Q.SPRITE_ENEMY,
                    collisionMask: Q.SPRITE_PROYECTILE | Q.SPRITE_DEFAULT,
                    direction: "right",
                    puntos: 1,
                    dead: false
                  });
            
                this.add("2d, animation, tween");
                this.on("bump.top,bump.bottom,bump.left,bump.right",this,"hit");
                this.on("move", this, "moveFunc");
                this.on("wakeup", this, "wakeFunc");
                
                this.play("awake");
    
            },
            
            step: function(dt){
            },

            golpeado: function(dmg){

                if(this.p.shooting) {
                    this.p.dead = true;
                    this.p.sensor = true;
                    this.animate({y: this.p.y -50, angle:0},
                            1,
                            Q.Easing.Quadratic.Out,
                            {callback: function(){                                
                                Q.state.inc("score", this.p.puntos);
                                this.destroy()}});
                }
                
            },
            
            hit: function(collision){
                
                if(!(collision.obj.isA("Megaman")) && !(collision.obj.isA("Proyectile"))) {
                    this.play("asleep");
                    this.p.vx = 0;
                    if(this.p.direction == "right")
                        this.p.direction = "left";
                    else this.p.direction = "right";
                }
                
                else if(collision.obj.isA("Proyectile")) {
                    this.p.dead = true;
                    this.animate({y: this.p.y -50, angle:360},
                        1,
                        Q.Easing.Quadratic.Out,
                        {callback: function(){
                            Q.state.inc("score", this.p.puntos);
                            this.destroy()}});
                }

                else if(collision.obj.isA("Megaman")) { 
                    collision.obj.golpeado(1);
                }
            },
            
            moveFunc: function() {
                var speed;
                if(this.p.direction == "right") speed = 80;
                else speed = -80;
                this.p.vx = speed;
            },
            
            wakeFunc: function() {
                this.play("awake");
            }
            
        });
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////
    
        Q.Sprite.extend("Blaster", {
            
            init: function(p) {
                this._super(p,{
                    sheet: "blaster",
                    sprite: "blaster_anim",
                    frame: 0,
                    scale:1,
                    type: Q.SPRITE_ENEMY,
                    collisionMask: Q.SPRITE_PLAYER,
                    puntos: 2,
                    isopen: false
                  });
            
                  this.add("animation, tween");
                this.on("shoot", this, "shootFunc");
                this.on("wakeup", this, "wakeFunc");
                
                this.play("animopen");
    
            },
            
            step: function(dt){
            },
            
            golpeado: function(dmg){
                
                if(this.p.frame != 0) {
                    this.animate({y: this.p.y -50, angle:360},
                            1,
                            Q.Easing.Quadratic.Out,
                            {callback: function(){
                                Q.state.inc("score", this.p.puntos);
                                this.destroy()}});
                }
                
                
            },
            
            shootFunc: function() {
                var	xPoint;
                var yPoint;
                xPoint = this.p.x;
                yPoint = this.p.y;
                Q.audio.play("shoot_blaster.mp3");  
                bala = new Q.Proyectile({asset: "blasterMissile.png", x:this.p.x - 10, y:this.p.y, vx:-30, tipo: SPRITE_ENEMY});
                
                this.stage.insert(bala);
                         
                this.play("animclose");
                this.p.isopen = false;
            },
            
            wakeFunc: function() {
                this.play("animopen");
                this.p.isopen = true;
            }
            
        });

    }
}

if(typeof Quintus === 'undefined') {
    module.exports = enemies;
} else {
    enemies(Quintus);
}