// HAMILTONIAN GOD MODE (IMMORTAL AI)

(function () {

    const n = GRID_SIZE;

    // build Hamiltonian cycle for even grid sizes
    const cycle = [];

    // snake path: serpentine rows
    for (let y = 0; y < n; y++) {

        if (y % 2 === 0) {
            for (let x = 0; x < n; x++) {
                cycle.push({ x, y });
            }
        } else {
            for (let x = n - 1; x >= 0; x--) {
                cycle.push({ x, y });
            }
        }
    }

    // close loop
    cycle.push(cycle[0]);

    let index = 0;

    // find current head position in cycle
    function findIndex() {

        const head = snake[0];

        for (let i = 0; i < cycle.length; i++) {
            if (cycle[i].x === head.x && cycle[i].y === head.y) {
                return i;
            }
        }

        return 0;
    }

    window.HAM_AI = setInterval(() => {

        if (!GameState.started || GameState.paused) return;

        index = findIndex();

        const next = cycle[(index + 1) % cycle.length];
        const head = snake[0];

        const dx = next.x - head.x;
        const dy = next.y - head.y;

        setDirection(dx, dy);

    }, 80);

    console.log("HAMILTONIAN GOD MODE ENABLED (IMMORTAL SNAKE)");
})();
