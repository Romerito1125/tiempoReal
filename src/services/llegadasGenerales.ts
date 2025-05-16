//src/services/llegadasGenerales.ts

import { supabase } from "./supabaseClient";

export const obtenerLlegadasPorEstacion = async () => {
  const { data: estaciones, error: errorEstaciones } = await supabase
    .from("estaciones")
    .select("idestacion, nombre, lat, lon");

  if (errorEstaciones || !estaciones) {
    throw new Error("Error obteniendo estaciones");
  }

  const { data: buses, error: errorBuses } = await supabase
    .from("bus")
    .select("*");

  if (errorBuses || !buses) {
    throw new Error("❌ Error obteniendo buses");
  }

  const { data: rutasEstaciones, error: errorRutaEst } = await supabase
    .from("ruta_estacion")
    .select("idruta, orden, idestacion")
    .order("orden", { ascending: true });

  if (errorRutaEst || !rutasEstaciones) {
    throw new Error("Error obteniendo rutas-estaciones");
  }

  const resultados: {
    idestacion: number;
    nombre: string;
    buses: {
      idbus: number;
      ruta: string;
      tiempo_estimado_min: number;
    }[];
  }[] = [];

  for (const estacion of estaciones) {
    const busesEstacion = [];

    for (const bus of buses) {
      const recorridoRuta = rutasEstaciones.filter(r => r.idruta === bus.idruta);
      const indexEstacion = recorridoRuta.findIndex(r => r.idestacion === estacion.idestacion);
      const posicionBus = recorridoRuta.findIndex(r =>
        r.idestacion &&
        parseFloat(estacion.lat) === parseFloat(bus.lat) &&
        parseFloat(estacion.lon) === parseFloat(bus.lon)
      );

      if (indexEstacion !== -1 && posicionBus !== -1 && posicionBus < indexEstacion) {
        busesEstacion.push({
          idbus: bus.idbus,
          ruta: bus.idruta,
          tiempo_estimado_min: indexEstacion - posicionBus + 1
        });
      }
    }

    resultados.push({
      idestacion: estacion.idestacion,
      nombre: estacion.nombre,
      buses: busesEstacion
    });
  }

  return resultados;
};
