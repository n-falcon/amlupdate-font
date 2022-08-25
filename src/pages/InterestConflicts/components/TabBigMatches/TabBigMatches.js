import './TabBigMatches.scss'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Button, Icon, Pagination, Table, Spin, Switch } from 'antd'
import { Filters, ModalViewItem } from '../'
import { getItemsPromise } from './promises'
import { camelizerHelper } from '../../../../helpers/'


const TabMatches = ({ type, currentUser }) => {
	const [items, setItems ] = useState([])
	const [clickedItem, setClickedItem] = useState({})
	const [isAdvancedSearchVisible, setIsAdvancedSearchVisible] = useState(null)
	const [isItemsLoading, setIsItemsLoading] = useState(false)
	const [isModalViewItemVisble, setIsModalViewItemVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [itemsTotalNum, setItemsTotalNum] = useState(-1)
  const [optDates, setOptDates] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [keyword, setKeyword] = useState('')
  const [hasMatches, setHasMatches] = useState('')
  const [status, setStatus] = useState('')
	const [ hasEmpresa, setHasEmpresa ] = useState(false)

	const handleGetItems = async () => {
		setIsItemsLoading(true)

		const i = await getItemsPromise('COLABORADOR', 0, itemsPerPage)

		await setItems(i.data.records)
    await setItemsTotalNum(i.data.total)

		setIsItemsLoading(false)
	}

	useEffect(() => {
		if(currentUser.cliente.outsourcer && currentUser.cliente.clientes !== null && currentUser.cliente.clientes.length>0 && currentUser.subcliente === null) {
			setHasEmpresa(true)
		}
		handleGetItems()
	}, [])

	const handleSubmitFilters = async value => {
		setOptDates(value.optDates)
	  setFromDate(value.fromDate)
	  setToDate(value.toDate)
	  setKeyword(value.keyword)
	  setHasMatches(value.hasMatches)
	  setStatus(value.status)

    handleSearch(1, value)
  }

	const handleShowAdvancedSearch = () => {
		setIsAdvancedSearchVisible(true)
	}

	const handleHideAdvancedSearch = () => {
		setIsAdvancedSearchVisible(false)
	}

	const tableColumns = [
		type === 'ALLBIG' ? {
			title: 'Nombre',
			dataIndex: 'name',
      width: 200,
			render: ((text, record) => {
				return (
					<>
						<h3>Nombre x default</h3>
					</>
				)
			})
		} : {},
    type !== 'ALLBIG' ? {
      title: 'Nombre / RUT',
      dataIndex: 'name',
      width: 150,
      render: ((text, record) => {
        return (
          <>
            <h3>Nombre x default</h3>
            <small>23.222.222-4</small>
          </>
        )
      })
    } : {},
    type === 'ALLBIG' ? {
			title: 'Stakeholder 1 / Cantidad',
			dataIndex: 'company',
      width: 150,
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
		} : {},
    type === 'ALLBIG' ? {
      title: 'Stakeholder 2 / Cantidad',
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
    } : {},
    type !== 'ALLBIG' ? {
      title: 'Stakeholder',
      dataIndex: 'folio'
    } : {},
    type !== 'ALLBIG' ? {
      title: 'Empresa / Área',
      dataIndex: 'area'
    } : {},
		type === 'ALLBIG' ?{
			title: 'Fecha de solicitud',
			dataIndex: 'folio'
		} : {},
    type === 'ALLBIG' ? {
      title: 'Revisión contínua',
      dataIndex: 'folio',
      render: (text => <Switch size="small" />)
    } : {},
    type === 'ALLBIG' ? {
      title: 'Avance',
      dataIndex: 'folio'
    } : {},
    type === 'ALLBIG' ? {
      title: 'Acciones',
      dataIndex: 'folio'
    } : {},
    type !== 'ALLBIG' ? {
      title: 'Folio',
      dataIndex: 'folio'
    } : {},
    type !== 'ALLBIG' ? {
      title: 'Estado / Fecha',
      dataIndex: 'folio'
    } : {},
    type !== 'ALLBIG' ? {
      title: 'Cruce Positivo',
      dataIndex: 'folio'
    } : {},
	]

	const handleTableOnRow = (record, index) => {
		return {
			onClick: async e => {
				//await setClickedItem(record)
				//setIsModalViewItemVisible(true)
			}
		}
	}

	const handleModalCancel = () => {
		setIsModalViewItemVisible(false)
	}

	const handleModalOk = () => {
		setIsModalViewItemVisible(false)
	}

	const handleSearch = async(page, filters) => {
		await setIsItemsLoading(true)

    const fromNum = ((page - 1) * itemsPerPage)

    const items = await getItemsPromise(type, fromNum, itemsPerPage, filters.keyword, filters.optDates, filters.fromDate, filters.toDate, filters.status, filters.hasMatches)
		setItemsTotalNum(items.data.total)
    setItems(items.data.records)
		setCurrentPage(page)

    setIsItemsLoading(false)
	}

  const handlePaginationChange = async (value) => {
		let filters = {keyword, optDates, fromDate, toDate, status, hasMatches}
		handleSearch(value, filters)
  }

	return (
		<div className="tab-big-matches">
		<div className="top-bar">
    { type === 'ALLBIG' && <Button icon="plus" type="primary">Nueva Solicitud de Match</Button> }

			<div className={ isAdvancedSearchVisible ? 'advanced-search on' : 'advanced-search' } onClick={ !isAdvancedSearchVisible ? handleShowAdvancedSearch : handleHideAdvancedSearch }>
				<Icon type="menu" /> &nbsp;
				<span>Búsqueda avanzada</span> &nbsp;
				<Icon type={ !isAdvancedSearchVisible ? 'down' : 'close' } />
			</div>
		</div>
		<div className={ isAdvancedSearchVisible === null ? 'filters-wrapper null' : (isAdvancedSearchVisible ? 'filters-wrapper show' : 'filters-wrapper hide') }>
			<div className="filters-wrapper-inner">
				<Filters endpoint="/sdsdaa" onSubmit={handleSubmitFilters} type={type} />
			</div>
		</div>
		<div className="items-wrapper">
			{ isItemsLoading ? <div className="spinner"><Spin size="large" spinning="true" /></div> : <Table pagination={ false } onRow={ handleTableOnRow } dataSource={ items } columns={ tableColumns } /> }
		</div>
        <div className="bottom-bar">
          <Pagination onChange={ handlePaginationChange } pageSize={ itemsPerPage } current={ currentPage } total={ itemsTotalNum } />
        </div>
		{ isModalViewItemVisble && <ModalViewItem item={ clickedItem } onCancel={ handleModalCancel } onOk={ handleModalOk } type={ type } /> }
		</div>
	)
}

export default TabMatches
