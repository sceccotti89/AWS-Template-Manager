const {
  app,
  BrowserWindow,
  Menu,
  dialog
} = require('electron');
const tray = require('./tray');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: 'ng2-electron',
    icon: `${__dirname}/app/assets/angular-logo.png`,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  });

  const menu = Menu.buildFromTemplate([
    {
        label: 'Menu',
        submenu: [
            {
              label:'Open file',
              click() {
                const files = dialog.showOpenDialog({ properties: ['openFile', 'multiSelections']});
                // Send an event to let the main page to open a file.
                if (files && files.length > 0) {
                  mainWindow.webContents.send('openFile', files);
                }
              }
            },
            {
              label:'Exit',
              click() { 
                app.quit();
              }
            }
        ]
    }
  ])
  Menu.setApplicationMenu(menu); 

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // show app on tray menu
  tray.create(mainWindow);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});