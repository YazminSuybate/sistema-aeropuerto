"use client"

import { useState } from "react"

export const Tabs = ({ activeTab: initialTab, onTabChange, children }) => {
  const [activeTab, setActiveTab] = useState(initialTab)

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey)
    if (onTabChange) {
      onTabChange(tabKey)
    }
  }

  // Extraer TabPane children
  const tabs = []
  const content = {}

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (child?.type === TabPane) {
        tabs.push({
          key: child.props.tabKey,
          label: child.props.label,
        })
        content[child.props.tabKey] = child.props.children
      }
    })
  } else if (children?.type === TabPane) {
    tabs.push({
      key: children.props.tabKey,
      label: children.props.label,
    })
    content[children.props.tabKey] = children.props.children
  }

  return (
    <div className="w-full">
      {/* Botones de pestañas */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === tab.key ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="mt-6">{content[activeTab]}</div>
    </div>
  )
}

export const TabPane = ({ children }) => {
  return children
}
