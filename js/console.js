// HYBRID GOD MODE: AUTO PLAY → HAMILTONIAN TAKEOVER

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
            for (let x = 0; x < GRID; x++) {
                cycle.push({ x, y });
            }
        } else {
            for (let x = GRID - 1; x >= 0; x--) {
                cycle.push({ x, y });
            }
        }
    }

    cycle.push(cycle[0]);

    function findIndex() {
        const head = snake[0];

        for (let i = 0; i < cycle.length; i++) {
            if (cycle[i].x === head.x && cycle[i].y === head.y) {
                return i;
            }
        }

        return -1;
    }

    function safeDirections(head) {

        const dirs = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
        ];

        return dirs.filter(d => {

            const nx = head.x + d.x;
            const ny = head.y + d.y;

            // wall check
            if (nx < 0 || ny < 0 || nx >= GRID || ny >= GRID) return false;

            // self collision check
            if (snake.some(s => s.x === nx && s.y === ny)) return false;

            return true;
        });
    }

    window.HAM_AI = setInterval(() => {

        if (!GameState.started || GameState.paused || GameState.dead) return;

        const head = snake[0];

        // =========================
        // PHASE 1: EARLY GAME AI
        // =========================
        if (snake.length < ACTIVATE_LENGTH) {

            const options = safeDirections(head);

            if (options.length) {
                const pick = options[Math.floor(Math.random() * options.length)];
                setDirection(pick.x, pick.y);
            }

            return;
        }

        // =========================
        // PHASE 2: HAMILTONIAN MODE
        // =========================
        const idx = findIndex();
        if (idx === -1) return;

        const next = cycle[(idx + 1) % cycle.length];

        const dx = next.x - head.x;
        const dy = next.y - head.y;

        setDirection(dx, dy);

    }, 80);

    console.log("HYBRID GOD MODE ENABLED (WANDER → HAMILTONIAN)");
})();
