const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    return '/api/v1';
  }
  return 'http://localhost:4000/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

async function fetchFrontendApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const res = await fetch(`${API_BASE_URL}${formattedEndpoint}`, {
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
  // Upload photo
  uploadSingleImage: async (file: File, category = 'avatars') => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE_URL}/uploads/single?category=${encodeURIComponent(category)}`, {
      method: 'POST',
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Gagal mengunggah foto');
    }
    return json;
  },

  // Public Join Form Submission
  submitJoinForm: (data: {
    name: string;
    address: string;
    domicile?: string;
    divisionInterest?: string;
    whatsapp: string;
    motto?: string;
    avatarUrl?: string;
    avatar?: string;
  }) => fetchFrontendApi<{ data: any }>('/join-requests', { method: 'POST', body: JSON.stringify(data) }),

  // Public Galleries & Photos
  getGalleries: () => fetchFrontendApi<{ data: any[] }>('/galleries'),

  // Public Active Members
  getMembers: () => fetchFrontendApi<{ data: any[] }>('/members?status=Aktif'),

  // Public Articles & Pillars
  getArticles: () => fetchFrontendApi<{ data: any[] }>('/articles?status=Dipublikasikan'),
};
