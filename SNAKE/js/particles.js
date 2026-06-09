/*
=========================================
PARTICLE SYSTEM
Snake RPG
=========================================
*/

class Particle {

    constructor(x, y, color, velocity = {}) {

        this.x = x;
        this.y = y;

        this.vx = velocity.vx || (Math.random() - 0.5) * 4;
        this.vy = velocity.vy || (Math.random() - 0.5) * 4;

        this.life = 60;
        this.maxLife = 60;

        this.size = Math.random() * 3 + 2;

        this.color = color;
    }

    update() {

        this.x += this.vx;
        this.y += this.vy;

        this.vx *= 0.96;
        this.vy *= 0.96;

        this.life--;
    }

    draw(ctx) {

        const alpha = this.life / this.maxLife;

        ctx.save();

        ctx.globalAlpha = alpha;

        ctx.fillStyle = this.color;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    }
}

/*
=========================================
PARTICLE MANAGER
=========================================
*/

const particles = [];

/*
=========================================
SPAWN PARTICLES
=========================================
*/

function spawnParticles(x, y, color, count = 10) {

    for (let i = 0; i < count; i++) {

        particles.push(
            new Particle(x, y, color)
        );
    }
}

/*
=========================================
UPDATE
=========================================
*/

function updateParticles() {

    for (let i = particles.length - 1; i >= 0; i--) {

        const p = particles[i];

        p.update();

        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

/*
=========================================
RENDER
=========================================
*/

function drawParticles(ctx) {

    for (const p of particles) {
        p.draw(ctx);
    }
}

/*
=========================================
EFFECT HELPERS
=========================================
*/

function foodBurst(x, y) {

    spawnParticles(x, y, "#4ade80", 15);
}

function damageBurst(x, y) {

    spawnParticles(x, y, "#ef4444", 12);
}

function levelUpBurst(x, y) {

    spawnParticles(x, y, "#facc15", 25);
}