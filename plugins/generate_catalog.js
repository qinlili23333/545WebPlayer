const fs = require('fs');
const path = require("path");
const dirname = path.resolve("./");
console.log("Initialize...");
const walk = function (dir) {
    let results = [];
    let list = fs.readdirSync(dir)
    let i = 0;
    (function next() {
        var file = list[i++];
        if (!file) return results;
        file = path.resolve(dir, file);
        let stat = fs.statSync(file)
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
            next();
        } else {
            //删除旧的清单
            if (path.basename(file) == "manifest.json") {
                fs.rmSync(file);
                return next()
            }
            results.push(path.relative(path.join(dirname, item), file).split('\\').join('/'));
            next();
        }
    })();
    return results;
};
let arr = fs.readdirSync(dirname);
arr.forEach(item => {
    if (fs.statSync(path.join(dirname, item)).isDirectory()) {
        console.log("Processing " + item);
        let pluginInfo = {};
        pluginInfo.name = item;
        pluginInfo.version = fs.readFileSync(path.join(dirname, item, "version"), "utf-8");
        console.log("Version: " + pluginInfo.version);
        global.item = item;
        pluginInfo.fileList = walk(path.join(dirname, item));
        pluginInfo.fileSize = 0;
        pluginInfo.fileList.forEach(file => {
            pluginInfo.fileSize += fs.statSync(path.join(dirname, item, file)).size;
        });
        console.log("Generating manifest...");
        fs.writeFileSync(path.join(dirname, item, "manifest.json"), JSON.stringify(pluginInfo));
    }
});