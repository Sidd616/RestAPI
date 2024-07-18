const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

let todos = [];
let nextId = 1;

const DATA_FILE = 'todos.json';

// Load todos from file
const loadTodos = () => {
    if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        todos = JSON.parse(data);
        nextId = todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
    }
};

// Save todos to file
const saveTodos = () => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2), 'utf8');
};

// Load existing todos from file at startup
loadTodos();

// Retrieve all todo items
app.get('/todos', (req, res) => {
    res.status(200).json(todos);
});

// Retrieve a specific todo item by ID
app.get('/todos/:id', (req, res) => {
    const todo = todos.find(todo => todo.id === parseInt(req.params.id, 10));
    if (todo) {
        res.status(200).json(todo);
    } else {
        res.status(404).send('Todo not found');
    }
});

// Create a new todo item
app.post('/todos', (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).send('Title and description are required');
    }
    const newTodo = {
        id: nextId++,
        title,
        description
    };
    todos.push(newTodo);
    saveTodos();
    res.status(201).json({ id: newTodo.id });
});

// Update an existing todo item by ID
app.put('/todos/:id', (req, res) => {
    const { title, description } = req.body;
    const todo = todos.find(todo => todo.id === parseInt(req.params.id, 10));
    if (todo) {
        if (title) todo.title = title;
        if (description) todo.description = description;
        saveTodos();
        res.status(200).send('Todo updated');
    } else {
        res.status(404).send('Todo not found');
    }
});

// Delete a todo item by ID
app.delete('/todos/:id', (req, res) => {
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(req.params.id, 10));
    if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
        saveTodos();
        res.status(200).send('Todo deleted');
    } else {
        res.status(404).send('Todo not found');
    }
});

// Handle undefined routes
app.use((req, res) => {
    res.status(404).send('Route not found');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
