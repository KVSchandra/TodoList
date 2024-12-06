// Import necessary modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Initialize the express app
const app = express();

// Set the port number
const PORT = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Enable CORS to allow frontend to access backend (if needed)
app.use(cors());

// Path to the tasks JSON file
const tasksFilePath = path.join(__dirname, 'data', 'tasks.json');

// Read tasks from the JSON file
function readTasks() {
    const rawData = fs.readFileSync(tasksFilePath); // Read the file
    return JSON.parse(rawData); // Return the parsed JSON as an array of tasks
}

// Write tasks back to the file
function writeTasks(tasks) {
    const jsonData = JSON.stringify(tasks, null, 2); // Convert tasks array back to JSON
    fs.writeFileSync(tasksFilePath, jsonData); // Write the updated tasks to the file
}

// GET route to fetch all tasks
app.get('/tasks', (req, res) => {
    const tasks = readTasks();
    res.json(tasks); // Respond with the tasks in JSON format
});

// POST route to add a new task
app.post('/tasks', (req, res) => {
    const { title } = req.body; // Extract the title from the request body
    if (!title) {
        return res.status(400).json({ error: 'Task title is required' });
    }

    const tasks = readTasks();
    const newTask = {
        id: tasks.length + 1,
        title,
        completed: false, // New tasks are not completed by default
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask); // Respond with the newly added task
});

// PUT route to update a task (mark as completed)
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const { completed } = req.body; // Get the completed status from the body

    const tasks = readTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    tasks[taskIndex].completed = completed;
    writeTasks(tasks);
    res.json(tasks[taskIndex]); // Respond with the updated task
});

// DELETE route to remove a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const tasks = readTasks();

    const updatedTasks = tasks.filter(task => task.id !== taskId);

    if (tasks.length === updatedTasks.length) {
        return res.status(404).json({ error: 'Task not found' });
    }

    writeTasks(updatedTasks);
    res.status(204).send(); // Send a 204 No Content response
});

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
