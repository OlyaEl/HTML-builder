const fs = require('fs');
const path = require('path');
const fsProms = fs.promises;

const currFolder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fsProms.mkdir(copyFolder, { recursive: true });
    const filesInFolder = await fsProms.readdir(currFolder, { withFileTypes: true });
    for (const file of filesInFolder) {
      const currPath = path.join(currFolder, file.name);
      const copyPath = path.join(copyFolder, file.name);
      if (file.isFile()) {
        console.log(`Copying ${file.name} is completed`);
        await fsProms.copyFile(currPath, copyPath);
      }
    }
  } catch (err) {
    console.error('Error copying directory:', err)
  }
}

copyDir()