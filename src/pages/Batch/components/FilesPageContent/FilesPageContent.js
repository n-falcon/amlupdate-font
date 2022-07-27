import './FilesPageContent.scss'
import React from 'react'

const FilesPageContent = ({ children }) => (
  <div className="files-page-content">
    <div className="files-page-content-inner">
      { children }
    </div>
  </div>
)

export default FilesPageContent
