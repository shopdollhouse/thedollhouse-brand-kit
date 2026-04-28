const LEADS_KEY = 'dh_leads';

type LocalLead = {
  email: string;
  name: string;
  brand: string;
  product: string;
  createdAt: string;
};

const readLeads = (): LocalLead[] => {
  try {
    return JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
  } catch {
    return [];
  }
};

export const supabase = {
  from: () => ({
    insert: async (rows: LocalLead[]) => {
      const existing = readLeads();
      localStorage.setItem(LEADS_KEY, JSON.stringify([...rows, ...existing].slice(0, 500)));
      return { data: rows, error: null };
    },
  }),
};

export async function saveLead(email: string, name: string, brand: string, product: string) {
  try {
    const lead = {
      email,
      name,
      brand,
      product,
      createdAt: new Date().toISOString(),
    };

    const existing = readLeads();
    localStorage.setItem(LEADS_KEY, JSON.stringify([lead, ...existing].slice(0, 500)));
    return { success: true, data: lead };
  } catch (err) {
    console.error('Error saving lead locally:', err);
    return { success: false, error: String(err) };
  }
}
