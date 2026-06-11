// 3-LAYER PREDICTION AI (SAFETY + FUTURE + FOOD VALUE)

(function () {

    const GRID = GRID_SIZE;

    if (window.HAM_AI) clearInterval(window.HAM_AI);

    // =========================
    // BASIC MOVE SAFETY
    // =========================
    function isSafe(x, y, body) {
        if (x < 0 || y < 0 || x >= GRID || y >= GRID) return false;
        return !body.some(s => s.x === x && s.y === y);
    }

    // =========================
    // SIMULATE MOVE WITH GROWTH AWARENESS
    // =========================
    function simulateState(dir, shouldGrow) {

        const sim = JSON.parse(JSON.stringify(snake));

        const head = sim[0];

        const newHead = {
            x: head.x + dir.x,
            y: head.y + dir.y
        };

        sim.unshift(newHead);

        // if no food → tail moves
        // if food → tail stays (growth)
        if (!shouldGrow) {
            sim.pop();
        }

        return sim;
    }

    // =========================
    // CAN REACH TAIL (FLOOD FILL)
    // =========================
    function canReachTail(simSnake) {

        const head = simSnake[0];
        const tail = simSnake[simSnake.length - 1];

        const queue = [head];
        const visited = new Set();
        visited.add(head.x + "," + head.y);

        const blocked = new Set(
            simSnake.slice(0, -1).map(s => s.x + "," + s.y)
        );

        const dirs = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
        ];

        while (queue.length) {

            const node = queue.shift();

            if (node.x === tail.x && node.y === tail.y) {
                return true;
            }

            for (const d of dirs) {

                const nx = node.x + d.x;
                const ny = node.y + d.y;
                const key = nx + "," + ny;

                if (nx < 0 || ny < 0 || nx >= GRID || ny >= GRID) continue;
                if (visited.has(key)) continue;
                if (blocked.has(key)) continue;

                visited.add(key);
                queue.push({ x: nx, y: ny });
            }
        }

        return false;
    }

    // =========================
    // LAYER 3: FOOD SCORE
    // =========================
    function foodScore(simSnake) {

        const head = simSnake[0];

        if (!food) return 0;

        const dist =
            Math.abs(head.x - food.x) +
            Math.abs(head.y - food.y);

        return 100 - dist;
    }

    // =========================
    // EVALUATE MOVE (3-LAYER SYSTEM)
    // =========================
    function evaluate(dir) {

        const head = snake[0];

        const nx = head.x + dir.x;
        const ny = head.y + dir.y;

        // =========================
        // LAYER 1: IMMEDIATE SAFETY
        // =========================
        if (!isSafe(nx, ny, snake)) {
            return -9999;
        }

        const willEat =
            food && nx === food.x && ny === food.y;

        // =========================
        // LAYER 2: FUTURE SAFETY
        // =========================
        const sim = simulateState(dir, willEat);

        if (!canReachTail(sim)) {
            return -5000; // trap risk
        }

        // =========================
        // LAYER 3: FOOD VALUE
        // =========================
        let score = 0;

        score += foodScore(sim);

        // reward survival stability
        if (canReachTail(sim)) {
            score += 50;
        }

        return score;
    }

    // =========================
    // MAIN LOOP
    // =========================
    window.HAM_AI = setInterval(() => {

        if (!GameState.started || GameState.paused || GameState.dead) return;

        const dirs = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
        ];

        let bestDir = null;
        let bestScore = -Infinity;

        for (const d of dirs) {

            const score = evaluate(d);

            if (score > bestScore) {
                bestScore = score;
                bestDir = d;
            }
        }

        if (bestDir) {
            setDirection(bestDir.x, bestDir.y);
        }

    }, 60);

    console.log("3-LAYER PREDICTION AI ENABLED (SAFETY + FUTURE + FOOD)");
})();
