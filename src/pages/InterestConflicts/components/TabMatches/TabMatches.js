import './TabMatches.scss'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Button, Icon, Pagination, Table, Spin, Checkbox, Modal, Dropdown, Menu } from 'antd'
import { ModalViewItem } from '../'
import { deleteDeclarationsPromise, getItemsPromise, sendRemindersPromise } from './promises'
import { camelizerHelper } from '../../../../helpers/'
import { useTranslation } from 'react-i18next'
import { ReportService } from '../../../../services/'
import { AdvancedTabs } from './components';
const { confirm } = Modal;


const TabMatches = ({ type, currentUser }) => {
	const [items, setItems] = useState([])
	const [clickedItem, setClickedItem] = useState({})
	const [isAdvancedSearchVisible, setIsAdvancedSearchVisible] = useState(null)
	const [isItemsLoading, setIsItemsLoading] = useState(false)
	const [isModalViewItemVisble, setIsModalViewItemVisible] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsTotalNum, setItemsTotalNum] = useState(-1)
	const [hasEmpresa, setHasEmpresa] = useState(false)
	const [enableReminders, setEnableReminders] = useState(false)
	const [chkAll, setChkAll] = useState(false)
	const [rnd, setRnd] = useState(0)
	const itemsPerPage = 10
	const [filters, setFilters] = useState({});
	let checking = false
	const { t } = useTranslation()

	useEffect(() => {
		if (currentUser.cliente.outsourcer && currentUser.cliente.clientes !== null && currentUser.cliente.clientes.length > 0 && currentUser.subcliente === null) {
			setHasEmpresa(true)
		}
		handlePaginationChange(1)
	}, [])

	const handleExportReport = async () => {
		await ReportService.read('/cdi/exportDeclarationsByType/' + type, { ...filters, from: 0, size: 10000 }, null, (type === 'COLABORADOR' || type === 'PROVEEDOR' || type === 'CLIENTE' || type === 'DIRECTOR' ? t(`messages.aml.menu.category.${type}`) : t(`messages.aml.type.${type}`)) + ".xlsx")
	}


	const handleShowAdvancedSearch = () => {
		setIsAdvancedSearchVisible(true)
	}

	const handleHideAdvancedSearch = () => {
		setIsAdvancedSearchVisible(false)
	}

	const handleSelectDeselectAll = (e) => {
		for (let i = 0; i < items.length; i++) {
			items[i].checked = e.target.checked
		}
		setChkAll(e.target.checked)
		setEnableReminders(e.target.checked)
	}

	const getTableColumns = () => {
		let tableColumns = [
			{
				title: () => (
					<>
						<div>Nombre</div>
						<div>Rut</div>
					</>
				),
				dataIndex: 'name',
				width: '25%',
				//align: 'left',
				ellipsis: true,
				render: ((text, record) => {
					return (
						<>
							<div>{camelizerHelper(text)}</div>
							<div>{record.rut}</div>
						</>
					)
				})
			},
			{
				title: () => (
					hasEmpresa ?
					<>
						<div>Empresa</div>
						<div>Area</div>
					</>
					:
					<>Area</>
				),
				dataIndex: 'company',
				width: '20%',
				//align: 'center',
				ellipsis: true,
				render: ((text, record) => {
					if (hasEmpresa) {
						return (
							<>
								<div>{text ? text : '-'}</div>
								<div>{record.area ? record.area : '-'}</div>
							</>
						)
					} else {
						return record.area !== null ? record.area : '-'
					}
				})
			},
			{
				title: () => (
						(type === 'COLABORADOR' || type === 'PROVEEDOR' || type === 'CLIENTE' || type === 'DIRECTOR') ?
						<>
							<div>Estado</div>
							<div>Folio</div>
						</>
						:
						<div>Folio</div>
				),
				width: '15%',
				//align: 'center',
				dataIndex: 'status',
				render: (text, record) => {
						let status

						switch (text) {
							case 'NEW':
								status = 'Enviado'
								break
							case 'OPEN':
								status = 'Enviado'
								break
							case 'SAVED':
								status = 'Enviado'
								break
							case 'SENT':
								status = 'Completado'
								break
							default:
						}

						return (
							(type === 'COLABORADOR' || type === 'PROVEEDOR' || type === 'CLIENTE' || type === 'DIRECTOR') ?
								<>
									<div>{status}</div>
									<div>{record.folio}</div>
								</>
								:
								<div>{record.folio}</div>
						)
				}
			}
		]
		if (type === 'COLABORADOR' || type === 'PROVEEDOR' || type === 'CLIENTE' || type === 'DIRECTOR') {
			tableColumns.push(
				{
					title: () => (
						<>
							<div>Solicitud</div>
							<div>Completado</div>
						</>
					),
					dataIndex: 'creationDate',
					width: 'auto',
					width: '10%',
					align: 'center',
					render: (text, record) => {
						return <>
							<div>{moment(text).format('DD/MM/YYYY')}</div>
							<div>{record.receiveDate ? moment(record.receiveDate).format('DD/MM/YYYY') : '-'}</div>
						</>
					}
				},
				{
					title: () => (
						<>
							<div>Vínculos</div>
							<div>Riesgo</div>
						</>
					),
					dataIndex: 'hasPositives',
					width: '10%',
					align: 'center',
					render: ((text, record) => {
						return <>
							<div className="has-positives">{ text && 'Sí'}</div>
							<div>{record.risk !== null ? t('messages.aml.risk.' + record.risk) : record.status === 'SENT' ? 'No asignado' : '-'}</div>
						</>
					})
				},
				{
					title: () => (
						<>
							<div>Ultimo</div>
							<div>Recordatorio</div>
						</>
					),
					dataIndex: 'lastReminder',
					width: '10%',
					align: 'center',
					render: ((text, record) => {
						if (text !== null) {
							return (
									<div>{moment(text).format('DD/MM/YYYY')}</div>
							)
						} else return '-'
					})
				},
				{
					title: () => (
						<div>
							<Checkbox onChange={handleSelectDeselectAll} checked={chkAll} />
						</div>
					),
					dataIndex: 'checked',
					width: '10%',
					align: 'center',
					render: (text, record) => {
						if (record.status === 'NEW' || record.status === 'OPEN' || record.status === 'SAVED') {
							return <Checkbox checked={text} onChange={() => {
								record.checked = !record.checked
								setChkAll(false)
								setRnd(Math.random())

								setEnableReminders(false)
								for (let i = 0; i < items.length; i++) {
									if (items[i].checked === true) {
										setEnableReminders(true)
									}
								}
							}} onClick={() => {
								checking = true
							}} />
						}
					}
				}
			)
		} else {
			tableColumns.push(
				{
					title: () => (
						<>
							<div>Fecha</div>
							<div>de recepción</div>
						</>
					),
					dataIndex: 'receiveDate',
					// width: 100,
					width: 'auto',
					render: (text => {
						return text !== null ? moment(text).format('DD/MM/YYYY') : '-'
					})
				}
			)
		}

		if (type === 'GIFT' || type === 'TRAVEL') {
			tableColumns.push(
				{
					title: 'Autorización',
					dataIndex: 'autDate',
					render: (text, record) => {
						if (record.authorized !== null) {
							return (
								<>
									<div>{record.authorized ? 'Autorizado' : 'Rechazado'}</div>
									<small>{moment(text).format('DD/MM/YYYY')}</small>
								</>
							)
						} else {
							return '-'
						}
					}
				}
			)
		}
		if (type === 'TRAVEL' || type === 'GIFT' || type === 'FP' || type === 'SOC') {
			tableColumns.push(
				{
					title: 'Riesgo',
					dataIndex: 'risk',
					render: (text, record) => {
						if (text !== null) {
							return t('messages.aml.risk.' + text)
						} else {
							return '-'
						}
					}
				}
			)
		}
		return tableColumns
	}

	const handleTableOnRow = (record, index) => {
		return {
			onClick: async e => {
				setClickedItem(record)
				if (!checking) {
					setIsModalViewItemVisible(true)
				}
			}
		}
	}

	const handleModalCancel = () => {
		setIsModalViewItemVisible(false)
	}

	const handleModalOk = () => {
		setIsModalViewItemVisible(false)
	}

	const handleSearch = async (page, filters) => {
		setIsItemsLoading(true)
		const fromNum = ((page - 1) * itemsPerPage)
		filters.from = fromNum;
		filters.size = itemsPerPage;
		const items = await getItemsPromise(type, filters)
		setItemsTotalNum(items.data.total)
		setItems(items.data.records)
		setCurrentPage(page)
		setChkAll(false)
		setIsItemsLoading(false)
		setEnableReminders(false)
	}


	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handlePaginationChange = async (value) => {
		handleSearch(value, filters)
	}

	const sendReminders = () => {
		let ids = []
		if (!chkAll) {
			for (let i = 0; i < items.length; i++) {
				if (items[i].checked === true) {
					ids.push(items[i].id)
				}
			}
		}
		sendRemindersPromise(type, filters, ids).then(res => {
			setIsItemsLoading(true)
			setTimeout(() => {
				setChkAll(false)
				handlePaginationChange(currentPage)
				setIsItemsLoading(false)
			}, 1500)
		})
	}


	const deleteForms = () =>  {
		let ids = []
		if (!chkAll) {
			for (let i = 0; i < items.length; i++) {
				if (items[i].checked === true) {
					ids.push(items[i].id)
				}
			}
		}
		deleteDeclarationsPromise(type, filters, ids).then(res => {
			setIsItemsLoading(true)
			setTimeout(() => {
				setChkAll(false)
				handlePaginationChange(currentPage)
				setIsItemsLoading(false)
			}, 1500)
		})
	}

	function showConfirm(action) {
		if(action == 1){
			confirm({
				title: 'Estas seguro que deseas enviar el o los recordatorios',
				okText: "Si",
				cancelText: "No",
				onOk() {
					sendReminders();
				},
				onCancel() {
					return;
				},
			});
		}else if(action == 2){
			confirm({
				title: 'Esta seguro que desea eliminar la o las declaraciones',
				okText: "Si",
				cancelText: "No",
				onOk() {
					deleteForms();
				},
				onCancel() {
					return;
				},
			  });
		}

	  }

	function handleMenuClick(e) {
		if (e.key == "1") {
			showConfirm(1);
		} else {
			//confirm
			showConfirm(2);
		}
	}

	const menu = (
		<Menu  onClick={handleMenuClick}>
			<Menu.Item key="1" icon="">
				Enviar Recordatorios
			</Menu.Item>
			<Menu.Item key="2" icon="">
				Borrar
			</Menu.Item>
		</Menu>
	);

	const cbFilters = (objFilters) => {
		setFilters(objFilters);
		handleSearch(1, objFilters);
	};

	return (
		<div className="tab-matches">
			<div className="top-bar">
				<Button icon="file-excel" type="ghost" onClick={handleExportReport} className="btn-action">Exportar Resultado</Button>
				{(type === 'COLABORADOR' || type === 'PROVEEDOR' || type === 'CLIENTE' || type === 'DIRECTOR') &&
					<>
						{enableReminders ?
							<>
								<Dropdown overlayClassName="menu-action" overlay={menu} disabled={false}>
										<Button className="btn-action btn-reminders reminder" >
											Accion
											<Icon type="down" />
										</Button>
									</Dropdown>
							</>
							:
							<Button type="ghost" className="btn-action btn-reminders reminder" disabled={true}>Accion<Icon type="down" /></Button>
						}
					</>
				}
				<div className={isAdvancedSearchVisible ? 'advanced-search on' : 'advanced-search'} onClick={!isAdvancedSearchVisible ? handleShowAdvancedSearch : handleHideAdvancedSearch}>
					<Icon type="menu" /> &nbsp;
					<span>Búsqueda avanzada</span> &nbsp;
					<Icon type={!isAdvancedSearchVisible ? 'down' : 'close'} />
				</div>
			</div>
			<div className={isAdvancedSearchVisible === null ? 'filters-wrapper null' : (isAdvancedSearchVisible ? 'filters-wrapper show' : 'filters-wrapper hide')}>
				<div className="filters-wrapper-inner">
					<AdvancedTabs cbFilters={cbFilters} type={(type === 'COLABORADOR' || type === 'PROVEEDOR' || type === 'CLIENTE') ? 'CDI' : 'FORM'} />
				</div>
			</div>
			<div className="items-wrapper">
				{isItemsLoading ? <div className="spinner"><Spin size="large" spinning="true" /></div> : <Table pagination={false} onRow={handleTableOnRow} dataSource={items} columns={getTableColumns()} rowClassName="row-form" />}
			</div>
			{itemsTotalNum > 0 &&
				<div className="bottom-bar">
					<Pagination onChange={handlePaginationChange} pageSize={itemsPerPage} current={currentPage} total={itemsTotalNum} />
				</div>
			}
			{isModalViewItemVisble && <ModalViewItem item={clickedItem} onCancel={handleModalCancel} onOk={handleModalOk} type={type} />}
		</div>
	)
}

export default TabMatches
