const { MongoClient } = require("mongodb");
const path = require("path");

const mongoUrl = process.env.DB_URL;
const dbName = process.env.DB_NAME;
const collectionName = process.env.DB_COLLECTION;

async function saveFileToDatabase(filePath, ftpUrl) {
  const client = new MongoClient(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const fileData = {
      Pasta: path.dirname(filePath),
      NomeArquivo: path.basename(filePath),
      Operador: "NomeDoOperador",
      FTPUrl: ftpUrl,
      CamposBusca: ["01", "2024"], // "Mockado"
      DataUpload: new Date(),
      DataDigitalizacao: new Date(),
    };
    await collection.insertOne(fileData);
  } finally {
    await client.close();
  }
}

module.exports = { saveFileToDatabase };
