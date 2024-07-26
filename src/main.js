const { app, BrowserWindow, session, ipcMain } = require("electron");
const path = require("node:path");
const { spawn } = require("child_process");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow;
let widgetWindow;
let watchlist = [];
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}#/`);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

const createWidgetWindow = () => {
  const { screen } = require("electron");
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const widgetWidth = 400;
  const widgetHeight = 250;
  const taskbarHeight = height - primaryDisplay.workArea.height;
  const yPosition = height - taskbarHeight - widgetHeight;

  widgetWindow = new BrowserWindow({
    width: widgetWidth,
    height: widgetHeight,
    minWidth: widgetWidth,
    minHeight: 200,
    maxWidth: widgetWidth,
    resizable: true,
    x: width - widgetWidth,
    y: yPosition,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  widgetWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}#/widget`);

  // Open the DevTools.
  widgetWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
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

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
ipcMain.handle("get-watchlist", async (event, userId) => {
  return event.sender.send("get-watchlist-renderer", userId);
});

ipcMain.handle("update-watchlist", async (event, userId, watchlistItems) => {
  return event.sender.send("update-watchlist-renderer", userId, watchlistItems);
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
// Handle the 'launch-widget' event

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
