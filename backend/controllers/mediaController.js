import path from 'path';
import Media from '../models/Media.js';
import Place from '../models/Place.js';

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

// Eliminar archivo
export const deleteMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;
    
    const media = await Media.findById(mediaId);
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    // Eliminar archivo físico
    const fs = await import('fs');
    const filePath = path.join(process.cwd(), 'uploads', media.filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Eliminar de la base de datos
    await Media.findByIdAndDelete(mediaId);

    // Si era imagen de portada, limpiar referencia en el lugar
    if (media.type === 'cover') {
      await Place.updateMany(
        { coverImage: mediaId },
        { $unset: { coverImage: 1 } }
      );
    }

    // Remover de la lista de imágenes del lugar
    await Place.updateMany(
      { images: mediaId },
      { $pull: { images: mediaId } }
    );

    res.json({ 
      success: true, 
      message: 'Media deleted successfully',
      media 
    });

  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ success: false, message: 'Error deleting media' });
  }
};

// Obtener conteo de archivos de media
export const getMediaCount = async (req, res) => {
  try {
    const count = await Media.countDocuments();
    res.json({ 
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error getting media count:', error);
    res.status(500).json({ success: false, message: 'Error getting media count' });
  }
}; 