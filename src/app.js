const express = require('express');
const productosRoutes = require('./routes/productos.routes');

const app = express();
const PORT = 3000;

// Middleware obligatorio para interpretar JSON en el body
app.use(express.json());

// Rutas principales
app.use('/api/productos', productosRoutes);

// Manejo de rutas inexistentes (404 general)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

// Manejo de errores no previstos del servidor (500 Internal Server Error)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
