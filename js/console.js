// HAMILTONIAN GOD MODE (GATED + SAFE)

(function () {

    const GRID = GRID_SIZE;
    const ACTIVATE_LENGTH = 15; // change this threshold if needed

    // prevent multiple intervals
    if (window.HAM_AI) {
        clearInterval(window.HAM_AI);
    }

    // build Hamiltonian cycle (serpentine)
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

    // close loop
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

    window.HAM_AI = setInterval(() => {

        if (!GameState.started || GameState.paused || GameState.dead) return;

        // ✅ GATE CONDITION
        if (snake.length < ACTIVATE_LENGTH) return;

        const idx = findIndex();

        if (idx === -1) return;

        const next = cycle[(idx + 1) % cycle.length];
        const head = snake[0];

        const dx = next.x - head.x;
        const dy = next.y - head.y;

        // IMPORTANT: use your safe input system
        setDirection(dx, dy);

    }, 80);

    console.log(
        `HAMILTONIAN GOD MODE READY (activates at length ${ACTIVATE_LENGTH})`
    );

})();
