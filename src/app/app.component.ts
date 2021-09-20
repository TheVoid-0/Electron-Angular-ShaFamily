import { Component, OnDestroy, OnInit } from '@angular/core';
import { IpcService } from './services/ipc.service';
import { HASH_ALGORITHMS, ENCODINGS } from './../../@common/hash-algorithms'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public text: string = '';
  public hashAlgorithms: string[] = HASH_ALGORITHMS;
  public hashSelect: string = this.hashAlgorithms[0];
  public encodings: string[] = ENCODINGS;
  public encodingSelect: string = this.encodings[0];
  public hash: string = ''

  constructor(private _ipcService: IpcService) {
    console.log('constructor code')
    this.createElectronListeners();
    this._ipcService.send('hash-page');
  }

  ngOnDestroy(): void {
    this._ipcService.removeAllFromPage('hash-page');
  }
  ngOnInit(): void {
  }

  criptografar() {
    console.log('criptografar');
    console.log(this.text, this.hashSelect, this.encodingSelect);
    this._ipcService.send(this.hashSelect, { text: this.text, encoding: this.encodingSelect });
  }

  createElectronListeners() {
    this._ipcService.on('hash-page', 'hash-ready', (event: Electron.IpcMessageEvent, args: any) => {
      console.log('hash-ready', args.hash);
      this.hash = args.hash;
    });

    this._ipcService.on('hash-page', 'hash-error', (event: Electron.IpcMessageEvent, args: any) => {
      console.log('hash-error', args.msg, args.error);
    });
  }
}
