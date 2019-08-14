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

let blurred = false;
window.onblur = function() {
    //sequence1.gain.gain.value = 0;
    //sequence2.gain.gain.value = 0;
    blurred = true;
}

const levels = [
    {
        strings: 'monster;hero;shoot;kill;save;family;help;quick;gun;home;protect;earth;child;love;nature;ego;lost;fight;tears;trash;pollution;revenge;catastrophe;chaos;last;chance;WE;FIGHT;BACK',
    },
    {
        strings: 'incoming monster;fighting heroes;final frontier;combined efforts;total apocalypse;giant creatures;no questions;find vulnerability;not ready;need ammo;breached barrier;hurt monstrosity;damaged planet;seeks revenge;endless fight;everlasting battle;lost friends;forgotten tears;but whatever comes;we fight back',
    },
    {
        strings: 'We are the heroes.;We fight off monsters.;The city is protected by us.;Our scientists extracted dangerous gene mutations from wild creatures.;The industrial trash caused modifications to life forms on earth.;They will kill us all.;Watch your back.;Can you image the destruction that follows each attack?;Human society was harvesting resources beyond what mother earth could provide.;The unbalanced ecosystem became uncontrollable for surviving tribes.;Cleaning up the mistakes of former generations is certainly impossible at this point.But whatever happens,;we fight back!'
    },
];

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
        startString(remainingStrings.shift());
    }
    if (evt.key == 1) {
        startLevel(0);
    }
    if (evt.key == 2) {
        startLevel(1);
    }
    if (evt.key == 3) {
        startLevel(2);
    }
};

function startLevel(id) {
    remainingStrings = levels[id].strings.split(';');
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
    startLevel(0);
    startLoop();
}

init();
