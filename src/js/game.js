// mods by Patrick OReilly 
// Twitter: @pato_reilly Web: http://patricko.byethost9.com

// const width = Math.min(window.innerWidth, 720);
// const height = Math.min(window.innerHeight, 1280);

const width = window.innerWidth;
const height = window.innerHeight;

var game = new Phaser.Game(width, height, Phaser.CANVAS, '', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

var widthScale;
var heightScale;

function preload() {
    // Scale stuff
    // Ideal world 1280x720: Landscape => 720x1280: Portrait
    heightScale = height / 1280;
    widthScale = width / 720;

    console.log("Width: " + width + ", Height: " + height)
    console.log("WidthScala: " + widthScale + ", HeightScale: " + heightScale)

    //  You can fill the preloader with as many assets as your game requires

    //  Here we are loading an image. The first parameter is the unique
    //  string by which we'll identify the image later in our code.

    //  The second parameter is the URL of the image (relative)
    game.load.image('flyer', 'assets/sprites/phaser-dude.png', 27, 40);
    game.load.image('blocker', 'assets/sprites/blocker.png', 32, 32);
    game.load.image('block', 'assets/sprites/block.png', 32, 32);
}

var image;
var bouncer;
var blocks;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    //  and assign it to a variable
    image = game.add.sprite(0, 0, 'flyer');
    setScale(image)



    game.physics.enable(image, Phaser.Physics.ARCADE);

    //  This gets it moving
    image.body.velocity.setTo(scaleWidth(300), scaleHeight(300));

    //  This makes the game world bounce-able
    image.body.collideWorldBounds = true;

    //  This sets the image bounce energy for the horizontal 
    //  and vertical vectors. "1" is 100% energy return
    image.body.bounce.set(1);

    ////
    //bouncer = new Phaser.Rectangle(0, 550, 800, 50);
    bouncer = game.add.sprite(360 * widthScale, 1100 * heightScale, 'blocker');
    setScale(bouncer);

    game.physics.enable(bouncer, Phaser.Physics.ARCADE);
    bouncer.body.collideWorldBounds = true;
    bouncer.body.immovable = true;
    
    speed = scaleWidth(350);
    var left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    left.onDown.add(moveleft, this);

    var right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    right.onDown.add(moveright, this);

    left.onUp.add(stop);
    right.onUp.add(stop);

    //bouncer.body.maxVelocity.x = 300;
    bouncer.body.maxVelocity.y = 0;


    // enable touch

    //  Input Enable the sprites
    bouncer.inputEnabled = true;

    //  Allow dragging - the 'true' parameter will make the sprite snap to the center
    bouncer.input.enableDrag(true);


    // Add bricks
    blocks = game.add.group();
    blocks.enableBody = true;
    blocks.physicsBodyType = Phaser.Physics.ARCADE;

    // 1 row of blocks
    for (var i = 0; i < 8; i+=2) {
        for (var j = 0; j < 10; j++) {
            // var block = blocks.create(100 + (j * 64), 100 + (i * 64), 'block');
            var block = blocks.create(scaleWidth(100 + (j * (32 + 24))), scaleHeight(100 + (i * (32 + 24))), 'block');
            block.body.bounce.set(1);
            block.body.immovable = true;
            setScale(block)
        }
    }

}

var speed;


function moveright() {
    bouncer.body.velocity.setTo(speed, 0);

}

function moveleft() {
    bouncer.body.velocity.setTo(-speed, 0);
}

function stop() {
    bouncer.body.velocity.setTo(0, 0);
}

function breakblock(_ball, _block) {
    _block.kill();
}

function setScale(_obj) {
    _obj.scale.set(widthScale, heightScale);
}

function scaleWidth(unscaled){
    return unscaled * widthScale; 
}

function scaleHeight(unscaled){
    return unscaled * heightScale; 
}

function update() {
    game.physics.arcade.collide(image, bouncer, function() {
        console.log("Crash");
    }, null, this);
    //nothing required here

    game.physics.arcade.collide(image, blocks, breakblock, null, this);
}

function render() {

    //debug helper
    game.debug.spriteInfo(bouncer, 32, 32);
    //game.debug.body(bouncer);

}