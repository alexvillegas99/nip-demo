import { Injectable } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import {Socket, SocketIoConfig} from 'ngx-socket-io';

const config: SocketIoConfig = {
  url: "https://localhost:3000",
};
@Injectable({
  providedIn: 'root',
})
/* export class SocketService {
  private socket$;
  
  constructor() {
    // Aquí debes colocar la URL de tu servidor WebSocket
    console.log('Connecting to WebSocket server');
    this.socket$ = webSocket('ws://localhost:4000');
    console.log('Connected to WebSocket server');
  }

  // Método para enviar un mensaje al servidor WebSocket
  sendMessage(message: string) {

    this.socket$.next(message);
  }

  // Método para recibir mensajes del servidor WebSocket
  receiveMessage(eventName: string): Observable<any> {
    return this.socket$.asObservable().pipe(
      filter((message: any) => message.event === eventName),
      map((message: any) => message.data)
    );
  }
}


const config: SocketIoConfig = {
  url: "http://localhost:4000",
};
@Injectable({
  providedIn: 'root',
}) */
export class SocketService extends  Socket {
  constructor() {
    super(config);
    //this.conectar();
  }

  conectar() {
    this.connect()
  }

  desconectar() {
    this.disconnect()
  }


}

