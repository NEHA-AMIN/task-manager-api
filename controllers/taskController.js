const pool = require('../db/db');

// Get all tasks
const getAllTasks = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks ORDER BY id');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get task by ID
const getTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new task
const createTask = async (req, res) => {
    const { title, description, status, priority, due_date } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tasks (title, description, status, priority, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, status, priority, due_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a task
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority, due_date } = req.body;
    try {
        const result = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, due_date = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
            [title, description, status, priority, due_date, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
};