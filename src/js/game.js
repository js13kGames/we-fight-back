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

const FONT_HEIGHT = 10;

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

const levels = [
    {
        strings: 'monster;hero;shoot;kill;save;family;help;quick;gun;home;protect;earth;child;love;nature;ego;lost;fight;tears;trash;pollution;revenge;catastrophe;chaos;last;chance;WE;FIGHT;BACK',
    },
    {
        strings: 'incoming monster;fighting heroes;final frontier;combined efforts;total apocalypse;giant creatures;no questions;find vulnerability;not ready;need ammo;breached barrier;hurt monstrosity;damaged planet;seeks revenge;endless fight;everlasting battle;lost friends;forgotten tears;but whatever comes;we fight back',
    },
    {
        strings: 'We are the heroes.;We fight off monsters.;The city is protected by us.;Our scientists extracted their genes;and found dangerous mutations;They are wild creatures.;The industrial trash caused;modifications to life forms;on earth.;They will kill us all.;Watch your back.;Can you image the destruction;that follows each attack?;Human society was harvesting;resources beyond what mother;earth could provide.;The unbalanced ecosystem became;uncontrollable for surviving;tribes.;Cleaning up the mistakes;of former generations is;certainly impossible;at this point.;But whatever happens,;we fight back!'
    },
    {
        strings: 'Test',
    },
];

function play(notes, type='square', speed=0.1) {
    const au = new AudioContext();
    const G = au.createGain();
    for(let i in notes) {
        const o = au.createOscillator();
        o.type=type;
        if(notes[i]) {
            o.connect(G);
            G.connect(au.destination);
            o.start(i*speed);
            o.frequency.setValueAtTime(440*1.06**(13-notes[i]),i*speed);
            G.gain.setValueAtTime(1,i*speed);
            G.gain.setTargetAtTime(.0001,i*speed+(speed-.02),.005);
            o.stop(i*speed+(speed-.01));
        }
    }
    return au;
}

play([12,,,12,,12,15,,12,,,12,,15,14,12,11,,,11,,11,11,,8,,,8,,8,10,11].map(v => v !== undefined ? v + 25 : undefined), 'sawtooth', .2);

class TextTyper {
    constructor(stringList) {
        this.strings = stringList.split(';');
        this.floaters = [];
        this.currentPosition = 0;
        this.currentFloater = 0;
        this.wheelPosition = 0;
    }

    onKeyPress(key) {
        const currentString = this.strings[this.currentFloater];
        const expected = currentString.substr(this.currentPosition, 1).toLowerCase();
        if (key.toLowerCase() == expected) {
            this.currentPosition++;
            if (this.wordDone()) {
                play([5,9,8,6]);
                if (this.sequenceDone()) {
                    win();
                } else {
                    this.currentFloater++;
                    this.currentPosition = 0;
                }
            } else {
                play([5], 'sawtooth');//Math.random() >= 0.5 ? [5] : [4], 'sawtooth');
            }
        } else {
            play([30]);
        }
    }

    _startFloater(floater) {
        this.currentFloater = floater;
        this.currentPosition = 0;
    }

    wordDone() {
        return this.currentPosition == this.strings[this.currentFloater].length;
    }

    sequenceDone() {
        return this.currentFloater == this.strings.length -1 && this.wordDone();
    }

    start() {
        this.wheelPosition = 0;
    }

    act(delta) {
        if (this.wheelPosition < this.currentFloater) {
            this.wheelPosition = Math.min(this.wheelPosition + 2*delta, this.currentFloater);
        }
    }

    draw(ctx) {
        for (let i = Math.floor(this.wheelPosition - 2); i < Math.floor(this.wheelPosition + 4); i++) {
            if (i < 0 || i >= this.strings.length) continue;
            const string = this.strings[i];
            console.log(this.wheelPosition);
            const x = 10;
            const y = 15 * (i - this.wheelPosition) + 20;
            if (i === this.currentFloater) {
                ctx.fillStyle = '#000';
                const margin = 5;
                ctx.fillRect(x - margin, y - margin, ctx.measureText(string).width + 2 * margin, FONT_HEIGHT + 2 * margin);
                ctx.fillStyle = '#fff';
            } else {
                ctx.fillStyle = '#000';
            }
            ctx.fillText(string, x, y + FONT_HEIGHT);
            if (i === this.currentFloater) {
                ctx.fillStyle = '#0f0';
                ctx.fillText(string.substr(0, this.currentPosition), x, y + FONT_HEIGHT);
            }
        }
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
        play([7,,12,,7,,12,,7,,12,,7,,12,,9,,14,,9,,14,,9,,14,,9,,14,,7,,14,,9,,12,,14,,7,,7]);
        //play([22,,20,,22,,20,,22,,20,,22,,20,,25,,23,,25,,23,,25,,23,,25,,23], 'sawtooth');
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
    textTyper = new TextTyper(levels[id].strings);
    textTyper.start();
}

function startLoop() {
    interval = setInterval(act, 16);
    window.requestAnimationFrame(draw);
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

let meters = 0;

function act() {
    meters++;
    if (textTyper) textTyper.act(0.016);
}

function draw() {
    x.clearRect(0,0,240,160);

    // buildings
    x.fillStyle = '#eee';
    for (var i = 0; i < 100; i++) {
        x.fillRect((meters - i * 320 + 1024) / 8, 86, 32, 64);
    }

    x.fillStyle = '#ddd';
    for (var i = 0; i < 500; i++) {
        x.fillRect((meters - i * 320 + 1024) / 4, 48, 32, 128);
    }

    //x.translate(Math.random(), Math.random());
    // player
    x.fillStyle = '#080';
    x.fillRect(10, 120, 48, 32);
    // monster
    x.fillStyle = '#800';
    x.fillRect(200, 80, 100, 70);

    x.fillStyle = '#000';
    x.fillRect(-64, 150, 512, 64);

    if (currentState == PLAYING) {
        textTyper.draw(x);
    }

    if (currentState == WON) {
        x.fillStyle = '#000';
        x.fillText('The city is save... for now.', 20, 50);
        x.fillText('Press 1, 2 or 3 to start a level.', 20, 70);
        x.fillText('Press 4 for the debug level.', 20, 90);
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
