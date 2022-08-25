import './TabMonitoringDetails.scss'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Button, Icon, Pagination, Table, Spin, Switch } from 'antd'
import { Filters, ModalViewMonitoring } from '../'
import { getItemsPromise } from './promises'
import { camelizerHelper } from '../../../../helpers/'
import { ReportService } from '../../../../services/'

import { useTranslation } from 'react-i18next';
import { CakeRisks } from './components'

const TabMonitoringDetails = ({ type, currentUser }) => {
	const [items, setItems ] = useState([])
	const [clickedItem, setClickedItem] = useState({})
	const [isAdvancedSearchVisible, setIsAdvancedSearchVisible] = useState(null)
	const [isItemsLoading, setIsItemsLoading] = useState(false)
	const [isModalViewMonitoringVisble, setIsModalViewMonitoringVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [itemsTotalNum, setItemsTotalNum] = useState(-1)
  const [optDates, setOptDates] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [keyword, setKeyword] = useState('')
  const [hasMatches, setHasMatches] = useState('')
  const [risk, setRisk] = useState([])
	const [colors, setColors ] = useState({total: 0})
	const [all, setAll] = useState('NO')

	const [ hasEmpresa, setHasEmpresa ] = useState(false)
	const [ reporting, setReporting ] = useState(false)
	const {t} = useTranslation()

	useEffect(() => {
		if(currentUser.cliente.outsourcer && currentUser.cliente.clientes !== null && currentUser.cliente.clientes.length>0 && currentUser.subcliente === null) {
			setHasEmpresa(true)
		}
		handleSearch(1, {all})
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleSubmitFilters = async filters => {
		setOptDates(filters.optDates)
	  setFromDate(filters.fromDate)
	  setToDate(filters.toDate)
	  setKeyword(filters.keyword)
	  setHasMatches(filters.hasMatches)

    handleSearch(1, {...filters, risk, all})
  }

	const handleShowAdvancedSearch = () => {
		setIsAdvancedSearchVisible(true)
	}

	const handleHideAdvancedSearch = () => {
		setIsAdvancedSearchVisible(false)
	}

	const tableColumns = [
		{
			title: 'Nombre / Rut',
			dataIndex: 'nombre',
      width: 200,
			render: ((text, record) => {
				return (
					<>
						<h3>{ camelizerHelper(text) }</h3>
						<small>{ record.rut }</small>
					</>
				)
			})
		},
		{
			title: 'Empresa / area',
			dataIndex: 'company',
      width: 200,
			render: ((text, record) => {
				if(hasEmpresa) {
					return (
						<>
							<div>{ text }</div>
							<small>{ record.area }</small>
						</>
					)
				}else {
					return record.area
				}
			})
		},
		{
			title: 'Vínculos por persona',
			dataIndex: 'hasPositives',
			render: (text, record) => {
				return text && <div className="has-positives">Sí</div>
			}
		},

		{
			title: 'Riesgo por persona',
			dataIndex: 'risk',
			render: (text, record) => {
        return (
          <div className="risk-text">
            { text !== null ? <p>{ t("messages.aml.risk." + text) }</p> : <p>-</p> }
            { record.mitigador && <p>Mitigador</p> }
          </div>
        )
      }
		},

		{
			title: 'Última Declaración',
			dataIndex: 'lastDecl',
			render: text=> <div style={{textAlign:'center' }}>{text === null ? '-':moment(text).format('DD/MM/YYYY')}</div>
		},
		{
			title: 'Último Formulario',
			dataIndex: 'lastForm',
			render: (text, record) => {
				if(type === 'COLABORADOR') {
					return (
						<div style={{textAlign:'center' }}>{text === null ? '-':moment(text).format('DD/MM/YYYY')}</div>
					)
				}else {
					return 'N/A'
				}
			}
		},

	]

	const handleTableOnRow = (record, index) => {
		return {
			onClick: e => {
				setClickedItem(record)
				setIsModalViewMonitoringVisible(true)
			}
		}
	}

	const handleModalCancel = () => {
		setIsModalViewMonitoringVisible(false)
	}

	const handleModalOk = () => {
		setIsModalViewMonitoringVisible(false)
	}

	const renderColors = (filters) => {
		const colors = {
			high: 0,
			medium: 0,
			low: 0,
			n: 0,
			na: 0,
			total: 0
		}

		if (filters.HIGH) {
			colors.high = filters.HIGH
		}

		if (filters.MEDIUM) {
			colors.medium = filters.MEDIUM
		}

		if (filters.LOW) {
			colors.low = filters.LOW
		}

		if (filters.N) {
			colors.n = filters.N
		}

		if (filters.NA) {
			colors.na = filters.NA
		}
		colors.total = colors.high + colors.medium + colors.low + colors.n + colors.na
		return colors
	}

	const handleSearch = async(page, filters) => {
		await setIsItemsLoading(true)

    const fromNum = ((page - 1) * itemsPerPage)
    const items = await getItemsPromise(type, fromNum, itemsPerPage, filters)

		setItemsTotalNum(items.data.total)
    setItems(items.data.records)
		setCurrentPage(page)
		const colors = renderColors(items.data.filters.risk)
		setColors(colors)

    setIsItemsLoading(false)
	}

  const handlePaginationChange = async (value) => {
		let filters = {keyword, optDates, fromDate, toDate, hasMatches, risk, all}
		handleSearch(value, filters)
  }

	const changeFilterRisk = (filterRisk) => {
		setRisk(filterRisk)
		let filters = {keyword, optDates, fromDate, toDate, hasMatches, risk: filterRisk, all}
		handleSearch(1, filters)
	}

  const handleDownloadReport = async () => {
		let filters = {keyword, optDates, fromDate, toDate, hasMatches, risk, all}
		setReporting(true)
    await ReportService.read('/cdi/exportCDIRegistro/' + type, filters, null, t('messages.aml.menu.category.' + type) + '.xlsx')
		setReporting(false)
  }

	const onChangeAllRecords = (value) => {
		let _all = 'NO'
		if(value) _all = 'YES'
		setAll(_all)
		let filters = {keyword, optDates, fromDate, toDate, hasMatches, risk, all: _all}
		handleSearch(1, filters)
	}

	return (
		<div className="tab-monitoring-details">
			<CakeRisks isLoading={ isItemsLoading } total={ itemsTotalNum } handlerFilterRisk={ changeFilterRisk } colors={ colors } />
			<div className="top-bar">
				<div className="excel-download">
					<Button icon={reporting ? 'loading' : 'file-excel'} disabled={reporting} className="btn-export" type="ghost" onClick = {handleDownloadReport} >Exportar Resultado</Button>
				</div>
				<div className="all-records">
					<label>Incluir todos los Registros</label>&nbsp;
					<Switch size="small" checked={ all === 'YES' } onChange={ (value) => onChangeAllRecords(value) } />
				</div>

				<div className={ isAdvancedSearchVisible ? 'advanced-search on' : 'advanced-search' } onClick={ !isAdvancedSearchVisible ? handleShowAdvancedSearch : handleHideAdvancedSearch }>
					<Icon type="menu" /> &nbsp;
					<span>Búsqueda avanzada</span> &nbsp;
					<Icon type={ !isAdvancedSearchVisible ? 'down' : 'close' } />
				</div>
			</div>
			<div className={ isAdvancedSearchVisible === null ? 'filters-wrapper null' : (isAdvancedSearchVisible ? 'filters-wrapper show' : 'filters-wrapper hide') }>
				<div className="filters-wrapper-inner">
					<Filters endpoint="/sdsdaa" onSubmit={handleSubmitFilters} type={'REGISTRO'} />
				</div>
			</div>
			<div className="items-wrapper">
				{ isItemsLoading ? <div className="spinner"><Spin size="large" spinning="true" /></div> : <Table pagination={ false } onRow={ handleTableOnRow } dataSource={ items } columns={ tableColumns } rowClassName="row-form" /> }
			</div>
			{ itemsTotalNum > 0 &&
			<div className="bottom-bar">
			<Pagination onChange={ handlePaginationChange } pageSize={ itemsPerPage } current={ currentPage } total={ itemsTotalNum } />
			</div>
			}
			{ isModalViewMonitoringVisble && <ModalViewMonitoring item={ clickedItem } onCancel={ handleModalCancel } onOk={ handleModalOk } type={ type } /> }
		</div>
	)
}

export default TabMonitoringDetails
