function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

import berlinBorderImagePath from '../images/berlin-border.png';
const berlinBorderImage = new Image();
berlinBorderImage.src = berlinBorderImagePath;

import brandenburgerTorImagePath from '../images/brandenburger-tor.png';
const brandenburgerTorImage = new Image();
brandenburgerTorImage.src = brandenburgerTorImagePath;


function drawTvTower(ctx, meters) {
    ctx.fillStyle = '#aaa';
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
}

const createBuilding = () => ({
    width: randomInt(70, 100),
    height: randomInt(40, 50),
});

function drawBuilding(ctx, {width, height}) {
    ctx.fillStyle = '#888';
    ctx.fillRect(1, 0, width - 2, -height);
    for (let y = -height; y < -7; y+=8) {
        ctx.fillRect(0, y, width, 1);
    }
}

function drawBerlin(ctx, meters) {
    ctx.save();
    ctx.translate(Math.floor((meters/16) - 35), 150);
    drawTvTower(ctx);
    ctx.restore();

    ctx.save();
    ctx.translate(Math.floor((meters/2) - 100), 150);
    ctx.drawImage(brandenburgerTorImage, 0, -brandenburgerTorImage.height);
    ctx.restore();

    buildings.forEach((building, i) => {
        ctx.save();
        ctx.translate(meters - i * 105 + 20, 150);
        drawBuilding(ctx, building);
        ctx.restore();
    });

    // street lamps
    for (let i = 0; i < 400; i++) {
        ctx.save();
        ctx.translate(meters*8 - i * 50, 150);
        ctx.fillStyle = '#000';
        // pole
        ctx.fillRect(0, -19, 1, 20);
        ctx.fillRect(-4, -18, 9, 1);
        // lights
        ctx.fillRect(-4, -20, 2, 3);
        ctx.fillRect(3, -20, 2, 3);
        ctx.restore();
    }

    ctx.save();
    ctx.translate(meters*8 + 65, 150);
    ctx.drawImage(berlinBorderImage, 0, -berlinBorderImage.height*1.5, berlinBorderImage.width*1.5, berlinBorderImage.height*1.5);
    ctx.restore();
}

// init
const buildings = [];
buildings.push({width: 75, height: 20});
for (let i = 0; i < 20; i++) {
    buildings.push(createBuilding());
}

export default drawBerlin;
