import './FalsesPositivesBlock.scss'
import React, { useState, useEffect } from 'react'
import { Button, Checkbox, Switch, Tooltip, Col, Row, Icon, Spin, Modal, Tabs, notification, Input } from 'antd'
import { PersonInfoTabContent } from '../../../Profile/components'
import personIcon from '../../../Query/components/PersonCard/person-icon.png'
import entityIcon from '../../../Query/components/PersonCard/entity-icon.png'
import { camelizerHelper } from '../../../../helpers'
import { useTranslation } from 'react-i18next'
import { updateFalsoPositivoPromise, getDJObjectsFalsePositivePromise } from '../../../Register/promises'
import { getFalsosPositivosPromise } from '../../promises'
import { getDetailFalsoPositivoPromise } from '../../../Register/promises'
import moment from "moment";

const { TabPane } = Tabs

const FalsesPositivesBlock = ({ alert, refreshHandler, updateFP }) => {
  const client = alert.record
  const [isEnabled, setIsEnabled] = useState(alert.estadoFP === 'PENDIENTE')
  const [clickedCardFalsesPositives, setClickedCardFalsesPositives] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isLoadingProfilesFP, setIsLoadingProfilesFP] = useState(false)
  const [detailsFalePositive, setDetailsFalePositive] = useState([])
  const [changes, setChanges] = useState(0)
  const [isOpenModalFP, setIsOpenModalFP] = useState(false)
  const [commentsFP, setCommentsFP] = useState(null)
  const [commentsDetail, setCommentsDetail] = useState(null)

  const { t } = useTranslation()

  useEffect(() => {
    loadFalsosPositivos()
  }, [])

  const processFP = (fps) => {
    for (let i = 0; i < fps.length; i++) {
      if(!fps[i].extId) fps[i].extId = alert.record.id
      for (let ii = 0; ii < fps[i].details.length; ii++) {
        if(fps[i].details[ii].status === 'CONFIRMADO') {
          fps[i].coincidence = fps[i].details[ii].id
        }else if(fps[i].details[ii].status === 'DESCARTADO') {
          fps[i].details[ii].isFalseChecked = true
        }
      }
    }
    if(updateFP) updateFP(fps)
    setClickedCardFalsesPositives(fps)
  }

  const loadFalsosPositivos = () => {
    if(alert.id) {
      getFalsosPositivosPromise(alert.id).then((response) => {
        processFP(response)
      })
    }else {
      getDetailFalsoPositivoPromise(alert.record.id).then((response) => {
        processFP(response)
      })
    }
    setChanges(0)
  }

  const renderType = (type) => {
    if (type === 'Person') {
      return personIcon
    }

    if (type === 'Entity') {
      return entityIcon
    }
  }

  const updateFalsoPositivo = async (falsePositive, detailId, falsesId) => {
    const update = await updateFalsoPositivoPromise(falsePositive.extId, falsePositive.uboId, detailId, falsesId, alert.id, commentsFP)

    if (update.success) {
      refreshHandler()
    }
  }

  const openModalDetailFalsePositive = async (id) => {
    setIsModalVisible(true)
    setIsLoadingProfilesFP(true)
    const profilesFalsePositive = await getDJObjectsFalsePositivePromise(id)
    setDetailsFalePositive(profilesFalsePositive)
    setIsLoadingProfilesFP(false)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
  }

  const handleSwitchToEdit = (e, falsePositive) => {
    e.preventDefault()

    let cloneFalsesPositives = JSON.parse(JSON.stringify(clickedCardFalsesPositives))

    for(let i=0;i<cloneFalsesPositives.length;i++) {
      if(cloneFalsesPositives[i].id === falsePositive.id) {
        cloneFalsesPositives[i].status = 'PENDIENTE'
      }
    }

    setClickedCardFalsesPositives(cloneFalsesPositives)
  }

  const getTitleModule = (module) => {
      if(module === 'WL') return "Watchlist"
      else if(module === 'AME') return "Adverse Media"
      else if(module === 'SOC') return "State Owned Companies"
  }

  const handleFalseCheck = (value, indexParent, indexChild) => {
    setClickedCardFalsesPositives(oldClickedCardFalsesPositives => {
      const arr = JSON.parse(JSON.stringify(oldClickedCardFalsesPositives))
      arr[indexParent].changes = true
      arr[indexParent].details[indexChild].isFalseChecked = value
      return arr
    })

    setChanges(changes + 1)
  }

  const handleCoincidenceCheck = (value, indexParent, indexChild) => {
    const arr = JSON.parse(JSON.stringify(clickedCardFalsesPositives))
    arr[indexParent].coincidence = null
    arr[indexParent].changes = true
    if(value) {
      arr[indexParent].coincidence = arr[indexParent].details[indexChild].id
    }
    setClickedCardFalsesPositives(arr)
    setChanges(changes + 1)
  }

  const openCommentsFP = () => {
    setIsOpenModalFP(true)
  }

  const saveChangesFP = async () => {
    for (let i = 0; i < clickedCardFalsesPositives.length; i++) {
      if(clickedCardFalsesPositives[i].changes === true) {
        if(clickedCardFalsesPositives[i].coincidence !== null && clickedCardFalsesPositives[i].coincidence !== undefined) {
          await updateFalsoPositivo(clickedCardFalsesPositives[i], clickedCardFalsesPositives[i].coincidence, null)
        }else {
          let falsesId = []
          for(let j=0;j<clickedCardFalsesPositives[i].details.length;j++) {
            if(clickedCardFalsesPositives[i].details[j].isFalseChecked === true) {
              falsesId.push(clickedCardFalsesPositives[i].details[j].id)
            }
          }
          await updateFalsoPositivo(clickedCardFalsesPositives[i], null, falsesId)
        }
      }
    }
    notification.success({
      message: t('messages.aml.successfulOperation'),
      description: t('messages.aml.recordSavedSuccessfully')
    })
    loadFalsosPositivos()
  }

  const handleCloseModalCommentsFP = () => {
    setIsOpenModalFP(false)
    setCommentsFP(null)
  }

  const handleSaveCommentsFP = () => {
    saveChangesFP()
    handleCloseModalCommentsFP()
  }

  const showCommentsFP = (detail) => {
    setCommentsDetail(detail)
  }

  const closeCommentsFP = () => {
    setCommentsDetail(null)
  }

  return (
    <div className="mon-falses-positives-block">
      <div className="block">
        <div className="block-title">
          <Icon type="unordered-list" />
          <h3>Resolución de Coincidencias por Nombre</h3>
          { changes > 0 && <Button className="save-button" size="small" icon="save" type="primary" onClick={openCommentsFP}>Guardar cambios</Button> }
          { alert.id ?
            <Switch size="small" defaultChecked={ isEnabled } onChange={ value => setIsEnabled(value) } />
            :
            <Button type="link" className="verMas" onClick={() => setIsEnabled(!isEnabled)}>Ver más <Icon type={isEnabled ? "minus" : "plus"}/></Button>
          }
          { !alert.id &&
            <hr/>
          }
        </div>

        <div className={ isEnabled ? "block-content show " : "block-content hide "}>
          <div className="falses-positives">
            { clickedCardFalsesPositives && clickedCardFalsesPositives.length > 0 &&
              <ul className="falses-positives-parents">
                {
                  clickedCardFalsesPositives.map((falsePositive, index) =>
                    <li className={ falsePositive.status === 'TRATADO' ? 'falses-positives-parent reviewed' : 'falses-positives-parent' }>
                      <div className="falses-positives-parent-body">
                        <div className="big-number child-section">
                          #{ index + 1 }
                        </div>
                        <div className="avatar child-section">
                          <div className="avatar-wrapper">
                              <img src={ renderType(falsePositive.type) } alt="" />
                          </div>
                        </div>
                        <div className="info child-section">
                          <div className="info-wrapper">
                            <strong className="name">{ camelizerHelper(falsePositive.name) }</strong>
                            <div className="rut">{ falsePositive.dni }</div>
                          </div>
                        </div>
                        <div className="person-type child-section">
                          { client && client.type === 'Entity' && client.processUF && <h3> { falsePositive.type === 'Entity' ? t("messages.aml.entity") : t('messages.aml.finalBeneficiary') }</h3> }
                        </div>
                        <div className="modification-date child-section">
                          { falsePositive.dateStatus !== null && falsePositive.dateStatus !== undefined &&
                            <div>
                              <p>Última modificación:</p><strong>{ moment(falsePositive.dateStatus).format("DD/MM/YYYY HH:mm") }</strong>
                            </div>
                          }
                        </div>
                        <div className="is-reviewed-overlay">
                          <div className="is-reviewed">{ t('messages.aml.reviewed') }</div>
                        </div>
                      </div>
                      <div className="falses-theads">
                        <div className="falses-theads-inner">
                          <Row>
                            <Col span="1">
                              <div className="col-inner">
                                <p>Nro.</p>
                              </div>
                            </Col>
                            <Col span="1">
                              <div className="col-inner">
                                <p>{ t('messages.aml.risk')}</p>
                              </div>
                            </Col>
                            <Col span="5">
                              <div className="col-inner">
                                <p>{ t('messages.aml.name')}</p>
                              </div>
                            </Col>
                            <Col span="3">
                              <div className="col-inner">
                                <p>DNI</p>
                              </div>
                            </Col>
                            <Col span="3">
                              <div className="col-inner">
                                <p>País</p>
                              </div>
                            </Col>
                            <Col span="3">
                              <div className="col-inner">
                                <p>Clasificación</p>
                              </div>
                            </Col>
                            <Col span="1">
                              <div className="col-inner">
                                <p>%</p>
                              </div>
                            </Col>
                            <Col span="1">
                              <div className="col-inner">
                                <p>Detalle</p>
                              </div>
                            </Col>
                            <Col span="6">
                              <div className="col-inner">
                                <p>Acciones</p>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </div>
                      <ul className="falses-positives-childs">
                        <li className="separator dismiss">
                        </li>
                        {
                          falsePositive.details.map((falsePositiveDetail, indexx) =>
                            <>
                              <li className="separator" />
                              <li>
                                <div className="falses-positives-child">
                                  <div className="falses-positives-child-inner">
                                    <Row className="data">
                                      <Col className="col1" span={1}>
                                        <div className="col-inner">
                                          { indexx + 1 }
                                        </div>
                                      </Col>
                                      <Col className="col2" span={1}>
                                        <div className="col-inner">
                                          <div className={ 'child-risk risk-' + falsePositiveDetail.amlStatus }>
                                            { falsePositiveDetail.amlStatus === null && 'N/A'}
                                            { falsePositiveDetail.amlStatus === 'BLACK' && 'C' }
                                            { falsePositiveDetail.amlStatus === 'RED' && 'A' }
                                            { falsePositiveDetail.amlStatus === 'ORANGE' && 'M' }
                                            { falsePositiveDetail.amlStatus === 'YELLOW' && 'B' }
                                            { falsePositiveDetail.amlStatus === 'GREEN' && 'N' }
                                          </div>
                                        </div>
                                      </Col>
                                      <Col className="col3" span={5}>
                                        <div className="col-inner">
                                          {falsePositiveDetail.nombre}
                                        </div>
                                      </Col>
                                      <Col  className="col4" span={3}>
                                        <div className="col-inner">
                                          { falsePositiveDetail.dni !== null ? falsePositiveDetail.dni : t('messages.aml.notFound') }
                                        </div>
                                      </Col>
                                      <Col className="col5" span={3}>
                                        <div className="col-inner">
                                          { falsePositiveDetail.country !== null ? falsePositiveDetail.country : t('messages.aml.notFound') }
                                        </div>
                                      </Col>
                                      <Col  className="col6" span={3}>
                                        <div className="col-inner">
                                          { falsePositiveDetail.clasif.join(', ') }
                                        </div>
                                      </Col>
                                      <Col  className="col7" span={1}>
                                        <div className="col-inner">
                                          { falsePositiveDetail.percent }
                                        </div>
                                      </Col>
                                      <Col  className="col8" span={1}>
                                        <div className="col-inner">
                                          { falsePositiveDetail.djId &&
                                            <Button icon="profile" size="small" onClick={ () => openModalDetailFalsePositive( falsePositiveDetail.id ) } />
                                          }
                                        </div>
                                      </Col>
                                      <Col className="last-of-them" span={6}>
                                        <Col span={11}>
                                          <h5>Falso<br />Positivo</h5>
                                          <Checkbox disabled={falsePositive.coincidence !== null && falsePositive.coincidence !== undefined} checked={ (falsePositiveDetail.isFalseChecked === true && (falsePositive.coincidence === null || falsePositive.coincidence === undefined)) || (falsePositive.coincidence !== null && falsePositive.coincidence !== undefined && falsePositive.coincidence !== falsePositiveDetail.id)} onChange={ (e) => handleFalseCheck(e.target.checked, index, indexx) } />
                                        </Col>
                                        <Col span={11}>
                                          <h5>Coincidencia<br />positiva</h5>
                                          <Checkbox checked={ falsePositiveDetail.id === falsePositive.coincidence } onChange={ (e) => handleCoincidenceCheck(e.target.checked, index, indexx) }/>
                                        </Col>
                                        <Col span={2}>
                                          { falsePositiveDetail.comments &&
                                            <Tooltip title={moment(falsePositiveDetail.dateComments).format('DD/MM/YYYY HH:mm')}>
                                              <a onClick={() => showCommentsFP(falsePositiveDetail)}><Icon type="file-text"/></a>
                                            </Tooltip>
                                          }
                                        </Col>
                                      </Col>
                                   </Row>
                                  </div>
                                </div>
                              </li>
                            </>
                          )
                        }
                      </ul>
                    </li>
                  )
                }
              </ul>
            }
          </div>
        </div>
      </div>
      { isModalVisible &&
        <Modal
          title={ t('messages.aml.profile') }
          visible={ true }
          width={ 900 }
          onCancel={ handleCloseModal }
          footer={ <Button onClick={ handleCloseModal }>{ t('messages.aml.btnClose') }</Button> }
          >
          { isLoadingProfilesFP ?
            <Spin spinning={ true } size="large" />
            :
            <>
            { detailsFalePositive.length === 1 ?
              <PersonInfoTabContent person={ detailsFalePositive[0].record } />
              :
              <Tabs type="card">
              { detailsFalePositive.map((detail, index) =>
                  <TabPane tab={ getTitleModule(detail.module) } key={index}>
                    <PersonInfoTabContent person={ detail.record } />
                  </TabPane>
              )  }
              </Tabs>
            }
            </>
          }
        </Modal>
      }
      { isOpenModalFP &&
        <Modal
          title="Comentario"
          visible={ true }
          width={ 700 }
          onCancel={ handleCloseModalCommentsFP }
          footer={ [
              <Button onClick={ handleCloseModalCommentsFP }>{ t('messages.aml.btnClose') }</Button>,
              <Button onClick={ handleSaveCommentsFP } type="primary">{ t('messages.aml.save') }</Button>,
            ]}
          >
          <Input.TextArea maxLength={2000} 
              placeholder="Puede agregar observaciones asociadas a las coincidencias selecccionadas. Recuerde que este texto es opcional." 
              value={commentsFP} 
              onChange={(e) => setCommentsFP(e.target.value)}
          />
        </Modal>
      }
      { commentsDetail &&
        <Modal
          title="Comentario"
          visible={ true }
          width={ 700 }
          onCancel={ closeCommentsFP }
          footer={ [
              <Button onClick={ closeCommentsFP }>{ t('messages.aml.btnClose') }</Button>,
            ]}
          >
          <Row>
            <Col span={3}><label><b>Usuario</b></label></Col>
            <Col span={8}>{commentsDetail.userComments}</Col>
            <Col span={2} offset={1}><label><b>Fecha</b></label></Col>
            <Col span={9}>{moment(commentsDetail.dateComments).format('DD/MM/YYYY HH:mm')}</Col>
          </Row>
          <Row style={{paddingTop:8}}>
            <Col><label><b>Comentario</b></label></Col>
            <Col><Input.TextArea readOnly value={commentsDetail.comments}  /></Col>
          </Row>
          
        </Modal>
      }
    </div>

  )
}

export default FalsesPositivesBlock
