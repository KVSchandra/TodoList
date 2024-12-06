const API_URL = 'http://localhost:3000/tasks'; // Backend API URL

// Function to fetch and display tasks
async function loadTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const taskElement = document.createElement('li');
        taskElement.id = `task-${task.id}`;

        const taskTitle = document.createElement('span');
        taskTitle.textContent = task.title;
        if (task.completed) taskTitle.classList.add('completed');
        
        const completeButton = document.createElement('button');
        completeButton.textContent = task.completed ? 'Undo' : 'Complete';
        completeButton.onclick = () => toggleTaskCompletion(task.id, task.completed);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');
        deleteButton.onclick = () => deleteTask(task.id);

        taskElement.append(taskTitle, completeButton, deleteButton);
        taskList.appendChild(taskElement);
    });
}

// Function to add a task
async function addTask() {
    const input = document.getElementById('task-input');
    const title = input.value;

    if (title) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
        });
        const newTask = await response.json();
        loadTasks();
        input.value = ''; // Clear input field
    }
}

// Function to toggle task completion
async function toggleTaskCompletion(taskId, completed) {
    await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
    });
    loadTasks();
}

// Function to delete a task
async function deleteTask(taskId) {
    await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
    });
    loadTasks();
}

// Load tasks when the page loads
window.onload = loadTasks;
