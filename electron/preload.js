
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

// const { contextBridge } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    console.log('Preload code')
    // contextBridge.exposeInMainWorld('electronBridge', {
    //     sha256: sha256
    // });
})
