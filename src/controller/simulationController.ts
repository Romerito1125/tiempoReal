
// src/controller/simulationController.ts

import { Request, Response } from "express";
import { startSimulation, stopSimulation, getBusesByRoute, getRecorridoPorRuta } from "../services/busSimulator";
import { supabase } from "../services/supabaseClient";

// Iniciar simulación para una ruta específica
export const startSimulationHandler = async (req: Request, res: Response) => {
  const { idruta } = req.body;

  if (!idruta) {
    return res.status(400).json({ error: 'Se requiere idruta' });
  }

  try {
    await startSimulation(idruta);
    res.json({ message: `Simulación iniciada para ruta ${idruta}` });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Detener simulación
export const stopSimulationHandler = async (_req: Request, res: Response) => {
  try {
    stopSimulation();
    res.json({ message: 'Simulación detenida' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getBusesByRouteHandler = async (req: Request, res: Response) => {
  const idRuta = req.params.idRuta;

  if (!idRuta) {
    return res.status(400).json({ error: 'idRuta inválida' });
  }

  try {
    const { data: ruta, error } = await supabase
      .from('rutas')
      .select('idruta')
      .eq('idruta', idRuta)
      .single();

    if (error || !ruta) {
      return res.status(404).json({ error: `La ruta '${idRuta}' no existe en el sistema` });
    }

    const buses = await getBusesByRoute(idRuta);
    res.json(buses);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getRecorridoHandler = async (req: Request, res: Response) => {
  const { idruta } = req.params;
  try {
    const estaciones = await getRecorridoPorRuta(idruta);
    res.json(estaciones);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
