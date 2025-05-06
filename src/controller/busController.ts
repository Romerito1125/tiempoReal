import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient';

/**
 * Obtiene todos los buses disponibles.
 * Retorna idbus, idruta, lat y lon.
 */
export const getBuses = async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('bus')
      .select('idbus, idruta, lat, lon');

    if (error) {
      console.error('Error obteniendo buses:', error.message);
      res.status(500).json({ error: 'Error al obtener los buses.' });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Error inesperado:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * Obtiene un bus específico por su ID.
 */
export const getBusById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('bus')
      .select('*')
      .eq('idbus', id)
      .single();

    if (error) {
      console.error(`Bus con ID ${id} no encontrado:`, error.message);
      res.status(404).json({ error: 'Bus no encontrado.' });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Error inesperado:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * Obtiene todos los buses que pertenecen a una ruta específica.
 */
export const getBusesByRuta = async (req: Request, res: Response): Promise<void> => {
  const { idRuta } = req.params;

  try {
    const { data, error } = await supabase
      .from('bus')
      .select('idbus, idruta, lat, lon')
      .eq('idruta', idRuta);

    if (error) {
      console.error(`Error obteniendo buses de la ruta ${idRuta}:`, error.message);
      res.status(500).json({ error: 'Error al obtener los buses de la ruta.' });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Error inesperado:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
