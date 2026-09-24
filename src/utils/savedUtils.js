/**
 * Gurthu — Personal Memory & Cross-Device Transfer Space Utilities
 * Auto-detection of resource types, domain extraction, tag parsing, and transfer expiry helpers.
 */

export const extractDomain = (urlStr) => {
  if (!urlStr || typeof urlStr !== 'string') return '';
  try {
    const cleanUrl = urlStr.trim().startsWith('http') ? urlStr.trim() : `https://${urlStr.trim()}`;
    const parsed = new URL(cleanUrl);
    return parsed.hostname.replace(/^www\./, '');
  } catch (_) {
    return urlStr.replace(/^https?:\/\//, '').split('/')[0];
  }
};

export const autoDetectSavedType = (urlStr = '', textStr = '') => {
  const url = (urlStr || '').trim().toLowerCase();
  const text = (textStr || '').trim();

  if (url) {
    if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) {
      return 'video';
    }
    if (url.includes('github.com') || url.includes('gitlab.com') || url.includes('gist.github.com')) {
      return 'github';
    }
    if (url.endsWith('.pdf') || url.includes('/pdf') || url.includes('drive.google.com/file')) {
      return 'pdf';
    }
    if (
      url.includes('geeksforgeeks.org') ||
      url.includes('medium.com') ||
      url.includes('dev.to') ||
      url.includes('stackoverflow.com') ||
      url.includes('docs.') ||
      url.includes('/docs/')
    ) {
      return 'article';
    }
    return 'article';
  }

  if (text) {
    // Check if code snippet
    const codePattern = /\b(function|const|let|var|import|export|class|def|return|interface|type|struct|public|private|static|void|if|else|for|while|try|catch|async|await)\b|[{}[\]();=<>]/;
    if (codePattern.test(text) && (text.includes('\n') || text.includes(';') || text.includes('=>') || text.includes('{'))) {
      return 'snippet';
    }
    return 'note';
  }

  return 'link';
};

export const generateDefaultTitle = (urlStr = '', textStr = '', type = 'link') => {
  if (urlStr && urlStr.trim()) {
    const domain = extractDomain(urlStr);
    try {
      const cleanUrl = urlStr.trim().startsWith('http') ? urlStr.trim() : `https://${urlStr.trim()}`;
      const parsed = new URL(cleanUrl);
      const pathParts = parsed.pathname.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        const lastPart = decodeURIComponent(pathParts[pathParts.length - 1])
          .replace(/[-_]/g, ' ')
          .replace(/\.[^/.]+$/, '');
        if (lastPart.length > 3) {
          const capitalized = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
          return `${capitalized} (${domain})`;
        }
      }
    } catch (_) {}
    return `Saved ${type.charAt(0).toUpperCase() + type.slice(1)} (${domain})`;
  }

  if (textStr && textStr.trim()) {
    const firstLine = textStr.trim().split('\n')[0];
    if (firstLine.length > 50) {
      return firstLine.substring(0, 47) + '...';
    }
    return firstLine;
  }

  return 'Gurthu Item';
};

export const parseTags = (tagsInput) => {
  if (!tagsInput) return [];
  if (Array.isArray(tagsInput)) return tagsInput.map(t => t.trim().replace(/^#/, '')).filter(Boolean);
  
  if (typeof tagsInput === 'string') {
    return tagsInput
      .split(/[,#\s]+/)
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);
  }
  return [];
};

export const getTypeMeta = (type = 'link') => {
  switch (type.toLowerCase()) {
    case 'video':
      return { label: 'Video', icon: 'smart_display', emoji: '🎥', color: 'text-red-400 bg-red-500/10 border-red-500/20' };
    case 'github':
      return { label: 'GitHub', icon: 'code', emoji: '💻', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
    case 'pdf':
      return { label: 'PDF', icon: 'description', emoji: '📄', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    case 'article':
    case 'link':
      return { label: 'Article', icon: 'link', emoji: '🔗', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
    case 'snippet':
      return { label: 'Snippet', icon: 'code_blocks', emoji: '⚡', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
    case 'note':
    default:
      return { label: 'Note', icon: 'sticky_note_2', emoji: '📝', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
  }
};

/**
 * Expiry helper functions for Klipit-style cross-device transfer items.
 * Options: '1h', '24h', '7d', 'keep'
 */
export const calculateExpiryIso = (option = '24h') => {
  if (option === 'keep') return null;
  const now = Date.now();
  let ms = 24 * 60 * 60 * 1000; // default 24h

  if (option === '1h') ms = 1 * 60 * 60 * 1000;
  else if (option === '24h') ms = 24 * 60 * 60 * 1000;
  else if (option === '7d') ms = 7 * 24 * 60 * 60 * 1000;

  return new Date(now + ms).toISOString();
};

export const formatTimeRemaining = (expiresAt) => {
  if (!expiresAt) return 'No expiry';
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  if (diffMs <= 0) return 'Expired';

  const mins = Math.floor(diffMs / (1000 * 60));
  if (mins < 60) return `Expires in ${mins}m`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Expires in ${hours}h`;

  const days = Math.floor(hours / 24);
  return `Expires in ${days}d`;
};

export const isTransferExpired = (expiresAt) => {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() <= Date.now();
};
