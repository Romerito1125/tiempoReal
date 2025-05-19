import { ViajePrototype } from "./viajePrototype";

export class ViajeRuta implements ViajePrototype {
  constructor(
    public origen: string,
    public destino: string,
    public algoritmo: "normal" | "rapido" = "normal"
  ) {}

  clone(): ViajePrototype {
    return new ViajeRuta(this.origen, this.destino, this.algoritmo);
  }

  planear(): string {
    return `Planificando viaje de ${this.origen} a ${this.destino} usando algoritmo ${this.algoritmo}`;
  }
}
