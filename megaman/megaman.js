var megaman = function(Quintus) {
    Quintus["Megaman"] = function(Q) {
        
        Q.Sprite.extend("Megaman", {
		
            init: function(p) {
                this._super(p, {
                    sheet: "megaman",
                    sprite: "megaman_anim",
                    frame: 7,
                    scale: 1,
                    subiendo: false,
                    on_stair: false,
                    speed: 130,
                    standingPoints: [[-12, -8], [12, -8], [12, 16],[-12, 16]],
                    climbPoints: 	[[ -8, -8], [ 8, -8], [ 8, 16],[ -8, 16]],
                    tipo: SPRITE_PLAYER,
                    type: Q.SPRITE_PLAYER,
                    collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_ENEMY | Q.SPRITE_PROYECTILE,
                    climbing: false,
                    subiendoCamara: false,
                    distCamaraSubiendo: 240, 
                    canShoot: true,
                    pinchos: false,
                    direction: "right",
                    counter: 0,
                    muerto: false
                });
                
                this.p.points = this.p.standingPoints;
    
                this.add("2d, platformerControls, animation, tween");
    
                this.on("sensor.tile", "checkSensor");
    
                Q.input.on("fire", this, "disparar");
                Q.input.on("confirm", this, "disparar");
                Q.input.on("P", this, "depurar");
                Q.input.on("up", this, function(){ 
                    if (this.p.vy == 0 && !this.p.climbing) { 
                        Q.audio.play("jump_megaman.mp3");
                    };
                });
    
            },
    
            depurar: function() {
                console.log("StageX: " + this.stage.viewport.x);
                console.log("StageY: " +this.stage.viewport.y);
                console.log("MegamanX: " + this.p.x);
                console.log("MegamanY: " + this.p.y);
                console.log("Num ladders: " + this.p.twoLadders);
                console.log(Q.state.get("lives"));
                console.log(Q.SPRITE_DEFAULT);
                console.log(this.stage.scene.name);
            },
    
            golpeado: function(dmg) {
                if (!this.p.inmune || this.p.pinchos) {
                    Q.state.dec("lives", dmg);
                    if(Q.state.get("lives") <= 0) {
                        //Q.stage().pause();
                        console.log(Q.state.get("lives"));
                        this.p.opacity = 0;
                        this.p.muerto = true;
                        // llamar game over
                        Q.clearStages();
                        Q.stageScene("gameOver", 1); 
                    } else {
                        this.p.inmune = true;
                        this.p.inmuneTimer = 0;
                        this.p.inmuneOpacity = 1;
                        this.p.collisionMask = Q.SPRITE_DEFAULT;
                    }
                }
            },
            
            disparar: function() {
                if (this.p.canShoot) {
                    var xPoint;
                    var yPoint;
                    var sprite;
                    var damage;
                    var speed;
                    if (Q.inputs['confirm']) {
                        Q.audio.play("proyectile_megaman_1.mp3");
                        sprite = "proyectileM.png";
                        damage = 2;
                        this.p.shootTimer = 110;
                    } else if (Q.inputs['fire']) {
                        Q.audio.play("proyectile_megaman_2.mp3");
                        sprite = "proyectileP.png";
                        damage = 1;
                        this.p.shootTimer = 70;
                    }
                    
                    if (this.p.direction == "right") {
                        xPoint = this.p.x + 20;
                        speed = 200;
                    } else {
                        xPoint = this.p.x - 20;
                        speed = -200;
                    }
                    yPoint = this.p.y + 4;
    
                    bala = new Q.Proyectile({asset: sprite, x: xPoint, y: yPoint, vx: speed, damage: damage, tipo: SPRITE_PLAYER});
                    this.stage.insert(bala);
                    this.p.canShoot = false;
                    this.p.timeToShoot = 0;
                }		
            },
    
            camaraOff: function() {
                this.p.subiendoCamara = false;
            },
    
            checkSensor: function(colObj) {
                if (colObj.p.ladder) {
                    this.p.points = this.p.climbPoints;
                    this.p.onLadder = true;
                    this.p.ladderX = colObj.p.x;
                    this.p.ladderY = colObj.p.y;
                }
                if (colObj.p.floor) {
                    this.p.climbing = false;
                }
    
                if (colObj.p.pinchos == "true") {
                    this.p.pinchos = true;
                    this.golpeado(40);
                }
            },
            
            continueOverSensor: function(action) {
                this.p.vy = 0;
                if(this.p.vx != 0) {
                  this.play("walk_" + action + this.p.direction);
                } else {
                  this.play(action + "stand_" + this.p.direction);
                }
            },
    
            isDead: function(){
                
                this.p.vx = 0;
                this.p.vy = 0;

                if (this.p.counter % 50 == 0) {
                    this.stage.insert(new Q.Muerte({ x: this.p.x, y: this.p.y, dir: "N"}));
                    this.stage.insert(new Q.Muerte({ x: this.p.x, y: this.p.y, dir: "NE"}));
                    this.stage.insert(new Q.Muerte({ x: this.p.x, y: this.p.y, dir: "E"}));
                    this.stage.insert(new Q.Muerte({ x: this.p.x, y: this.p.y, dir: "SE"}));
                    this.stage.insert(new Q.Muerte({ x: this.p.x, y: this.p.y, dir: "S"}));
                    this.stage.insert(new Q.Muerte({ x: this.p.x, y: this.p.y, dir: "SO"}));
                    this.stage.insert(new Q.Muerte({ x: this.p.x, y: this.p.y, dir: "O"}));
                    this.stage.insert(new Q.Muerte({ x: this.p.x, y: this.p.y, dir: "NO"}));
                }
                if (this.p.counter > 50)
                    this.destroy();
                ++this.p.counter;

            },

            inmuneTime: function() {
                if (this.p.inmune) {
                    if ((this.p.inmuneTimer % 5) == 0) {
                        var opacity = (this.p.inmuneOpacity == 1) ? 0 : 1;
                        this.animate({"opacity": opacity}, 0);
                    }
                    this.p.inmuneTimer++;
                    if (this.p.inmuneTimer > 150) {
                        this.p.inmune = false;
                        this.animate({"opacity": 1}, 1);
                        this.p.collisionMask = Q.SPRITE_DEFAULT | Q.SPRITE_ENEMY | Q.SPRITE_PROYECTILE;
                    }
                }
            },

            accionEscalera: function(act) {
                this.p.gravity = 0;
                if (Q.inputs['up']) {
                    this.p.vy = -this.p.speed;
                    this.p.x = this.p.ladderX;
                    this.p.climbing = true;
                    this.play("escalar");
                } else if(Q.inputs['down']) {
                    this.p.vy = this.p.speed;
                    this.p.x = this.p.ladderX;
                    this.p.climbing = true;
                    this.play("escalar");
                } else {
                    this.continueOverSensor(act);
                    if (this.p.climbing) {
                        this.p.vx = 0;
                        this.play(act + "climb_" + this.p.direction);						
                    }
                }
            },

            cambioEscena: function() {
                if (this.p.x > 2580 && this.stage.scene.name == "level1") {
                    Q.clearStages();
                    Q.stageScene("boss_bomb_man", 1);
                    Q.stageScene("hub_boss", 2);
                    Q.stageScene("hub", 3);
                } else if(this.p.x > 3657 && this.stage.scene.name == "level2"){
                    Q.clearStages();
                    Q.stageScene("boss_fireman", 1);
                    Q.stageScene("hub_boss", 2);
                    Q.stageScene("hub", 3);
                }
            },

            accion: function(act) {
                this.p.gravity = 0.8;
                this.p.ignoreControls = false;
                this.p.points = this.p.standingPoints;
                this.p.climbing = false;
                if (this.p.vx > 0.1) {
                    if (this.p.vy == 0) {
                        this.play("walk_" + act + "right");
                    } else {
                        this.play("jump_" + act + "right");
                    }
                    this.p.direction = "right";
                } else if (this.p.vx < 0) {
                    if (this.p.vy == 0) {
                        this.play("walk_" + act + "left");
                    } else {
                        this.play("jump_" + act + "left");
                    }
                    this.p.direction = "left";
                } else {
                    this.play(act + "stand_" + this.p.direction);
                }
            },
    
            step: function (dt) {

                if (this.p.muerto) {

                    this.isDead();

                } else {

                    this.cambioEscena();

                    this.inmuneTime();
        
                    if (this.p.subiendoCamara) {
                        this.p.vx = 0;
                        this.p.vy = 0;
                        return;
                    }
        
                    if (this.p.timeToShoot > this.p.shootTimer)
                        this.p.canShoot = true;
                    this.p.timeToShoot++;
        
                    var _action = "";
        
                    if (!this.p.canShoot) { // Entra si hemos shooteado
                        _action = "shoot_";
                    }
        
                    if (this.p.onLadder) {

                        this.accionEscalera(_action);

                    } else {
                        
                        this.accion(_action);

                    }
        
                    this.p.onLadder = false;
                    this.p.posAntEscaleraY = this.p.y;
                }
    
            }
    
        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        Q.Sprite.extend("Muerte", {
            init: function(p) {
                this._super(p, {
                    sheet: "muerte",
                    sprite: "muerte_anim",
                    gravity: 0,
                    type: Q.SPRITE_BOLA,
                    collisionMask: Q.SPRITE_DEFAULT,
                    sensor: true,
                    //dir
                    speed: 100
                });
                this.add("animation, tween");
                switch (this.p.dir) {
                    case "N":
                        this.p.vx = 0;
                        this.p.vy = -this.p.speed;
                        break;
                    case "NE":
                        this.p.vx = this.p.speed;
                        this.p.vy = -this.p.speed;
                        break;
                    case "E":
                        this.p.vx = 0;
                        this.p.vy = this.p.speed;
                        break;
                    case "SE":
                        this.p.vx = this.p.speed;
                        this.p.vy = this.p.speed;
                        break;
                    case "S":
                        this.p.vx = 0;
                        this.p.vy = this.p.speed;
                        break;
                    case "SO":
                        this.p.vx = -this.p.speed;
                        this.p.vy = this.p.speed;
                        break;
                    case "O":
                        this.p.vx = -this.p.speed;
                        this.p.vy = 0;
                        break;
                    case "NO":
                        this.p.vx = -this.p.speed;
                        this.p.vy = -this.p.speed;
                        break;
                }
            },

            step: function(dt) {
                this.p.x += this.p.vx * dt;
                this.p.y += this.p.vy * dt;
                this.play("muerte");
            }
        });
    }
}

if(typeof Quintus === 'undefined') {
    module.exports = megaman;
} else {
    megaman(Quintus);
}