const {
  app,
  BrowserWindow,
  session,
  ipcMain,
  screen,
  Menu,
} = require("electron");
const { updateElectronApp, UpdateSourceType } = require("update-electron-app");
const log = require("electron-log");
// Check for updates as soon as the app is ready
updateElectronApp({
  updateSource: {
    host: "https://update.electronjs.org",
    type: UpdateSourceType.ElectronPublicUpdateService,
    repo: "Emergeflow-Technologies-Pvt-Ltd/stkfocus-desktop-forge",
  },
  logger: log,
});
const expApp = require("./new_server");
console.log("app", expApp);

// Initialize logging

log.info("App starting...");

if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow;
let widgetWindow;
let watchlist = ["INFY", "RELIANCE"];

const appPath = app.getAppPath();
console.log("appPath", appPath);

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: false,
    },
  });

  mainWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}#/`);

  mainWindow.webContents.on("did-finish-load", () => {
    log.info("Checking for updates!");
  });
};

const createWidgetWindow = () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const widgetWidth = 400;
  const widgetHeight = 400;
  const taskbarHeight = height - primaryDisplay.workArea.height;
  const yPosition = height - taskbarHeight - widgetHeight;

  widgetWindow = new BrowserWindow({
    width: widgetWidth,
    height: widgetHeight,
    minWidth: widgetWidth,
    minHeight: 300,
    maxWidth: widgetWidth,
    resizable: true,
    x: width - widgetWidth,
    y: yPosition,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  widgetWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}#/widget`);

  widgetWindow.webContents.on("did-finish-load", () => {
    widgetWindow.webContents.send("receive-watchlist", watchlist);
  });
};

//window taskbar menu
const createMenu = () => {
  const menuTemplate = [
    {
      label: "Stkfocus",
      submenu: [
        {
          label: "Check for Updates",
          click: () => {
            log.info("Manual update check triggered.");
            ipcMain.emit("check-for-updates");
          },
        },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forcereload" },
        { role: "toggledevtools" },
        { type: "separator" },
        { role: "resetzoom" },
        { role: "zoomin" },
        { role: "zoomout" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      role: "window",
      submenu: [{ role: "minimize" }, { role: "close" }],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
};

app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [""],
      },
    });
  });

  // spawn("node", ["./server/server.js"]);

  createWindow();
  createMenu();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("send-watchlist-to-widget", async () => {
  if (widgetWindow) {
    widgetWindow.webContents.send("receive-watchlist", watchlist);
  }
});

ipcMain.handle("update-watchlist", async (event, userId, watchlistItems) => {
  watchlist = watchlistItems;
  if (widgetWindow) {
    widgetWindow.webContents.send("receive-watchlist", watchlist);
  }
});

ipcMain.on("create-widget-window", () => {
  if (mainWindow) {
    mainWindow.close();
    mainWindow = null;
  }
  createWidgetWindow();
});

ipcMain.on("create-main-window", () => {
  if (widgetWindow) {
    widgetWindow.close();
    widgetWindow = null;
  }
  createWindow();
});

ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});
ipcMain.on("check-for-updates", () => {
  log.info("Manual update check triggered.");
  updateElectronApp({
    updateSource: {
      host: "https://update.electronjs.org",
      type: UpdateSourceType.ElectronPublicUpdateService,
      repo: "Emergeflow-Technologies-Pvt-Ltd/stkfocus-desktop-forge",
    },
    logger: log,
  });
});
// // Auto-update event handlers
// autoUpdater.on("update-available", () => {
//   log.info("Update available.");
//   if (mainWindow) {
//     mainWindow.webContents.send("update_available");
//   }
// });

// autoUpdater.on("update-downloaded", () => {
//   log.info("Update downloaded.");
//   if (mainWindow) {
//     mainWindow.webContents.send("update_downloaded");
//   }
// });

// ipcMain.on("restart_app", () => {
//   autoUpdater.quitAndInstall();
// });
