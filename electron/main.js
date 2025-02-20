import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// Conversion de l'URL du module en chemin de fichier
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

// Fonction pour créer la fenêtre principale
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: "./src/assets/logo.png",
        webPreferences: {
            nodeIntegration: false, 
            contextIsolation: true, 
            sandbox: true, 
            preload: "./reactcode/electron/preload.js"
        }
    });

    // Charger l'URL de l'application
    mainWindow.loadURL('http://localhost:5173');

    // Gestion de la fermeture de la fenêtre
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Quand l'application est prête, créer la fenêtre
app.whenReady().then(createWindow);

// Gestion de la fermeture de l'application (MacOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Gestion de la réactivation de l'application (MacOS)
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});