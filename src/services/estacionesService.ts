import { supabase } from "./supabaseClient";

export const obtenerTodasLasEstaciones = async () => {
  const { data, error } = await supabase.from("estaciones").select("*");

  if (error) {
    throw new Error("Error al obtener estaciones: " + error.message);
  }

  return data;
};
