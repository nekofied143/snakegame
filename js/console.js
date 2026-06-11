// LOOK-AHEAD GOD AI (NO CHEATS, FUTURE-SAFE)

(function () {

    const GRID = GRID_SIZE;
    const ACTIVATE_LENGTH = 30;
    const LOOKAHEAD_DEPTH = 6;

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

    function cycleIndex(head) {
        for (let i = 0; i < cycle.length; i++) {
            if (cycle[i].x === head.x && cycle[i].y === head.y) return i;
        }
        return -1;
    }

    // =========================
    // SAFE CHECK
    // =========================
    function isSafe(x, y, body) {
        if (x < 0 || y < 0 || x >= GRID || y >= GRID) return false;
        return !body.some(s => s.x === x && s.y === y);
    }

    // =========================
    // SIMULATE FUTURE (CORE IDEA)
    // =========================
    function simulate(path, depth) {

        let simSnake = JSON.parse(JSON.stringify(snake));

        for (let i = 0; i < Math.min(depth, path.length - 1); i++) {

            const next = path[i + 1];

            simSnake.unshift({ x: next.x, y: next.y });

            simSnake.pop();

            // if collision happens → invalid path
            if (simSnake.slice(1).some(s =>
                s.x === simSnake[0].x &&
                s.y === simSnake[0].y
            )) {
                return false;
            }
        }

        return true;
    }

    // =========================
    // BFS FOOD PATH
    // =========================
    function bfs() {

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

                if (isSafe(nx, ny, snake)) {
                    if (!visited.has(key)) {

                        visited.add(key);

                        queue.push([
                            ...path,
                            { x: nx, y: ny }
                        ]);
                    }
                }
            }
        }

        return null;
    }

    // =========================
    // SAFE FALLBACK
    // =========================
    function fallback() {

        const head = snake[0];

        const dirs = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
        ];

        for (const d of dirs) {

            const nx = head.x + d.x;
            const ny = head.y + d.y;

            if (isSafe(nx, ny, snake)) {
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
        // PHASE 1: HAMILTONIAN
        // =========================
        if (snake.length >= ACTIVATE_LENGTH) {

            const idx = cycleIndex(head);
            if (idx === -1) return;

            const next = cycle[(idx + 1) % cycle.length];

            setDirection(next.x - head.x, next.y - head.y);
            return;
        }

        // =========================
        // PHASE 0: LOOK-AHEAD FOOD AI
        // =========================
        const path = bfs();

        if (path && path.length > 1) {

            // simulate safety before committing
            if (simulate(path, LOOKAHEAD_DEPTH)) {

                const next = path[1];
                setDirection(next.x - head.x, next.y - head.y);
                return;
            }
        }

        // fallback if unsafe
        const safe = fallback();

        if (safe) {
            setDirection(safe.x, safe.y);
        }

    }, 60);

    console.log("LOOK-AHEAD GOD AI ENABLED (future-safe + Hamiltonian)");
})();
