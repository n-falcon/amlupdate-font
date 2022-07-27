import axios from 'axios'
import './Profile.scss'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { withTranslation } from 'react-i18next'
import apiConfig from '../../config/api'
import { Col, Row, Spin } from 'antd'
import { LayoutContainer, LayoutContent, LayoutHeader, LayoutNavigation, LayoutSidebar, LayoutTopBar } from './layout'
import { AdverseMediaAndVipTabContent, FinalBeneficiariesTabContent, ControllersTabContent, InfoTabContent, OwnershipTreeTabContent, PartnershipsPresenceTabContent, PepAndSanctionsTabContent } from './components'
import { ModalClient } from '../Register/components'
import { SessionStorageService, ReportService } from '../../services'
import { getCompliancePromise, getControllersPromise, getQueryDetailsPromise } from './promises'
import { PageBottomBar, PageTopBar, PdfModal } from '../../layouts/Private/components'

class Profile extends Component {
  loadImage = false
  imgPerson = null

  state = {
    activeTab: 'nav-item-1',
    isLoading: true,
    isLoadingReport: false,
    isModalClientVisible: false,
    isTransition: false,
    personInformation: {},
    personUbosControllers: {},
    personCompliance: {loading: true},
    personId: '',
    personName: '',
    personRut: '',
    personType: '',
    addRegister: false,
    personClient: {},
    showModalPdf: false,
    pdfSource: '',
    loadingPdf: false
  }

  async componentDidMount() {
    const { isTransition } = this.props
    const personName = SessionStorageService.read('personName')
    const personRut = SessionStorageService.read('personRut')
    const personType = SessionStorageService.read('personType')

    if (personName && personRut) {
      await this.setState({ isTransition, personName, personRut, personType })
      this.getImagePerson(personRut)
    }

    if (!isTransition) {
      this.getPersonDetails()
    }
  }

  async getImagePerson(personRut) {
    if(!this.loadImage) {
      this.loadImage = true
      if(personRut !== null && personRut !== '') {
        await axios.get(apiConfig.url + '/getImageRut/' + personRut.replace('\\.','').replace('\\-','').toUpperCase(), {
          responseType: 'arraybuffer'
        })
          .then(response => {
            if(response.data !== null && response.data !== '') {
              this.imgPerson = Buffer.from(response.data, 'binary').toString('base64')
            }
          })
          .catch(error => {
            console.log('no existe')
          })
      }
    }
  }

  getBreadcrumbs() {
    const { t } = this.props

    const { personId, personName } = this.state

    const breadcrumbs = [
      { title: t('messages.aml.query'), icon: 'file-search', link: '/consulta' },
      { title: personName, icon: 'user', link: '/perfil/' + personId }
    ]

    return breadcrumbs
  }

  async getPersonDetails() {
    const { currentUser } = this.props
    const id = window.location.pathname.split('/')[2]
    const personInformation = await getQueryDetailsPromise(id)

    if(personInformation.country === 'CHIL') {
      this.getImagePerson(personInformation.rut)
    }

    let addRegister = false
    if(personInformation.hasRegistro !== null && currentUser.cliente.modules.includes('REGISTRO') && ((currentUser.cliente.oficialCto !== null && currentUser.cliente.oficialCto.id === currentUser.id) || (currentUser.modules !== null && currentUser.modules.includes('REGISTRO')))) {
      addRegister = !personInformation.hasRegistro
    }

    let personClient = { rut: personInformation.rut, nombre: personInformation.name, type: personInformation.type, pais: personInformation.country, extId: personInformation.extId }
    await this.setState({
      isLoading: false,
      personInformation,
      personId: id,
      personName: personInformation.name,
      personRut: personInformation.formatRut,
      personType: personInformation.type,
      addRegister,
      personClient
    })
    const personCompliance = await getCompliancePromise(id)
    this.setState({
      personCompliance
    })

    const personUbosControllers = await getControllersPromise(id)
    this.setState({
      personUbosControllers
    })
  }

  async handleNavigationChange(e, elementId) {
    e.preventDefault()

    const items = document.getElementsByClassName('nav-item')
    const selected = document.getElementById(elementId)

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('selected')
    }

    await this.setState({ activeTab: elementId })

    selected.className += ' selected'
  }

  handleQuery(text) {
    if (text !== '') {
      const { history } = this.props

      return history.push('/consulta/' + encodeURIComponent(text))
    }
  }


  closeHandlerPdfModal() {
    this.setState({
      showModalPdf: false
    })
  }

  async handleReport() {
    const { personId } = this.state

    if (personId !== '') {

      this.setState({
        loadingPdf: true
      })

      //await ReportService.read('/pdfCompliance.pdf', { id: personId }, null, 'report.pdf')
      const base64 = await ReportService.pdfToBase64('pdfComplianceBase64', personId);

      this.setState({
        showModalPdf: true,
        pdfSource: base64.data,
        loadingPdf: false
      })
    }
  }

  async handleAddToClient() {
    await this.setState({ isModalClientVisible: true })
  }

  handleOnOkModalClient() {
    this.setState({ isModalClientVisible: false, addRegister: false })
  }

  handleOnCancelModalClient() {
    this.setState({ isModalClientVisible: false })
  }

  render() {
    const { activeTab, addRegister, isLoading, isLoadingReport, isModalClientVisible, isTransition, personInformation, personUbosControllers, personCompliance, personName, personRut, personType, personClient, showModalPdf, pdfSource, loadingPdf } = this.state
    const { currentUser } = this.props

    return (
      <div className="profile">
        <PageTopBar breadcrumbs={ this.getBreadcrumbs() } />
      <LayoutContainer className={ isTransition ? ' is-transition' : undefined }>
        <Row>
          <Col xs={ 5 } style={{height:"100px"}}>
            <LayoutSidebar>
              <LayoutHeader personName={ personName } personRut={ personRut } personType={ personType } imgPerson={ this.imgPerson } />
              { isLoading ?
                <LayoutNavigation currentUser={currentUser} onChange={ this.handleNavigationChange.bind(this) } isLoading={ isLoading } />
                :
                <LayoutNavigation currentUser={currentUser} currentPerson={ personInformation } onChange={ this.handleNavigationChange.bind(this) } isLoading={ isLoading } />
              }
            </LayoutSidebar>
          </Col>
          <Col xs={ 19 }>
            <LayoutTopBar addRegister={ addRegister } onSearch={ this.handleQuery.bind(this) } onClickReport={ this.handleReport.bind(this) } isLoadingReport={ loadingPdf } onClickAddToClient={ this.handleAddToClient.bind(this) } />
            <LayoutContent>
              { isLoading ?
                <Spin spinning={ true } size="large" />
                :
                <div>
                  { activeTab === 'nav-item-1' && <InfoTabContent person={ personInformation } compliance={personCompliance} isChile={ currentUser.cliente.pais === 'CHI' } /> }
                  { activeTab === 'nav-item-2' && <PepAndSanctionsTabContent currentUser={currentUser} person={ personCompliance } /> }
                  { activeTab === 'nav-item-3' && <AdverseMediaAndVipTabContent currentUser={currentUser} person={ personCompliance } /> }
                  { activeTab === 'nav-item-4' && <ControllersTabContent currentUser={currentUser} personUbosControllers={ personUbosControllers } personCompliance={ personCompliance } /> }
                  { activeTab === 'nav-item-5' && <FinalBeneficiariesTabContent personUbosControllers={ personUbosControllers } /> }
                  { activeTab === 'nav-item-6' && <OwnershipTreeTabContent personUbosControllers={ personUbosControllers } /> }
                  { activeTab === 'nav-item-7' && <PartnershipsPresenceTabContent personUbosControllers={ personUbosControllers } /> }
                </div>
              }
            </LayoutContent>
          </Col>
        </Row>
      </LayoutContainer>
      {showModalPdf && <PdfModal closeHandler={this.closeHandlerPdfModal.bind(this)} pdfSource={pdfSource} embeded={true} /> }
      <PageBottomBar breadcrumbs={ this.getBreadcrumbs() } />
      { isModalClientVisible &&
        <ModalClient key={ Math.floor((Math.random() * 100) + 1) } currentUser={currentUser} client={ personClient } onOk={ this.handleOnOkModalClient.bind(this) } onCancel={ this.handleOnCancelModalClient.bind(this) } />
      }
      </div>
    )
  }
}

export default withRouter(withTranslation()(Profile))
