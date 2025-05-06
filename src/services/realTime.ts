import { supabase } from './supabaseClient';

export const iniciarCanalesRealtime = () => {
  supabase.channel('custom-update-channel')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'bus' },
      (payload) => {
        console.log('Cambio recibido!', payload);
      }
    )
    .subscribe();
};
