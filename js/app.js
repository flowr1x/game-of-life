const containerCanvas = document.querySelector(".canvas-box");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = containerCanvas.offsetWidth;
canvas.height = containerCanvas.offsetHeight;

containerCanvas.append(canvas);

const RESOLUTION = 5;
const COLS = canvas.width / RESOLUTION;
const ROWS = canvas.height / RESOLUTION;

const root = getComputedStyle(document.querySelector(":root"));

let grid = createGrid(COLS, ROWS);

requestAnimationFrame(update);
function update() {
    grid = nextGeneration(grid);
    draw(grid);
    requestAnimationFrame(update);
}

function createGrid(cols, rows) {
    return new Array(cols).fill(null)
        .map(() => new Array(rows).fill(null)
            .map(item => Math.floor(Math.random() * 2)));
}   

function nextGeneration(grid) {
    let nextGrid = grid.map(arr => [...arr]);

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const cell = grid[y][x];
            const countNeighbours = getNeighbours(x, y, grid);
            
            // rules
            if (cell === 1  && countNeighbours < 2) nextGrid[y][x] = 0;
            else if (cell === 1 && countNeighbours > 3) nextGrid[y][x] = 0;
            else if (cell === 0 && countNeighbours === 3) nextGrid[y][x] = 1;
        }
    }

    return nextGrid;
}

function getNeighbours(x, y, grid) {
    let countNeighbours = 0;    

    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (i === 0 && j === 0) continue;

            const cellY =  y + i;
            const cellX = x + j;
            
            if (cellY >= 0 && cellX >= 0 && cellY < COLS && cellX < ROWS) {
                const neighbour = grid[cellY][cellX];
                countNeighbours += neighbour;
            }  
        }
    }

    return countNeighbours;
}

function draw(grid) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const cell = grid[y][x];

            if (cell) {
                ctx.fillStyle = root.getPropertyValue("--dark-color");
                ctx.fillRect(x * RESOLUTION, y * RESOLUTION, RESOLUTION, RESOLUTION);
            }
        }
    }
}
