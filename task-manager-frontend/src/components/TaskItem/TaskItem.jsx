import React from 'react';
import { Paper, Typography, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';

const TaskItem = ({ task, handleCompleteTask, handleDeleteTask, provided }) => {
    return (
        <Paper 
            ref={provided.innerRef}
            {...provided.draggableProps} 
            {...provided.dragHandleProps} 
            style={{ margin: '8px 0', padding: '16px' }}
        >
            <Typography variant="body1">{task.title}</Typography>
            <Typography variant="body2">{task.description}</Typography>
            <Typography variant="body2" color="textSecondary">
                Срок выполнения: {new Date(task.dueDate).toLocaleDateString()}
            </Typography>
            
            {task.completed ? (
                <Typography variant="body2" color="textSecondary">
                    Дата завершения: {new Date(task.completedDate).toLocaleDateString()}
                </Typography>
            ) : (
                <IconButton onClick={() => handleCompleteTask(task.id)}>
                    <CheckIcon />
                </IconButton>
            )}
            
            <IconButton onClick={() => handleDeleteTask(task.id)}>
                <DeleteIcon />
            </IconButton>
        </Paper>
    );
};

export default TaskItem;
