import axios from 'axios';

const SERVICES = {
  auth: 'http://localhost:3001',
  places: 'http://localhost:3002',
  media: 'http://localhost:3003',
  reviews: 'http://localhost:3004'
};

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODZiMDkxMTE3ZmZkMTFjNzFiZDg2MTkiLCJyb2wiOiJ1c3VhcmlvIiwiaWF0IjoxNzUxODQ1MTUwLCJleHAiOjE3NTE4NTIzNTB9.lP3RHydX4_se4m5ORfjOEu35rW9frT7qeTi33XKF1-Y';

console.log('🔍 Verificando estado de todos los microservicios...\n');

// Verificar health check de cada servicio
const checkServiceHealth = async (serviceName, url) => {
  try {
    const response = await axios.get(url);
    console.log(`✅ ${serviceName} (${url}):`, response.data.message || 'Funcionando');
    return true;
  } catch (error) {
    console.error(`❌ ${serviceName} (${url}):`, error.message);
    return false;
  }
};

// Verificar validación de token en auth service
const checkAuthValidation = async () => {
  try {
    const response = await axios.post(`${SERVICES.auth}/auth/validate`, {}, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    console.log('✅ Validación de token en auth service:', response.data.success ? 'Válido' : 'Inválido');
    return response.data.success;
  } catch (error) {
    console.error('❌ Error validando token en auth service:', error.message);
    return false;
  }
};

// Verificar comunicación entre microservicios
const checkMicroserviceCommunication = async () => {
  console.log('\n🔗 Verificando comunicación entre microservicios...');
  
  // Verificar que reviews puede comunicarse con auth
  try {
    const response = await axios.get(`${SERVICES.reviews}/reviews/admin`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    console.log('✅ Comunicación reviews -> auth: Funcionando');
  } catch (error) {
    console.error('❌ Comunicación reviews -> auth:', error.response?.data?.message || error.message);
  }
  
  // Verificar que reviews puede comunicarse con places
  try {
    const response = await axios.post(`${SERVICES.reviews}/reviews/`, {
      lugarId: '64f1234567890abcdef12345',
      comentario: 'Prueba de comunicación',
      calificacion: 3
    }, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    console.log('✅ Comunicación reviews -> places: Funcionando');
  } catch (error) {
    console.error('❌ Comunicación reviews -> places:', error.response?.data?.message || error.message);
  }
};

// Ejecutar verificaciones
const runChecks = async () => {
  console.log('📊 Verificando health checks...\n');
  
  const healthResults = await Promise.allSettled([
    checkServiceHealth('Auth Service', SERVICES.auth),
    checkServiceHealth('Places Service', SERVICES.places),
    checkServiceHealth('Media Service', SERVICES.media),
    checkServiceHealth('Reviews Service', SERVICES.reviews)
  ]);
  
  console.log('\n🔐 Verificando autenticación...');
  await checkAuthValidation();
  
  await checkMicroserviceCommunication();
  
  console.log('\n📋 Resumen:');
  healthResults.forEach((result, index) => {
    const serviceNames = ['Auth', 'Places', 'Media', 'Reviews'];
    const status = result.status === 'fulfilled' && result.value ? '✅' : '❌';
    console.log(`${status} ${serviceNames[index]} Service`);
  });
};

runChecks().catch(console.error); 