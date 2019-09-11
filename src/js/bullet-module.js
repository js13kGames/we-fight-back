export default class BulletModule {
    constructor() {
        this.shots = [];
        this.particles = [];
    }

    fire({origin, target}) {
        this.shots.push({origin, target});
    }

    draw(ctx) {
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#aa0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        this.shots.forEach((shot) => {
            ctx.moveTo(shot.origin[0], shot.origin[1]);
            ctx.lineTo(shot.target[0], shot.target[1]);
            ctx.fillRect(shot.origin[0], shot.origin[0]-1, 5, 3);
        });
        ctx.stroke();
        this.shots = [];
        this.particles.forEach((particle) => {
            ctx.fillStyle = '#ff0';
            const { pos } = particle;
            ctx.fillRect(pos[0], pos[1], 3, 3);
        });
    }
}
