// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  ipcRenderer: ipcRenderer,
  launchWidget: () => ipcRenderer.send("create-widget-window"),
  createMainWindow: () => ipcRenderer.send("create-main-window"),
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  getWatchlist: (userId) => {
    return new Promise((resolve) => {
      ipcRenderer.once("get-watchlist-response", (_, result) =>
        resolve(result)
      );
      ipcRenderer.send("get-watchlist", userId);
    });
  },
  updateWatchlist: (userId, watchlistItems) => {
    return new Promise((resolve) => {
      ipcRenderer.once("update-watchlist-response", (_, result) =>
        resolve(result)
      );
      ipcRenderer.send("update-watchlist", userId, watchlistItems);
    });
  },
  getAlwaysOnTop: () => ipcRenderer.invoke("get-always-on-top"),
  setAlwaysOnTop: (value) => ipcRenderer.invoke("set-always-on-top", value),
});
