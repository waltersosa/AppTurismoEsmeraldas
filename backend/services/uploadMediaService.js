import https from 'https';
import http from 'http';
import { URL } from 'url';

/**
 * Valida si una URL tiene un formato válido (sin hacer petición HTTP)
 * @param {string} imageUrl - URL de la imagen a validar
 * @returns {Promise<boolean>} - true si la URL tiene formato válido
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

    // Si no tiene extensión de imagen, verificar que el hostname sea de un servicio de imágenes conocido
    if (!hasImageExtension) {
      const imageHosts = [
        'images.unsplash.com',
        'picsum.photos',
        'via.placeholder.com',
        'placehold.it',
        'lorempixel.com',
        'loremflickr.com',
        'media.elcomercio.com',
        'imgur.com',
        'i.imgur.com',
        'cloudinary.com',
        'res.cloudinary.com'
      ];
      
      const isKnownImageHost = imageHosts.some(host => 
        url.hostname.includes(host)
      );
      
      if (!isKnownImageHost) {
        return false;
      }
    }

    return true;

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