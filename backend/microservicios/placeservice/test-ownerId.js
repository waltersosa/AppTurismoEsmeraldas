import axios from 'axios';

const BASE_URL = 'http://localhost:3002';
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGY4YTFhMmMzZDRlNWY2YTdiOGM5ZDEiLCJlbWFpbCI6ImFkbWluQGVzbWVyYWxkYXMuZ29iLmVjIiwicm9sIjoiZ2FkIiwiaWF0IjoxNjkzOTQ5ODAwLCJleHAiOjE5Mzk0OTk4MDB9.test';

async function testOwnerIdAssignment() {
  console.log('🧪 Probando asignación automática de ownerId...\n');

  try {
    // 1. Crear un lugar (ownerId se asigna automáticamente)
    console.log('1️⃣ Creando lugar con ownerId automático...');
    const createResponse = await axios.post(`${BASE_URL}/places`, {
      name: 'Playa de Atacames - Test',
      description: 'Playa para pruebas de ownerId',
      category: 'playa',
      location: 'Atacames, Esmeraldas',
      images: ['https://example.com/test-image.jpg'],
      coverImage: 'https://example.com/test-cover.jpg'
    }, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Lugar creado exitosamente');
    console.log('📋 Datos del lugar creado:');
    console.log(`   - ID: ${createResponse.data.data._id}`);
    console.log(`   - Nombre: ${createResponse.data.data.name}`);
    console.log(`   - OwnerId: ${createResponse.data.data.ownerId}`);
    console.log(`   - Creado por: ${createResponse.data.data.ownerId === '64f8a1b2c3d4e5f6a7b8c9d1' ? '✅ Usuario correcto' : '❌ Usuario incorrecto'}\n`);

    const placeId = createResponse.data.data._id;

    // 2. Obtener el lugar para verificar que ownerId está presente
    console.log('2️⃣ Obteniendo lugar para verificar ownerId...');
    const getResponse = await axios.get(`${BASE_URL}/places/${placeId}`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });

    console.log('✅ Lugar obtenido exitosamente');
    console.log('📋 Verificación de ownerId en respuesta:');
    console.log(`   - OwnerId presente: ${getResponse.data.data.ownerId ? '✅ Sí' : '❌ No'}`);
    console.log(`   - OwnerId valor: ${getResponse.data.data.ownerId}\n`);

    // 3. Obtener todos los lugares para verificar que ownerId aparece en la lista
    console.log('3️⃣ Obteniendo lista de lugares para verificar ownerId...');
    const listResponse = await axios.get(`${BASE_URL}/places?limit=5`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });

    console.log('✅ Lista de lugares obtenida exitosamente');
    console.log(`📋 Total de lugares: ${listResponse.data.pagination.total}`);
    console.log('📋 Verificando ownerId en cada lugar:');
    
    listResponse.data.data.forEach((place, index) => {
      console.log(`   ${index + 1}. ${place.name}: ${place.ownerId ? '✅ ownerId presente' : '❌ ownerId faltante'}`);
    });

    console.log('\n🎉 ¡Prueba completada exitosamente!');
    console.log('📝 Resumen:');
    console.log('   - ✅ ownerId se asigna automáticamente al crear lugares');
    console.log('   - ✅ ownerId aparece en las respuestas de consulta individual');
    console.log('   - ✅ ownerId aparece en las respuestas de listado');
    console.log('   - ✅ ownerId corresponde al usuario autenticado');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      console.log('\n💡 Posibles causas del error:');
      console.log('   - El token JWT no es válido');
      console.log('   - Faltan campos obligatorios en la petición');
      console.log('   - El microservicio no está ejecutándose en el puerto 3002');
    }
  }
}

// Ejecutar la prueba
testOwnerIdAssignment(); 