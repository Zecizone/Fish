import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { Typography } from '@mui/material';

const TaskCanvas = ({ tasks }) => {
    const canvasRef = useRef(null);
    const fabricCanvas = useRef(null);

    useEffect(() => {
        fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
            height: 500,
            width: 500,
            backgroundColor: '#f0f0f0',
        });

        return () => {
            fabricCanvas.current.dispose();
        };
    }, []);

    useEffect(() => {
        drawTasks(tasks);
    }, [tasks]);

    const drawTasks = (tasks) => {
        if (!fabricCanvas.current) return;
        fabricCanvas.current.clear();

        tasks.forEach(task => {
            const rect = new fabric.Rect({
                left: Math.random() * 400,
                top: Math.random() * 400,
                fill: task.completed ? 'green' : 'red',
                width: 100,
                height: 50,
                selectable: true,
                hasControls: true,
                hasBorders: true,
            });

            const text = new fabric.Text(task.title, {
                left: rect.left + 50,
                top: rect.top + 15,
                fontSize: 16,
                fill: 'white',
                originX: 'center',
                originY: 'center',
            });

            const group = new fabric.Group([rect, text], {
                left: rect.left,
                top: rect.top,
            });

            fabricCanvas.current.add(group);
        });

        fabricCanvas.current.renderAll();
    };

    return (
        <div>
            <Typography variant="h5" style={{ marginBottom: '16px', textAlign: 'center' }}>
                Интерактивный Канвас Задач
            </Typography>
            <canvas ref={canvasRef} style={{ border: '1px solid black' }} />
        </div>
    );
};

export default TaskCanvas;
