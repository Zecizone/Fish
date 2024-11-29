import React, { useEffect, useRef, useState } from 'react';
import TaskForm from './components/TaskForm/TaskForm';
import TaskList from './components/TaskList/TaskList';
import TaskCanvas from './components/TaskCanvas/TaskCanvas';
import { Box } from '@mui/material';
import { loadTasks, setupSocketListeners, handleDragEnd, createTask, completeTask, deleteTask, editTask } from './services/taskService';
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
        } else {
            console.log('Пожалуйста, заполните все поля задачи.');
        }
    };

    const onDragEnd = (result) => {
        handleDragEnd(result, tasks, setTasks);
    };

    return (
        <Box 
            display="flex" 
            p={2} 
            sx={{ 
                flexDirection: { xs: 'column', sm: 'row' },
            }}
        >
            <Box 
                display="flex" 
                flexDirection="column" 
                p={2}
                sx={{ 
                    width: { xs: '100%', sm: 'auto' },
                }}
            >
                <TaskForm 
                    newTask={newTask} 
                    setNewTask={setNewTask} 
                    handleCreateTask={handleCreateTask} 
                    filter={filter} 
                    setFilter={setFilter} 
                />
                <TaskList 
                    tasks={tasks} 
                    handleCompleteTask={completeTask}
                    handleDeleteTask={deleteTask}
                    handleEditTask={editTask}
                    filter={filter} 
                    handleDragEnd={onDragEnd} 
                />
            </Box>
            <TaskCanvas tasks={tasks} />
        </Box>
    );
};

export default App;
