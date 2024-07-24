const fs = require('fs').promises;
const path = require('path');

async function getFilesInDirectoryAsBase64(directoryPath) {
  try {
    const files = await fs.readdir(directoryPath);
    const filesBase64 = await Promise.all(files.map(async (file) => {
      const filePath = path.join(directoryPath, file);
      const fileContent = await fs.readFile(filePath);
      return {
        fileName: file,
        content: fileContent.toString('base64')
      };
    }));
    return filesBase64;
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
}

module.exports = { getFilesInDirectoryAsBase64 };
