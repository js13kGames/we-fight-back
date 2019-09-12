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
const SHOUT_MONSTER = 5;
const PLAYING = 2;
const LOST = 1;
const LOST_STATS = 6;
const WON = 0;

let blurred = false;
window.onblur = function() {
    blurred = true;
}

window.onfocus = function() {
    blurred = false;
    window.requestAnimationFrame(draw);
}

import monsterImagePath from '../images/rex_black.png';
import monsterDeadImagePath from '../images/rex_dead.png';
import monsterRunningImagePath from '../images/rex_running.png';
import truckImagePath from '../images/truck.png';

import {
    playMelodyOnce,
    playMonsterShout,
    ZZFX,
} from './audio.js';
import TextTyper from './text-typer.js';
import BulletModule from './bullet-module.js';

const monsterImage = new Image();
monsterImage.src = monsterImagePath;
const monsterDeadImage = new Image();
monsterDeadImage.src = monsterDeadImagePath;
const monsterRunningImage = new Image();
monsterRunningImage.src = monsterRunningImagePath;
const truckImage = new Image();
truckImage.src = truckImagePath;

import {
    levels,
    FONT_HEIGHT,
} from './constants.js';

const a = document.getElementById('fg');

const x = a.getContext('2d');
x.font = `${FONT_HEIGHT}px monospace`;
x.imageSmoothingEnabled = false;

let timeOfLastTick = new Date().getTime();
let timeOfStateStart = timeOfLastTick;

let currentState;
let monsterSoundPlayed;
let showShoutMonster;
const bulletModule = new BulletModule();
let textTyper;
let textTyperMonster;
let goal;
let meters;
let kPH;

let winMeters;
let deadMonsterPosition;
let incorrectCharactersCount;
let showHints;

const maxSpeed = 70;

document.onkeypress = function(evt) {
    evt = evt || window.event;
    const key = evt.key == 'Spacebar' ? ' ' : evt.key; // for some older browsers
    if (key == 1) {
        startLevel(0);
    }
    if (key == 2) {
        startLevel(1);
    }
    if (key == 3) {
        startLevel(2);
    }
    if (key == 4) {
        startLevel(3);
    }
    if (key == 5) {
        playMelodyOnce([7,,12,,7,,12,,7,,12,,7,,12,,9,,14,,9,,14,,9,,14,,9,,14,,7,,14,,9,,12,,14,,7,,7]);
        //playMelodyOnce([22,,20,,22,,20,,22,,20,,22,,20,,25,,23,,25,,23,,25,,23,,25,,23], 'sawtooth');
    }
    if (key == 9) {
        meters+=8;
    }
    if (key == '0') {
        meters-=8;
    }
    if (key == ' ' && [WON, LOST, LOST_STATS].includes(currentState)) {
        changeState(MENU);
    }
    if (key == 'h' && currentState == LOST) {
        changeState(LOST_STATS);
    }
    if (/[a-z\.!? ]/i.test(key)) {
        if (currentState == SHOUT_MONSTER) {
            const correct = textTyperMonster.onKeyPress(key);
            if (correct) {
                playMelodyOnce([5], 'sawtooth');
                showShoutMonster = true;
            } else {
                playMelodyOnce([30]);
            }
        }
        if (currentState == PLAYING) {
            const correct = textTyper.onKeyPress(key);
            if (correct) {
                playMelodyOnce([5], 'sawtooth');
                carFireShot();
            } else {
                playMelodyOnce([30]);
                incorrectCharactersCount++;
            }
        }
    }
};

window.addEventListener('keypress', (event) => {
    if (event.key != 8) return;
    carFireShot();
    //playMelodyOnce([4]);
});

function carFireShot() {
    bulletModule.fire({
        origin: [30, 138],
        target: [20 + 180 * ((goal - meters) / goal) + randomInt(5, 25), 138 + randomInt(-25, 15)],
    });
    //ZZFX(74201);
    //ZZFX(53947);
    //ZZFX(1,.1,1571,.1,0,0,4.7,.2,.8); // ZzFX 1671 (edited)
    //ZZFX(1,.1,810,.1,.02,1.1,4.3,.4,.94); // ZzFX 74201
    ZZFX(1,.1,1454,.1,.02,7.7,3.8,0,.84); // ZzFX 53947
}

function changeState(state) {
    currentState = state;
    timeOfStateStart = new Date().getTime();
    showHints = false;
    console.log(getStateTime());
}

function startLevel(id) {
    changeState(SHOUT_MONSTER);
    const level = levels[id];

    // Reset the progress
    showShoutMonster = false;
    monsterSoundPlayed = false;
    kPH = 0;
    meters = 0;
    goal = level.goal;
    deadMonsterPosition = 0;
    incorrectCharactersCount = 0;

    // Initialize the text module with the level's strings
    textTyperMonster = new TextTyper(level.warning);
    textTyperMonster.start();
    textTyper = new TextTyper(level.strings);
    textTyper.wheelPosition = -2;
}

function startLoop() {
    setInterval(callAct, 16);
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
for (let i = 0; i < 20; i++) {
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

function drawBackground(ctx) {
    ctx.save();
    ctx.translate((meters/2) + -50, 150);
    skyTrain.draw(ctx);
    ctx.restore();

    ctx.fillStyle = '#aaa';
    ctx.save();
    ctx.translate(Math.floor((meters/16) + 30), 150);
    let region = new Path2D();
    region.moveTo(4, 0);
    region.lineTo(1, -112);
    region.lineTo(0, -112);
    region.lineTo(-4, 0);
    region.closePath();
    ctx.fill(region);
    ctx.beginPath();
    ctx.arc(0, -70, 7, 7, 0, 4);
    ctx.fill();
    ctx.beginPath();
    ctx.rect(-3, -86, 6, 10);
    ctx.fill();
    ctx.restore();

    buildings.forEach((building, i) => {
        ctx.save();
        ctx.translate(meters - i * 45, 150);
        drawBuilding(ctx, building);
        ctx.restore();
    });

    // street signs
    for (let i = 0; i < 300; i++) {
        if (i % 8 != 0 && i % 8 != 1) continue;
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

function win() {
    changeState(WON);
    winMeters = goal - meters;
    deadMonsterPosition = 20 + 180 * ((goal - meters) / goal);
}

function lose() {
    changeState(LOST);
}

function getStateTime(currentTime) {
    currentTime = currentTime || new Date().getTime();
    return (currentTime - timeOfStateStart) / 1000;
}

function callAct() {
    const currentTime = new Date().getTime();
    const deltaTime = (currentTime - timeOfLastTick) / 1000;
    const stateTime = getStateTime(currentTime);
    act(deltaTime, stateTime);
    timeOfLastTick = currentTime;
}

function act(deltaTime, stateTime) {
    if (blurred) return;

    if (currentState == SHOUT_MONSTER) {
        if (stateTime > 0.2 && !monsterSoundPlayed) {
            monsterSoundPlayed = true;
            playMonsterShout();
        }
        if (stateTime > 2 && !showShoutMonster) {
            showShoutMonster = true;
        }
        if (textTyperMonster.sequenceDone()) {
            changeState(PLAYING);
            playMonsterShout();
        };
        textTyperMonster.act(deltaTime);
    } else if (currentState == PLAYING) {
        if (textTyper.sequenceDone()) win();
        textTyper.act(deltaTime);

        kPH = Math.min(kPH + 20 * deltaTime, maxSpeed);
        meters += kPH / 3.6 * deltaTime;
        if (meters >= goal) lose();
    } else if (currentState == WON) {
        kPH = Math.max(kPH * .95, 0);
        meters += kPH / 3.6 * deltaTime;
    } else if (currentState == LOST) {
        if (stateTime > 2 && !showHints) {
            showHints = true;
        }
    }
}

function draw() {
    if (blurred) return;
    x.clearRect(0,0,240,160);

    // buildings
    drawBackground(x);

    // player
    x.drawImage(truckImage, 10, 136);

    // monster
    if (currentState == SHOUT_MONSTER) {
        const animationProgress = Math.min(getStateTime() / 2, 1);
        x.drawImage(monsterImage, 240 - 40 * animationProgress, 96);
        if (showShoutMonster) {
            x.fillStyle = '#000';
            x.fillText('Type to warn your city!!!', 50, 50);
            textTyperMonster.draw(x);
        }
    } else if (currentState == PLAYING) {
        if (kPH > 45) {
            const FRAME_WIDTH = 96;
            const img = Math.floor(meters / 2) % 4;
            x.drawImage(monsterRunningImage, img * FRAME_WIDTH, 0, FRAME_WIDTH, 56, 20 + 180 * ((goal - meters) / goal), 96, 96, 56);
        } else {
            x.drawImage(monsterImage, 20 + 180 * ((goal - meters) / goal), 96);
        }
    } else if (currentState == WON) {
        x.drawImage(monsterDeadImage, deadMonsterPosition + (meters - winMeters), 96);
    }

    bulletModule.draw(x);

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
        x.fillText(`Meters to your base: ${winMeters.toFixed(1)}`, 20, 70);
        x.fillText(`Incorrect characters: ${incorrectCharactersCount}`, 20, 90);
    }
    if (currentState == LOST) {
        x.fillStyle = '#000';
        x.fillRect(0, 0, 240, 160);
        x.fillStyle = '#a11';
        x.fillText('The monster reached your base.', 20, 50);
        x.fillText('You saw it kill some friends', 20, 70);
        x.fillText('... suddenly it was eying you.', 20, 90);
        if (showHints) {
            x.fillStyle = '#aaa';
            x.fillText('Press H to reveal your progress', 20, 110);
            x.fillText('Press Space to return', 20, 130);
        }
    }
    if (currentState == LOST_STATS) {
        x.fillStyle = '#000';
        x.fillRect(0, 0, 240, 160);
        x.fillStyle = '#a11';
        x.fillText('There is an end!', 20, 50);
        x.fillText(`Strings left: ${textTyper.stringsLeft()}`, 20, 70);
        x.fillStyle = '#aaa';
        x.fillText('Press Space to return', 20, 130);
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
