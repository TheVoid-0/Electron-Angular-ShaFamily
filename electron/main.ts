import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { createHashListener } from './hash-algorithms';

// detect serve mode
const args: string[] = process.argv.slice(1);
let serve: boolean = args.some(val => val === '--serve');

function createWindow() {

    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: '#fff',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    if (serve) {

        // get dynamic version from localhost:4200
        require('electron-reload')/*(__dirname, {
            // electron: require(`${__dirname}/node_modules/electron`)
            electron: path.join(__dirname, 'node_modules/electron', 'electron'),
        });*/
        mainWindow.loadURL('http://localhost:4200');

    } else {
        mainWindow.loadFile(path.join(__dirname, '..', 'angular-ShaFamily/index.html'));
    }


    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    ipcMain.on('hash-page', () => {
        createHashListener();
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})