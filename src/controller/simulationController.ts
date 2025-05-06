// src/controllers/simulationController.ts

import { Request, Response, RequestHandler } from "express";
import { startSimulation, stopSimulation, getBusesByRoute } from "../services/busSimulator";

// Iniciar simulación
export const startSimulationHandler = async (_req: Request, res: Response) => {
  try {
    await startSimulation();
    res.json({ message: 'Simulación iniciada' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Detener simulación
export const stopSimulationHandler = (_req: Request, res: Response) => {
  try {
    stopSimulation();
    res.json({ message: 'Simulación detenida' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getBusesByRouteHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
      const idRuta = Number(req.params.idRuta);
  
      if (isNaN(idRuta)) {
        res.status(400).json({ error: 'idRuta inválida' });
        return; // Opcional, pero ayuda a que no siga ejecutando.
      }
  
      const buses = await getBusesByRoute(idRuta);
      res.json(buses);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };
  
  
