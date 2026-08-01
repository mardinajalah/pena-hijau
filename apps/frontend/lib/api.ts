const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function fetchFrontendApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      },
      ...options,
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Terjadi kesalahan API');
    }
    return json;
  } catch (error: any) {
    console.warn(`⚠️ Frontend API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

export const frontendApi = {
  // Public Join Form Submission
  submitJoinForm: (data: {
    name: string;
    address: string;
    domicile?: string;
    divisionInterest?: string;
    whatsapp: string;
    motto?: string;
  }) => fetchFrontendApi<{ data: any }>('/join-requests', { method: 'POST', body: JSON.stringify(data) }),

  // Public Galleries & Photos
  getGalleries: () => fetchFrontendApi<{ data: any[] }>('/galleries'),

  // Public Active Members
  getMembers: () => fetchFrontendApi<{ data: any[] }>('/members?status=Aktif'),

  // Public Articles & Pillars
  getArticles: () => fetchFrontendApi<{ data: any[] }>('/articles?status=Dipublikasikan'),
};
