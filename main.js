const { app, BrowserWindow, ipcMain } = require('electron')
const url = require("url");
const path = require("path");
const {
    createHash,
} = require('crypto');

let mainWindow

const HASH_ALGORITHMS = require('./@common/hash-algorithms');

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'electron', 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    mainWindow.loadFile(path.join(__dirname, '/dist/angular-ShaFamily/index.html'));

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function () {
        mainWindow = null
    })

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

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})