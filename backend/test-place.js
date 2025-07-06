import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

// Función para hacer login y obtener token
async function login() {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        correo: 'gad@esmeraldas.gob.ec',
        contraseña: 'GAD123456'
      })
    });

    const data = await response.json();
    console.log('Login response:', data);
    
    if (data.success && data.data?.token) {
      return data.data.token;
    } else {
      throw new Error('Login failed: ' + JSON.stringify(data));
    }
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}

// Función para probar la validación
async function testValidation(token) {
  try {
    const testData = {
      name: 'Playa de Atacames',
      description: 'Hermosa playa en la costa de Esmeraldas con aguas cálidas y arena blanca',
      location: 'Atacames, Esmeraldas, Ecuador',
      category: 'Playa'
    };

    console.log('Probando validación con datos:', testData);

    const response = await fetch(`${BASE_URL}/places/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testData)
    });

    const data = await response.json();
    console.log('Respuesta de validación:', data);
    
    return data;
  } catch (error) {
    console.error('Error en validación:', error);
    throw error;
  }
}

// Función para crear un lugar
async function createPlace(token) {
  try {
    const placeData = {
      name: 'Playa de Atacames',
      description: 'Hermosa playa en la costa de Esmeraldas con aguas cálidas y arena blanca',
      location: 'Atacames, Esmeraldas, Ecuador',
      category: 'Playa'
    };

    console.log('Creando lugar con datos:', placeData);

    const response = await fetch(`${BASE_URL}/places`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(placeData)
    });

    const data = await response.json();
    console.log('Respuesta de creación:', data);
    
    return data;
  } catch (error) {
    console.error('Error en creación:', error);
    throw error;
  }
}

// Función para actualizar estado de un lugar
async function updatePlaceStatus(token, placeId) {
  try {
    const updateData = { active: false };

    console.log('Actualizando estado del lugar:', placeId, 'con datos:', updateData);

    const response = await fetch(`${BASE_URL}/places/${placeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });

    const data = await response.json();
    console.log('Respuesta de actualización:', data);
    
    return data;
  } catch (error) {
    console.error('Error en actualización:', error);
    throw error;
  }
}

// Función principal
async function runTests() {
  try {
    console.log('=== Iniciando pruebas ===');
    
    // 1. Login
    console.log('\n1. Probando login...');
    const token = await login();
    console.log('Token obtenido:', token.substring(0, 20) + '...');
    
    // 2. Probar validación
    console.log('\n2. Probando validación...');
    await testValidation(token);
    
    // 3. Crear lugar
    console.log('\n3. Probando creación de lugar...');
    const createResult = await createPlace(token);
    
    if (createResult.success && createResult.data?._id) {
      // 4. Actualizar estado
      console.log('\n4. Probando actualización de estado...');
      await updatePlaceStatus(token, createResult.data._id);
    }
    
    console.log('\n=== Pruebas completadas ===');
  } catch (error) {
    console.error('Error en las pruebas:', error);
  }
}

// Ejecutar pruebas
runTests(); 