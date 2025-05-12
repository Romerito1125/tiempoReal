// src/services/consoleLogger.ts

import { Observer } from "./observer";

export class ConsoleLogger implements Observer {
  update(busId: number, lat: number, lon: number): void {
    console.log(`📍 Bus ${busId} actualizado a (${lat}, ${lon})`);
  }
}
