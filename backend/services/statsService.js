import User from '../models/User.js';
import Place from '../models/Place.js';
import Review from '../models/Review.js';
import Media from '../models/Media.js';

export const getStatsCounts = async () => {
  const [usuarios, lugares, resenas, imagenes] = await Promise.all([
    User.countDocuments({ activo: true }),
    Place.countDocuments({ active: true }),
    Review.countDocuments({}),
    Media.countDocuments({})
  ]);
  return { usuarios, lugares, resenas, imagenes };
}; 