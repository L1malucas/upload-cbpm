const path = require("path");
const fs = require("fs");

const { saveFileToDatabase } = require("./database");
const { uploadToFTP } = require("./ftpManager");

async function processFilesInDirectory(directoryPath, basePath) {
  try {
    const items = await fs.promises.readdir(directoryPath, {
      withFileTypes: true,
    });

    for (const item of items) {
      const fullPath = path.join(directoryPath, item.name);

      if (item.isDirectory()) {
        console.log(`\n\nProcessando Arquivos na Pasta: ${item.name}...`);
        await processFilesInDirectory(fullPath, basePath); // Processa subdiretório
      } else if (item.isFile()) {
        const relativePath = path.relative(basePath, fullPath);
        const remotePath = `CBPM-GED/${relativePath}`;

        try {
          const ftpUrl = await uploadToFTP(fullPath, remotePath);
          await saveFileToDatabase(fullPath, ftpUrl);
          console.log(
            `Arquivo ${item.name} enviado para o FTP e seus metadados salvos no MongoDB.`
          );
        } catch (error) {
          console.error("Erro no FTP ou MongoDB:", error);
        }
      }
    }
  } catch (err) {
    console.error("Erro ao ler o diretório:", err);
  }
}

module.exports = {
  processFilesInDirectory,
};
