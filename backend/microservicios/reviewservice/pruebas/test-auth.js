import axios from 'axios';

const BASE_URL = 'http://localhost:3004';
const AUTH_URL = 'http://localhost:3001';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODZiMDkxMTE3ZmZkMTFjNzFiZDg2MTkiLCJyb2wiOiJ1c3VhcmlvIiwiaWF0IjoxNzUxODQ1MTUwLCJleHAiOjE3NTE4NTIzNTB9.lP3RHydX4_se4m5ORfjOEu35rW9frT7qeTi33XKF1-Y';

console.log('🔍 Probando autenticación del microservicio de Reviews...\n');

// 1. Probar validación directa con el microservicio de auth
const testAuthService = async () => {
  console.log('1️⃣ Probando validación directa con microservicio de auth...');
  try {
    const response = await axios.post(`${AUTH_URL}/auth/validate`, {}, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    console.log('✅ Token válido en auth service:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error validando token en auth service:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return null;
  }
};

// 2. Probar endpoint protegido del microservicio de reviews
const testReviewsAuth = async () => {
  console.log('\n2️⃣ Probando endpoint protegido del microservicio de reviews...');
  try {
    const response = await axios.get(`${BASE_URL}/reviews/admin`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    console.log('✅ Endpoint protegido funcionando:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error en endpoint protegido:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return null;
  }
};

// 3. Probar crear reseña (debería funcionar con token de usuario)
const testCreateReview = async () => {
  console.log('\n3️⃣ Probando crear reseña...');
  try {
    const reviewData = {
      lugarId: '64f1234567890abcdef12345',
      comentario: 'Prueba de reseña desde script de autenticación',
      calificacion: 4
    };
    
    const response = await axios.post(`${BASE_URL}/reviews/`, reviewData, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Reseña creada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creando reseña:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return null;
  }
};

// 4. Probar endpoint público
const testPublicEndpoint = async () => {
  console.log('\n4️⃣ Probando endpoint público...');
  try {
    const response = await axios.get(`${BASE_URL}/reviews/lugar/64f1234567890abcdef12345`);
    console.log('✅ Endpoint público funcionando:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error en endpoint público:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return null;
  }
};

// Ejecutar todas las pruebas
const runAuthTests = async () => {
  await testAuthService();
  await testReviewsAuth();
  await testCreateReview();
  await testPublicEndpoint();
  
  console.log('\n🏁 Pruebas de autenticación completadas.');
};

runAuthTests().catch(console.error); 