import { Request, Response } from "express";
import { planearViaje } from "../services/planearViaje";

export const planearViajeController = async (req: Request, res: Response) => {
  const { tipo, origen, destino } = req.body;

  try {
    const resultado = await planearViaje(tipo, origen, destino);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
