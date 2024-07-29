const { MongoClient } = require("mongodb");
const path = require("path");

const { extractCamposBusca } = require("./fileManager");

const dbUri = process.env.DB_URI;
const dbName = process.env.DB_NAME;
const collectionName = process.env.DB_COLLECTION;

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
      Operador: "NomeDoOperador",
      ReferenciaFTP: ftpUrl,
      CamposBusca: camposBusca,
      DataUpload: new Date(),
      DataDigitalizacao: new Date(),
    };
    await collection.insertOne(fileData);
  } finally {
    await client.close();
  }
}

module.exports = { saveFileToDatabase };
