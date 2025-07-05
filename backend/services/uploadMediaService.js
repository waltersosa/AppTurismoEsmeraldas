import https from 'https';
import http from 'http';
import { URL } from 'url';

/**
 * Valida si una URL es válida y accesible
 * @param {string} imageUrl - URL de la imagen a validar
 * @returns {Promise<boolean>} - true si la URL es válida y accesible
 */
export const validateImageUrl = async (imageUrl) => {
  try {
    const url = new URL(imageUrl);
    
    // Verificar que sea HTTP o HTTPS
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false;
    }

    // Verificar que sea una imagen por la extensión
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const hasImageExtension = imageExtensions.some(ext => 
      url.pathname.toLowerCase().includes(ext)
    );

    if (!hasImageExtension) {
      return false;
    }

    // Verificar que la URL sea accesible
    return new Promise((resolve) => {
      const protocol = url.protocol === 'https:' ? https : http;
      
      const req = protocol.get(url.href, { timeout: 5000 }, (res) => {
        // Verificar que el status code sea 200 y el content-type sea imagen
        const isImage = res.headers['content-type'] && 
                       res.headers['content-type'].startsWith('image/');
        
        resolve(res.statusCode === 200 && isImage);
      });

      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
    });

  } catch (error) {
    return false;
  }
};

/**
 * Valida múltiples URLs de imágenes
 * @param {string[]} imageUrls - Array de URLs a validar
 * @returns {Promise<{valid: string[], invalid: string[]}>} - URLs válidas e inválidas
 */
export const validateImageUrls = async (imageUrls) => {
  if (!Array.isArray(imageUrls)) {
    return { valid: [], invalid: [] };
  }

  const results = await Promise.allSettled(
    imageUrls.map(url => validateImageUrl(url))
  );

  const valid = [];
  const invalid = [];

  imageUrls.forEach((url, index) => {
    if (results[index].status === 'fulfilled' && results[index].value) {
      valid.push(url);
    } else {
      invalid.push(url);
    }
  });

  return { valid, invalid };
};

/**
 * Obtiene información básica de una imagen desde URL
 * @param {string} imageUrl - URL de la imagen
 * @returns {Promise<{url: string, filename: string, originalName: string}>}
 */
export const getImageInfoFromUrl = (imageUrl) => {
  try {
    const url = new URL(imageUrl);
    const pathname = url.pathname;
    const filename = pathname.split('/').pop() || 'image.jpg';
    
    return {
      url: imageUrl,
      filename: filename,
      originalName: filename
    };
  } catch (error) {
    return {
      url: imageUrl,
      filename: 'image.jpg',
      originalName: 'image.jpg'
    };
  }
}; 