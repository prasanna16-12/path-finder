"use strict";
function init() {
    const source = null;
    const destination = null;
    const grid = document.getElementById('grid');
    const [width, height] = getGridSize(grid);
    for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {
            // create div
            const block = document.createElement('div');
            block.classList.add('block');
            block.id = `${h}-${w}`;
            block.setAttribute('data-row', w.toString());
            block.setAttribute('data-col', h.toString());
            block.addEventListener('click', e => whenClicked(e), false);
            grid.appendChild(block);
        }
    }
}
function whenClicked(e) {
    const block = e.target;
    console.log('clicked', block.id);
}
function getGridSize(element) {
    const width = element === null || element === void 0 ? void 0 : element.offsetWidth;
    const height = element === null || element === void 0 ? void 0 : element.offsetHeight;
    const remWidth = width / 16;
    const remHeight = height / 16;
    // Return the number of rem that the div is wide
    return [Math.floor(remWidth), Math.floor(remHeight)];
}
init();
//# sourceMappingURL=main.js.map