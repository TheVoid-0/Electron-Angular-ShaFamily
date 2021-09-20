import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

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

}
