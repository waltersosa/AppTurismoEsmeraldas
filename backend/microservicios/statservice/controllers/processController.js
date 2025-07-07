import { exec } from 'child_process';

// Mapeo de servicios a comandos y PIDs (ajusta según tu entorno)
const services = {
  auth: {
    name: 'AuthService',
    port: 3001,
    start: 'cd ../../authservice && npm start',
    processName: 'node'
  },
  places: {
    name: 'PlaceService',
    port: 3002,
    start: 'cd ../../placeservice && npm start',
    processName: 'node'
  },
  media: {
    name: 'MediaUpload',
    port: 3003,
    start: 'cd ../../mediaupload && npm start',
    processName: 'node'
  },
  reviews: {
    name: 'ReviewService',
    port: 3004,
    start: 'cd ../../reviewservice && npm start',
    processName: 'node'
  },
  stats: {
    name: 'StatsService',
    port: 3005,
    start: 'cd ../../statservice && npm start',
    processName: 'node'
  },
  notifications: {
    name: 'NotificationService',
    port: 3006,
    start: 'cd ../../notificationservice && npm start',
    processName: 'node'
  }
};

export const stopService = (req, res) => {
  const { name } = req.params;
  const service = services[name];
  if (!service) {
    return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
  }
  // Buscar el PID por puerto
  exec(`netstat -ano | findstr :${service.port}`, (err, stdout) => {
    if (err || !stdout) {
      return res.status(404).json({ success: false, message: 'No se encontró el proceso en ese puerto' });
    }
    // Extraer el PID
    const match = stdout.match(/\s(\d+)\s*$/m);
    if (!match) {
      return res.status(404).json({ success: false, message: 'No se pudo extraer el PID' });
    }
    const pid = match[1];
    // Advertencia especial para AuthService
    if (name === 'auth') {
      // Solo advertencia, no bloquea
      console.warn('¡Advertencia! Detener AuthService cerrará la sesión de todos los usuarios.');
    }
    exec(`taskkill /PID ${pid} /F`, (err2) => {
      if (err2) {
        return res.status(500).json({ success: false, message: 'Error al detener el proceso', error: err2.message });
      }
      res.json({ success: true, message: `Servicio ${service.name} detenido (PID: ${pid})` });
    });
  });
};

export const startService = (req, res) => {
  const { name } = req.params;
  const service = services[name];
  if (!service) {
    return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
  }
  exec(service.start, { detached: true, shell: true }, (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error al iniciar el servicio', error: err.message });
    }
    res.json({ success: true, message: `Servicio ${service.name} iniciado` });
  });
}; 