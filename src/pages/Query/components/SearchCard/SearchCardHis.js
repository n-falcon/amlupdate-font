import './SearchCardHis.scss'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import entityIcon from './entity-icon-2.png'
import personIcon from './person-icon-2.png'
import { camelizerHelper } from '../../../../helpers'
import { Button, Col, Icon, Row, Spin } from 'antd'
import formatRut from '../../../../helpers/formatRut'


export default ({key, currentUser, onClick, onMouseOver, person }) => {
  const { t } = useTranslation()

  console.log(person);

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
                <strong>{camelizerHelper(formatRut.format(person.rut))}</strong>
                <span className="person-rut">{ person.nombre == undefined ? 'N/A' : person.nombre}</span>
              </div>
            </div>
          </div>
        </Col>

        <Col xs={8}>
          <div className="center">
            <span><strong>{person.dateShortAsString}</strong></span>
          </div>
        </Col>
        <Col xs={8}>
          <div className="center">
            <Button className="pdf-icon-button" onClick={() => onClick(person)} icon={'file-pdf'} ghost size={'large'} />
          </div>
        </Col>
      </Row>
    </div>
  )
}
