import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { spawn } from 'child_process';
import path from 'path';

let mainWindow;
let backendProcess;

function startBackend() {
  backendProcess = spawn(
    "C:/Users/lenovo/AppData/Local/Programs/Python/Python313/python.exe",
    ["c:/React/reactcode/backend/app.py"],
    { shell: true }
  );

  backendProcess.stdout.on("data", (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on("data", (data) => {
    console.error(`Backend Error: ${data}`);
  });

  backendProcess.on("close", (code) => {
    console.log(`Backend exited with code ${code}`);
  });
}

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

app.whenReady().then(() => {
  startBackend();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (backendProcess) backendProcess.kill(); 
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
