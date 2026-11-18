const express = require('express');
const router = express.Router();
let productos = require('../data/productos');

// 1. GET /api/productos - Listar todos los productos (200 OK)
router.get('/', (req, res) => {
  res.status(200).json(productos);
});

// 2. GET /api/productos/:id - Obtener un producto por ID (200 OK / 400 / 404)
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número válido.' });
  }

  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }

  res.status(200).json(producto);
});

// 3. POST /api/productos - Crear un nuevo producto (201 Created / 400 Bad Request)
router.post('/', (req, res) => {
  const { nombre, precio, stock } = req.body;

  // Validación de campos obligatorios y tipos de datos
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El campo "nombre" es obligatorio y debe ser texto.' });
  }

  if (precio === undefined || typeof precio !== 'number' || precio <= 0) {
    return res.status(400).json({ error: 'El campo "precio" es obligatorio y debe ser mayor a 0.' });
  }

  if (stock === undefined || typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ error: 'El campo "stock" es obligatorio y no puede ser negativo.' });
  }

  // Generar ID autoincremental simple
  const nuevoId = productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1;

  const nuevoProducto = {
    id: nuevoId,
    nombre: nombre.trim(),
    precio,
    stock
  };

  productos.push(nuevoProducto);

  res.status(201).json(nuevoProducto);
});

// 4. PUT /api/productos/:id - Modificar un producto existente (200 OK / 400 / 404)
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número válido.' });
  }

  const index = productos.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }

  const { nombre, precio, stock } = req.body;

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El campo "nombre" es obligatorio y debe ser texto.' });
  }

  if (precio === undefined || typeof precio !== 'number' || precio <= 0) {
    return res.status(400).json({ error: 'El campo "precio" es obligatorio y debe ser mayor a 0.' });
  }

  if (stock === undefined || typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ error: 'El campo "stock" es obligatorio y no puede ser negativo.' });
  }

  productos[index] = {
    id,
    nombre: nombre.trim(),
    precio,
    stock
  };

  res.status(200).json(productos[index]);
});

// 5. DELETE /api/productos/:id - Eliminar un producto (204 No Content / 400 / 404)
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número válido.' });
  }

  const existe = productos.some((p) => p.id === id);

  if (!existe) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }

  productos = productos.filter((p) => p.id !== id);

  // 204 No Content: operación correcta sin cuerpo de respuesta
  res.status(204).send();
});

module.exports = router;
