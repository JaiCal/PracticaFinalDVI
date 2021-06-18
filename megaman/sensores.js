var sensores = function(Quintus) {

    Quintus["Sensores"] = function(Q) {
        
        Q.Sprite.extend("Door", {
            init: function(p) {
                this._super(p, {
                    sheet: "door",
                    sprite: "door_anim",
                    scale: 1,
                    isDoubleDoor: false,
                    sensor: true,
                    type: Q.SPRITE_SENSOR,
                    collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_ENEMY  | Q.SPRITE_DEFAULT,
                    open: false,
                    taken: false
                });

                this.on("sensor", this, "hit");
                this.on("bump.left", this, "chocar");
                this.on("bump.right", this, "cerrado");
                this.on("kill", this, "kill");
                this.add("2d, animation");

            },

            cerrado: function(collision){
                if(!collision.obj.isA("Megaman")) return;
                collision.obj.p.vx = collision.normalX*-500;
                collision.obj.p.x += collision.normalX*-5;
            },

            chocar: function(collision) {
                if(!collision.obj.isA("Megaman")) return;
                collision.obj.p.vy = -200;
                collision.obj.p.vx = collision.normalX*-500;
                collision.obj.p.x += collision.normalX*-5;
            },

            hit: function(collision) {
                if(this.taken) return;
                if(!collision.isA("Megaman"))return;
                this.taken = true;
                this.p.open = true;
                if (this.p.linked == "true") {
                    var otherDoor = this.stage.find(this.p.link);
                    otherDoor.p.open = true;
                    otherDoor.p.taken = true;
                    //Q.stage().pause(collision);
                }
            },

            kill: function() {
                this.destroy();
            },
            
            step: function (dt) {
                if (this.p.open) 
                    this.play("opening");
                else 
                    this.play("closed");
            }

        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        Q.Sprite.extend("Camara", {
            init: function(p) {
                this._super(p, {
                    asset: "camara.png",
                    scale: 1,
                    sensor: true,
                    taken: false,
                    visible: false,
                    frecuencia: 250,
                    subiendo: false
                });
                this.on("sensor",this,"hit");
                this.add("tween, animation");
            },

            hit: function(collision) {
                if (this.taken && this.p.tipo == "Subir") return;
                if(!collision.isA("Megaman"))return;
                if (this.p.tipo == "Subir") {
                    if (!collision.p.climbing)
                        return;
                    this.p.subiendo = true;
                    collision.p.subiendoCamara = true;
                    this.p.colObj = collision;
                    this.taken = true;
                } else if (this.p.tipo == "LimiteIzq") {
                    if (this.p.x > collision.p.x) {
                        Q.stage().unfollow();
                    } else {
                        Q.stage().follow(collision, {x: true, y: false});
                    }
                } else if (this.p.tipo == "LimiteDer") {
                    if (this.p.x < collision.p.x) {
                        Q.stage().unfollow();
                    } else {
                        Q.stage().follow(collision, {x: true, y: false});
                    }
                } else if (this.p.tipo == "Bajar") {
                    this.taken = true;
                    Q.stage().follow(collision, {x: false, y: true});
                }
            },

            step: function(dt) {
                if (this.p.subiendo) {
                    if (this.p.frecuencia < 0) {
                        this.p.colObj.camaraOff();
                        this.destroy();
                    } else {
                        this.stage.viewport.y--;
                    }
                    this.p.frecuencia--;
                }
            }
        });

        //////////////////////////////////////////////////////////////////////////

        Q.Sprite.extend("Lift", {

            init: function(p) {
                this._super(p,{
                    asset: "lift.png",
                    muerto: false,
                    gravity: 0,
                    isOn: false,
                    vx: 30
                });
                
                this.add("2d, aiBounce");
                this.on("bump.top",this,"onTop");
            
            },
            onTop: function(collision){
                if (!collision.obj.isA("Megaman")) return;
                this.p.isOn = true;
            },
            step: function (dt) {
                if(Q.state.get("lives") > 0) {
                    var megaman = Q("Megaman").first();
                    var dist = Math.abs(this.p.x -  megaman.p.x);

                    /*if(this.p.y-megaman.p.y >= 32){
                       this.p.isOn = false; 
                    }*/
                    if (megaman.p.vy != 0)
                        this.p.isOn = false;

                    if(this.p.isOn){
                        megaman.p.x = this.p.x ;
                        this.p.vy = 0;
                    }

                }
            }

        });

        //////////////////////////////////////////////////////////////////////////


        Q.Sprite.extend("LifeItem", {


            init: function(p) {
            this._super(p,{
                asset: "megamanLifeItem.png",
                scale: 1,
                sensor: true,
                taken: false
            });

            this.on("sensor",this,"hit");
            this.add("tween,animation");
        
            },
            hit: function(collision){
                if(this.taken) return;
                if(!collision.isA("Megaman"))return;

                this.taken = true;
                if(Q.state.get("lives") < 8){
                    Q.state.inc("lives",1);
                    
                }
                this.animate({y:this.p.y-80,angle:360},
                                1,
                                Q.Easing.Quadratic.Out,
                                {callback: function(){this.destroy()}});

            }





        });

        //////////////////////////////////////////////////////////////////////////

    }      
}

if(typeof Quintus === 'undefined') {
    module.exports = sensores;
} else {
    sensores(Quintus);
}