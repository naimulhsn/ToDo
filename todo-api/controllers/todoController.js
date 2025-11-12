const logger = require('../logger');
const Todo = require('../models/Todo');

/**
 * Get all todos for authenticated user
 */
const getAllTodos = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        logger.info({
            message: 'Fetching all todos',
            requestId: req.requestId,
            userId,
            action_type: 'todos_fetched'
        });
        
        const todos = await Todo.find({ userId }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: todos.length,
            data: todos
        });
    } catch (error) {
        logger.error({
            message: 'Error fetching todos',
            requestId: req.requestId,
            userId: req.user?.userId,
            action_type: 'todos_fetch_error',
            error: {
                message: error.message,
                type: error.name,
                stack: error.stack
            }
        });
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Get a single todo by ID
 */
const getTodoById = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;
        
        const todo = await Todo.findOne({ _id: id, userId });

        if (!todo) {
            logger.warn({
                message: `Todo not found with id: ${id}`,
                requestId: req.requestId,
                todoId: id,
                userId,
                action_type: 'todo_not_found'
            });
            return res.status(404).json({
                success: false,
                message: `Todo not found with id: ${id}`
            });
        }

        logger.info({
            message: `Fetched todo with id: ${id}`,
            requestId: req.requestId,
            todoId: id,
            userId,
            action_type: 'todo_fetched'
        });
        res.status(200).json({
            success: true,
            data: todo
        });
    } catch (error) {
        logger.error({
            message: 'Error fetching todo',
            requestId: req.requestId,
            userId: req.user?.userId,
            action_type: 'todo_fetch_error',
            error: {
                message: error.message,
                type: error.name,
                stack: error.stack
            }
        });
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Create a new todo
 */
const createTodo = async (req, res) => {
    try {
        const { title, description, completed } = req.body;
        const userId = req.user.userId;

        // Validation
        if (!title || title.trim() === '') {
            logger.warn({
                message: 'Create todo failed: Title is required',
                requestId: req.requestId,
                userId,
                action_type: 'todo_creation_failed'
            });
            return res.status(400).json({
                success: false,
                message: 'Title is required'
            });
        }

        const newTodo = new Todo({
            title: title.trim(),
            description: description ? description.trim() : '',
            completed: completed || false,
            userId
        });

        await newTodo.save();
        
        logger.info({
            message: 'Todo created successfully',
            requestId: req.requestId,
            todoId: newTodo._id,
            title: newTodo.title,
            userId,
            action_type: 'todo_created',
            todo_status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Todo created successfully',
            data: newTodo
        });
    } catch (error) {
        logger.error({
            message: 'Error creating todo',
            requestId: req.requestId,
            userId: req.user?.userId,
            action_type: 'todo_creation_error',
            error: {
                message: error.message,
                type: error.name,
                stack: error.stack
            }
        });
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Update a todo
 */
const updateTodo = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, completed } = req.body;
        const userId = req.user.userId;

        const todo = await Todo.findOne({ _id: id, userId });

        if (!todo) {
            logger.warn({
                message: `Update failed: Todo not found with id: ${id}`,
                requestId: req.requestId,
                todoId: id,
                userId,
                action_type: 'todo_update_failed'
            });
            return res.status(404).json({
                success: false,
                message: `Todo not found with id: ${id}`
            });
        }

        // Capture previous completed state before any mutation
        const previousCompleted = todo.completed;

        // Update only provided fields
        if (title !== undefined) {
            if (title.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Title cannot be empty'
                });
            }
            todo.title = title.trim();
        }

        if (description !== undefined) {
            todo.description = description.trim();
        }

        if (completed !== undefined) {
            todo.completed = completed;
        }

        await todo.save();

        // Check if completion status changed (based on original state)
        const isNowCompleted = todo.completed;
        const completionChanged = completed !== undefined && previousCompleted !== isNowCompleted;

        if (completionChanged) {
            logger.info({
                message: isNowCompleted ? 'Todo marked as complete' : 'Todo unmarked as complete',
                requestId: req.requestId,
                todoId: id,
                userId,
                action_type: isNowCompleted ? 'todo_completed' : 'todo_uncompleted',
                was_completed: previousCompleted,
                is_completed: isNowCompleted
            });
        } else {
            logger.info({
                message: 'Todo updated successfully',
                requestId: req.requestId,
                todoId: id,
                userId,
                action_type: 'todo_updated',
                is_completed: isNowCompleted
            });
        }

        res.status(200).json({
            success: true,
            message: 'Todo updated successfully',
            data: todo
        });
    } catch (error) {
        logger.error({
            message: 'Error updating todo',
            requestId: req.requestId,
            userId: req.user?.userId,
            action_type: 'todo_update_error',
            error: {
                message: error.message,
                type: error.name,
                stack: error.stack
            }
        });
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Delete a todo
 */
const deleteTodo = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;

        const todo = await Todo.findOneAndDelete({ _id: id, userId });

        if (!todo) {
            logger.warn({
                message: `Delete failed: Todo not found with id: ${id}`,
                requestId: req.requestId,
                todoId: id,
                userId,
                action_type: 'todo_delete_failed'
            });
            return res.status(404).json({
                success: false,
                message: `Todo not found with id: ${id}`
            });
        }

        logger.info({
            message: 'Todo deleted successfully',
            requestId: req.requestId,
            todoId: id,
            userId,
            action_type: 'todo_deleted',
            todo_title: todo.title
        });

        res.status(200).json({
            success: true,
            message: 'Todo deleted successfully',
            data: todo
        });
    } catch (error) {
        logger.error({
            message: 'Error deleting todo',
            requestId: req.requestId,
            userId: req.user?.userId,
            action_type: 'todo_delete_error',
            error: {
                message: error.message,
                type: error.name,
                stack: error.stack
            }
        });
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo
};

