import React from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, Box } from '@mui/material';

const TaskForm = ({ newTask, setNewTask, handleCreateTask, filter, setFilter }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        handleCreateTask();
    };

    return (
        <Box 
            mb={2} 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                padding: { xs: 2, sm: 3 },
                maxWidth: '600px',
                margin: '0 auto', 
            }}
        >
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Создать новую задачу
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <TextField
                    label="Название"
                    variant="outlined"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Описание"
                    variant="outlined"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Срок выполнения"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
                    Добавить задачу
                </Button>
            </form>
            <FormControl fullWidth margin="normal">
                <InputLabel>Фильтр</InputLabel>
                <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <MenuItem value="all">Все</MenuItem>
                    <MenuItem value="completed">Выполненные</MenuItem>
                    <MenuItem value="incomplete">Невыполненные</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default TaskForm;
