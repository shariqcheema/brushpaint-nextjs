import React from 'react';

function ToolBar({
  activeTool,
  brushColor,
  brushSize,
  bucketColor,
  setBrushColor,
  setBrushSize,
  setBucketColor,
  setIsEraser,
  clearCanvas,
  saveCanvasToLocalStorage,
  loadCanvasFromLocalStorage,
  clearLocalStorage,
  downloadCanvasAsImage
}) {
  return (
    <div className="top-bar">
      <div className="active-tool">
        Active Tool: <span>{activeTool}</span>
      </div>
      <div className="brush tool">
        <button onClick={() => setIsEraser(false)} title="Brush">
          🖌 Brush
        </button>
        <input
          type="color"
          value={brushColor}
          onChange={(e) => setBrushColor(e.target.value)}
          title="Brush Color"
        />
        <span title="Brush Size">Size: {brushSize}</span>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(e.target.value)}
          title="Brush Size"
        />
      </div>
      <div className="bucket tool">
        <button onClick={() => setIsEraser(false)} title="Bucket">
          🪣 Bucket
        </button>
        <input
          type="color"
          value={bucketColor} 
          onChange={(e) => setBucketColor(e.target.value)}
          title="Bucket Color"
        />
      </div>
      <div className="eraser tool">
        <button onClick={() => setIsEraser(true)} title="Eraser">
          🧽 Eraser
        </button>
      </div>
      <div className="clear tool">
        <button onClick={clearCanvas} title="Clear Canvas">
          🗑 Clear
        </button>
      </div>
      <div className="save-load-clear tool">
        <button onClick={saveCanvasToLocalStorage} title="Save Canvas">
          💾 Save
        </button>
        <button onClick={loadCanvasFromLocalStorage} title="Load Canvas">
          📂 Load
        </button>
        <button onClick={clearLocalStorage} title="Clear Saved Canvas">
          🧹 Clear Saved
        </button>
        <button onClick={downloadCanvasAsImage} title="Download Canvas">
          📥 Download
        </button>
      </div>
    </div>
  );
}

export default ToolBar;
