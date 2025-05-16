//src/controller/llegadasController.ts

import { Request, Response } from "express";
import { obtenerLlegadasPorEstacion } from "../services/llegadasGenerales";

export const getLlegadasGeneralesHandler = async (_req: Request, res: Response) => {
  try {
    const datos = await obtenerLlegadasPorEstacion();
    res.json(datos);
  } catch (error) {
    console.error("Error obteniendo llegadas generales:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
