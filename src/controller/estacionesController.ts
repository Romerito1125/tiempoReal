import { Request, Response } from "express";
import { obtenerTodasLasEstaciones } from "../services/estacionesService";

export const listarEstaciones = async (req: Request, res: Response) => {
  try {
    const estaciones = await obtenerTodasLasEstaciones();
    res.status(200).json(estaciones);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
