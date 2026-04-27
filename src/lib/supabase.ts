import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dlgdswsvwvuzzsslwolm.supabase.co';
const supabaseKey = 'sb_publishable_PgWJrh39aisLu2Fjy4rsag_ew70UHtw';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveLead(email: string, name: string, brand: string, product: string) {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([{ email, name, brand, product }]);

    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error saving lead:', err);
    return { success: false, error: String(err) };
  }
}
