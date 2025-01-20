const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function showInfo() {
  try {
    const files = await fs.promises.readdir(folderPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const stats = await fs.promises.stat(filePath);
        const fileName = path.basename(file.name, path.extname(file.name)); // file name without extension
        const fileExt = path.extname(file.name).slice(1);
        const size = stats.size;
        // Show file info in console
        console.log(`${fileName} - ${fileExt} - ${size} b`);
      }
    }
  } catch (err) {
    console.error('Error reading files:', err);
  }
}

showInfo();