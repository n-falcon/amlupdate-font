import './Query.scss'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { withRouter } from 'react-router'
import { withTranslation } from 'react-i18next'
import { LocalStorageService, ReportService, SessionStorageService } from '../../services'
import { Page, PageBottomBar, PageContent, PageFooter, PageHeader, PageToolbar, PageTopBar, PdfModal } from '../../layouts/Private/components'
import { Button, Col, Form, notification, Pagination, Row, Spin } from 'antd'
import { AdvancedSearchFilters, AdvancedSearchToggleButton, PersonCard, ResultsBar, ResultsInfo, ResultsPerPageSelector, SearchBox, SubclientDropdown } from './components'
import { animatePageContentPromise, getQueryFirstPagePromise, getQueryOtherPagesPromise } from './promises'
import { ProfilePage } from '../'
import sadSmileyImage from './no-results-bg.png'

class Query extends Component {
  state = {
    breadcrumbs: this.getBreadcrumbs(),
    isAdvancedSearchFiltersVisible: false,
    isLoadingFirst: false,
    isLoadingOthers: false,
    isSelectedPersonVisible: false,
    query: '',
    queryFiltersPersonType: '',
    queryFiltersSearchScope: 'near',
    queryId: '',
    queryResults: [],
    queryResultsCurrentPage: 1,
    queryResultsFromNum: 1,
    queryResultsPerPage: 5,
    queryResultsTotalNum: -1,
    selectedPerson: '',
    selectedPersonId: '',
    selectedPersonName: '',
    selectedPersonRut: '',
    subclientId: '',
    showModalPdf: false,
    pdfSource: '',
    loadingPdf: false
  }

  async componentDidMount() {
    const latest_QueryId = await SessionStorageService.read('latest_QueryId')
    const queryResultsPerPage = await LocalStorageService.read('queryResultsPerPage')

    if (queryResultsPerPage !== null) {
      await this.setState({ queryResultsPerPage })
    }

    const path = window.location.pathname.split('/')

    if (path.length === 3) {
      await this.handleQuery(decodeURIComponent(path[2]))
    } else {
      if (latest_QueryId !== null && latest_QueryId !== '') {
        await this.restoreAdvancedSearchFilters()
        await this.repeatLastQuery()
      }
    }
  }

  getBreadcrumbs() {
    const { t } = this.props

    const breadcrumbs = [
      { title: t('messages.aml.query'), icon: 'file-search', link: '/consulta' }
    ]

    return breadcrumbs
  }

  async restoreAdvancedSearchFilters() {
    const filters = await JSON.parse(SessionStorageService.read('queryAdvancedSearchFilters'))

    if (filters !== null) {
      await this.setState({
        isAdvancedSearchFiltersVisible: filters.isAdvancedSearchFiltersVisible,
        queryFiltersPersonType: filters.queryFiltersPersonType,
        queryFiltersSearchScope: filters.queryFiltersSearchScope
      })

      const { isAdvancedSearchFiltersVisible } = this.state

      if (isAdvancedSearchFiltersVisible) {
        const pageToolbar = document.getElementsByClassName('page-toolbar')[0]
        pageToolbar.className = 'page-toolbar is-advanced-search'
      }
    }
  }

  async repeatLastQuery() {
    const latest_Query = SessionStorageService.read('latest_Query')
    const latest_QueryId = SessionStorageService.read('latest_QueryId')
    const latest_QueryResultsCurrentPage = SessionStorageService.read('latest_QueryResultsCurrentPage')
    const latest_QueryResultsFromNum = SessionStorageService.read('latest_QueryResultsFromNum')
    const latest_QueryResultsTotalNum = SessionStorageService.read('latest_QueryResultsTotalNum')
    const { queryResultsPerPage } = this.state
    const { form } = this.props

    form.setFieldsValue({ query: latest_Query })

    this.setState({ isLoadingOthers: true })

    const queryResults = await getQueryOtherPagesPromise(latest_QueryResultsFromNum, latest_QueryId, queryResultsPerPage)
    if(queryResults.status === 'OK') {
      await animatePageContentPromise.grow(queryResultsPerPage)

      await this.setState({
        query: latest_Query,
        queryId: latest_QueryId,
        queryResults: queryResults.results,
        queryResultsCurrentPage: parseInt(latest_QueryResultsCurrentPage),
        queryResultsFromNum: parseInt(latest_QueryResultsFromNum),
        queryResultsTotalNum: parseInt(latest_QueryResultsTotalNum)
      })
    }else if(queryResults.status === 'INFO' && queryResults.code === '01'){
      notification['error']({
        message: 'Error',
        description: 'No tiene saldo disponible.'
      })
    }else {
      notification['error']({
        message: 'Error',
        description: 'Para ejecutar una consulta.'
      })
    }
    this.setState({ isLoadingOthers: false })
  }

  async handleChange(e) {
    const { queryResultsTotalNum } = this.state
    const newValue = e.target.value

    await this.setState({ query: newValue })
    if (newValue === '') {
      if (queryResultsTotalNum > -1) {
        await this.setState({
          query: '',
          queryId: '',
          queryResults: [],
          queryResultsCurrentPage: 1,
          queryResultsTotalNum: -1
        })

        await SessionStorageService.delete('latest_Query')
        await SessionStorageService.delete('latest_QueryId')
        await SessionStorageService.delete('latest_QueryResultsCurrentPage')
        await SessionStorageService.delete('latest_QueryResultsFromNum')
        await SessionStorageService.delete('latest_QueryResultsTotalNum')

        animatePageContentPromise.shrink()
      }
    }
  }

  async handleQuery(text) {
      if(text !== '') {
        const { isAdvancedSearchFiltersVisible, queryFiltersPersonType, queryFiltersSearchScope, queryResultsPerPage, subclientId } = this.state
        await SessionStorageService.create('queryAdvancedSearchFilters', JSON.stringify({ isAdvancedSearchFiltersVisible, queryFiltersPersonType, queryFiltersSearchScope }))

        const isSubclientSelected = this.validateSubclientSelection()

        await this.setState({ isLoadingFirst: true, queryResults: [], query: text })

        if (isSubclientSelected) {
          const queryFirstPage = await getQueryFirstPagePromise(text, subclientId, queryResultsPerPage, queryFiltersPersonType, queryFiltersSearchScope)

          if(queryFirstPage.status === 'OK') {
            if (queryFirstPage.size > 0  && text.length) {
              await animatePageContentPromise.grow(queryResultsPerPage)
            } else {
              await animatePageContentPromise.shrink()
            }

            await this.setState({
              queryId: queryFirstPage.searchId,
              queryResults: queryFirstPage.results,
              queryResultsCurrentPage: 1,
              queryResultsTotalNum: queryFirstPage.size
            })

            SessionStorageService.update('latest_Query', text)
            SessionStorageService.update('latest_QueryId', queryFirstPage.searchId)
            SessionStorageService.update('latest_QueryResultsCurrentPage', 1)
            SessionStorageService.update('latest_QueryResultsFromNum', 1)
            SessionStorageService.update('latest_QueryResultsTotalNum', parseInt(queryFirstPage.size))
          }else if(queryFirstPage.status === 'INFO' && queryFirstPage.code === '01'){
            notification['error']({
              message: 'Error',
              description: 'No tiene saldo disponible.'
            })
          }else {
            notification['error']({
              message: 'Error',
              description: 'Para ejecutar una consulta.'
            })
          }
        } else {
          notification['error']({
            message: 'Error',
            description: 'Para ejecutar una consulta debes seleccionar un Subcliente.'
          })
        }

        await this.setState({ isLoadingFirst: false })
      }
  }

  async handleSearch(text) {
    if (text !== '') {
      this.handleQuery(text)
      const { history } = this.props
      return history.push('/consulta/'+encodeURIComponent(text))
    }
  }

  validateSubclientSelection() {
    const { currentUser } = this.props
    const { subclientId } = this.state
    const hasClients = currentUser.cliente.clientes.length
    const isOutsourcer = currentUser.cliente.outsourcer
    const hasSubclient = currentUser.subcliente !== null

    let isSubclientSelected = true

    if (hasClients && isOutsourcer && !hasSubclient) {
      if (subclientId === '') {
        isSubclientSelected = false
      }
    }

    return isSubclientSelected
  }

  async handlePaginationChange(from) {
    const { queryId, queryResultsPerPage } = this.state
    const fromNum = ((from - 1) * queryResultsPerPage) + 1

    await animatePageContentPromise.grow(queryResultsPerPage)

    await this.setState({ isLoadingOthers: true, queryResultsFromNum: fromNum })

    const queryResults = await getQueryOtherPagesPromise(fromNum, queryId, queryResultsPerPage)
    if(queryResults.status === 'OK') {
      await this.setState({
        queryResults: queryResults.results,
        queryResultsCurrentPage: from
      })

      SessionStorageService.update('latest_QueryResultsCurrentPage', this.state.queryResultsCurrentPage)
      SessionStorageService.update('latest_QueryResultsFromNum', parseInt(fromNum))
    }else if(queryResults.status === 'INFO' && queryResults.code === '01'){
      notification['error']({
        message: 'Error',
        description: 'No tiene saldo disponible.'
      })
    }else {
      notification['error']({
        message: 'Error',
        description: 'Para ejecutar una consulta.'
      })
    }
    this.setState({ isLoadingOthers: false })
  }

  handlePersonMouseOver(e) {
    const person = e.target

    person.className = 'person-card mouseover'

    window.setTimeout(() => {
      person.className = 'person-card'
    }, 500)
  }

  handlePersonMouseOut(e) {
    const person = e.target

    person.className = 'person-card mouseout'

    window.setTimeout(() => {
      person.className = 'person-card'
    }, 500)
  }

  closeHandlerPdfModal() {
    this.setState({
      showModalPdf: false
    })
  }

  async handleDownloadCertificate() {
    const {queryId} = this.state;
    //window.open(apiConfig.urlAml + '/pdfUNIQUE.pdf?bId=' + queryId)

    this.setState({
      loadingPdf: true
    })
    //Llamar endpoint y obtener base64
    const base64 = await ReportService.pdfToBase64('pdfSearchBase64', queryId);

    this.setState({
      showModalPdf: true,
      pdfSource: base64.data,
      loadingPdf: false
    })
  }

  handleOnChangeSubclient(subclientId) {
    this.setState({ subclientId })
  }

  async handleOnChangeResultsNum(e) {
    await this.setState({ queryResultsPerPage: e.target.value })
    await LocalStorageService.create('queryResultsPerPage', e.target.value)

    this.handlePaginationChange(1)
  }

  handleScrollToTop(duration) {
    const scrollStep = -window.scrollY / (duration / 15)
    const scrollInterval = setInterval(function(){
      if ( window.scrollY !== 0 ) {
          window.scrollBy( 0, scrollStep )
      } else clearInterval(scrollInterval)
    },15)
  }

  async handleOnClickPersonCard(selectedPerson, selectedPersonId, selectedPersonName, selectedPersonRut, selectedPersonType) {
    this.handleScrollToTop(0.5)

    await SessionStorageService.create('personId', selectedPersonId)
    await SessionStorageService.create('personName', selectedPersonName)
    await SessionStorageService.create('personRut', selectedPersonRut)
    await SessionStorageService.create('personType', selectedPersonType)

    await this.setState({ isSelectedPersonVisible: true, selectedPerson })

    const content = document.getElementById('content')

    content.className = 'leaves-screen-to-left'

    await window.setTimeout(async () => {
      const content = document.getElementById('content')

      content.classList.remove('leaves-screen-to-left')

      this.handleRedirectTo('/perfil/' + selectedPersonId)
    }, 600)
  }

  handleRedirectTo = (url) => {
    const { history } = this.props
    return history.push(url)
  }

  async handleAdvancedSearchButtonClick() {
    await this.setState(prevState => {
      return { isAdvancedSearchFiltersVisible: !prevState.isAdvancedSearchFiltersVisible }
    })
  }

  handleQueryTypeChange(e) {
    this.setState({ queryFiltersPersonType: e.target.value })
  }

  handleSearchChange(e) {
    this.setState({ queryFiltersSearchScope: e.target.value })
  }

  render() {
    const { currentUser, t } = this.props
    const { getFieldDecorator } = this.props.form
    const { breadcrumbs, isAdvancedSearchFiltersVisible, isLoadingFirst, isLoadingOthers, isSelectedPersonVisible, query, queryFiltersPersonType, queryFiltersSearchScope, queryResults, queryResultsCurrentPage, queryResultsPerPage, queryResultsTotalNum, selectedPerson, showModalPdf, pdfSource, loadingPdf } = this.state

    return (
      <div style={{ position: 'relative' }}>
        <PageTopBar breadcrumbs={ breadcrumbs } />
        <Page>
          <PageHeader
            title={ t('messages.aml.query') }
            description={ t('messages.aml.queryPageDescription') }
            icon="file-search"
            >
            {  currentUser.cliente.clientes.length>0 && currentUser.cliente.outsourcer && (currentUser.subcliente === null || (currentUser.empresas !== null && currentUser.empresas.length > 1)) &&
              <>
              { (currentUser.empresas !== null && currentUser.empresas.length > 1) ?
                <SubclientDropdown subclients={ currentUser.empresas } onChangeHandler={ this.handleOnChangeSubclient.bind(this) } />
                :
                <SubclientDropdown subclients={ currentUser.cliente.clientes } onChangeHandler={ this.handleOnChangeSubclient.bind(this) } />
              }
              </>
            }
          </PageHeader>
          <PageToolbar additionalClassName={ isAdvancedSearchFiltersVisible ? 'is-advanced-search' : '' }>
            <Form.Item>
              { getFieldDecorator('query')( <SearchBox onChange={ this.handleChange.bind(this) } onSearch={ this.handleSearch.bind(this) } currentQuery={ query } /> ) }
            </Form.Item>
            <AdvancedSearchToggleButton defaultValue={ isAdvancedSearchFiltersVisible } onChangeHandler={ this.handleAdvancedSearchButtonClick.bind(this) } />
            <AdvancedSearchFilters defaultValues={{ queryFiltersPersonType, queryFiltersSearchScope }} onChangeTypeHandler={ this.handleQueryTypeChange.bind(this) } onChangeSearchHandler={ this.handleSearchChange.bind(this) } />
          </PageToolbar>
          <PageContent className={ (!queryResults.length && !isLoadingFirst && !isLoadingOthers && queryResultsTotalNum === -1) && 'empty' }>
            <div className="page-content-inner">
              { isLoadingFirst ?
                <Spin size={ 'large' } />
                :
                (queryResultsTotalNum  === 0 && query.length) ?
                  <div className="zero-results">
                    <br />
                    <center style={{ height: '200px' }}><img src={ sadSmileyImage } alt="" /></center>
                    <br /><br /><br /><br /><br /><br />
                    <center style={{ fontSize: '1.8em' }}>{ t('messages.aml.queryNoResult') }.</center>
                    <center>{ t('messages.aml.queryNoResultDownloadPDFPhrase')} :</center>
                    <br />
                    <center>
                      <Button disabled={loadingPdf} type="primary" size="large" icon={loadingPdf ? "loading" : "file-pdf" } onClick={ this.handleDownloadCertificate.bind(this) }>
                        { t('messages.aml.viewPdf') }
                      </Button>
                    </center>
                  </div>
                  :
                    queryResultsTotalNum > -1 &&
                      <div>
                        <ResultsBar>
                          <ResultsInfo totalResultsNum={ queryResultsTotalNum } />
                          <ResultsPerPageSelector value={ queryResultsPerPage } onChange={ this.handleOnChangeResultsNum.bind(this) } />
                          <Pagination
                            current={ queryResultsCurrentPage }
                            onChange={ this.handlePaginationChange.bind(this) }
                            pageSize={ parseInt(queryResultsPerPage) }
                            total={ queryResultsTotalNum }
                            simple={ true }
                            size="small"
                            />
                        </ResultsBar>
                        <div className="table-headers">
                          <Row>
                            <Col xs={ currentUser.cliente.pais === 'CHI' ? 7 : 8 }>
                              { t('messages.aml.personalInformation') }
                            </Col>
                            <Col xs={ currentUser.cliente.pais === 'CHI' ? 7 : 8 }>
                              { t('messages.aml.compliance') }
                            </Col>
                            { currentUser.cliente.pais === 'CHI' &&
                              <Col xs={ 5 }>
                                { t('messages.aml.partnershipsOwners') }
                              </Col>
                            }
                            <Col xs={ currentUser.cliente.pais === 'CHI' ? 5 : 8 }>
                              { t('messages.aml.relevance') }
                            </Col>
                          </Row>
                        </div>
                      </div>
                }
                { isLoadingOthers ?
                  <Spin size={ 'large' } />
                  :
                  queryResults.map((person, index) => <PersonCard key={ index } className={ person.amlStatus === 'RED' ? 'risky' : 'normal' } person={ person } currentUser={ currentUser } onClick={ this.handleOnClickPersonCard.bind(this) } />)
                }
            </div>
          </PageContent>
          <PageFooter>
            { queryResultsTotalNum > 0 &&
              <Pagination
                key={ Math.floor(Math.random() * 100000000) }
                current={ queryResultsCurrentPage }
                onChange={ this.handlePaginationChange.bind(this) }
                pageSize={ parseInt(queryResultsPerPage) }
                total={ queryResultsTotalNum }
                />
            }
          </PageFooter>
          {showModalPdf && <PdfModal closeHandler={this.closeHandlerPdfModal.bind(this)} pdfSource={pdfSource} embeded={true} /> }
        </Page>
        <PageBottomBar breadcrumbs={ breadcrumbs } />
        { isSelectedPersonVisible && ReactDOM.createPortal(<ProfilePage currentPerson={ selectedPerson } currentUser={ currentUser } isTransition />, document.body) }
      </div>
    )
  }
}

const WrappedTimeRelatedForm = Form.create({ name: 'query' })(Query)

export default withRouter(withTranslation()(WrappedTimeRelatedForm))
