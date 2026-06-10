/*
=========================================
UI SYSTEM
Snake RPG
Handles:
- Menus
- Popups
- Effects
- Screen shake
=========================================
*/

window.UI = {
    togglePause
};

window.GameState = {
    started: false,
    paused: false,
    dead: false
};

/*
=========================================
ELEMENTS
=========================================
*/

const pauseMenu = document.getElementById("pauseMenu");
const upgradeMenu = document.getElementById("upgradeMenu");
const achievementMenu = document.getElementById("achievementMenu");

const achievementPopup = document.getElementById("achievementPopup");
const levelUpPopup = document.getElementById("levelUpPopup");

/*
=========================================
TOGGLE MODALS
=========================================
*/

function toggleMenu(menu, show) {

    if (!menu) return;

    if (show) {
        menu.classList.remove("hidden");
    } else {
        menu.classList.add("hidden");
    }
}

/*
=========================================
PAUSE SYSTEM
=========================================
*/

function togglePause() {

    GameState.paused = !GameState.paused;

    pauseMenu.classList.toggle("hidden", !GameState.paused);

    document.getElementById("gameCanvas")
        .classList.toggle("paused-overlay", GameState.paused);
}

/*
=========================================
BUTTON EVENTS
=========================================
*/

document.getElementById("pauseBtn")
    .addEventListener("click", togglePause);

document.getElementById("resumeBtn")
    .addEventListener("click", togglePause);

document.getElementById("upgradesBtn")
    .addEventListener("click", () => {

        GameState.paused = true;

        upgradeMenu.classList.remove("hidden");
    });

document.querySelectorAll(".close-btn")
    .forEach(btn => {
        btn.addEventListener("click", () => {

            upgradeMenu.classList.add("hidden");
            achievementMenu.classList.add("hidden");

            GameState.paused = false;
        });
    });

document.getElementById("achievementsBtn")
    .addEventListener("click", () => {

        GameState.paused = true;

        achievementMenu.classList.remove("hidden");
    });

document.getElementById("startBtn").addEventListener("click", () => {

    GameState.started = true;

    document.getElementById("startScreen")
        .style.display = "none";
});

document.getElementById("resetBtn")
    .addEventListener("click", () => {
        resetSave();
    });

document.getElementById("saveBtn")
    .addEventListener("click", () => {
        saveGame();
    });

/*
=========================================
POPUPS
=========================================
*/

function showPopup(el) {

    if (!el) return;

    el.classList.add("show");

    setTimeout(() => {
        el.classList.remove("show");
    }, 2000);
}

UI.showLevelUp = function () {

    levelUpPopup.textContent = "LEVEL UP!";

    showPopup(levelUpPopup);

    levelUpBurst(
        canvas.width / 2,
        canvas.height / 2
    );
};

UI.gameOver = function () {

    alert("Game Over!");
};

UI.damageFlash = function () {

    document.body.classList.add("shake");

    setTimeout(() => {
        document.body.classList.remove("shake");
    }, 300);

    damageBurst(
        snake[0].x * TILE,
        snake[0].y * TILE
    );
};

UI.xpFlash = function () {

    const bar = document.getElementById("xpFill");

    if (!bar) return;

    bar.classList.add("xp-flash");

    setTimeout(() => {
        bar.classList.remove("xp-flash");
    }, 300);
};

UI.shake = function () {

    document.body.classList.add("shake");

    setTimeout(() => {
        document.body.classList.remove("shake");
    }, 300);
};

function triggerDeathPause() {

    GameState.dead = true;
    GameState.paused = true;

    // show quick feedback
    const popup = document.getElementById("levelUpPopup");
    popup.textContent = "YOU DIED";
    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, 1200);

    // respawn after delay
    setTimeout(() => {

        resetSnake(); // from snake.js

        GameState.dead = false;
        GameState.paused = false;

        // hard reset direction safety
        direction = { x: 1, y: 0 };
        nextDirection = { x: 1, y: 0 };

    }, 1800);
}

/*
=========================================
MOBILE CONTROLS
=========================================
*/

function setDirection(x, y) {

    if (!GameState.started || GameState.paused || GameState.dead) return;

    // prevent reverse
    if (x === -direction.x && y === -direction.y) return;

    nextDirection = { x, y };
}

document.getElementById("up").onclick = () => setDirection(0, -1);
document.getElementById("down").onclick = () => setDirection(0, 1);
document.getElementById("left").onclick = () => setDirection(-1, 0);
document.getElementById("right").onclick = () => setDirection(1, 0);