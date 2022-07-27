import './ResultsBar.scss'
import React from 'react'
import { Col, Row } from 'antd'

export default ({ children }) => {
  return (
    <div className="results-bar">
      <Row>
        <Col xs={ 8 }>
          { children[0] }
        </Col>
        <Col xs={ 9 }>
          { children[1] }
        </Col>
        <Col xs={ 7 }>
          { children[2] }
        </Col>
      </Row>
    </div>
  )
}
