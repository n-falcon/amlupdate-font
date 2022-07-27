import './Register.scss'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from 'react-router'
import Animate from 'rc-animate';
import apiConfig from '../../config/api'
import { Col, Row, Pagination, Spin, Modal, Button, List, Form, Select, Switch, Upload, Icon, notification, Table, Checkbox, Dropdown, Input, Tooltip, Menu } from 'antd'
import { Page, PageBottomBar, PageContent, PageFooter, PageHeader, PageTopBar } from '../../layouts/Private/components'
import { ClientCard, Content, ContentTopBar, Filters, Sidebar, TableHeaders, ModalClient, ModalRisk, ModalUbos, AdvancedTabs, ModalRequestOpt, ModalClientCard } from './components'
import { ReportService } from '../../services'
import { getClientsPromise, uploadClientsPromise,bajaClientesPromise, uploadRelatedPromise } from './promises'
import { getParamsPromise } from '../AdminParams/promises'
import { getUsersByClientPromise } from '../../promises'
import uploadIcon from '../Batch/components/ModalAddBatchFile/drag-icon.png'
import excelFileIcon from './excel-file.png'
import ga from './ga'
import moment from 'moment'
import personIcon from '../Query/components/PersonCard/person-icon.png'
import entityIcon from '../Query/components/PersonCard/entity-icon.png'

const { Dragger } = Upload

class Register extends Component {
  state = {
    breadcrumbs: this.getBreadcrumbs(),
    clients: [],
    currentPage: 1,
    filters: {},
    resultsPerPage: 10,
    isLoading: true,
    resultsTotalNum: -1,
    colors: { total: 0, black: 0, red: 0, orange: 0, yellow: 0, green: 0,  na: 0 },
    colorsCake: { total: 0 },
    firstLoading: true,
    isModalClientVisible: false,
    isModalRiskVisible: false,
    isModalUbosVisible: false,
    isModalUploadVisible: false,
    isModalUploadInactiveVisible: false,
    isModalReportVisible: false,
    selectedRecord: {},
    uploading: false,
    uploaded: false,
    fileList: [],
    parametersClient: null,
    formularioInterno: true,
    processUF: false,
    resultsUpload: [],
    userAsig: null,
    users: [],
    filterFecAlerta: null,
    grupo: null,
    category: 'CLIENTE',
    subclienteId: null,
    filterFalsosPositivos: null,
    errorsUpload: null,
    selectedItem: [],
    chkAll: false,
    moreStyle: false,
    isAdvancedSearchVisible: false,
    rut: null,
    recordsAction: [],
    actionType: null,
    itemTable: null
  }

  async componentDidMount() {
    const { currentUser } = this.props

    const query = new URLSearchParams(this.props.location.search)
    const filterFecAlerta = query.get('fa')

    const { filters } = this.state

    filters['subclienteId'] = null
    filters['text'] = null
    filters['amlStatus'] = null
    filters['grupos'] = null
    filters['types'] = null
    filters['categories'] = null
    filters['estados'] = ['ACTIVE']
    filters['estadoMalla'] = null
    filters['estadoFormulario'] = null
    filters['estadoPlazo'] = null
    filters['estadoVerif'] = null
    filters['filterFecAlerta'] = filterFecAlerta
    filters['fecAlerta'] = filterFecAlerta
    filters['filterFalsosPositivos'] = null
    filters['falsosPositivos'] = false

    const parametersClient = await getParamsPromise()
    const users = await getUsersByClientPromise()
    this.setState({ filters, userAsig: currentUser.id, users, parametersClient })
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
    let n = 0
    let na = 0

    if(filters['amlStatus'] === null || filters['amlStatus'] === undefined || filters['amlStatus'].length === 0 || filters['amlStatus'].includes('BLACK')) {
      critical = colors.black
    }
    if(filters['amlStatus'] === null || filters['amlStatus'] === undefined || filters['amlStatus'].length === 0 || filters['amlStatus'].includes('RED')) {
      high = colors.red
    }
    if(filters['amlStatus'] === null || filters['amlStatus'] === undefined || filters['amlStatus'].length === 0 || filters['amlStatus'].includes('ORANGE')) {
      medium = colors.orange
    }
    if(filters['amlStatus'] === null || filters['amlStatus'] === undefined || filters['amlStatus'].length === 0 || filters['amlStatus'].includes('YELLOW')) {
      low = colors.yellow
    }
    if(filters['amlStatus'] === null || filters['amlStatus'] === undefined || filters['amlStatus'].length === 0 || filters['amlStatus'].includes('GREEN')) {
      n = colors.green
    }
    if(filters['amlStatus'] === null || filters['amlStatus'] === undefined || filters['amlStatus'].length === 0 || filters['amlStatus'].includes('NA')) {
      na = colors.na
    }
    let total = critical + high + medium + low + n + na
    let colorsCake = { total, critical, high, medium, low, n, na }

    this.setState({ colorsCake, firstLoading: false })
  }

  async handlePaginationChange(currentPage) {
    const { resultsPerPage } = this.state
    const fromNum = ((currentPage - 1) * resultsPerPage)
    await this.setState({ isLoading: true, fromNum, isModalClientVisible: false })

    const { filters } = this.state

    const oldColors = JSON.parse(JSON.stringify(this.state.colors))

    const clients = await getClientsPromise(fromNum, resultsPerPage, filters)

    const colors = await this.renderColors(clients.filters.risk)

    filters['filterFalsosPositivos'] = clients.filters.pendingReview

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
    this.handleAnimateNumbers('animated-number-orange', oldColors.orange, colors.orange, 650)
    this.handleAnimateNumbers('animated-number-green', oldColors.green, colors.green, 650)
    this.handleAnimateNumbers('animated-number-grey', oldColors.na, colors.na, 650)
  }

  async handleChangeFilters(filterName, filterOption, filterValue) {
    const { filters } = this.state
    const { currentUser } = this.props

    if(filterName === 'text' || filterName === 'fromDate' || filterName === 'toDate' || filterName === 'fecAlerta' || filterName === 'falsosPositivos' || filterName === 'subclienteId') {
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

    if (currentUser.cliente.abreviado !== 'demostraciones' && currentUser.cliente.abreviado !== 'demo') {
      await ga.saveRiskChanges(filterName, filterOption, filterValue)
      await ga.saveLeftFiltersChanges(filterName, filterOption, filterValue)
    }
  }

  getBreadcrumbs() {
    const { t } = this.props

    const breadcrumbs = [
      { title: t('messages.aml.register'), icon: 'user-add', link: '/registro' },
    ]

    return breadcrumbs
  }

  async renderColors(filters) {
    const colors = {
      black: 0,
      red: 0,
      yellow: 0,
      orange: 0,
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

    if (filters.ORANGE) {
      colors.orange = filters.ORANGE
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
    colors.total = colors.black + colors.red + colors.orange + colors.yellow + colors.green + colors.na
    return colors
  }

  handleOnOkModalClient() {
    this.setState({ isModalClientVisible: false })
    const { currentPage } = this.state
    this.handlePaginationChange(currentPage)
  }

  handleOnCancelModalClient() {
    this.setState({ isModalClientVisible: false })
  }

  handleViewProfile = (record) => {
    this.setState({ isModalClientVisible: true, selectedRecord: record })
  }

  handleNewProfile = () => {
    this.setState({ isModalClientVisible: true, selectedRecord: {} })
  }

  handleOnCancelModalUbos() {
    this.setState({ isModalUbosVisible: false })
    //const { currentPage } = this.state
    //this.handlePaginationChange(currentPage)
  }

  handleViewUbos = (record) => {
    this.setState({ isModalUbosVisible: true, selectedRecord: record })
  }

  handleOnCancelModalRisk() {
    this.setState({ isModalRiskVisible: false })
  }

  handleModalRisk(record) {
    this.setState({ isModalRiskVisible: true, selectedRecord: record })
  }

  handleUploadBatch = () => {
    this.setState({ isModalUploadVisible: true })
  }

  handleUploadBatchInactive = () => {
    this.setState({ isModalUploadInactiveVisible: true })
  }

  handleUploadRelated = () => {
    this.setState({ isModalUploadRelatedVisible: true })
  }

  handleOnCancelModalUploadRelated() {
    this.setState({ isModalUploadRelatedVisible: false, uploading: false, uploaded: false })
  }


  handleOnCancelModalUpload() {
    this.setState({ isModalUploadVisible: false, uploading: false, uploaded: false })
  }

  handleOnCancelModalUploadInactive() {
    this.setState({ isModalUploadInactiveVisible: false, uploading: false, uploaded: false })
  }


  handleUploadClient = () => {
    const { fileList, userAsig, subclienteId, category, grupo, parametersClient } = this.state
    const { t } = this.props

    if(userAsig === null) {
      notification.error({
        message: 'Error',
        description: t('messages.aml.youMustSelectAUser')
      })
      return
    }
    if(category === null) {
      notification.error({
        message: 'Error',
        description: t('messages.aml.youMustSelectACategory')
      })
      return
    }

    if(parametersClient.grupos.length > 1 && grupo === null) {
      notification.error({
        message: 'Error',
        description: t('messages.aml.youMustSelectAGroup')
      })
      return
    }
    if(fileList.length === 0) {
      notification.error({
        message: 'Error',
        description: t('messages.aml.youMustSelectAFile')
      })
      return
    }
    const formData = new FormData()
    fileList.forEach(file => {
      formData.append('file', file)
    })
    formData.append("userAsigned", userAsig)
    formData.append("category", category)
    if(grupo !== null) {
      formData.append("grupo", grupo)
    }
    if(subclienteId !== null) {
      formData.append("subclienteId", subclienteId)
    }
    formData.append("processUF", this.state.processUF)
    formData.append("formularioInterno", this.state.formularioInterno)

    this.setState({
      uploading: true
    })

    uploadClientsPromise(formData)
    .then(results => {
      if(results.status === 'OK') {
        let resultsUpload = []
        for(let key in results.result) {
          let line = ""
          if(key === "OK") line = t('messages.aml.loadedEntities') + ": "
			    else if(key === "E01") line = t('messages.aml.entitiesExists') + ": "
          else line = t('messages.aml.recordsWithErrors') + ': '
		      line += results.result[key]

          resultsUpload.push(line)
        }

        this.setState({ resultsUpload, uploading: false, uploaded: true, fileList: [], errorsUpload: results.errors })
        const { currentPage } = this.state
        this.handlePaginationChange(currentPage)
      }else {
        notification.error({
          message: 'Error',
          description: results.message
        })
      }
    })
  }

  handleUploadRelatedFile = () => {
    const { fileList, userAsig, subclienteId, category, grupo, parametersClient } = this.state
    const { t } = this.props

    if(fileList.length === 0) {
      notification.error({
        message: 'Error',
        description: t('messages.aml.youMustSelectAFile')
      })
      return
    }
    const formData = new FormData()
    fileList.forEach(file => {
      formData.append('file', file)
    })

    this.setState({
      uploading: true
    })

    uploadRelatedPromise(formData)
    .then(results => {
      if((results.status === "OK")) {
        let resultsUpload = []
        for(let key in results.result) {
          let line = ""
            if(key === "OK") line = t('messages.aml.updatedRegisters') + ": "
              else if(key === "E01") line = t('messages.aml.entitiesDontExists') +":"
              else line = t('messages.aml.recordsWithErrors')
              line += results.result[key]
              resultsUpload.push(line)
          }
        this.setState({ resultsUpload, uploading: false, uploaded: true, fileList: [], errorsUpload: results.errors })
        const { currentPage } = this.state
        this.handlePaginationChange(currentPage)
      }
      else {
        this.setState({ uploading: false, uploaded: false, errorsUpload: results.errors })
        notification.error({
          message: 'Error',
          description: results.message
        })
      }
    })
  }



  handleUploadClientInactive = () => {
    const { fileList, userAsig, subclienteId, category, grupo, parametersClient } = this.state
    const { t } = this.props

    if(fileList.length === 0) {
      notification.error({
        message: 'Error',
        description: t('messages.aml.youMustSelectAFile')
      })
      return
    }
    const formData = new FormData()
    fileList.forEach(file => {
      formData.append('file', file)
    })

    this.setState({
      uploading: true
    })

    bajaClientesPromise(formData)
    .then(results => {
      if((results.status === 'OK')) {
        let resultsUpload = []
        for(let key in results.result) {
          let line = ""
          if(key === "OK") line = t('messages.aml.inactiveEntities') + ": "
			    else if(key === "E01") line = t('messages.aml.entitiesDontExists') +": "
          else line = t('messages.aml.recordsWithErrors')
		      line += results.result[key]

          resultsUpload.push(line)
        }

        this.setState({ resultsUpload, uploading: false, uploaded: true, fileList: [], errorsUpload: results.errors })
        const { currentPage } = this.state
        this.handlePaginationChange(currentPage)
      }
      else {
        this.setState({ uploading: false, uploaded: false, errorsUpload: results.errors })
        notification.error({
          message: 'Error',
          description: results.message
        })
      }
    })
  }

  handleOnChangeSendMail = (sendMail) => {
    this.setState({ formularioInterno: !sendMail })
  }

  handleOnChangeUF = (processUF) => {
    this.setState({ processUF })
    if(!processUF) {
      this.setState({ formularioInterno: true })
    }
  }

  handleOnChangeGrupo = (grupo) => {
    this.setState({ grupo: grupo })
  }

  getUsersAsig(users) {
    const { currentUser } = this.props
    let _users = []
    for(let i=0;i<users.length;i++) {
      if((users[i].type === 'ADMIN' || users[i].type === 'SADMIN' || users[i].type === 'USUARIO') && ((currentUser.cliente.oficialCto !== null && currentUser.cliente.oficialCto.id === users[i].id) || (users[i].modules !== null && users[i].modules.includes('REGISTRO')))) {
        _users.push(<Select.Option value={ users[i].id }>{ users[i].name }</Select.Option>)
      }
    }
    return _users
  }

  handleReport() {
    this.setState({ isModalReportVisible: true })
  }

  handleOnCancelModalReport() {
    this.setState({ isModalReportVisible: false })
  }

  async handleExcelReport() {
    this.setState({ isLoadingExport: true })
    const { filters } = this.state
    await ReportService.read('/excelClientes', filters, null, 'registros.xlsx')
    await this.setState({ isLoadingExport: false })
  }

  async handleRiskReport() {
    this.setState({ isLoadingRisk: true })
    const { filters } = this.state
    await ReportService.read('/excelRisk', filters, null, 'risks.xlsx')
    await this.setState({ isLoadingRisk: false })
  }

  async handlePDFReport() {
    await this.setState({ isLoadingCertificates: true })
    const { filters } = this.state
    await ReportService.read('/pdfClientes.pdf', filters, null, 'certificados.zip')
    await this.setState({ isLoadingCertificates: false })
  }

  async handleBFReport() {
    this.setState({ isLoadingBfReport: true })
    const { filters } = this.state
    await ReportService.read('/ubosClientes', filters, null, 'Beneficiarios_Finales.csv')
    await this.setState({ isLoadingBfReport: false })
  }

  async handleMallasPropiedadReport() {
    await this.setState({ isLoadingMp: true })
    const { filters } = this.state
    await ReportService.read('/mallasClientes', filters, null, 'propietarios.csv')
    await this.setState({ isLoadingMp: false })
  }

  async handleFormsReport() {
    this.setState({ isLoadingFormReport: true })
    const { filters } = this.state
    await ReportService.read('/formsClientes', filters, null, 'formularios.zip')
    this.setState({ isLoadingFormReport: false })
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
      if(obj){

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
  }

  handleOnChangeAsignedUser(user) {
    this.setState({ userAsig: user })
  }

  handleOnChangeCategory(category) {
    this.setState({ category })
  }

  handleOnChangeSubcliente(subclienteId) {
    this.setState({ subclienteId })
  }

  downloadPlantilla(type) {
    if(type === 'records') {
      window.open(apiConfig.url + '/../templates/carga_registro.xlsx')
    }else if(type === 'related') {
      window.open(apiConfig.url + '/../templates/carga_registro_relacionados.xlsx')
    }
  }

  downloadErrors() {
    const { errorsUpload } = this.state
    ReportService.read('/inputFile', {id: 'tmp/' + errorsUpload}, null, 'reporte.xlsx')
  }

  uploadRelated() {
    const { errorsUpload } = this.state
    ReportService.read('/inputFile', {id: 'tmp/' + errorsUpload}, null, 'reporte.xlsx')
  }

  render() {
    const { t, currentUser } = this.props
    const { breadcrumbs,
            clients,
            currentPage,
            firstLoading,
            resultsPerPage,
            resultsTotalNum,
            colors,
            colorsCake,
            isLoading,
            filters,
            groups,
            categories,
            isModalRiskVisible,
            selectedRecord,
            isModalUbosVisible,
            isModalClientVisible,
            isModalUploadVisible,
            isModalUploadInactiveVisible,
            isModalUploadRelatedVisible,
            fileList,
            processUF,
            formularioInterno,
            resultsUpload,
            uploaded,
            uploading,
            userAsig,
            users,
            parametersClient,
            isModalReportVisible,
            errorsUpload,
            isLoadingExport,
            isLoadingRisk,
            isLoadingCertificates,
            isLoadingBfReport,
            isLoadingMp,
            isLoadingFormReport,
            selectedItem,
            chkAll,
            isAdvancedSearchVisible,
            recordsAction,
            actionType,
            itemTable} = this.state


    const propsUpload = {
      accept: ".xlsx",
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file)
          const newFileList = state.fileList.slice()
          newFileList.splice(index, 1)
          return {
            fileList: newFileList
          }
        })
      },
      beforeUpload: file => {
        if(this.state.fileList.length === 0) {
          this.setState(state => ({
            fileList: [...state.fileList, file],
          }))
        }

        return false
      },
      multiple: false,
      fileList,
    }

    const renderType = (type) => {
      if (type === 'Person'){
        return personIcon
      }else if (type === 'Entity'){
        return entityIcon
      }
    }

    const handleSelectDeselectAll = (e) => {
      this.setState({chkAll: e.target.checked})
      if(!e.target.checked){
        this.setState({selectedItem: []})
      }else{
        let itemsPerPage = [];
        clients.map(i => itemsPerPage.push({id: i.id, nombre: i.nombre}))
        this.setState({selectedItem: itemsPerPage});
      }
    }

    const cbFilters = (objFilters) => {
      this.setState({filters: objFilters})
      this.handlePaginationChange(1, objFilters);
    };

    const getTableColumns = () => {
      let columns = [
              {
          title: () => (
            <div>
              <Checkbox onChange={handleSelectDeselectAll} checked={chkAll}/>
            </div>
          ),
          width: '5%',
          align: 'center',
          render: (record) => {
            return <Checkbox
              checked={selectedItem.filter(i => i.id === record.id).length > 0 || chkAll}
              onChange={(e) => {
                this.setState({chkAll: false})
                let checkedItem = [...selectedItem]
                if(e.target.checked) {
                  checkedItem.push({id: record.id, name: record.nombre})
                }else{
                  checkedItem = checkedItem.filter(i => i.id !== record.id)
                }
                this.setState({selectedItem: checkedItem})
              }}
            />
          }
        },
        {
          title: 'Tipo',
          className: "text-center-type-onb",
          width: '5%',
          render: (item) => {
            return <Row>
                  <Col span={24} style={{textAlign: 'center', fontSize: '5px'}}>
                    <img src={ renderType(item.type) } alt="" width="40"/>
                  </Col>
                </Row>
          }
          // sorter: (a, b) => a.creationDate - b.creationDate,
        },
        {
          title: 'Nombre/Rut',
          width: '16%',
          render: (record => {
            return <>
            <div className="name-col-table">
              <Button
                type="link"
                onClick={ () => this.setState({itemTable: record}) }
              >
                {record.nombre}
              </Button>
              <Button
                type="link"
                onClick={ () => this.setState({itemTable: record}) }
                >
                  {record.rut}
                </Button>
            </div>
            </>
          })
        },
        {
          title: 'Fecha de actualización',
          width: '10%',
          dataIndex:'ficha.declDate',
          render: (text => {
            return text !== null ? moment(text).format('DD/MM/YYYY') : "Sin actualizar"
          }),
        },
        {
          title: "Cumplimiento",
          className: 'column-cumplimiento',
          children: [
            {
              title: 'Listas Obligatorias',
              key: Math.random(),
              dataIndex: 'compliance',
              width: '10%',
              align: 'center',
              render: (text => {
                return <div className="item-risk-align">
                      <div className={ 'child-risk-onb-circle risk-' + (text && text.PEPSAN && text.PEPSAN.color ? text.PEPSAN.color : "GRAY") }>
                        {text && text.PEPSAN && text.PEPSAN.bases ? text.PEPSAN.bases.length : "n/a"}
                      </div>
                    </div>
              }),
            },
            {
              title: 'KYC',
              key: Math.random(),
              dataIndex: 'compliance',
              width: '5%',
              align: 'center',
              render: (text => {
                return <div className="item-risk-align">
                      <div className={ 'child-risk-onb-circle risk-' + (text && text.KYCAME && text.KYCAME.color ? text.KYCAME.color : "GRAY") }>
                        {text && text.KYCAME && text.KYCAME.bases ? text.KYCAME.bases.length : "n/a"}
                      </div>
                    </div>
              }),
            },
            {
              title: 'UBO & Companies',
              key: Math.random(),
              dataIndex: 'compliance',
              width: '15%',
              align: 'center',
              render: ((text, record) => {
                return <Row>
                        <Col span={8}>
                            <div className={ 'child-risk-onb-circle risk-' + (text && text.UBOCOM && text.UBOCOM.color ? text.UBOCOM.color : "GRAY") }>
                              {text && text.UBOCOM && text.UBOCOM.bases ? text.UBOCOM.bases.length : "n/a"}
                            </div>
                        </Col>
                        { record.type === 'Entity' && record.processUF && currentUser.cliente.modules.includes('ADMCLI') &&
                          <Col span={8}>
                            <div style={{cursor: 'pointer'}}>
                            <Tooltip title="Ver beneficiarios finales">
                              <Icon type="team" style={{fontSize: '20px'}} onClick={() => {this.handleViewUbos(record)}}/>
                            </Tooltip>
                            </div >
                          </Col>
                        }
                        {record.nroRelated !== null &&
                          <Col span={8}>
                            <Tooltip title="Relacionados">
                              <div className="number-register-wrapper">
                                  R {record.nroRelated}
                              </div>
                            </Tooltip>
                          </Col>
                        }
                      </Row>
              }),
            },
          ],
        },
        {
          title: () => (
            <div className="">
              Riesgo AML
            </div>
          ),
          className:"onbRiskTitle",
          width: '10%',
          dataIndex: 'amlStatus',
          render: ((text, record) => {
            return  <div className={ 'child-risk-onb risk-' + (text !== null ? text : 'GRAY') }
                        onClick={() => {this.handleModalRisk(record)}}
                        style={{cursor:'pointer'}}
                    >
                      { text === null && 'N/A'}
                      { text === 'BLACK' && 'Crítico' }
                      { text === 'RED' && 'Alto' }
                      { text === 'ORANGE' && 'Medio' }
                      { text === 'YELLOW' && 'Bajo' }
                      { text === 'GREEN' && 'No Posee' }
            </div>
          }),
        },
        {
          title: () => (
            <div className="">
              Riesgo Asignado
            </div>
          ),
          className:"onbRiskTitle",
          width: '10%',
          dataIndex: 'risk',
          render: (text => {
            return  <div className={ 'child-risk-onb risk-' + (text !== null ? text : 'GRAY') }>
								{ text === null && 'N/A'}
								{ text === 'BLACK' && 'Crítico' }
								{ text === 'RED' && 'Alto' }
								{ text === 'ORANGE' && 'Medio' }
								{ text === 'YELLOW' && 'Bajo' }
								{ text === 'GREEN' && 'No Posee' }
							</div>
          }),
        },
        {
          title: () => <div className="image"></div>,
          className:"onbLogoTitle",
          width: '7%',
          render: ((record) => {
            return(
              <div className="ellipsis-icon-onb">
                <Dropdown overlay={() => menu(record, 'ellipsis')}>
                  <Icon type="more"
                      style={{fontSize: '30px', color: '#FE9F0C'}}
                  />
                </Dropdown>
              </div>
            )
          }
          )
        }
      ]
      // const handleShowIndexCard = (record) => {
      //   setItemTable(record)
      // }
      return columns
    }

    const menu = (record, menuType) => {
      if(menuType === 'ellipsis'){
        return (
            <Menu>
              {currentUser.cliente.modules.includes('ONBOARDING') &&
                <Menu.Item>
                  <a onClick={() => {
                    this.setState({actionType: "cronForm"})
                    handleAction(record)
                  }}>
                    <Icon type="clock-circle" /> Actualizar periódicamente el formulario OnBoarding
                  </a>
                </Menu.Item>
              }
              {currentUser.cliente.modules.includes('ONBOARDING') &&
                <Menu.Item onClick={() => {
                  this.setState({actionType: "newRequest"})
                  handleAction(record)
                }}>
                    <Icon type="mail" /> Enviar formulario de Onboarding
                </Menu.Item>
              }
              {currentUser.cliente.modules.includes('QUIEBRA') &&
                <Menu.Item onClick={() => {
                  this.setState({actionType: "brokeRegister"})
                  handleAction(record)}}
                >
                  <Icon type="fall" /> Activar registro de quiebras
                </Menu.Item>
              }
              {record && record.type === 'Entity' && currentUser.cliente.modules.includes('ADMCLI') &&
                <Menu.Item onClick={() => {
                  this.setState({actionType: "uboFinder"})
                  handleAction(record)}}>
                  <Icon type="user" />Investigar UBOs
                </Menu.Item>
              }
              {record && record.type === 'Entity' && currentUser.cliente.modules.includes('ADMCLI') &&
                <Menu.Item onClick={() => {
                  this.setState({actionType: "form57"})
                  handleAction(record)}}>
                  <Icon type="mail" theme="filled"/> Enviar formulario de Circular 57
                </Menu.Item>
              }
            </Menu>
          );
        }else if (menuType === 'action'){
          return (
            <Menu>
              {currentUser.cliente.modules.includes('ONBOARDING') &&
                <Menu.Item onClick={() => {
                  this.setState({actionType: "cronForm"})
                  handleAction(record)}}
                >
                    <Icon type="clock-circle" /> Actualizar periódicamente el formulario OnBoarding
                </Menu.Item>
              }
              {currentUser.cliente.modules.includes('ONBOARDING') &&
                <Menu.Item onClick={() => {
                  this.setState({actionType: "newRequest"})
                  handleAction(record)}}
                >
                    <Icon type="mail" /> Enviar formulario de Onboarding
                </Menu.Item>
              }
              {currentUser.cliente.modules.includes('QUIEBRA') &&
                <Menu.Item onClick={() => {
                  this.setState({actionType: "brokeRegister"})
                  handleAction(record)}}
                >
                  <Icon type="fall" /> Activar registro de quiebras
                </Menu.Item>
              }
              {currentUser.cliente.modules.includes('ADMCLI') &&
                <Menu.Item onClick={() => {
                  this.setState({actionType: "uboFinder"})
                  handleAction(record)}}
                >
                  <Icon type="user" />Investigar UBOs
                </Menu.Item>
              }
              {currentUser.cliente.modules.includes('ADMCLI') &&
                <Menu.Item onClick={() => {
                  this.setState({actionType: "form57"})
                  handleAction(record)}}
                >
                  <Icon type="mail" theme="filled"/> Enviar formulario de Circular 57
                </Menu.Item>
              }
            </Menu>
          );
        }
      }

      const handleAction = (record) => {
        if(record){
          const recordObj = {id: record.id, name: record.nombre}
          this.setState({recordsAction: [recordObj]})
        }else{
          this.setState({recordsAction: selectedItem})
        }
      }

      const handleCancel = () => {
        this.handlePaginationChange(currentPage, filters);
        // setItemTable(null);
        this.setState({recordsAction: [], selectedItem: [], itemTable: null});
      };

    return (
      <div className="register-new">
        <PageTopBar breadcrumbs={ breadcrumbs } />
        <Page>
          <PageHeader
            title={ t('messages.aml.register') }
            description={ t('messages.aml.registerDescription') }
            icon="user-add"
            >
            <div className="btn-actions">
              { currentUser.type !== 'AUDIT' &&
                <div className="top-register-buttons">
                  <Button type="primary" onClick={ this.handleNewProfile.bind(this) } icon="plus">{ t('messages.aml.individualRegister') }</Button>
                  <Button type="primary" onClick={ this.handleUploadBatch.bind(this) } icon="plus">{ t('messages.aml.entityUpload') }</Button>
                  <Button type="primary" onClick={ this.handleUploadBatchInactive.bind(this) } icon="pause">{ t('messages.aml.entityUploadInactivate') }</Button>
                  <Button type="primary" onClick={ this.handleUploadRelated.bind(this) } icon="upload">{ t('messages.aml.related') }</Button>
                  <Button type="primary" onClick={ this.handleReport.bind(this) } icon="file-excel">{ t('messages.aml.export') }</Button>
                </div>
              }
            </div>
          </PageHeader>
          <PageContent>
            <Sidebar>
              <Filters currentUser={ currentUser } parametersClient={ parametersClient } filters={ filters } groups={ groups } categories={ categories } onChangeFilters={ this.handleChangeFilters.bind(this) } />
            </Sidebar>
            <Content>
              <ContentTopBar isLoading={ isLoading } firstLoading={ firstLoading } colors={ colors } colorsCake={ colorsCake } filters={ filters } onChangeFilters={ this.handleChangeFilters.bind(this) } />
              {currentUser.modules.includes('ONBOARDING') &&
                <Row style={{margin:5}}>
                  <Col span={5}>
                    <Input.Search
                      placeholder={"Buscar nombre o rut"}
                      style={{ width: "100%", marginTop: "0px" }}
                      onSearch={(value) => {this.setState({rut: value})}}
                      allowClear
                    />
                  </Col>
                  <Col span={1}>
                    <div className={isAdvancedSearchVisible ? 'advanced-search on' : 'advanced-search'} onClick={!isAdvancedSearchVisible ? () => {this.setState({isAdvancedSearchVisible: true})} : () => {this.setState({isAdvancedSearchVisible: false})}}>
                      <Icon style={{fontSize: '20px', marginTop: 5, marginLeft: 10, cursor: 'pointer'}} type={!isAdvancedSearchVisible ? 'filter' : 'close'} />
                    </div>
                  </Col>
                  <Col span={4} offset={14}>
                    <Dropdown overlay={() => menu(selectedItem, 'action')} disabled={selectedItem.length===0}>
                      <Button style={{float: 'right'}}>
                        Acción <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </Col>
                </Row>
              }

              <Row>
                <Col span={24}>
                  <div className={isAdvancedSearchVisible === null ? 'filters-wrapper null' : (isAdvancedSearchVisible ? 'filters-wrapper show' : 'filters-wrapper hide')}>
                    <div className="filters-wrapper-inner">
                      <AdvancedTabs
                        cbFilters={cbFilters}
                        // areas={areas}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <div className="register-table">
                <Row>
                  <Table
                    className="table-req-onb-content"
                    size="small"
                    loading={isLoading}
                    pagination={false}
                    columns={getTableColumns()}
                    dataSource={clients}
                    indentSize={30}

                    />
                </Row>
                <div className="pagination-formtable">
                  <Row>
                    <Pagination current={ currentPage } total={ resultsTotalNum } onChange={ this.handlePaginationChange.bind(this) } pageSize={ resultsPerPage } />
                  </Row>
                </div>
              </div>
            </Content>
            <div style={{ clear: 'both' }} />
          </PageContent>
        </Page>
        <PageBottomBar breadcrumbs={ breadcrumbs } />

        { isModalClientVisible &&
          <ModalClient key={ Math.floor((Math.random() * 100) + 1) } currentUser={currentUser} client={ selectedRecord } onOk={ this.handleOnOkModalClient.bind(this) } onCancel={ this.handleOnCancelModalClient.bind(this) }/>
        }
        {itemTable &&
					<Modal
						wrapClassName="modal-fichaCliente-onb"
						style={{top:'10px'}}
						title={"Ficha de Cliente"}
						visible={true}
						onCancel={handleCancel}
						cancelText="Cerrar"
						footer={null}
						width={'95vw'}
					>
						<ModalClientCard item={itemTable} handleCancel={handleCancel} />
					</Modal>
				}
        { isModalUploadVisible &&
          <Modal
            title={ t('messages.aml.uploadFile') }
            className="modal-cliente"
            visible={ isModalUploadVisible }
            onCancel={ this.handleOnCancelModalUpload.bind(this) }
            footer={ [
              uploaded ?
              <Button onClick={ this.handleOnCancelModalUpload.bind(this) }>{ t('messages.aml.btnClose') }</Button>
              :
              <>
                <div className="plantilla"><a onClick={() => this.downloadPlantilla('records')}>Plantilla</a></div>
                <Button onClick={ this.handleOnCancelModalUpload.bind(this) }>{ t('messages.aml.cancel') }</Button>
                <Button type="primary" onClick={ this.handleUploadClient.bind(this) } loading={uploading}>{ t('messages.aml.save') }</Button>
              </>
            ] }
            >
              { uploading ?
                <Spin spinning={ true } size="large" />
              :
                uploaded ?
                <List
                  header={<h3>{ t('messages.aml.results') }</h3>}
                  bordered
                  dataSource={resultsUpload}
                  renderItem={item => (
                    <List.Item>
                      {item}
                    </List.Item>
                  )}
                  footer={ errorsUpload !== null && errorsUpload !== '' &&
                      <Button onClick={this.downloadErrors.bind(this)} icon="file-excel"> { t('messages.aml.downloadReport')}</Button>
                    }
                />
                :
                <Form layout="vertical">
                  { currentUser.cliente.modules.includes('MONITOR-AML') &&
                    <Form.Item label={ t('messages.aml.asignedUser') }>
                      <Select value={ userAsig } onChange={ (value) => this.handleOnChangeAsignedUser(value) }>
                          { this.getUsersAsig(users) }
                      </Select>
                    </Form.Item>
                  }
                  { currentUser.cliente.outsourcer && currentUser.cliente.clientes !== null && currentUser.cliente.clientes.length > 0 && currentUser.subcliente === null &&
                    <Form.Item label={ t('messages.aml.subclient') }>
                      <Select onChange={ (value) => this.handleOnChangeSubcliente(value) }
                        placeholder="Seleccionar Empresa"
                        className="subclient-dropdown-uploadclient"
                        allowClear
                        >
                        { currentUser.cliente.clientes.map(item =>
                            <Select.Option className="subclient-option" value={ item.id }>
                              <div className="subclient-option-inner">
                                <figure className="subclient-logo">
                                  <img src={ apiConfig.url + '/../getImageClientUser/0/' + item.id } alt="" style={{ height: '15px' }} />
                                </figure>
                                <span className="subclient-name" style={{ paddingLeft: '10px' }}>{ item.name }</span>
                              </div>
                            </Select.Option>
                          )
                        }
                      </Select>
                    </Form.Item>
                  }
                  <Form.Item label={ t('messages.aml.category') }>
                    <Select onChange={ (value) => this.handleOnChangeCategory(value) } defaultValue="CLIENTE">
                      <Select.Option value="CLIENTE">{ t('messages.aml.category.CLIENTE') }</Select.Option>
                      <Select.Option value="PROVEEDOR">{ t('messages.aml.category.PROVEEDOR') }</Select.Option>
                      <Select.Option value="COLABORADOR">{ t('messages.aml.category.COLABORADOR') }</Select.Option>
                      <Select.Option value="DIRECTOR">{ t('messages.aml.category.DIRECTOR') }</Select.Option>
                    </Select>
                  </Form.Item>
                  { parametersClient !== null && parametersClient.gruposNames !== null && parametersClient.gruposNames.length > 0 &&
                    <Form.Item label={ t('messages.aml.group') }>
                      <Select onChange={ (value) => this.handleOnChangeGrupo(value) }>
                        { parametersClient.gruposNames.map(grupo => <Select.Option value={ grupo }>{ grupo }</Select.Option>) }
                      </Select>
                    </Form.Item>
                  }
                  { currentUser.cliente.modules.includes('ADMCLI') && (currentUser.cliente.modules.includes('REG-ENTITY') || (!currentUser.cliente.modules.includes('REG-ENTITY') && !currentUser.cliente.modules.includes('REG-PERSON'))) && parametersClient && !parametersClient.ubofinder.noInvestigaMalla &&
                    <Row>
                      <Col xs={ 12 }>
                        <Form.Item label={ t('messages.aml.ubosInvestigate') } >
                          <Switch checked={ processUF } onChange={ (checked) => this.handleOnChangeUF(checked) } />
                        </Form.Item>
                      </Col>
                      { parametersClient.ubofinder.formularioInterno && !parametersClient.ubofinder.sinFormulario &&
                        <Col xs={ 12 }>
                          <Form.Item label={ t('messages.aml.sendMail') }>
                            <Switch checked={!formularioInterno} disabled={ !processUF } onChange={ (checked) => this.handleOnChangeSendMail(checked) } />
                          </Form.Item>
                        </Col>
                      }
                    </Row>
                  }
                  {
                    fileList.length === 0 ?
                      <Form.Item>
                        <Dragger {...propsUpload} >
                          <img src={ uploadIcon } alt="" style={{ height: '100px' }} />
                          <p className="ant-upload-text">{ t('messages.aml.clickHereOrDragExcel') }.</p>
                        </Dragger>
                      </Form.Item>
                    :
                      <div className="file-wrapper">
                        <div className="file-inner">
                          <div className="image-wrapper">
                            <div className="remove">
                              <Icon type="close" onClick={ () => this.setState({ fileList: [] }) } />
                            </div>
                            <img src={ excelFileIcon } alt="" />
                          </div>
                          <p className="file-name">{ fileList[0].name }</p>
                        </div>
                      </div>
                  }

                </Form>
              }
          </Modal>
        }




        { isModalUploadInactiveVisible &&
          <Modal
            title={ t('messages.aml.uploadFile') }
            className="modal-cliente"
            visible={ isModalUploadInactiveVisible }
            onCancel={ this.handleOnCancelModalUploadInactive.bind(this) }
            footer={ [
              uploaded ?
              <Button onClick={ this.handleOnCancelModalUploadInactive.bind(this) }>{ t('messages.aml.btnClose') }</Button>
              :
              <>
              <Button onClick={ this.handleOnCancelModalUploadInactive.bind(this) }>{ t('messages.aml.cancel') }</Button>,
              <Button type="primary" onClick={ this.handleUploadClientInactive.bind(this) } loading={uploading}>{ t('messages.aml.save') }</Button>
              </>
            ] }
            >
              { uploading ?
                <Spin spinning={ true } size="large" />
              :
                uploaded ?
                <List
                  header={<h3>{ t('messages.aml.results') }</h3>}
                  bordered
                  dataSource={resultsUpload}
                  renderItem={item => (
                    <List.Item>
                      {item}
                    </List.Item>
                  )}
                />
                :
                <Form layout="vertical">
                  {
                    fileList.length === 0 ?
                      <Form.Item>
                        <Dragger {...propsUpload} >
                          <img src={ uploadIcon } alt="" style={{ height: '100px' }} />
                          <p className="ant-upload-text">{ t('messages.aml.clickHereOrDragExcel') }.</p>
                        </Dragger>
                      </Form.Item>
                    :
                      <div className="file-wrapper">
                        <div className="file-inner">
                          <div className="image-wrapper">
                            <div className="remove">
                              <Icon type="close" onClick={ () => this.setState({ fileList: [] }) } />
                            </div>
                            <img src={ excelFileIcon } alt="" />
                          </div>
                          <p className="file-name">{ fileList[0].name }</p>
                        </div>
                      </div>
                  }

                </Form>
              }
          </Modal>
        }
        { isModalUploadRelatedVisible &&
          <Modal
            title={ t('messages.aml.uploadFile') }
            className="modal-cliente"
            visible={ isModalUploadRelatedVisible }
            onCancel={ this.handleOnCancelModalUploadRelated.bind(this) }
            footer={ [
              uploaded ?
                <Button onClick={ this.handleOnCancelModalUploadRelated.bind(this) }>{ t('messages.aml.btnClose') }</Button>
              :
              <>
                <div className="plantilla"><a onClick={() => this.downloadPlantilla('related')}>Plantilla</a></div>
                <Button onClick={ this.handleOnCancelModalUploadRelated.bind(this) }>{ t('messages.aml.cancel') }</Button>
                <Button type="primary" onClick={ this.handleUploadRelatedFile.bind(this) } loading={uploading}>{ t('messages.aml.save') }</Button>
              </>
            ] }
            >
              { uploading ?
                <Spin spinning={ true } size="large" />
              :
                uploaded ?
                <List
                  header={<h3>{ t('messages.aml.results') }</h3>}
                  bordered
                  dataSource={resultsUpload}
                  renderItem={item => (
                    <List.Item>
                      {item}
                    </List.Item>
                  )}
                />
                :
                <Form layout="vertical">
                  {
                    fileList.length === 0 ?
                      <Form.Item>
                        <Dragger {...propsUpload} >
                          <img src={ uploadIcon } alt="" style={{ height: '100px' }} />
                          <p className="ant-upload-text">{ t('messages.aml.clickHereOrDragExcel') }.</p>
                        </Dragger>
                      </Form.Item>
                    :
                      <div className="file-wrapper">
                        <div className="file-inner">
                          <div className="image-wrapper">
                            <div className="remove">
                              <Icon type="close" onClick={ () => this.setState({ fileList: [] }) } />
                            </div>
                            <img src={ excelFileIcon } alt="" />
                          </div>
                          <p className="file-name">{ fileList[0].name }</p>
                        </div>
                      </div>
                  }

                </Form>
              }
          </Modal>
        }
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
        { isModalUbosVisible &&
          <Modal
            key={ Math.floor((Math.random() * 100) + 1) }
            title={ t('messages.aml.finalBeneficiaries') }
            visible={ true }
            onCancel={ this.handleOnCancelModalUbos.bind(this) }
            width={ 1100 }
            footer={ [
              <Button onClick={ this.handleOnCancelModalUbos.bind(this) }>{ t('messages.aml.btnClose') }</Button>
            ] }
            >
            <ModalUbos record={ selectedRecord } currentUser={ currentUser }/>
          </Modal>
        }
        { isModalReportVisible &&
          <Modal
            title={ t('messages.aml.export') }
            visible={ true }
            onCancel={ this.handleOnCancelModalReport.bind(this) }
            width={ 500 }
            footer={ [
              <Button onClick={ this.handleOnCancelModalReport.bind(this) }>{ t('messages.aml.btnClose') }</Button>
            ] }
          >
            <div style={ { textAlign: 'center'} }>
              <Button onClick={ this.handleExcelReport.bind(this) } disabled={isLoadingExport||isLoadingRisk||isLoadingCertificates||isLoadingBfReport||isLoadingMp||isLoadingFormReport} icon={isLoadingExport ? 'loading':'file-excel'}>{ t('messages.aml.export') }</Button>
              <br/><br/>
              { currentUser.cliente.modules.includes('MONITOR-AML') &&
                <>
                  <Button onClick={ this.handleRiskReport.bind(this) } disabled={isLoadingExport||isLoadingRisk||isLoadingCertificates||isLoadingBfReport||isLoadingMp||isLoadingFormReport} icon={isLoadingRisk ? 'loading':'file-excel'}>{ t('messages.aml.riskLevels') }</Button>
                  <br/><br/>
                </>
              }
              <Button onClick={ this.handlePDFReport.bind(this) } disabled={isLoadingExport||isLoadingRisk||isLoadingCertificates||isLoadingBfReport||isLoadingMp||isLoadingFormReport} icon={isLoadingCertificates ? "loading":"file-pdf"}>{ t('messages.aml.certificates') }</Button>
              { currentUser.cliente.modules.includes('ADMCLI') && parametersClient && parametersClient.ubofinder && !parametersClient.ubofinder.noInvestigaMalla &&
                <>
                  <br/><br/>
                  <Button onClick={ this.handleBFReport.bind(this) } disabled={isLoadingExport||isLoadingRisk||isLoadingCertificates||isLoadingBfReport||isLoadingMp||isLoadingFormReport} icon={isLoadingBfReport ? "loading":"profile"}>{ t('messages.aml.finalBeneficiaries') }</Button>
                  <br/><br/>
                  <Button onClick={ this.handleMallasPropiedadReport.bind(this) } disabled={isLoadingExport||isLoadingRisk||isLoadingCertificates||isLoadingBfReport||isLoadingMp||isLoadingFormReport} icon={isLoadingMp ? "loading":"profile"}>{ t('messages.aml.ownershipTree') }</Button>
                  { !parametersClient.ubofinder.sinFormulario &&
                    <>
                      <br/><br/>
                      <Button onClick={ this.handleFormsReport.bind(this) } disabled={isLoadingExport||isLoadingRisk||isLoadingCertificates||isLoadingBfReport||isLoadingMp||isLoadingFormReport} icon={isLoadingFormReport ? "loading":"file-pdf"}>{ t('messages.aml.ubofinder.forms') }</Button>
                    </>
                  }
                </>
              }
            </div>
          </Modal>
        }
        {recordsAction.length !== 0 &&
					<Modal
					title={ actionType==='newRequest' ? [ <Icon type="mail" />," "," Enviar Formulario de Onboarding" ] : [ <Icon type="clock-circle" />, " "," Actualizar periódicamente la ficha" ] }
					centered={true}
					width={500}
					footer={false}
					onCancel={handleCancel}
					visible={true}
					>
						<ModalRequestOpt type={actionType} recipients={recordsAction} handleCancel={handleCancel}/>
					</Modal>
				}
      </div>
    )
  }
}
export default withTranslation()(withRouter(Register))
