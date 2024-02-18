import React, { useState, useEffect, useRef } from "react";
import ToolBar from '../components/ToolBar';

export default function Home() {
  const [brushSize, setBrushSize] = useState(10);
  const [brushColor, setBrushColor] = useState("#000000");
  const [bucketColor, setBucketColor] = useState("#ffffff");
  const [isEraser, setIsEraser] = useState(false);
  const [activeTool, setActiveTool] = useState("Brush");
  const [drawnArray, setDrawnArray] = useState([]);

  const [isDrawing, setIsDrawing] = useState(false);
  const contextRef = useRef(null);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50;
    const context = canvas.getContext("2d");
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    context.lineCap = "round";
    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50;

    const restoreCanvas = () => {
      drawnArray.forEach((line, i) => {
        if (line !== undefined) {
          context.beginPath();
          context.moveTo(
            drawnArray[Math.max(i - 1, 0)].x,
            drawnArray[Math.max(i - 1, 0)].y
          );
          context.lineTo(line.x, line.y);
          context.strokeStyle = line.erase ? bucketColor : line.color;
          context.lineWidth = line.size;
          context.lineCap = "round";
          context.stroke();
        }
      });
    };

    const createCanvas = () => {
      context.fillStyle = bucketColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
      restoreCanvas();
    };

    createCanvas();

    const handleDrawing = (event) => {
      if (!isEraser && event.buttons > 0 && event?.nativeEvent) {
        const { offsetX, offsetY } = event.nativeEvent;
        setDrawnArray([
          ...drawnArray,
          {
            x: offsetX,
            y: offsetY,
            size: brushSize,
            color: brushColor,
            erase: isEraser,
          },
        ]);
        context.lineTo(offsetX, offsetY);
        context.strokeStyle = brushColor;
        context.lineWidth = brushSize;
        context.lineCap = "round";
        context.stroke();
        context.beginPath();
        context.moveTo(offsetX, offsetY);
      } 
    };

    // Attach event listeners
    canvas.addEventListener("mousemove", (event) => handleDrawing(event));

    return () => {
      // Cleanup event listeners
      canvas.removeEventListener("mousemove", (event) => handleDrawing(event));
    };
  }, [brushSize, brushColor, bucketColor, isEraser, drawnArray]);

  const switchToBrush = () => {
    setIsEraser(false);
    setActiveTool("Brush");
  };

  const clearCanvas = () => {
    setActiveTool("Canvas Cleared");
    setDrawnArray([]);
  };

  const saveCanvasToLocalStorage = () => {
    localStorage.setItem("savedCanvas", JSON.stringify(drawnArray));
    setActiveTool("Canvas Saved");
  };

  const loadCanvasFromLocalStorage = () => {
    const savedCanvas = localStorage.getItem("savedCanvas");
    if (savedCanvas) {
      setDrawnArray(JSON.parse(savedCanvas));
      setActiveTool("Canvas Loaded");
    } else {
      setActiveTool("No Saved Canvas Found");
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("savedCanvas");
    setActiveTool("Local Storage Cleared");
  };

  const downloadCanvasAsImage = () => {
    const canvas = canvasRef.current;
    const image = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    link.download = "my-drawing.png";
    link.href = image;
    link.click();
    setActiveTool("Image Downloaded");
  };

  return (
    <>
      <ToolBar
        activeTool={activeTool}
        brushColor={brushColor}
        brushSize={brushSize}
        setBrushColor={setBrushColor}
        setBrushSize={setBrushSize}
        setIsEraser={setIsEraser}
        setBucketColor={setBucketColor}
        clearCanvas={clearCanvas}
        saveCanvasToLocalStorage={saveCanvasToLocalStorage}
        loadCanvasFromLocalStorage={loadCanvasFromLocalStorage}
        clearLocalStorage={clearLocalStorage}
        downloadCanvasAsImage={downloadCanvasAsImage}
      />
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </>
  );
}
