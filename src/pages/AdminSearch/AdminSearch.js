import './AdminSearch.scss'
import React, {Component} from 'react'
import {withTranslation} from 'react-i18next'
import moment from 'moment'
import apiConfig from '../../config/api'
import {Badge, Form, Icon, Pagination, Spin, Table, Button, Modal} from 'antd'
import {ReportService} from '../../services'
import {AdminSearchFilters} from './components'
import {getSearchesPromise} from './promises'
import {camelizerHelper} from '../../helpers'
import {PdfModal} from '../../layouts/Private/components'

class AdminSearch extends Component {

    initialFiltersState = {
        search: '',
        searchFiltersDate: 'ALL',
        searchFiltersDateFrom: '',
        searchFiltersDateTo: '',
        searchFiltersHasReport: false,
        searchFiltersMode: 'ALL',
        searchFiltersOutcome: 'ALL',
        searchFiltersTypeIsRut: true,
        searchFiltersUser: '',
        searchFiltersType: null
    }

    state = {
        isLoading: true,
        isLoadingReport: false,
        search: this.initialFiltersState.search,
        searchFiltersDate: this.initialFiltersState.searchFiltersDate,
        searchFiltersDateFrom: this.initialFiltersState.searchFiltersDateFrom,
        searchFiltersDateTo: this.initialFiltersState.searchFiltersDateTo,
        searchFiltersHasReport: this.initialFiltersState.searchFiltersHasReport,
        searchFiltersMode: this.initialFiltersState.searchFiltersMode,
        searchFiltersOutcome: this.initialFiltersState.searchFiltersOutcome,
        searchFiltersTypeIsRut: this.initialFiltersState.searchFiltersTypeIsRut,
        searchFiltersUser: this.initialFiltersState.searchFiltersUser,
        searchFiltersType: this.initialFiltersState.searchFiltersType,
        searchResults: [],
        searchResultsCurrentPage: 1,
        searchResultsFromNum: 0,
        searchResultsPerPage: 10,
        searchResultsTotalNum: -1,
        isModalVisible: false,
        certificadosResults: [],
        showModalPdf: false,
        pdfSource: '',
        isPdfObj: false
    }

    async componentDidMount() {
        this.getFirstSearchResults()
    }

    async getFirstSearchResults() {
        this.handlePaginationOnChange(1)
    }

    async handlePaginationOnChange(currentPage, filters = null) {
        const {searchResultsPerPage} = this.state
        const fromNum = ((currentPage - 1) * searchResultsPerPage)

        await this.setState({isLoading: true, searchResultsFromNum: fromNum})

        const searchResults = await getSearchesPromise(fromNum, searchResultsPerPage, filters)

        await this.setState({
            isLoading: false,
            searchResults: searchResults.records,
            searchResultsCurrentPage: currentPage,
            searchResultsTotalNum: searchResults.total
        })
    }

    renderTableColumns() {
        const {t} = this.props

        const tableColumns = [
            {
                title: t('messages.aml.date'),
                dataIndex: 'dateShortAsString'
            },
            {
                title: t('messages.aml.username'),
                dataIndex: 'userName'
            },
            {
                title: t('messages.aml.databases'),
                dataIndex: 'modulos',
                ellipsis: true
            },
            {
                title: t('messages.aml.rut'),
                dataIndex: 'rut'
            },
            {
                title: t('messages.aml.name'),
                dataIndex: 'nombre',
                ellipsis: true
            },
            {
                title: t('messages.aml.results'),
                dataIndex: 'resultados'
            },
            {
                title: t('messages.aml.mode'),
                dataIndex: 'modo'
            },
            {
                title: t('messages.aml.certificates'),
                dataIndex: 'certificados',
                render: (certificados, record) => {
                    if (certificados !== null && certificados.length > 0) {
                        if (certificados.length === 1) {
                            return <Button type="primary" className="pdfButton"
                                           onClick={(e) => this.handlePDFReport(record.id, certificados[0].pdf)}>PDF <Icon
                                type="cloud-download"/></Button>
                        } else {
                            return <Button type="primary" className="pdfButton"
                                           onClick={(e) => this.openModalReport(record)}>PDF&nbsp;<Badge size="small"
                                                                                                         count={certificados.length}/></Button>
                        }
                    } else if (record.modo === 'BATCH') {
                        return <Button type="primary" className="pdfButton"
                                       onClick={(e) => this.handlePDFBatch(record)}>PDF <Icon
                            type="cloud-download"/></Button>
                    }
                }
            }
        ]

        return tableColumns
    }

    closeHandlerPdfModal() {
        this.setState({
            showModalPdf: false
        })
    }

    handlePDFBatch(record) {
        const {currentUser} = this.props
        window.open(apiConfig.url + '/../pdfBatch/batch-' + record.tipo + '.pdf?id=' + record.batchId + '&userId=' + currentUser.id)
    }

    renderCertificadosTableColumns() {
        const {t} = this.props

        const tableColumns = [
            {
                title: t('messages.aml.rut'),
                dataIndex: 'rut',
                size: 120
            },
            {
                title: t('messages.aml.name'),
                dataIndex: 'nombre',
                render: (text) => camelizerHelper(text),
                size: 420
            },
            {
                title: t('messages.aml.certificate'),
                dataIndex: 'pdf',
                size: 120,
                render: (pdf, certificado) => {
                    return <Button type="primary"
                                   onClick={(e) => this.handlePDFReport(certificado.searchId, certificado.pdf)}>PDF <Icon
                        type="cloud-download"/></Button>
                }
            }
        ]

        return tableColumns
    }

    openModalReport(record) {
        for (let i = 0; i < record.certificados.length; i++) {
            record.certificados[i]['searchId'] = record.id
        }
        this.setState({isModalVisible: true, certificadosResults: record.certificados})
    }

    handleModalCancel() {
        this.setState({isModalVisible: false})
    }

    handleOnChangeDate(searchFiltersDate) {
        this.setState({searchFiltersDate})
    }

    handleOnChangeDateFrom(searchFiltersDateFrom) {
        this.setState({searchFiltersDateFrom: moment(searchFiltersDateFrom).format('DD/MM/YYYY')})
    }

    handleOnChangeDateTo(searchFiltersDateTo) {
        this.setState({searchFiltersDateTo: moment(searchFiltersDateTo).format('DD/MM/YYYY')})
    }

    handleOnChangeMode(e) {
        this.setState({searchFiltersMode: e.target.value})
    }

    handleOnChangeHasReport(searchFiltersHasReport) {
        this.setState({searchFiltersHasReport})
    }

    handleOnChangeSearch(e) {
        this.setState({search: e.target.value})
    }

    handleOnChangeSearchOutcome(e) {
        this.setState({searchFiltersOutcome: e.target.value})
    }

    handleOnChangeSearchTypeIsRut(searchFiltersTypeIsRut) {
        this.setState({searchFiltersTypeIsRut})
    }

    handleOnChangeUser(searchFiltersUser) {
        this.setState({searchFiltersUser})
    }

    handleOnChangeType(searchFiltersType) {
        this.setState({searchFiltersType})
    }

    async handleExcelReport() {
        await this.setState({isLoadingReport: true})
        await ReportService.read('/excelBusquedas', this.getFilters(), null, 'busquedas.xlsx')
        await this.setState({isLoadingReport: false})
    }

    async handlePDFReport(searchId, pdf) {
        await this.setState({isLoadingReport: true, showModalPdf: false})
        const obj = await ReportService.pdfToBase64Obj('/certificate', {searchId, pdf}, null, 'report.pdf')
        this.setState({
            showModalPdf: true,
            pdfSource: obj.data,
            isPdfObj: true,
            isLoadingReport: false
        })
    }

    handleOnClickRestoreFilters() {
        this.setState({
            search: this.initialFiltersState.search,
            searchFiltersDate: this.initialFiltersState.searchFiltersDate,
            searchFiltersDateFrom: this.initialFiltersState.searchFiltersDateFrom,
            searchFiltersDateTo: this.initialFiltersState.searchFiltersDateTo,
            searchFiltersHasReport: this.initialFiltersState.searchFiltersHasReport,
            searchFiltersMode: this.initialFiltersState.searchFiltersMode,
            searchFiltersOutcome: this.initialFiltersState.searchFiltersOutcome,
            searchFiltersTypeIsRut: this.initialFiltersState.searchFiltersTypeIsRut,
            searchFiltersUser: this.initialFiltersState.searchFiltersUser,
            searchFiltersType: this.initialFiltersState.searchFiltersType,
            searchResultsCurrentPage: 1,
            searchResultsFromNum: 0,
            searchResultsPerPage: 10,
            searchResultsTotalNum: -1
        })
        this.handleSubmit()
    }

    getFilters() {
        const filters = {}

        for (let key in this.initialFiltersState) {
            let value = this.state[key]
            if (key === 'search') {
                if (value !== '') {
                    if (this.state['searchFiltersTypeIsRut']) {
                        filters['rut'] = value
                    } else {
                        filters['name'] = value
                    }
                }
            }

            if (key === 'searchFiltersDate') {
                filters['optDates'] = value
                if (value === 'RANGE') {
                    filters['fromDate'] = this.state['searchFiltersDateFrom']
                    filters['toDate'] = this.state['searchFiltersDateTo']
                }
            }

            if (key === 'searchFiltersUser') {
                filters['userId'] = value
            }

            if (key === 'searchFiltersType') {
                filters['type'] = value
            }

            if (key === 'searchFiltersOutcome') {
                filters['hasResults'] = value
            }

            if (key === 'searchFiltersHasReport') {
                filters['hasReport'] = value ? 'S' : 'N'
            }

            if (key === 'searchFiltersMode') {
                filters['modo'] = value
            }
        }
        return filters
    }

    handleSubmit() {
        this.handleSubmitPagination(1)
    }

    async handleSubmitPagination(currentPage) {
        this.handlePaginationOnChange(currentPage, this.getFilters())
    }

    render() {


        const {
            isLoading,
            isLoadingReport,
            search,
            searchFiltersDate,
            searchFiltersDateFrom,
            searchFiltersDateTo,
            searchFiltersHasReport,
            searchFiltersMode,
            searchFiltersOutcome,
            searchFiltersUser,
            searchFiltersType,
            searchFiltersTypeIsRut,
            searchResults,
            searchResultsCurrentPage,
            searchResultsTotalNum,
            searchResultsPerPage,
            isModalVisible,
            certificadosResults,
            showModalPdf,
            pdfSource,
            isPdfObj
        } = this.state

        const {currentUser} = this.props

        return (
            <div className="admin-search">
                <AdminSearchFilters currentUser={currentUser}
                                    defaultValues={{
                                        search,
                                        searchFiltersDate,
                                        searchFiltersDateFrom,
                                        searchFiltersDateTo,
                                        searchFiltersHasReport,
                                        searchFiltersMode,
                                        searchFiltersOutcome,
                                        searchFiltersUser,
                                        searchFiltersType,
                                        searchFiltersTypeIsRut
                                    }}
                                    onChangeDateHandler={this.handleOnChangeDate.bind(this)}
                                    onChangeDateFromHandler={this.handleOnChangeDateFrom.bind(this)}
                                    onChangeDateToHandler={this.handleOnChangeDateTo.bind(this)}
                                    onChangeHasReportHandler={this.handleOnChangeHasReport.bind(this)}
                                    onChangeModeHandler={this.handleOnChangeMode.bind(this)}
                                    onChangeSearchHandler={this.handleOnChangeSearch.bind(this)}
                                    onChangeSearchOutcomeHandler={this.handleOnChangeSearchOutcome.bind(this)}
                                    onChangeSearchTypeIsRutHandler={this.handleOnChangeSearchTypeIsRut.bind(this)}
                                    onChangeUserHandler={this.handleOnChangeUser.bind(this)}
                                    onChangeTypeHandler={this.handleOnChangeType.bind(this)}
                                    onClickRestoreFiltersHandler={this.handleOnClickRestoreFilters.bind(this)}
                                    onClickExportHandler={this.handleExcelReport.bind(this)}
                                    onSubmit={this.handleSubmit.bind(this)}
                />

                <div className="table-wrapper">
                    {isLoading ?
                        <Spin spinning={true} size="large"/>
                        :
                        <Table dataSource={searchResults} columns={this.renderTableColumns()} pagination={false}
                               loading={isLoadingReport} size="small"/>
                    }
                </div>

                <Pagination current={searchResultsCurrentPage} total={searchResultsTotalNum}
                            onChange={this.handleSubmitPagination.bind(this)} pageSize={searchResultsPerPage}
                            size="small"/>

                <Modal visible={isModalVisible} title="Certificados" width="640px"
                       onCancel={this.handleModalCancel.bind(this)}
                       footer={<Button type="primary" onClick={this.handleModalCancel.bind(this)}>Cerrar</Button>}>
                    <Table dataSource={certificadosResults} columns={this.renderCertificadosTableColumns()}
                           pagination={false} size="small"/>
                </Modal>
            </div>
        )
    }
    }


    export default Form.create(
        {
            name: 'searches'
        }
    )(withTranslation()(AdminSearch))
