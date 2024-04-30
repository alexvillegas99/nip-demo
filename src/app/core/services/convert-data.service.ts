import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root',
})
export class ConvertDataService {
  constructor() {}
  secretKey =
    'acab6356c9806310943face74ea9b6304f0d6d72ed59b892ee05b00c1496694d';
  // Método para convertir un JSON a string
  public convertirJsonAString(data: any): any {
    try {
      return CryptoJS.AES.encrypt(
        JSON.stringify(data),
        this.secretKey
      ).toString();
    } catch (error) {
     
      return null;
    }
  }

  // Método para convertir un string a JSON
  public convertirStringAJson(jsonString: string): any {
    try {
      const decryptedData = CryptoJS.AES.decrypt(
        jsonString,
        this.secretKey
      ).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    } catch (error) {
      return null;
    }
  }
}
