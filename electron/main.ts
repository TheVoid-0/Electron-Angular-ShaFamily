import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { createHashListener } from './hash-algorithms';

// verifica se foi passado o argumento para dar auto-reload
const args: string[] = process.argv.slice(1);
let watch: boolean = args.some(val => val === '--watch');

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

    if (watch) {

        // Habilita o auto-reload do angular na janela da aplicação electron
        require('electron-reload')/*(__dirname, {
            // electron: require(`${__dirname}/node_modules/electron`)
            electron: path.join(__dirname, 'node_modules/electron', 'electron'),
        });*/
        mainWindow.loadURL('http://localhost:4200');

    } else {
        mainWindow.loadFile(path.join(__dirname, '..', 'angular-ShaFamily/index.html'));
    }


    // Abre o inspecionador.
    //mainWindow.webContents.openDevTools();

    ipcMain.on('hash-page', (event, ...args) => {
        createHashListener(event);
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // No macOS o comportamento padrão dos apps é recriar a janela
        // ao clicar no ícone que fica na 'dock', caso não tenha nenhuma aberta.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})