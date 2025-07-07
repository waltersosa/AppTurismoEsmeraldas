import axios from 'axios';

const BASE_URL = 'http://localhost:3005';

async function testHealthCheck() {
  console.log('🏥 Probando Health Check de Microservicios...\n');

  try {
    // 1. Health check completo
    console.log('1️⃣ Probando health check completo...');
    const fullHealthResponse = await axios.get(`${BASE_URL}/health`);
    
    console.log('✅ Health check completo exitoso');
    console.log(`📊 Estado general: ${fullHealthResponse.data.data.overall.status.toUpperCase()}`);
    console.log(`📈 Servicios online: ${fullHealthResponse.data.data.overall.onlineServices}/${fullHealthResponse.data.data.overall.totalServices}`);
    console.log(`⏱️  Uptime: ${fullHealthResponse.data.data.overall.uptime}\n`);

    // Mostrar estado de cada servicio
    console.log('📋 Estado de cada microservicio:');
    fullHealthResponse.data.data.services.forEach(service => {
      const statusIcon = service.status === 'online' ? '✅' : '❌';
      console.log(`   ${statusIcon} ${service.service} (Puerto ${service.port}): ${service.status.toUpperCase()}`);
      if (service.status === 'online') {
        console.log(`      ⏱️  Tiempo de respuesta: ${service.responseTime}`);
        console.log(`      📊 Status Code: ${service.statusCode}`);
      } else {
        console.log(`      ❌ Error: ${service.error}`);
      }
    });

    console.log('\n');

    // 2. Health check simplificado
    console.log('2️⃣ Probando health check simplificado...');
    const simpleHealthResponse = await axios.get(`${BASE_URL}/health/simple`);
    
    console.log('✅ Health check simplificado exitoso');
    console.log(`📊 Estado: ${simpleHealthResponse.data.status.toUpperCase()}`);
    console.log(`📈 Servicios: ${simpleHealthResponse.data.online}/${simpleHealthResponse.data.total} online\n`);

    // 3. Health check de servicios individuales
    console.log('3️⃣ Probando health check de servicios individuales...');
    const services = ['auth', 'places', 'media', 'reviews', 'notifications'];
    
    for (const service of services) {
      try {
        const serviceHealthResponse = await axios.get(`${BASE_URL}/health/${service}`);
        const statusIcon = serviceHealthResponse.data.data.status === 'online' ? '✅' : '❌';
        console.log(`   ${statusIcon} ${serviceHealthResponse.data.data.service}: ${serviceHealthResponse.data.data.status.toUpperCase()}`);
      } catch (error) {
        console.log(`   ❌ Error al verificar ${service}: ${error.response?.data?.message || error.message}`);
      }
    }

    console.log('\n🎉 ¡Pruebas de health check completadas!');
    console.log('📝 Resumen:');
    console.log(`   - ✅ Health check completo: ${fullHealthResponse.status === 200 ? 'Funcionando' : 'Error'}`);
    console.log(`   - ✅ Health check simplificado: ${simpleHealthResponse.status === 200 ? 'Funcionando' : 'Error'}`);
    console.log(`   - ✅ Health check individual: Funcionando para servicios disponibles`);

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('\n💡 Posibles causas:');
      console.log('   - El microservicio de Stats no está ejecutándose en el puerto 3005');
      console.log('   - Las rutas de health check no están configuradas correctamente');
    }
  }
}

// Función para probar con diferentes escenarios
async function testHealthScenarios() {
  console.log('\n🔍 Probando diferentes escenarios de health check...\n');

  try {
    // Escenario 1: Todos los servicios online
    console.log('📊 Escenario 1: Verificar todos los servicios...');
    const response1 = await axios.get(`${BASE_URL}/health/simple`);
    console.log(`   Estado: ${response1.data.status}`);
    console.log(`   Servicios: ${response1.data.online}/${response1.data.total} online`);

    // Escenario 2: Verificar servicio específico
    console.log('\n📊 Escenario 2: Verificar servicio específico (auth)...');
    try {
      const response2 = await axios.get(`${BASE_URL}/health/auth`);
      console.log(`   Auth Service: ${response2.data.data.status}`);
    } catch (error) {
      console.log(`   Auth Service: ${error.response?.data?.data?.status || 'Error'}`);
    }

    // Escenario 3: Verificar servicio inexistente
    console.log('\n📊 Escenario 3: Verificar servicio inexistente...');
    try {
      await axios.get(`${BASE_URL}/health/inexistente`);
    } catch (error) {
      console.log(`   Servicio inexistente: ${error.response?.data?.message || 'Error esperado'}`);
    }

  } catch (error) {
    console.error('❌ Error en escenarios:', error.response?.data || error.message);
  }
}

// Ejecutar pruebas
async function runAllTests() {
  await testHealthCheck();
  await testHealthScenarios();
}

runAllTests(); 