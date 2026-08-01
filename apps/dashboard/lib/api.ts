const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Terjadi kesalahan pada API');
    }
    return json;
  } catch (error: any) {
    console.warn(`⚠️ API Fetch Error [${endpoint}]:`, error.message);
    throw error;
  }
}

// ── Dashboard API Client Services ──

export const dashboardApi = {
  // Auth
  login: (data: any) => fetchApi<{ data: any }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => fetchApi<{ data: any }>('/auth/me'),

  // Members
  getMembers: (params: string = '') => fetchApi<{ data: any[]; summary: any }>(`/members?${params}`),
  createMember: (data: any) => fetchApi<{ data: any }>('/members', { method: 'POST', body: JSON.stringify(data) }),
  updateMemberStatus: (id: number, status: string) => fetchApi<{ data: any }>(`/members/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteMember: (id: number) => fetchApi<{ success: boolean }>(`/members/${id}`, { method: 'DELETE' }),

  // Join Requests
  getJoinRequests: (params: string = '') => fetchApi<{ data: any[]; summary: any }>(`/join-requests?${params}`),
  verifyJoinRequest: (id: number, status: string, adminNote?: string) => fetchApi<{ data: any }>(`/join-requests/${id}/verify`, { method: 'PATCH', body: JSON.stringify({ status, adminNote }) }),

  // Galleries
  getGalleries: (params: string = '') => fetchApi<{ data: any[]; summary: any }>(`/galleries?${params}`),
  createGallery: (data: any) => fetchApi<{ data: any }>('/galleries', { method: 'POST', body: JSON.stringify(data) }),
  deleteGallery: (id: number) => fetchApi<{ success: boolean }>(`/galleries/${id}`, { method: 'DELETE' }),

  // Articles
  getArticles: (params: string = '') => fetchApi<{ data: any[]; summary: any }>(`/articles?${params}`),
  createArticle: (data: any) => fetchApi<{ data: any }>('/articles', { method: 'POST', body: JSON.stringify(data) }),
  togglePublishArticle: (id: number, status: string) => fetchApi<{ data: any }>(`/articles/${id}/publish`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteArticle: (id: number) => fetchApi<{ success: boolean }>(`/articles/${id}`, { method: 'DELETE' }),
};
