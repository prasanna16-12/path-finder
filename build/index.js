"use strict";
let grid;
let sourceBtn;
let destinationBtn;
let wallBtn;
let mazeBtn;
let bfsBtn;
let designBtn;
let speedSelect;
let controlPanel;
let source;
let destination;
let cols;
let rows;
let sourceStatus;
let destinationStatus;
let isWallSelected;
let draw;
let pathHoles;
let speed;
let pathStatus;
function init() {
    sourceStatus = 'PENDING';
    destinationStatus = 'PENDING';
    pathStatus = 'NA';
    isWallSelected = false;
    draw = false;
    pathHoles = new Set();
    grid = document.getElementById('grid');
    sourceBtn = document.getElementById('source');
    wallBtn = document.getElementById('wall');
    bfsBtn = document.getElementById('bfs');
    mazeBtn = document.getElementById('maze');
    designBtn = document.getElementById('design');
    destinationBtn = document.getElementById('destination');
    controlPanel = document.getElementById('control-panel');
    speedSelect = document.getElementById('speed');
    speedSelect.addEventListener('change', e => setSpeed(e), false);
    sourceBtn === null || sourceBtn === void 0 ? void 0 : sourceBtn.addEventListener('click', e => selectSource(e), false);
    destinationBtn === null || destinationBtn === void 0 ? void 0 : destinationBtn.addEventListener('click', e => selectDestination(e), false);
    wallBtn === null || wallBtn === void 0 ? void 0 : wallBtn.addEventListener('click', e => drawWall(e), false);
    bfsBtn === null || bfsBtn === void 0 ? void 0 : bfsBtn.addEventListener('click', e => bfs(e), false);
    mazeBtn === null || mazeBtn === void 0 ? void 0 : mazeBtn.addEventListener('click', e => maze(e), false);
    designBtn === null || designBtn === void 0 ? void 0 : designBtn.addEventListener('click', e => design(e), false);
    speed = parseInt(speedSelect.value);
    [cols, rows] = getGridSize(grid);
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            // create div
            const block = document.createElement('div');
            block.classList.add('block');
            block.id = `${r}-${c}`;
            block.setAttribute('data-row', r.toString());
            block.setAttribute('data-col', c.toString());
            block.addEventListener('click', e => whenClicked(e), false);
            block.addEventListener('mousedown', e => startDrawing(e), false);
            block.addEventListener('mousemove', e => drawing(e), false);
            block.addEventListener('mouseup', e => endDrawing(e), false);
            grid === null || grid === void 0 ? void 0 : grid.appendChild(block);
        }
    }
}
function drawWall(e) {
    if (!isWallSelected) {
        wallBtn === null || wallBtn === void 0 ? void 0 : wallBtn.classList.add('wall-clicked');
        isWallSelected = true;
    }
    else {
        wallBtn === null || wallBtn === void 0 ? void 0 : wallBtn.classList.remove('wall-clicked');
        isWallSelected = false;
    }
    // disableControlPanel(true);
}
function setSpeed(e) {
    const select = e.target;
    speed = parseInt(select.value);
}
function selectDestination(e) {
    if (destinationStatus === 'PENDING') {
        destinationBtn === null || destinationBtn === void 0 ? void 0 : destinationBtn.classList.add('destination-clicked');
        disableControlPanel(true);
        destinationStatus = 'SELECTING';
    }
}
function selectSource(e) {
    if (sourceStatus === 'PENDING') {
        sourceBtn === null || sourceBtn === void 0 ? void 0 : sourceBtn.classList.add('source-clicked');
        disableControlPanel(true);
        sourceStatus = 'SELECTING';
    }
}
function whenClicked(e) {
    const block = e.target;
    const row = block.getAttribute('data-row');
    const col = block.getAttribute('data-col');
    if (sourceStatus === 'SELECTING') {
        source = [parseInt(row), parseInt(col)];
        sourceStatus = 'SELECTED';
        sourceBtn === null || sourceBtn === void 0 ? void 0 : sourceBtn.classList.remove('source-clicked');
        disableControlPanel(false);
        block.classList.add('source-block');
    }
    else if (destinationStatus === 'SELECTING') {
        destination = [parseInt(row), parseInt(col)];
        destinationStatus = 'SELECTED';
        destinationBtn === null || destinationBtn === void 0 ? void 0 : destinationBtn.classList.remove('destination-clicked');
        disableControlPanel(false);
        block.classList.add('destination-block');
    }
}
function getGridSize(element) {
    const width = element === null || element === void 0 ? void 0 : element.offsetWidth;
    const height = element === null || element === void 0 ? void 0 : element.offsetHeight;
    const remWidth = width / 16;
    const remHeight = height / 16;
    // Return the number of rem that the div is wide
    return [Math.floor(remWidth), Math.floor(remHeight)];
}
function disableControlPanel(flag) {
    if (controlPanel) {
        flag
            ? controlPanel.classList.add('control-panel-disable')
            : controlPanel.classList.remove('control-panel-disable');
    }
}
async function bfs(e) {
    const queue = [];
    const visited = new Set();
    const prevTrack = new Map();
    let r = source[0];
    let c = source[1];
    if (sourceStatus === 'SELECTED' && destinationStatus === 'SELECTED') {
        bfsBtn === null || bfsBtn === void 0 ? void 0 : bfsBtn.classList.add('bfs-clicked');
        disableControlPanel(true);
        pathStatus = 'INPROGRESS';
        // BFS Implementation
        queue.push(source);
        visited.add(`${source[0]}-${source[1]}`);
        while (queue.length > 0) {
            const currBlockPostion = queue.shift();
            [r, c] = currBlockPostion;
            if (JSON.stringify(currBlockPostion) === JSON.stringify(destination)) {
                // found
                break;
            }
            const currBlock = document.getElementById(`${r}-${c}`);
            if (!(JSON.stringify(currBlockPostion) === JSON.stringify(source) ||
                JSON.stringify(currBlockPostion) === JSON.stringify(destination))) {
                await new Promise(resolve => setTimeout(resolve, speed)).then(() => {
                    currBlock === null || currBlock === void 0 ? void 0 : currBlock.classList.add('visited-block');
                });
            }
            checkAndAdd(r - 1, c);
            // checkAndAdd(r - 1, c + 1);
            checkAndAdd(r, c + 1);
            // checkAndAdd(r + 1, c + 1);
            checkAndAdd(r + 1, c);
            // checkAndAdd(r + 1, c - 1);
            checkAndAdd(r, c - 1);
            // checkAndAdd(r - 1, c - 1);
        }
    }
    function checkAndAdd(row, col) {
        const validRow = row >= 0 && row < rows;
        const validCol = col >= 0 && col < cols;
        if (validRow &&
            validCol &&
            !visited.has(`${row}-${col}`) &&
            !pathHoles.has(`${row}-${col}`)) {
            queue.push([row, col]);
            visited.add(`${row}-${col}`);
            prevTrack.set(`${row}-${col}`, [r, c]);
        }
    }
    // Get return path
    let [prevRow, prevCol] = destination;
    let isNotPathFound = true;
    while (isNotPathFound) {
        if (!prevTrack.has(`${prevRow}-${prevCol}`)) {
            break;
        }
        [prevRow, prevCol] = prevTrack.get(`${prevRow}-${prevCol}`);
        if (JSON.stringify([prevRow, prevCol]) !== JSON.stringify(source)) {
            const currBlock = document.getElementById(`${prevRow}-${prevCol}`);
            await new Promise(resolve => setTimeout(resolve, 100)).then(() => {
                currBlock === null || currBlock === void 0 ? void 0 : currBlock.classList.add('path-block');
            });
        }
        if (JSON.stringify([prevRow, prevCol]) === JSON.stringify(source)) {
            // source found
            isNotPathFound = false;
        }
    }
    bfsBtn === null || bfsBtn === void 0 ? void 0 : bfsBtn.classList.remove('bfs-clicked');
    disableControlPanel(false);
    pathStatus = isNotPathFound ? 'NOTFOUND' : 'FOUND';
}
async function maze(e) {
    mazeBtn.classList.add('maze-clicked');
    disableControlPanel(true);
    // add all to path holes
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            pathHoles.add(`${r}-${c}`);
        }
    }
    const childElements = grid.children;
    if (childElements !== undefined) {
        for (const childElement of childElements) {
            childElement.classList.add('wall-block');
        }
    }
    const randomBlock = [
        1, //Math.ceil(Math.random() * rows),
        1, //Math.ceil(Math.random() * cols),
    ];
    const visited = new Set();
    visited.add(`${randomBlock[0]}-${randomBlock[1]}`);
    const stack = [randomBlock];
    while (stack.length > 0) {
        const currentCell = stack.pop();
        // make road
        const currBlock = document.getElementById(`${currentCell[0]}-${currentCell[1]}`);
        await new Promise(resolve => setTimeout(resolve, speed)).then(() => {
            currBlock.classList.remove('wall-block');
        });
        pathHoles.delete(`${currentCell[0]}-${currentCell[1]}`);
        const neighbors = getAvailableNeighbors(currentCell[0], currentCell[1]);
        if (neighbors.length > 0) {
            const chosenIndex = Math.floor(Math.random() * neighbors.length);
            const chosenNeighbor = neighbors[chosenIndex];
            visited.add(`${chosenNeighbor[0]}-${chosenNeighbor[1]}`);
            for (let i = 0; i < neighbors.length; i++) {
                const currNeighbour = neighbors[i];
                if (i !== chosenIndex &&
                    !visited.has(`${currNeighbour[0]}-${currNeighbour[1]}`)) {
                    // visited.add(`${currNeighbour[0]}-${currNeighbour[1]}`);
                    stack.push(neighbors[i]);
                }
            }
            stack.push(chosenNeighbor);
            connect(currentCell, chosenNeighbor);
        }
    }
    mazeBtn.classList.remove('maze-clicked');
    disableControlPanel(false);
    async function connect(start, end) {
        let midRow;
        let midCol;
        if (start[0] !== end[0]) {
            midRow = Math.min(start[0], end[0]) + 1;
        }
        else {
            midRow = start[0];
        }
        if (start[1] !== end[1]) {
            midCol = Math.min(start[1], end[1]) + 1;
        }
        else {
            midCol = start[1];
        }
        //path in bettween
        const midBlock = document.getElementById(`${midRow}-${midCol}`);
        await new Promise(resolve => setTimeout(resolve, speed)).then(() => {
            midBlock.classList.remove('wall-block');
        });
        pathHoles.delete(`${midRow}-${midCol}`);
        const endBlock = document.getElementById(`${end[0]}-${end[1]}`);
        await new Promise(resolve => setTimeout(resolve, speed)).then(() => {
            endBlock.classList.remove('wall-block');
        });
        pathHoles.delete(`${end[0]}-${end[1]}`);
    }
    function getAvailableNeighbors(row, col) {
        const neighbors = [];
        // Check and add valid neighbors (within maze boundaries and unvisited)
        checkBound(row - 2, col);
        checkBound(row + 2, col);
        checkBound(row, col + 2);
        checkBound(row, col - 2);
        return neighbors;
        function checkBound(r, c) {
            const validRow = r > 0 && r < rows;
            const validCol = c > 0 && c < cols;
            if (validRow && validCol && !visited.has(`${r}-${c}`)) {
                neighbors.push([r, c]);
            }
        }
    }
}
function startDrawing(e) {
    if (isWallSelected) {
        draw = true;
        const block = e.target;
        block.classList.add('wall-block');
        const row = block.getAttribute('data-row');
        const col = block.getAttribute('data-col');
        pathHoles.add(`${row}-${col}`);
    }
}
function drawing(e) {
    if (isWallSelected && draw) {
        const block = e.target;
        block.classList.add('wall-block');
        const row = block.getAttribute('data-row');
        const col = block.getAttribute('data-col');
        pathHoles.add(`${row}-${col}`);
    }
}
function endDrawing(e) {
    if (isWallSelected) {
        const block = e.target;
        block.classList.add('wall-block');
        const row = block.getAttribute('data-row');
        const col = block.getAttribute('data-col');
        pathHoles.add(`${row}-${col}`);
        draw = false;
    }
}
async function design(e) {
    designBtn === null || designBtn === void 0 ? void 0 : designBtn.classList.add('design-clicked');
    disableControlPanel(true);
    await maze(e);
    const visited = new Set();
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!pathHoles.has(`${r}-${c}`) && !visited.has(`${r}-${c}`)) {
                await bfs(r, c);
            }
        }
    }
    designBtn === null || designBtn === void 0 ? void 0 : designBtn.classList.remove('design-clicked');
    disableControlPanel(false);
    async function bfs(row, col) {
        const color = randomColor();
        const queue = [];
        queue.push([row, col]);
        visited.add(`${row}-${col}`);
        while (queue.length > 0) {
            const currBlockPostion = queue.shift();
            const [r, c] = currBlockPostion;
            const currBlock = document.getElementById(`${r}-${c}`);
            await new Promise(resolve => setTimeout(resolve, speed)).then(() => {
                currBlock.style.backgroundColor = color;
            });
            checkAndAdd(r - 1, c);
            // checkAndAdd(r - 1, c + 1);
            checkAndAdd(r, c + 1);
            // checkAndAdd(r + 1, c + 1);
            checkAndAdd(r + 1, c);
            // checkAndAdd(r + 1, c - 1);
            checkAndAdd(r, c - 1);
            // checkAndAdd(r - 1, c - 1);
        }
        function checkAndAdd(row, col) {
            const validRow = row > 0 && row < rows;
            const validCol = col > 0 && col < cols;
            if (validRow &&
                validCol &&
                !visited.has(`${row}-${col}`) &&
                !pathHoles.has(`${row}-${col}`)) {
                queue.push([row, col]);
                visited.add(`${row}-${col}`);
            }
        }
    }
}
function randomColor() {
    const randomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const h = randomInt(0, 360);
    const s = randomInt(42, 98);
    const l = randomInt(40, 90);
    return `hsl(${h},${s}%,${l}%)`;
}
init();
//# sourceMappingURL=index.js.map