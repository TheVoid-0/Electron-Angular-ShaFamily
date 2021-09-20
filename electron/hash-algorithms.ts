import { createHash, Hash, getHashes } from "crypto";
import { ipcMain, IpcMainEvent } from "electron";
import { HASH_ALGORITHMS } from './../@common/hash-algorithms';



export const createHashListener = (event: IpcMainEvent) => {
    console.log('algoritmos esperados', HASH_ALGORITHMS);
    console.log('algoritmos disponíveis', getHashes());
    for (const algorithm of HASH_ALGORITHMS) {
        ipcMain.on(algorithm, (event, args) => {
            console.log('algorithm:', algorithm);
            let hashFunction: Hash;
            try {
                hashFunction = createHash(algorithm);
            } catch (error) {
                event.sender.send(`${algorithm}-ready`, { error: error, message: 'Essa função de hash ainda não está disponível no package Crypto desse ambiente', text: args.text, encoding: args.encoding });
                return;
            }
            hashFunction.update(args.text);
            let hash = hashFunction.digest(args.encoding);
            console.log('hash:', hash);
            event.sender.send(`${algorithm}-ready`, { hash: hash, text: args.text, encoding: args.encoding });
        });
    }

    ipcMain.on('hash-page-closed', (event, args) => {
        for (const algorithm of HASH_ALGORITHMS) {
            ipcMain.removeAllListeners(algorithm);
        }
    })
    event.sender.send('hash-page-ready');
}