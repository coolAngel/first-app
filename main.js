const path = require("path");
const url = require("url");
const { app, BrowserWindow } = require("electron");

const log = require("electron-log");
const autoUpdater = require("electron-updater").autoUpdater;


//-------------------------------------------------------------------
// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...', app.getVersion());




// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('updater-message', text);
}

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 });

  // and load the index.html of the app.
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  // Open the DevTools.
  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}






autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
  log.info('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  log.info('Update available.');
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available.');
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  log.info('Error in auto-updater. ' + err);
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  log.info(log_message);
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded', info);
  sendStatusToWindow('Update downloaded. Plz restart the Application.');
});







// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow()
  autoUpdater.checkForUpdatesAndNotify();
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
