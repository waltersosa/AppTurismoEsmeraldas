import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(exec);

// Configuración de los microservicios
const microservices = {
  auth: {
    name: 'Auth Service',
    path: path.join(__dirname, '../../authservice'),
    port: 3001,
    processName: 'authservice'
  },
  places: {
    name: 'Places Service', 
    path: path.join(__dirname, '../../placeservice'),
    port: 3002,
    processName: 'placeservice'
  },
  media: {
    name: 'Media Upload Service',
    path: path.join(__dirname, '../../mediaupload'), 
    port: 3003,
    processName: 'mediaupload'
  },
  reviews: {
    name: 'Reviews Service',
    path: path.join(__dirname, '../../reviewservice'),
    port: 3004,
    processName: 'reviewservice'
  },
  notifications: {
    name: 'Notifications Service',
    path: path.join(__dirname, '../../notificationsservice'),
    port: 3006,
    processName: 'notificationsservice'
  },
  stats: {
    name: 'Stats Service',
    path: path.join(__dirname, '../../statservice'),
    port: 3006,
    processName: 'statservice'
  }
};

// Comandos usando PM2
const getPM2Commands = (service, action) => {
  const basePath = service.path;
  const processName = service.processName;
  switch (action) {
    case 'start':
      return `pm2 start index.js --name ${processName} --cwd \"${basePath}\"`;
    case 'stop':
      return `pm2 stop ${processName}`;
    case 'restart':
      return `pm2 restart ${processName}`;
    default:
      throw new Error(`Acción no válida: ${action}`);
  }
};

// Obtener información de todos los servicios
export const getServicesInfo = async (req, res) => {
  try {
    const servicesInfo = Object.entries(microservices).map(([key, service]) => ({
      id: key,
      name: service.name,
      port: service.port,
      path: service.path,
      processName: service.processName,
      availableActions: ['start', 'stop', 'restart']
    }));

    res.json({
      success: true,
      message: 'Información de servicios obtenida',
      data: {
        services: servicesInfo,
        total: servicesInfo.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo información de servicios:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error obteniendo información de servicios',
      error: error.message
    });
  }
};

// Obtener estado de un servicio específico
export const getServiceStatus = async (req, res) => {
  try {
    const { serviceName } = req.params;
    
    const service = microservices[serviceName];
    if (!service) {
      return res.status(404).json({
        success: false,
        message: `Servicio '${serviceName}' no encontrado`
      });
    }

    // Verificar si el proceso está corriendo
    const isWindows = process.platform === 'win32';
    const checkCommand = isWindows
      ? `tasklist /FI "IMAGENAME eq node.exe" /FI "WINDOWTITLE eq *${service.processName}*" 2>nul`
      : `pgrep -f "${service.processName}"`;

    try {
      const { stdout } = await execAsync(checkCommand, { shell: true });
      const isRunning = stdout.trim().length > 0;

      res.json({
        success: true,
        message: `Estado de ${service.name} obtenido`,
        data: {
          service: service.name,
          isRunning,
          port: service.port,
          processName: service.processName,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      // Si no se encuentra el proceso, asumir que no está corriendo
      res.json({
        success: true,
        message: `Estado de ${service.name} obtenido`,
        data: {
          service: service.name,
          isRunning: false,
          port: service.port,
          processName: service.processName,
          timestamp: new Date().toISOString()
        }
      });
    }

  } catch (error) {
    console.error('❌ Error obteniendo estado del servicio:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estado del servicio',
      error: error.message
    });
  }
};

// Controlador principal para controlar servicios
export const controlService = async (req, res) => {
  try {
    const { serviceName, action } = req.params;
    
    console.log(`🔄 Control de servicio solicitado: ${serviceName} - ${action}`);
    
    // Validar parámetros
    if (!serviceName || !action) {
      return res.status(400).json({
        success: false,
        message: 'Nombre del servicio y acción son requeridos'
      });
    }

    // Verificar si el servicio existe
    const service = microservices[serviceName];
    if (!service) {
      console.log(`❌ Servicio no encontrado: ${serviceName}`);
      return res.status(404).json({
        success: false,
        message: `Servicio '${serviceName}' no encontrado`,
        availableServices: Object.keys(microservices)
      });
    }

    // Verificar si la acción es válida
    const validActions = ['start', 'stop', 'restart'];
    if (!validActions.includes(action)) {
      console.log(`❌ Acción no válida: ${action}`);
      return res.status(400).json({
        success: false,
        message: `Acción '${action}' no válida`,
        validActions
      });
    }

    // Advertencia especial para el servicio de autenticación
    if (serviceName === 'auth' && action === 'stop') {
      console.warn('⚠️ ADVERTENCIA: Se está intentando detener el servicio de autenticación');
    }

    // Usar PM2 para controlar los servicios
    const command = getPM2Commands(service, action);
    console.log(`🔄 Ejecutando comando: ${command}`);
    console.log(`📁 Directorio del servicio: ${service.path}`);

    // Ejecutar el comando
    try {
      const { stdout, stderr } = await execAsync(command, {
        shell: true,
        timeout: 30000
      });

      const response = {
        success: true,
        message: `Acción '${action}' ejecutada en ${service.name} (PM2)` ,
        data: {
          service: service.name,
          action,
          command: command,
          timestamp: new Date().toISOString(),
          output: stdout || 'Comando ejecutado exitosamente',
          error: stderr || null,
          path: service.path
        }
      };
      console.log(`✅ ${response.message}`);
      if (stdout) {
        console.log(`📤 Output: ${stdout}`);
      }
      if (stderr) {
        console.warn(`⚠️ Advertencias: ${stderr}`);
      }
      res.json(response);
    } catch (execError) {
      console.error(`❌ Error controlando servicio con PM2:`, execError);
      res.status(500).json({
        success: false,
        message: 'Error ejecutando comando con PM2',
        error: execError.message,
        timestamp: new Date().toISOString(),
        details: {
          serviceName: req.params.serviceName,
          action: req.params.action,
          platform: process.platform
        }
      });
    }
  } catch (error) {
    console.error(`❌ Error general en controlService:`, error);
    res.status(500).json({
      success: false,
      message: 'Error general en controlService',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Detener todos los servicios excepto auth y stats
export const stopAllServices = async (req, res) => {
  try {
    const exclude = ['auth', 'stats'];
    const results = [];
    for (const [key, service] of Object.entries(microservices)) {
      if (exclude.includes(key)) continue;
      const command = `pm2 stop ${service.processName}`;
      try {
        const { stdout, stderr } = await execAsync(command, { shell: true, timeout: 20000 });
        results.push({
          service: service.name,
          key,
          status: 'stopped',
          output: stdout,
          error: stderr || null
        });
      } catch (error) {
        results.push({
          service: service.name,
          key,
          status: 'error',
          output: error.stdout || '',
          error: error.stderr || error.message
        });
      }
    }
    // Consultar estado final de todos los servicios
    const finalStates = [];
    for (const [key, service] of Object.entries(microservices)) {
      const checkCommand = `pm2 info ${service.processName}`;
      try {
        const { stdout } = await execAsync(checkCommand, { shell: true, timeout: 10000 });
        const isStopped = stdout.includes('status') && stdout.includes('stopped');
        finalStates.push({
          service: service.name,
          key,
          status: isStopped ? 'stopped' : 'online',
          info: stdout
        });
      } catch (error) {
        finalStates.push({
          service: service.name,
          key,
          status: 'unknown',
          info: error.message
        });
      }
    }
    res.json({
      success: true,
      message: 'Servicios detenidos (excepto auth y stats)',
      results,
      finalStates,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deteniendo todos los servicios',
      error: error.message
    });
  }
};

// Iniciar todos los servicios excepto auth y stats
export const startAllServices = async (req, res) => {
  try {
    const exclude = ['auth', 'stats'];
    const results = [];
    for (const [key, service] of Object.entries(microservices)) {
      if (exclude.includes(key)) continue;
      const command = `pm2 start ${service.processName}`;
      try {
        const { stdout, stderr } = await execAsync(command, { shell: true, timeout: 20000 });
        results.push({
          service: service.name,
          key,
          status: 'started',
          output: stdout,
          error: stderr || null
        });
      } catch (error) {
        results.push({
          service: service.name,
          key,
          status: 'error',
          output: error.stdout || '',
          error: error.stderr || error.message
        });
      }
    }
    // Consultar estado final de todos los servicios
    const finalStates = [];
    for (const [key, service] of Object.entries(microservices)) {
      const checkCommand = `pm2 info ${service.processName}`;
      try {
        const { stdout } = await execAsync(checkCommand, { shell: true, timeout: 10000 });
        const isOnline = stdout.includes('status') && stdout.includes('online');
        finalStates.push({
          service: service.name,
          key,
          status: isOnline ? 'online' : 'stopped',
          info: stdout
        });
      } catch (error) {
        finalStates.push({
          service: service.name,
          key,
          status: 'unknown',
          info: error.message
        });
      }
    }
    res.json({
      success: true,
      message: 'Servicios iniciados (excepto auth y stats)',
      results,
      finalStates,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error iniciando todos los servicios',
      error: error.message
    });
  }
};