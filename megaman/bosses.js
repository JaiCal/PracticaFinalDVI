var bosses = function(Quintus) {

    Quintus["Bosses"] = function(Q) {
        //--------------------------------------------------------------------//
        //-----------------------------FIREMAN--------------------------------//
        //--------------------------------------------------------------------//

        Q.Sprite.extend("Fireman", {
            init: function(p) {
                this._super(p,{
                    sheet: "fireman",
                    sprite: "fireman_anim",
                    x: 148,
                    y: 172,
                    frame: 0,
                    vida: 8,
                    type: Q.SPRITE_BOSS,
                    collisionMask: Q.SPRITE_DEFAULT,
                    vx: 50      //velocidad fireman
                });
            
                //Añadimos gravedad y controles básicos
                //Le añadimos vida propia para que se mueva de izq a der
                this.add("2d, aiBounce, animation");        
                this.add("tween");  //Importante para el comportamiento animate -> Añadimos mediante componentes

                //Llama a launchFire después de que se haya hecho la animación
                //launchFire_event es el trigger que se lanza de las animaciones
                this.on("launchFire_event", this, "launchFire");

                //Con esto manejamos el tiempo de recarga de Fireman
                this.time = 0;
                this.frequency = 2.5;

            },
            //Lanzamos y creamos el sprite de lanzar le fuego
            launchFire: function(){
                var megaman = Q("Megaman").first();
                if(megaman.p.x < this.p.x){ //Está a su izq
                    var fire_bullet = new Q.Fireman_Fire({x:this.p.x-24,y:177,vx:-50});
                    this.stage.insert(fire_bullet);
                    this.p.vx = -50;
                    Q.audio.play("proyectile_fireman_2.mp3");   
                }else if(megaman.p.x > this.p.x){   //Está a su der
                    var fire_bullet = new Q.Fireman_Fire({x:this.p.x+24,y:177,vx:50});
                    this.stage.insert(fire_bullet);
                    this.p.vx = 50;
                    Q.audio.play("proyectile_fireman_2.mp3");
                }    

            },
            step: function(dt){
                if(Q.state.get("lives") > 0) {
                    if(this.p.vx > 0){  //Si se mueve a la derecha
                        this.play("walk_right");
                    }else if(this.p.vx < 0){
                        this.play("walk_left");
                    }

                    //Controlamos el disparo, dependiendo de donde esté megaman
                    this.time+=dt;
                    if(this.time>=this.frequency){
                        var megaman = Q("Megaman").first();
                        this.time = 0;
                        if(megaman.p.x < this.p.x){ //Está a su izq
                            this.p.vx = 0;
                            //Llamamos a shoot y desde ahí se lanza el trigger
                            this.play("shoot_left");
                        }else if(megaman.p.x > this.p.x){   //Está a su der
                            this.p.vx = 0;
                            this.play("shoot_right");
                        }                   
                    }
                } else {
                    this.p.vx = 0;
                }
            },
            golpeado: function(dmg){
                Q.state.dec("boss", dmg);
                if(Q.state.get("boss") <= 0){
                    var exp1 = new Q.Explosion({x:this.p.x-32,y:this.p.y});
                    var exp2 = new Q.Explosion({x:this.p.x+32,y:this.p.y});
                    var exp3 = new Q.Explosion({x:this.p.x,y:this.p.y});
                    var exp4 = new Q.Explosion({x:this.p.x,y:this.p.y-32});
                    var exp5 = new Q.Explosion({x:this.p.x,y:this.p.y+32});
                    this.stage.insert(exp1);
                    this.stage.insert(exp2);
                    this.stage.insert(exp3);
                    this.stage.insert(exp4);
                    this.stage.insert(exp5);
                    this.destroy();
                    Q.audio.play("die_enemy.mp3");
                    Q.stageScene("winGame", 2);
                }
            }
        });
        
        Q.Sprite.extend("Fireman_Fire", {
            
            init: function(p) {
                this._super(p,{
                    sheet: "fireman_fire",
                    sprite: "fireman_fire_anim",
                    scale: 1,
                    x: 128,
                    y: 177,
                    vx: 0,
                    frame: 0,
                    damage: 1,
                    tipo: SPRITE_ENEMY,
                    type: Q.SPRITE_PROYECTILE,
                    collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_PLAYER,
                    //sensor: true,     
                    taken: false        //Para que no haga tantas colisiones como fps haya
                });

                this.add("2d, animation");
                this.on("bump.left, bump.right, bump.botton, bump.top", this, "hit");
                this.add("tween");  //Importante para el comportamiento animate -> Añadimos mediante componentes
            },
            hit: function(collision){
                if(this.p.taken) return;      //Si ya está cogida sale
                if(collision.obj.isA("Megaman")){
                    //Llamamos al golpeado de Megaman            
                    collision.obj.golpeado(1);

                    //Para que solo actue una vez
                    this.taken = true;
                    //collision.obj.golpeado(this.p.damage);
                    //Dibujamos debajo del fireman fuego
                    var megaman = Q("Megaman").first();
                    var fire_bullet_floor = new Q.Fireman_Fire_Floor({x:megaman.p.x-30,y:177, vx: 0 });
                    Q.audio.play("proyectile_fireman_1.mp3");
                    this.stage.insert(fire_bullet_floor);

                    //Destruimos el fuego
                    this.destroy();

                //Si choca con cualquier otro objeto, desaparece
                } else {
                    this.destroy();
                }
            },
            step: function(dt){

                //Movimiento según a donde dispare
                if(this.p.vx > 0){
                    this.play("fire_right");
                }else{
                    this.play("fire_left");
                }

                //Movimiento MRU
                this.p.x += this.p.vx * dt;
        
            },
            golpeado: function(dmg){
                this.destroy();
            }
        });

        Q.Sprite.extend("Fireman_Fire_Floor", {
            
            init: function(p) {
                this._super(p,{
                    sheet: "fireman_fire_floor",
                    sprite: "fireman_fire_floor_anim",
                    scale: 1,
                    x: 128,
                    y: 177,
                    vx: -25,
                    frame: 0,
                    tipo: SPRITE_ENEMY,
                    type: Q.SPRITE_ENEMY,
                    collisionMask: Q.SPRITE_DEFAULT,
                    //sensor: true,     
                    taken: false        //Para que no haga tantas colisiones como fps haya
                });

                this.add("2d, animation");
                this.on("bump.left, bump.right, bump.botton, bump.top", this, "hit");
                this.add("tween");  //Importante para el comportamiento animate -> Añadimos mediante componentes
                //Con esto manejamos el tiempo de recarga de Fireman
                this.time = 0;
                this.frequency = 1;
            },
            hit: function(collision){
                if(this.taken) return;      //Si ya está cogida sale
                if(collision.obj.isA("Megaman")){
                    //Llamamos al die de Megaman            
                    collision.obj.golpeado(1);

                    //Para que solo actue una vez
                    this.taken = true;

                    //Destruimos el fuego
                    this.destroy();

                //Si choca con cualquier otro objeto, desaparece
                }else{
                    this.destroy();
                }
            },
            step: function(dt){
                this.play("fire_floor");
                this.time+=dt;
                if(this.time>=this.frequency){
                    this.destroy();
                }
            },
            golpeado: function(dmg){
                this.destroy();
            }
        });

        Q.Sprite.extend("BombMan", {
		
            init: function(p) {
                this._super(p,{
                    sheet: "idle",
                    sprite: "bombman_anim",
                    frame: 0,
                    dir: -1,
                    hp: 8,
                    stopAnim: false,
                    type: Q.SPRITE_BOSS,
                    puedeSaltar: false,
                    collisionMask: Q.SPRITE_DEFAULT,
                    dead:false,
                    scale: 1
                });
                this.p.posIni = this.p.y;
                this.add("2d, animation, tween");
                this.on("bump.bottom", this, "puedeSaltar")
                Q.input.on("P", this, "depurar");
                this.on("throwB", this, "throwBomb");
            
            },
            depurar: function() {
                console.log(this.p.vy);
            },

            puedeSaltar: function(col) {
                if (col.obj.type == Q.SPRITE_DEFAULT)
                    this.p.puedeSaltar = true;
            },
    
            golpeado: function(dmg) {
                
                Q.state.dec("boss", dmg);
                
                if(Q.state.get("boss") <= 0){
                    this.p.dead = true;
                    var exp1 = new Q.Explosion({x:this.p.x-32,y:this.p.y});
                    var exp2 = new Q.Explosion({x:this.p.x+32,y:this.p.y});
                    var exp3 = new Q.Explosion({x:this.p.x,y:this.p.y});
                    var exp4 = new Q.Explosion({x:this.p.x,y:this.p.y-32});
                    var exp5 = new Q.Explosion({x:this.p.x,y:this.p.y+32});
                    this.stage.insert(exp1);
                    this.stage.insert(exp2);
                    this.stage.insert(exp3);
                    this.stage.insert(exp4);
                    this.stage.insert(exp5);
                    this.destroy();
                    Q.audio.play("die_enemy.mp3");
                    Q.stageScene("winGame", 2);
                }
    
            },
            saltoBombMan: function() {
                this.p.puedeSaltar = false;
                this.play("jump_mov");
                this.animate({vy:-100,vx:this.p.dir*70,gravity:0},
                            1,
                            Q.Easing.Quadratic.Out,
                            {callback: function(){
                                this.animate({vy:50,vx:this.p.dir*35,gravity:0.3},
                                1,
                                Q.Easing.Quadratic.In,{callback: function(){
                                    this.p.stopAnim = false;
    
                                }});
                            }});

            },
    
            throwBomb: function () {
                Q.audio.play("throw_bomb.mp3");
                var p = new Q.Bomb({dir: this.p.dir,x:this.p.x+(this.p.dir*32),y:this.p.y});
                this.stage.insert(p);
                if (this.p.puedeSaltar)
                    this.saltoBombMan();
            },
            
            step: function (dt) {
                if(Q.state.get("lives") > 0) {
                    var megaman = Q("Megaman").first();
                    var dist = Math.abs(this.p.x -  megaman.p.x);
                    
                    if (dist <= 150) {
                        if (this.p.vy > 0){
                            this.play("jump_mov");
                        }
                        
                        if(this.p.vy == 0 && !this.p.stopAnim) {
                            this.p.stopAnim = true;
                            this.play("throwbomb_mov");	
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
                
            }
    
        });
    
        Q.Sprite.extend("Explosion", {
            
            init: function(p) {
                this._super(p,{
                    sheet: "iniExplosion",
                    sprite: "explosion_anim",
                    sensor:true,
                    gravity:0,
                    done:false,
                    scale: 1
                });
                this.add("animation,tween");
                this.on("endExp",this,"endExplosion");
                
            },
            endExplosion: function(){
                this.destroy();
            },
            step: function (dt) {
                if(!this.p.done){
                    this.p.done = true;
                    Q.audio.play("bomb.mp3");
                    this.play("explode");
                }
                
            }
    
        });
    
        Q.Sprite.extend("Bomb", {
            
            init: function(p) {
                this._super(p,{
                    asset: "bomb.png",
                    muerto: false,
                    eliminable:false,
                    type: Q.SPRITE_BOLA,
                    collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT | Q.SPRITE_PROYECTILE,
                    gravity:0,
                    scale: 1
                });
                this.p.posAnt = 0;
                this.p.Ini = this.p.x;
                this.add("2d,animation,tween");
                this.on("bump.top,bump.bottom,bump.left,bump.right",this,"hit");
                this.throwBomb();
                Q("BombMan").first().p.puedeSaltar = true;
            },
            hit: function (collision) {
                if(this.p.muerto) return;
                if(collision.obj.isA("Megaman")){
                    collision.obj.golpeado(1);
                    this.p.muerto = true;
                } else if (collision.obj.isA("Proyectile")) {
                    collision.obj.die();
                    this.p.muerto = true;
                }
                
            },
            throwBomb: function(){
                this.animate({vy:-100,vx:this.p.dir*40,gravity:0},
                            1/4,
                            Q.Easing.Quadratic.Out,
                            {callback: function(){
                                this.animate({vy:30,vx:this.p.dir*50,gravity:0.8},
                                1,
                                Q.Easing.Quadratic.In,{
                                    callback:function(){
                                        this.p.eliminable = true;
                                    }});
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
                    var exp = new Q.Explosion({x:this.p.x,y:this.p.y});
                    this.stage.insert(exp);
                    this.destroy();
                }
    
                this.p.posAnt = this.p.x;
            }
    
        });
    
    }      
}

if(typeof Quintus === 'undefined') {
    module.exports = bosses;
} else {
    bosses(Quintus);
}