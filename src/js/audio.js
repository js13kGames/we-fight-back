function playMelodyOnce(notes, type='square', speed=0.1) {
    let au;
    try {
        au = new AudioContext;
    } catch(e) {
        return;
    }
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
}

let zzfx_x;
//window.AudioContext = undefined;
try {
    zzfx_x=new AudioContext;
} catch(e) {
    console.warn('Web Audio API not supported');
}

// ZzFXmicro - Zuper Zmall Zound Zynth - MIT License - Copyright 2019 Frank Force
const zzfx_v=.5;
const ZZFX=(e,f,a,b=1,d=.1,g=0,h=0,k=0,l=0)=>{if(!zzfx_x)return;let S=44100,P=Math.PI;a*=2*P/S;a*=1+f*(2*Math.random()-1);g*=1E3*P/(S**2);b=0<b?S*(10<b?10:b)|0:1;d*=b|0;k*=2*P/S;l*=P;f=[];for(var m=0,n=0,c=0;c<b;++c)f[c]=e*zzfx_v*Math.cos(m*a*Math.cos(n*k+l))*(c<d?c/d:1-(c-d)/(b-d)),m+=1+h*(2*Math.random()-1),n+=1+h*(2*Math.random()-1),a+=g;e=zzfx_x.createBuffer(1,b,S);a=zzfx_x.createBufferSource();e.getChannelData(0).set(f);a.buffer=e;a.connect(zzfx_x.destination);a.start();return a}


const playMonsterShout = () => (
    ZZFX(4,.1,2000,3,.53,-1,3.9,0,.6) // ZzFX 99184
);

export {
    playMelodyOnce,
    playMonsterShout,
    ZZFX,
};
