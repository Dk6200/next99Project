"use client"

import { useState } from "react"
import { Plus, Trash2, Save, X } from "lucide-react"
import { useCanvas } from "../../context/CanvasContext"

const DataTableWidget = ({ widget, canvasId }) => {
  const { updateWidget } = useCanvas()
  const [editingCell, setEditingCell] = useState(null)
  const [editValue, setEditValue] = useState("")

  const handleCellEdit = (rowIndex, colIndex, value) => {
    const newRows = [...widget.config.rows]
    newRows[rowIndex][colIndex] = value

    updateWidget(canvasId, widget.id, {
      config: { ...widget.config, rows: newRows },
    })
  }

  const handleColumnEdit = (colIndex, value) => {
    const newColumns = [...widget.config.columns]
    newColumns[colIndex] = value

    updateWidget(canvasId, widget.id, {
      config: { ...widget.config, columns: newColumns },
    })
  }

  const addRow = () => {
    const newRow = new Array(widget.config.columns.length).fill("")
    updateWidget(canvasId, widget.id, {
      config: {
        ...widget.config,
        rows: [...widget.config.rows, newRow],
      },
    })
  }

  const addColumn = () => {
    const newColumns = [...widget.config.columns, `Column ${widget.config.columns.length + 1}`]
    const newRows = widget.config.rows.map((row) => [...row, ""])

    updateWidget(canvasId, widget.id, {
      config: {
        ...widget.config,
        columns: newColumns,
        rows: newRows,
      },
    })
  }

  const deleteRow = (rowIndex) => {
    if (widget.config.rows.length <= 1) return

    const newRows = widget.config.rows.filter((_, index) => index !== rowIndex)
    updateWidget(canvasId, widget.id, {
      config: { ...widget.config, rows: newRows },
    })
  }

  const deleteColumn = (colIndex) => {
    if (widget.config.columns.length <= 1) return

    const newColumns = widget.config.columns.filter((_, index) => index !== colIndex)
    const newRows = widget.config.rows.map((row) => row.filter((_, index) => index !== colIndex))

    updateWidget(canvasId, widget.id, {
      config: {
        ...widget.config,
        columns: newColumns,
        rows: newRows,
      },
    })
  }

  const startEdit = (type, rowIndex, colIndex, currentValue) => {
    setEditingCell({ type, rowIndex, colIndex })
    setEditValue(currentValue)
  }

  const saveEdit = () => {
    if (editingCell.type === "header") {
      handleColumnEdit(editingCell.colIndex, editValue)
    } else {
      handleCellEdit(editingCell.rowIndex, editingCell.colIndex, editValue)
    }
    setEditingCell(null)
    setEditValue("")
  }

  const cancelEdit = () => {
    setEditingCell(null)
    setEditValue("")
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          {widget.config.showHeaders && (
            <thead>
              <tr className="bg-gray-50">
                {widget.config.columns.map((column, colIndex) => (
                  <th key={colIndex} className="relative group">
                    {editingCell?.type === "header" && editingCell?.colIndex === colIndex ? (
                      <div className="flex items-center p-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                          autoFocus
                        />
                        <button onClick={saveEdit} className="ml-1 p-1 text-green-600 hover:text-green-800">
                          <Save size={12} />
                        </button>
                        <button onClick={cancelEdit} className="p-1 text-red-600 hover:text-red-800">
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2">
                        <span
                          className="font-medium text-gray-900 cursor-pointer flex-1 text-left"
                          onClick={() => startEdit("header", null, colIndex, column)}
                        >
                          {column}
                        </span>
                        {widget.config.columns.length > 1 && (
                          <button
                            onClick={() => deleteColumn(colIndex)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-red-600 hover:text-red-800 transition-opacity"
                            title="Delete column"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    )}
                  </th>
                ))}
                <th className="w-8">
                  <button onClick={addColumn} className="p-1 text-gray-400 hover:text-gray-600" title="Add column">
                    <Plus size={12} />
                  </button>
                </th>
              </tr>
            </thead>
          )}

          <tbody>
            {widget.config.rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`group ${widget.config.striped && rowIndex % 2 === 1 ? "bg-gray-50" : ""} hover:bg-blue-50`}
              >
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="relative">
                    {editingCell?.type === "cell" &&
                    editingCell?.rowIndex === rowIndex &&
                    editingCell?.colIndex === colIndex ? (
                      <div className="flex items-center p-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                          autoFocus
                        />
                        <button onClick={saveEdit} className="ml-1 p-1 text-green-600 hover:text-green-800">
                          <Save size={12} />
                        </button>
                        <button onClick={cancelEdit} className="p-1 text-red-600 hover:text-red-800">
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="p-2 cursor-pointer min-h-[32px] flex items-center"
                        onClick={() => startEdit("cell", rowIndex, colIndex, cell)}
                      >
                        {cell || <span className="text-gray-400 italic">Click to edit</span>}
                      </div>
                    )}
                  </td>
                ))}
                <td className="w-8">
                  {widget.config.rows.length > 1 && (
                    <button
                      onClick={() => deleteRow(rowIndex)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-600 hover:text-red-800 transition-opacity"
                      title="Delete row"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <button
          onClick={addRow}
          className="flex items-center space-x-1 px-3 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
        >
          <Plus size={12} />
          <span>Add Row</span>
        </button>

        <div className="text-xs text-gray-500">
          {widget.config.rows.length} rows × {widget.config.columns.length} columns
        </div>
      </div>
    </div>
  )
}

export default DataTableWidget
