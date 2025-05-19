import { supabase } from "./supabaseClient";

export const planearViaje = async (
  tipo: string,
  origen: number,
  destino: number
): Promise<{
  rutas: string[];
  transbordo: boolean;
  estacionTransbordo?: number;
}> => {
  // Buscar rutas que contengan el origen
  const { data: rutasOrigen, error: error1 } = await supabase
    .from("ruta_estacion")
    .select("idruta")
    .eq("idestacion", origen);

  if (error1) throw new Error("Error al consultar rutas del origen");

  // Buscar rutas que contengan el destino
  const { data: rutasDestino, error: error2 } = await supabase
    .from("ruta_estacion")
    .select("idruta")
    .eq("idestacion", destino);

  if (error2) throw new Error("Error al consultar rutas del destino");

  const rutasOrigenSet = new Set(rutasOrigen.map((r) => r.idruta));
  const rutasDestinoSet = new Set(rutasDestino.map((r) => r.idruta));

  // 🔹 Caso 1: Ruta directa
  for (const ruta of rutasOrigenSet) {
    if (rutasDestinoSet.has(ruta)) {
      return {
        rutas: [ruta],
        transbordo: false
      };
    }
  }

  // 🔹 Caso 2: Intentar transbordo
  // Estaciones por ruta
  const rutasOrigenIds = [...rutasOrigenSet];
  const rutasDestinoIds = [...rutasDestinoSet];

  const { data: estacionesOrigen } = await supabase
    .from("ruta_estacion")
    .select("idestacion, idruta")
    .in("idruta", rutasOrigenIds);

  const { data: estacionesDestino } = await supabase
    .from("ruta_estacion")
    .select("idestacion, idruta")
    .in("idruta", rutasDestinoIds);

  if (!estacionesOrigen || !estacionesDestino) {
    throw new Error("Error al obtener estaciones para transbordo");
  }

  for (const estacionO of estacionesOrigen) {
    for (const estacionD of estacionesDestino) {
      if (estacionO.idestacion === estacionD.idestacion) {
        return {
          rutas: [estacionO.idruta, estacionD.idruta],
          transbordo: true,
          estacionTransbordo: estacionO.idestacion
        };
      }
    }
  }

  // 🔸 Sin ruta posible
  throw new Error("No se encontró una ruta posible entre las estaciones.");
};
