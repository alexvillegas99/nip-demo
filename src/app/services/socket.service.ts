import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../env/env';

const config: SocketIoConfig = {
  url: environment.wsUrl, // URL del servidor WebSocket
};

@Injectable({
  providedIn: 'root',
})
export class SocketService extends Socket {
  private responseSubject = new Subject<any>();
  private historicoResponseSubject = new Subject<any>();
  private responsePLCSubject = new Subject<any>();

  constructor() {
    super(config);
    // Escucha los eventos de respuesta del servidor
    this.fromEvent<any>('findPlcDataResponse').subscribe((response) => {
      this.responseSubject.next(response);
    });
    this.fromEvent<any>('findHistoricoPlcDataResponse').subscribe((response) => {
      this.historicoResponseSubject.next(response);
    });
    // ESCUCHAR PARA sendFindPlcDataAll
    this.fromEvent<any>('findPlcDataAllResponse').subscribe((response) => {
      this.responsePLCSubject.next(response);
    });
  }
 

  // Método para enviar una solicitud al servidor WebSocket
sendFindPlcData(ip: string, tipo?: string): void {
  this.emit('findPlcData', { ip, tipo });
}


  // Método para recibir respuestas del servidor WebSocket
  receivePlcData(): Observable<any> {
    return this.responseSubject.asObservable();
  }

  // Método para enviar una solicitud de datos históricos
  sendFindHistoricoPlcData(ips: string[], rango: string, tipo?: any): void {
    this.emit('findHistoricoPlcData', { ips, rango, tipo });
  }
  
  
  

  // Método para recibir respuestas de datos históricos
  receiveHistoricoPlcData(): Observable<any> {
    return this.historicoResponseSubject.asObservable();
  }


   // Método para enviar una solicitud al servidor WebSocket
   sendFindPlcDataAll(): void {
    this.emit('findPlcDataAll');
  }

  // Método para recibir respuestas del servidor WebSocket
  receivePlcDataAll(): Observable<any> {
    return this.responsePLCSubject.asObservable();
  }
}
