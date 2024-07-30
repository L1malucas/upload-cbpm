const { MongoClient } = require("mongodb");
const path = require("path");

const { extractCamposBusca } = require("./fileManager");

// imports para metadados
const os = require("os");
const fs = require("fs");

const dbUri = process.env.DB_URI;
const dbName = process.env.DB_NAME;
const collectionName = process.env.DB_COLLECTION;

// variaveis para metadados
const username = os.userInfo().username;

async function saveFileToDatabase(filePath, ftpUrl) {
  const client = new MongoClient(dbUri);
  try {
    // Obter estatísticas do arquivo usando fs.promises.stat para lidar com promessas
    const stats = await fs.promises.stat(filePath);
    const creationDate = stats.birthtime;
    const dataUpload = new Date();

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const camposBusca = extractCamposBusca(path.basename(filePath));
    // Acho melhor padronizar e colocar todos os campos de texto em uppercase
    const fileData = {
      Pasta: path.dirname(filePath),
      NomeArquivo: path.basename(filePath),
      Operador: username.toUpperCase(),
      ReferenciaFTP: ftpUrl.toUpperCase(),
      CamposBusca: camposBusca,
      DataUpload: dataUpload,
      DataDigitalizacao: creationDate,
    };

    await collection.insertOne(fileData);
  } finally {
    await client.close();
  }
}

module.exports = { saveFileToDatabase };
