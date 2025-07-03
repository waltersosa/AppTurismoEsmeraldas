import Place from '../models/Place.js';

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

  return { data, total };
};

export const getPlaceById = (id) => Place.findById(id);
export const createPlace = (body) => Place.create(body);
export const updatePlace = (id, body) => Place.findByIdAndUpdate(id, body, { new: true });
export const deletePlace = (id) => Place.findByIdAndDelete(id); 