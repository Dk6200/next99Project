"use client"

import { createContext, useContext } from "react"

const CanvasContext = createContext()

export const CanvasProvider = ({ children, value }) => {
  return <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
}

export const useCanvas = () => {
  const context = useContext(CanvasContext)
  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider")
  }
  return context
}
