/*
=========================================
GAME CORE LOOP
Snake RPG
=========================================
*/

/*
IMPORTANT GLOBALS FROM OTHER FILES:
- saveData (save.js)
- player (player.js)
- snake system (snake.js)
- particles
- UI system
*/

const FPS = 10; // base speed (will scale with upgrades)

let lastTime = 0;
let accumulator = 0;
let stepRate = 1000 / FPS;

/*
=========================================
DIFFICULTY SCALING
=========================================
*/

function getGameSpeed() {

    const speedLevel = saveData.player.upgrades.speed || 0;

    return Math.max(60, stepRate - (speedLevel * 8));
}

/*
=========================================
GAME LOOP
=========================================
*/

function gameLoop(timestamp) {

    if (!lastTime) lastTime = timestamp;

    const delta = timestamp - lastTime;

    lastTime = timestamp;

    if (!GameState.started || GameState.paused) {

        requestAnimationFrame(gameLoop);
        return;
    }

    accumulator += delta;

    const speed = getGameSpeed();

    while (accumulator >= speed) {

        update();
        accumulator -= speed;
    }

    render();

    requestAnimationFrame(gameLoop);
}

/*
=========================================
UPDATE
=========================================
*/

function update() {

    updateSnake();
    updateParticles();

    checkAchievements();
}

/*
=========================================
RENDER
=========================================
*/

function render() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    renderSnake();

    drawParticles(ctx);
}

/*
=========================================
INPUT (keyboard)
=========================================
*/

document.addEventListener("keydown", (e) => {

    if (e.code === "Space") {

        e.preventDefault();

        // start game first time
        if (!GameState.started) {
            GameState.started = true;

            document.getElementById("startScreen")
                .style.display = "none";

            return;
        }

        // otherwise toggle pause
        UI.togglePause();
        return;
    }

    if (!GameState.started || GameState.paused) return;

    switch (e.key) {

        case "ArrowUp":
            setDirection(0, -1);
            break;

        case "ArrowDown":
            setDirection(0, 1);
            break;

        case "ArrowLeft":
            setDirection(-1, 0);
            break;

        case "ArrowRight":
            setDirection(1, 0);
            break;
    }
});

/*
=========================================
START GAME
=========================================
*/

function initGame() {

    spawnFood();
    updateUI();
    renderAchievements();

    document.getElementById("startScreen")
        .style.display = "flex";

    requestAnimationFrame(gameLoop);
}

/*
=========================================
PAUSE CONTROL HOOK
=========================================
*/

window.togglePause = function () {

    window.paused = !window.paused;

    const menu =
        document.getElementById("pauseMenu");

    if (menu) {
        menu.classList.toggle("hidden");
    }
};

/*
=========================================
INIT
=========================================
*/

initGame();