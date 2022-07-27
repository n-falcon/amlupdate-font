import './Batch.scss'
import React, { Component } from 'react'
import { Modal, Pagination, Spin, notification } from 'antd'
import { withTranslation } from 'react-i18next'
import { Page, PageBottomBar, PageFooter, PageHeader, PageToolbar, PageTopBar } from '../../layouts/Private/components'
import { getFilesByClientPromise, uploadFilePromise } from './promises'
import { AddButton, File, FilesPageContent, ModalAddBatchFile, SearchFilters } from './components'
import noResultsImg from '../Query/no-results-bg.png'
import emptyArrow from './empty-arrow.png'

class Batch extends Component {
  tmpFilters = {
    resultsCurrentPage: 1,
    resultsPerPage: 17,
    searchFileName: '',
    searchFromDate: '',
    searchOptDates: '',
    searchToDate: '',
    searchUserId: ''
  }

  state = {
    breadcrumbs: [{ title: 'Procesos masivos', icon: 'coffee', link: '/masivos' }],
    files: [],
    isFiltered: false,
    isLoading: true,
    isUploading: false,
    isModalUploadVisible: false,
    resultsCurrentPage: 1,
    resultsNum: -1,
    resultsPerPage: 17,
    searchFileName: '',
    tmpSearchFileName: '',
    searchFromDate: '',
    tmpSearchFromDate: '',
    searchOptDates: '',
    tmpSearchOptDates: '',
    searchToDate: '',
    tmpSearchToDate: '',
    searchUserId: '',
    tmpSearchUserId: ''
  }

  refreshFiles = setInterval(async () => {
    const { resultsCurrentPage, resultsPerPage, searchFileName, searchOptDates, searchFromDate, searchToDate, searchUserId } = this.state
    const fromNum = (resultsCurrentPage - 1) * resultsPerPage
    const files = await getFilesByClientPromise(fromNum, resultsPerPage, searchFromDate, searchToDate, searchUserId, searchFileName, searchOptDates)

    this.setState({ files: files.files, isLoading: false, resultsNum: files.total })
  }, 1000)


  componentWillUnmount() {
    window.clearInterval(this.refreshFiles)
  }


  handleOpenModalAddFile() {
    this.setState({ isModalUploadVisible: true })
  }

  handleCloseModalAddFile() {
    this.setState({ isModalUploadVisible: false })
  }

  async handlePaginationChange(from) {
    await this.setState({ isLoading: true, resultsCurrentPage: from })
  }

  async handleUploadNewFile(file, searchRecordType, searchScope, contents) {
    const { t } = this.props

    if(contents.length === 0) {
      notification['error']({
        message: t('messages.aml.missingRequiredField'),
        description: 'Debe seleccionar bases de datos a consultar'
      })
      return false
    }
    const formData = new FormData()

    formData.append('file', file)
    formData.append('typeSearch', searchScope)
    formData.append('type', searchRecordType)
    formData.append('contents', contents)

    await this.setState({ isUploading: true })

    const upload = await uploadFilePromise(formData)
    const { resultsCurrentPage, resultsPerPage } = this.state
    const fromNum = (resultsCurrentPage - 1) * resultsPerPage

    if (upload.success) {
      const files = await getFilesByClientPromise(fromNum, resultsPerPage)

      await this.setState({
        files: files.files,
        isModalUploadVisible: false,
        isUploading: false,
        resultsCurrentPage: 1,
        resultsNum: files.total
      })

      const div = document.createElement('div')
      const el = document.getElementsByClassName('file')[0]

      div.setAttribute('class', 'white-overlay')

      el.appendChild(div)
    }
  }

  handleFromDateChange(tmpSearchFromDate) {
    this.setState({ tmpSearchFromDate })
  }

  handleToDateChange(tmpSearchToDate) {
    this.setState({ tmpSearchToDate })
  }

  handleOptDatesChange(tmpSearchOptDates) {
    this.setState({ tmpSearchOptDates })
  }

  handleUserChange(tmpSearchUserId) {
    this.setState({ tmpSearchUserId })
  }

  handleFileNameChange(e) {
    this.setState({ tmpSearchFileName: e.target.value })
  }

  handleApplyFilters() {
    const { tmpSearchFileName, tmpSearchFromDate, tmpSearchOptDates, tmpSearchToDate, tmpSearchUserId } = this.state

    this.setState({
      isFiltered: true,
      isLoading: true,
      resultsCurrentPage: 1,
      searchFileName: tmpSearchFileName,
      searchFromDate: tmpSearchFromDate,
      searchOptDates: tmpSearchOptDates,
      searchToDate: tmpSearchToDate,
      searchUserId: tmpSearchUserId
    })
  }

  async handleClearFilters() {
    await this.setState({
      isFiltered: false,
      isLoading: true,
      resultsCurrentPage: 1,
      searchFileName: '',
      tmpSearchFileName: '',
      searchFromDate: '',
      tmpSearchFromDate: '',
      searchOptDates: '',
      tmpSearchOptDates: '',
      searchToDate: '',
      tmpSearchToDate: '',
      searchUserId: '',
      tmpSearchUserId: ''
    })
  }

  render() {
    const { t, currentUser } = this.props
    const { breadcrumbs, files, isFiltered, isLoading, isModalUploadVisible, isUploading, resultsCurrentPage, resultsNum, resultsPerPage, searchFileName, searchFromDate, searchOptDates, searchToDate, searchUserId } = this.state

    return (
      <div className="batch">
        <PageTopBar breadcrumbs={ breadcrumbs } />
        <Page>
          <PageHeader
            icon="coffee"
            title={ t('messages.aml.batchProcesses')}
            description={ t('messages.aml.batchProcessesDescription') }
          />
          <PageToolbar>
            <SearchFilters
              currentValues={ this.state }
              fileNameHandler={ this.handleFileNameChange.bind(this) }
              userHandler={ this.handleUserChange.bind(this) }
              optDatesHandler={ this.handleOptDatesChange.bind(this) }
              fromDateHandler={ this.handleFromDateChange.bind(this) }
              toDateHandler={ this.handleToDateChange.bind(this) }
              applyHandler={ this.handleApplyFilters.bind(this) }
              clearHandler={ this.handleClearFilters.bind(this) }
            />
          </PageToolbar>
          <FilesPageContent>
            { isLoading ?
                <div className="is-loading">
                  <Spin size="large" spinning={ true } />
                </div>
              :
                resultsNum === 0 ?
                  isFiltered ?
                    <div className="no-results">
                      <div className="no-results-img-wrapper">
                        <img src={ noResultsImg } alt="" />
                        <h3>No se han encontrado coincidencias.</h3>
                      </div>
                    </div>
                  :
                    <div className="empty">
                      <AddButton onClick={ this.handleOpenModalAddFile.bind(this) } />
                      <h3><span>Haga click para agregar su primera consulta masiva.</span></h3>
                    </div>
                :
                  <>
                    <AddButton onClick={ this.handleOpenModalAddFile.bind(this) } />
                    { files.map(file => <File file={ file } currentUser={currentUser} />) }
                  </>
            }
          </FilesPageContent>
          <PageFooter>
            { resultsNum > 17 && <Pagination defaultCurrent={ 1 } current={ resultsCurrentPage } total={ resultsNum } pageSize={ resultsPerPage } onChange={ this.handlePaginationChange.bind(this) } /> }
          </PageFooter>
        </Page>
        <PageBottomBar breadcrumbs={ breadcrumbs } />
        { isModalUploadVisible &&
          <Modal
            className="modal-add-batch-file"
            title={ null }
            footer={ null }
            onCancel={ this.handleCloseModalAddFile.bind(this) }
            visible={ isModalUploadVisible }
            width={700}
          >
            <ModalAddBatchFile currentUser={currentUser} isUploading={ isUploading } uploadHandler={ this.handleUploadNewFile.bind(this) } />
          </Modal>
        }
      </div>
    )
  }
}

export default withTranslation()(Batch)
