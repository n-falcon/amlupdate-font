import './AdminLists.scss'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { Button, Icon, notification, Modal, Spin, Table, Upload, Switch, Pagination, message } from 'antd'
import apiConfig from '../../config/api'
import { getNegativeListPromise, changeAllowNegClientPromise } from './promises'
import { SessionStorageService } from '../../services'
import { globalContext } from '../../contexts'

const resultsPerPage = 10;

class AdminLists extends Component {
  static contextType = globalContext
  state = {
    isDownloading: false,
    isLoading: true,
    isModalUploadVisible: false,
    negativeList: [],
    allowNegAdm: false,
    resultsCurrentPage: 1,
    resultsTotalNum: -1,
    reportId: null,
    intervalReportId: null
  }

  async getFirstSearchResults() {
    this.setState({ isModalUploadVisible: false })
    this.handlePaginationOnChange(1)
  }

  async handlePaginationOnChange(currentPage, filters = {}) {
    const fromNum = ((currentPage - 1) * resultsPerPage)

    await this.setState({ isLoading: true, searchResultsFromNum: fromNum })

    filters.size = resultsPerPage
    filters.from = fromNum
    const negativeList = await getNegativeListPromise(filters)

    await this.setState({
      isLoading: false,
      negativeList: negativeList.records,
      resultsCurrentPage: currentPage,
      resultsTotalNum: negativeList.total
    })
  }

  async handleSubmitPagination(currentPage) {
    this.handlePaginationOnChange(currentPage)
  }

  async componentDidMount() {
      this.getFirstSearchResults()
  }

  renderTableColumns() {
    const { t } = this.props

    const columns = [
      {
        title: t('messages.aml.rutNumber'),
        dataIndex: 'rut'
      },
      {
        title: t('messages.aml.fathersLastName'),
        dataIndex: 'paterno'
      },
      {
        title: t('messages.aml.mothersLastName'),
        dataIndex: 'materno'
      },
      {
        title: t('messages.aml.name'),
        dataIndex: 'nombre'
      },
      {
        title: t('messages.aml.causal'),
        dataIndex: 'causal'
      },
      {
        title: t('messages.aml.startingDate'),
        dataIndex: 'fechaInicio'
      },
      {
        title: t('messages.aml.endingDate'),
        dataIndex: 'fechaFin'
      }
    ]

    return columns
  }

  handleUploadClick() {
    this.setState({ isModalUploadVisible: true })
  }

  localGenerateReport (type) {
    const { filters } = this.state
    const { generateReport } = this.context
    return generateReport(type, filters, this.finishReport.bind(this))
  }

  finishReport() {
    this.setState({ isDownloading: false })
  }

  async handleDownload() {
    this.localGenerateReport('NEG').then(r => {
      if(r) this.setState({ isDownloading: true })
    })
  }

  async changeAllowNegAdm(checked) {
    const { t } = this.props
    let result = await changeAllowNegClientPromise(checked)
    if(result.status === 'OK') {
      this.setState({ allowNegAdm: checked })
      notification.success({
        message: t('messages.aml.successfulOperation'),
        description: checked ? t('messages.aml.permissionGranted') : t('messages.aml.permissionDeny')
      })
    }else {
      notification.error({
        messages: t('messages.aml.anErrorOcurred'),
        description: result.message
      })
    }
  }

  render() {
    const { t } = this.props
    const { isDownloading, isLoading, isModalUploadVisible, negativeList, allowNegAdm, resultsCurrentPage, resultsTotalNum } = this.state
    const authToken = SessionStorageService.read('authToken')

    const propsUpload = {
      accept: ".xlsx,.txt",
      name: 'file',
      multiple: false,
      headers: {
        Authorization: 'Bearer ' + authToken
      },
      action: apiConfig.url + '/uploadNeg',
      onChange(info) {
        const { status } = info.file

        if (status !== 'uploading') {
          console.log(info.file, info.fileList)
        }

        if (status === 'done') {
          notification.success({
            message: t('messages.aml.successfulOperation'),
            description: t('messages.aml.fileUploadedSuccesfully')
          })
        } else if (status === 'error') {
          notification.error({
            messages: t('messages.aml.anErrorOcurred'),
            description: t('messages.aml.anErrorOcurredWhileUploadingFile')
          })
        }
      }
    }

    const { Dragger } = Upload

    return (
      <div className="admin-lists">
        <div className="tools-area">
          <div style={{ float: 'left', color:'#fff' }}>
            <Switch checked={ allowNegAdm } onChange={ (checked) => this.changeAllowNegAdm(checked) }/>&nbsp;&nbsp;Admin. Gesintel
          </div>
          <Button type="primary" icon={ isDownloading ? 'loading' : 'cloud-download' } disabled={isDownloading} onClick={ this.handleDownload.bind(this) }>{ t('messages.aml.download') }</Button>&nbsp;
          <Button type="primary" icon="upload" onClick={ this.handleUploadClick.bind(this) }>{ t('messages.aml.uploadFile') }</Button>
        </div>
        <div className="table-wrapper">
          { isLoading ?
              <Spin spinning="true" size="large" />
              :
              <Table dataSource={ negativeList } columns={ this.renderTableColumns() } pagination={ false } size="small" />
          }
        </div>
        <Pagination current={ resultsCurrentPage } total={ resultsTotalNum } onChange={ this.handleSubmitPagination.bind(this) } pageSize={ resultsPerPage } size="small" />
        <Modal
          onCancel={ () => this.setState({ isModalUploadVisible: false })}
          onOk={ this.getFirstSearchResults.bind(this) }
          visible={ isModalUploadVisible }
          title={ t('messages.aml.uploadFile') }
          key={ Date.now() }
        >
        <Dragger {...propsUpload} >
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">{ t('messages.aml.uploadFileInstructions') }</p>
        </Dragger>
      </Modal>
      </div>
    )
  }

}

export default withTranslation()(AdminLists)
