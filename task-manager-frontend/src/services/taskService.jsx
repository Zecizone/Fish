import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export const loadTasks = async (setTasks) => {
    try {
        const response = await axios.get('http://localhost:5000/tasks');
        setTasks(response.data);
    } catch (error) {
        console.error("Ошибка при загрузке задач:", error);
    }
};

export const createTask = async (newTask, setTasks, setNewTask) => {
    try {
        const response = await axios.post('http://localhost:5000/tasks', newTask);
        setTasks((prev) => {
            const existingTask = prev.find(task => task.id === response.data.id);
            if (!existingTask) {
                return [...prev, response.data];
            }
            return prev;
        });
        setNewTask({ title: '', description: '', dueDate: '' });
    } catch (error) {
        console.error("Ошибка при создании задачи:", error);
    }
};

export const completeTask = async (taskId) => {
    const completedDate = new Date();
    try {
        await axios.post(`http://localhost:5000/tasks/${taskId}/complete`, { completedDate });
    } catch (error) {
        console.error("Ошибка при завершении задачи:", error);
    }
};

export const deleteTask = async (taskId) => {
    try {
        await axios.delete(`http://localhost:5000/tasks/${taskId}`);
    } catch (error) {
        console.error("Ошибка при удалении задачи:", error);
    }
};

export const editTask = async (taskId, updatedTask, setTasks) => {
    try {
        const response = await axios.put(`http://localhost:5000/tasks/${taskId}`, updatedTask);
        setTasks((prev) => prev.map(task => (task.id === response.data.id ? response.data : task)));
    } catch (error) {
        console.error("Ошибка при редактировании задачи:", error);
    }
};

export const setupSocketListeners = (setTasks) => {
    socket.on('taskAdded', (task) => {
        setTasks((prev) => [...prev, task]);
    });

    socket.on('taskUpdated', (updatedTask) => {
        setTasks((prev) => prev.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    });

    socket.on('taskDeleted', (taskId) => {
        setTasks((prev) => prev.filter(task => task.id !== taskId));
    });

    return () => {
        socket.off('taskAdded');
        socket.off('taskUpdated');
        socket.off('taskDeleted');
    };
};

export const handleDragEnd = (result, tasks, setTasks) => {
    if (!result.destination) return;

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(updatedTasks);
};
