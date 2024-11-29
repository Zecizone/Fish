const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(bodyParser.json());

const tasksFilePath = path.join(__dirname, 'tasks.json');

// Функция для чтения задач из файла
const readTasksFromFile = () => {
    const data = fs.readFileSync(tasksFilePath);
    return JSON.parse(data);
};

// Функция для записи задач в файл
const writeTasksToFile = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

// CRUD операции
app.get('/tasks', (req, res) => {
    const tasks = readTasksFromFile();
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const { title, description, dueDate } = req.body;
    if (!title || !description) {
        return res.status(400).send('Title and description are required');
    }
    const newTask = { id: uuidv4(), title, description, dueDate, completed: false };
    const tasks = readTasksFromFile();
    tasks.push(newTask);
    writeTasksToFile(tasks);
    io.emit('taskAdded', newTask);
    res.json(newTask);
});

app.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const tasks = readTasksFromFile();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        Object.assign(task, req.body);
        writeTasksToFile(tasks);
        io.emit('taskUpdated', task);
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    let tasks = readTasksFromFile();
    tasks = tasks.filter(t => t.id !== taskId);
    writeTasksToFile(tasks);
    io.emit('taskDeleted', taskId);
    res.sendStatus(204);
});

app.post('/tasks/:id/complete', (req, res) => {
    const taskId = req.params.id;
    const tasks = readTasksFromFile();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = true;
        task.completedDate = new Date();
        writeTasksToFile(tasks);
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
