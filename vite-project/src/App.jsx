"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import Sidebar from "./components/Sidebar"
import Canvas from "./components/Canvas"
import WidgetSettings from "./components/WidgetSettings"
import { CanvasProvider } from "./context/CanvasContext"
import "./App.css"

function App() {
  const [canvases, setCanvases] = useState([])
  const [activeCanvasId, setActiveCanvasId] = useState(null)
  const [selectedWidget, setSelectedWidget] = useState(null)
  const [showSettings, setShowSettings] = useState(false)

  // Initialize with a default canvas
  useEffect(() => {
    const defaultCanvas = {
      id: uuidv4(),
      name: "Main Canvas",
      widgets: [],
      createdAt: new Date().toISOString(),
    }
    setCanvases([defaultCanvas])
    setActiveCanvasId(defaultCanvas.id)
  }, [])

  const createCanvas = (name = "New Canvas") => {
    const newCanvas = {
      id: uuidv4(),
      name,
      widgets: [],
      createdAt: new Date().toISOString(),
    }
    setCanvases((prev) => [...prev, newCanvas])
    setActiveCanvasId(newCanvas.id)
  }

  const deleteCanvas = (canvasId) => {
    if (canvases.length <= 1) return // Don't delete the last canvas

    setCanvases((prev) => prev.filter((canvas) => canvas.id !== canvasId))

    if (activeCanvasId === canvasId) {
      const remainingCanvases = canvases.filter((canvas) => canvas.id !== canvasId)
      setActiveCanvasId(remainingCanvases[0]?.id || null)
    }
  }

  const renameCanvas = (canvasId, newName) => {
    setCanvases((prev) => prev.map((canvas) => (canvas.id === canvasId ? { ...canvas, name: newName } : canvas)))
  }

  const addWidget = (canvasId, widgetType) => {
    const newWidget = {
      id: uuidv4(),
      type: widgetType,
      position: { x: 50, y: 50 },
      size: { width: 300, height: 200 },
      config: getDefaultConfig(widgetType),
      createdAt: new Date().toISOString(),
    }

    setCanvases((prev) =>
      prev.map((canvas) => (canvas.id === canvasId ? { ...canvas, widgets: [...canvas.widgets, newWidget] } : canvas)),
    )
  }

  const updateWidget = (canvasId, widgetId, updates) => {
    setCanvases((prev) =>
      prev.map((canvas) =>
        canvas.id === canvasId
          ? {
              ...canvas,
              widgets: canvas.widgets.map((widget) => (widget.id === widgetId ? { ...widget, ...updates } : widget)),
            }
          : canvas,
      ),
    )
  }

  const deleteWidget = (canvasId, widgetId) => {
    setCanvases((prev) =>
      prev.map((canvas) =>
        canvas.id === canvasId
          ? {
              ...canvas,
              widgets: canvas.widgets.filter((widget) => widget.id !== widgetId),
            }
          : canvas,
      ),
    )

    if (selectedWidget?.id === widgetId) {
      setSelectedWidget(null)
      setShowSettings(false)
    }
  }

  const getDefaultConfig = (widgetType) => {
    switch (widgetType) {
      case "text-editor":
        return {
          title: "Text Editor",
          content: "Start typing here...",
          fontSize: 14,
          fontFamily: "Inter",
        }
      case "image-display":
        return {
          title: "Image Display",
          imageUrl: "",
          alt: "Image",
          fit: "contain",
          showControls: true,
        }
      case "data-table":
        return {
          title: "Data Table",
          columns: ["Column 1", "Column 2", "Column 3"],
          rows: [
            ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
            ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"],
          ],
          showHeaders: true,
          striped: true,
        }
      default:
        return {}
    }
  }

  const activeCanvas = canvases.find((canvas) => canvas.id === activeCanvasId)

  const handleWidgetSelect = (widget) => {
    setSelectedWidget(widget)
    setShowSettings(true)
  }

  const handleSettingsClose = () => {
    setShowSettings(false)
    setSelectedWidget(null)
  }

  const contextValue = {
    canvases,
    activeCanvasId,
    activeCanvas,
    selectedWidget,
    createCanvas,
    deleteCanvas,
    renameCanvas,
    setActiveCanvasId,
    addWidget,
    updateWidget,
    deleteWidget,
    handleWidgetSelect,
  }

  return (
    <CanvasProvider value={contextValue}>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          {activeCanvas ? (
            <Canvas canvas={activeCanvas} onWidgetSelect={handleWidgetSelect} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-600 mb-4">No Canvas Selected</h2>
                <p className="text-gray-500">Create a new canvas to get started</p>
              </div>
            </div>
          )}
        </div>

        {showSettings && selectedWidget && (
          <WidgetSettings
            widget={selectedWidget}
            onClose={handleSettingsClose}
            onUpdate={(updates) => updateWidget(activeCanvasId, selectedWidget.id, updates)}
          />
        )}
      </div>
    </CanvasProvider>
  )
}

export default App
