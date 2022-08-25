import './TableHeaders.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row } from 'antd'

const TableHeaders = () => {
  const { t } = useTranslation()

  return (
    <div className="table-headers">
      <Row>
        <Col xs={ 2 } style={{ textIndent: '35px' }}>{ t('messages.aml.type') }</Col>
        <Col xs={ 9 } style={{ textIndent: '20px' }}>{ t('messages.aml.name')} / { t('messages.aml.rut') }</Col>
        <Col xs={ 7 } style={{ textIndent: '27px'}}>{ t('messages.aml.risk') }</Col>
        <Col xs={ 6 } style={{ textIndent: '70px' }}>Ultima Revisión</Col>
      </Row>
    </div>
  )
}

export default TableHeaders
