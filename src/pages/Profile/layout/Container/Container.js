import './Container.scss'
import React from 'react'

export default ({ className, children, id }) => (
  <div id={ id || undefined } className={ 'profile container ' + className }>
    { children }
  </div>
)
