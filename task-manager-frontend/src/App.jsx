import React, { useEffect, useState, useRef } from 'react';
import TaskForm from './components/TaskForm/TaskForm';
import TaskList from './components/TaskList/TaskList';
import TaskCanvas from './components/TaskCanvas/TaskCanvas';
import { Box } from '@mui/material';
import { loadTasks, createTask, completeTask, deleteTask, setupSocketListeners, handleDragEnd } from './services/taskService';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
    const [filter, setFilter] = useState('all');
    const canvasRef = useRef(null);

    useEffect(() => {
        loadTasks(setTasks);
        const cleanupSocketListeners = setupSocketListeners(setTasks);
        return cleanupSocketListeners;
    }, []);

    const handleCreateTask = () => {
        if (newTask.title && newTask.description && newTask.dueDate) {
            const taskWithId = { ...newTask, id: uuidv4() };
            createTask(taskWithId, setTasks, setNewTask);
            setNewTask({ title: '', description: '', dueDate: '' });
        } else {
            console.log('Пожалуйста, заполните все поля задачи.');
        }
    };

    const handleCompleteTask = (taskId) => {
        const completedDate = new Date();
        setTasks(prevTasks => 
            prevTasks.map(task => 
                task.id === taskId 
                    ? { ...task, completed: true, completedDate }
                    : task
            )
        );
        completeTask(taskId, completedDate);
    };

    const handleDeleteTask = (taskId) => {
        deleteTask(taskId);
    };

    const onDragEnd = (result) => {
        handleDragEnd(result, tasks, setTasks);
    };

    return (
        <Box display="flex" flexDirection="column" p={2}>
            <TaskForm newTask={newTask} setNewTask={setNewTask} handleCreateTask={handleCreateTask} filter={filter} setFilter={setFilter} />
            <TaskList tasks={tasks} handleCompleteTask={handleCompleteTask} handleDeleteTask={handleDeleteTask} filter={filter} handleDragEnd={onDragEnd} />
            <TaskCanvas tasks={tasks} />
        </Box>
    );
};

export default App;
