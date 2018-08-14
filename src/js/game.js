/*
A DAY IN THE LIFE
by Mattia Fortunati

http://www.mattiafortunati.com
mattia@mattiafortunati.com

A DAY IN THE LIFE was developed for the 2017 js13kGames competition.
http://js13kgames.com/

-

Libs used: 
-Kontra (used for game loop and assets preloading) https://straker.github.io/kontra/
-TinyMusic (as is) https://github.com/kevincennis/TinyMusic
-Pixel Font (adapted) https://github.com/PaulBGD/PixelFont

also, the canvas setup is from xem's responsiveTouchGameFramework:
https://github.com/xem/responsiveTouchGameFramework/blob/gh-pages/mini.html

-

Note that the code is far, far away, from being optimized at best.
There are a lot of possible optimization to make it smaller, faster and improve overall performance.
But, this was really the best I could do with the short time I had for working on it!

Where code comments are not enough, I've left long and readable variable and function names.
I hope that you will find this source code useful somehow! :)

I hope that you'll like my game.
Thank you for playing!

*/



/* 
=======================================================
INIT KONTRA ENGINE
=======================================================
*/
kontra.init()



/* 
=======================================================
handle window lost focus
=======================================================
*/
blurred = false
window.onblur = function() {
    sequence1.gain.gain.value = 0
    sequence2.gain.gain.value = 0
    blurred = true
}



/* 
=======================================================
ONE TIME VAR INITIALIZATION
=======================================================
*/

x = kontra.canvas.getContext('2d');
x.imageSmoothingEnabled = false;
x.webkitImageSmoothingEnabled = false;
x.mozImageSmoothingEnabled = false;
x.msImageSmoothingEnabled = false;
x.oImageSmoothingEnabled = false;
const imgPath = 'img/';
const img_boy = `${imgPath}boy.png`;
let clTimeout = null;
const black = '#000';
const white = '#fff';

var POOL;

/* 
=======================================================
PRE-LOADING ASSETS
then start the game
=======================================================
*/
kontra.assets.load(img_boy,)
    .then(function() {
        //load data
        if (window.localStorage) {
            personalBest = parseInt(localStorage.getItem('RECORD')) || 0;
        }

        initVar();
        initializeGame();
        startLoop();
    }).catch((error) => {
        console.error('Failed to load assets');
        console.error(error);
    });


/* 
=======================================================
CLASS POOL
=======================================================
*/

class Pool {
    constructor() {
        this.pool = [];
        for (let i = 0; i <= 300; i++) {
            const oo = new obj();
            oo.isActive = false;
            oo.flaggedRemove = true;
            this.pool.push(oo);
        }
    }

    getFromPool() {
        const element = this.pool.find((element) => !element.isActive);
        element.isActive = true;
        element.flaggedRemove = false;
        return element;
    }
}


/* 
=======================================================
MAIN GAME OBJECT
=======================================================
*/
obj = function() {
    this.create = function(x, y, sprite, type) {
        if (sprite != '') {
            this.image = kontra.assets.images[sprite]
            //this.image.src = sprite
        }

        this.x = x;
        this.y = y;
        this.type = type;
        this.interval1 = null;
        this.interval2 = null;
    },
    this.animate = function() {
        if (this.isAnimated === true) {
            this.animCount += 1;
        }
    },
    this.update = function() {
        // this is an object of the objects
        // this.remove to end it.
        if (this.flaggedRemove == false && this.isActive == true) {
            if (this.type == 'boy') {
                
            }
        }
    },
    this.draw = function() {
        //x.drawImage(this.image, this.x, this.y, tlSz, tlSz);
        if (this.flaggedRemove == false && this.isActive == true) {
            if (this.type == 'boy') {
                x.drawImage(this.image, 0,0,16,16, this.x * 16, this.y * 16, tlSz, tlSz);
            }
        }
    },
    this.remove = function() {
        this.flaggedRemove = true;
        this.image = null;
        this.shieldImage = null;
        //this.isActive = false
        this.type = '';
        if (this.interval) {
            window.clearInterval(this.interval);
            this.interval = null;
        }
        if (this.interval2) {
            window.clearInterval(this.interval2);
            this.interval2 = null;
        }
    }
}









/* 
=======================================================
Mouse and touch handling
=======================================================
*/

//handle click
b.addEventListener("touchend", function(e) {
    e.preventDefault() //prevent double call of both click and touch
}, false);

//handle click
b.addEventListener("mouseup", function(e) {
}, false);

//handle click
b.addEventListener("touchstart", function(e) {
    e.preventDefault(); //prevent double call of both click and touch
    click_start();
}, false);

//handle click
b.addEventListener("mousedown", function(e) {
    click_start();
}, false);


/* 
=======================================================
MISC functions
=======================================================
*/

//initialize variables
const initVar = function() {
    tlSz = a.width / 10 //TileSize
}


//initialization of title screen
initializeGame = function() {
    playAt(150);
    gamePhase = -1;
    createTCVS();
    TCTX.fillStyle = black;
    drawText('CLICK TO START', 2, {
        x: tlSz * 2.2,
        y: a.height - tlSz * 0.8
    });

    POOL = new Pool();
    player = POOL.getFromPool();
    player.create(0, 0, img_boy, 'boy');
    
    startGame();
}

//start game callback
startGame = function() {
    gamePhase = 1;
}


click_start = function() {
}


clearObjects = function(ending) {
    if (ending === null) {
        ending = false;
    }

    for (var i = 0; i <= objects.length - 1; i++) {
        objects[i].isActive = false;
        objects[i].remove();
    }
    objects.length = 0;
    objects = [];

    if (ending === false) {
        for (var i = 0; i <= ground.length - 1; i++) {
            ground[i].isActive = false;
            ground[i].remove();
        }
        ground.length = 0;
        ground = [];
    }

    player.remove();
    player.isActive = false;
    player = null;
}

restart = function() {
    x.clearRect(-100, 0, a.width + 200, a.height);
    TCTX.clearRect(-100, 0, a.width + 200, a.height);
    clearObjects();
    for (var i = 0; i <= lostList.length - 1; i++) {
        lostList[i] = null;
    }
    initVar();
    initializeGame();
}

/* 
=======================================================
Object Creation
=======================================================
*/

createBoy = function() {
    var u = POOL.getFromPool();
    u.create(0, 0, img_boy, 'boy');
    u.isActive = true;
    u.flaggedRemove = false;
    ground.push(u);
    u.groundType = Math.floor(Math.random() * 3);
}

/* 
=======================================================
Top UI
=======================================================
*/

drawUI = function() {
    x.drawImage(kontra.assets.images[img_boy], tlSz / 3, tlSz / 6, tlSz / 2, tlSz / 2);
}


/* 
=======================================================
GAME LOOP
=======================================================
*/

startLoop = function() {
    var loop = kontra.gameLoop({
        update: function() {

            if (gamePhase === 1) {
                
            }
        },
        render: function() {
            x.fillStyle = white;
            x.fillRect(0, tlSz / 2, tlSz * 12, tlSz / 8);
            
            player.draw();
        }
    });

    loop.start();
}


/* 
=======================================================
utils
taken from the internet :) and re-adapted where needed
=======================================================
*/

lineDistance = function(point1, point2) {
    var xs = 0;
    var ys = 0;

    xs = point2.x - point1.x;
    xs = xs * xs;

    ys = point2.y - point1.y;
    ys = ys * ys;

    return Math.sqrt(xs + ys);
}

removeFromArray = function(arr, what) {
    var found = arr.indexOf(what);

    while (found !== -1) {
        arr.splice(found, 1);
        found = arr.indexOf(what);
    }
}

rotateAndPaintImage = function(context, image, angleInDegrees, positionX, positionY, sizeX, sizeY) {
    context.translate(positionX, positionY);
    context.rotate(Math.radians(angleInDegrees));
    //2nd and 3rd parameter are anchor
    context.drawImage(image, -tlSz / 2, -tlSz / 2, sizeX, sizeY);
    context.rotate(-Math.radians(angleInDegrees));
    context.translate(-positionX, -positionY);
}

// Converts from degrees to radians.
Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

/* 
=======================================================
shaking handling, taken from internet and adapted
=======================================================
*/

const ctx = x;
const cv = x;

const shakeDuration = 200; //shake duration
let shakeStartTime = -1; //shake start time

function preShake() {
    if (shakeStartTime === -1) return;
    const dt = Date.now() - shakeStartTime;
    if (dt > shakeDuration) {
        shakeStartTime = -1;
        return;
    }
    const easingCoef = dt / shakeDuration;
    const easing = Math.pow(easingCoef - 1, 3) + 1;
    ctx.save();
    const dx = easing * (Math.cos(dt * 0.1) + Math.cos(dt * 0.3115)) * 5;
    const dy = easing * (Math.sin(dt * 0.05) + Math.sin(dt * 0.057113)) * 5;
    ctx.translate(dx, dy);
}

function postShake() {
    if (shakeStartTime === -1) return;
    ctx.restore();
}

function startShake() {
    shakeStartTime = Date.now();
}

function animate() {
    // keep animation alive
    requestAnimationFrame(animate);
    // erase
    ctx.clearRect(0, 0, cv.width, cv.height);
    //
    preShake();
    //
    //drawThings();
    //
    //postShake();
    setTimeout(function() {
        ctx.restore()
    }, shakeDuration, this)
}



/* 
=======================================================
Handling mute sound on desktop
=======================================================
*/
document.onkeypress = function(evt) {
    evt = evt || window.event;
    const charCode = evt.keyCode || evt.which;
    const charStr = String.fromCharCode(charCode);
    if (charStr === 'm' || charStr === 'M') {
        muteMusic();
    }
};