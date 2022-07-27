import './TableHeaders.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row } from 'antd'

const TableHeaders = ({currentUser}) => {
  const { t } = useTranslation()

  return (
    <div className="table-headers">
      <Row>
        <Col xs={ 2 } style={{ textIndent: '35px' }}>{ t('messages.aml.type') }</Col>
        <Col xs={ 9 } style={{ textIndent: '20px' }}>{ t('messages.aml.name')} / { t('messages.aml.rut') }</Col>
        <Col xs={ currentUser.cliente.modules.includes('REG-ENTITY') ? 4 : 6 } style={{ textIndent: '32px'}}>{ t('messages.aml.risk') }</Col>
        { currentUser.cliente.modules.includes('REG-ENTITY') &&
          <Col xs={ 4 }>{ t('messages.aml.related') }</Col>
        }
        <Col xs={ 5 } style={{ textIndent: '15px' }}>{ t('messages.aml.actions') }</Col>
      </Row>
    </div>
  )
}

export default TableHeaders
