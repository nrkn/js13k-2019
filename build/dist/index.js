"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const files_1 = require("@mojule/files");
const goonpack_1 = require("goonpack");
const fs_1 = require("fs");
const uglify = require("uglify-es");
const yazl = require("yazl");
const { writeFile, stat } = fs_1.promises;
const readFolder = async (path) => {
    const bufferMap = await files_1.readPathBufferMap(path);
    const map = {};
    Object.keys(bufferMap).forEach(path => {
        if (!path.endsWith('.js'))
            return;
        map[path] = bufferMap[path].toString('utf8');
    });
    return map;
};
const start = async () => {
    const map = await readFolder('./app/dist');
    const source = `(()=>{${goonpack_1.pack(map)}})()`;
    const packed = uglify.minify(source);
    if (packed.error) {
        console.error(packed.error);
        return;
    }
    await writeFile('./public/app.js', packed.code, 'utf8');
    const bufferMap = await files_1.readPathBufferMap('./public');
    const zip = new yazl.ZipFile();
    Object.keys(bufferMap).forEach(bufferPath => {
        zip.addBuffer(bufferMap[bufferPath], bufferPath);
    });
    zip.outputStream
        .pipe(fs_1.createWriteStream('./zip/app.zip'))
        .on('close', async () => {
        const stats = await stat('./zip/app.zip');
        console.log(`Size: ${stats.size}`);
        console.log(`Remaining: ${13e3 - stats.size}`);
    });
    zip.end();
};
start();
//# sourceMappingURL=index.js.map