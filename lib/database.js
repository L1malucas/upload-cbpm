const { PrismaClient } = require("@prisma/client");
const path = require("path");
const os = require("os");
const fs = require("fs").promises;

const { extractCamposBusca } = require("./utils");

const prisma = new PrismaClient();
const username = os.userInfo().username;

async function saveFileToDatabase(filePath, ftpUrl) {
  try {
    // Obter estatísticas do arquivo usando fs.promises.stat para lidar com promessas
    const stats = await fs.stat(filePath);
    const creationDate = stats.birthtime;
    const dataUpload = new Date();

    const camposBusca = extractCamposBusca(path.basename(filePath));
    // Padronizar e colocar todos os campos de texto em uppercase
    const fileData = {
      Pasta: path.dirname(filePath).toUpperCase(),
      NomeArquivo: path.basename(filePath).toUpperCase(),
      Operador: username.toUpperCase(),
      ReferenciaFTP: ftpUrl.toUpperCase(),
      CamposBusca: camposBusca,
      DataUpload: dataUpload,
      DataDigitalizacao: creationDate,
    };

    await prisma.arquivos.create({
      data: fileData,
    });

    console.log("Dados salvos no MongoDB.");
  } catch (error) {
    console.error("Erro ao salvar dados no MongoDB:", error);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = { saveFileToDatabase };

