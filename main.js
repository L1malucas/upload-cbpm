const {
  app,
  Tray,
  Menu,
  nativeImage,
  BrowserWindow,
  dialog,
  shell,
  ipcMain,
} = require("electron");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const fileManager = require("./lib/fileManager");
const database = require("./lib/database");
const electronReload = require("electron-reload");

electronReload(__dirname);

let tray;
let browserWindow;

async function fetchFilesFromDatabase() {
  return [
    {
      Pasta: "/path/to/folder",
      NomeArquivo: "file1.txt",
      Operador: "OPERADOR1",
      ReferenciaFTP: "ftp://example.com/file1.txt",
      CamposBusca: ["FILE1", "TXT"],
      DataUpload: new Date().toISOString(),
      DataDigitalizacao: new Date().toISOString(),
      _id: "1",
    },
    {
      Pasta: "/path/to/folder",
      NomeArquivo: "file1.txt",
      Operador: "OPERADOR1",
      ReferenciaFTP: "ftp://example.com/file1.txt",
      CamposBusca: ["FILE1", "TXT"],
      DataUpload: new Date().toISOString(),
      DataDigitalizacao: new Date().toISOString(),
      _id: "1",
    },
  ];
}

// Função para enviar dados dos arquivos ao renderer
async function sendFilesToRenderer() {
  const files = await fetchFilesFromDatabase();
  if (browserWindow) {
    browserWindow.webContents.send("files-data", files);
  }
}

app.whenReady().then(() => {
  let icon = nativeImage.createFromPath(
    path.join(__dirname, "src/public/images/favicon.ico")
  );
  icon = icon.resize({ height: 16, width: 16 });
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Selecionar Repositório",
      click: async () => {
        const result = await dialog.showOpenDialog({
          properties: ["openDirectory"],
        });
        if (!result.canceled) {
          const selectedPath = result.filePaths[0];
          fs.readdir(selectedPath, async (err, files) => {
            if (err) {
              console.error("Erro ao ler a pasta:", err);
              return;
            }
            for (const file of files) {
              const localPath = path.join(selectedPath, file);
              const remotePath = `uploads/${file}`;
              try {
                const ftpUrl = await fileManager.uploadToFTP(
                  localPath,
                  remotePath
                );
                await database.saveFileToDatabase(localPath, ftpUrl);
                console.log(
                  `Arquivo ${file} enviado para o FTP e seus metadados salvos no MongoDB.`
                );
                sendFilesToRenderer();
              } catch (error) {
                console.error("Erro no FTP ou MongoDB:", error);
              }
            }
          });
        }
      },
    },
    // {
    //   label: "Simular Popup",
    //   type: "normal",
    //   click: () => {
    //     dialog.showMessageBox({
    //       title: "Aviso",
    //       message: "Você clicou no botão de abrir janela",
    //     });
    //   },
    // },
    {
      label: "Histórico de Transferências",
      type: "normal",
      click: () => {
        Menu.setApplicationMenu(null);
        browserWindow = new BrowserWindow({
          icon: path.join(__dirname, "src/public/images/favicon.ico"),
          vibrancy: "dark",
          darkTheme: true,
          autoHideMenuBar: true,
          title: "Histórico de Transferências",
          width: 1280,
          height: 800,
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
          },
        });

        browserWindow.loadFile(path.join(__dirname, "src/views/index.html"));
        browserWindow.webContents.once('did-finish-load', () => {
          sendFilesToRenderer();
        });
      },
    },
    { type: "separator" },
    {
      label: "Suporte",
      type: "normal",
      click: () => {
        shell.openExternal("https://api.whatsapp.com/send/?phone=5571999403953&text=Ol%C3%A1&type=phone_number&app_absent=0");
      },
    },
    { type: "separator" },
    { role: "quit", label: "Fechar" },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip("Upload do CBPM");
  tray.setTitle("BiometricRouter");

  tray.on("click", (event, bounds) => {
    tray.popUpContextMenu(contextMenu, bounds);
  });

  tray.on("right-click", () => {
    tray.popUpContextMenu(contextMenu);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
