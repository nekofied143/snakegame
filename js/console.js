// const bot = setInterval(() => {

//     if (!GameState.started || GameState.paused) return;

//     const head = snake[0];

//     const moves = [
//         { x: 1, y: 0 },
//         { x: -1, y: 0 },
//         { x: 0, y: 1 },
//         { x: 0, y: -1 }
//     ];

//     const validMoves = moves.filter(m => {

//         if (
//             m.x === -direction.x &&
//             m.y === -direction.y
//         ) {
//             return false;
//         }

//         const nx = head.x + m.x;
//         const ny = head.y + m.y;

//         if (
//             nx < 0 ||
//             ny < 0 ||
//             nx >= GRID_SIZE ||
//             ny >= GRID_SIZE
//         ) {
//             return false;
//         }

//         return !snake.some(s =>
//             s.x === nx &&
//             s.y === ny
//         );
//     });

//     if (!validMoves.length) return;

//     validMoves.sort((a, b) => {

//         const da =
//             Math.abs(food.x - (head.x + a.x)) +
//             Math.abs(food.y - (head.y + a.y));

//         const db =
//             Math.abs(food.x - (head.x + b.x)) +
//             Math.abs(food.y - (head.y + b.y));

//         return da - db;
//     });

//     nextDirection = validMoves[0];

// }, 20);

// clearInterval(bot);
