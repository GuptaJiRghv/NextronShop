// Thin fetch wrapper for the Omnyx API (proxied to the backend by Vite at /api).

const TOKEN_KEY = 'omnyx_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY) || localStorage.getItem('nextron_token');

/**
 * @returns {Promise<{ ok: boolean, status: number, data: any }>}
 * Network failures throw; HTTP errors are returned with ok = false.
 */
const request = async (path, { method = 'GET', body, auth = true } = {}) => {
    const headers = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    const token = getToken();
    if (auth && token) headers['x-auth-token'] = token;

    const response = await fetch(`/api${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    let data = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    return { ok: response.ok, status: response.status, data };
};

export const api = {
    get: (path, options) => request(path, { ...options, method: 'GET' }),
    post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
    put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
    patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
    delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};
