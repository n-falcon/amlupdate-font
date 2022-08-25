import './TabStockTrading.scss'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Button, Icon, Pagination, Table, Spin, Checkbox } from 'antd'
import { Filters, ModalViewMonitoring,ModalViewStockTrading } from '../'
import { getItemsPromise } from './promises'
import { camelizerHelper } from '../../../../helpers/'
import { ReportService } from '../../../../services/'

import { useTranslation } from 'react-i18next';
import { CakeRisks } from './components'

const TabStockTrading = ({ type, currentUser }) => {
	const [items, setItems ] = useState([])
	const [clickedItem, setClickedItem] = useState({})
	const [isAdvancedSearchVisible, setIsAdvancedSearchVisible] = useState(null)
	const [isItemsLoading, setIsItemsLoading] = useState(false)
	const [isModalViewMonitoringVisble, setIsModalViewMonitoringVisible] = useState(false)
	const [isModalViewStockTradingVisble, setIsModalViewStockTradingVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [itemsTotalNum, setItemsTotalNum] = useState(-1)
  const [optDates, setOptDates] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [keyword, setKeyword] = useState('')
  const [hasMatches, setHasMatches] = useState('')
  const [filterRisk, setFilterRisk] = useState([])
	const [colors, setColors ] = useState({total: 0})
	const [ hasEmpresa, setHasEmpresa ] = useState(false)
	const {t} = useTranslation()



	let checking = false
	const [ chkAll , setChkAll ] = useState(false)
	const [fakeItems,setFakeItems] = useState([])
	const [fakeObj,setFakeObj] = useState({
		id: "14792f0c-025a-4e83-8e8d-7bc90ab28dc2",
		name: "Herrera Herrera Aileen Pilar Adela",
		rut:'15461129-0',
		company:'SMU',
		area:'area',
		folio:'D.200721.794',
		auth:'Autorizado',
		authDate:'18/06/2020',
		receivedDate: 1594070082000,
		status: 'NEW',
		completedDate: 1594070082000,
		risk:'Medio',
		sendDate: 1594070082000,
		lastReminder: 1594070082000,
		rule:'Desviación estándar de pagos',
	})
	const showFake = true;

	const pushFakeObj = ()=>{
		const newCollection = [...fakeItems]
	  const lastId = newCollection.length-1
		newCollection.push({...fakeObj,id:lastId+1})
		setFakeItems(newCollection)
		setItemsTotalNum(itemsTotalNum+1)
	}
	
	const popFakeObj = ()=>{
		const newCollection = [...fakeItems]
		newCollection.pop()
		setFakeItems(newCollection)
	}

	const handleSelectDeselectAll = (e) => {
		for(let i=0;i<fakeItems.length;i++) {
			fakeItems[i].checked = e.target.checked
		}
		setChkAll(e.target.checked)
}








	const handleSearch = async(page, filters) => {
		await setIsItemsLoading(true)

    const fromNum = ((page - 1) * itemsPerPage)
    const items = await getItemsPromise(type, fromNum, itemsPerPage, filters.keyword, filters.optDates, filters.fromDate, filters.toDate, filters.filterRisk, filters.hasMatches)

		setItemsTotalNum(items.data.total)
    setItems(items.data.records)
		setCurrentPage(page)
		const colors = renderColors(items.data.filters.risk)
		setColors(colors)

    setIsItemsLoading(false)
	}



	useEffect(() => {
		if(currentUser.cliente.outsourcer && currentUser.cliente.clientes !== null && currentUser.cliente.clientes.length>0 && currentUser.subcliente === null) {
			setHasEmpresa(true)
		}
		handleSearch(1, {})
		setFakeItems([fakeObj])
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleSubmitFilters = async filters => {
		setOptDates(filters.optDates)
	  setFromDate(filters.fromDate)
	  setToDate(filters.toDate)
	  setKeyword(filters.keyword)
	  setHasMatches(filters.hasMatches)

    handleSearch(1, {...filters, filterRisk})
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
			dataIndex: 'name',
			render: (text, record) => <>
						<h3>{ camelizerHelper(text) }</h3>
						<small>{ record.rut }</small>
					</>
		},
		{
			title: 'Empresa / Area',
			dataIndex: 'company',
			render: (text, record) => <>
						<h3>{ text }</h3>
						<small>{ record.area }</small>
					</>
		},
		{
			title: 'Folio',
			dataIndex: 'folio',
			render: (text, record) => <>
						<h3>{ text }</h3>
					</>
		},
		{
			title: 'Autorización',
			dataIndex: 'auth',
			render: (text, record) => <>
						<div>{ text }</div>
						<div>{ record.authDate }</div>
					</>
		},
		{
			title: ()=><>
				<div>Fecha de</div>
				<div>Recepción</div>
			</>,
			dataIndex: 'receivedDate',
			render: (text, record) => <>
						<div>{ moment(text).format('DD/MM/YYYY') }</div>
					</>
		},
		{
			title: ()=><>
				<div>Estado</div>
				<div>Riesgo</div>
			</>,
			dataIndex: 'status',
			render: (text, record) => <>
						<div>{ text }</div>
						<div>{ moment(record.completedDate).format('DD/MM/YYYY') }</div>
						<div>{ record.risk }</div>
					</>
		},
		{
			title: ()=><>
				<div>Fecha de envío</div>
				<div>Ult. Recordatorio</div>
			</>,
			dataIndex: 'sendDate',
			render: (text, record) => <>
						<div>{ moment(text).format('DD/MM/YYYY') }</div>
						<div>{ moment(record.lastReminder).format('DD/MM/YYYY') }</div>
					</>
		},
		{
			title: () => (
				<div clasNAme="recordatorio">Recordatorio
							<Checkbox onChange={ handleSelectDeselectAll } checked={chkAll}/>
				</div>
			),
			dataIndex: 'checked',
			align: 'center',
			render: (text, record) => {
				if(record.status === 'NEW' || record.status === 'OPEN' || record.status === 'SAVED') {
					return <Checkbox checked={text} onChange={() => {
						record.checked = !record.checked
						setChkAll(false)
					}} onClick={() => {
						checking = true
					}}/>
				}
			}
		}


	]

	const handleTableOnRow = (record, index) => {
		return {
			onClick: e => {
				setClickedItem(record)
				if(!checking) {
					setIsModalViewStockTradingVisible(true)
				}
			}
		}
	}

	const handleModalCancel = () => {
		setIsModalViewStockTradingVisible(false)
	}

	const handleModalOk = () => {
		setIsModalViewStockTradingVisible(false)
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



  const handlePaginationChange = async (value) => {
		let filters = {keyword, optDates, fromDate, toDate, hasMatches, filterRisk}
		handleSearch(value, filters)
  }



  const handleDownloadReport = async () => {
		let filters = {keyword, optDates, fromDate, toDate, hasMatches, risk: filterRisk}
    await ReportService.read('/cdi/exportCDIRegistro/' + type, filters, null, t('messages.aml.menu.category.' + type) + '.xlsx')
  }

	return (
		<div className="tab-stock-trading">
    <div className="top-bar">
      <div className="excel-download">
      <Button icon="file-excel" className="btn-reminders" type="ghost" onClick = {handleDownloadReport} >Exportar Resultado</Button>
      </div>
			{
				showFake &&
				<>	
				<div className="excel-download">
				<Button className="btn-add-fake" type="ghost" onClick = {pushFakeObj} >Add Fake</Button>
				</div>
	
				<div className="excel-download">
				<Button className="btn-pop-fake" type="ghost" onClick = {popFakeObj} >Pop Fake</Button>
				</div>
				</>
			}


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
			{ isItemsLoading ? <div className="spinner"><Spin size="large" spinning="true" /></div> : <Table pagination={ false } onRow={ handleTableOnRow } dataSource={ fakeItems } columns={ tableColumns } rowClassName="row-form" /> }
		</div>
		{ itemsTotalNum > 0 &&
        <div className="bottom-bar">
          <Pagination onChange={ handlePaginationChange } pageSize={ itemsPerPage } current={ currentPage } total={ itemsTotalNum } />
        </div>
		}
		{ isModalViewStockTradingVisble && <ModalViewStockTrading item={ clickedItem } onCancel={ handleModalCancel } onOk={ handleModalOk } type={ type } /> }
		</div>
	)
}

export default TabStockTrading
