import './AdminRisk.scss'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { Button, Col, Icon, notification, Spin, Row, Radio, Tooltip } from 'antd'
import { getParamsPromise } from './promises'
import { ParamsService } from './services'
import { InfoIcon } from '../../layouts/Private/components'

class AdminParams extends Component {
  columnsParams = []
  widthTable = 0

  state = {
    isLoading: true,
    isSaving: false,
    basesRiesgos: {}
  }

  async componentDidMount() {
      this.getParameters()
  }

  async getParameters() {
    const parameters = await getParamsPromise()
    await this.setState({
      isLoading: false,
      basesRiesgos: parameters.basesRiesgos
    })
  }

  validateRiesgo(basesRiesgos, key) {
    return (basesRiesgos[key] !== undefined && basesRiesgos[key] !== null)
  }

  validaModulo(basesRiesgos, key) {
    if(!this.validateRiesgo(basesRiesgos, key)) {
      let elems = document.getElementsByClassName('risk-'+key)
      for(let i=0;i<elems.length;i++) {
        elems[i].classList.add('fields-required')
      }
      return false
    }
    return true
  }

  async saveParamsHandler() {
    const { basesRiesgos } = this.state
    const { t, currentUser } = this.props

    let elems = document.getElementsByClassName('riesgo-cell')
    for(let i=0;i<elems.length;i++) {
      elems[i].classList.remove('fields-required')
    }

    let fieldsRequired = false
    if(currentUser.cliente.modules.includes('PEPSAN')) {
      if(currentUser.cliente.modules.includes('PEP')) {
        fieldsRequired = !this.validaModulo(basesRiesgos, 'PEPVTO') || fieldsRequired
        fieldsRequired = !this.validaModulo(basesRiesgos, 'PEPVTN') || fieldsRequired
        fieldsRequired = !this.validaModulo(basesRiesgos, 'PEPVRO') || fieldsRequired
        fieldsRequired = !this.validaModulo(basesRiesgos, 'PEPVRN') || fieldsRequired
        if(currentUser.cliente.pais === 'CHI') {
          fieldsRequired = !this.validaModulo(basesRiesgos, 'FP') || fieldsRequired
        }
      }
      if(currentUser.cliente.modules.includes('PFA')) {
        fieldsRequired = !this.validaModulo(basesRiesgos, 'PEPI') || fieldsRequired
        fieldsRequired = !this.validaModulo(basesRiesgos, 'RCAI') || fieldsRequired
        fieldsRequired = !this.validaModulo(basesRiesgos, 'WLSI') || fieldsRequired
        fieldsRequired = !this.validaModulo(basesRiesgos, 'WLSAN') || fieldsRequired
        fieldsRequired = !this.validaModulo(basesRiesgos, 'WLOOL') || fieldsRequired
        if(currentUser.cliente.pais === 'CHI') {
          fieldsRequired = !this.validaModulo(basesRiesgos, 'UAF') || fieldsRequired
        }
      }
      if(currentUser.cliente.modules.includes('NEG')) {
        fieldsRequired = !this.validaModulo(basesRiesgos, 'NEG') || fieldsRequired
      }
    }
    if(currentUser.cliente.modules.includes('KYCAME')) {
      if(currentUser.cliente.modules.includes('PEPH')) {
        fieldsRequired = !this.validaModulo(basesRiesgos, 'PEPHTO') || fieldsRequired
        fieldsRequired = !this.validaModulo(basesRiesgos, 'PEPHTN') || fieldsRequired
        fieldsRequired = !this.validaModulo(basesRiesgos, 'PEPHRO') || fieldsRequired
        fieldsRequired = !this.validaModulo(basesRiesgos, 'PEPHRN') || fieldsRequired
      }
      if(currentUser.cliente.modules.includes('PEPC')) {
        fieldsRequired = !this.validaModulo(basesRiesgos, 'PEPC') || fieldsRequired
        fieldsRequired = !this.validaModulo(basesRiesgos, 'RCAC') || fieldsRequired
      }
      if(currentUser.cliente.modules.includes('PFA')) {
        fieldsRequired = !this.validaModulo(basesRiesgos, 'AMESI') || fieldsRequired
        fieldsRequired = !this.validaModulo(basesRiesgos, 'AMESAN') || fieldsRequired
        fieldsRequired = !this.validaModulo(basesRiesgos, 'AMEOOL') || fieldsRequired
      }
      if(currentUser.cliente.modules.includes('PERSON')) {
        fieldsRequired = !this.validaModulo(basesRiesgos, 'BPI') || fieldsRequired
      }
      if(currentUser.cliente.modules.includes('VIP')) {
        fieldsRequired = !this.validaModulo(basesRiesgos, 'VIP') || fieldsRequired
      }
      if(currentUser.cliente.modules.includes('PJUD-CIVIL')) {
        fieldsRequired = !this.validaModulo(basesRiesgos, 'PJUD-C') || fieldsRequired
      }
      if(currentUser.cliente.modules.includes('PJUD-PENAL')) {
        fieldsRequired = !this.validaModulo(basesRiesgos, 'PJUD-P') || fieldsRequired
      }
      if(currentUser.cliente.modules.includes('PJUD-LAB')) {
        fieldsRequired = !this.validaModulo(basesRiesgos, 'PJUD-LAB') || fieldsRequired
      }
      if(currentUser.cliente.modules.includes('PJUD-COB')) {
        fieldsRequired = !this.validaModulo(basesRiesgos, 'PJUD-COB') || fieldsRequired
      }
      if(currentUser.cliente.modules.includes('PJUD-APE')) {
        fieldsRequired = !this.validaModulo(basesRiesgos, 'PJUD-APE') || fieldsRequired
      }
      if(currentUser.cliente.modules.includes('PJUD-SUP')) {
        fieldsRequired = !this.validaModulo(basesRiesgos, 'PJUD-SUP') || fieldsRequired
      }
    }
    if(currentUser.cliente.modules.includes('UBOCOM')) {
      if(currentUser.cliente.modules.includes('PFA')) {
        fieldsRequired = !this.validaModulo(basesRiesgos, 'SOCBRD') || fieldsRequired
        fieldsRequired = !this.validaModulo(basesRiesgos, 'SOCSOC') || fieldsRequired
      }
    }

    if(fieldsRequired) {
      notification.warning({
        message: t('messages.aml.information'),
        description:  t('messages.aml.missingRiskLevels')
      })
    }else {
      await this.setState({ isSaving: true })
      const bodyParams = {
        riesgo: basesRiesgos
      }

      const resultSave = await ParamsService.save(bodyParams)

      await this.setState({ isSaving: false })

      if(resultSave.data) {
        notification.success({
          message: t('messages.aml.successfulOperation'),
          description: t('messages.aml.paramsSaved')
        })
      } else {
        notification.error({
          message: t('messages.aml.notifications.anErrorOcurred'),
          description:  t('messages.aml.errorSavingParams')
        })
      }
    }
  }

  handlerChangeRiesgo(key, value) {
    const { basesRiesgos } = this.state
    basesRiesgos[key] = value
    this.setState({ basesRiesgos })
  }

  getRowRisk(title, key, tooltipText, clazz = '') {
    const { t } = this.props
    const { basesRiesgos } = this.state
    return <Row>
      <Col xs={4} className={ 'cell-title ' + clazz }><InfoIcon text={ tooltipText } /> &nbsp;{ t(title) }</Col>
      <Col xs={20} className={ 'riesgo-cell risk-' + key }>
        <Radio.Group value={ basesRiesgos[key] } onChange={ (e) => this.handlerChangeRiesgo(key, e.target.value) }>
          <Radio value='GREEN' />
          <Radio value='YELLOW' />
          <Radio value='ORANGE' />
          <Radio value='RED' />
          <Radio value='BLACK' />
        </Radio.Group>
      </Col>
    </Row>
  }

  getRowTitleRisk(title) {
    const { t } = this.props
    return <>
      <h3 className="title-section">{ title }</h3>
      <Row>
        <Col xs={4} className="riesgo-cell-column">&nbsp;</Col>
        <Col xs={4} className="riesgo-cell-title">
          <div className="risk-GREEN">{ t('messages.aml.risk.N') }</div>
        </Col>
        <Col xs={4} className="riesgo-cell-title">
          <div className="risk-YELLOW">{ t('messages.aml.low') }</div>
        </Col>
        <Col xs={4} className="riesgo-cell-title">
          <div className="risk-ORANGE">{ t('messages.aml.medium') }</div>
        </Col>
        <Col xs={4} className="riesgo-cell-title">
          <div className="risk-RED">{ t('messages.aml.high') }</div>
        </Col>
        <Col xs={4} className="riesgo-cell-title">
          <div className="risk-BLACK">{ t('messages.aml.critical') }</div>
        </Col>
      </Row>
    </>
  }

  render() {
    const { t, currentUser } = this.props
    const { isLoading, isSaving } = this.state

    return (
      <div className="admin-risk">
        <div className="tools-area">
          <Button type="primary" icon={ isSaving ? 'loading': 'save' } onClick={ this.saveParamsHandler.bind(this) }>{ t('messages.aml.save') }</Button>
        </div>
        <div className="table-wrapper">
          { isLoading ?
            <Spin spinning={ true } size="large" />
            :
            <>
                { currentUser.cliente.modules.includes('PEPSAN') &&
                  <>
                    { this.getRowTitleRisk(t('messages.aml.mandatoryLists')) }
                    { currentUser.cliente.modules.includes('PEP') &&
                      <>
                        <Row>
                          <Col xs={24} className="cell-title cell-title-section">{ t('messages.aml.activePEPS') }</Col>
                        </Row>
                        { this.getRowRisk('messages.aml.holderObl', 'PEPVTO', t('messages.aml.tooltipAdminRisk1')) }
                        { this.getRowRisk('messages.aml.holderNoObl', 'PEPVTN', t('messages.aml.tooltipAdminRisk2')) }
                        { this.getRowRisk('messages.aml.relatedObl', 'PEPVRO', t('messages.aml.tooltipAdminRisk3')) }
                        { this.getRowRisk('messages.aml.relatedNoObl', 'PEPVRN', t('messages.aml.tooltipAdminRisk4')) }
                        { currentUser.cliente.pais === 'CHI' &&
                          <>
                            <Row>
                              <Col xs={24} className="cell-section-br"></Col>
                            </Row>
                            { this.getRowRisk('messages.aml.civilServant', 'FP', t('messages.aml.tooltipAdminRisk5'), 'cell-title-section') }
                          </>
                        }
                        <Row>
                          <Col xs={24} className="cell-section-br"></Col>
                        </Row>
                      </>
                    }
                    { currentUser.cliente.modules.includes('PFA') &&
                      <>
                        <Row>
                          <Col xs={24} className="cell-title cell-title-section">WatchList</Col>
                        </Row>
                        { this.getRowRisk('PEP', 'PEPI', t('messages.aml.tooltipAdminRisk6')) }
                        { this.getRowRisk('messages.aml.related', 'RCAI', t('messages.aml.tooltipAdminRisk7')) }
                        { this.getRowRisk('messages.aml.specialInterest', 'WLSI', t('messages.aml.tooltipAdminRisk18')) }
                        { this.getRowRisk('messages.aml.sanctioned', 'WLSAN', t('messages.aml.tooltipAdminRisk8')) }
                        { this.getRowRisk('messages.aml.otherLists', 'WLOOL', t('messages.aml.tooltipAdminRisk9')) }
                        { currentUser.cliente.pais === 'CHI' && this.getRowRisk('messages.aml.uafLists', 'UAF', t('messages.aml.tooltipAdminRisk10')) }
                        <Row>
                          <Col xs={24} className="cell-section-br"></Col>
                        </Row>
                      </>
                    }
                    { currentUser.cliente.modules.includes('NEG') &&
                      this.getRowRisk('messages.aml.ownLists', 'NEG', t('messages.aml.tooltipAdminRisk11'), 'cell-title-section')
                    }
                  </>
                }

                { currentUser.cliente.modules.includes('KYCAME') &&
                  <>
                    { this.getRowTitleRisk(t('messages.aml.knowYourCustomer')) }
                    { currentUser.cliente.modules.includes('PEPH') &&
                      <>
                        <Row>
                          <Col xs={24} className="cell-title cell-title-section">{ t('messages.aml.historicalPEPS') }</Col>
                        </Row>
                        { this.getRowRisk('messages.aml.holderObl', 'PEPHTO', t('messages.aml.tooltipAdminRisk12')) }
                        { this.getRowRisk('messages.aml.holderNoObl', 'PEPHTN', t('messages.aml.tooltipAdminRisk13')) }
                        { this.getRowRisk('messages.aml.relatedObl', 'PEPHRO', t('messages.aml.tooltipAdminRisk14')) }
                        { this.getRowRisk('messages.aml.relatedNoObl', 'PEPHRN', t('messages.aml.tooltipAdminRisk15')) }
                        <Row>
                          <Col xs={24} className="cell-section-br"></Col>
                        </Row>
                      </>
                    }
                    { currentUser.cliente.modules.includes('PEPC') &&
                      <>
                        <Row>
                          <Col xs={24} className="cell-title cell-title-section">{ t('messages.aml.candidates') }</Col>
                        </Row>
                        { this.getRowRisk('messages.aml.holder', 'PEPC', t('messages.aml.tooltipAdminRisk16')) }
                        { this.getRowRisk('messages.aml.related', 'RCAC', t('messages.aml.tooltipAdminRisk17')) }
                        <Row>
                          <Col xs={24} className="cell-section-br"></Col>
                        </Row>
                      </>
                    }
                    { currentUser.cliente.modules.includes('PFA') &&
                      <>
                        <Row>
                          <Col xs={24} className="cell-title cell-title-section">Adverse Media</Col>
                        </Row>
                        { this.getRowRisk('messages.aml.specialInterest', 'AMESI', t('messages.aml.tooltipAdminRisk18')) }
                        { this.getRowRisk('messages.aml.sanctioned', 'AMESAN', t('messages.aml.tooltipAdminRisk8')) }
                        { this.getRowRisk('messages.aml.otherLists', 'AMEOOL', t('messages.aml.tooltipAdminRisk9')) }
                        <Row>
                          <Col xs={24} className="cell-section-br"></Col>
                        </Row>
                      </>
                    }
                    { currentUser.cliente.modules.includes('PERSON') &&
                      this.getRowRisk('messages.aml.personsOfInterest', 'BPI', t('messages.aml.tooltipAdminRisk19'), 'cell-title-section')
                    }
                    { currentUser.cliente.modules.includes('VIP') &&
                      this.getRowRisk('VIP', 'VIP', t('messages.aml.tooltipAdminRisk20'), 'cell-title-section')
                    }
                    { (currentUser.cliente.modules.includes('PJUD-CIVIL') || currentUser.cliente.modules.includes('PJUD-PENAL')
                      || currentUser.cliente.modules.includes('PJUD-LAB') || currentUser.cliente.modules.includes('PJUD-COB')
                      || currentUser.cliente.modules.includes('PJUD-APE') || currentUser.cliente.modules.includes('PJUD-SUP')) &&
                      <>
                        <Row>
                          <Col xs={24} className="cell-title cell-title-section">PJUD</Col>
                        </Row>
                        { currentUser.cliente.modules.includes('PJUD-CIVIL') &&
                          this.getRowRisk('messages.aml.civilCauses', 'PJUD-C', t('messages.aml.tooltipAdminRisk21'))
                        }
                        { currentUser.cliente.modules.includes('PJUD-PENAL') &&
                          this.getRowRisk('messages.aml.criminalCauses', 'PJUD-P', t('messages.aml.tooltipAdminRisk21'))
                        }
                        { currentUser.cliente.modules.includes('PJUD-LAB') &&
                          this.getRowRisk('messages.aml.laborCauses', 'PJUD-LAB', t('messages.aml.tooltipAdminRisk21'))
                        }
                        { currentUser.cliente.modules.includes('PJUD-COB') &&
                          this.getRowRisk('messages.aml.collectionCauses', 'PJUD-COB', t('messages.aml.tooltipAdminRisk21'))
                        }
                        { currentUser.cliente.modules.includes('PJUD-APE') &&
                          this.getRowRisk('messages.aml.courtAppeals', 'PJUD-APE', t('messages.aml.tooltipAdminRisk21'))
                        }
                        { currentUser.cliente.modules.includes('PJUD-SUP') &&
                          this.getRowRisk('messages.aml.supremeCourt', 'PJUD-SUP', t('messages.aml.tooltipAdminRisk21'))
                        }
                        <Row>
                          <Col xs={24} className="cell-section-br"></Col>
                        </Row>
                      </>
                    }
                  </>
                }
                { currentUser.cliente.modules.includes('UBOCOM') &&
                  <>
                    { this.getRowTitleRisk('UBO & Companies') }
                    { currentUser.cliente.modules.includes('PFA') &&
                      <>
                        { this.getRowRisk('Board Member', 'SOCBRD', t('messages.aml.tooltipAdminRisk22')) }
                        { this.getRowRisk('State Owned Companies', 'SOCSOC', t('messages.aml.tooltipAdminRisk23')) }
                      </>
                    }
                  </>
                }
            </>
          }
        </div>
      </div>
    )
  }
}

export default withTranslation()(AdminParams)
