import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const microservices = [
  'authservice',
  'placeservice', 

  'reviewservice',
  'notificationsservice',
  'statservice'
];

console.log('🔧 Instalando dependencias para todos los microservicios...\n');

microservices.forEach(service => {
  const servicePath = path.join('microservicios', service);
  
  if (fs.existsSync(servicePath)) {
    console.log(`📦 Instalando dependencias para ${service}...`);
    
    try {
      // Verificar si existe package.json
      const packageJsonPath = path.join(servicePath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        execSync('npm install', { 
          cwd: servicePath, 
          stdio: 'inherit' 
        });
        console.log(`✅ ${service} - Dependencias instaladas correctamente\n`);
      } else {
        console.log(`⚠️  ${service} - No se encontró package.json\n`);
      }
    } catch (error) {
      console.error(`❌ ${service} - Error instalando dependencias:`, error.message, '\n');
    }
  } else {
    console.log(`⚠️  ${service} - Directorio no encontrado\n`);
  }
});

console.log('🎉 Proceso de instalación completado!');
console.log('\n📝 Próximos pasos:');
console.log('1. Reiniciar todos los microservicios');
console.log('2. Verificar que CORS esté funcionando correctamente');
console.log('3. Probar la conexión desde el BackOffice'); 