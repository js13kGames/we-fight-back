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

// ZzFXmicro - Zuper Zmall Zound Zynth - MIT License - Copyright 2019 Frank Force
const zzfx_v=.5;
const zzfx_x=new AudioContext;
const ZZFX=(e,f,a,b=1,d=.1,g=0,h=0,k=0,l=0)=>{let S=44100,P=Math.PI;a*=2*P/S;a*=1+f*(2*Math.random()-1);g*=1E3*P/(S**2);b=0<b?S*(10<b?10:b)|0:1;d*=b|0;k*=2*P/S;l*=P;f=[];for(var m=0,n=0,c=0;c<b;++c)f[c]=e*zzfx_v*Math.cos(m*a*Math.cos(n*k+l))*(c<d?c/d:1-(c-d)/(b-d)),m+=1+h*(2*Math.random()-1),n+=1+h*(2*Math.random()-1),a+=g;e=zzfx_x.createBuffer(1,b,S);a=zzfx_x.createBufferSource();e.getChannelData(0).set(f);a.buffer=e;a.connect(zzfx_x.destination);a.start();return a}


const MENU = 3;
const SHOUT_MONSTER = 5;
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
import monsterRunningImagePath from '../images/rex_running_v1.png';
import truckImagePath from '../images/truck.png';

import {playMelodyOnce} from './music.js';
import TextTyper from './text-typer.js';
import BulletModule from './bullet-module.js';

const monsterImage = new Image();
monsterImage.src = monsterImagePath;
const monsterRunningImage = new Image();
monsterRunningImage.src = monsterRunningImagePath;
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

let timeOfLastTick = new Date().getTime();
let timeOfStateStart = timeOfLastTick;

let interval;
let currentState;
let monsterSoundPlayed;
let showShoutMonster;
let showSpaceHint;
let shootingSince;
const bulletModule = new BulletModule();
let textTyper;
let textTyperMonster;
let goal;
let meters;
let kPH;

const maxSpeed = 70;
let shots = [];
let particles = [];

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
    }
    if (evt.key == 9) {
        meters+=8;
    }
    if (evt.key == '0') {
        meters-=8;
    }
    if (/[a-z\.!? ]/i.test(evt.key)) {
        if (currentState == SHOUT_MONSTER) {
            const correct = textTyperMonster.onKeyPress(evt.key);
            if (correct) {
                playMelodyOnce([5], 'sawtooth');
            } else {
                playMelodyOnce([30]);
            }
        }
        if (currentState == PLAYING) {
            const correct = textTyper.onKeyPress(evt.key);
            if (correct) {
                playMelodyOnce([5], 'sawtooth');
                carFireShot();
            } else {
                playMelodyOnce([30]);
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
}

function startLevel(id) {
    changeState(SHOUT_MONSTER);
    const level = levels[id];

    // Reset the progress
    showShoutMonster = false;
    showSpaceHint = false;
    monsterSoundPlayed = false;
    kPH = 0;
    meters = 0;
    goal = level.goal;

    // Initialize the text module with the level's strings
    textTyperMonster = new TextTyper(level.warning);
    textTyperMonster.start();
    textTyper = new TextTyper(level.strings);
    textTyper.start();
}

function startLoop() {
    interval = setInterval(callAct, 16);
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

function win() {
    changeState(WON);
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
            ZZFX(4,.1,2000,3,.53,-1,3.9,0,.6); // ZzFX 99184
            monsterSoundPlayed = true;
        }
        if (stateTime > 2 && !showShoutMonster) {
            showShoutMonster = true;
        }
        if (textTyperMonster.sequenceDone()) {
            changeState(PLAYING);
            ZZFX(4,.1,2000,3,.53,-1,3.9,0,.6); // ZzFX 99184
        };
        textTyperMonster.act(deltaTime);
    }

    if (currentState == PLAYING) {
        if (textTyper.sequenceDone()) win();
        textTyper.act(deltaTime);
    }
    if (currentState == PLAYING) {
        kPH = Math.min(kPH + 20 * deltaTime, maxSpeed);
        meters += kPH / 3.6 * deltaTime;
        if (meters >= goal) lose();
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
    }
    if (currentState == PLAYING) {
        if (kPH > 45) {
            const FRAME_WIDTH = 96;
            const img = Math.floor(meters / 2) % 4;
            x.drawImage(monsterRunningImage, img * FRAME_WIDTH, 0, FRAME_WIDTH, 56, 20 + 180 * ((goal - meters) / goal), 96, 96, 56);
        } else {
            x.drawImage(monsterImage, 20 + 180 * ((goal - meters) / goal), 96);
        }
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
