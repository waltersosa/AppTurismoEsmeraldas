import axios from 'axios';

const SERVICES = {
  auth: 'http://localhost:3001',
  places: 'http://localhost:3002',
  media: 'http://localhost:3003',
  reviews: 'http://localhost:3004'
};

console.log('🔍 Debugging microservicio de estadísticas...\n');

// Verificar cada microservicio individualmente
const checkService = async (serviceName, baseUrl, endpoint) => {
  try {
    console.log(`📡 Verificando ${serviceName}...`);
    
    // 1. Health check
    const healthResponse = await axios.get(`${baseUrl}/`);
    console.log(`   ✅ Health check: ${healthResponse.data.message || 'OK'}`);
    
    // 2. Count endpoint
    const countResponse = await axios.get(`${baseUrl}${endpoint}`);
    console.log(`   ✅ Count endpoint: ${countResponse.data.count} ${serviceName}`);
    
    return countResponse.data.count;
  } catch (error) {
    console.error(`   ❌ Error en ${serviceName}:`, {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return 0;
  }
};

// Verificar todos los servicios
const checkAllServices = async () => {
  console.log('🔗 Verificando comunicación con microservicios...\n');
  
  const results = await Promise.all([
    checkService('Auth Service', SERVICES.auth, '/auth/users/count'),
    checkService('Places Service', SERVICES.places, '/places/count'),
    checkService('Media Service', SERVICES.media, '/media/count'),
    checkService('Reviews Service', SERVICES.reviews, '/reviews/count')
  ]);
  
  console.log('\n📊 Resultados individuales:');
  console.log(`   👥 Usuarios: ${results[0]}`);
  console.log(`   🏞️  Lugares: ${results[1]}`);
  console.log(`   🖼️  Imágenes: ${results[2]}`);
  console.log(`   ⭐ Reseñas: ${results[3]}`);
  
  // Verificar el microservicio de stats
  console.log('\n📈 Verificando microservicio de stats...');
  try {
    const statsResponse = await axios.get('http://localhost:3005/stats/overview');
    console.log('   ✅ Stats service:', statsResponse.data.data);
  } catch (error) {
    console.error('   ❌ Error en stats service:', error.message);
  }
};

checkAllServices().catch(console.error); 