window.GOD_AI = setInterval(() => {

    if (!GameState.started || GameState.paused || !food) return;

    const head = snake[0];

    const options = [];

    // safe direction helper
    function canGo(dir) {
        return !(dir.x === -direction.x && dir.y === -direction.y);
    }

    // evaluate 4 directions
    const dirs = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
    ];

    for (const d of dirs) {
        if (!canGo(d)) continue;

        const nx = head.x + d.x;
        const ny = head.y + d.y;

        // wall safety check
        if (nx < 0 || ny < 0 || nx >= GRID_SIZE || ny >= GRID_SIZE) continue;

        // self collision check
        if (snake.some(s => s.x === nx && s.y === ny)) continue;

        const dist =
            Math.abs(food.x - nx) + Math.abs(food.y - ny);

        options.push({ d, dist });
    }

    if (options.length) {
        options.sort((a, b) => a.dist - b.dist);
        setDirection(options[0].d.x, options[0].d.y);
    }

}, 80);

console.log("Safer GOD AI enabled");
