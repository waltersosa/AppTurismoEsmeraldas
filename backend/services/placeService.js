import Place from '../models/Place.js';

// Función simple para validar URLs de imágenes
const validateImageUrl = (imageUrl) => {
  try {
    const url = new URL(imageUrl);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const hasImageExtension = imageExtensions.some(ext => 
      url.pathname.toLowerCase().includes(ext)
    );
    return ['http:', 'https:'].includes(url.protocol) && hasImageExtension;
  } catch (error) {
    return false;
  }
};

// Función para validar múltiples URLs
const validateImageUrls = (imageUrls) => {
  if (!Array.isArray(imageUrls)) {
    return { valid: [], invalid: [] };
  }

  const valid = [];
  const invalid = [];

  imageUrls.forEach(url => {
    if (validateImageUrl(url)) {
      valid.push(url);
    } else {
      invalid.push(url);
    }
  });

  return { valid, invalid };
};

export const getPlaces = async ({ page = 1, limit = 10, search, category, active, sortBy = 'createdAt', order = 'desc' }) => {
  const query = {};
  if (search) query.name = { $regex: search, $options: 'i' };
  if (category) query.category = category;
  if (typeof active !== 'undefined') query.active = active === 'true' || active === true;

  const sort = {};
  sort[sortBy] = order === 'asc' ? 1 : -1;

  const total = await Place.countDocuments(query);
  const data = await Place.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  // Asegurar que imageUrls sea siempre un array
  data.forEach(place => {
    if (!place.imageUrls) {
      place.imageUrls = [];
    }
  });

  return { data, total };
};

export const getPlaceById = async (id) => {
  const place = await Place.findById(id);
  
  // Asegurar que imageUrls sea siempre un array
  if (place && !place.imageUrls) {
    place.imageUrls = [];
  }
  
  return place;
};

export const createPlace = async (body) => {
  // Validar URLs de imágenes si se proporcionan
  if (body.imageUrls && body.imageUrls.length > 0) {
    const { valid, invalid } = validateImageUrls(body.imageUrls);
    
    if (invalid.length > 0) {
      throw new Error(`URLs de imágenes inválidas: ${invalid.join(', ')}`);
    }
    
    // Usar solo las URLs válidas
    body.imageUrls = valid;
  }

  // Validar URL de imagen de portada si se proporciona
  if (body.coverImageUrl && !validateImageUrl(body.coverImageUrl)) {
    throw new Error('URL de imagen de portada inválida');
  }

  return Place.create(body);
};

export const updatePlace = async (id, body) => {
  // Validar URLs de imágenes si se proporcionan
  if (body.imageUrls && body.imageUrls.length > 0) {
    const { valid, invalid } = validateImageUrls(body.imageUrls);
    
    if (invalid.length > 0) {
      throw new Error(`URLs de imágenes inválidas: ${invalid.join(', ')}`);
    }
    
    // Usar solo las URLs válidas
    body.imageUrls = valid;
  }

  // Validar URL de imagen de portada si se proporciona
  if (body.coverImageUrl && !validateImageUrl(body.coverImageUrl)) {
    throw new Error('URL de imagen de portada inválida');
  }

  const place = await Place.findByIdAndUpdate(id, body, { new: true });
  
  // Asegurar que imageUrls sea siempre un array
  if (place && !place.imageUrls) {
    place.imageUrls = [];
  }
  
  return place;
};

export const deletePlace = (id) => Place.findByIdAndDelete(id); 