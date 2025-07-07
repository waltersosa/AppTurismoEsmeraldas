import placeService from '../services/placeService.js';
import Activity from '../models/Activity.js';

const placeController = {
  getPlaces: async (req, res) => {
    const { data, total } = await placeService.getPlaces(req.query);
    res.json({
      success: true,
      data,
      pagination: {
        total,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10
      }
    });
  },
  getPlaceById: async (req, res) => {
    const place = await placeService.getPlaceById(req.params.id);
    if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
    res.json({ success: true, data: place });
  },
  createPlace: async (req, res) => {
    try {
      const place = await placeService.createPlace(req.body);
      if (req.usuario && req.usuario.rol === 'gad') {
        await Activity.create({
          usuario: req.usuario.userId || req.usuario._id,
          nombreUsuario: req.usuario.nombre || req.usuario.email || 'Admin',
          accion: 'creó un lugar',
          recurso: place.name
        });
      }
      res.status(201).json({ success: true, data: place });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
  updatePlace: async (req, res) => {
    try {
      const place = await placeService.updatePlace(req.params.id, req.body);
      if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
      if (req.usuario && req.usuario.rol === 'gad') {
        await Activity.create({
          usuario: req.usuario.userId || req.usuario._id,
          nombreUsuario: req.usuario.nombre || req.usuario.email || 'Admin',
          accion: 'editó un lugar',
          recurso: place.name
        });
      }
      res.json({ success: true, data: place });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
  updatePlaceStatus: async (req, res) => {
    try {
      const { active } = req.body;
      const place = await placeService.updatePlaceStatus(req.params.id, active);
      if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
      if (req.usuario && req.usuario.rol === 'gad') {
        await Activity.create({
          usuario: req.usuario.userId || req.usuario._id,
          nombreUsuario: req.usuario.nombre || req.usuario.email || 'Admin',
          accion: `${active ? 'activó' : 'desactivó'} un lugar`,
          recurso: place.name
        });
      }
      res.json({ success: true, data: place });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
  deletePlace: async (req, res) => {
    const place = await placeService.deletePlace(req.params.id);
    if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
    if (req.usuario && req.usuario.rol === 'gad') {
      await Activity.create({
        usuario: req.usuario.userId || req.usuario._id,
        nombreUsuario: req.usuario.nombre || req.usuario.email || 'Admin',
        accion: 'eliminó un lugar',
        recurso: place.name
      });
    }
    res.json({ success: true, data: place });
  },
  listAdminActivities: async (req, res) => {
    const actividades = await Activity.find().sort({ fecha: -1 }).limit(100);
    res.json({ success: true, actividades });
  },
  getPlacesCount: async (req, res) => {
    try {
      const count = await placeService.getPlacesCount();
      res.json({ count });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

export default placeController; 