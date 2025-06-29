const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Store operations
  getStoreValue: (key) => ipcRenderer.invoke('get-store-value', key),
  setStoreValue: (key, value) => ipcRenderer.invoke('set-store-value', key, value),
  
  // File system operations
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  
  // Dialog operations
  showError: (title, message) => ipcRenderer.invoke('show-error', title, message),
  showInfo: (title, message) => ipcRenderer.invoke('show-info', title, message),
  
  // Navigation
  onNavigate: (callback) => ipcRenderer.on('navigate', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
}); 