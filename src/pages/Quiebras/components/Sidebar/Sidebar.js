import './Sidebar.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'

const Sidebar = ({ children }) => {
  return (
    <div id="register-sidebar" className="sidebar">
      <div className="sidebar-inner">
        { children }
      </div>
    </div>
  )
}

export default Sidebar
