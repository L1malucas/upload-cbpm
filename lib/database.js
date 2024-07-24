const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'fileDatabase';
const collectionName = 'files';

async function saveFilesToDatabase(files) {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const fileDocs = files.map(file => ({
      fileName: file.fileName,
      content: file.content,
      dateAdded: new Date()
    }));
    const result = await collection.insertMany(fileDocs);

    console.log(`${result.insertedCount} files were inserted into the database.`);
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    await client.close();
  }
}

module.exports = { saveFilesToDatabase };
