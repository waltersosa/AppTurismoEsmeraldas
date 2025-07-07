import axios from 'axios';

const SERVICES = {
  auth: 'http://localhost:3001',
  places: 'http://localhost:3002',
  media: 'http://localhost:3003',
  reviews: 'http://localhost:3004'
};

console.log('🔍 Probando endpoints /count directamente...\n');

// Probar cada endpoint /count
const testCountEndpoint = async (serviceName, baseUrl, endpoint) => {
  try {
    console.log(`📡 Probando ${serviceName} - ${baseUrl}${endpoint}`);
    const response = await axios.get(`${baseUrl}${endpoint}`);
    console.log(`   ✅ Respuesta:`, response.data);
    return response.data.count;
  } catch (error) {
    console.error(`   ❌ Error:`, {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    return null;
  }
};

// Probar todos los endpoints
const testAllCounts = async () => {
  const results = await Promise.all([
    testCountEndpoint('Auth Service', SERVICES.auth, '/auth/users/count'),
    testCountEndpoint('Places Service', SERVICES.places, '/places/count'),
    testCountEndpoint('Media Service', SERVICES.media, '/media/count'),
    testCountEndpoint('Reviews Service', SERVICES.reviews, '/reviews/count')
  ]);
  
  console.log('\n📊 Resultados:');
  console.log(`   👥 Usuarios: ${results[0] || 'Error'}`);
  console.log(`   🏞️  Lugares: ${results[1] || 'Error'}`);
  console.log(`   🖼️  Imágenes: ${results[2] || 'Error'}`);
  console.log(`   ⭐ Reseñas: ${results[3] || 'Error'}`);
};

testAllCounts().catch(console.error); 