class World {
    character = new Character(); /* creates Character */
    level = level1; /* calls other Objects besides Character */
    canvas; /* calls canvas from constructor for use in other functions */
    ctx;  /* calls canvas context from constructor for use in other functions */
    keyboard; /* calls keyboard for use in other functions */
    camera_x = 0; /* Variable to set World to be shifted as Character moves */
    statusBar = new StatusBar();
    bottleBar = new BottleBar();
    coinBar = new CoinBar();
    endbossBar = new EndbossBar();
    bottle = new Collectable();
    coin = new Coin();
    throwableObjects = []; /* array to push collected bottles; array from which bottles are subtracted when thrown at endboss */

    endboss = this.level.endboss[0];

    coinSound = new Audio('audio/coin.mp3');
    bottleSound = new Audio('audio/bottle.mp3');
    chickenSound = new Audio('audio/chicken-dead.mp3');
    hurtSound = new Audio('audio/hurt.mp3');
    throwSound = new Audio('audio/throw.mp3');

    
    constructor(canvas) {
        this.volumeOfSounds();
        this.ctx = canvas.getContext('2d'); /* get access to the canvas tags 2D drawing functions; canvas context is an object with properties and methods that you can use to render graphics inside the canvas element. */
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw(); 
        this.setWorld(); /* pass pressed buttons on to character; this functions connects the character to the world */
        this.run();
    }

    volumeOfSounds() {
        this.coinSound.volume = 0.1;
        this.bottleSound.volume = 0.5;
        this.chickenSound.volume = 0.1;
        this.hurtSound.volume = 0.1;
    }

    run() {
        setInterval(() => {
            this.checkCollisionsCoin();
            this.checkCollisionsBottle();
            this.checkCollisionsEnemy();
            this.checkCollisionsHit();
            this.checkCollisionsEndbossHit();
            this.checkCollisionsEndboss();
            this.checkThrowObject();
            this.collisionCharacterAboveEnemies();
        }, 100);
    }

    checkThrowObject() {
        if (this.keyboard.D && this.bottleBar.amountOfBottles > 0) {
            let bottle = new ThrowableOject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
            this.bottleBar.amountOfBottles -= 1;
            console.log('amount', this.bottleBar.amountOfBottles);
            this.bottleBar.updateBottleBar();
        }
    }

    checkCollisionsBottle() {
        this.level.collectable.forEach((bottleX, index) => {
                if (this.character.isColliding(bottleX) && this.bottleBar.amountOfBottles < 5) {
                    this.collectBottles();
                    this.bottleBar.updateBottleBar();
                    this.level.collectable.splice(index, 1);
                    this.bottleSound.play();
                    console.log('amountOfBottles ', this.bottleBar.amountOfBottles)
                }
        });
    }

    checkCollisionsCoin() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.coinBar.collectCoins();
                this.level.coins.splice(index, 1);
                this.coinBar.updateCoinBar();
                this.coinSound.play();
            }
        });
    }

    checkCollisionsHit() {
        this.level.enemies.forEach((enemy, index) => {
            this.throwableObjects.forEach(throwBottle => {
                if (throwBottle.isColliding(enemy) && !enemy.chickenDead) {
                    this.chickenSound.play();
                    this.level.enemies.splice(index, 1)
                }
            });
        });
    }

    checkCollisionsEndbossHit() {
        this.throwableObjects.forEach(throwBottle => {
            if (throwBottle.isColliding(this.endboss)) {
                this.endboss.hit();
                console.log('Endboss HP: ', this.endboss.energy)
                this.endbossBar.updateEndbossBar(this.endboss.energy)
            }
        });
    }

    checkCollisionsEnemy() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy) && !enemy.chickenDead && !this.character.isAboveGround()) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
                this.hurtSound.play();
            }
        });
    }

    collisionCharacterAboveEnemies() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && this.character.isAboveGround() && !enemy.chickenDead) { 
                this.character.jump();
                this.chickenSound.play();
                enemy.chickenDead = true;
            }
        });
    }

    checkCollisionsEndboss() {
        if (this.character.isColliding(this.endboss)) {
            this.character.hit();
            console.log('Collision with Character energy', this.character.energy);
            this.statusBar.setPercentage(this.character.energy);
            this.hurtSound.play();
        }
    }

    collectBottles() {
        this.bottleBar.amountOfBottles += 1;
        if (this.bottleBar.amountOfBottles > 5) {
            this.bottleBar.amountOfBottles = 5;
        }
    }

    setWorld() {
        this.character.world = this; /* with "this" all variables can be passed to the character */
    }
    
    /**
     * create drawings; move entire world (translate, x-axis) and back after drawing to avoid continuous shifting; Camera and Character move in opposite directions
     * 
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) /* clear canvas for redrawing */

        this.ctx.translate(this.camera_x, 0);/* move in x-axis */

        this.AddObjectsToMap(this.level.backgroundObjects);
        this.AddToMap(this.character);
        this.AddObjectsToMap(this.level.clouds);

        this.ctx.translate(-this.camera_x, 0); /* move back after drawing */
        /* ------ Space for fixed objects ------ */
        this.AddToMap(this.statusBar);
        this.AddToMap(this.bottleBar);
        this.AddToMap(this.coinBar);
        
        if (this.character.x > 1900) {
            this.AddToMap(this.endbossBar);
        }

        this.ctx.translate(this.camera_x, 0);

        this.AddObjectsToMap(this.level.collectable)
        this.AddObjectsToMap(this.level.coins)
        this.AddObjectsToMap(this.level.enemies);
        this.AddObjectsToMap(this.level.endboss);

        this.AddObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);

        /* draw function executed continuously */
        let self = this;
        if(!this.paused) {
            requestAnimationFrame(function () {
                self.draw();
            })
        }
    };

    /**
     * add more then one object to map - use forEach loop
     * 
     */
    AddObjectsToMap(objects) { 
        objects.forEach(objects => {
            this.AddToMap(objects)
        })
    }

    /**
     * add one object to map; character and bars
     * 
     */
    AddToMap(object) { 
        if (object.otherDirection) {
            this.flipImage(object)
        }
        object.draw(this.ctx);
        object.drawFrame(this.ctx);
        if (object.otherDirection) {
            this.flipImageBack(object);
        }
    }

    /**
     * flip characters image when moves to different direction
     * 
     */
    flipImage(object) {
        this.ctx.save(); /* save properties of context */
        this.ctx.translate(object.width, 0); /* move context; mirrored */
        this.ctx.scale(-1, 1); /* move by the width of the element */
        object.x = object.x * -1; /* x-axis also mirrored */
    }

    /**
     * flip back characters image
     * 
     */
    flipImageBack(object) {
        object.x = object.x * -1;
        this.ctx.restore(); /* restore properties od context previously saved; necessary as the other objects were not mirrored, only Character */
    }

}
