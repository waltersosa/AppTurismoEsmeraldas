import express from 'express';
import connectMediaDB from './config/db.js';
import config from './config/config.js';
import router from './routes/routes.js';
import path from 'path';

const app = express();
app.use(express.json());

// Servir archivos estáticos de la carpeta uploads
app.use('/uploads', express.static(path.resolve('uploads')));

app.use(router);

const start = async () => {
  await connectMediaDB();
  app.listen(config.port, () => {
    console.log(`🚀 MediaUploadService corriendo en http://localhost:${config.port}`);
  });
};

start(); 