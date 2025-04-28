import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';
import {
  AES_REQUEST,
  AES_RUTA,
  AES_COOKIE,
  CONFIG_AES_COOKIE,
  CONFIG_AES_REQUEST,
  CONFIG_AES_RUTAS,
  CONFIG_AES_RESPONSE,
  AES_RESPONSE,
} from '../keys/llaves-aes';

@Injectable({
  providedIn: 'root',
})
export class EncriptadoService {
  constructor() {}

  encriptarInformacionRutas(valor: string): any {
    const existeValor = valor && valor !== null;
    if (existeValor) {
      const encrypted = crypto.AES.encrypt(
        crypto.enc.Utf8.parse(valor),
        AES_RUTA,
        CONFIG_AES_RUTAS
      );
      return encrypted.toString();
    }
  }

  desencriptarInformacionRutas(valor: string): any {
    const existeValor = valor && valor != null;
    if (existeValor) {
      const decrypted = crypto.AES.decrypt(valor, AES_RUTA, CONFIG_AES_RUTAS);
      return JSON.parse(decrypted.toString(crypto.enc.Utf8));
    }
  }

  encriptarInformacionCookie(valor: string): any {
    const existeValor = valor && valor !== null;
    if (existeValor) {
      const encrypted = crypto.AES.encrypt(
        crypto.enc.Utf8.parse(valor),
        AES_COOKIE,
        CONFIG_AES_COOKIE
      );
      return encrypted.toString();
    }
  }

  desencriptarInformacionCookie(valor: string): any {
    const existeValor = valor && valor != null;
    if (existeValor) {
      const decrypted = crypto.AES.decrypt(
        valor,
        AES_COOKIE,
        CONFIG_AES_COOKIE
      );
      return decrypted.toString(crypto.enc.Utf8);
    }
  }

  encriptarInformacionRequest(valor: any): any {
    const existeValor = valor && valor != null;
    if (existeValor) {
      const encrypted = crypto.AES.encrypt(
        crypto.enc.Utf8.parse(valor),
        AES_REQUEST,
        CONFIG_AES_REQUEST
      );
      return encrypted.toString();
    }
  }

  desencriptarInformacionResponse(valor: any): any {
    const existeValor = valor && valor != null;
    if (existeValor) {
      const decrypted = crypto.AES.decrypt(
        valor,
        AES_RESPONSE,
        CONFIG_AES_RESPONSE
      );
      return decrypted.toString(crypto.enc.Utf8);
    }
  }
}
