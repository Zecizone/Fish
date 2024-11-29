import React from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Typography } from "@mui/material";
import TaskItem from "../TaskItem/TaskItem";

const TaskList = ({ tasks, handleCompleteTask, handleDeleteTask, filter, handleDragEnd }) => {
    
    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
    });

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        <Typography variant="h6">Все задачи</Typography>
                        {filteredTasks.map((task, index) => (
                            <Draggable key={`${task.id}-${index}`} draggableId={task.id.toString()} index={index}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        <TaskItem
                                            task={task}
                                            handleCompleteTask={handleCompleteTask}
                                            handleDeleteTask={handleDeleteTask}
                                            provided={provided}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default TaskList;