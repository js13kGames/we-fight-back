import {
    FONT_HEIGHT,
} from './constants.js';

import {playMelodyOnce} from './music.js';

class TextTyper {
    constructor(stringList) {
        this.strings = stringList.split(';');
        this.floaters = [];
        this.currentPosition = 0;
        this.currentFloater = 0;
        this.wheelPosition = 0;
    }

    onKeyPress(key) {
        if (this.sequenceDone()) return;
        const currentString = this.strings[this.currentFloater];
        const expected = currentString.substr(this.currentPosition, 1).toLowerCase();
        if (key.toLowerCase() == expected) {
            this.currentPosition++;
            if (this.wordDone()) {
                playMelodyOnce([,9,8,6]);
                if (!this.sequenceDone()) {
                    this.currentFloater++;
                    this.currentPosition = 0;
                }
            }
            return true;
        } else {
            return false;
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
            const x = 10;
            const y = 15 * (i - this.wheelPosition) + 20;
            if (i === this.currentFloater) {
                ctx.fillStyle = '#000';
                const margin = 5;
                ctx.fillRect(x - margin, y - margin, ctx.measureText(string).width + 2 * margin, FONT_HEIGHT + 2 * margin);
                ctx.fillStyle = '#fff';
            } else {
                const distance = Math.abs(this.wheelPosition - i);
                const transparency = 1 - (Math.min(distance/3, 1));
                ctx.fillStyle = `rgba(0,0,0,${transparency})`;
            }
            ctx.fillText(string, x, y + FONT_HEIGHT);
            if (i === this.currentFloater) {
                ctx.fillStyle = '#0f0';
                ctx.fillText(string.substr(0, this.currentPosition), x, y + FONT_HEIGHT);
            }
        }
    }
}

export default TextTyper;
