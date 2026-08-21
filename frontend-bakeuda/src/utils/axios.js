import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menyisipkan Token JWT ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Mengubah path relatif file (misal: /uploads/foto.jpg) menjadi URL absolut
 * yang sesuai dengan Base URL API saat ini.
 * 
 * Jika rawUrl sudah berupa URL absolut (data lama dari database),
 * maka domain/IP-nya akan diganti agar sesuai dengan koneksi saat ini.
 * 
 * @param {string} rawUrl - Path relatif ("/uploads/foto.jpg") atau URL absolut lama
 * @returns {string} URL absolut yang siap digunakan untuk menampilkan file
 */
export function resolveFileUrl(rawUrl) {
  if (!rawUrl) return '';

  // Ambil Base URL tanpa suffix "/api"
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const baseHost = apiBase.replace(/\/api\/?$/, '');

  // Kasus 1: Path relatif (data baru dari backend yang sudah diperbaiki)
  if (rawUrl.startsWith('/')) {
    return `${baseHost}${rawUrl}`;
  }

  // Kasus 2: URL absolut (data lama yang sudah terlanjur masuk database)
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    try {
      const url = new URL(rawUrl);
      return `${baseHost}${url.pathname}`;
    } catch {
      return rawUrl;
    }
  }

  // Kasus 3: Hanya nama file saja (fallback)
  return `${baseHost}/uploads/${rawUrl}`;
}

export default api;
