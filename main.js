const path = require("path");
const url = require("url");
const { app, BrowserWindow } = require("electron");

const log = require("electron-log");
const autoUpdater = require("electron-updater").autoUpdater;
const debug = /--debug/.test(process.argv[2])

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

function sendStatusToWindow(text, err) {
  win.webContents.send('updater-message', text, err);
}

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600, show: false });
  win.setProgressBar(2)

  // and load the index.html of the app.
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  // Launch fullscreen with DevTools open, usage: npm run debug
  if (debug) {
    win.webContents.openDevTools()
    win.maximize()
    require('devtron').install()
  }

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  win.once('ready-to-show', () => {
    win.show()
  })
}






autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('update-checking', null);
})

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('update-available', info);
})

autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('update-not-available', info);
})

autoUpdater.on('error', (err) => {
  sendStatusToWindow('update-error', err);
})

autoUpdater.on('download-progress', (progressObj) => {
  percent = progressObj.percent / 100
  win.setProgressBar(percent)
})

autoUpdater.on('update-downloaded', (info) => {
  win.setProgressBar(-1)
  sendStatusToWindow('update-downloaded', null);
  
  setTimeout(() => autoUpdater.quitAndInstall(), 5000) 
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
