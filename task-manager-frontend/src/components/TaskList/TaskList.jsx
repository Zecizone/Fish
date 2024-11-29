import React from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Typography, Box } from "@mui/material";
import TaskItem from "../TaskItem/TaskItem";

const TaskList = ({ tasks, handleCompleteTask, handleDeleteTask, handleEditTask, filter, handleDragEnd }) => {
    
    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
    });

    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('.');
        return new Date(`${year}-${month}-${day}`);
    };

    const sortedTasks = filteredTasks.sort((a, b) => parseDate(a.dueDate) - parseDate(b.dueDate));

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks">
                {(provided) => (
                    <Box 
                        ref={provided.innerRef} 
                        {...provided.droppableProps} 
                        sx={{ 
                            width: '100%',
                            maxWidth: '800px',
                            margin: '0 auto',
                            padding: '16px', 
                            borderRadius: '8px', 
                            boxShadow: 2 
                        }}
                    >
                        <Typography variant="h6" sx={{ marginBottom: '16px' }}>Список задач</Typography>
                        {sortedTasks.map((task, index) => (
                            <Draggable key={`${task.id}-${index}`} draggableId={task.id.toString()} index={index}>
                                {(provided) => (
                                    <div 
                                        ref={provided.innerRef} 
                                        {...provided.draggableProps} 
                                        {...provided.dragHandleProps}
                                        style={{ 
                                            minWidth: '200px', 
                                            width: '100%', 
                                            marginBottom: '8px' 
                                        }}
                                    >
                                        <TaskItem
                                            task={task}
                                            handleCompleteTask={handleCompleteTask}
                                            handleDeleteTask={handleDeleteTask}
                                            handleEditTask={handleEditTask}
                                            provided={provided}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Box>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default TaskList;
