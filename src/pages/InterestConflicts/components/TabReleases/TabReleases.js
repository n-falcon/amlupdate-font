import './TabReleases.scss'
import React, { useCallback, useEffect, useState } from 'react'
import moment from 'moment'
import { Button, Icon, Pagination, Spin, Switch, Table } from 'antd'
import { Filters, ModalNewRelease } from '../'
import { changeItemStatusPromise, getItemsPromise } from './promises'
import conflictImg from '../ModalNewRelease/conflict.png'
import giftImg from '../ModalNewRelease/gift.png'
import partnershipImg from '../ModalNewRelease/partnership.png'
import travelImg from '../ModalNewRelease/travel.png'
import publicServantImg from '../ModalNewRelease/public-servant.png'
import { ReportService } from '../../../../services/'
import { useTranslation } from 'react-i18next'

const TabReleases = ({ type, currentUser, reloadCategories }) => {
	const [ items, setItems ] = useState([])
	const [ isAdvancedSearchVisible, setIsAdvancedSearchVisible ] = useState(null)
	const [ isModalNewReleaseVisible, setIsModalNewReleaseVisible ] = useState(false)
	const [ isItemsLoading, setIsItemsLoading ] = useState(true)
	const [ clickedItem, setClickedItem ] = useState({})
  const [itemsTotalNum, setItemsTotalNum] = useState(-1)

	const { t } = useTranslation()

	const handleGetItems = async () => {
		await setIsItemsLoading(true)

		const i = await getItemsPromise(type)

		await setItems(i.data)

		setIsItemsLoading(false)
	}

	useEffect(() => {
		handleGetItems()
	}, [])

	const handleEditItem = async (index) => {
		await setClickedItem(items[index])

		setIsModalNewReleaseVisible(true)
	}

	const handleShowAdvancedSearch = () => {
		setIsAdvancedSearchVisible(true)
	}

	const handleHideAdvancedSearch = () => {
		setIsAdvancedSearchVisible(false)
	}

  const handleItemStatusChange = async (id) => {
		await changeItemStatusPromise(id)
	}

	const handleSubmitFilters = async value => {
    const { keyword, optDates, fromDate, toDate, status, hasMatches } = value

    await setIsItemsLoading(true)

    const i = await getItemsPromise(type, keyword, optDates, fromDate, toDate, status, hasMatches)

    await setItems(i.data)
    await setItemsTotalNum(i.data.total)

    await setIsItemsLoading(false)
  }

	const handleNewRelease = () => {
		setClickedItem(null)
		setIsModalNewReleaseVisible(true)
	}

	const handleModalClose = async () => {
		await setIsModalNewReleaseVisible(false)

		handleGetItems()
		reloadCategories()
	}

	const getTableColumns = () => {
		let columns = [
			{
				title: 'Categoría / Tipo',
				dataIndex: 'type',
				width: 140,
				render: ((text, record) => {
					return <>
						<div>{t('messages.aml.category.' + record.category)}</div>
						<div>{t('messages.aml.type.' + record.type)}</div>
					</>
				})
			},
			{
				title: 'Nombre',
				dataIndex: 'subject',
	      width: 250,
				ellipsis: true,
	      style: {width: '300px !important'}
			},
			{
				title: 'Nro',
				dataIndex: 'nroRecipients',
				width: 50
			},
			{
				title: 'Fecha de envío',
				dataIndex: 'startDate',
				render: (text => {
					return moment(text).format('DD/MM/YYYY')
				})
			}
		]
		if(type === 'I') {
			columns.push({
				title: 'Periodicidad',
				dataIndex: 'periodicity',
				render: (text => {
					switch(text) {
						case 'ANNUAL':
							return '12 meses'

						case 'BIANNUAL':
							return '6 meses'

						default:
							return '4 meses'
					}
				})
			})
		}
		columns.push(
			{
				title: 'Métricas',
				width: 175,
				render: ((text, record) => {
					const receivedRatio = parseInt(100 * record.received / record.nroRecipients)
					const openRatio = record.received > 0 ? parseInt(100 * record.open / record.received) : 0
					const completedRatio = parseInt(100 * record.sentForm / record.nroRecipients)

					return (
						<div className="metrics-wrapper">
							<ul>
								<li>
									<div className="bar-wrapper">
										<span className="label">Recibidos ({ record.received })</span>
										<div className="bar">
											<div className="bar-inner" style={{ width: receivedRatio }}>
											</div>
											&nbsp;{ receivedRatio > 0 ? receivedRatio + '%': '-' }
										</div>
									</div>
								</li>
								<li>
									<div className="bar-wrapper">
										<span className="label">Abiertos ({ record.open })</span>
										<div className="bar">
											<div className="bar-inner" style={{ width: openRatio }}>
											</div>
											&nbsp;{ openRatio > 0 ? openRatio + '%' : '-' }
										</div>
									</div>
								</li>
								<li>
									<div className="bar-wrapper">
										<span className="label">Completados ({ record.sentForm })</span>
										<div className="bar">
											<div className="bar-inner" style={{ width: completedRatio }}>
											</div>
											&nbsp;{ completedRatio > 0 ? completedRatio + '%' : '-' }
										</div>
									</div>
								</li>
							</ul>
						</div>
					)
				})
			}
		)
    if(type === 'I') {
			columns.push({
				title: 'Activo',
				width: 50,
				dataIndex: 'active',
				render: ((text, record) => {
					return <Switch defaultChecked={ text === 'ACTIVE' } onChange={ () => handleItemStatusChange(record.id) } size="small" />
				})
			})
		}
		columns.push(
			{
				title: 'Acciones',
				width: 100,
				render: ((text, record, index) => {
					return (
						<>
							{ type === 'I' && <div className="edit-action" onClick={ () => handleEditItem(index) }><Icon type="edit" /> Editar</div> }
							<div className="download-report" onClick={ () => handleDownloadReport(record) }><Icon type="cloud-download" /> Descargar</div>
						</>
					)
				})
			}
		)
		return columns
	}

	const handleDownloadReport = async (record) => {
		await ReportService.read('/cdi/excelDeclaration/' + record.id, null, null, record.clasif + "-" + moment(record.startDate).format('YYYYMMDD') + "-rep.xlsx")
	}

	return (
		<div className="tab-releases">
			<div className="top-bar">
				<Button icon="plus" onClick={ handleNewRelease } type="primary">Nuevo comunicado</Button>
				<div className={ isAdvancedSearchVisible ? 'advanced-search on' : 'advanced-search' } onClick={ !isAdvancedSearchVisible ? handleShowAdvancedSearch : handleHideAdvancedSearch }>
					<Icon type="menu" /> &nbsp;
					<span>Búsqueda avanzada</span> &nbsp;
					<Icon type={ !isAdvancedSearchVisible ? 'down' : 'close' } />
				</div>
			</div>
			<div className={ isAdvancedSearchVisible === null ? 'filters-wrapper null' : (isAdvancedSearchVisible ? 'filters-wrapper show' : 'filters-wrapper hide') }>
				<div className="filters-wrapper-inner">
					<Filters endpoint="/sdsdaa" onSubmit={handleSubmitFilters} type="COM" />
				</div>
			</div>
			<div className="items-wrapper">
				{ isItemsLoading ? <div className="spinner"><Spin size="large" spinning="true" /></div> : <Table dataSource={ items } columns={ getTableColumns() } /> }
			</div>
      <div className="bottom-bar" />
			{ isModalNewReleaseVisible && <ModalNewRelease isVisible={ isModalNewReleaseVisible } record={ clickedItem } onClose={ handleModalClose } type={ type } currentUser={currentUser} /> }
		</div>
	)
}

export default TabReleases
