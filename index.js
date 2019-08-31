const {
  app,
  BrowserWindow,
  Menu,
  dialog
} = require('electron');
require('electron-reload')(__dirname);

// Mantiene un riferimento globale all'oggetto window, se non lo fai, la finestra sarà
// chiusa automaticamente quando l'oggetto JavaScript sarà garbage collected.
let win;

function createWindow () {
  // Creazione della finestra del browser.
  win = new BrowserWindow({
    width: 1000,
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
                dialog.showOpenDialog({ properties: ['openFile', 'multiSelections']})
                  .then((files) => {
                    // Send an event to let the main page to open a file.
                    win.webContents.send('openFile', files);
                  }).catch((err) => console.err(err));
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

  // and load the main.html of the app.
  win.loadFile('src/main/main.html');

  // Apre il Pannello degli Strumenti di Sviluppo.
  win.webContents.openDevTools();

  // Emesso quando la finestra viene chiusa.
  win.on('closed', () => {
    // Eliminiamo il riferimento dell'oggetto window;  solitamente si tiene traccia delle finestre
    // in array se l'applicazione supporta più finestre, questo è il momento in cui 
    // si dovrebbe eliminare l'elemento corrispondente.
    win = null;
  });
}

// Questo metodo viene chiamato quando Electron ha finito
// l'inizializzazione ed è pronto a creare le finestre browser.
// Alcune API possono essere utilizzate solo dopo che si verifica questo evento.
app.on('ready', createWindow);

// Terminiamo l'App quando tutte le finestre vengono chiuse.
app.on('window-all-closed', () => {
  // Su macOS è comune che l'applicazione e la barra menù 
  // restano attive finché l'utente non esce espressamente tramite i tasti Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // Su macOS è comune ri-creare la finestra dell'app quando
  // viene cliccata l'icona sul dock e non ci sono altre finestre aperte.
  if (win === null) {
    createWindow();
  }
});

// in questo file possiamo includere il codice specifico necessario 
// alla nostra app. Si può anche mettere il codice in file separati e richiederlo qui.