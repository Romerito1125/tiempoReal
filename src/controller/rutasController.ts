import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient'; // ajusta la ruta según tu estructura

export const getAllRutas = async (_req: Request, res: Response) => {
  const { data, error } = await supabase.from('rutas').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const getRutaById = async (req: Request, res: Response) => {
  const { idruta } = req.params;
  const { data, error } = await supabase.from('rutas').select('*').eq('idruta', idruta).single();
  if (error) return res.status(404).json({ error: 'Ruta no encontrada' });
  res.json(data);
};

export const createRuta = async (req: Request, res: Response) => {
  const { idruta, tipo, horariolunvier, horariofinsem, LugarInicio, LugarFin, LugaresConcurridos } = req.body;
  const { data, error } = await supabase.from('rutas').insert([
    { idruta, tipo, horariolunvier, horariofinsem, LugarInicio, LugarFin, LugaresConcurridos }
  ]);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

export const updateRuta = async (req: Request, res: Response) => {
  const { idruta } = req.params;
  const { tipo, horariolunvier, horariofinsem, LugarInicio, LugarFin, LugaresConcurridos } = req.body;
  const { data, error } = await supabase.from('rutas')
    .update({ tipo, horariolunvier, horariofinsem, LugarInicio, LugarFin, LugaresConcurridos })
    .eq('idruta', idruta);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

export const deleteRuta = async (req: Request, res: Response) => {
  const { idruta } = req.params;
  const { error } = await supabase.from('rutas').delete().eq('idruta', idruta);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Ruta eliminada correctamente' });
};
