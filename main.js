const {
  app,
  Tray,
  Menu,
  nativeImage,
  BrowserWindow,
  dialog,
  shell,
} = require("electron");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

const fileManager = require("./lib/fileManager");
const database = require("./lib/database");

let tray;
let browserWindow;

app.whenReady().then(() => {
  let icon = nativeImage.createFromPath(
    path.join(__dirname, "src/public/images/favicon.ico")
  );
  icon = icon.resize({ height: 16, width: 16 });
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Selecionar Repositório com Arquivos",
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
              } catch (error) {
                console.error("Erro no FTP ou MongoDB:", error);
              }
            }
          });
        }
      },
    },
    {
      label: "Simular Popup",
      type: "normal",
      click: () => {
        dialog.showMessageBox({
          title: "Aviso",
          message: "Você clicou no botão de abrir janela",
        });
      },
    },
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
          width: 1200,
          height: 800,
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
          },
        });
        browserWindow.loadFile(path.join(__dirname, "src/views/index.html"));
      },
    },
    { type: "separator" },
    {
      label: "Suporte",
      type: "normal",
      click: () => {
        shell.openExternal("https://google.com/");
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
