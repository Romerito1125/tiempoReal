import { ViajePrototype } from "./viajePrototype";
import { ViajeRuta } from "./viajeRuta";

export class ViajeRegistry {
  private static prototipos: Record<string, ViajePrototype> = {};

  static registrar(nombre: string, prototipo: ViajePrototype): void {
    this.prototipos[nombre] = prototipo;
  }

  static obtener(nombre: string): ViajePrototype | null {
    const prototipo = this.prototipos[nombre];
    return prototipo ? prototipo.clone() : null;
  }
}

// Se registran algunos viajes comunes
ViajeRegistry.registrar("viaje_normal", new ViajeRuta("Univalle", "Universidades", "normal"));
ViajeRegistry.registrar("viaje_rapido", new ViajeRuta("Univalle", "Universidades", "rapido"));
