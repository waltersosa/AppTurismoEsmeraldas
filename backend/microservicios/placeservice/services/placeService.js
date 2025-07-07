import placeRepository from '../repositories/placeRepository.js';

const placeService = {
  getPlaces: async (query) => {
    const filter = {};
    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }
    if (query.category) {
      filter.category = query.category;
    }
    if (query.active !== undefined) {
      filter.active = query.active === 'true';
    }
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const sortBy = query.sortBy || 'createdAt';
    const order = query.order === 'asc' ? 1 : -1;
    const sort = { [sortBy]: order };
    return await placeRepository.findAll(filter, { page, limit, sort });
  },
  getPlaceById: async (id) => {
    return await placeRepository.findById(id);
  },
  createPlace: async (data) => {
    // Validaciones básicas
    if (!data.name || !data.description || !data.category || !data.location || !data.ownerId) {
      throw new Error('Faltan campos obligatorios: name, description, category, location, ownerId');
    }
    // Limpiar imágenes
    if (data.images && Array.isArray(data.images)) {
      data.images = data.images.filter(url => typeof url === 'string' && url.startsWith('http'));
    }
    if (data.coverImage && !data.coverImage.startsWith('http')) {
      throw new Error('URL de imagen de portada inválida');
    }
    return await placeRepository.create(data);
  },
  updatePlace: async (id, data) => {
    if (data.images && Array.isArray(data.images)) {
      data.images = data.images.filter(url => typeof url === 'string' && url.startsWith('http'));
    }
    if (data.coverImage && !data.coverImage.startsWith('http')) {
      throw new Error('URL de imagen de portada inválida');
    }
    return await placeRepository.update(id, data);
  },
  updatePlaceStatus: async (id, active) => {
    if (typeof active !== 'boolean') {
      throw new Error('El campo active debe ser booleano');
    }
    return await placeRepository.updateStatus(id, active);
  },
  deletePlace: async (id) => {
    return await placeRepository.delete(id);
  },
  getPlacesCount: async () => {
    return await placeRepository.count();
  }
};

export default placeService; 