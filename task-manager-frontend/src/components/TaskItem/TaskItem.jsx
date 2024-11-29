import React, { useState } from 'react';
import { Paper, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Box } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const TaskItem = ({ task, handleCompleteTask, handleDeleteTask, handleEditTask, provided }) => {
    const [open, setOpen] = useState(false);
    const [editedTask, setEditedTask] = useState({ title: task.title, description: task.description });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        handleEditTask(task.id, editedTask);
        handleClose();
    };

    return (
        <Paper 
            ref={provided.innerRef}
            {...provided.draggableProps} 
            {...provided.dragHandleProps} 
            sx={{ 
                margin: '8px 0', 
                padding: '16px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-start', 
                width: '100%',
                maxWidth: '500px',
                marginLeft: 'auto', 
                marginRight: 'auto',
            }}
        >
            <Typography variant="body1">{task.title}</Typography>
            <Typography variant="body2">{task.description}</Typography>
            <Typography variant="body2" color="textSecondary">
                Срок выполнения: {new Date(task.dueDate).toLocaleDateString()}
            </Typography>
            
            {task.completed && (
                <Typography variant="body2" color="textSecondary">
                    Дата завершения: {new Date(task.completedDate).toLocaleDateString()}
                </Typography>
            )}
            
            <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
                {!task.completed && (
                    <IconButton onClick={() => handleCompleteTask(task.id)} aria-label="выполнить">
                        <CheckIcon />
                    </IconButton>
                )}
                <IconButton onClick={() => handleDeleteTask(task.id)} aria-label="удалить">
                    <DeleteIcon />
                </IconButton>
                <IconButton onClick={handleClickOpen} aria-label="редактировать">
                    <EditIcon />
                </IconButton>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Редактировать задачу</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Название"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editedTask.title}
                        onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Описание"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editedTask.description}
                        onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default TaskItem;
