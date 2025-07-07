"use client"

import { useState } from "react"
import { Plus, Trash2, Edit3, FileText, ImageIcon, Table } from "lucide-react"
import { useCanvas } from "../context/CanvasContext"

const Sidebar = () => {
  const {
    canvases,
    activeCanvasId,
    setActiveCanvasId,
    createCanvas,
    deleteCanvas,
    renameCanvas,
    addWidget,
  } = useCanvas()

  const [editingCanvas, setEditingCanvas] = useState(null)
  const [newCanvasName, setNewCanvasName] = useState("")

  const handleCreateCanvas = () => {
    const name = prompt("Enter canvas name:")?.trim()
    if (name) {
      createCanvas(name)
    } else {
      alert("Canvas name cannot be empty.")
    }
  }

  const handleRenameCanvas = (canvas) => {
    setEditingCanvas(canvas.id)
    setNewCanvasName(canvas.name)
  }

  const handleRenameSubmit = (canvasId) => {
    if (newCanvasName.trim()) {
      renameCanvas(canvasId, newCanvasName.trim())
    }
    setEditingCanvas(null)
    setNewCanvasName("")
  }

  const handleDeleteCanvas = (canvasId) => {
    if (window.confirm("Are you sure you want to delete this canvas?")) {
      deleteCanvas(canvasId)
    }
  }

  const handleAddWidget = (widgetType) => {
    if (activeCanvasId) {
      addWidget(activeCanvasId, widgetType)
    }
  }

  const widgetTypes = [
    { type: "text-editor", icon: FileText, label: "Text Editor", color: "text-blue-600" },
    { type: "image-display", icon: ImageIcon, label: "Image Display", color: "text-green-600" },
    { type: "data-table", icon: Table, label: "Data Table", color: "text-purple-600" },
  ]

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Canvas Studio</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your canvases and widgets</p>
      </div>

      
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Canvases</h2>
          <button
            onClick={handleCreateCanvas}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            title="Create new canvas"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-1 max-h-48 overflow-y-auto">
          {canvases.map((canvas) => (
            <div
              key={canvas.id}
              className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                activeCanvasId === canvas.id
                  ? "bg-blue-50 border border-blue-200"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setActiveCanvasId(canvas.id)}
            >
              <div className="flex-1 min-w-0">
                {editingCanvas === canvas.id ? (
                  <input
                    type="text"
                    value={newCanvasName}
                    onChange={(e) => setNewCanvasName(e.target.value)}
                    onBlur={() => handleRenameSubmit(canvas.id)}
                    onKeyPress={(e) => e.key === "Enter" && handleRenameSubmit(canvas.id)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                ) : (
                  <div>
                    <p
                      className={`text-sm font-medium truncate ${
                        activeCanvasId === canvas.id
                          ? "text-blue-700"
                          : "text-gray-900"
                      }`}
                    >
                      {canvas.name}
                    </p>
                    <p className="text-xs text-gray-500">{canvas.widgets.length} widgets</p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRenameCanvas(canvas)
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  title="Rename canvas"
                >
                  <Edit3 size={12} />
                </button>
                {canvases.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteCanvas(canvas.id)
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                    title="Delete canvas"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className="flex-1 p-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Widget Library</h2>

        <div className="space-y-2">
          {widgetTypes.map(({ type, icon: Icon, label, color }) => (
            <button
              key={type}
              onClick={() => handleAddWidget(type)}
              disabled={!activeCanvasId}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 border-dashed transition-all ${
                activeCanvasId
                  ? "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  : "border-gray-100 opacity-50 cursor-not-allowed"
              }`}
            >
              <Icon size={20} className={color} />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">
                  {type === "text-editor" && "Rich text editing"}
                  {type === "image-display" && "Display and manage images"}
                  {type === "data-table" && "Organize data in tables"}
                </p>
              </div>
            </button>
          ))}
        </div>

        {!activeCanvasId && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-700">Select a canvas to add widgets</p>
          </div>
        )}
      </div>

     
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Next99 Canvas Studio</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
