// Dans votre main process (exemple: main.js)
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: "./src/assets/logo.png",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: "./preload.js" 
    }
  });

  mainWindow.loadURL('http://localhost:5173');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Gestion de la boîte de confirmation (remplace window.confirm)
ipcMain.handle("confirm-dialog", async (event, message) => {
  const result = dialog.showMessageBoxSync(mainWindow, {
    type: "warning",
    buttons: ["Annuler", "OK"],
    defaultId: 1,
    title: "Confirmation",
    message: message,
  });
  return result === 1;
});

// Gestion de la boîte de saisie du mot de passe (remplace prompt)
ipcMain.handle("prompt-dialog", async (event, message) => {
  const { response, checkboxChecked } = await dialog.showMessageBox(mainWindow, {
    type: "question",
    buttons: ["Annuler", "OK"],
    title: "Mot de passe requis",
    message: message,
    detail: "Entrez le mot de passe ci-dessous :",
    inputType: "password", // Note : Electron ne gère pas nativement les champs de saisie dans showMessageBox.
  });

  return response === 1 ? checkboxChecked : null;
});
