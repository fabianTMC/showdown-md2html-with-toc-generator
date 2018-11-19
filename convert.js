var path = require('path');
var fs = require('fs');
var showdown = require('showdown');

const template = fs.readFileSync("./config/templates/file-template.html").toString();
const tocTemplate = fs.readFileSync("./config/templates/toc-template.html").toString();

function fromDir(startPath, filter, srcPath, distPath, fileList = {md: [], html: []}) {
    if (!fs.existsSync(startPath)) {
        console.log("Directory does not exist: ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);

        if (stat.isDirectory()) {
            fromDir(filename, filter, srcPath, distPath, fileList); //recurse
        } else if (filename.indexOf(filter) >= 0) {
            let htmlName = filename.substr(0, filename.length - filter.length) + '.html';
            htmlName = distPath + htmlName.substr(path.join(srcPath).length);

                var converter = new showdown.Converter(),
                text = fs.readFileSync(filename).toString(),
                html = converter.makeHtml(text);

            const dir = path.dirname(htmlName);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            console.log(`\t${filename} -> ${htmlName}`);
            fs.writeFileSync(htmlName, template.replace("<!--CONTENT-->", html));

            fileList.md.push(filename);
            fileList.html.push(htmlName);
        };
    };

    return fileList;
};

console.log("Converting markdown to html\n");

const srcPath = "src", distPath = "public";
if (!fs.existsSync(distPath)) {
    console.log(`Creating dist directory: ${distPath}\n`);
    fs.mkdirSync(distPath);
}

console.log("Converting files:");
const fileList = fromDir('./src', '.md', srcPath, distPath);

console.log("\nCreating TOC using config/toc.json:");

const tocLinkTemplate = fs.readFileSync("./config/templates/partials/toc-link.html").toString();
try {
    const tocConfig = JSON.parse(fs.readFileSync("./config/toc.json").toString());

    const tocLinks = fileList.md.reduce((accumulator, file, index) => {
        file = file.substr(srcPath.length);

        if(tocConfig[file] !== undefined) {
            const link = fileList.html[index].substr(distPath.length);
            console.log(`\t${tocConfig[file]} -> ${link}`)
            accumulator += tocLinkTemplate.replace(/<!--LINK-->/g, link).replace(/<!--NAME-->/g, tocConfig[file]);
        }

        return accumulator;
    }, "");

    console.log(`\nWriting TOC -> ${distPath}/index.html`);
    console.log(`\nDone`);
    fs.writeFileSync(`${distPath}/index.html`, tocTemplate.replace("<!--CONTENT-->", tocLinks));
} catch(e) {
    console.error("Invalid JSON in toc.json");
}