//src/controller/simulationController.ts

import { Request, Response } from "express";
import {
  startSimulation,
  stopSimulation,
  getBusesByRoute,
  getRecorridoPorRuta,
} from "../services/busSimulator";
import { supabase } from "../services/supabaseClient";
import { calcularTiempoLlegada } from "../services/tiempoLlegada";

// Iniciar simulación para una ruta específica
export const startSimulationHandler = async (req: Request, res: Response) => {
  const { idruta } = req.body;

  if (!idruta) {
    return res.status(400).json({ error: "Se requiere idruta" });
  }

  try {
    await startSimulation(idruta); // Esto ya notifica a observadores al mover el bus
    res.json({ message: `Simulación iniciada para ruta ${idruta}` });
  } catch (error) {
    console.error(`❌ Error al iniciar simulación:`, error);
    res.status(500).json({ error: (error as Error).message });
  }
};

// Detener simulación global
export const stopSimulationHandler = async (_req: Request, res: Response) => {
  try {
    stopSimulation();
    res.json({ message: "Simulación detenida" });
  } catch (error) {
    console.error(`❌ Error al detener simulación:`, error);
    res.status(500).json({ error: (error as Error).message });
  }
};

// Obtener buses de una ruta
export const getBusesByRouteHandler = async (req: Request, res: Response) => {
  const idRuta = req.params.idRuta;

  if (!idRuta) {
    return res.status(400).json({ error: 'idRuta inválida' });
  }

  try {
    const buses = await getBusesByRoute(idRuta);
    res.json(buses); // 👈 esto ya incluirá enVuelta
  } catch (error) {
    console.error(`❌ Error al obtener buses:`, error);
    res.status(500).json({ error: (error as Error).message });
  }
};

// Obtener recorrido (estaciones) de una ruta
export const getRecorridoHandler = async (req: Request, res: Response) => {
  const { idruta } = req.params;

  if (!idruta) {
    return res.status(400).json({ error: "Se requiere idruta" });
  }

  try {
    const estaciones = await getRecorridoPorRuta(idruta);
    res.json(estaciones);
  } catch (error) {
    console.error(`❌ Error al obtener recorrido:`, error);
    res.status(500).json({ error: (error as Error).message });
  }
};


export const getTiempoLlegadaHandler = async (req: Request, res: Response) => {
  const { idestacion } = req.params;

  if (!idestacion) {
    return res.status(400).json({ error: "Se requiere idestacion" });
  }

  try {
    const resultado = await calcularTiempoLlegada(idestacion);
    res.json(resultado);
  } catch (error) {
    console.error("❌ Error al calcular tiempo de llegada:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};
