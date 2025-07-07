import path from 'path';
import Media from '../models/Media.js';
import fs from 'fs';
import Activity from '../models/Activity.js';

// Subida de archivos
export const uploadMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const { placeId, type = 'gallery' } = req.body;
    const uploadedFiles = [];

    for (const file of req.files) {
      const mediaData = {
        filename: file.filename,
        originalName: file.originalname,
        url: `/uploads/${file.filename}`,
        placeId: placeId || null,
        type: type
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

    // Registrar actividad administrativa
    await Activity.create({
      usuario: req.usuario?._id || 'desconocido',
      nombreUsuario: req.usuario?.nombre || req.usuario?.nombreUsuario || 'desconocido',
      accion: 'Subió imágenes',
      recurso: uploadedFiles.map(f => f.filename).join(', '),
      fecha: new Date()
    });

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
    const media = await Media.find({ placeId, active: true }).sort({ type: -1, createdAt: -1 });
    res.json({ success: true, media });
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
    // Eliminar el archivo físico
    try {
      fs.unlinkSync(path.join(process.cwd(), 'uploads', media.filename));
    } catch (e) {}
    await Media.findByIdAndDelete(mediaId);

    // Registrar actividad administrativa
    await Activity.create({
      usuario: req.usuario?._id || 'desconocido',
      nombreUsuario: req.usuario?.nombre || req.usuario?.nombreUsuario || 'desconocido',
      accion: 'Eliminó imagen',
      recurso: media.filename,
      fecha: new Date()
    });

    res.json({ success: true, message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ success: false, message: 'Error deleting media' });
  }
};

// Obtener conteo de imágenes
export const getMediaCount = async (req, res) => {
  try {
    const count = await Media.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error getting media count:', error);
    res.status(500).json({ success: false, message: 'Error getting media count' });
  }
}; 