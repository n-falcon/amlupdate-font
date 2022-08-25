import './ClientCard.scss'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { Col, Row } from 'antd'
import personIcon from '../../../Query/components/PersonCard/person-icon.png'
import entityIcon from '../../../Query/components/PersonCard/entity-icon.png'
import { camelizerHelper } from '../../../../helpers'
import apiConfig from '../../../../config/api'

const ClientCard = ({ currentUser, client, handleModalRisk }) => {
  const { t } = useTranslation()

  useEffect(() => {

  }, [])

  const renderType = (type) => {
    if (type === 'Person') {
      return personIcon
    }

    if (type === 'Entity') {
      return entityIcon
    }
  }

  return (
    <div className="client-card">
      <div id={ 'card-' + client.id } className="client-card-inner">
        <div className="highlight-overlay" />
        <Col xs={ 2 } className="avatar section">
          <div className="avatar-wrapper">
            <img src={ renderType(client.type) } alt="" />
          </div>
        </Col>
        <Col xs={ 9 } className="info section">
          <div className="info-wrapper">
            <div className="name">{ camelizerHelper(client.name) }</div>
            <div className="rut">{ client.rut }</div>
          </div>
        </Col>
        <Col xs={ 7 } className="risk section">
          <div className={ client.risk === null ? 'risk-wrapper risk-GRAY' : 'risk-wrapper risk-' + client.risk } onClick={ client.risk === null || client.risk === 'GREEN' ? () => {} : (e) => handleModalRisk(client) }>
            <span style={{ fontWeight: client.risk !== null ? 'bold' : 'normal' }}>
              { client.risk === null ? 'N/A' : t('messages.aml.risk.char.'+ client.risk)}
            </span>
          </div>
        </Col>
        <Col xs={6} className="info section">
          { client.revisionDate !== null && moment(client.revisionDate).format('DD/MM/YYYY')}
        </Col>
      </div>
    </div>
  )
}

export default ClientCard
