import './Query2.scss'
import apiConfig from '../../config/api'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { withRouter } from 'react-router'
import { withTranslation } from 'react-i18next'
import { LocalStorageService, ReportService, SessionStorageService } from '../../services'
import { Page, PageBottomBar, PageContent, PageFooter, PageHeader, PageToolbar, PageTopBar, PdfModal } from '../../layouts/Private/components'
import { Button, Col, Form, notification, Pagination, Row, Spin } from 'antd'
import { ResultsBar, ResultsInfo, ResultsPerPageSelector, SearchCard, SearchBox2, SubclientDropdown } from './components'
import { animatePageContentPromise, getQueryFirstPagePromise, getQueryOtherPagesPromise, getQueryDetailsPromise } from './promises'
import { ProfilePage } from '../'
import sadSmileyImage from './no-results-bg.png'
import rutFormatter from '../../helpers/formatRut'
import { getSearchesPromise } from './../AdminSearch/promises'
import SearchCardHis from './components/SearchCard/SearchCardHis'
import moment from 'moment'

class Query2 extends Component {
  state = {
    breadcrumbs: this.getBreadcrumbs(),
    isAdvancedSearchFiltersVisible: false,
    isLoadingFirst: false,
    isLoadingOthers: false,
    query: '',
    queryId: '',
    queryResults: [],
    historyResults: [],
    historyResultsCurrentPage: 1,
    historyResultsFromNum: 0,
    historyResultsPerPage: 10,
    historyResultsTotalNum: -1,
    showModalPdf: false,
    pdfSource: '',
    loadingPdf: false,
    rutSearch: ''
  }

  async componentDidMount() {
    this.handlePaginationChange(1)
  }

  getBreadcrumbs() {
    const { t } = this.props

    const breadcrumbs = [
      { title: t('messages.aml.query'), icon: 'file-search', link: '/consulta2' }
    ]

    return breadcrumbs
  }

  async handleChange(e) {
    const { historyResultsTotalNum } = this.state
    const newValue = e.target.value

    //Formatear rut
    const { rut, rutFull, rutD, dv } = this.formatRut(newValue);

    await this.setState({ query: rut, rutSearch: rutFull })

    if (rutFull === undefined) {
      if (rut && rut.length > 13) {
        if (historyResultsTotalNum > -1) {
          await this.setState({
            query: '',
            queryId: '',
            queryResults: [],
          })
        }

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
    if (text !== '') {
      const { queryFiltersPersonType, queryFiltersSearchScope, queryResultsPerPage, subclientId, historyResultsPerPage } = this.state

      // const isSubclientSelected = this.validateSubclientSelection()

      await this.setState({ isLoadingFirst: true, isLoadingOthers: true, queryResults: [], query: text })

      // if (isSubclientSelected) {
      const queryFirstPage = await getQueryFirstPagePromise(text, subclientId, queryResultsPerPage, queryFiltersPersonType, queryFiltersSearchScope)
      //debugger

      let results = queryFirstPage.results
      if(queryFirstPage.size === 0) {
          results.push({formatRut: text})
      }

      await this.setState({
        queryId: queryFirstPage.searchId,
        queryResults: results,
        queryResultsCurrentPage: 1,
        isLoadingFirst: false,
        loadingPdf: true,
        totalResults: queryFirstPage.size,
        isSearch: true
      })

      if (queryFirstPage.size > 0) {
        //Mostrar pdf
        this.downloadPdf(queryFirstPage.results[0]);

        getQueryDetailsPromise(queryFirstPage.results[0].id)
      } else {
        this.handleDownloadCertificate()
      }

      this.handlePaginationChange(1, historyResultsPerPage, true)

      this.setState({ isLoadingOthers: false })
    }
  }

  async handleSearch() {
    const { rutSearch } = this.state

    if (rutSearch !== undefined) {

      //abrir automaticamente el pdf segun lo que hay en el primer item sino el que no hay resultado
      this.handleQuery(rutSearch)
    } else {
      notification['error']({
        message: 'Error',
        description: 'Rut no Valido'
      })
      return
    }
  }

  async handlePaginationChange(from, size, isSearch=false) {
    const { historyResultsPerPage } = this.state
    const fromNum = (from - 1) * historyResultsPerPage

    await animatePageContentPromise.grow(historyResultsPerPage)

    this.setState({ isLoadingOthers: true, historyResultsFromNum: fromNum, isSearch })

    let today = moment().format('DD/MM/YYYY');;
    let todayLessMonth = moment().subtract(1, 'month').format('DD/MM/YYYY');

    getSearchesPromise(fromNum, from === 1 && isSearch ? historyResultsPerPage-1 : historyResultsPerPage, {hasReport: 'S', modo: 'ONLINE', optDates: 'RANGE', fromDate: todayLessMonth, toDate: today}).then(queryResults => {
      this.setState({
        historyResults: queryResults.records,
        historyResultsCurrentPage: from,
        historyResultsTotalNum: queryResults.total,
        isLoadingOthers: false
      })
    })
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
    const { queryId } = this.state;
    //window.open(apiConfig.urlAml + '/pdfUNIQUE.pdf?bId=' + queryId)

    this.setState({
      loadingPdf: true
    })
    //Llamar endpoint y obtener base64
    ReportService.pdfToBase64('pdfSearchBase64', queryId).then(base64 => {
      this.setState({
        showModalPdf: true,
        pdfSource: base64.data,
        loadingPdf: false,
      })
    })
  }

  handleOnChangeSubclient(subclientId) {
    this.setState({ subclientId })
  }

  handleScrollToTop(duration) {
    const scrollStep = -window.scrollY / (duration / 15)
    const scrollInterval = setInterval(function () {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep)
      } else clearInterval(scrollInterval)
    }, 15)
  }

  downloadPdf(person) {
    this.setState({
      loadingPdf: true
    })
    ReportService.pdfToBase64('pdfComplianceBase64', person.id).then(base64 => {
      this.setState({
        showModalPdf: true,
        pdfSource: base64.data,
        loadingPdf: false,
        isPdfObj: false
      })
    })
  }


  async downloadPdfHis(record){
    //debugger
    if (record.certificados !== null && record.certificados.length > 0) {
      this.handlePDFReport(record.id, record.certificados[0].pdf)
    }
  }

  async handlePDFReport(searchId, pdf) {
    const obj = await ReportService.pdfToBase64Obj('/certificate', { searchId, pdf }, null, 'report.pdf')
    this.setState({
      showModalPdf: true,
      pdfSource: obj.data,
      isPdfObj: true
    })
  }

  formatRut(rut) {
    let rutVal = rutFormatter.format(rut);

    let rutFull
    let rutD;
    let dv;

    rut = rutVal;
    if (rutVal && rutVal.length > 0) {
      var isValid = rutFormatter.validate(rutVal);
      if (isValid) {
        rutFull = rutFormatter.clean(rutVal);
        rutD = rutFull.slice(0, rutFull.length - 1);
        dv = rutFull.slice(-1);
      }
    }

    return {
      rut,
      rutFull,
      rutD,
      dv,
    };
  }

  render() {
    const { currentUser, t } = this.props
    const { getFieldDecorator } = this.props.form
    const { breadcrumbs, isAdvancedSearchFiltersVisible, isLoadingFirst, isLoadingOthers, query, queryResults, historyResults, historyResultsCurrentPage, historyResultsPerPage, historyResultsTotalNum, showModalPdf, pdfSource, isPdfObj, loadingPdf, totalResults, isSearch } = this.state

    return (
      <div style={{ position: 'relative' }}>
        <PageTopBar breadcrumbs={breadcrumbs} />
        <Page>
          <PageHeader
            title={t('messages.aml.query')}
            description={t('messages.aml.queryPageDescription')}
            icon="file-search"
          >
          </PageHeader>
          <PageToolbar additionalClassName={isAdvancedSearchFiltersVisible ? 'is-advanced-search' : ''}>
            <Form.Item>
              {getFieldDecorator('query')(<SearchBox2 onChange={this.handleChange.bind(this)} onSearch={this.handleSearch.bind(this)} currentQuery={query} loading={loadingPdf} />)}
            </Form.Item>
          </PageToolbar>
          <PageContent className={(!historyResults.length && !isLoadingFirst && !isLoadingOthers && historyResultsTotalNum === -1) && 'empty'}>
            <div className="page-content-inner" style={{ marginBottom: 20 }}>
              <div className="table-headers">
                <Row>
                  <Col xs={8}>
                    {t('messages.aml.personalIdentification')}
                  </Col>
                  <Col xs={8}>
                    {t('messages.aml.date')}
                  </Col>
                  <Col xs={8}>
                    {t('messages.aml.downloadPDF')}
                  </Col>
                </Row>
              </div>
              { historyResultsCurrentPage === 1 && isSearch &&
                (
                  isLoadingFirst ?
                  <Spin size={'large'} />
                  :
                  queryResults.map((person, index) => <SearchCard key={index} person={person} currentUser={currentUser} onClick={totalResults === 0 ? this.handleDownloadCertificate.bind(this) : this.downloadPdf.bind(this)} loading={loadingPdf} />)
                )
              }
              {isLoadingOthers ?
                <Spin size={'large'} />
                :
                (historyResultsTotalNum === 0 && query.length) ?
                  <div className="zero-results">
                    <br />
                    <center style={{ height: '200px' }}><img src={sadSmileyImage} alt="" /></center>
                    <br /><br /><br /><br /><br /><br />
                    <center style={{ fontSize: '1.8em' }}>{t('messages.aml.queryNoResult')}.</center>
                    <center>{t('messages.aml.queryNoResultDownloadPDFPhrase')} :</center>
                    <br />
                    <center>
                      <Button disabled={loadingPdf} type="primary" size="large" icon={loadingPdf ? "loading" : "file-pdf"} onClick={this.handleDownloadCertificate.bind(this)}>
                        {t('messages.aml.viewPdf')}
                      </Button>
                    </center>
                  </div>
                  :
                  historyResultsTotalNum > -1 &&
                    isLoadingOthers ?
                    <Spin size={'large'} />
                    :
                    historyResults.map((person, index) => <SearchCardHis key={index} person={person} currentUser={currentUser} onClick={this.downloadPdfHis.bind(this)} />
                    )
              }

            </div>
          </PageContent>
          <PageFooter>
            {historyResultsTotalNum > 0 &&
              <Pagination
                key={Math.floor(Math.random() * 100000000)}
                current={historyResultsCurrentPage}
                onChange={this.handlePaginationChange.bind(this)}
                pageSize={historyResultsPerPage}
                total={historyResultsTotalNum}
              />
            }
          </PageFooter>
          {showModalPdf && <PdfModal closeHandler={this.closeHandlerPdfModal.bind(this)} pdfSource={pdfSource} embeded={true} isObj ={isPdfObj}/>}
        </Page>
        <PageBottomBar breadcrumbs={breadcrumbs} />
        {/* { isSelectedPersonVisible && ReactDOM.createPortal(<ProfilePage currentPerson={ selectedPerson } currentUser={ currentUser } isTransition />, document.body) } */}
      </div>
    )
  }
}

const WrappedTimeRelatedForm = Form.create({ name: 'query' })(Query2)

export default withRouter(withTranslation()(WrappedTimeRelatedForm))
