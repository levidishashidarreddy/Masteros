/**
 * Utility to generate valid, cross-device accessible URLs for QR codes.
 * 
 * Priority:
 * 1. VITE_APP_URL environment variable if set
 * 2. Deployed production URL (when origin is not localhost or 127.0.0.1)
 * 3. Auto-detected LAN IP during local development (e.g., http://192.168.1.5:5173)
 */

export const getCrossDeviceBaseUrl = () => {
  // 1. Explicit env override
  if (import.meta.env.VITE_APP_URL) {
    let envUrl = import.meta.env.VITE_APP_URL.trim();
    if (!envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
      envUrl = `http://${envUrl}`;
    }
    return envUrl.replace(/\/$/, '');
  }

  if (typeof window === 'undefined') {
    return 'http://localhost:5173';
  }

  const { hostname, port, protocol } = window.location;

  // 2. Production or live domain (e.g. masteros.app, vercel.app, firebaseapp.com)
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  if (!isLocalhost) {
    return window.location.origin;
  }

  // 3. Localhost development -> replace with host computer's LAN IPv4 address
  const lanIp = typeof __DEV_LAN_IP__ !== 'undefined' && __DEV_LAN_IP__ ? __DEV_LAN_IP__ : 'localhost';
  const devPort = port ? `:${port}` : ':5173';
  
  if (lanIp && lanIp !== 'localhost') {
    return `${protocol}//${lanIp}${devPort}`;
  }

  return window.location.origin;
};

/**
 * Format any path or content string for Cross-Device QR scanning.
 * - If payload is an absolute http/https URL, return it directly.
 * - If payload is a relative path (e.g. "/gurthu"), prepend cross-device base URL.
 * - If payload is arbitrary text, return as-is or prefix with base URL if requested.
 */
export const formatCrossDevicePayload = (content) => {
  if (!content) return getCrossDeviceBaseUrl();

  const strContent = String(content).trim();

  // If it's already a full web URL
  if (strContent.startsWith('http://') || strContent.startsWith('https://')) {
    // If it contains localhost/127.0.0.1, replace localhost with LAN IP
    if (strContent.includes('localhost') || strContent.includes('127.0.0.1')) {
      const baseUrl = getCrossDeviceBaseUrl();
      try {
        const urlObj = new URL(strContent);
        return `${baseUrl}${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
      } catch (_) {
        const lanIp = typeof __DEV_LAN_IP__ !== 'undefined' && __DEV_LAN_IP__ ? __DEV_LAN_IP__ : 'localhost';
        return strContent.replace(/localhost|127\.0\.0\.1/g, lanIp);
      }
    }
    return strContent;
  }

  // If it's a relative route (starts with '/')
  if (strContent.startsWith('/')) {
    const baseUrl = getCrossDeviceBaseUrl();
    return `${baseUrl}${strContent}`;
  }

  return strContent;
};
