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
let idRutaActual: string | null = null;

const INTERVALO_MOVIMIENTO = 60000;

export const startSimulation = async (idruta: string) => {
  if (idruta === idRutaActual && buses.length > 0) {
    console.log(`✅ Simulación ya en curso para ruta ${idruta}`);
    return;
  }

  const { data: busesData, error } = await supabase
    .from('bus')
    .select('*')
    .eq('idruta', idruta);

  if (error || !busesData?.length) {
    throw new Error('❌ No se encontraron buses para la ruta o hubo error');
  }

  const { data: estacionesRuta, error: errorRuta } = await supabase
    .from('ruta_estacion')
    .select('orden, estaciones(*)')
    .eq('idruta', idruta)
    .order('orden', { ascending: true });

  if (errorRuta || !estacionesRuta?.length) {
    throw new Error(`❌ No se pudo cargar estaciones para la ruta ${idruta}`);
  }

  const recorrido: Estacion[] = estacionesRuta.map((r: any) => ({
    idestacion: r.estaciones.idestacion,
    nombre: r.estaciones.nombre,
    lat: parseFloat(r.estaciones.lat),
    lon: parseFloat(r.estaciones.lon),
  }));

  idRutaActual = idruta;

  buses = busesData.map((bus, index) => {
    const posicionInicial = (index * 2) % recorrido.length;
    return {
      idbus: bus.idbus,
      idruta: bus.idruta,
      lat: recorrido[posicionInicial].lat,
      lon: recorrido[posicionInicial].lon,
      recorrido,
      enVuelta: false,
      posicionActual: posicionInicial,
    };
  });

  console.log(`🚌 Buses cargados para ruta ${idruta}:`, buses.map(b => b.idbus));

  if (!simulationInterval) {
    simulationInterval = setInterval(() => {
      for (const bus of buses) {
        moverBus(bus);
      }
    }, INTERVALO_MOVIMIENTO);
  }
};

export const stopSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    buses = [];
    idRutaActual = null;
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

  supabase
    .from('bus')
    .update({ lat: bus.lat, lon: bus.lon })
    .eq('idbus', bus.idbus)
    .then(({ error }) => {
      if (error) console.error(`❌ Error al actualizar bus ${bus.idbus}:`, error.message);
    });

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

export const getBusesByRoute = async (idruta: string): Promise<Bus[]> => {
  const { data, error } = await supabase
    .from('bus')
    .select('*')
    .eq('idruta', idruta);
  if (error) throw new Error("Error obteniendo buses: " + error.message);
  return data as Bus[];
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