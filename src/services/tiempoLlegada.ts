import { getRecorridoPorRuta } from "./busSimulator";
import { supabase } from "./supabaseClient";

export const calcularTiempoLlegada = async (idestacion: string) => {
  const { data: busesData, error: errorBuses } = await supabase
    .from('bus')
    .select('*');

  if (errorBuses || !busesData) {
    throw new Error("No se pudo obtener información de los buses.");
  }

  const { data: rutasEstacion, error: errorRutaEstacion } = await supabase
    .from('ruta_estacion')
    .select('idruta, orden')
    .eq('idestacion', idestacion);

  if (errorRutaEstacion || !rutasEstacion?.length) {
    throw new Error("La estación no pertenece a ninguna ruta.");
  }

  const llegadas: {
    idbus: number;
    idruta: string;
    tiempo: string;
    destino: string;
  }[] = [];

  for (const { idruta, orden: ordenEstacion } of rutasEstacion) {
    const recorrido = await getRecorridoPorRuta(idruta);
    const buses = busesData.filter((b) => b.idruta === idruta);

    for (const bus of buses) {
      const posicionActual = recorrido.findIndex(
        (e) => e.lat === bus.lat && e.lon === bus.lon
      );
      if (posicionActual === -1) continue;

      const enVuelta = bus.enVuelta ?? false;
      const estacionesRestantes = enVuelta
        ? posicionActual - ordenEstacion
        : ordenEstacion - posicionActual;

      if (estacionesRestantes >= 0) {
        const tiempo = (estacionesRestantes + 1) * 1;

        const destino = enVuelta
          ? recorrido[0]?.nombre ?? "Desconocido"
          : recorrido[recorrido.length - 1]?.nombre ?? "Desconocido";

        llegadas.push({
          idbus: bus.idbus,
          idruta: bus.idruta,
          tiempo: `${tiempo} min`,
          destino,
        });
      }
    }
  }

  return llegadas
    .sort((a, b) => parseInt(a.tiempo) - parseInt(b.tiempo))
    .slice(0, 3);
};
