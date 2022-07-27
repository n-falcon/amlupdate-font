import './PersonCard.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import entityIcon from './entity-icon-2.png'
import personIcon from './person-icon-2.png'
import { camelizerHelper } from '../../../../helpers'
import { Badge, Col, Icon, Row, Skeleton } from 'antd'

export default ({ className, currentUser, onClick, onMouseOver, person }) => {
  const { t } = useTranslation()

  const camelize = (str) => {
    return str.split(' ').map(function(word,index){
      if(index === 0){
        return word.toLowerCase()
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    }).join(' ')
  }

  return (
    <div className={ 'person-card ' + className } onMouseOver={ onMouseOver } onClick={ () => onClick(person, person.id, person.name, person.formatRut, person.type) }>
      <Row>
        <Col xs={ currentUser.cliente.pais === 'CHI' ? 7 : 8 }>
          <div className="col-inner person-info">
            <div className="person-info-wrapper">
              <div className="person-avatar">
                { person.type === 'Entity' && <div className="icon-wrapper"><img className="person-avatar-icon" src={ entityIcon } alt="" /></div> }
                { person.type === 'Person' && <div className="icon-wrapper"><img className="person-avatar-icon" src={ personIcon } alt="" /></div> }
              </div>
              <div className="person-name-rut">
                <strong>{ camelizerHelper(person.name) }</strong>
                <span className="person-rut">{ person.formatRut }</span>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={ currentUser.cliente.pais === 'CHI' ? 7 : 8 }>
          <div className="col-inner compliance">
            <div className="compliance-wrapper">
              <ul>
                <li>
                  <div className="compliance-group-title">Listas<br />Obligatorias</div>
                  <div className={ person.compliance.PEPSAN.bases === null ? 'risk-' + person.compliance.PEPSAN.color + ' compliance-group-circle disabled' : 'risk-' + person.compliance.PEPSAN.color + ' compliance-group-circle' }>{ person.compliance.PEPSAN.bases !== null ? person.compliance.PEPSAN.bases.length : <Icon type="lock" /> }</div>
                </li>
                <li>
                  <div className="compliance-group-title">KYC<br/>&nbsp;</div>
                  <div className={ person.compliance.KYCAME.bases === null ? 'risk-' + person.compliance.KYCAME.color + ' compliance-group-circle disabled' : 'risk-' + person.compliance.KYCAME.color + ' compliance-group-circle' }>{ person.compliance.KYCAME.bases !== null ? person.compliance.KYCAME.bases.length : <Icon type="lock" /> }</div>
                </li>
                <li>
                  <div className="compliance-group-title">UBO & <br />Companies</div>
                  <div className={ person.compliance.UBOCOM.bases === null ? 'risk-' + person.compliance.UBOCOM.color + ' compliance-group-circle disabled' : 'risk-' + person.compliance.UBOCOM.color + ' compliance-group-circle' }>{ person.compliance.UBOCOM.bases !== null ? person.compliance.UBOCOM.bases.length : <Icon type="lock" /> }</div>
                </li>
              </ul>
            </div>
          </div>
        </Col>
        { currentUser.cliente.pais === 'CHI' &&
          <Col xs={ 5 }>
            <div className="col-inner partners-controllers">
              { person.type === 'Entity' ?
                  person.propietarios !== null ?
                    <div>
                      <h3>Propietarios</h3>
                      { person.propietarios.slice(0, 3).map((owner, index) => <span key={ index } className="owner">
                        <div className='wraperPercent'>
                          { owner.percent !== null && <Badge count={ parseInt(owner.percent,10) + '%' } style={{ backgroundColor: '#bbb', border: 0 }} /> }
                        </div>
                        <Badge count={ owner.type === 'PROPIETARIO' ? 'P' : 'C' } style={{ backgroundColor: '#c2552b' }} /> &nbsp;{ camelize(owner.name) }</span> ) }
                      { person.propietarios.length > 3 && <small>Y <b>{ person.propietarios.length - 3 }</b> más ...</small> }
                    </div>
                  :
                    (person.compliance.UBOCOM.bases === null || !currentUser.cliente.modules.includes('BUSINF'))?
                      <div className="skeleton">
                        <div className="skeleton-inner">
                          <h3><Icon type="lock" /> { t('messages.aml.owners') }</h3>
                          <Skeleton title={ false } paragraph={{ rows: 3 }} />
                        </div>
                      </div>
                    :
                      <span className="not-available">{ t('messages.aml.notAvailable') }.</span>
              :
                person.sociedades !== null ?
                  <div>
                    <h3>Sociedades</h3>
                    { person.sociedades.slice(0, 3).map(owner => <span className="owner">
                      <div className='wraperPercent'>
                        { owner.percent !== null && <Badge count={ parseInt(owner.percent,10) + '%' } style={{ backgroundColor: '#bbb', border: 0 }} /> }
                      </div>
                      <Badge count={ owner.type === 'PROPIETARIO' ? 'P' : 'C' } style={{ backgroundColor: '#c2552b' }} /> &nbsp;{ camelize(owner.name) }</span> ) }
                    { person.sociedades.length > 3 && <small>{ t('messages.aml.andUpper') } <b>{ person.sociedades.length - 3 }</b> { t('messages.aml.more') } ...</small> }
                  </div>
                :
                  (person.compliance.UBOCOM.bases === null || !currentUser.cliente.modules.includes('BUSINF'))?
                    <div className="skeleton">
                      <div className="skeleton-inner">
                        <h3><Icon type="lock" /> { t('messages.aml.partnerships') }</h3>
                        <Skeleton title={ false } paragraph={{ rows: 3 }} />
                      </div>
                    </div>
                  :
                    <span className="not-available">{ t('messages.aml.notAvailable') }.</span>
              }
            </div>
          </Col>
        }
        <Col xs={ currentUser.cliente.pais === 'CHI' ? 5 : 8  }>
          <div className="col-inner relevance">
            <div className="relevance-wrapper">
              <span>{ person.percent }%</span>
              <div className="bar-bg">
                <div className="bar" style={{ backgroundColor: '#1890ff', width: person.percent }}></div>
              </div>
            </div>
            <Icon type="arrow-right" />
          </div>
        </Col>
      </Row>
    </div>
  )
}
