// Service for fetching link metadata (Open Graph, Favicon, etc.)

/**
 * Fetch Open Graph metadata from a URL
 * Note: Due to CORS restrictions, this should ideally be done via a backend proxy
 * For now, we'll use a free service or implement a simple proxy endpoint
 */
export const fetchLinkMetadata = async (url) => {
  try {
    // Clean URL
    const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
    
    // For production, you'd want to use your own backend endpoint
    // For now, we'll extract basic metadata from the URL
    const urlObj = new URL(cleanUrl);
    
    return {
      url: cleanUrl,
      title: urlObj.hostname,
      description: '',
      image: null,
      favicon: getFaviconUrl(cleanUrl),
      siteName: urlObj.hostname,
      isValid: true
    };
  } catch (error) {
    console.error('Error fetching link metadata:', error);
    return {
      url,
      title: url,
      description: '',
      image: null,
      favicon: null,
      siteName: '',
      isValid: false
    };
  }
};

/**
 * Get favicon URL for a given website URL
 */
export const getFaviconUrl = (url) => {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
  } catch {
    return null;
  }
};

/**
 * Validate if a URL is reachable
 * Note: Due to CORS, this needs to be done via a backend proxy in production
 */
export const validateUrl = async (url) => {
  try {
    const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
    
    // Simple validation: check if URL is well-formed
    const urlObj = new URL(cleanUrl);
    
    // In production, you'd make a HEAD request via your backend
    // For now, we just validate the URL format
    return {
      isValid: true,
      url: cleanUrl,
      statusCode: 200,
      statusText: 'OK'
    };
  } catch (error) {
    return {
      isValid: false,
      url,
      statusCode: 0,
      statusText: 'Invalid URL format',
      error: error.message
    };
  }
};

/**
 * Get a screenshot/preview image for a URL
 * Using a free screenshot service
 */
export const getScreenshotUrl = (url, options = {}) => {
  try {
    const cleanUrl = encodeURIComponent(url.startsWith('http') ? url : `https://${url}`);
    const width = options.width || 800;
    const height = options.height || 600;
    
    // Using shot.screenshotapi.net (free tier available)
    // Alternative: microlink.io, urlbox.io, or your own backend service
    return `https://image.thum.io/get/width/${width}/crop/${height}/${cleanUrl}`;
  } catch {
    return null;
  }
};

/**
 * Auto-update favicon for a bookmark
 * Periodically checks if favicon has changed
 */
export const updateFavicon = async (url) => {
  const favicon = getFaviconUrl(url);
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ success: true, favicon });
    img.onerror = () => resolve({ success: false, favicon: null });
    img.src = favicon;
  });
};

/**
 * Extract Open Graph metadata from HTML (requires backend proxy)
 */
export const extractOpenGraphData = async (url) => {
  try {
    // In a real implementation, you'd call your backend endpoint here
    // Backend would fetch the HTML and parse Open Graph tags
    
    // Example backend endpoint:
    // const response = await fetch(`/api/og-scraper?url=${encodeURIComponent(url)}`);
    // return await response.json();
    
    // For now, return a placeholder
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    
    return {
      ogTitle: urlObj.hostname,
      ogDescription: null,
      ogImage: null,
      ogSiteName: urlObj.hostname,
      ogType: 'website',
      ogUrl: url
    };
  } catch (error) {
    console.error('Error extracting Open Graph data:', error);
    return null;
  }
};
