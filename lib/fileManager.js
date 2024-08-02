const path = require("path");
const fs = require("fs");
const { performance } = require("perf_hooks");

const { saveFileToDatabase } = require("./database");
const { uploadToFTP } = require("./ftpManager");

const processedPrefix = "processed_";

function addPrefixToFile(filePath) {
  const dir = path.dirname(filePath);
  const base = path.basename(filePath);
  const newBase = processedPrefix + base;
  const newFilePath = path.join(dir, newBase);

  fs.renameSync(filePath, newFilePath);
  return newFilePath;
}

function isFileProcessed(filePath) {
  const base = path.basename(filePath);
  return base.startsWith(processedPrefix);
}

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
        if (isFileProcessed(fullPath)) {
          console.log(`O arquivo ${item.name} já foi processado.`);
          continue;
        }

        const relativePath = path.relative(basePath, fullPath);
        // Altera o caminho para usar barras padrão do Unix para FTP
        const remotePath = `CBPM-GED/${relativePath}`.replace(/\\/g, "/");

        try {
          const startTotal = performance.now();
          const ftpUrl = await uploadToFTP(fullPath, remotePath);
          await saveFileToDatabase(fullPath, ftpUrl);
          addPrefixToFile(fullPath);
          const endTotal = performance.now();

          console.log(
            `Tempo de processamento do Arquivo ${item.name}: ${
              endTotal - startTotal
            }ms`
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
