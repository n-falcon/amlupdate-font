import './ClientCard.scss'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AnimateHeight from 'react-animate-height'
import { Button, Col, Icon, notification, Popconfirm, Row, Statistic, Modal, Spin, Tabs } from 'antd'
import { PersonInfoTabContent } from '../../../Profile/components'
import personIcon from '../../../Query/components/PersonCard/person-icon.png'
import entityIcon from '../../../Query/components/PersonCard/entity-icon.png'
import alertIcon from './icon-alert.png'
import relatedIcon from '../../related.png'
import { camelizerHelper } from '../../../../helpers'
import apiConfig from '../../../../config/api'
import { getDetailFalsoPositivoPromise, updateFalsoPositivoPromise, getDJObjectsFalsePositivePromise } from '../../promises'

const { TabPane } = Tabs

const ClientCard = ({ currentUser, client, handleModalRisk, handleViewUbos, handleViewProfile, isActiveFalsePositives }) => {
  const { t } = useTranslation()
  const [currentClient, setCurrentClient] = useState(client)
  const [clickedCardHeight, setClickedCardHeight] = useState(110)
  const [clickedCardFalsesPositives, setClickedCardFalsesPositives] = useState([])
  const [clickedCardFalsesPositivesIsLoading, setClickedCardFalsesPositivesIsLoading] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isAnimation, setIsAnimation] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isLoadingProfilesFP, setIsLoadingProfilesFP] = useState(false)
  const [detailsFalePositive, setDetailsFalePositive] = useState([])

  const cardId = "ref-" + client.id

  useEffect(() => {
    if (isActiveFalsePositives) {
      const card = {
        target: document.getElementById(cardId)
      }

      handleOnClick(card)
    }
  }, [])

  const renderType = (type) => {
    if (type === 'Person') {
      return personIcon
    }

    if (type === 'Entity') {
      return entityIcon
    }
  }

  const handleOnClick = async (e) => {
    const card = await e.target.closest('.client-card')
    const cardOriginalHeight = await card.querySelector('.client-card-inner').offsetHeight

    await setClickedCardFalsesPositivesIsLoading(true)

    const details = await getDetailFalsoPositivoPromise(client.id)
    await setClickedCardFalsesPositives(details)

    await setIsDropdownOpen(true)

    const dropdownHeight = await card.querySelector('.dropdown-overlay').offsetHeight
    await setClickedCardHeight(cardOriginalHeight + dropdownHeight)
    await setClickedCardFalsesPositivesIsLoading(false)
  }

  const handleDownloadPdf = (path) => {
    window.open(apiConfig.url + '/../getPDFUboFinder?path=' + path)
  }

  const updateFalsoPositivo = async (falsePositive, detailId) => {
    const update = await updateFalsoPositivoPromise(client.id, falsePositive.uboId, detailId)

    if (update.success) {
      setCurrentClient(update.data)

      const details = await getDetailFalsoPositivoPromise(client.id)
      setClickedCardFalsesPositives(details)

      if(update.data.estadoFP === 'TRATADO') {
        handleCloseDropdown(true)
      }
    }
  }

  const handleDismiss = async (falsePositive) => {
    updateFalsoPositivo(falsePositive, null)
  }

  const handleChooseOne = async (falsePositive, detailId) => {
    updateFalsoPositivo(falsePositive, detailId)
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

  const handleCloseDropdown = async (scrollTo) => {
    await setClickedCardHeight(110)
    await setIsDropdownOpen(false)

    if(scrollTo) {
      let card = document.getElementById('card-'+client.id)
      card.scrollIntoView({ behavior: 'smooth', block: 'center' })

      window.setTimeout(() => {
        setIsClosing(true)
      }, 1000)

      window.setTimeout(() => {
        setIsClosing(false)
        notification.success({
          message: t('messages.aml.successfulOperation'),
          description: t('messages.aml.recordSavedSuccessfully')
        })
      }, 2000)
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

  const handleAnimateStart = () => {
    setIsAnimation(true)
  }

  const handleAnimateEnd = () => {
    setIsAnimation(false)
  }

  const getTitleModule = (module) => {
      if(module === 'WL') return "Watchlist"
      else if(module === 'AME') return "Adverse Media"
      else if(module === 'SOC') return "State Owned Companies"
  }

  return (
    <AnimateHeight duration={ 1000 } height={ clickedCardHeight } className={ isDropdownOpen ? 'client-card is-dropdown-open' : 'client-card' } onAnimationStart={ handleAnimateStart } onAnimationEnd={ handleAnimateEnd }>
      <div id={ 'card-' + client.id } className={ 'client-card-inner' + (isClosing ? ' is-closing':'') }>
        <div className="highlight-overlay" />
        <Col xs={ 2 } className="avatar section">
          <div className="avatar-wrapper">
            <img src={ renderType(client.type) } alt="" />
          </div>
        </Col>
        <Col xs={ 8 } className="info section">
          <div className="info-wrapper">
            <div className="name">{ camelizerHelper(client.nombre) }</div>
            <div className="rut">{ client.rut }</div>
          </div>
        </Col>
        <Col xs={ currentUser.cliente.modules.includes('REG-ENTITY') ? 5 : 7 } className="risk section">
          <div className={ currentClient.amlStatus === null ? 'risk-wrapper risk-GRAY' : 'risk-wrapper risk-' + currentClient.amlStatus } onClick={ currentClient.amlStatus === null || currentClient.amlStatus === 'GREEN' ? () => {} : (e) => handleModalRisk(client) }>
            <span style={{ fontWeight: currentClient.amlStatus !== null ? 'bold' : 'normal' }}>
              { currentClient.amlStatus === null ? 'N/A' : t('messages.aml.risk.char.' + currentClient.amlStatus)}
            </span>
          </div>
        </Col>
        { currentUser.cliente.modules.includes('REG-ENTITY') &&
          <Col xs={ 3 } className="section related">
          { currentClient.nroRelated !== null &&
            <>
              <img src={ relatedIcon } alt="" className="img-related" />
              <span>{currentClient.nroRelated}</span>
            </>
          }
          </Col>
        }
        <Col xs={ 6 } className="actions section">
          <div className="actions-wrapper">
            <ul>
              { (currentClient.estadoFP !== null && (currentClient.estadoFP === 'PENDIENTE' || currentClient.estadoFP === 'TRATADO')) &&
                <li  id={ cardId } className="falses" onClick={ (e) => !isDropdownOpen ? handleOnClick(e) : handleCloseDropdown(false)  }>
                  <div className="falses-inner">
                    <span className="icon-wrapper">
                      {
                        clickedCardFalsesPositivesIsLoading ?
                          <><Icon type="loading" /> </>
                        :
                          <>
                          { currentClient.estadoFP === 'PENDIENTE' && <img src={ alertIcon } alt="" /> }
                          { currentClient.estadoFP === 'TRATADO' && <Icon type="unordered-list" /> }
                          </>
                      }
                    </span>
                    { currentClient.estadoFP === 'PENDIENTE' && <span className="label" style={{ color: '#aa2c2c' }}> { t('messages.aml.reviewFalsesPositives')}</span> }
                    { currentClient.estadoFP === 'TRATADO' && <span className="label"> { t('messages.aml.reviewFalsesPositives') }</span> }
                  </div>
                  <div className="close-overlay">
                    <Icon type="close" />
                  </div>
                </li>
              }
              <li onClick={ (e) => { e.preventDefault(); handleViewProfile(client)}}>
                <span className="icon-wrapper">
                  <Icon type="edit" /> &nbsp;
                </span>
                <span className="label">{ t('messages.aml.edit') }</span>
              </li>
              { client.type === 'Entity' && client.processUF && currentUser.cliente.modules.includes('ADMCLI') &&
                <li onClick={ (e) => { e.preventDefault(); handleViewUbos(client) } }>
                  <span className="icon-wrapper">
                    <Icon type="team" /> &nbsp;
                  </span>
                  <span className="label">{ t('messages.aml.viewFinalBeneficiaries') }</span>
                </li>
              }
            </ul>
          </div>
        </Col>
      </div>
      <div className={ 'dropdown-overlay ' + (!isAnimation && !isDropdownOpen ? 'closed':'open')}>
        <div className="read-only-overlay" />
        <div className="falses-positives">
          <ul className="falses-positives-parents">
            {
              clickedCardFalsesPositives.map((falsePositive, index) =>
                <li className={ falsePositive.status === 'TRATADO' ? 'falses-positives-parent reviewed' : 'falses-positives-parent' }>
                  { client.type === 'Entity' && client.processUF && <h3> { falsePositive.type === 'Entity' ? t("messages.aml.entity") : t('messages.aml.finalBeneficiary')} #{ index + 1 }</h3> }
                  <div className="falses-positives-parent-body">
                    <div className="avatar child-section">
                      <div className="avatar-wrapper">
                          <img src={ renderType(falsePositive.type) } alt="" />
                      </div>
                    </div>
                    <div className="info child-section">
                      <div className="info-wrapper">
                        <strong className="name">{ camelizerHelper(falsePositive.name) }</strong>
                        <div className="rut">{ falsePositive.rut }</div>
                      </div>
                    </div>
                    <div className="risk child-section">
                      <div className={ falsePositive.amlStatus === null ? 'risk-wrapper risk-GRAY' : 'risk-wrapper risk-' + falsePositive.amlStatus }>
                        <span style={{ fontWeight: falsePositive.amlStatus !== null ? 'bold' : 'normal' }}>
                          { falsePositive.amlStatus === null ? 'N/A' : t('messages.aml.risk.char.' + falsePositive.amlStatus)}
                        </span>
                      </div>
                    </div>
                    <div className={ client.type === 'Entity' ? 'is-reviewed-overlay' : 'is-reviewed-overlay person' }>
                      <div className="is-reviewed">{ t('messages.aml.reviewed') }</div>
                    </div>
                  </div>
                  <ul className="falses-positives-childs">
                    <li className="separator dismiss">
                      { currentUser.type !== 'AUDIT' &&
                        <>
                          <a className="modify-link" href="#" onClick={ (e) => handleSwitchToEdit(e, falsePositive) }>{ t('messages.aml.modifySelection') }</a> &nbsp;
                          <Popconfirm placement="top" title={ t('messages.aml.confirmDismissAll') } onConfirm={ (e) => handleDismiss(falsePositive) } okText={ t('messages.aml.yes') } cancelText={ t('messages.aml.no') }>
                            <a className="dismiss-link" href="#">{ t('messages.aml.dismissAll') }</a>
                          </Popconfirm>
                        </>
                      }

                    </li>
                    {
                      falsePositive.details.map((falsePositiveDetail, index) =>
                        <>
                          <li className="separator" />
                          <li>
                            <div className="falses-positives-child">
                              <div className="disabled-overlay" />
                              <div className="falses-positives-child-inner">
                                <h3>
                                  <div className={ 'child-risk risk-' + falsePositiveDetail.amlStatus }>
                                  { falsePositiveDetail.amlStatus === null ? 'N/A' : t('messages.aml.risk.char.' + falsePositiveDetail.amlStatus)}
                                  </div> { t('messages.aml.possibleFalsePositive') } #{ index + 1 }</h3>
                                <Row className="data">
                                  <Col span={8}>
                                    <Statistic title={ t('messages.aml.name') } value={falsePositiveDetail.nombre} />
                                  </Col>
                                  <Col span={6}>
                                    <Statistic title="DNI" value={ falsePositiveDetail.dni !== null ? falsePositiveDetail.dni : t('messages.aml.notFound') } groupSeparator="" />
                                  </Col>
                                  <Col span={4}>
                                    <Statistic title={ t('messages.aml.country') } value={falsePositiveDetail.country !== null ? falsePositiveDetail.country : t('messages.aml.notFound')} />
                                  </Col>
                                  <Col span={4}>
                                    <Statistic title={ t('messages.aml.classification') } value={ falsePositiveDetail.clasif.join(', ') } />
                                  </Col>
                                  <Col span={2}>
                                    <Statistic className="detail-profile" title={ 'Detalle' } value="" prefix={falsePositiveDetail.djId && <Button icon="profile" size="small" onClick={ () => openModalDetailFalsePositive( falsePositiveDetail.id ) }/>} />
                                  </Col>
                                </Row>
                                <Popconfirm placement="top" title={ t('messages.aml.confirmSelectionQuestion')} onConfirm={ (e) => handleChooseOne(falsePositive, falsePositiveDetail.id) } okText={ t('messages.aml.yes') } cancelText={ t('messages.aml.no') }>
                                  <div className={ falsePositiveDetail.status === 'CONFIRMADO' ? 'actions-false-positive selected' : 'actions-false-positive deselected' }>
                                    <div className="check-wrapper"><Icon type="check" /></div>
                                    { falsePositiveDetail.status !== 'CONFIRMADO' &&
                                      <div className="disabled-wrapper">
                                        { falsePositiveDetail.status === 'PENDIENTE' ?
                                          <Icon type="plus" />
                                          :
                                          <Icon type="close" />
                                        }
                                      </div>
                                    }
                                  </div>
                                </Popconfirm>
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
    </AnimateHeight>
  )
}

export default ClientCard
