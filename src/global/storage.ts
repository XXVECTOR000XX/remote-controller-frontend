import { signal } from "@angular/core";

export type Computer = {
  image_64: string,
  id: string,
  name_user: string,
  input_log: string, // de estos atributos para abajo es propio del frontend de angular
  input_keyboard_enable: boolean,
  input_mouse_enable: boolean
};

export const computers = signal<Map<string, Computer>>(new Map);

export const actions_hidden = signal<boolean>(false);

export const conection: WebSocket = new WebSocket('wss://control-remoto.peresprueba29.workers.dev/');