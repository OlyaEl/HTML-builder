const fs = require('fs');
const path = require('path');
const fsProms = fs.promises;

const styleFolder = path.join(__dirname, 'styles');
const outputFolder = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputFolder, 'bundle.css');
const stylesArr = [];
async function mergeStyles() {
  try {
    await fsProms.mkdir(outputFolder, { recursive: true });
    const files = await fsProms.readdir(styleFolder, { withFileTypes: true });
    // const filesCSS = files.filter((file) => file.isFile() && path.extname(file.name) === '.css'); //фильтруем файлы css
    for (let file of files) {
      const filePath = path.join(styleFolder, file.name);
      if (path.extname(file.name) === '.css' && file.isFile()) {
        const fileContent = await fsProms.readFile(filePath, 'utf-8');
        stylesArr.push(fileContent);
      }
    }
    await fsProms.writeFile(outputFile, stylesArr.join('\n'), 'utf-8')
  } catch (err) {
    console.error('Error merge styles:', err);
  }
}
mergeStyles()