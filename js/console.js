window.GOD_AI = setInterval(() => {

    if (!GameState.started || GameState.paused || !food) return;

    const start = snake[0];
    const target = food;

    const dirs = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
    ];

    function key(p) {
        return p.x + "," + p.y;
    }

    function isSafe(x, y) {

        if (x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE)
            return false;

        return !snake.some(s => s.x === x && s.y === y);
    }

    // BFS to food
    const queue = [[start]];
    const visited = new Set();
    visited.add(key(start));

    let path = null;

    while (queue.length) {

        const currentPath = queue.shift();
        const node = currentPath[currentPath.length - 1];

        if (node.x === target.x && node.y === target.y) {
            path = currentPath;
            break;
        }

        for (const d of dirs) {

            const nx = node.x + d.x;
            const ny = node.y + d.y;
            const k = nx + "," + ny;

            if (!isSafe(nx, ny) || visited.has(k)) continue;

            visited.add(k);

            queue.push([
                ...currentPath,
                { x: nx, y: ny }
            ]);
        }
    }

    // FOLLOW PATH IF FOUND
    if (path && path.length > 1) {

        const next = path[1];

        const dx = next.x - start.x;
        const dy = next.y - start.y;

        setDirection(dx, dy);
        return;
    }

    // FALLBACK: SAFE MOVE (SURVIVAL MODE)
    for (const d of dirs) {

        const nx = start.x + d.x;
        const ny = start.y + d.y;

        if (isSafe(nx, ny)) {
            setDirection(d.x, d.y);
            return;
        }
    }

}, 60);

console.log("REAL GOD AI ENABLED");
