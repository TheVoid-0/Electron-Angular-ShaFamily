import { Component, OnInit } from '@angular/core';
import { IpcService } from './services/ipc.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public text: string = '';
  public hashSelect: string = '';
  public hashAlgorithms: string[] = ['sha1', 'sha224', 'sha256', 'sha384', 'sha512'];
  public encodingSelect: string = '';
  public encodings: string[] = ['hex', 'base64'];
  public hash: string = ''

  constructor(private _ipcService: IpcService) {
    console.log('constructor code')
    this._ipcService.on('hash-ready', (event: Electron.IpcMessageEvent, args: any) => {
      console.log('hash-ready', args.hash);
      this.hash = args.hash;
    });
  }
  ngOnInit(): void {
    // console.log('App component code', `sha256: ${(window as any).electronBridge}`);
    console.log('App component code', `sha256: ${(window as any).electronUnsafeBridge}`);
  }

  criptografar() {
    console.log('criptografar');
    console.log(this.text, this.hashSelect, this.encodingSelect);
    this._ipcService.send(this.hashSelect, { text: this.text, encoding: this.encodingSelect });
  }
}
