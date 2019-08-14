"use strict";
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const width = 320;
const height = 240;
const sw = 16;
const sh = 16;
const tw = 20;
const th = 15;
canvas.width = width;
canvas.height = height;
const randInt = (exclMax) => Math.floor(Math.random() * exclMax);
document.body.appendChild(canvas);
const playpal = [
    '#000',
    '#56e',
    '#ec9'
];
const grasspal = [
    '#6b3',
    '#9e5',
    '#396'
];
const treepal = [
    '#000',
    '#6b3',
    '#396'
];
const mapData = [];
const map = {
    width: tw,
    height: th,
    data: mapData
};
const px = 10;
const py = 7;
for (let y = 0; y < th; y++) {
    for (let x = 0; x < tw; x++) {
        const index = y * tw + x;
        mapData[index] = randInt(2) + 1;
    }
}
mapData[py * tw + px] = 1;
const start = () => {
    for (let y = 0; y < th; y++) {
        for (let x = 0; x < tw; x++) {
            const index = y * tw + x;
            const sIndex = mapData[index];
            context.drawImage(sprites, sIndex * sw, 0, sw, sh, x * sw, y * sh, sw, sh);
            if (x === 10 && y === 7) {
                context.drawImage(sprites, 0, 0, sw, sh, x * sw, y * sh, sw, sh);
            }
        }
    }
};
const sprites = new Image();
sprites.onload = start;
sprites.src = 's.gif';
//# sourceMappingURL=index.js.map