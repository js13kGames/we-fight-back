/*
We fight back
by Christian Paul

https://chrpaul.de

"We fight back" was developed for the js13kGames 2019 competition.
http://js13kgames.com/

I hope that you'll like my game.
Thank you for playing!

*/

import {
    createTCVS,
    drawText,
} from './text.js';

let blurred = false;
window.onblur = function() {
    //sequence1.gain.gain.value = 0;
    //sequence2.gain.gain.value = 0;
    blurred = true;
}

const a = document.getElementById('a');
const b = document.getElementById('b');

const x = a.getContext('2d');
x.imageSmoothingEnabled = false;

let interval;
let curPos;
let currentString = 'monster';
let remainingStrings = [];

function startString(string) {
    currentString = string;
    curPos = 0;
}

document.onkeypress = function(evt) {
    evt = evt || window.event;
    if (evt.key.toLowerCase() === currentString.substr(curPos, 1).toLowerCase()) {
        curPos++;
    }
    if (evt.key === 'Enter' && curPos === currentString.length) {
        console.log('yes');
        startString(remainingStrings.shift());
    }
};

function initializeGame() {
    remainingStrings = 'monster;hero;shoot;kill;save;family;help;quick;gun;home;protect;earth;child;love;nature;ego;lost;fight;tears;trash;polution;revenge;catastrophe;chaos;last;chance;WE;FIGHT;BACK'.split(';');
    remainingStrings = 'WE FIGHT BACK'.split(';');
    startString(remainingStrings.shift());
}

function startLoop() {
    interval = setInterval(act, 16);
}

function act() {
    x.fillStyle = '#000';
    x.fillRect(0,0,240,160);
    x.fillStyle = '#fff';
    x.fillText(currentString, 100, 100);
    x.fillStyle = '#0f0';
    x.fillText(currentString.substr(0, curPos), 100, 100);
}

function init() {
    initializeGame();
    startLoop();
}

init();
