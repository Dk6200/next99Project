"use client"

import { useState } from "react"
import { useCanvas } from "../../context/CanvasContext"

const TextEditorWidget = ({ widget, canvasId }) => {
  const { updateWidget } = useCanvas()
  const [content, setContent] = useState(widget.config.content || "Start typing here...")
  const [isEditing, setIsEditing] = useState(false)

  const handleContentChange = (e) => {
    const newContent = e.target.value
    setContent(newContent)
  }

  const handleBlur = () => {
    setIsEditing(false)
    updateWidget(canvasId, widget.id, {
      config: { ...widget.config, content },
    })
  }

  const handleClick = (e) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsEditing(false)
      setContent(widget.config.content || "")
    }
    
    e.stopPropagation()
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        {isEditing ? (
          <textarea
            value={content}
            onChange={handleContentChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full h-full p-2 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              fontSize: `${widget.config.fontSize || 14}px`,
              fontFamily: widget.config.fontFamily || "Inter",
            }}
            placeholder="Start typing here..."
            autoFocus
          />
        ) : (
          <div
            onClick={handleClick}
            className="w-full h-full p-2 border border-gray-200 rounded-md cursor-text hover:border-gray-300 transition-colors overflow-auto"
            style={{
              fontSize: `${widget.config.fontSize || 14}px`,
              fontFamily: widget.config.fontFamily || "Inter",
            }}
          >
            {content ? (
              <div className="whitespace-pre-wrap">{content}</div>
            ) : (
              <div className="text-gray-400 italic">Click to start typing...</div>
            )}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>{content.length} characters</span>
        <span>
          {widget.config.fontFamily || "Inter"} • {widget.config.fontSize || 14}px
        </span>
      </div>
    </div>
  )
}

export default TextEditorWidget



