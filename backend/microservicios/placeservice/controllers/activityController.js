import axios from 'axios';

export const getUnifiedActivities = async (req, res) => {
  try {
    // URLs de los endpoints de actividades de cada microservicio
    const urls = [
      'http://localhost:3002/admin/actividades', // placeservice
      'http://localhost:3001/admin/actividades', // authservice
      'http://localhost:3004/admin/actividades', // reviewservice
      'http://localhost:3003/admin/actividades'  // mediaupload
    ];

    // Realizar todas las peticiones en paralelo
    const results = await Promise.allSettled(urls.map(url => axios.get(url)));

    // Unir y filtrar resultados exitosos
    let actividades = [];
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value.data.actividades) {
        actividades = actividades.concat(result.value.data.actividades);
      }
    });

    // Ordenar por fecha descendente
    actividades.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    res.json({ actividades });
  } catch (error) {
    console.error('Error unificando actividades:', error);
    res.status(500).json({ error: 'Error al obtener actividades unificadas' });
  }
}; 