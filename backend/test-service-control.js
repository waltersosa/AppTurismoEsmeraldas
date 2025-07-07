import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(exec);

// Configuración de los microservicios
const microservices = {
  places: {
    name: 'Places Service', 
    path: path.join(__dirname, 'microservicios/placeservice'),
    port: 3002,
    processName: 'placeservice'
  },
  media: {
    name: 'Media Upload Service',
    path: path.join(__dirname, 'microservicios/mediaupload'), 
    port: 3003,
    processName: 'mediaupload'
  }
};

// Comandos para Windows
const getWindowsCommands = (service, action) => {
  const basePath = service.path;
  
  switch (action) {
    case 'start':
      return `cd "${basePath}" && npm start`;
    case 'stop':
      return `taskkill /F /IM node.exe /FI "WINDOWTITLE eq *${service.processName}*" 2>nul || taskkill /F /IM node.exe /FI "COMMANDLINE eq *${service.processName}*" 2>nul || echo "No se encontraron procesos para terminar"`;
    case 'restart':
      return `cd "${basePath}" && (taskkill /F /IM node.exe /FI "WINDOWTITLE eq *${service.processName}*" 2>nul || taskkill /F /IM node.exe /FI "COMMANDLINE eq *${service.processName}*" 2>nul) && timeout /t 2 /nobreak >nul && npm start`;
    default:
      throw new Error(`Acción no válida: ${action}`);
  }
};

async function testServiceControl() {
  console.log('🧪 Probando control de servicios...\n');

  for (const [serviceName, service] of Object.entries(microservices)) {
    console.log(`📋 Probando servicio: ${service.name}`);
    console.log(`📁 Ruta: ${service.path}`);
    
    // Verificar si el directorio existe
    const fs = await import('fs');
    if (!fs.existsSync(service.path)) {
      console.log(`❌ Directorio no encontrado: ${service.path}\n`);
      continue;
    }
    
    // Verificar si package.json existe
    const packagePath = path.join(service.path, 'package.json');
    if (!fs.existsSync(packagePath)) {
      console.log(`❌ package.json no encontrado: ${packagePath}\n`);
      continue;
    }

    // Probar comando start
    try {
      console.log(`🔄 Probando comando start...`);
      const command = getWindowsCommands(service, 'start');
      console.log(`📝 Comando: ${command}`);
      
      const { stdout, stderr } = await execAsync(command, {
        shell: true,
        timeout: 10000,
        cwd: service.path
      });
      
      console.log(`✅ Comando ejecutado exitosamente`);
      if (stdout) console.log(`📤 Output: ${stdout}`);
      if (stderr) console.log(`⚠️ Warnings: ${stderr}`);
      
    } catch (error) {
      console.log(`❌ Error ejecutando comando: ${error.message}`);
    }
    
    console.log(''); // Línea en blanco
  }
}

testServiceControl().catch(console.error); 