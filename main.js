const { app, Tray, Menu, nativeImage, BrowserWindow, dialog, shell, ipcMain } = require('electron');

let tray;
let browserWindow;
let selectedPath = ''; // Adicionado para armazenar o caminho selecionado

app.whenReady().then(() => {
  let icon = nativeImage.createFromPath('./src/public/images/favicon.ico');
  icon = icon.resize({
    height: 16,
    width: 16
  });
  tray = new Tray(icon);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Selecionar Repositório com Arquivos",
      click: () => {
        dialog
          .showOpenDialog({
            properties: ["openDirectory"],
          })
          .then((result) => {
            if (!result.canceled) {
              selectedPath = result.filePaths[0];
              console.log("Selected path:", selectedPath);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
    },
    {
      label: 'Simular Popup', type: 'normal', click: () => {
        dialog.showMessageBox({
          title: 'Aviso',
          message: 'Você clicou no botão de abrir janela'
        });
      }
    },
    {
      label: 'Histórico de Transferências', type: 'normal', click: () => {
        Menu.setApplicationMenu(null);
        browserWindow = new BrowserWindow({
          icon: './src/public/images/favicon.ico',
          vibrancy: 'dark',
          darkTheme: true,
          autoHideMenuBar: true,
          title: 'Janela de Histórico',
          width: 1200,
          height: 800,
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: false // Adicionado para compatibilidade
          }
        });
        browserWindow.loadFile('./src/views/index.html');
      }
    }, 
    { type: 'separator' },
    {
      label: 'Suporte', type: 'normal',
      click: () => {
        shell.openExternal('https://google.com/');
      }
    }, 
    { type: 'separator' },
    { role: "quit", label: "Fechar" },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('Upload do CBPM');
  tray.setTitle('BiometricRouter');

  //Opção de abrir a tela de histórico ou a tela de seleção de folders
  //Botões esquerdo e direito
  // Adicionar evento de clique para abrir o menu de contexto
  tray.on("click", (event, bounds) => {
    tray.popUpContextMenu(contextMenu, bounds);
  });

  // Opcional: evento de clique com botão direito
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
