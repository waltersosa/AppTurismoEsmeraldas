import { spawn } from 'child_process';
import path from 'path';

const microservices = [
  { name: 'Auth Service', path: 'microservicios/authservice', port: 3001 },
  { name: 'Places Service', path: 'microservicios/placeservice', port: 3002 },
  { name: 'Media Upload Service', path: 'microservicios/mediaupload', port: 3003 },
  { name: 'Reviews Service', path: 'microservicios/reviewservice', port: 3004 },
  { name: 'Stats Service', path: 'microservicios/statservice', port: 3005 },
  { name: 'Notifications Service', path: 'microservicios/notificationsservice', port: 3006 }
];

console.log('🚀 Iniciando todos los microservicios...\n');

const processes = [];

microservices.forEach(service => {
  console.log(`📡 Iniciando ${service.name} en puerto ${service.port}...`);
  
  //Ejecuta node index.js en el directorio de cada microservicio
  const child = spawn('node', ['index.js'], {
    cwd: path.join(process.cwd(), service.path),
    stdio: 'pipe',
    shell: true
  });

  //Imprimir salida estándar con el nomre del servicio
  child.stdout.on('data', (data) => {
    console.log(`[${service.name}] ${data.toString().trim()}`);
  });
  //Imprimir salida de error estándar
  child.stderr.on('data', (data) => {
    console.error(`[${service.name}] ERROR: ${data.toString().trim()}`);
  });

  child.on('close', (code) => {
    console.log(`[${service.name}] Proceso terminado con código ${code}`);
  });

  child.on('error', (error) => {
    console.error(`[${service.name}] Error iniciando proceso:`, error.message);
  });

  processes.push(child);
});

// Manejar cierre del proceso principal
process.on('SIGINT', () => {
  console.log('\n🛑 Deteniendo todos los microservicios...');
  processes.forEach(child => {
    child.kill('SIGINT');
  });
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Deteniendo todos los microservicios...');
  processes.forEach(child => {
    child.kill('SIGTERM');
  });
  process.exit(0);
});

console.log('\n✅ Todos los microservicios iniciados.');
console.log('📊 Para verificar el estado, visita: http://localhost:3005/health/simple');
console.log('🛑 Presiona Ctrl+C para detener todos los servicios\n'); 