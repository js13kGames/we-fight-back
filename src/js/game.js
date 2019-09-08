/*
We fight back
by Christian Paul

https://chrpaul.de

"We fight back" was developed for the js13kGames 2019 competition.
http://js13kgames.com/

I hope that you'll like my game.
Thank you for playing!

*/

// import {
//     createTCVS,
//     drawText,
// } from './text.js';

'use strict';

const MENU = 3;
const PLAYING = 2;
const LOST = 1;
const WON = 0;

let blurred = false;
window.onblur = function() {
    //sequence1.gain.gain.value = 0;
    //sequence2.gain.gain.value = 0;
    blurred = true;
}

window.onfocus = function() {
    //sequence1.gain.gain.value = 0;
    //sequence2.gain.gain.value = 0;
    blurred = false;
    window.requestAnimationFrame(draw);
}

import monsterImagePath from '../images/rex_black.png';
import truckImagePath from '../images/truck.png';

import {playMelodyOnce} from './music.js';
import TextTyper from './text-typer.js';

const monsterImage = new Image();
monsterImage.src = monsterImagePath;
const truckImage = new Image();
truckImage.src = truckImagePath;

import {
    levels,
    FONT_HEIGHT,
} from './constants.js';

function playMusic() {
    // Rainbow Factory
    playMelodyOnce([16,,,16,,16,13,,16,,,16,,13,14,16,17,,,17,,17,17,,20,,,20,,20,18,17], 'sawtooth', .2);
    const au = playMelodyOnce([16,16,16,16,16,16,13,14,16,16,16,16,16,13,14,16,17,17,17,17,17,17,17,18,20,20,20,20,20,20,18,17], 'square', .2);
    au.onstatechange = function() {
        if (au.state === 'closed') {
            playMusic();
        }
        console.log(au.state);
    }
}
// Rainbow Factory flipped
//playMelodyOnce([12,,,12,,12,15,,12,,,12,,15,14,12,11,,,11,,11,11,,8,,,8,,8,10,11].map(v => v !== undefined ? v + 25 : undefined), 'sawtooth', .2);
//playMusic();

const a = document.getElementById('fg');
const b = document.getElementById('bg');

const x = a.getContext('2d');
x.imageSmoothingEnabled = false;

let interval;
let currentState;
let textTyper;
let goal;
let meters;
let kPH;

const maxSpeed = 70;
const shots = [];

document.onkeypress = function(evt) {
    evt = evt || window.event;
    if (evt.key == 1) {
        startLevel(0);
    }
    if (evt.key == 2) {
        startLevel(1);
    }
    if (evt.key == 3) {
        startLevel(2);
    }
    if (evt.key == 4) {
        startLevel(3);
    }
    if (evt.key == 5) {
        playMelodyOnce([7,,12,,7,,12,,7,,12,,7,,12,,9,,14,,9,,14,,9,,14,,9,,14,,7,,14,,9,,12,,14,,7,,7]);
        //playMelodyOnce([22,,20,,22,,20,,22,,20,,22,,20,,25,,23,,25,,23,,25,,23,,25,,23], 'sawtooth');
        console.log('start');
    }
    if (evt.key == 9) {
        meters+=8;
    }
    if (evt.key == '0') {
        meters-=8;
        console.log(meters);
    }
    if (currentState == PLAYING) {
        textTyper.onKeyPress(evt.key);
    }
};

function startLevel(id) {
    currentState = PLAYING;
    const level = levels[id];

    // Reset the progress
    kPH = 0;
    meters = 0;
    goal = level.goal;

    // Initialize the text module with the level's strings
    textTyper = new TextTyper(level.strings);
    textTyper.start();
}

function startLoop() {
    interval = setInterval(act, 16);
    window.requestAnimationFrame(draw);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const createBuilding = () => ({
    width: randomInt(35, 40),
    height: randomInt(70, 100),
});

const buildings = [];
for (var i = 0; i < 20; i++) {
    buildings.push(createBuilding());
}

class SkyTrain {
    constructor() {
        this.train = 0;
    }

    act() {

    }

    draw(ctx) {
        const length = 1000;
        const PILLAR_DISTANCE = 40;
        const PILLAR_HEIGHT = 20;
        ctx.fillStyle = '#ddd';
        ctx.fillRect(0, -PILLAR_HEIGHT - 3, length, 3);
        for (let x = 0; x < length; x += PILLAR_DISTANCE) {
            ctx.fillRect(x, -PILLAR_HEIGHT, 5, PILLAR_HEIGHT);
        }
    }
}

const skyTrain = new SkyTrain();

function drawWorld(ctx) {
    ctx.save();
    ctx.translate((meters/2) + -50, 150);
    skyTrain.draw(ctx);
    ctx.restore();

    buildings.forEach((building, i) => {
        ctx.save();
        ctx.translate(meters - i * 45, 150);
        drawBuilding(ctx, building);
        ctx.restore();
    });

    for (let i = 0; i < 300; i++) {
        ctx.save();
        ctx.translate(meters*8 - i * 25, 150);
        ctx.fillStyle = '#000';
        // pole
        ctx.fillRect(0, -20, 1, 20);
        // sign
        ctx.fillRect(-2, -20, 5, 7);
        ctx.restore();
    }
}

function drawBuilding(ctx, {width, height}) {
    ctx.fillStyle = '#888';
    ctx.fillRect(2, 0, width - 2, -height);
    for (let y = -6; y > -height; y-= 6) {
        ctx.fillRect(0, y, 2, 1);
    }
}

function drawStepRoof() {
    ctx.fillRect(2, 0, width - 2, -height);
    for (let y = -6; y > height; y-= 6) {
        ctx.fillRect(0, y, 2, 1);
    }
}

function fireShot() {
}

function win() {
    currentState = WON;
}

function lose() {
    currentState = LOST;
}

function calcX(floater) {
    const deltaTime = (new Date().getTime() - floater.spawned.getTime()) / 1000;
    const progress = Math.min(deltaTime / 2, 1);
    //const spaceToTravel = x.measureText(floater.string).width;
    return 240 - (progress * 200);
}

function act() {
    if (blurred) return;
    const deltaTime = .016;

    if (currentState == PLAYING) {
        if (textTyper) {
            if (textTyper.sequenceDone()) win();
            textTyper.act(deltaTime);
        }
        kPH = Math.min(kPH + 20 * deltaTime, maxSpeed);
        meters += kPH / 3.6 * deltaTime;
        if (meters >= goal) lose();
    }
}

function draw() {
    if (blurred) return;
    x.clearRect(0,0,240,160);

    // buildings
    drawWorld(x);

    for (let i = 0; i < 100; i++) {
    //    x.fillRect((meters - i * 320 + 1024) / 8, 86, 32, 64);
    }

    x.fillStyle = '#ddd';
    for (let i = 0; i < 500; i++) {
    //    x.fillRect((meters - i * 320 + 1024) / 4, 48, 32, 128);
    }

    //x.translate(Math.random(), Math.random());
    // player
    x.drawImage(truckImage, 10, 136);
    //x.fillStyle = '#080';
    //x.fillRect(10, 120, 48, 32);
    // monster
    x.drawImage(monsterImage, 20 + 180 * ((goal - meters) / goal), 96);
    //x.fillStyle = '#800';
    //x.fillRect(200, 80, 100, 70);

    // Todo: Finish shooting animation
    shots.forEach((shot) => {
        x.fillStyle = '#ff0';
        x.fillRect(10, 120, 48, 32);
    });

    x.fillStyle = '#000';
    x.fillRect(-64, 150, 512, 64);

    if (currentState == PLAYING) {
        textTyper.draw(x);
        x.fillStyle = '#000';
        x.fillText(`${(goal - meters).toFixed(1)} m`, 190, 10);
    }

    if (currentState == WON) {
        x.fillStyle = '#000';
        x.fillText('The city is save... for now.', 20, 50);
        x.fillText('Press 1, 2 or 3 to start a level.', 20, 70);
        x.fillText('Press 4 for the debug level.', 20, 90);
    }
    if (currentState == LOST) {
        x.fillStyle = '#000';
        x.fillText('The monster reached your base.', 20, 50);
        x.fillText('You saw it kill some friends', 20, 70);
        x.fillText('... suddenly it was eying you.', 20, 90);
    }
    if (currentState == MENU) {
        x.fillStyle = '#000';
        x.fillText('Pick your town', 20, 20);
        x.fillText('1  Words', 20, 40);
        x.fillText('2  Word pairs', 20, 60);
        x.fillText('3  Sentences', 20, 80);
        x.fillText('4  Debug', 20, 100);
    }
    window.requestAnimationFrame(draw);
}

function init() {
    currentState = MENU;
    startLoop();
}

init();

x.font = `${FONT_HEIGHT}px monospace`;
