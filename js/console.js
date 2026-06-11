// PERFECT GOD AI: BFS FOOD HUNT → SAFE SURVIVAL → HAMILTONIAN MODE

(function () {

    const GRID = GRID_SIZE;
    const ACTIVATE_LENGTH = 15;

    if (window.HAM_AI) clearInterval(window.HAM_AI);

    // =========================
    // HAMILTONIAN CYCLE
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

    function findCycleIndex() {
        const h = snake[0];
        for (let i = 0; i < cycle.length; i++) {
            if (cycle[i].x === h.x && cycle[i].y === h.y) return i;
        }
        return -1;
    }

    function isSafe(x, y) {
        if (x < 0 || y < 0 || x >= GRID || y >= GRID) return false;
        return !snake.some(s => s.x === x && s.y === y);
    }

    // =========================
    // BFS PATHFINDING TO FOOD
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

        for (const d of dirs) {
            if (isSafe(head.x + d.x, head.y + d.y)) {
                return d;
            }
        }

        return null;
    }

    // =========================
    // MAIN AI LOOP
    // =========================
    window.HAM_AI = setInterval(() => {

        if (!GameState.started || GameState.paused || GameState.dead) return;

        const head = snake[0];

        // =====================================================
        // PHASE 3: HAMILTONIAN MODE (IMMORTAL)
        // =====================================================
        if (snake.length >= ACTIVATE_LENGTH) {

            const idx = findCycleIndex();
            if (idx === -1) return;

            const next = cycle[(idx + 1) % cycle.length];

            setDirection(next.x - head.x, next.y - head.y);

            return;
        }

        // =====================================================
        // PHASE 1/2: PERFECT FOOD HUNT + SURVIVAL
        // =====================================================

        const path = bfsToFood();

        if (path && path.length > 1) {

            const next = path[1];
            setDirection(next.x - head.x, next.y - head.y);
            return;
        }

        // fallback if food unreachable
        const safe = fallbackMove();

        if (safe) {
            setDirection(safe.x, safe.y);
        }

    }, 60);

    console.log("PERFECT GOD AI ENABLED (FOOD → SAFETY → HAMILTONIAN)");
})();
