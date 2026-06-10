/*
=========================================
SNAKE CORE SYSTEM
Snake RPG
=========================================
*/

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRID_SIZE = 25;
const TILE = canvas.width / GRID_SIZE;

/*
=========================================
SNAKE STATE
=========================================
*/

let snake = [
    { x: 12, y: 12 }
];

let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };

let food = null;

/*
=========================================
INIT FOOD
=========================================
*/

function spawnFood() {

    let pos;

    do {
        pos = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };

    } while (isOnSnake(pos));

    food = {
        x: pos.x,
        y: pos.y,
        type: Math.random() < 0.1 ? "rare" : "normal"
    };
}

/*
=========================================
CHECK COLLISION
=========================================
*/

function isOnSnake(pos) {

    return snake.some(s =>
        s.x === pos.x &&
        s.y === pos.y
    );
}

/*
=========================================
MOVE SNAKE
=========================================
*/

function moveSnake() {

    direction = nextDirection;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // wall collision
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= GRID_SIZE ||
        head.y >= GRID_SIZE
    ) {
        triggerDeathPause();
	damagePlayer(1);
        return;
    }

    // self collision
    if (isOnSnake(head)) {
        triggerDeathPause();
	damagePlayer(1);
        return;
    }

    snake.unshift(head);

    if (food && head.x === food.x && head.y === food.y) {

        const baseXP = food.type === "rare" ? 30 : 10;
        const baseScore = food.type === "rare" ? 25 : 10;

        foodBurst(
            food.x * TILE,
            food.y * TILE
        );

        addXP(baseXP);
        addScore(baseScore);

        if (food.type === "rare") {
            unlockAchievement("first_food");
        }

        spawnFood();

    } else {
        snake.pop();
    }
}

/*
=========================================
RESET SNAKE
=========================================
*/

function resetSnake() {

    snake = [{ x: 12, y: 12 }];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };

    spawnFood();
}

/*
=========================================
DRAW
=========================================
*/

function drawSnake() {

    snake.forEach((seg, i) => {

        ctx.fillStyle =
            i === 0 ? "#4ade80" : "#22c55e";

        ctx.fillRect(
            seg.x * TILE,
            seg.y * TILE,
            TILE - 1,
            TILE - 1
        );
    });
}

/*
=========================================
DRAW FOOD
=========================================
*/

function drawFood() {

    if (!food) return;

    ctx.fillStyle =
        food.type === "rare" ? "#facc15" : "#ef4444";

    ctx.beginPath();

    ctx.arc(
        food.x * TILE + TILE / 2,
        food.y * TILE + TILE / 2,
        TILE / 2.5,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

/*
=========================================
UPDATE LOOP HOOK
=========================================
*/

function updateSnake() {
    moveSnake();
}

/*
=========================================
RENDER LOOP HOOK
=========================================
*/

function renderSnake() {

    drawSnake();
    drawFood();
}