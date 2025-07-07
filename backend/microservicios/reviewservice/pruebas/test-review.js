import axios from 'axios';

const BASE_URL = 'http://localhost:3004';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODZiMDkxMTE3ZmZkMTFjNzFiZDg2MTkiLCJyb2wiOiJ1c3VhcmlvIiwiaWF0IjoxNzUxODQ1MTUwLCJleHAiOjE3NTE4NTIzNTB9.lP3RHydX4_se4m5ORfjOEu35rW9frT7qeTi33XKF1-Y';

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

// Función para hacer peticiones con manejo de errores
const makeRequest = async (method, url, data = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers,
      data
    };
    
    const response = await axios(config);
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

// Función para hacer peticiones sin token (públicas)
const makePublicRequest = async (method, url, data = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: { 'Content-Type': 'application/json' },
      data
    };
    
    const response = await axios(config);
    console.log(`✅ ${method.toUpperCase()} ${url} (público):`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error en ${method.toUpperCase()} ${url} (público):`, {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return null;
  }
};

// Pruebas
const runTests = async () => {
  console.log('🧪 Iniciando pruebas del microservicio de Reviews...\n');

  // 1. Health check
  console.log('1️⃣ Probando health check...');
  await makePublicRequest('GET', '/');
  console.log('');

  // 2. Health check de reviews
  console.log('2️⃣ Probando health check de reviews...');
  await makePublicRequest('GET', '/reviews/health');
  console.log('');

  // 3. Crear una reseña (requiere token)
  console.log('3️⃣ Probando crear reseña...');
  const reviewData = {
    lugarId: '64f1234567890abcdef12345', // ID de ejemplo
    comentario: 'Excelente lugar turístico, muy recomendado para visitar con la familia. El paisaje es impresionante y la atención es muy buena.',
    calificacion: 5
  };
  await makeRequest('POST', '/reviews/', reviewData);
  console.log('');

  // 4. Obtener reseñas de un lugar (público)
  console.log('4️⃣ Probando obtener reseñas de un lugar...');
  await makePublicRequest('GET', '/reviews/lugar/64f1234567890abcdef12345');
  console.log('');

  // 5. Obtener reseñas con parámetros de paginación
  console.log('5️⃣ Probando obtener reseñas con paginación...');
  await makePublicRequest('GET', '/reviews/lugar/64f1234567890abcdef12345?page=1&limit=5&sortBy=fecha&order=desc');
  console.log('');

  console.log('🏁 Pruebas completadas.');
};

// Ejecutar pruebas
runTests().catch(console.error); 