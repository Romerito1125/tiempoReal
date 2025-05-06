// src/services/busSimulator.ts

import { supabase } from "./supabaseClient";

interface Bus {
  idbus: number;
  idruta: number;
  lat: number;
  lon: number;
}


interface Position {
  lat: number;
  lon: number;
}

const posicionesT31: Position[] = [
  { lat: 3.42158, lon: -76.5205 },
  { lat: 3.42200, lon: -76.5210 },
  { lat: 3.42250, lon: -76.5215 },
  { lat: 3.42300, lon: -76.5220 },
  { lat: 3.42350, lon: -76.5225 },

];


let buses: Bus[] = []; // Todos los buses cargados
let simulationInterval: NodeJS.Timeout | null = null;
const movementDelta = 0.0005; // Cuánto se mueve el bus cada vez

// Cargar los buses desde la BD
export const loadBusesFromDB = async () => {
  const { data, error } = await supabase.from('bus').select('*');

  if (error) throw new Error('Error cargando buses: ' + error.message);

  buses = data as Bus[];
  console.log('Buses cargados:', buses);
};

// Función para mover buses
const moveBuses = async () => {
  for (const bus of buses) {
    if (bus.idbus % 5 === 0) {

      bus.lat += movementDelta;
      bus.lon += movementDelta;

      await supabase
        .from('bus')
        .update({ lat: bus.lat, lon: bus.lon })
        .eq('idbus', bus.idbus);

      console.log(`Bus Realtime ${bus.idbus} movido en Supabase`);
    } else {
      // Los demás se mueven solo en memoria, es decir, en local.
      bus.lat += movementDelta;
      bus.lon += movementDelta;
      console.log(`Bus Simulado ${bus.idbus} movido internamente`);
    }
  }
};

// Iniciar la simulación
export const startSimulation = async () => {
  if (simulationInterval) {
    console.log('Simulación ya activa.');
    return;
  }

  await loadBusesFromDB();

  simulationInterval = setInterval(moveBuses, 120000); // Cada 120s se actualiza el estado
  console.log('Simulación iniciada.');
};

// Detener la simulación
export const stopSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log('Simulación detenida.');
  } else {
    console.log('No hay simulación activa.');
  }
};

// Obtener buses por ruta
export const getBusesByRoute = (idruta: number) => {
  return buses.filter((bus) => bus.idruta === idruta);
};
