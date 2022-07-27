import './AddButton.scss'
import React from 'react'
import { Icon } from 'antd'

const AddButton = ({ onClick }) => {
  return (
    <div className="add-text-file-button" onClick={ onClick }>
      <Icon type="plus" />
    </div>
  )
}

export default AddButton
