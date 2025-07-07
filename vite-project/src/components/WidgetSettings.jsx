"use client"

import { useState } from "react"
import { X, Save, FileText, ImageIcon, Table } from "lucide-react"

const WidgetSettings = ({ widget, onClose, onUpdate }) => {
  const [config, setConfig] = useState(widget.config)

  const handleSave = () => {
    onUpdate({ config })
    onClose()
  }

  const handleConfigChange = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const getWidgetIcon = () => {
    switch (widget.type) {
      case "text-editor":
        return <FileText size={20} className="text-blue-600" />
      case "image-display":
        return <ImageIcon size={20} className="text-green-600" />
      case "data-table":
        return <Table size={20} className="text-purple-600" />
      default:
        return null
    }
  }

  const renderSettings = () => {
    switch (widget.type) {
      case "text-editor":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => handleConfigChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
              <select
                value={config.fontSize}
                onChange={(e) => handleConfigChange("fontSize", Number.parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={12}>12px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
                <option value={18}>18px</option>
                <option value={20}>20px</option>
                <option value={24}>24px</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
              <select
                value={config.fontFamily}
                onChange={(e) => handleConfigChange("fontFamily", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Inter">Inter</option>
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
              </select>
            </div>
          </div>
        )

      case "image-display":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => handleConfigChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                value={config.imageUrl}
                onChange={(e) => handleConfigChange("imageUrl", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
              <input
                type="text"
                value={config.alt}
                onChange={(e) => handleConfigChange("alt", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Fit</label>
              <select
                value={config.fit}
                onChange={(e) => handleConfigChange("fit", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="contain">Contain</option>
                <option value="cover">Cover</option>
                <option value="fill">Fill</option>
                <option value="scale-down">Scale Down</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showControls"
                checked={config.showControls}
                onChange={(e) => handleConfigChange("showControls", e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="showControls" className="ml-2 block text-sm text-gray-700">
                Show image controls
              </label>
            </div>
          </div>
        )

      case "data-table":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => handleConfigChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showHeaders"
                checked={config.showHeaders}
                onChange={(e) => handleConfigChange("showHeaders", e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="showHeaders" className="ml-2 block text-sm text-gray-700">
                Show table headers
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="striped"
                checked={config.striped}
                onChange={(e) => handleConfigChange("striped", e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="striped" className="ml-2 block text-sm text-gray-700">
                Striped rows
              </label>
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">
                Table has {config.rows.length} rows and {config.columns.length} columns. Use the table interface to
                add/remove rows and columns.
              </p>
            </div>
          </div>
        )

      default:
        return <div className="text-center text-gray-500">No settings available for this widget type.</div>
    }
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
     
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getWidgetIcon()}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Widget Settings</h2>
              <p className="text-sm text-gray-500 capitalize">{widget.type.replace("-", " ")}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      
      <div className="flex-1 p-4 overflow-y-auto">{renderSettings()}</div>

      
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={16} />
            <span>Save Changes</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default WidgetSettings
