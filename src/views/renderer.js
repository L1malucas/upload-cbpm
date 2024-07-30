const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '..', '..', 'lib'); // Adjust path as needed

const spaceUsedElement = document.getElementById('space-used');
const totalFilesElement = document.getElementById('total-files');
const lastUpdateElement = document.getElementById('last-update');
const fileListElement = document.getElementById('file-list');

fs.readdir(uploadDir, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  let totalSize = 0;
  let fileCount = 0;

  files.forEach((file, index) => {
    const filePath = path.join(uploadDir, file);
    const stats = fs.statSync(filePath);

    totalSize += stats.size;
    fileCount++;

    const row = document.createElement('tr');

    row.innerHTML = `
      <td><input type="checkbox"></td>
      <td>${file}</td>
      <td>${new Date(stats.mtime).toLocaleDateString('pt-BR')}</td>
      <td>${(stats.size / (1024 * 1024)).toFixed(2)} MB</td>
      <td>${uploadDir}</td>
      <td><button class="download">Baixar</button></td>
      <td><button class="delete">Excluir</button></td>
    `;

    fileListElement.appendChild(row);

    // gambi monstra
    row.querySelector('.download').addEventListener('click', () => downloadFile(filePath));
    row.querySelector('.delete').addEventListener('click', () => deleteFile(filePath));
  });

  totalFilesElement.textContent = `${fileCount} arquivos`;
  spaceUsedElement.textContent = `${(totalSize / (1024 * 1024)).toFixed(2)} MB de 100,00 GB`;
  lastUpdateElement.textContent = new Date().toLocaleString('pt-BR');
});

// Caso precise baixar, não sei
function downloadFile(filePath) {
  console.log('Download file:', filePath);
}
// Caso precise deletar, não sei
function deleteFile(filePath) {
  console.log('Delete file:', filePath);
}
