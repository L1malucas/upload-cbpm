const path = require("path");

function extractCamposBusca(nomeArquivo) {
  const baseName = path.basename(nomeArquivo, path.extname(nomeArquivo));
  return baseName.split("_");
}

module.exports = {
  extractCamposBusca,
};
