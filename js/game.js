let canvas;
let world;
let keyboard = new Keyboard();
let audioOn = false;

gameAudio = new Audio('audio/music.mp3')

/**
 * defines variable canvas and creates new instance of World with parameters canvas and keyboard
 * 
 */
function init() {
    canvas = document.getElementById('canvas'); // returns an Element object representing the element whose id property matches the specified string
    world = new World(canvas, keyboard);
}

/**
 * restarts the game by refreshing the current documents 
 * 
 */
function restart() {
    location.reload();
}

/**
 * shows screen when user wins 
 * 
 */
function win() {
    document.getElementById('game').classList.add('d-none');
    document.getElementById('win').classList.remove('d-none');
    gameAudio.pause();
}

/**
 * shows screen when user lost
 * 
 */
function gameOver() {
    document.getElementById('game').classList.add('d-none');
    document.getElementById('gameOver').classList.remove('d-none');
    document.getElementById('win').classList.add('d-none');
    gameAudio.pause();
}

/**
 * starts the game
 * 
 */
function startGame() {
    initLevel(); //creates objects (enemies, background and others)
    init();      // creates world with canvas
    playMusic();
    document.getElementById('start').classList.add('d-none');
    document.getElementById('game').classList.remove('d-none');
    document.getElementById('win').classList.add('d-none');
}

/**
 * sets or returns whether the music should start playing over again when it is finished; defines music volume and removes mute buttons opacity
 * 
 */
function playMusic() {
    gameAudio.loop = true;
    gameAudio.play();
    gameAudio.volume = 0.1;
    audioOn = true;
    document.getElementById('mute').classList.remove('opacity')
}

/**
 * stops music when it is on or plays music when off
 * 
 */
function stopMusic() {
    if (audioOn) {
        gameAudio.pause();
        document.getElementById('mute').classList.add('opacity');
        audioOn = false;
    } else {
        playMusic();
    }

}

/**
 * makes canvas element go full screen
 * 
 */
function fullscreen() {
    canvas.requestFullscreen()
}


/**
 * defines keyboard buttons; press turns variables to true
 * 
 */
window.addEventListener("keydown", (e) => {
    if(e.keyCode == 39) {
        keyboard.RIGHT = true;
    }

    if(e.keyCode == 39) {
        keyboard.RIGHT = true;
    }

    if(e.keyCode == 37) {
        keyboard.LEFT = true;
    }

    if(e.keyCode == 38) {
        keyboard.UP = true;
    }

    if(e.keyCode == 40) {
        keyboard.DOWN = true;
    }

    if(e.keyCode == 32) {
        keyboard.SPACE = true;
    }

    if(e.keyCode == 68) {
        keyboard.D = true;
    }

})

/**
 * defines keyboard buttons; release turns variables to false
 * 
 */
window.addEventListener("keyup", (e) => {
    if(e.keyCode == 39) {
        keyboard.RIGHT = false;
    }

    if(e.keyCode == 39) {
        keyboard.RIGHT = false;
    }

    if(e.keyCode == 37) {
        keyboard.LEFT = false;
    }

    if(e.keyCode == 38) {
        keyboard.UP = false;
    }

    if(e.keyCode == 40) {
        keyboard.DOWN = false;
    }

    if(e.keyCode == 32) {
        keyboard.SPACE = false;
    }

    if(e.keyCode == 68) {
        keyboard.D = false;
    }

})











