import { Request, Response } from "express";
import { planearViaje } from "../services/planearViaje";
import { ViajeRegistry } from "../services/estructuras/viajeRegistry";
import { ViajePrototype } from "../services/estructuras/viajePrototype";

export const planearViajeController = async (req: Request, res: Response) => {
  const { origen, destino } = req.body;

  try {
    //const viajePrototype: ViajePrototype | null = ViajeRegistry.obtener(tipo);

   /* if (viajePrototype) {
      const resultado = viajePrototype.planear();
      console.log(resultado);
      return res.status(200).json({
        resultado,
        usadoPrototype: true
      });
    }*/

    // 2️⃣ Si no existe el prototype, usar planearViaje normal
    const resultadoDB = await planearViaje(origen, destino);

    res.status(200).json({
      ...resultadoDB,
      usadoPrototype: false
    });

  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
