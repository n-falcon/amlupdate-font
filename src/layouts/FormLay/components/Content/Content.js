import './Content.scss'
import React from 'react'
import {Breadcrumb} from 'antd'

export default ({ children, view }) => (
  <div id="content" className={'login-animation ' + view }>
    <div className="content-inner">
      { children }
    </div>
  </div>
)
