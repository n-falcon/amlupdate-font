import './Content.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'

const Content = ({ children }) => {
  return (
    <div id="register-content" className="content">
      { children }
    </div>
  )
}

export default Content
