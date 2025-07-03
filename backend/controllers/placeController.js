import * as placeService from '../services/placeService.js';

export const getPlaces = async (req, res, next) => {
  try {
    const { page, limit, search, category, active, sortBy, order } = req.query;
    const { data, total } = await placeService.getPlaces({ page, limit, search, category, active, sortBy, order });
    res.json({
      success: true,
      data,
      pagination: {
        total,
        page: Number(page) || 1,
        limit: Number(limit) || 10
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getPlaceById = async (req, res, next) => {
  try {
    const place = await placeService.getPlaceById(req.params.id);
    if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
    res.json({ success: true, data: place });
  } catch (err) {
    next(err);
  }
};

export const createPlace = async (req, res, next) => {
  try {
    const place = await placeService.createPlace(req.body);
    res.status(201).json({ success: true, data: place });
  } catch (err) {
    next(err);
  }
};

export const updatePlace = async (req, res, next) => {
  try {
    const place = await placeService.updatePlace(req.params.id, req.body);
    if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
    res.json({ success: true, data: place });
  } catch (err) {
    next(err);
  }
};

export const deletePlace = async (req, res, next) => {
  try {
    const place = await placeService.deletePlace(req.params.id);
    if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
    res.json({ success: true, data: place });
  } catch (err) {
    next(err);
  }
}; 