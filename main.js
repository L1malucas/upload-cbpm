const { app, Tray, Menu, nativeImage, BrowserWindow, dialog, shell, ipcMain } = require('electron');

let tray
let browserWindow;

app.whenReady().then(() => {
  let icon = nativeImage.createFromPath('./src/public/images/favicon.ico');
  icon = icon.resize({
    height: 16,
    width: 16
  });
  tray = new Tray(icon);
  tray.on("click", function () {
    tray.popUpContextMenu();
  });
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'pastas', type: 'normal', click: () => {
        dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
      },
    },
    {
      label: 'Abrir Janela', type: 'normal', click: () => {
        dialog.showMessageBox({
          title: 'Aviso',
          message: 'Você clicou no botão de abrir janela'
        })
      }
    },
    {
      label: 'Janela de Histórico', type: 'normal', click: () => {
        Menu.setApplicationMenu(

        )
        browserWindow = new BrowserWindow({
          frame: false,
          icon: './src/public/images/favicon.ico',
          vibrancy: 'dark',
          darkTheme: true,
          autoHideMenuBar: true, title: 'Janela de Histórico',
          width: 1200,
          height: 800,
          webPreferences: {
            nodeIntegration: true
          }
        })
        browserWindow.loadFile('./src/views/index.html')
      }
    }, { type: 'separator' },
    {
      label: 'Suporte', type: 'normal',
      click: () => {
        shell.openExternal('https://google.com/');
      }
    }, { type: 'separator' },
    {
      label: 'Fechar', type: 'normal', click: () => {
        app.quit();
      }
    }
  ])
  tray.setContextMenu(contextMenu)
  tray.setToolTip('Upload do CBPM')
  tray.setTitle('BiometricRouter')

})