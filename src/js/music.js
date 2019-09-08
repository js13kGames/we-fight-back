function playMelodyOnce(notes, type='square', speed=0.1) {
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
    setTimeout(() => {
        au.close();
    }, (notes.length) * speed* 1000);
    return au;
}

export {playMelodyOnce};
