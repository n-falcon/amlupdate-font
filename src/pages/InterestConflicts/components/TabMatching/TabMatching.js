import './TabMatching.scss'
import React, { useEffect, useState, useRef } from 'react'
import moment from 'moment'
import { Button, Icon, Pagination, Spin, Switch, Table } from 'antd'
import { Filters, ModalMatchRequest } from '../'
import { changeMatchStatusPromise, getItemsPromise } from './promises'
import { ReportService } from '../../../../services/'
import { useTranslation } from 'react-i18next'

const TabMatching = ({ currentUser, reloadCategories }) => {
	const [ items, setItems ] = useState([])
	const [ isAdvancedSearchVisible, setIsAdvancedSearchVisible ] = useState(null)
	const [ isModalMatchRequestVisible, setIsModalMatchRequestVisible ] = useState(false)
	const [ isItemsLoading, setIsItemsLoading ] = useState(true)
	const [ isReportLoading, setIsReportLoading ] = useState(false)
	const [ clickedItem, setClickedItem ] = useState({})
	const [itemsTotalNum, setItemsTotalNum] = useState(-1)
	const [currentPage, setCurrentPage] = useState(1)
  const [optDates, setOptDates] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [keyword, setKeyword] = useState('')
  const [hasMatches, setHasMatches] = useState('')
  const [status, setStatus] = useState('')
	const itemsPerPage  = 10
	const { t } = useTranslation()

	function useInterval(callback, delay) {
		const savedCallback = useRef();

		useEffect(() => {
			savedCallback.current = callback;
		});

		useEffect(() => {
			function tick() {
				savedCallback.current();
			}

			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}, [delay]);
	}

	useEffect(() => {
		handlePaginationChange(1, true)
	}, [])

	useInterval(() => {
		handlePaginationChange(currentPage, false)
	}, 5000)

	const handleSearch = async(page, filters, loading) => {
		if(loading !== false) setIsItemsLoading(true)

		const fromNum = ((page - 1) * itemsPerPage)
		const i = await getItemsPromise(fromNum, itemsPerPage, filters.keyword, filters.optDates, filters.fromDate, filters.toDate, filters.status, filters.hasMatches)
		setItems(i.data.records)
		setItemsTotalNum(i.data.total)
		setCurrentPage(page)

		if(loading !== false) setIsItemsLoading(false)
	}

	const handlePaginationChange = async (value, loading) => {
		let filters = {keyword, optDates, fromDate, toDate, status, hasMatches}
		handleSearch(value, filters, loading)
  }

	const handleSubmitFilters = async value => {
		setOptDates(value.optDates)
		setFromDate(value.fromDate)
		setToDate(value.toDate)
		setKeyword(value.keyword)
		setHasMatches(value.hasMatches)
		setStatus(value.status)

		handleSearch(1, value, true)
	}

	const handleShowAdvancedSearch = () => {
		setIsAdvancedSearchVisible(true)
	}

	const handleHideAdvancedSearch = () => {
		setIsAdvancedSearchVisible(false)
	}

	const handleMatchRequest = () => {
		setClickedItem(null)
		setIsModalMatchRequestVisible(true)
	}

	const handleModalClose = async () => {
		await setIsModalMatchRequestVisible(false)

		handlePaginationChange(currentPage, true)
		reloadCategories()
	}

	const getLevelDescription = (level) => {
			if(level === 'UBO') return 'UBOs'
			else if(level === 'PARENT') return 'Parientes'
			else if(level === 'PARENT-UBO') return 'Parientes UBOs'
	}

	const tableColumns = [
		{
			title: 'Nombre',
			className: 'nombre',
			dataIndex: 'subject',
      width: 175,
      style: {width: '250px !important'}
		},
		{
			title: ()=>(
				<>
					<div>
						Categoría 1
					</div>
					<div>
						Cantidad
					</div>
				</>
			)
			,
			className: 'categoria1',
			dataIndex: 'group1.category',
			// width: 100,
			render: (text,record) => {
				return (
					<>
						<div>{t('messages.aml.category.'+text)}</div>
						<small>{record.group1.nroRecipients}</small>
					</>
				)
			}
		},
		{
			title: ()=>(
				<>
					<div>
						Categoría 2
					</div>
					<div>
						Cantidad
					</div>
				</>
			),
			dataIndex: 'group2.category',
			className: 'categoria2',
			// width: 100,
			render: (text,record) => {
				if(record.group2 !== null) {
					return (
						<>
							<div>{t('messages.aml.category.'+text)}</div>
							<small>{record.group2.nroRecipients}</small>
						</>
					)
				}
			}
		},
		{
			title: 'Folio',
			className: 'folio',
			dataIndex: 'folio',
			// width: 100,
		},
		{
			title: ()=>(
				<>
					<div>
						Fecha de
					</div>
					<div>
						Solicitud
					</div>
				</>
			),
			dataIndex: 'creationDate',
      // width: 100,
			style: {width: '300px !important'},
			render: ((text) => {
				return text !== null ? moment(text).format('DD/MM/YYYY') : '-'
			})
		},
		{
			title: 'Niveles',
			className: 'creation-date',
			dataIndex: 'periodicity',
			// width: 120,
			render: ((text, record) => {
				if(record.levels !== null) {
					return (
						<>
							{ record.levels.map((level, index) =>
								<div className="level-match"><Icon type="check" size="small"/>{getLevelDescription(level)}</div>
							)}
						</>
					)
				}
			})
		},
		{
			title: 'Estado',
			dataIndex: 'status',
			render: (text, record) => {
				const percent = parseInt(100 * record.completed / record.total)
				return (
					<>
					<div>{t('messages.aml.cdi.status.'+text)}</div>
					{ text === 'PROCESSING' &&
					<div className="bar">
						<div className="bar-inner" style={{ width: (record.total > 0 ? percent : 0) + '%' }}>
						</div>
						&nbsp;{ record.total > 0 ? percent + '%' : '-' }
					</div>
					}
					{ text === 'REJECTED' &&
						<small>{moment(record.dateStatus).format('DD/MM/YYYY')}</small>
					}
					</>
				)
			}
			// width: 110,

		},

		{
			title: 'Acciones',
			// width: 90,
			render: ((text, record, index) => {
				return (
					<>
						<div className="download-report" onClick={ () => handleDownloadReport(record) }><Icon type={isReportLoading && clickedItem.id === record.id ? 'loading' : 'cloud-download'} /> Reporte</div>
					</>
				)
			})
		}
	]

	const handleDownloadReport = async (record) => {
		if(!isReportLoading) {
			setClickedItem(record)
			setIsReportLoading(true)
			await ReportService.read('/cdi/exportMatchRequest/' + record.id, null, null, 'match-'+ record.folio+ ".xlsx")
			setIsReportLoading(false)
			setClickedItem(null)
		}
	}

	return (
		<div className="tab-matching">
			<div className="top-bar">
				<Button icon="plus" onClick={ handleMatchRequest } type="primary">Nueva solicitud</Button>
				<div className={ isAdvancedSearchVisible ? 'advanced-search on' : 'advanced-search' } onClick={ !isAdvancedSearchVisible ? handleShowAdvancedSearch : handleHideAdvancedSearch }>
					<Icon type="menu" /> &nbsp;
					<span>Búsqueda avanzada</span> &nbsp;
					<Icon type={ !isAdvancedSearchVisible ? 'down' : 'close' } />
				</div>
			</div>
			<div className={ isAdvancedSearchVisible === null ? 'filters-wrapper null' : (isAdvancedSearchVisible ? 'filters-wrapper show' : 'filters-wrapper hide') }>
				<div className="filters-wrapper-inner">
					<Filters endpoint="/sdsdaa" onSubmit={handleSubmitFilters} type="NEWMATCH" />
				</div>
			</div>
			<div className="items-wrapper">
				{ isItemsLoading ?
					<div className="spinner"><Spin size="large" spinning="true" /></div> :
					<Table className="matching-table" dataSource={ items } columns={ tableColumns } pagination={ false } />
				}
			</div>
			{ itemsTotalNum > 0 &&
				<div className="bottom-bar">
					<Pagination onChange={ handlePaginationChange } pageSize={ itemsPerPage } current={ currentPage } total={ itemsTotalNum } />
				</div>
			}
			{ isModalMatchRequestVisible && <ModalMatchRequest isVisible={ isModalMatchRequestVisible } record={ clickedItem } onClose={ handleModalClose } currentUser={currentUser} /> }
		</div>
	)
}

export default TabMatching
