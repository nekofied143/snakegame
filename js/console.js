// AUTO-SNAKE GOD MODE

window.autoSnake = setInterval(() => {

    if (!food || !snake || !snake.length) return;

    const head = snake[0];

    const dx = food.x - head.x;
    const dy = food.y - head.y;

    // Prefer horizontal movement first
    if (Math.abs(dx) > Math.abs(dy)) {

        if (dx > 0 && direction.x !== -1)
            nextDirection = { x: 1, y: 0 };

        else if (dx < 0 && direction.x !== 1)
            nextDirection = { x: -1, y: 0 };

        else if (dy > 0 && direction.y !== -1)
            nextDirection = { x: 0, y: 1 };

        else if (dy < 0 && direction.y !== 1)
            nextDirection = { x: 0, y: -1 };

    } else {

        if (dy > 0 && direction.y !== -1)
            nextDirection = { x: 0, y: 1 };

        else if (dy < 0 && direction.y !== 1)
            nextDirection = { x: 0, y: -1 };

        else if (dx > 0 && direction.x !== -1)
            nextDirection = { x: 1, y: 0 };

        else if (dx < 0 && direction.x !== 1)
            nextDirection = { x: -1, y: 0 };
    }

    // Emergency wall avoidance
    const headX = snake[0].x;
    const headY = snake[0].y;

    if (headX <= 0 && direction.x < 0)
        nextDirection = { x: 0, y: 1 };

    if (headX >= GRID_SIZE - 1 && direction.x > 0)
        nextDirection = { x: 0, y: 1 };

    if (headY <= 0 && direction.y < 0)
        nextDirection = { x: 1, y: 0 };

    if (headY >= GRID_SIZE - 1 && direction.y > 0)
        nextDirection = { x: 1, y: 0 };

}, 10);

console.log("Auto-food God Mode enabled");
