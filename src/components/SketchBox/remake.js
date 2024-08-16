import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

const FabricCanvas = ({ setDataUrl, dataUrl }) => {
    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    var deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23333333;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

    var icon = document.createElement('img');
    icon.src = deleteIcon;

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const dragData = e.dataTransfer.getData('application/json');
        console.log("Drag Data:", dragData); // 检查拖拽数据
        const { type, url } = JSON.parse(dragData);
        console.log("Type:", type, "URL:", url); // 检查类型和 URL



        if (type === 'library') {
            fabric.Image.fromURL(
                url,
                (img) => {
                    img.set({
                        selectable: true,
                        scalable: true,
                        hasControls: true,
                    });
                    img.scale(0.25);
                    img.setCoords();


                    fabricCanvasRef.current.add(img);
                    saveCanvasState();
                },
                { crossOrigin: 'anonymous' }
            );
        }
    };


    const saveCanvasState = () => {
        const data = JSON.stringify(fabricCanvasRef.current.toDatalessJSON());
        sessionStorage.setItem('canvasState', data);
    };

    const loadCanvasState = () => {
        const data = sessionStorage.getItem('canvasState');
        if (data) {
            fabricCanvasRef.current.loadFromJSON(data, () => {


            });
        }
    };

    useEffect(() => {
        if (!fabricCanvasRef.current) {
            fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
                width: window.innerHeight * 0.6,
                height: window.innerHeight * 0.6,
                selection: true,
                preserveObjectStacking: true,
                interactive: true,
            });


            fabric.Object.prototype.controls.deleteControl = new fabric.Control({
                x: 0.5,
                y: -0.5,
                offsetY: 2,
                cursorStyle: 'pointer',
                mouseUpHandler: deleteObject,
                render: renderIcon,
                cornerSize: 24
            });
            fabric.Object.prototype.borderColor = '#F00264';
            fabric.Object.prototype.cornerStrokeColor = "#F00264";


            fabricCanvasRef.current.requestRenderAll();

            loadCanvasState();
        }
    }, []);

    function deleteObject(eventData, transform) {
        const target = transform.target;
        const canvas = target.canvas;
        canvas.remove(target);
        canvas.requestRenderAll();
    }

    function renderIcon(ctx, left, top, styleOverride, fabricObject) {
        const size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(icon, -size / 2, -size / 2, size, size);
        ctx.restore();
    }

    useEffect(() => {
        const saveCanvasToDataUrl = () => {
            if (fabricCanvasRef.current) {
                const dataURL = fabricCanvasRef.current.toDataURL({
                    format: 'png',
                    multiplier: 1,
                    quality: 1,
                });
                setDataUrl(dataURL);
            }
        };

        const canvasStateChangeListener = () => {
            saveCanvasToDataUrl();
            saveCanvasState();
        };

        const objectModifiedListener = (event) => {
            canvasStateChangeListener(); // Update canvas state on object modification
        };

        if (fabricCanvasRef.current) {
            fabricCanvasRef.current.on('object:added', canvasStateChangeListener);
            fabricCanvasRef.current.on('object:removed', canvasStateChangeListener);
            fabricCanvasRef.current.on('object:modified', objectModifiedListener); // Listen for object modification
        }

        return () => {
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.off('object:added', canvasStateChangeListener);
                fabricCanvasRef.current.off('object:removed', canvasStateChangeListener);
                fabricCanvasRef.current.off('object:modified', objectModifiedListener); // Remove event listener
            }
        };
    }, [setDataUrl]);




    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{ border: '3px dashed black', maxWidth: '60vh', maxHeight: '60vh', position: 'relative', backgroundColor: 'white' }}
        >
            <canvas
                ref={canvasRef}
                width={512}
                height={512}
                style={{ width: '100%', height: '100%' }}
            ></canvas>
        </div>
    );
};

export default FabricCanvas;
