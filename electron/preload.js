import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld("electron", {
    confirmDialog: (message) => ipcRenderer.invoke("confirm-dialog", message),
    promptDialog: (message) => ipcRenderer.invoke("prompt-dialog", message),
});
