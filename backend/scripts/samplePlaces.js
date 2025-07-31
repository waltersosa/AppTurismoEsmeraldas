import mongoose from 'mongoose';
import Place from '../models/Place.js';
import { config } from '../config/config.js';

// Conectar a MongoDB
await mongoose.connect(config.database.uri);

const samplePlaces = [
  {
    name: 'Playa de las Palmas',
    description: 'Hermosa playa con arena dorada y aguas cristalinas del Pacífico. Ideal para el surf, paseos en lancha y disfrutar del sol.',
    location: 'Atacames, Esmeraldas',
    category: 'playa',
    coverImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    imageUrls: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
    ],
    active: true
  },
  {
    name: 'Río Esmeraldas',
    description: 'El río más importante de la provincia, perfecto para navegación, pesca deportiva y observación de aves.',
    location: 'Esmeraldas, Ecuador',
    category: 'rio',
    coverImageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    imageUrls: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop'
    ],
    active: true
  },
  {
    name: 'Reserva Ecológica Mache-Chindul',
    description: 'Área protegida con gran biodiversidad, senderos para caminata y observación de flora y fauna nativa.',
    location: 'Mache, Esmeraldas',
    category: 'reserva',
    coverImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    imageUrls: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop'
    ],
    active: true
  },
  {
    name: 'Cascada El Salto',
    description: 'Impresionante cascada de 25 metros de altura con aguas refrescantes y un entorno natural único.',
    location: 'San Lorenzo, Esmeraldas',
    category: 'cascada',
    coverImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    imageUrls: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
    ],
    active: true
  },
  {
    name: 'Mirador de Esmeraldas',
    description: 'Vista panorámica de la ciudad y el océano Pacífico, perfecto para tomar fotografías al atardecer.',
    location: 'Esmeraldas, Ecuador',
    category: 'mirador',
    coverImageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    imageUrls: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop'
    ],
    active: true
  },
  {
    name: 'Parque Central de Esmeraldas',
    description: 'Parque urbano con áreas verdes, fuentes y espacios para recreación familiar.',
    location: 'Esmeraldas, Ecuador',
    category: 'parque',
    coverImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    imageUrls: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop'
    ],
    active: true
  },
  {
    name: 'Catedral de Esmeraldas',
    description: 'Iglesia principal de la ciudad con arquitectura colonial y bellos vitrales.',
    location: 'Esmeraldas, Ecuador',
    category: 'iglesia',
    coverImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    imageUrls: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
    ],
    active: true
  },
  {
    name: 'Museo de Esmeraldas',
    description: 'Museo que exhibe la historia y cultura de la provincia, incluyendo arte precolombino.',
    location: 'Esmeraldas, Ecuador',
    category: 'museo',
    coverImageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    imageUrls: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop'
    ],
    active: true
  }
];

try {
  // Limpiar lugares existentes
  await Place.deleteMany({});
  console.log('Lugares existentes eliminados');

  // Insertar lugares de ejemplo
  const places = await Place.insertMany(samplePlaces);
  console.log(`${places.length} lugares de ejemplo agregados exitosamente`);

  // Mostrar los lugares creados
  places.forEach(place => {
    console.log(`- ${place.name} (${place.category})`);
  });

} catch (error) {
  console.error('Error al agregar lugares de ejemplo:', error);
} finally {
  // Cerrar conexión
  await mongoose.connection.close();
  console.log('Conexión a MongoDB cerrada');
} 