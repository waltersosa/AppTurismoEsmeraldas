import axios from 'axios';

const BASE_URL = 'http://localhost:3005';

console.log('🧪 Probando microservicio de estadísticas...\n');

// Función para hacer peticiones con manejo de errores
const makeRequest = async (method, url) => {
  try {
    const response = await axios({ method, url: `${BASE_URL}${url}` });
    console.log(`✅ ${method.toUpperCase()} ${url}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error en ${method.toUpperCase()} ${url}:`, {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return null;
  }
};

// Pruebas
const runTests = async () => {
  console.log('1️⃣ Probando health check...');
  await makeRequest('GET', '/');
  console.log('');

  console.log('2️⃣ Probando endpoint de estadísticas...');
  const stats = await makeRequest('GET', '/stats/overview');
  console.log('');

  if (stats && stats.success) {
    console.log('📊 Resumen de estadísticas obtenidas:');
    console.log(`   👥 Usuarios: ${stats.data.usuarios}`);
    console.log(`   🏞️  Lugares: ${stats.data.lugares}`);
    console.log(`   ⭐ Reseñas: ${stats.data.resenas}`);
    console.log(`   🖼️  Imágenes: ${stats.data.imagenes}`);
  }

  console.log('\n🏁 Pruebas completadas.');
};

// Ejecutar pruebas
runTests().catch(console.error); 