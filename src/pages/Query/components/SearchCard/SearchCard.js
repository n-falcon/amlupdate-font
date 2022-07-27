import './SearchCard.scss'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import entityIcon from './entity-icon-2.png'
import personIcon from './person-icon-2.png'
import { camelizerHelper } from '../../../../helpers'
import { Col, Icon, Row, Spin, Button } from 'antd'
import moment from 'moment'


export default ({key, currentUser, onClick, onMouseOver, person, loading }) => {
  const { t } = useTranslation()

  return (
    <div className={'search-card'} onMouseOver={onMouseOver}>
      <Row>
        <Col xs={8}>
          <div className="col-inner person-info">
            <div className="person-info-wrapper">
              {/*
              <div className="person-avatar">
                {person.type === 'Entity' && <div className="icon-wrapper"><img className="person-avatar-icon" src={entityIcon} alt="" /></div>}
                {person.type === 'Person' && <div className="icon-wrapper"><img className="person-avatar-icon" src={personIcon} alt="" /></div>}
              </div>
              */}
              <div className="person-name-rut">
                <strong>{person.formatRut}</strong>
                <span className="person-rut">{person.name ? camelizerHelper(person.name) : 'N/A'}</span>
              </div>
            </div>
          </div>
        </Col>

        <Col xs={8}>
          <div className="center">
            <span><strong>{moment().format("DD-MM-YYYY HH:mm")}</strong></span>
          </div>
        </Col>
        <Col xs={8}>
          <div className="center">
            <Button className="pdf-icon-button" disabled={loading} onClick={() => onClick(person)} icon={loading ? 'loading' : 'file-pdf'} ghost size={'large'} />
          </div>
        </Col>
      </Row>
    </div>
  )
}
