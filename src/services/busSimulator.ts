import { supabase } from './supabaseClient';

interface Estacion {
  idestacion: string;
  nombre: string;
  lat: number;
  lon: number;
}

interface Bus {
  idbus: number;
  idruta: string;
  lat: number;
  lon: number;
  recorrido: Estacion[];
  enVuelta: boolean;
  posicionActual: number;
}

let buses: Bus[] = [];
let simulationInterval: NodeJS.Timeout | null = null;
const INTERVALO_MOVIMIENTO = 60000; // 60 segundos

// Iniciar simulación solo para una ruta específica
export const startSimulation = async (idruta: string) => {
  const { data: busesData, error } = await supabase
    .from('bus')
    .select('*')
    .eq('idruta', idruta);

  if (error) throw new Error('Error cargando buses: ' + error.message);

  // Cargar recorrido único de la ruta
  const { data: estacionesRuta, error: errorRuta } = await supabase
    .from('ruta_estacion')
    .select('orden, estaciones(*)')
    .eq('idruta', idruta)
    .order('orden', { ascending: true });

  if (errorRuta || !estacionesRuta?.length) {
    throw new Error(`No se pudo cargar estaciones para la ruta ${idruta}`);
  }

  const recorrido: Estacion[] = estacionesRuta.map((r: any) => ({
    idestacion: r.estaciones.idestacion,
    nombre: r.estaciones.nombre,
    lat: parseFloat(r.estaciones.lat),
    lon: parseFloat(r.estaciones.lon),
  }));

  // Asignar buses con ese recorrido
  buses = (busesData || []).map(bus => ({
    idbus: bus.idbus,
    idruta: bus.idruta,
    lat: recorrido[0].lat,
    lon: recorrido[0].lon,
    recorrido,
    enVuelta: false,
    posicionActual: 0,
  }));

  console.log(`🚌 Buses cargados para ruta ${idruta}:`, buses);

  // Lanzar movimiento
  if (simulationInterval) clearInterval(simulationInterval);
  simulationInterval = setInterval(() => {
    for (const bus of buses) {
      moverBus(bus);
    }
  }, INTERVALO_MOVIMIENTO);
};

export const stopSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log('🛑 Simulación detenida');
  }
};

const moverBus = (bus: Bus) => {
  const recorrido = bus.recorrido;
  if (!recorrido.length) return;

  const estacion = recorrido[bus.posicionActual];

  bus.lat = estacion.lat;
  bus.lon = estacion.lon;

  console.log(`🚏 Bus ${bus.idbus} → ${estacion.nombre} (${bus.lat}, ${bus.lon})`);

  if (!bus.enVuelta) {
    bus.posicionActual++;
    if (bus.posicionActual >= recorrido.length) {
      bus.enVuelta = true;
      bus.posicionActual = recorrido.length - 2;
    }
  } else {
    bus.posicionActual--;
    if (bus.posicionActual < 0) {
      bus.enVuelta = false;
      bus.posicionActual = 1;
    }
  }
};

export const getBusesByRoute = async (idruta: string) => {
  return buses.filter(bus => bus.idruta === idruta);
};

export const getRecorridoPorRuta = async (idruta: string): Promise<Estacion[]> => {
  const { data, error } = await supabase
    .from('ruta_estacion')
    .select('orden, estaciones(*)')
    .eq('idruta', idruta)
    .order('orden', { ascending: true });

  if (error) throw new Error('Error trayendo estaciones: ' + error.message);

  return (data || []).map((r: any) => ({
    idestacion: r.estaciones.idestacion,
    nombre: r.estaciones.nombre,
    lat: parseFloat(r.estaciones.lat),
    lon: parseFloat(r.estaciones.lon),
  }));
};
