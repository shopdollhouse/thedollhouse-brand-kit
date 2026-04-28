const LEADS_KEY = 'dh_leads';

export async function saveLead(email: string, name: string, brand: string, product: string) {
  try {
    const existing = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
    const lead = {
      email,
      name,
      brand,
      product,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(LEADS_KEY, JSON.stringify([lead, ...existing].slice(0, 500)));
    return { success: true, data: lead };
  } catch (err) {
    console.error('Error saving lead locally:', err);
    return { success: false, error: String(err) };
  }
}
