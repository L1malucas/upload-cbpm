// Configurações do FTP
const path = require("path");
const ftp = require("basic-ftp");

const ftpConfig = {
  host: process.env.FTP_HOST,
  port: process.env.FTP_PORT,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
};

async function uploadToFTP(localPath, remotePath) {
  const client = new ftp.Client();

  try {
    await client.access(ftpConfig);
    await client.ensureDir(path.dirname(remotePath));
    await client.uploadFrom(localPath, path.basename(remotePath));
    // Verificar qual o melhor retorno para a ref do arquivo no FTP
    return `${remotePath}`;
    // return `ftp://${ftpConfig.host}:${ftpConfig.port}/${remotePath}`;
  } catch (error) {
    throw error;
  } finally {
    client.close();
  }
}

module.exports = {
  uploadToFTP,
};
