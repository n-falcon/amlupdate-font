import './Quiebras.scss'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from 'react-router'
import {  Pagination, Spin, Modal, Button} from 'antd'
import { Page, PageBottomBar, PageContent, PageFooter, PageHeader, PageTopBar } from '../../layouts/Private/components'
import { ClientCard, Content, ContentTopBar, Filters, Sidebar, TableHeaders, ModalRisk } from './components'
import { ReportService } from '../../services'
import { getClientsPromise } from './promises'

class Register extends Component {
  state = {
    breadcrumbs: this.getBreadcrumbs(),
    clients: [],
    currentPage: 1,
    filters: {},
    resultsPerPage: 10,
    isLoading: true,
    resultsTotalNum: -1,
    colors: { total: 0, red: 0, black: 0, green: 0, yellow: 0, na: 0 },
    colorsCake: { total: 0 },
    firstLoading: true,
    isModalRiskVisible: false,
    selectedRecord: {},
    grupo: null,
    category: 'CLIENTE',
    subclienteId: null
  }

  async componentDidMount() {
    const { currentUser } = this.props
    const { filters } = this.state

    filters['subclienteId'] = null
    filters['text'] = null
    filters['amlStatus'] = null
    filters['grupos'] = null
    filters['types'] = null
    filters['categories'] = null
    filters['estados'] = null
    filters['estadoMalla'] = null

    this.setState({ filters })
    if(currentUser.cliente.outsourcer && currentUser.cliente.clientes !== null && currentUser.cliente.clientes.length > 0 && currentUser.subcliente !== null) {
      this.setState({ subclienteId: currentUser.subcliente.id })
    }
    this.handleApplyFilters()
  }

  async handleApplyFilters() {
    await this.setState({ firstLoading: true })
    await this.handlePaginationChange(1)

    const { filters, colors } = this.state

    let critical = 0
    let high = 0
    let medium = 0
    let low = 0
    let na = 0

    if(filters['amlStatus'] === null || filters['amlStatus'] === undefined || filters['amlStatus'].length === 0 || filters['amlStatus'].includes('BLACK')) {
      critical = colors.black
    }
    if(filters['amlStatus'] === null || filters['amlStatus'] === undefined || filters['amlStatus'].length === 0 || filters['amlStatus'].includes('RED')) {
      high = colors.red
    }
    if(filters['amlStatus'] === null || filters['amlStatus'] === undefined || filters['amlStatus'].length === 0 || filters['amlStatus'].includes('YELLOW')) {
      medium = colors.yellow
    }
    if(filters['amlStatus'] === null || filters['amlStatus'] === undefined || filters['amlStatus'].length === 0 || filters['amlStatus'].includes('GREEN')) {
      low = colors.green
    }
    if(filters['amlStatus'] === null || filters['amlStatus'] === undefined || filters['amlStatus'].length === 0 || filters['amlStatus'].includes('NA')) {
      na = colors.na
    }
    let total = critical + high + medium + low + na
    let colorsCake = { total, critical, high, medium, low, na }

    this.setState({ colorsCake, firstLoading: false })
  }

  async handlePaginationChange(currentPage) {
    const { resultsPerPage } = this.state
    const fromNum = ((currentPage - 1) * resultsPerPage)
    await this.setState({ isLoading: true, fromNum })

    const { filters } = this.state

    const oldColors = JSON.parse(JSON.stringify(this.state.colors))

    const clients = await getClientsPromise(fromNum, resultsPerPage, filters)
    const colors = await this.renderColors(clients.filters.risk)

    await this.setState({
      isLoading: false,
      clients: clients.records,
      currentPage: currentPage,
      resultsTotalNum: clients.total,
      colors,
      groups: clients.filters.groups,
      categories: clients.filters.categories,
      filters
    })

    this.handleAnimateNumbers('animated-number-black', oldColors.black, colors.black, 650)
    this.handleAnimateNumbers('animated-number-red', oldColors.red, colors.red, 650)
    this.handleAnimateNumbers('animated-number-yellow', oldColors.yellow, colors.yellow, 650)
    this.handleAnimateNumbers('animated-number-green', oldColors.green, colors.green, 650)
    this.handleAnimateNumbers('animated-number-grey', oldColors.na, colors.na, 650)
  }

  async handleChangeFilters(filterName, filterOption, filterValue) {
    const { filters } = this.state
    const { currentUser } = this.props

    if(filterName === 'text' || filterName === 'fromDate' || filterName === 'toDate' || filterName === 'subclienteId') {
      if(filterValue) {
        filters[filterName] = filterOption
      }else {
        filters[filterName] = null
      }
    }else {
      let filterValues = filters[filterName]
      if(filterValues === null) filterValues = []

      if(filterValue) {
        if(!filterValues.includes(filterOption)) {
          filterValues.push(filterOption)
        }
      }else if(filterValues.includes(filterOption)) {
        let index = filterValues.indexOf(filterOption)

        filterValues.splice(index, 1)
      }
      filters[filterName] = filterValues
    }

    await this.setState({ filters })

    await this.handleApplyFilters()
  }

  getBreadcrumbs() {
    const { t } = this.props

    const breadcrumbs = [
      { title: t('messages.aml.quiebras'), icon: 'warning', link: '/quiebras' },
    ]

    return breadcrumbs
  }

  async renderColors(filters) {
    const colors = {
      black: 0,
      red: 0,
      yellow: 0,
      green: 0,
      na: 0,
      total: 0
    }

    if (filters.BLACK) {
      colors.black = filters.BLACK
    }

    if (filters.RED) {
      colors.red = filters.RED
    }

    if (filters.YELLOW) {
      colors.yellow = filters.YELLOW
    }

    if (filters.GREEN) {
      colors.green = filters.GREEN
    }

    if (filters.NA) {
      colors.na = filters.NA
    }
    colors.total = colors.black + colors.red + colors.yellow + colors.green + colors.na
    return colors
  }

  handleOnOkModalClient() {
    const { currentPage } = this.state
    this.handlePaginationChange(currentPage)
  }

  handleOnCancelModalRisk() {
    this.setState({ isModalRiskVisible: false })
  }

  handleModalRisk(record) {
    this.setState({ isModalRiskVisible: true, selectedRecord: record })
  }

  handleOnChangeGrupo = (grupo) => {
    this.setState({ grupo: grupo })
  }

  async handleExcelReport() {
    await this.setState({ isLoadingReport: true })
    const { filters } = this.state
    await ReportService.read('/excelQuiebras', filters, null, 'quiebras.xlsx')
    await this.setState({ isLoadingReport: false })
  }

  handleAnimateNumbers(id, start, end, duration) {
    // assumes integer values for start and end
    var obj = document.getElementById(id);
    var range = end - start;
    // no timer shorter than 50ms (not really visible any way)
    var minTimer = 50;
    // calc step time to show all interediate values
    var stepTime = Math.abs(Math.floor(duration / range));

    // never go below minTimer
    stepTime = Math.max(stepTime, minTimer);

    // get current time and calculate desired end time
    var startTime = new Date().getTime();
    var endTime = startTime + duration;
    var timer;

    function run() {
        var now = new Date().getTime();
        var remaining = Math.max((endTime - now) / duration, 0);
        var value = Math.round(end - (remaining * range));
        obj.innerHTML = value;
        if (value === end) {
          clearInterval(timer);
        }
    }

    timer = setInterval(run, stepTime);
    run();
  }

  handleOnChangeCategory(category) {
    this.setState({ category })
  }

  handleOnChangeSubcliente(subclienteId) {
    this.setState({ subclienteId })
  }

  render() {
    const { t, currentUser } = this.props
    const { breadcrumbs, clients, currentPage, firstLoading, resultsPerPage, resultsTotalNum, colors, colorsCake, isLoading, filters, groups, categories, isModalRiskVisible, selectedRecord } = this.state

    return (
      <div className="quiebras">
        <PageTopBar breadcrumbs={ breadcrumbs } />
        <Page>
          <PageHeader
            title={ t('messages.aml.quiebras') }
            description="Personas y empresas en monitoreo de Quiebras"
            icon="warning"
            >
            <div className="btn-actions">
              <Button onClick={ this.handleExcelReport.bind(this) } type="primary" icon="file-excel">{ t('messages.aml.export') }</Button>
            </div>
          </PageHeader>
          <PageContent>
            <Sidebar>
              <Filters currentUser={ currentUser } filters={ filters } groups={ groups } categories={ categories } onChangeFilters={ this.handleChangeFilters.bind(this) } />
            </Sidebar>
            <Content>
              <ContentTopBar isLoading={ isLoading } firstLoading={ firstLoading } colors={ colors } colorsCake={ colorsCake } filters={ filters } onChangeFilters={ this.handleChangeFilters.bind(this) } />
              { isLoading ?
                <div className="spinner-overlay">
                  <Spin spinning={ true } size="large" />
                </div>
                :
                <>
                  <TableHeaders />
                  <div className="items">
                    { clients.map(client => <ClientCard currentUser={ currentUser } client={ client } handleModalRisk={ this.handleModalRisk.bind(this) } />) }
                  </div>
                </>
              }
              <PageFooter>
                <Pagination current={ currentPage } total={ resultsTotalNum } onChange={ this.handlePaginationChange.bind(this) } pageSize={ resultsPerPage } />
              </PageFooter>
            </Content>
            <div style={{ clear: 'both' }} />
          </PageContent>
        </Page>
        <PageBottomBar breadcrumbs={ breadcrumbs } />

        { isModalRiskVisible &&
          <Modal
            title={ t('messages.aml.risk') }
            visible={ true }
            onCancel={ this.handleOnCancelModalRisk.bind(this) }
            width={ 900 }
            footer={ [
              <Button onClick={ this.handleOnCancelModalRisk.bind(this) }>{ t('messages.aml.btnClose') }</Button>
            ] }
            >
            <ModalRisk key={ Math.floor((Math.random() * 100) + 1) } record={ selectedRecord }/>
          </Modal>
        }
      </div>
    )
  }
}
export default withTranslation()(withRouter(Register))
