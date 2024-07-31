const { ipcRenderer } = require('electron');
const path = require('path');

const spaceUsedElement = document.getElementById('space-used');
const totalFilesElement = document.getElementById('total-files');
const lastUpdateElement = document.getElementById('last-update');
const fileListElement = document.getElementById('file-list');

ipcRenderer.on('files-data', (event, files) => {
  fileListElement.innerHTML = '';

  let totalSize = 0;
  let fileCount = files.length;

  files.forEach((file) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${file.Pasta}</td>
      <td>${file.NomeArquivo}</td>
      <td>${file.Operador}</td>
      <td><a href="${file.ReferenciaFTP}" target="_blank">${file.ReferenciaFTP}</a></td>
      <td>${file.CamposBusca.join(', ')}</td>
      <td>${new Date(file.DataUpload).toLocaleString('pt-BR')}</td>
      <td>${new Date(file.DataDigitalizacao).toLocaleString('pt-BR')}</td>
      <td><button class="download" data-file-id="${file._id}">Baixar</button></td>
      <td><button class="delete" data-file-id="${file._id}">Excluir</button></td>
    `;

    fileListElement.appendChild(row);

    totalSize += file.Size; 
    row.querySelector('.download').addEventListener('click', () => downloadFile(file._id));
    row.querySelector('.delete').addEventListener('click', () => deleteFile(file._id));
  });

  totalFilesElement.textContent = `${fileCount} arquivos`;
  spaceUsedElement.textContent = `${(totalSize / (1024 * 1024)).toFixed(2)} MB de 100,00 GB`;
  lastUpdateElement.textContent = new Date().toLocaleString('pt-BR');
});

function downloadFile(fileId) {
  console.log('Download file with ID:', fileId);
}

function deleteFile(fileId) {
  console.log('Delete file with ID:', fileId);
}
