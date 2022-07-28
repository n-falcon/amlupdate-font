import './FormTable.scss'
import React,{useState, useEffect} from 'react'
import {Table, Row, Col, message, Icon, Checkbox, Button, Pagination, Modal, Dropdown, Menu, Tooltip} from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { getItemsPromise, sendRemindersOnbPromise, deleteDeclarationsPromise } from '../../promises'
import {ModalIndexCardPage} from '../../components'
//import {ModalPdfViewer} from '../../../../../ConflictsOfInterest/components'
import { AdvancedTabsComponent } from '../../components';

const FormTable = ({categoria, rut, options, isAdvancedSearchVisible, areas}) => {

	const [itemTable, setItemTable] = useState(null)
  	const { t } = useTranslation()
	const [items, setItems] = useState([])
	const [isItemsLoading, setIsItemsLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsTotalNum, setItemsTotalNum] = useState(-1)
	const [enableReminders, setEnableReminders] = useState(false)
	const [chkAll, setChkAll] = useState(false);
	const itemsPerPage = 10
	const [filters, setFilters] = useState({...options});
	const [formId, setFormId] = useState(null);
	const [confirm, setConfirm] = useState(null);
	const [option, setOption] = useState(null);
	const [pendientesCount, setPendientesCount] = useState(0);
	const [rechazadasCount, setRechazadasCount] = useState(0);
	const [autorizadasCount, setAutorizadasCount] = useState(0);
	const [evaluacionCount, setEvaluacionCount] = useState(0);
	const [sortField, setSortField] = useState(null);
	const [sortDirection, setSortDirection] = useState(null);
	const [selectedItem, setSelectedItem] = useState([]);

    // checkedList: defaultCheckedList,
    // indeterminate: true,
    // checkAll: false,

	useEffect(() =>{
		handlePaginationChange(1)
	},[])

	const handleSelectDeselectAll = (e) => {
		setChkAll(e.target.checked)
		setEnableReminders(e.target.checked)
		if(!e.target.checked){
			setSelectedItem([])
		}else{
			let itemsPerPage = [];
			items.map(i => itemsPerPage.push(i.id))
			setSelectedItem(itemsPerPage);
		}
	}

	const handleMenuClick = (e) => {
		const action = e.key;
		setOption(action);
		setConfirm(true);
	  }

	const handlePaginationChange = async (value) => {
		handleSearch(value, filters, sortField, sortDirection)
	}

	const menu = (
		<Menu onClick={handleMenuClick}>
		  <Menu.Item key="1">
			<Icon type="mail" />
			Enviar Recordatorios
		  </Menu.Item>
		  <Menu.Item key="2">
			<Icon type="delete" />
			Borrar
		  </Menu.Item>
		</Menu>
	  );

	const handleSendReminder = () => {
		if(selectedItem.length > 0){
			sendRemindersOnbPromise(categoria, filters, selectedItem).then((response) =>{
				if(response.success){
					message.success(t("messages.aml.formTable.remindersSentSuccess"));
					setConfirm(false)
					setOption(null)
					handlePaginationChange(currentPage)
				}else{
					message.error(t('messages.aml.formTable.remindersSentError'))
				}
			})
			setConfirm(false);
		}else{
			message.error(t("messages.aml.formTable.noItemsSelected"))
		}
	}

	const handleDeletePendings = () => {
		if(selectedItem.length > 0){
			deleteDeclarationsPromise(categoria, filters, selectedItem).then((response) =>{
				if(response.success){
					message.success('Formularios eliminados');
					setConfirm(false)
					setOption(null)
					handlePaginationChange(currentPage)
				}else{
					message.error(t('messages.aml.notifications.anErrorOcurred'))
				}
			})
			setConfirm(false);
		}else{
			message.error(t("messages.aml.formTable.noItemsSelected"))
		}
	}

	const handleSearch = async (page, filters, sorField=null, sortDirection=null) => {
		const fromNum = ((page - 1) * itemsPerPage)
		filters.from = fromNum;
		filters.size = itemsPerPage;
		filters.category = categoria;
		filters.rutNombre = filters.rutNombre ? filters.rutNombre : rut;
		filters.sorField = sorField;
		filters.sortDiretion = sortDirection;
		setIsItemsLoading(true)
		const items = await getItemsPromise("KYC", filters)
		setItemsTotalNum(items.data.total)
		setItems(items.data.records)
		setChkAll(false);
		setSelectedItem([]);
		setPendientesCount(0)
		setEvaluacionCount(0)
		setRechazadasCount(0)
		setAutorizadasCount(0)

		if(items.data.filters && items.data.filters.status) {
			const pendientes = items.data.filters.status.filter(s => s.status === 'PENDIENTE')
			if(pendientes.length > 0) setPendientesCount(pendientes[0].total)

			const evaluacion = items.data.filters.status.filter(s => s.status === 'EVALUACION')
			if(evaluacion.length > 0) setEvaluacionCount(evaluacion[0].total)

			const rechazadas = items.data.filters.status.filter(s => s.status === 'RECHAZADA')
			if(rechazadas.length > 0) setRechazadasCount(rechazadas[0].total)

			const autorizadas = items.data.filters.status.filter(s => s.status === 'AUTORIZADA')
			if(autorizadas.length > 0) setAutorizadasCount(autorizadas[0].total)
		}

		setCurrentPage(page)
		setIsItemsLoading(false)
	}

	const cbFilters = (objFilters) => {
		setFilters(objFilters);
		handleSearch(1, objFilters, sortField, sortDirection);
	};

	const handleCancel = () => {
		handleSearch(currentPage, filters, sortField, sortDirection)
		setItemTable(null);
	};

	const onCancelPdfViewer = () => {
			setFormId(null);
	}

	const changeTable = (pagination, filters, sorter, currentPageData) => {
		let sF = null
		let sD = null
		if(sorter.order) {
			sF = sorter.field
			sD = sorter.order === 'ascend' ? 'asc' : 'desc'
		}
		setSortField(sF)
		setSortDirection(sD)
		handleSearch(currentPage, filters, sF, sD)
		return false
	}

	const handlePdfViewer = (record) => {
		setFormId(record.id);
	}

	const handleShowIndexCard = (record) => {
		setItemTable(record)
	}

  const getTableColumns = () => {
		let columns = [
      {
				title: () => (
					<div>
						<Checkbox onChange={handleSelectDeselectAll} checked={chkAll} />
					</div>
				),
				width: 5,
				align: 'center',
				render: (text, record) => {
					if (record.statusDecl === 'PENDIENTE') {
						return <Checkbox
						checked={selectedItem.filter(i => i === record.id).length > 0}
						onChange={(e) => {
							setChkAll(false)
							let checkedItem = [...selectedItem]
							if(e.target.checked) {
								checkedItem.push(record.id)
							}else{
								checkedItem = checkedItem.filter(i => i !== record.id)
							}
							setSelectedItem(checkedItem)
							setEnableReminders(checkedItem.length > 0)
						}}
						/>
					}
				}
			},
			{
				title: 'Nombre / Rut',
				width: 180,
				elipsis: true,
				dataIndex: 'name',
				render: ((name, record) => {
					return <>
					<div className="name-col-table">
						<Button type="link" onClick={ () => handleShowIndexCard(record) }>{record.name}</Button>
						<Button type="link" onClick={ () => handleShowIndexCard(record) }>{record.rut}</Button>
					</div>
					</>
				}),
				sorter: (a, b) => { return false }
			},
			{
				title: 'Folio',
				dataIndex: 'folio',
	            width: 130,
				sorter: (a, b) => { return false }
			},
			{
				title: 'Solicitud',
				width: 90,
				dataIndex: 'sendDate',
				render: (text) => {
					return moment(text).format('DD/MM/YYYY')
				},
				sorter: (a, b) => { return false }
			},
			{
				title: 'Estado',
				width: 120,
				dataIndex: 'statusDecl',
				render: (text) => {
					return t("messages.aml.formKycStatus."+text)
				},
				sorter: (a, b) => { return false }
			},
			{
				title: 'Fecha de Estado',
				width: 130,
				dataIndex: 'statusDate',
				render: (statusDate) => moment(statusDate).format('DD/MM/YYYY'),
				sorter: (a, b) => { return false }
			},
			{
				title: 'Recordatorio',
				width: 120,
				dataIndex: 'lastReminder',
				render: (lastReminder) => lastReminder ? moment(lastReminder).format('DD/MM/YYYY'): "Sin recordatorio",
				sorter: (a, b) => { return false }
			},
			{
				width: 80,
				render: ((record) => {
					return(
						<Row>
							<Col span={12}>
								<div>
									{ record.statusDecl !== 'PENDIENTE' &&
										<Icon type="file-pdf" className="file-pdf"
											  onClick={ () =>
											  handlePdfViewer(record) }
											  style={{fontSize: '20px'}}
										/>
									}
								</div>
							</Col>
							<Col span={12}>
								<div>
									{ record.statusDecl !== 'PENDIENTE' && record.files && record.files.length > 0 &&
										<Tooltip title={record.files.length + " archivos adjuntos"}>
											<Icon type="paper-clip"
												style={{fontSize: '20px'}}
											/>
										</Tooltip>
									}
								</div>
							</Col>
						</Row>
					)
				}
				)
			}
		]

		return columns
	}

    return (
        <div className="formTable-content">
					<Row>
						<Col span={3}>
							<div className="solicitudes-card">
								Pendientes <br/>
								{pendientesCount}
							</div>
						</Col>
						<Col span={3}>
							<div className="solicitudes-card">
								Realizadas <br/>
								{evaluacionCount}
							</div>
						</Col>
						<Col span={3}>
							<div className="solicitudes-card">
								Autorizadas <br/>
								{autorizadasCount}
							</div>
						</Col>
						<Col span={3}>
							<div className="solicitudes-card">
								Rechazadas <br/>
								{rechazadasCount}
							</div>
						</Col>
						<Col span={12}>
							<div className="action-button-form">
								<Dropdown overlay={menu} disabled={!enableReminders}>
									<Button style={{marginTop: 8}}>
										Acción <Icon type="down" />
									</Button>
								</Dropdown>
							</div>
						</Col>
						<Modal
							title={option === "1" ? "Enviar Recordatorio a Pendientes":"Borrar Pendientes"}
							visible={confirm}
							onCancel={() => setConfirm(false)}
							okText={option === "1" ? "Enviar":"Borrar"}
							maskClosable={false}
							centered={true}
							footer={option==="1"?
							[<Button onClick={handleSendReminder} type="primary">Enviar</Button>]
							:
							[<Button onClick={handleDeletePendings} type="danger">Borrar</Button>]
							}
							>
							<h3>{option === "1" ?
								"¿Desea enviar un recordatorio para que se responda el formulario?"
								:
								"¿Desea borrar el o los formularios seleccionado(s)?"}
							</h3>
						</Modal>
					</Row>
					<Row>
						<Col span={24}>
							<div className={isAdvancedSearchVisible === null ? 'filters-wrapper null' : (isAdvancedSearchVisible ? 'filters-wrapper show' : 'filters-wrapper hide')}>
								<div className="filters-wrapper-inner">
									<AdvancedTabsComponent cbFilters={cbFilters} areas={areas}/>
								</div>
							</div>
						</Col>
					</Row>
					<div className="table-req-onb">
						<Row>
							<Table size="small" pagination={false} columns={getTableColumns()} dataSource={items} onChange={changeTable} loading={isItemsLoading} />
						</Row>

						{formId &&
							<Modal
							className="modal-pdf-viewer"
							title="Formulario"
							centered={true}
							width={1000}
							header={null}
							footer={false}
							onCancel={onCancelPdfViewer}
							visible={true}>
							{/*<ModalPdfViewer pdfId={formId} />*/}
							</Modal>
						}
						<div className="pagination-formtable">
							<Row>
								{itemsTotalNum > 0 &&
									<Pagination
										onChange={handlePaginationChange} pageSize={itemsPerPage} current={currentPage} total={itemsTotalNum}
									/>
								}
							</Row>
						</div>
					</div>

					{itemTable &&
						<Modal
							wrapClassName="modal-index-card"
							title={"Formulario OnBoarding de "+t("messages.aml.category."+itemTable.category)}
							visible={true}
							onCancel={handleCancel}
							cancelText="Cerrar"
							footer={null}
							width={1200}
							style={{top:"10px"}}
						>
							<ModalIndexCardPage item={itemTable} handleCancel={handleCancel}/>
						</Modal>
					}
        </div>
    )
}

export default FormTable
