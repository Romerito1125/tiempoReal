//src/services/busSimulator.ts

import { supabase } from './supabaseClient';
import { Subject } from './observer';
import { ConsoleLogger } from './consoleLogger';
import { Queue } from './estructuras/Queue';
import { Stack } from './estructuras/Stack';

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
  enVuelta: boolean;
  recorrido: Queue<Estacion> | Stack<Estacion>;
}

let buses: Bus[] = [];
let simulationInterval: NodeJS.Timeout | null = null;
let idRutaActual: string | null = null;
const INTERVALO_MOVIMIENTO = 60000; // 60 segundos

const busNotifier = new Subject();
busNotifier.attach(new ConsoleLogger());

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

  const recorridoPlano: Estacion[] = await getRecorridoPorRuta(idruta);
  if (!recorridoPlano.length) {
    throw new Error(`❌ No hay estaciones para la ruta ${idruta}`);
  }

  idRutaActual = idruta;

  buses = busesData.map((bus) => {
    const enVuelta = Math.random() < 0.5;
    const estructura = enVuelta ? new Stack<Estacion>() : new Queue<Estacion>();

    // Estación aleatoria de inicio
    const posicionInicial = Math.floor(Math.random() * recorridoPlano.length);
    const desde = enVuelta
      ? recorridoPlano.slice(0, posicionInicial + 1).reverse()
      : recorridoPlano.slice(posicionInicial);

    if (enVuelta) {
      const stack = estructura as Stack<Estacion>;
      desde.forEach(est => stack.push(est));
    } else {
      const queue = estructura as Queue<Estacion>;
      desde.forEach(est => queue.enqueue(est));
    }

    const estacionInicio = desde[0];

    return {
      idbus: bus.idbus,
      idruta: bus.idruta,
      lat: estacionInicio.lat,
      lon: estacionInicio.lon,
      enVuelta,
      recorrido: estructura,
    };
  });

  console.log(`🚌 Buses cargados para ruta ${idruta}:`, buses.map(b => `#${b.idbus} [${b.enVuelta ? "vuelta" : "ida"}]`));

  if (!simulationInterval) {
    // ⏱ Primer movimiento rápido tras 1 segundo
    setTimeout(() => {
      for (const bus of buses) {
        moverBus(bus, recorridoPlano);
      }

      // 🕐 Luego cada 60 segundos
      simulationInterval = setInterval(() => {
        for (const bus of buses) {
          moverBus(bus, recorridoPlano);
        }
      }, INTERVALO_MOVIMIENTO);

    }, 1000);
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

const moverBus = (bus: Bus, recorridoBase: Estacion[]) => {
  const siguiente = bus.enVuelta
    ? (bus.recorrido as Stack<Estacion>).pop()
    : (bus.recorrido as Queue<Estacion>).dequeue();

  if (!siguiente) {
    // 🚨 Aquí se invierte la dirección y se reinicia el recorrido
    bus.enVuelta = !bus.enVuelta;
    const nueva = bus.enVuelta ? new Stack<Estacion>() : new Queue<Estacion>();
    const ests = bus.enVuelta ? [...recorridoBase].reverse() : recorridoBase;

    if (bus.enVuelta) {
      const stack = nueva as Stack<Estacion>;
      ests.forEach(est => stack.push(est));
    } else {
      const queue = nueva as Queue<Estacion>;
      ests.forEach(est => queue.enqueue(est));
    }

    bus.recorrido = nueva;

    // ✅ ACTUALIZAR enVuelta en Supabase inmediatamente
    supabase
      .from('bus')
      .update({ enVuelta: bus.enVuelta })
      .eq('idbus', bus.idbus)
      .then(({ error }) => {
        if (error) console.error(`❌ Error al actualizar enVuelta del bus ${bus.idbus}:`, error.message);
      });

    return moverBus(bus, recorridoBase); // Reintentar movimiento con nueva dirección
  }

  bus.lat = siguiente.lat;
  bus.lon = siguiente.lon;

  busNotifier.notify(bus.idbus, bus.lat, bus.lon);

  supabase
    .from('bus')
    .update({
      lat: bus.lat,
      lon: bus.lon,
      enVuelta: bus.enVuelta,
    })
    .eq('idbus', bus.idbus)
    .then(({ error }) => {
      if (error) console.error(`❌ Error al actualizar bus ${bus.idbus}:`, error.message);
    });
};

export const getBusesByRoute = async (idruta: string): Promise<any[]> => {
  const { data: busesRaw, error: errorBuses } = await supabase
    .from('bus')
    .select('idbus, idruta, lat, lon, enVuelta')
    .eq('idruta', idruta);

  if (errorBuses || !busesRaw) throw new Error("Error obteniendo buses");

  const recorrido = await getRecorridoPorRuta(idruta);
  const primer = recorrido[0]?.nombre ?? "Desconocido";
  const ultimo = recorrido[recorrido.length - 1]?.nombre ?? "Desconocido";

  return busesRaw.map(bus => ({
    ...bus,
    destino: bus.enVuelta ? primer : ultimo
  }));
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
