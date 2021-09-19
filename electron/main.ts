import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { createHash } from 'crypto';
import { HASH_ALGORITHMS } from './../@common/hash-algorithms';

// detect serve mode
const args = process.argv.slice(1);
let serve: boolean = args.some(val => val === '--serve');

function createWindow() {

    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
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

    console.log('algoritmos', HASH_ALGORITHMS)
    for (const algorithm of HASH_ALGORITHMS) {
        ipcMain.on(algorithm, (event, args) => {
            let hashFunction = createHash(algorithm);
            hashFunction.update(args.text);
            let hash = hashFunction.digest(args.encoding);
            console.log('hash:', hash);
            event.sender.send('hash-ready', { hash: hash, text: args.text, encoding: args.encoding });
        });
    }
    // ipcMain.on('sha1', (event, args) => {
    //     let sha1 = createHash('sha1');
    //     sha1.update(args.text);
    //     let hash = sha1.digest('base64');
    //     console.log('hash:', hash);
    //     event.sender.send('hash-ready', { hash: hash, text: text });
    // });

    // ipcMain.on('sha224', (event, args) => {
    //     let sha224 = createHash('sha1');
    //     sha1.update(args.text);
    //     let hash = sha224.digest('base64');
    //     console.log('hash:', hash);
    //     event.sender.send('hash-ready', { hash: hash, text: text });
    // })
    // ipcMain.on('sha256', (event, args) => {
    //     let sha256 = createHash('sha1');
    //     sha1.update(args.text);
    //     let hash = sha256.digest('base64');
    //     console.log('hash:', hash);
    //     event.sender.send('hash-ready', { hash: hash, text: text });
    // })
    // ipcMain.on('sha384', (event, args) => {
    //     let sha384 = createHash('sha1');
    //     sha1.update(args.text);
    //     let hash = sha384.digest('base64');
    //     console.log('hash:', hash);
    //     event.sender.send('hash-ready', { hash: hash, text: text });
    // })
    // ipcMain.on('sha512', (event, args) => {
    //     let sha512 = createHash('sha1');
    //     sha1.update(args.text);
    //     let hash = sha512.digest('base64');
    //     console.log('hash:', hash);
    //     event.sender.send('hash-ready', { hash: hash, text: text });
    // })

    // // versão 3
    // ipcMain.on('sha3-224', (event, args) => {

    // })
    // ipcMain.on('sha3-256', (event, args) => {

    // })
    // ipcMain.on('sha3-384', (event, args) => {

    // })
    // ipcMain.on('sha3-512', (event, args) => {

    // })
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