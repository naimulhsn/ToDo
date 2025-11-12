const express = require('express');
const router = express.Router();
const validateToken = require('../middleware/auth');
const todoController = require('../controllers/todoController');

// GET /api/todos - Get all todos (protected)
router.get('/', validateToken, todoController.getAllTodos);

// GET /api/todos/:id - Get a single todo by ID (protected)
router.get('/:id', validateToken, todoController.getTodoById);

// POST /api/todos - Create a new todo (protected)
router.post('/', validateToken, todoController.createTodo);

// PUT /api/todos/:id - Update a todo (protected)
router.put('/:id', validateToken, todoController.updateTodo);

// DELETE /api/todos/:id - Delete a todo (protected)
router.delete('/:id', validateToken, todoController.deleteTodo);

module.exports = router;

