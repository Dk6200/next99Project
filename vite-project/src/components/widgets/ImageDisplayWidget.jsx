"use client"

import { useState } from "react"
import { Upload, Download, RotateCw, ZoomIn, ZoomOut } from "lucide-react"
import { useCanvas } from "../../context/CanvasContext"

const ImageDisplayWidget = ({ widget, canvasId }) => {
  const { updateWidget } = useCanvas()
  const [imageZoom, setImageZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  const handleImageUpload = (e) => {
    e.stopPropagation()
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        updateWidget(canvasId, widget.id, {
          config: {
            ...widget.config,
            imageUrl: event.target.result,
            alt: file.name,
          },
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUrlChange = (url) => {
    updateWidget(canvasId, widget.id, {
      config: { ...widget.config, imageUrl: url },
    })
  }

  const handleZoomIn = (e) => {
    e.stopPropagation()
    setImageZoom((prev) => Math.min(prev + 0.1, 3))
  }

  const handleZoomOut = (e) => {
    e.stopPropagation()
    setImageZoom((prev) => Math.max(prev - 0.1, 0.1))
  }

  const handleRotate = (e) => {
    e.stopPropagation()
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleDownload = (e) => {
    e.stopPropagation()
    if (widget.config.imageUrl) {
      const link = document.createElement("a")
      link.href = widget.config.imageUrl
      link.download = widget.config.alt || "image"
      link.click()
    }
  }

  return (
    <div className="h-full flex flex-col">
      {!widget.config.imageUrl ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <Upload size={32} className="text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4 text-center">Upload an image or enter a URL</p>

          <div className="space-y-3 w-full max-w-xs">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              onClick={(e) => e.stopPropagation()}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            <div className="text-center text-gray-400">or</div>

            <input
              type="url"
              placeholder="Enter image URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
              onBlur={(e) => e.target.value && handleImageUrlChange(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-hidden rounded-lg bg-gray-100 relative">
            <img
              src={widget.config.imageUrl || "/placeholder.svg"}
              alt={widget.config.alt}
              className="w-full h-full object-contain transition-transform duration-200"
              style={{
                transform: `scale(${imageZoom}) rotate(${rotation}deg)`,
                objectFit: widget.config.fit || "contain",
              }}
            />
          </div>

          {widget.config.showControls && (
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleZoomOut}
                  className="p-1 text-gray-600 hover:text-gray-900 rounded"
                  title="Zoom out"
                >
                  <ZoomOut size={14} />
                </button>
                <span className="text-xs text-gray-500 min-w-[50px] text-center">{Math.round(imageZoom * 100)}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-1 text-gray-600 hover:text-gray-900 rounded"
                  title="Zoom in"
                >
                  <ZoomIn size={14} />
                </button>
              </div>

              <div className="flex items-center space-x-1">
                <button onClick={handleRotate} className="p-1 text-gray-600 hover:text-gray-900 rounded" title="Rotate">
                  <RotateCw size={14} />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-1 text-gray-600 hover:text-gray-900 rounded"
                  title="Download"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ImageDisplayWidget



