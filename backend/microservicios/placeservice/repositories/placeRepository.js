import Place from '../models/Place.js';

const placeRepository = {
  findAll: async (filter = {}, options = {}) => {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;
    const data = await Place.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    const total = await Place.countDocuments(filter);
    return { data, total };
  },
  findById: async (id) => {
    return await Place.findById(id);
  },
  create: async (data) => {
    const place = new Place(data);
    return await place.save();
  },
  update: async (id, data) => {
    return await Place.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true });
  },
  updateStatus: async (id, active) => {
    return await Place.findByIdAndUpdate(id, { active, updatedAt: new Date() }, { new: true });
  },
  delete: async (id) => {
    return await Place.findByIdAndDelete(id);
  },
  count: async () => {
    return await Place.countDocuments({ active: true });
  }
};

export default placeRepository; 