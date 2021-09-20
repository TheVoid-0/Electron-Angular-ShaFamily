import { Injectable } from '@angular/core';
import { IpcRenderer, IpcRendererEvent } from 'electron';
import { Observable, Subscriber } from 'rxjs';

type IpcResponse = {
  event: IpcRendererEvent,
  body: any
}
@Injectable({
  providedIn: 'root'
})
export class IpcService {

  private _ipc: IpcRenderer | undefined = void 0;
  // private listeners: Array<{ page: string, channels: string[] }> = new Array<{ page: string, channels: string[] }>();
  private listeners: { [key: string]: string[] } = {};

  constructor() {
    console.log('service constructor code')
    if (window.require) {
      try {
        this._ipc = window.require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('Electron\'s IPC was not loaded');
    }
  }

  public on(page: string, channel: string, listener: any): void {
    if (!this._ipc) {
      return;
    }
    this._ipc.on(channel, listener);

    // Verifica se já existe um listener dessa página, se sima adiciona esse canal aos listeners dessa página, se não, cria a página com esse canal como listener
    this.listeners[page] ? this.listeners[page].push(channel) : this.listeners = { [page]: [channel] };
  }

  public send(channel: string, ...args: any[]): void {
    if (!this._ipc) {
      return;
    }
    this._ipc.send(channel, ...args);
  }

  public sendAndExpectResponse(channel: string, ...args: any[]): Observable<IpcResponse> {
    return new Observable<IpcResponse>(subscriber => {
      if (!this._ipc) {
        subscriber.error('Electron ipc não foi carregado corretamente');
        return;
      }
      this.createResponseListener(subscriber, channel);
      this._ipc.send(channel, ...args);
    });

  }

  private createResponseListener(subscriber: Subscriber<IpcResponse>, channel: string) {
    this._ipc?.on(`${channel}-ready`, (event, args) => {

      if (args?.error) {
        subscriber.error(args.message)
      } else {
        subscriber.next({ event, body: { ...args } });
      }
      this._ipc?.removeAllListeners(channel);
      subscriber.complete();
    });
  }

  public removeFromChannel(channel: string): void {
    this._ipc?.removeAllListeners(channel);
  }

  public removeAllFromPage(page: string): void {
    for (const channel of this.listeners[page]) {
      this._ipc?.removeAllListeners(channel);
    }
    this._ipc?.send(`${page}-closed`);
  }

  public isAvailable(): boolean {
    return !!this._ipc;
  }


  /**
   * Envia uma mensagem pelo ipc do electron para indicar que essa página foi inicializada e transmite a mensagem através de um observable quando obtém resposta
   * 
   * @param page nome da página na qual o electron precisa saber que foi inicializada. IMPORTANTE: esse nome deve ser igual ao que o listener do electron espera
   */
  public initializePageListener(page: string): Observable<IpcResponse> {
    return this.sendAndExpectResponse(page);
  }
}
