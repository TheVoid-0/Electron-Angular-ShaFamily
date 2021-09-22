import { Component, OnDestroy, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { IpcService } from './services/ipc.service';
import { HASH_ALGORITHMS, ENCODINGS } from './../../@common/hash-algorithms'
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  public text: string = '';
  public hashAlgorithms: string[] = HASH_ALGORITHMS;
  public algorithmSelect: string = this.hashAlgorithms[0];
  public encodings: string[] = ENCODINGS;
  public encodingSelect: string = this.encodings[0];
  public hash: string = ''
  public isElectronReady: boolean = false;

  constructor(private _ipcService: IpcService, private changeDetectorRef: ChangeDetectorRef, private _snackBar: MatSnackBar, private ngZone: NgZone) {
    console.log('constructor code')
    this._ipcService.initializePageListener('hash-page').subscribe((response) => {
      //  Electron listeners foram inicializados e estão prontos para receber mensagens
      console.log('electronReady code');
      this.isElectronReady = true;
    }, (error) => {
      console.log(error);
    });
  }

  ngOnDestroy(): void {
    this._ipcService.removeAllFromPage('hash-page');
  }

  criptografar() {
    console.log('criptografar');
    console.log(this.text, this.algorithmSelect, this.encodingSelect);
    this._ipcService.sendAndExpectResponse(this.algorithmSelect, { text: this.text, encoding: this.encodingSelect })
      .subscribe((response) => {
        console.log(this.algorithmSelect, 'response:', response);
        this.hash = response.body.hash;
        this.changeDetectorRef.detectChanges()
      }, (error: any) => {
        console.log(error);
        this.ngZone.run(() => {
          this._snackBar.open(error, 'fechar', { duration: 3000 });
        })
      });
  }
}
