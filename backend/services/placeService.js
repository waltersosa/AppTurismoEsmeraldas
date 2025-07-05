import Place from '../models/Place.js';
import { validateImageUrls } from './uploadMediaService.js';

export const getPlaces = async ({ page = 1, limit = 10, search, category, active, sortBy = 'createdAt', order = 'desc' }) => {
  const query = {};
  if (search) query.name = { $regex: search, $options: 'i' };
  if (category) query.category = category;
  if (typeof active !== 'undefined') query.active = active === 'true' || active === true;

  const sort = {};
  sort[sortBy] = order === 'asc' ? 1 : -1;

  const total = await Place.countDocuments(query);
  const data = await Place.find(query)
    .populate('coverImage', 'filename url originalName')
    .populate('images', 'filename url originalName type')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  // Asegurar que images sea siempre un array
  data.forEach(place => {
    if (!place.images) {
      place.images = [];
    }
    if (!place.imageUrls) {
      place.imageUrls = [];
    }
  });

  return { data, total };
};

export const getPlaceById = async (id) => {
  const place = await Place.findById(id)
    .populate('coverImage', 'filename url originalName')
    .populate('images', 'filename url originalName type');
  
  // Asegurar que images sea siempre un array
  if (place && !place.images) {
    place.images = [];
  }
  if (place && !place.imageUrls) {
    place.imageUrls = [];
  }
  
  return place;
};

export const createPlace = async (body) => {
  // Validar URLs de imágenes si se proporcionan
  if (body.imageUrls && body.imageUrls.length > 0) {
    const { valid, invalid } = await validateImageUrls(body.imageUrls);
    
    if (invalid.length > 0) {
      throw new Error(`URLs de imágenes inválidas: ${invalid.join(', ')}`);
    }
    
    // Usar solo las URLs válidas
    body.imageUrls = valid;
  }

  // Validar URL de imagen de portada si se proporciona
  if (body.coverImageUrl) {
    const { validateImageUrl } = await import('./uploadMediaService.js');
    const isValidCover = await validateImageUrl(body.coverImageUrl);
    
    if (!isValidCover) {
      throw new Error('URL de imagen de portada inválida');
    }
  }

  return Place.create(body);
};

export const updatePlace = async (id, body) => {
  // Validar URLs de imágenes si se proporcionan
  if (body.imageUrls && body.imageUrls.length > 0) {
    const { valid, invalid } = await validateImageUrls(body.imageUrls);
    
    if (invalid.length > 0) {
      throw new Error(`URLs de imágenes inválidas: ${invalid.join(', ')}`);
    }
    
    // Usar solo las URLs válidas
    body.imageUrls = valid;
  }

  // Validar URL de imagen de portada si se proporciona
  if (body.coverImageUrl) {
    const { validateImageUrl } = await import('./uploadMediaService.js');
    const isValidCover = await validateImageUrl(body.coverImageUrl);
    
    if (!isValidCover) {
      throw new Error('URL de imagen de portada inválida');
    }
  }

  const place = await Place.findByIdAndUpdate(id, body, { new: true })
    .populate('coverImage', 'filename url originalName')
    .populate('images', 'filename url originalName type');
  
  // Asegurar que images sea siempre un array
  if (place && !place.images) {
    place.images = [];
  }
  if (place && !place.imageUrls) {
    place.imageUrls = [];
  }
  
  return place;
};

export const deletePlace = (id) => Place.findByIdAndDelete(id); 