import { Request, Response } from "express";
import { planearViaje } from "../services/planearViaje";
import { ViajeRegistry } from "../services/estructuras/viajeRegistry";
import { ViajePrototype } from "../services/estructuras/viajePrototype";

export const planearViajeController = async (req: Request, res: Response) => {
  const { tipo, origen, destino } = req.body;

  try {
    // 1️⃣ Siempre intentar usar el Prototype primero
    const viajePrototype: ViajePrototype | null = ViajeRegistry.obtener(tipo);

    if (viajePrototype) {
      // Si existe el Prototype, usar su método planear()
      const resultado = viajePrototype.planear();

      return res.status(200).json({
        resultado,
        usadoPrototype: true
      });
    }

    // 2️⃣ Si no existe el prototype, usar planearViaje normal
    const resultadoDB = await planearViaje(tipo, origen, destino);

    res.status(200).json({
      ...resultadoDB,
      usadoPrototype: false
    });

  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
