const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Настройка CORS для разрешения запросов с http://localhost:3000
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(bodyParser.json());

let tasks = [];

// CRUD операции
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const { title, description, dueDate } = req.body;
    if (!title || !description) {
        return res.status(400).send('Title and description are required');
    }
    const newTask = { id: uuidv4(), title, description, dueDate, completed: false };
    tasks.push(newTask);
    io.emit('taskAdded', newTask);
    res.json(newTask);
});

app.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        Object.assign(task, req.body);
        io.emit('taskUpdated', task);
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    tasks = tasks.filter(t => t.id !== taskId);
    io.emit('taskDeleted', taskId);
    res.sendStatus(204);
});

app.post('/tasks/:id/complete', (req, res) => {
    const taskId = req.params.id;
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = true;
        task.completedDate = new Date();
        io.emit('taskUpdated', task);
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

// WebSocket
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User  disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
