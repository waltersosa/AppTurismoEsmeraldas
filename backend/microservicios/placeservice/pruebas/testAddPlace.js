import fetch from 'node-fetch';

// Pega aquí tu token JWT válido (rol gad)
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODZhZjExOTMwYzI5NzM2Mzc1ODU1MzMiLCJyb2wiOiJnYWQiLCJpYXQiOjE3NTE4Mzk5MTgsImV4cCI6MTc1MTg0NzExOH0.uitoFr2v2vrLFD6c3inh3LUkfuTbz1kIWA3yIueGbdU';

// Datos del lugar a agregar
const placeData = {
  name: 'Playa Escondida',
  description: 'Hermosa playa de arena blanca.',
  category: 'playa',
  location: 'Esmeraldas, Ecuador',
  images: ['https://ejemplo.com/img1.jpg'],
  coverImage: 'https://ejemplo.com/cover.jpg'
};

const url = 'http://localhost:3002/places';

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(placeData)
})
  .then(res => res.json())
  .then(data => {
    console.log('Respuesta del microservicio:', data);
  })
  .catch(err => {
    console.error('Error al hacer la petición:', err);
  }); 