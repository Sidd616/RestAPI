const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

let todos = [];
let nextId = 1;


app.get('/todos', (req, res) => {
    res.status(200).json(todos);
});

app.get('/todos/:id', (req, res) => {
    const todo = todos.find(todo => todo.id === parseInt(req.params.id, 10));
    if (todo) {
        res.status(200).json(todo);
    } else {
        res.status(404).send('Todo not found');
    }
});


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
    res.status(201).json({ id: newTodo.id });
});

app.put('/todos/:id', (req, res) => {
    const { title, description } = req.body;
    const todo = todos.find(todo => todo.id === parseInt(req.params.id, 10));
    if (todo) {
        if (title) todo.title = title;
        if (description) todo.description = description;
        res.status(200).send('Todo updated');
    } else {
        res.status(404).send('Todo not found');
    }
});


app.delete('/todos/:id', (req, res) => {
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(req.params.id, 10));
    if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
        res.status(200).send('Todo deleted');
    } else {
        res.status(404).send('Todo not found');
    }
});

app.use((req, res) => {
    res.status(404).send('Route not found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
