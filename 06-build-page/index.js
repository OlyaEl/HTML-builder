const fs = require('fs');
const fsProms = fs.promises;
const path = require('path');

const styleFolder = path.join(__dirname, 'styles');
const outputProjectDist = path.join(__dirname, 'project-dist');
const outputStyles = path.join(outputProjectDist, 'style.css');
const outputHTML = path.join(outputProjectDist, 'index.html');
const templatePath = path.join(__dirname, 'template.html');
const assetsFolder = path.join(__dirname, 'assets');
const outputAssets = path.join(outputProjectDist, 'assets');
const componentsFolder = path.join(__dirname, 'components');

async function replaceHTMLTags() {
  try {
    // Чтение template.html
    let template = await fsProms.readFile(templatePath, 'utf-8');
    // Cписок файлов с компонентами
    const componentsFiles = await fsProms.readdir(componentsFolder);
    for (const file of componentsFiles) {
      const fileName = path.parse(file).name; // имя файла без расширения
      const componentContent = await fsProms.readFile(path.join(componentsFolder, file), 'utf-8');
      const replasedTag = `{{${fileName}}}`;
      // Замена тегов в шаблоне на содержимое компонента 
      template = template.replaceAll(replasedTag, componentContent);
    }
    await fsProms.writeFile(outputHTML, template, 'utf-8');
  } catch (err) {
    console.error("Error replacing HTML tags:", err);
  }
}

replaceHTMLTags()

const stylesArr = [];
async function mergeStyles() {
  try {
    await fsProms.mkdir(outputProjectDist, { recursive: true });
    const files = await fsProms.readdir(styleFolder, { withFileTypes: true });
    for (let file of files) {
      const filePath = path.join(styleFolder, file.name);
      if (path.extname(file.name) === '.css' && file.isFile()) {
        const fileContent = await fsProms.readFile(filePath, 'utf-8');
        stylesArr.push(fileContent);
      }
    }
    await fsProms.writeFile(outputStyles, stylesArr.join('\n'), 'utf-8')
  } catch (err) {
    console.error('Error merge styles:', err);
  }
}
mergeStyles()

async function copyDir(src, dest) {
  try {
    await fsProms.mkdir(dest, { recursive: true });
    const filesInFolder = await fsProms.readdir(src, { withFileTypes: true });
    for (const file of filesInFolder) {
      const currPath = path.join(src, file.name);
      const copyPath = path.join(dest, file.name);
      if (file.isFile()) {
        //console.log(`Copying ${file.name} is completed`);
        await fsProms.copyFile(currPath, copyPath);
      } else {
        await copyDir(currPath, copyPath)
      }
    }
  } catch (err) {
    console.error('Error copying directory:', err)
  }
}

copyDir(assetsFolder, outputAssets)

