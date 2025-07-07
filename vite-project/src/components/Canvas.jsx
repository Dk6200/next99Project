"use client"

import { useState, useRef } from "react"
import { Maximize2, Minimize2, Grid, ZoomIn, ZoomOut } from "lucide-react"
import Widget from "./Widget"

const Canvas = ({ canvas, onWidgetSelect }) => {
  const [zoom, setZoom] = useState(1)
  const [showGrid, setShowGrid] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const canvasRef =  useRef(null)

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const toggleGrid = () => {
    setShowGrid(!showGrid)
  }

  return (
    <div className={`flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-white" : "flex-1"}`}>
     
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{canvas.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {canvas.widgets.length} widgets • Created {new Date(canvas.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={handleZoomOut}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded transition-colors"
                title="Zoom out"
              >
                <ZoomOut size={16} />
              </button>
              <span className="px-2 py-1 text-sm font-medium text-gray-700 min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded transition-colors"
                title="Zoom in"
              >
                <ZoomIn size={16} />
              </button>
            </div>

            <button
              onClick={toggleGrid}
              className={`p-2 rounded-lg transition-colors ${
                showGrid ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              title="Toggle grid"
            >
              <Grid size={16} />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
      </div>

      
      <div className="flex-1 overflow-hidden bg-gray-50">
        <div
          ref={canvasRef}
          className="w-full h-full overflow-auto"
          style={{
            backgroundImage: showGrid ? `radial-gradient(circle, #e5e7eb 1px, transparent 1px)` : "none",
            backgroundSize: showGrid ? `${20 * zoom}px ${20 * zoom}px` : "auto",
            backgroundPosition: "0 0",
          }}
        >
          <div
            className="relative min-w-full min-h-full"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              width: `${100 / zoom}%`,
              height: `${100 / zoom}%`,
            }}
          >
            {canvas.widgets.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Grid size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Empty Canvas</h3>
                  <p className="text-gray-500 max-w-sm">Add widgets from the sidebar to start building your canvas</p>
                </div>
              </div>
            ) : (
              canvas.widgets.map((widget) => (
                <Widget key={widget.id} widget={widget} canvasId={canvas.id} onSelect={() => onWidgetSelect(widget)} />
              ))
            )}
          </div>
        </div>
      </div>

    
      <div className="bg-white border-t border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Canvas: {canvas.name}</span>
            <span>•</span>
            <span>Widgets: {canvas.widgets.length}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Zoom: {Math.round(zoom * 100)}%</span>
            <span>•</span>
            <span>Grid: {showGrid ? "On" : "Off"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Canvas
