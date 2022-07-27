import './AlertDetailsBlock.scss'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Button, Col, Icon, Input, Row, Pagination } from 'antd'
import userIconImg from './user-icon-2.png'
import transactionIconImg from './transaction-icon.png'
import { useTranslation } from 'react-i18next'
import { camelizerHelper } from '../../../../helpers'
import apiConfig from '../../../../config/api'

const AlertDetailsBlock = ({ alert }) => {
  const [risks, setRisks] = useState([])
  const [itemsTotalNum, setItemsTotalNum] = useState(0)
  const [currentPageRisk, setCurrentPageRisk] = useState(1)
  const itemsPerPage = 10

  const { t } = useTranslation()

  useEffect(() => {
    if(alert !== null && alert.type === 'PERSONA' && alert.risks !== null && alert.risks.length > 0) {
      handlePaginationChange(1)
      setItemsTotalNum(alert.risks.length)
    }
  }, [alert])

  const handleAddDotsToNumber = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const handleRenderPersonType = (firstLetter) => {
    switch(firstLetter) {
      case 'Person':
        return t('messages.aml.natural')

      case 'Entity':
        return t('messages.aml.legal')
    }
  }

  const handlePaginationChange = (page) => {
    const fromNum = ((page - 1) * itemsPerPage)
    setCurrentPageRisk(page)
    setRisks(alert.risks.slice(fromNum, fromNum + itemsPerPage))
  }

  const downloadReportRisk = (pdfFile) => {
    window.open(apiConfig.url + '/../getPDFUboFinder?path=' + pdfFile)
  }

  return (
    <div className="alert-details-block block">
      <div className="block-title" style={{ textAlign: 'center' }}>
        <Icon type="info-circle" />
        <h3>{ t('messages.aml.alertInformation') }</h3>
      </div>
      <div className="block-content show">
        <div className="alert-item">
          <Row>
            <Col span={24}>
            <div className="rules">
              <h4><Icon type="fork" />&nbsp;&nbsp; { t('messages.aml.rules') }</h4>
                {
                  alert !== null &&
                    alert.rules.map(rule => {
                      return (
                        <div className="rules-items">
                          <div className="subitem">
                            { t('messages.aml.name') }: <strong>{ rule.name }</strong>
                          </div>
                          <div className="subitem">
                            { t('messages.aml.code') }: <strong>{ rule.code }</strong>
                          </div>
                          <div className="subitem">
                            { t('messages.aml.score') }: <strong>{ rule.score }</strong>
                          </div>
                        </div>
                      )
                    })
                }
            </div>
            </Col>
          </Row>
          { itemsTotalNum > 0 &&
          <Row>
            <Col span={24}>
            <div className="rules rules-details">
              <h4><Icon type="fork" />&nbsp;&nbsp; Detalle de Reglas</h4>
              <div className="info-content">
                <div className="risks-theads">
                  <div className="risks-theads-inner">
                    <Row>
                      <Col span={2} className="col-inner">
                          <p>{ t('messages.aml.type')}</p>
                      </Col>
                      <Col span={6} className="col-inner">
                          <p>{ t('messages.aml.type')}</p>
                      </Col>
                      <Col span={3} className="col-inner">
                          <p>DNI</p>
                      </Col>
                      <Col span={5} className="col-inner">
                          <p>{ t('messages.aml.databases')}</p>
                      </Col>
                      <Col span={5} className="col-inner">
                          <p>{ t('messages.aml.rules')}</p>
                      </Col>
                      <Col span={1} className="col-inner">
                          <p>{ t('messages.aml.risk')}</p>
                      </Col>
                      <Col span={2} className="col-inner">
                          <p>{ t('messages.aml.downloadReport')}</p>
                      </Col>
                    </Row>
                  </div>
                </div>
                <ul className="risks-childs">
                {
                  risks.map((risk, index) =>
                    <li>
                      <div className="risks-child">
                        <div className="risks-child-inner">
                          <Row className="data">
                            <Col span={2} className="col-inner">
                              { risk.type === 'UBO' ? risk.type : t('messages.aml.' + risk.type.toLowerCase()) }
                            </Col>
                            <Col span={6} className="col-inner">
                                {camelizerHelper(risk.name)}
                            </Col>
                            <Col span={3} className="col-inner">
                                { risk.rut !== null ? risk.rut : t('messages.aml.notFound') }
                            </Col>
                            <Col span={5} className="col-inner">
                                { risk.basesAML }
                            </Col>
                            <Col span={5} className="col-inner">
                              { risk.rulesId !== null && risk.rulesId.join(', ')}
                            </Col>
                            <Col span={1} className="col-inner">
                                <div className={ 'child-risk risk-' + risk.risk }>
                                  { risk.risk === null && 'N/A'}
                                  { risk.risk === 'BLACK' && 'C' }
                                  { risk.risk === 'RED' && 'A' }
                                  { risk.risk === 'ORANGE' && 'M' }
                                  { risk.risk === 'YELLOW' && 'B' }
                                  { risk.risk === 'GREEN' && 'N' }
                                </div>
                            </Col>
                            <Col span={2} className="col-inner">
                              { risk.path &&
                                <Button type="primary" icon="file-pdf" size="small" onClick={ (e) => downloadReportRisk(risk.path ) }>PDF</Button>
                              }
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </li>
                  )
                }
                </ul>
                { itemsTotalNum > itemsPerPage &&
                  <Pagination onChange={ handlePaginationChange }
                    pageSize={ itemsPerPage } current={ currentPageRisk } total={ itemsTotalNum } size="small"/>
                }
              </div>
            </div>
            </Col>
          </Row>
          }
          { alert !== null && alert.description !== null &&
            <Row>
              <Col span={24}>
                <div className="info-block description">
                  <h3><Icon type="info-circle" />&nbsp;&nbsp; { t('messages.aml.description') }</h3>
                  <div className="info-content">
                    <Row>
                      <Col span="24">
                        <label>Creado por</label>
                        <p>{ alert.username }</p>
                      </Col>
                      <Col span="24">
                        <label>Descripción Corta</label>
                        <p>{ alert.description.name }</p>
                      </Col>
                      { alert.description.description &&
                        <Col span="24">
                          <label>Descripción Larga</label>
                            <p dangerouslySetInnerHTML={{__html: alert.description.description.replace('\n','<br/>')}}></p>
                        </Col>
                      }
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          }
          { alert !== null && alert.transaction !== null &&
              <Row>
                <Col span={24}>
                  <div className="info-block">
                    <h3><Icon type="transaction" />&nbsp;&nbsp; { t('messages.aml.transaction') }</h3>
                    <div className="info-content">
                      <Row>
                        <Col span={24}>
                          <div className="col-inner">
                            <div className="data-block">
                              <div className="data-block-inner">
                                { alert.transaction.msgSwift !== null && alert.transaction.msgSwift !== undefined ?
                                  <ul className="swift-row">
                                    <li>
                                      <label>Mensaje Swift</label>:<br/>
                                      <pre>{ alert.transaction.msgSwift }</pre>
                                    </li>
                                    <li>
                                      <label>Bloque Mensaje</label>:<br/>
                                      <pre>{ alert.transaction.blockSwift }</pre>
                                    </li>
                                    <li>
                                      <label>Line</label>: { alert.transaction.lineSwift }
                                    </li>
                                  </ul>
                                  :
                                  <>
                                    <ul>
                                      <li>
                                        <label>ID</label>: { alert.transaction.id }
                                      </li>
                                      <li>
                                        <label>{ t('messages.aml.product') }</label>: { alert.transaction.producto }
                                      </li>
                                      <li>
                                        <label>{ t('messages.aml.operation') }</label>: { alert.transaction.operacion }
                                      </li>
                                      <li>
                                        <label>{ t('messages.aml.amount') }</label>: { handleAddDotsToNumber(alert.transaction.monto) } { alert.transaction.moneda }
                                      </li>
                                      <li>
                                        <label>{ t('messages.aml.balance') }</label>: { alert.transaction.saldo !== null && alert.transaction.saldo !== undefined && <>$ { handleAddDotsToNumber(alert.transaction.saldo) } </> }
                                      </li>
                                    </ul>
                                    <ul>
                                      <li>
                                        <label>{ t('messages.aml.date') }</label>: { alert.transaction.fechaOperacion !== null && alert.transaction.fechaOperacion !== '' && moment(alert.transaction.fechaOperacion).format('DD-MM-YYYY HH:mm:ss') }
                                      </li>
                                      <li>
                                        <label>{ t('messages.aml.identificator') }</label>: { alert.transaction.identificador }
                                      </li>
                                      <li>
                                        <label>{ t('messages.aml.paymentMethod') }</label>: { alert.transaction.medioPago }
                                      </li>
                                      <li>
                                        <label>{ t('messages.aml.channel') }</label>: { alert.transaction.canal }
                                      </li>
                                      <li>
                                        <label>{ t('messages.aml.currency') }</label>: { alert.transaction.tipoCambio }
                                      </li>
                                    </ul>
                                  </>
                                }
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
            }
          </div>
        </div>
      </div>
  )
}

export default AlertDetailsBlock
