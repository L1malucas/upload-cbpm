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
const electronReload = require("electron-reload");
electronReload(__dirname);

const { performance } = require("perf_hooks");

const { processFilesInDirectory } = require("./lib/fileManager");

let tray;
let browserWindow;

global.historyFiles = [];

function fetchFilesFromDatabase() {
  return global.historyFiles;
}

// Função para enviar dados dos arquivos ao renderer
async function sendFilesToRenderer() {
  const files = await fetchFilesFromDatabase();
  if (browserWindow) {
    browserWindow.webContents.send("files-data", files);
  }
}

function createTransferHistoryWindow() {
  if (browserWindow && !browserWindow.isDestroyed()) {
    browserWindow.focus();
    return;
  }

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
  browserWindow.webContents.once("did-finish-load", () => {
    sendFilesToRenderer();
  });

  browserWindow.on("closed", () => {
    browserWindow = null;
  });
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

          try {
            const startTotal = performance.now();

            await processFilesInDirectory(selectedPath, selectedPath);

            const endTotal = performance.now();
            const processDuration = (endTotal - startTotal) / 1000;
            console.log(
              `Processamento realizado com sucesso em: 
              ${processDuration.toFixed(2)} segundos`
            );
          } catch (error) {
            console.error("Erro ao processar arquivos:", error);
          }
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
      click: createTransferHistoryWindow,
    },
    { type: "separator" },
    {
      label: "Suporte",
      type: "normal",
      click: () => {
        shell.openExternal(
          "https://api.whatsapp.com/send/?phone=5571999403953&text=Ol%C3%A1&type=phone_number&app_absent=0"
        );
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
    createTransferHistoryWindow();
  }
});
