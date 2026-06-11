// CLEAN GOD AI (NO WALL HACKS, REAL RULES ONLY)

(function () {

    const GRID = GRID_SIZE;
    const ACTIVATE_LENGTH = 15;

    if (window.HAM_AI) clearInterval(window.HAM_AI);

    // =========================
    // HAMILTONIAN CYCLE (LEGAL MOVEMENT ONLY)
    // =========================
    const cycle = [];

    for (let y = 0; y < GRID; y++) {
        if (y % 2 === 0) {
            for (let x = 0; x < GRID; x++) cycle.push({ x, y });
        } else {
            for (let x = GRID - 1; x >= 0; x--) cycle.push({ x, y });
        }
    }

    cycle.push(cycle[0]);

    function findCycleIndex(head) {
        for (let i = 0; i < cycle.length; i++) {
            if (cycle[i].x === head.x && cycle[i].y === head.y) {
                return i;
            }
        }
        return -1;
    }

    // =========================
    // REAL SAFETY CHECK (NO HACKING)
    // =========================
    function isSafe(x, y) {
        if (x < 0 || y < 0 || x >= GRID || y >= GRID) return false;

        return !snake.some(s => s.x === x && s.y === y);
    }

    // =========================
    // BFS (REAL PATHFINDING ONLY)
    // =========================
    function bfsToFood() {

        if (!food) return null;

        const start = snake[0];
        const target = food;

        const dirs = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
        ];

        const queue = [[start]];
        const visited = new Set();
        visited.add(start.x + "," + start.y);

        while (queue.length) {

            const path = queue.shift();
            const node = path[path.length - 1];

            if (node.x === target.x && node.y === target.y) {
                return path;
            }

            for (const d of dirs) {

                const nx = node.x + d.x;
                const ny = node.y + d.y;
                const key = nx + "," + ny;

                if (!isSafe(nx, ny)) continue;
                if (visited.has(key)) continue;

                visited.add(key);

                queue.push([
                    ...path,
                    { x: nx, y: ny }
                ]);
            }
        }

        return null;
    }

    // =========================
    // SAFE MOVE FALLBACK
    // =========================
    function fallbackMove() {

        const head = snake[0];

        const dirs = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
        ];

        // choose ANY safe move (no guessing walls, no hacks)
        for (const d of dirs) {
            if (isSafe(head.x + d.x, head.y + d.y)) {
                return d;
            }
        }

        return null;
    }

    // =========================
    // MAIN LOOP
    // =========================
    window.HAM_AI = setInterval(() => {

        if (!GameState.started || GameState.paused || GameState.dead) return;

        const head = snake[0];

        // =========================
        // PHASE 1: HAMILTONIAN (ONLY AFTER LENGTH)
        // =========================
        if (snake.length >= ACTIVATE_LENGTH) {

            const idx = findCycleIndex(head);
            if (idx === -1) return;

            const next = cycle[(idx + 1) % cycle.length];

            setDirection(next.x - head.x, next.y - head.y);
            return;
        }

        // =========================
        // PHASE 0: REAL FOOD AI (NO CHEATS)
        // =========================
        const path = bfsToFood();

        if (path && path.length > 1) {

            const next = path[1];
            setDirection(next.x - head.x, next.y - head.y);
            return;
        }

        // fallback safe movement
        const safe = fallbackMove();

        if (safe) {
            setDirection(safe.x, safe.y);
        }

    }, 70);

    console.log("CLEAN GOD AI ENABLED (NO WALL HACKS)");
})();
