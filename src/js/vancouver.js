function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

import vancouverBorderImagePath from 'url:../images/vancouver-border.png';
const vancouverBorderImage = new Image();
vancouverBorderImage.src = vancouverBorderImagePath;

import habourCentreImagePath from 'url:../images/habour-centre.png';
const habourCentreImage = new Image();
habourCentreImage.src = habourCentreImagePath;

const PILLAR_DISTANCE = 40;
const PILLAR_HEIGHT = 20;

class SkyTrain {
    draw(ctx) {
        const length = 1000;
        ctx.fillStyle = '#ddd';
        ctx.fillRect(0, -PILLAR_HEIGHT - 3, length, 3);
        for (let x = 0; x < length; x += PILLAR_DISTANCE) {
            ctx.fillRect(x, -PILLAR_HEIGHT, 5, PILLAR_HEIGHT);
        }
    }
}

const createBuilding = () => ({
    width: randomInt(35, 40),
    height: randomInt(70, 100),
});

function drawBuilding(ctx, {width, height}) {
    ctx.fillStyle = '#888';
    ctx.fillRect(2, 0, width - 2, -height);
    for (let y = -6; y > -height; y-= 6) {
        ctx.fillRect(0, y, 2, 1);
    }
}

// Unused building
// function drawStepRoof() {
//     ctx.fillRect(2, 0, width - 2, -height);
//     for (let y = -6; y > height; y-= 6) {
//         ctx.fillRect(0, y, 2, 1);
//     }
// }

function drawVancouver(ctx, meters) {
    ctx.save();
    ctx.translate((meters/2) + -300, 150);
    skyTrain.draw(ctx);
    ctx.restore();

    ctx.save();
    ctx.translate(Math.floor((meters/4) - 200), 150);
    ctx.drawImage(habourCentreImage, 0, -habourCentreImage.height);
    ctx.restore();

    buildings.forEach((building, i) => {
        ctx.save();
        ctx.translate(meters - i * 45 + 100, 150);
        drawBuilding(ctx, building);
        ctx.restore();
    });

    // street signs
    for (let i = 0; i < 800; i++) {
        if (i % 8 != 1 && i % 8 != 2) continue;
        ctx.save();
        ctx.translate(meters*8 - i * 25, 150);
        ctx.fillStyle = '#000';
        // pole
        ctx.fillRect(0, -20, 1, 20);
        // sign
        ctx.fillRect(-2, -20, 5, 7);
        ctx.restore();
    }

    ctx.save();
    ctx.translate(meters*8 + 60, 150);
    ctx.drawImage(vancouverBorderImage, 0, -vancouverBorderImage.height*1.5, vancouverBorderImage.width*1.5, vancouverBorderImage.height*1.5);
    ctx.restore();
}

// init
const skyTrain = new SkyTrain();
const buildings = [];
buildings.push({width: 35, height: 40});
buildings.push({width: 35, height: 45});
buildings.push({width: 35, height: 40});
for (let i = 0; i < 50; i++) {
    buildings.push(createBuilding());
}

export default drawVancouver;
