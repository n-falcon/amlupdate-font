import './TabMatchingDetails.scss'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Button, Icon, Pagination, Table, Spin } from 'antd'
import { Filters, ModalViewMatch } from '../'
import { getItemsPromise } from './promises'
import { camelizerHelper } from '../../../../helpers/'
import { useTranslation } from 'react-i18next';


const TabMatchingDetails = ({ type, currentUser }) => {
	const [items, setItems ] = useState([])
	const [clickedItem, setClickedItem] = useState({})
	const [isAdvancedSearchVisible, setIsAdvancedSearchVisible] = useState(null)
	const [isItemsLoading, setIsItemsLoading] = useState(false)
	const [isModalViewMatchVisble, setIsModalViewMatchVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [itemsTotalNum, setItemsTotalNum] = useState(-1)
  const [optDates, setOptDates] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [keyword, setKeyword] = useState('')
  const [hasMatches, setHasMatches] = useState('')
	const [status, setStatus] = useState('')
	const [risk, setRisk] = useState('')
	const [ hasEmpresa, setHasEmpresa ] = useState(false)
	const {t} = useTranslation()

	useEffect(() => {
		if(currentUser.cliente.outsourcer && currentUser.cliente.clientes !== null && currentUser.cliente.clientes.length>0 && currentUser.subcliente === null) {
			setHasEmpresa(true)
		}
		handlePaginationChange(1)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleSubmitFilters = async value => {
		setOptDates(value.optDates)
	  setFromDate(value.fromDate)
	  setToDate(value.toDate)
	  setKeyword(value.keyword)
	  setHasMatches(value.hasMatches)
		setStatus(value.status)
		setRisk(value.risk)

    handleSearch(1, value)
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
      width: 300,
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
			title: 'Folio',
			dataIndex: 'folio'
		},

    {
			title: 'Fecha de Solicitud',
			dataIndex: 'creationDate',
			render: (text) => {
				return text !== null ? moment(text).format('DD/MM/YYYY') : '-'
			}
		},

  	{
			title: 'Estado',
			dataIndex: 'status',
			width: 110,
			render: (text) => {
				return t('messages.aml.cdi.status.'+text)
			}
		},
	  {
			title: 'Vínculos',
			dataIndex: 'hasPositives',
			render: (text) => {
				return text && <div className="has-positives">Sí</div>
			}
		},
	]

	const handleTableOnRow = (record, index) => {
		return {
			onClick: e => {
				setClickedItem(record)
				setIsModalViewMatchVisible(true)
			}
		}
	}

	const handleModalCancel = () => {
		setIsModalViewMatchVisible(false)
	}

	const handleModalOk = () => {
		setIsModalViewMatchVisible(false)
	}

	const handleSearch = async(page, filters) => {
		await setIsItemsLoading(true)

    const fromNum = ((page - 1) * itemsPerPage)

    const items = await getItemsPromise(type, fromNum, itemsPerPage, filters.keyword, filters.optDates, filters.fromDate, filters.toDate, filters.status, filters.hasMatches, filters.risk)
		setItemsTotalNum(items.data.total)
    setItems(items.data.records)
		setCurrentPage(page)

    setIsItemsLoading(false)
	}

  const handlePaginationChange = async (value) => {
		let filters = {keyword, optDates, fromDate, toDate, status, hasMatches, risk}
		handleSearch(value, filters)
  }

	return (
		<div className="tab-matching-details">
		<div className="top-bar">
			<div className={ isAdvancedSearchVisible ? 'advanced-search on' : 'advanced-search' } onClick={ !isAdvancedSearchVisible ? handleShowAdvancedSearch : handleHideAdvancedSearch }>
				<Icon type="menu" /> &nbsp;
				<span>Búsqueda avanzada</span> &nbsp;
				<Icon type={ !isAdvancedSearchVisible ? 'down' : 'close' } />
			</div>
		</div>
		<div className={ isAdvancedSearchVisible === null ? 'filters-wrapper null' : (isAdvancedSearchVisible ? 'filters-wrapper show' : 'filters-wrapper hide') }>
			<div className="filters-wrapper-inner">
				<Filters endpoint="/sdsdaa" onSubmit={handleSubmitFilters} type={type} type="MATCH" />
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
		{ isModalViewMatchVisble && <ModalViewMatch item={ clickedItem } onCancel={ handleModalCancel } onOk={ handleModalOk } /> }
		</div>
	)
}

export default TabMatchingDetails
