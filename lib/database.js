const { MongoClient } = require("mongodb");
const path = require("path");

const { extractCamposBusca } = require("./fileManager");

// imports para metadados
const os = require('os');
const fs = require('fs');

const dbUri = process.env.DB_URI;
const dbName = process.env.DB_NAME;
const collectionName = process.env.DB_COLLECTION;

// variaveis para metadados
// poderia estar desestruturado com um const { username } = os.userInfo(); por exemplo, mas tava tarde
const username = os.userInfo().username;
const fileData = fs.stat(path);
const creationDate = fileData.birthtime;
const modificationDate = fileData.mtime;

async function saveFileToDatabase(filePath, ftpUrl) {
  const client = new MongoClient(dbUri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const camposBusca = extractCamposBusca(path.basename(filePath));

    const fileData = {
      Pasta: path.dirname(filePath),
      NomeArquivo: path.basename(filePath),
      Operador: username,
      ReferenciaFTP: ftpUrl,
      CamposBusca: camposBusca,
      DataUpload: creationDate.toISOString(),
      DataDigitalizacao: modificationDate.Date(),
    };
    await collection.insertOne(fileData);
  } finally {
    await client.close();
  }
}

module.exports = { saveFileToDatabase };
