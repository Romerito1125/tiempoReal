import { Request, Response } from "express";
import { obtenerTodasLasEstaciones, obtenerEstacionPorId } from "../services/estacionesService";

export const listarEstaciones = async (req: Request, res: Response) => {
  try {
    const estaciones = await obtenerTodasLasEstaciones();
    res.status(200).json(estaciones);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
export const getEstacionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data, error } = await obtenerEstacionPorId(id);

  if (error || !data) {
    return res.status(404).json({ message: "Estación no encontrada" });
  }

  res.status(200).json({
    nombre: data.nombre,
    zona: data.Zona
  });
};
