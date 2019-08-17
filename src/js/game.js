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

const PLAYING = 2;
const LOST = 1;
const WON = 0;

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
    {
        strings: 'Test',
    },
];

class TextTyper {
    constructor(stringList) {
        this.remainingStrings = stringList.split(';');
        this.floaters = [];
        this.currentPosition = 0;
        this.currentFloater;
    }

    onKeyPress(key) {
        const expected = this.currentFloater.string.substr(this.currentPosition, 1).toLowerCase();
        console.log(expected, key);
        if (key.toLowerCase() == expected) {
            this.currentPosition++;
            if (this.wordDone()) {
                this.floaters.shift();
                this.spawnFloater();
                if (this.sequenceDone()) {
                    win();
                } else {
                    this.startFloater(this.floaters[0]);
                }
            }
        }
    }

    spawnFloater() {
        if (this.floaters.length > 5) return;
        if (this.remainingStrings.length == 0) return;
        this.floaters.push({
            spawned: new Date(),
            string: this.remainingStrings.shift(),
        });
    }

    startFloater(floater) {
        this.currentFloater = floater;
        this.currentPosition = 0;
    }


    wordDone() {
        return this.currentPosition == this.currentFloater.string.length;
    }

    sequenceDone() {
        return (this.remainingStrings == 0) && (this.floaters.length == 0);
    }

    draw(ctx) {
        this.floaters.forEach((floater, i) => {
            ctx.fillStyle = '#fff';
            ctx.fillText(floater.string, calcX(floater), 15 * i + 20);
            if (floater === this.currentFloater) {
                ctx.fillStyle = '#0f0';
                ctx.fillText(floater.string.substr(0, this.currentPosition), calcX(floater), 15 * i + 20);
            }
        });
    }
}

const a = document.getElementById('fg');
const b = document.getElementById('bg');

const x = a.getContext('2d');
x.imageSmoothingEnabled = false;

let interval;
let currentState;
let textTyper;

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
        textTyper.spawnFloater();
    }
    textTyper.onKeyPress(evt.key);
};

function startLevel(id) {
    currentState = PLAYING;
    textTyper = new TextTyper(levels[id].strings);
    textTyper.spawnFloater();
    textTyper.startFloater(textTyper.floaters[0]);
}

function startLoop() {
    interval = setInterval(act, 16);
}

function win() {
    currentState = WON;
}

function calcX(floater) {
    const deltaTime = (new Date().getTime() - floater.spawned.getTime()) / 1000;
    const progress = Math.min(deltaTime / 2, 1);
    //const spaceToTravel = x.measureText(floater.string).width;
    return 240 - (progress * 200);
}

function act() {
    x.clearRect(0,0,240,160);
    if (currentState == PLAYING) {
        textTyper.draw(x);
    }
    //x.translate(Math.random(), Math.random());
    // player
    x.fillStyle = '#060';
    x.fillRect(10, 120, 32, 32);
    // monster
    x.fillStyle = '#600';
    x.fillRect(200, 80, 100, 70);
    if (currentState == WON) {
        x.fillStyle = '#ff0';
        x.fillText('The city is save... for now.', 20, 50);
        x.fillText('Press 1, 2 or 3 to start a level.', 20, 70);
        x.fillText('Press 4 for the debug level.', 20, 90);
    }
}

function init() {
    startLevel(0);
    startLoop();
}

init();

x.font = '10px monospace';
