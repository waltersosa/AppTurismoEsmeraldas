import path from 'path';
import Media from '../models/Media.js';
import Place from '../models/Place.js';
import Activity from '../models/Activity.js';

// Subida de archivos
export const uploadMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const { placeId, type = 'gallery' } = req.body;

    if (!placeId) {
      return res.status(400).json({ success: false, message: 'placeId is required' });
    }

    // Verificar que el lugar existe
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found' });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const mediaData = {
        filename: file.filename,
        originalName: file.originalname,
        url: `/media/${file.filename}`,
        placeId: placeId,
        type: type
      };

      const media = new Media(mediaData);
      await media.save();

      // Si es imagen de portada, actualizar el lugar
      if (type === 'cover') {
        place.coverImage = media._id;
        await place.save();
      }

      // Agregar a la lista de imágenes del lugar si no existe
      if (!place.images) {
        place.images = [];
      }
      if (!place.images.includes(media._id)) {
        place.images.push(media._id);
        await place.save();
      }

      uploadedFiles.push({
        _id: media._id,
        filename: media.filename,
        originalName: media.originalName,
        url: media.url,
        type: media.type
      });
    }

    // Registrar actividad si es admin
    if (req.usuario && req.usuario.rol === 'gad') {
      await Activity.create({
        usuario: req.usuario.id,
        nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
        accion: 'subió archivos multimedia',
        recurso: `${uploadedFiles.length} archivos para ${place.name}`
      });
    }

    res.status(201).json({ 
      success: true, 
      message: 'Files uploaded successfully',
      files: uploadedFiles 
    });

  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ success: false, message: 'Error uploading files' });
  }
};

// Obtener archivo
export const getMedia = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(process.cwd(), 'uploads', filename);
  res.sendFile(filePath, err => {
    if (err) {
      res.status(404).json({ success: false, message: 'File not found' });
    }
  });
};

// Obtener imágenes por lugar
export const getMediaByPlace = async (req, res) => {
  try {
    const { placeId } = req.params;
    
    const media = await Media.find({ placeId, active: true })
      .sort({ type: -1, createdAt: -1 }); // Portada primero, luego por fecha

    res.json({ 
      success: true, 
      media 
    });

  } catch (error) {
    console.error('Error getting media by place:', error);
    res.status(500).json({ success: false, message: 'Error retrieving media' });
  }
};

// Eliminar imagen
export const deleteMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;
    
    const media = await Media.findById(mediaId);
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    // Si es imagen de portada, remover del lugar
    if (media.type === 'cover') {
      await Place.findByIdAndUpdate(media.placeId, { $unset: { coverImage: 1 } });
    }

    // Remover de la lista de imágenes del lugar
    await Place.findByIdAndUpdate(media.placeId, { 
      $pull: { images: mediaId } 
    });

    // Eliminar el archivo físico (opcional)
    // fs.unlinkSync(path.join(process.cwd(), 'uploads', media.filename));

    await Media.findByIdAndDelete(mediaId);

    // Registrar actividad si es admin
    if (req.usuario && req.usuario.rol === 'gad') {
      await Activity.create({
        usuario: req.usuario.id,
        nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
        accion: 'eliminó archivo multimedia',
        recurso: media.originalName
      });
    }

    res.json({ 
      success: true, 
      message: 'Media deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ success: false, message: 'Error deleting media' });
  }
};

// Subida de archivos sin asociar a lugar específico (para formularios)
export const uploadImagesForForm = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const mediaData = {
        filename: file.filename,
        originalName: file.originalname,
        url: `/media/file/${file.filename}`,
        placeId: null, // No asociado a lugar específico
        type: 'gallery'
      };

      const media = new Media(mediaData);
      await media.save();

      uploadedFiles.push({
        _id: media._id,
        filename: media.filename,
        originalName: media.originalName,
        url: media.url,
        type: media.type
      });
    }

    // Registrar actividad si es admin
    if (req.usuario && req.usuario.rol === 'gad') {
      await Activity.create({
        usuario: req.usuario.id,
        nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
        accion: 'subió archivos para formulario',
        recurso: `${uploadedFiles.length} archivos`
      });
    }

    res.status(201).json({ 
      success: true, 
      message: 'Files uploaded successfully',
      files: uploadedFiles 
    });

  } catch (error) {
    console.error('Error uploading media for form:', error);
    res.status(500).json({ success: false, message: 'Error uploading files' });
  }
}; 