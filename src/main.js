const { app, BrowserWindow, session, ipcMain } = require("electron");
const path = require("node:path");
const { spawn } = require("child_process");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

// Initialize logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

log.info("App starting...");

if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow;
let widgetWindow;
let watchlist = ["INFY", "RELIANCE"];

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

  function UpsertKeyValue(obj, keyToChange, value) {
    const keyToChangeLower = keyToChange.toLowerCase();
    for (const key of Object.keys(obj)) {
      if (key.toLowerCase() === keyToChangeLower) {
        // Reassign old key
        obj[key] = value;
        // Done
        return;
      }
    }
    // Insert at end instead
    obj[keyToChange] = value;
  }

  mainWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}#/`, {
    extraHeaders: {
      watchlist: JSON.stringify(watchlist),
    },
  });

  mainWindow.webContents.on("did-finish-load", () => {
    console.log("Checking for updates!");
    autoUpdater.checkForUpdatesAndNotify();
  });

  // mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
  //   (details, callback) => {
  //     const { requestHeaders } = details;
  //     UpsertKeyValue(requestHeaders, "Access-Control-Allow-Origin", ["*"]);
  //     callback({ requestHeaders });
  //   }
  // );

  // mainWindow.webContents.session.webRequest.onHeadersReceived(
  //   (details, callback) => {
  //     const { responseHeaders } = details;
  //     UpsertKeyValue(responseHeaders, "Access-Control-Allow-Origin", ["*"]);
  //     UpsertKeyValue(responseHeaders, "Access-Control-Allow-Headers", ["*"]);
  //     callback({
  //       responseHeaders,
  //     });
  //   }
  // );
};

const createWidgetWindow = () => {
  const { screen } = require("electron");
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

app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [""],
      },
    });
  });

  spawn("python", ["./server/server.py"]);
  createWindow();

  // Check for updates as soon as the app is ready
  autoUpdater.checkForUpdatesAndNotify();

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

// Auto-update event handlers
autoUpdater.on("update-available", () => {
  if (mainWindow) {
    mainWindow.webContents.send("update_available");
  }
});

autoUpdater.on("update-downloaded", () => {
  if (mainWindow) {
    mainWindow.webContents.send("update_downloaded");
  }
});

ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});
