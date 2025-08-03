import Place from '../models/Place.js';

export const getPlaces = async ({ page = 1, limit = 10, search, category, active, sortBy = 'createdAt', order = 'desc' }) => {
  const query = {};
  if (search && search.trim() !== '') query.name = { $regex: search, $options: 'i' };
  if (category && category.trim() !== '') query.category = category;
  if (active !== undefined && active !== null && active !== '') {
    query.active = active === 'true' || active === true;
  }

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
    // Validación básica de URLs
    const validUrls = body.imageUrls.filter(url => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    });
    
    if (validUrls.length !== body.imageUrls.length) {
      throw new Error('Algunas URLs de imágenes no son válidas');
    }
    
    body.imageUrls = validUrls;
  }

  // Validar URL de imagen de portada si se proporciona
  if (body.coverImageUrl) {
    try {
      new URL(body.coverImageUrl);
    } catch {
      throw new Error('URL de imagen de portada inválida');
    }
  }

  return Place.create(body);
};

export const updatePlace = async (id, body) => {
  // Validar URLs de imágenes si se proporcionan
  if (body.imageUrls && body.imageUrls.length > 0) {
    // Validación básica de URLs
    const validUrls = body.imageUrls.filter(url => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    });
    
    if (validUrls.length !== body.imageUrls.length) {
      throw new Error('Algunas URLs de imágenes no son válidas');
    }
    
    body.imageUrls = validUrls;
  }

  // Validar URL de imagen de portada si se proporciona
  if (body.coverImageUrl) {
    try {
      new URL(body.coverImageUrl);
    } catch {
      throw new Error('URL de imagen de portada inválida');
    }
  }

  const place = await Place.findByIdAndUpdate(id, body, { new: true });
  
  // Asegurar que imageUrls sea siempre un array
  if (place && !place.imageUrls) {
    place.imageUrls = [];
  }
  
  return place;
};

export const deletePlace = (id) => Place.findByIdAndDelete(id);

export const togglePlaceStatus = async (id, active) => {
  const place = await Place.findByIdAndUpdate(
    id, 
    { active }, 
    { new: true }
  );
  
  // Asegurar que imageUrls sea siempre un array
  if (place && !place.imageUrls) {
    place.imageUrls = [];
  }
  
  return place;
};

export const getPlacesCount = async () => {
  return await Place.countDocuments();
}; 