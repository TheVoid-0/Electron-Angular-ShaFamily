import { createHash, Hash } from "crypto";
import { ipcMain } from "electron";
import { HASH_ALGORITHMS } from './../@common/hash-algorithms';



export const createHashListener = () => {
    console.log('algoritmos', HASH_ALGORITHMS)
    for (const algorithm of HASH_ALGORITHMS) {
        ipcMain.on(algorithm, (event, args) => {
            console.log('algorithm:', algorithm);
            let hashFunction: Hash;
            try {
                hashFunction = createHash(algorithm);
            } catch (error) {
                event.sender.send('hash-error', { error: error, msg: 'Essa função de hash ainda não está disponível no package Crypto desse ambiente', text: args.text, encoding: args.encoding });
                return;
            }
            hashFunction.update(args.text);
            let hash = hashFunction.digest(args.encoding);
            console.log('hash:', hash);
            event.sender.send('hash-ready', { hash: hash, text: args.text, encoding: args.encoding });
        });
    }

    ipcMain.on('hash-page-closed', (event, args) => {
        for (const algorithm of HASH_ALGORITHMS) {
            ipcMain.removeAllListeners(algorithm);
        }
    })
}