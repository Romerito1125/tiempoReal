// src/services/observer.ts

export interface Observer {
    update(busId: number, lat: number, lon: number): void;
  }
  
  export class Subject {
    private observers: Observer[] = [];
  
    attach(observer: Observer) {
      this.observers.push(observer);
    }
  
    detach(observer: Observer) {
      this.observers = this.observers.filter(o => o !== observer);
    }
  
    notify(busId: number, lat: number, lon: number) {
      for (const observer of this.observers) {
        observer.update(busId, lat, lon);
      }
    }
  }
  