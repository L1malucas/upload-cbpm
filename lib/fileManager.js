const ftp = require("basic-ftp");
const path = require("path");

// Configurações do FTP
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

function extractCamposBusca(nomeArquivo) {
  const baseName = path.basename(nomeArquivo, path.extname(nomeArquivo));
  const baseNameWithoutAccents = baseName
    .normalize("NFD") // Normaliza para decompor caracteres acentuados
    .replace(/[\u0300-\u036f]/g, ""); // Remove os diacríticos
  // Alterando pra uppercase tbm, em formato de array, nao sei se vai impactar na sua indexação
  return baseNameWithoutAccents.split("_").map(part => part.toUpperCase());
  // return baseName.split("_").toUpperCase();
}

module.exports = {
  uploadToFTP,
  extractCamposBusca,
};
