"use client"

import React from "react"

import { useState, useRef } from "react"
import { Settings, X, FileText, ImageIcon, Table, Move } from "lucide-react"
import { useCanvas } from "../context/CanvasContext"
import TextEditorWidget from "./widgets/TextEditorWidget"
import ImageDisplayWidget from "./widgets/ImageDisplayWidget"
import DataTableWidget from "./widgets/DataTableWidget"

const Widget = ({ widget, canvasId, onSelect }) => {
  const { updateWidget, deleteWidget } = useCanvas()
  const [isSelected, setIsSelected] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const widgetRef = useRef(null)

  const handleSelect = () => {
    setIsSelected(true)
    onSelect()
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm("Are you sure you want to delete this widget?")) {
      deleteWidget(canvasId, widget.id)
    }
  }

  
  const handleMouseDown = (e) => {
    if (e.target.closest(".widget-content") || e.target.closest(".widget-controls")) {
      return 
    }

    setIsDragging(true)
    setDragStart({
      x: e.clientX - widget.position.x,
      y: e.clientY - widget.position.y,
    })
    e.preventDefault()
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = Math.max(0, e.clientX - dragStart.x)
      const newY = Math.max(0, e.clientY - dragStart.y)

      updateWidget(canvasId, widget.id, {
        position: { x: newX, y: newY },
      })
    }

    if (isResizing) {
      const newWidth = Math.max(200, resizeStart.width + (e.clientX - resizeStart.x))
      const newHeight = Math.max(150, resizeStart.height + (e.clientY - resizeStart.y))

      updateWidget(canvasId, widget.id, {
        size: { width: newWidth, height: newHeight },
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

 
  const handleResizeMouseDown = (e) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: widget.size.width,
      height: widget.size.height,
    })
  }

  
  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, isResizing, dragStart, resizeStart])

  const getWidgetIcon = () => {
    switch (widget.type) {
      case "text-editor":
        return <FileText size={14} />
      case "image-display":
        return <ImageIcon size={14} />
      case "data-table":
        return <Table size={14} />
      default:
        return <Settings size={14} />
    }
  }

  const renderWidgetContent = () => {
    try {
      switch (widget.type) {
        case "text-editor":
          return <TextEditorWidget widget={widget} canvasId={canvasId} />
        case "image-display":
          return <ImageDisplayWidget widget={widget} canvasId={canvasId} />
        case "data-table":
          return <DataTableWidget widget={widget} canvasId={canvasId} />
        default:
          return <div className="flex items-center justify-center h-full text-gray-500">Unknown widget type</div>
      }
    } catch (error) {
      console.error("Error rendering widget content:", error)
      return <div className="flex items-center justify-center h-full text-red-500">Error loading widget</div>
    }
  }

  return (
    <div
      ref={widgetRef}
      className={`absolute bg-white rounded-lg shadow-lg border-2 transition-all ${
        isSelected ? "border-blue-500 shadow-xl" : "border-gray-200 hover:border-gray-300"
      } ${isDragging ? "cursor-grabbing z-50" : ""} ${isResizing ? "cursor-se-resize" : ""}`}
      style={{
        left: widget.position.x,
        top: widget.position.y,
        width: widget.size.width,
        height: widget.size.height,
        userSelect: isDragging || isResizing ? "none" : "auto",
      }}
      onClick={handleSelect}
      onMouseDown={handleMouseDown}
    >
     
      <div
        className={`flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        <div className="flex items-center space-x-2">
          <div className="text-gray-600">{getWidgetIcon()}</div>
          <h3 className="text-sm font-medium text-gray-900 truncate">{widget.config.title}</h3>
          <Move size={12} className="text-gray-400" />
        </div>

        <div className="widget-controls flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
            title="Settings"
          >
            <Settings size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
            title="Delete widget"
          >
            <X size={14} />
          </button>
        </div>
      </div>

     
      <div className="widget-content p-3 overflow-hidden" style={{ height: "calc(100% - 60px)" }}>
        {renderWidgetContent()}
      </div>

     
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gray-300 opacity-50 hover:opacity-75 transition-opacity"
        onMouseDown={handleResizeMouseDown}
        title="Resize widget"
      >
        <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-600"></div>
      </div>
    </div>
  )
}

export default Widget



