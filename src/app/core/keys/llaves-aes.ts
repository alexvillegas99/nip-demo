import * as crypto from 'crypto-js';

// clave G4ll3ta$B4Ck0Fff1c32023#JP --- 3A0FCD2C6B3532FD406C4E3F7199D49256711178E4A48725D9A86E34CE97336B
export const AES_COOKIE =
  '3A0FCD2C6B3532FD406C4E3F7199D49256711178E4A48725D9A86E34CE97336B';
const ivCookie = crypto.enc.Utf8.parse(AES_COOKIE);
export const CONFIG_AES_COOKIE = {
  keySize: 256 / 8,
  ivCookie,
  mode: crypto.mode.CBC,
  padding: crypto.pad.Pkcs7,
};

// clave Rut4$B4Ck0Fff1c32023#JP --- D5FD20F6F1F7667D922BC4DC2D4E1E05DD92B8065263381683C644AF8C834059
export const AES_RUTA =
  'D5FD20F6F1F7667D922BC4DC2D4E1E05DD92B8065263381683C644AF8C834059';
const iv = crypto.enc.Utf8.parse(AES_RUTA);
export const CONFIG_AES_RUTAS = {
  keySize: 256 / 8,
  iv,
  mode: crypto.mode.CBC,
  padding: crypto.pad.Pkcs7,
};

// clave R3QU3sTB4Ck0Fff1c32023#JP ---  5C692C6571459D2BE0BE493044C8927C239C80BB78390546A45C1174C3D29BA6
export const AES_REQUEST =
  '5C692C6571459D2BE0BE493044C8927C239C80BB78390546A45C1174C3D29BA6';
const ivRequest = crypto.enc.Utf8.parse(AES_REQUEST);
export const CONFIG_AES_REQUEST = {
  keySize: 256 / 8,
  ivRequest,
  mode: crypto.mode.CBC,
  padding: crypto.pad.Pkcs7,
};

// clave R3Sp0nS3B4Ck0Fff1c32023#JP --- C4974E78A0D49BD6042DA50BC09CBE94245175E7B2304476E3403B4CFD5B0734
export const AES_RESPONSE =
  'C4974E78A0D49BD6042DA50BC09CBE94245175E7B2304476E3403B4CFD5B0734';
const ivResponse = crypto.enc.Utf8.parse(AES_RESPONSE);
export const CONFIG_AES_RESPONSE = {
  keySize: 256 / 8,
  ivResponse,
  mode: crypto.mode.CBC,
  padding: crypto.pad.Pkcs7,
};
