import './ClientsTable.scss'
import React,{useState, useEffect} from 'react'
import {Table, Row, Col, Icon, Checkbox, Button, Pagination, Modal, Dropdown, Menu } from 'antd'
import moment from 'moment'
import {getItemsPromise} from '../../promises'
import {ModalClientCardPage} from '../../components'
//import {ModalPdfViewer} from '../../../../../ConflictsOfInterest/components'
import personIcon from '../../../../../Query/components/PersonCard/person-icon.png'
import entityIcon from '../../../../../Query/components/PersonCard/entity-icon.png'
import { ModalRequest } from './components'
import { AdvancedTabsComponent } from '../../components';


const ClientsTable = ({currentUser, categoria, rut, options, isAdvancedSearchVisible, areas}) => {
	const [itemTable, setItemTable] = useState(null)
	const [items, setItems] = useState([])
	const [isItemsLoading, setIsItemsLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsTotalNum, setItemsTotalNum] = useState(-1)
	const itemsPerPage = 10
	const [filters, setFilters] = useState({...options});
	const [formId, setFormId] = useState(null);
	const [pendientesCount, setPendientesCount] = useState(0);
	const [rechazadasCount, setRechazadasCount] = useState(0);
	const [autorizadasCount, setAutorizadasCount] = useState(0);
	const [evaluacionCount, setEvaluacionCount] = useState(0);
	const [activos, setActivos] = useState(0);
	const [moreStyle, setMoreStyle] = useState(false);
	const [recordsAction, setRecordsAction] = useState([]);
	const [selectedItem, setSelectedItem] = useState([]);
	const [chkAll, setChkAll] = useState(false);
	const [actionType, setActionType] = useState(null);

	useEffect(() =>{

		handlePaginationChange(1)

	},[])

	const handleAction = (record) => {
		if(record){
			const recordObj = {id: record.id, name: record.record.nombre}
			setRecordsAction([recordObj])
		}else{
			setRecordsAction(selectedItem)
		}
	}


	const menuEllipsis = (record) => {
	return (
			<Menu>
				<Menu.Item>
					<a onClick={() => {
								setActionType("cronForm")
								handleAction(record)
							}
						}
					>
						<Icon type="clock-circle" /> Actualizar periódicamente la ficha
					</a>
				</Menu.Item>
				<Menu.Item>
					<a onClick={() =>{
								setActionType("newRequest")
								handleAction(record)
							}
						}
					>
						<Icon type="mail" /> Enviar formulario
					</a>
				</Menu.Item>
			</Menu>
		);
	}

	const handleSelectDeselectAll = (e) => {
		setChkAll(e.target.checked)
		if(!e.target.checked){
			setSelectedItem([])
		}else{
			let itemsPerPage = [];
			items.map(i => itemsPerPage.push({id: i.id, name: i.record.nombre}))
			setSelectedItem(itemsPerPage);
		}
	}

	const handlePaginationChange = async (value) => {
		handleSearch(value, filters)
	}

	const handleSearch = async (page, filters) => {
		const fromNum = ((page - 1) * itemsPerPage)
		filters.from = fromNum;
		filters.size = itemsPerPage;
		filters.rutNombre = filters.rutNombre ? filters.rutNombre : rut;
		filters.category = categoria
		setIsItemsLoading(true);
		const items = await getItemsPromise(categoria, filters)
		setItemsTotalNum(items.data.total)
		setItems(items.data.records)
		setCurrentPage(page)
		setChkAll(false)
		setIsItemsLoading(false)
		setPendientesCount(0)
		setEvaluacionCount(0)
		setRechazadasCount(0)
		setAutorizadasCount(0)
		setActivos(items.data.filters.activos)

		if(items.data.filters && items.data.filters.estados) {
			const pendientes = items.data.filters.estados.filter(s => s.status_decl === 'PENDIENTE').reduce((acc, value) => {return acc+value.cant},0)
			setPendientesCount(pendientes)

			const evaluacion = items.data.filters.estados.filter(s => s.status_decl === 'EVALUACION').reduce((acc, value) => {return acc+value.cant},0)
			setEvaluacionCount(evaluacion)

			const rechazadas = items.data.filters.estados.filter(s => s.status_decl === 'RECHAZADA').reduce((acc, value) => {return acc+value.cant},0)
			setRechazadasCount(rechazadas)

			const autorizadas = items.data.filters.estados.filter(s => s.status_decl === 'AUTORIZADA').reduce((acc, value) => {return acc+value.cant},0)
			setAutorizadasCount(autorizadas)

		setCurrentPage(page)
		setIsItemsLoading(false)
		}
	}

	const cbFilters = (objFilters) => {
		setFilters(objFilters);
		handleSearch(1, objFilters);
	};

	const handleCancel = () => {
		handleSearch(currentPage, filters);
		setItemTable(null);
		setRecordsAction([]);
		setSelectedItem([]);
	};

	const onCancelPdfViewer = () => {
		setFormId(null);
	}

	const menuAccion = () => {
		return (
			<Menu>
				<Menu.Item>
				<a onClick={() => {
							setActionType("cronForm")
							handleAction()
						}
					}
				>
					<Icon type="clock-circle" /> Actualizar periódicamente el formulario
				</a>
				</Menu.Item>
				<Menu.Item>
				<a onClick={() =>{
							setActionType("newRequest")
							handleAction()
						}
					}
				>
					<Icon type="mail" /> Enviar formulario
				</a>
				</Menu.Item>
			</Menu>
		);
	}

	const renderType = (type) => {
		if (type === 'Person'){
			return personIcon
		}else if (type === 'Entity'){
			return entityIcon
		}
	}

    const getTableColumns = () => {
		let columns = [
            {
				title: () => (
					<div>
						<Checkbox onChange={handleSelectDeselectAll} checked={chkAll}/>
					</div>
				),
				dataIndex: 'checked',
				width: '5%',
				align: 'center',
				render: (record) => {
					return <Checkbox
						checked={selectedItem.filter(i => i.id === record.id).length > 0 || chkAll}
						onChange={(e) => {
							setChkAll(false)
							let checkedItem = [...selectedItem]
							if(e.target.checked) {
								checkedItem.push({id: record.id, name: record.record.nombre})
							}else{
								checkedItem = checkedItem.filter(i => i.id !== record.id)
							}
							setSelectedItem(checkedItem)
						}}
					/>
				}
			},
			{
				title: 'Tipo',
				className: "text-center-type-onb",
				width: '5%',
				render: (item) => {
					return <Row>
								<Col span={24} style={{textAlign: 'center', fontSize: '5px'}}>
									<img src={ renderType(item.record.type) } alt="" width="40"/>
								</Col>
							</Row>
				}

				// sorter: (a, b) => a.creationDate - b.creationDate,

			},
			{
				title: 'Nombre/Rut',
				width: '16%',
				render: (record => {
					return <>
					<div className="name-col-table">
						<Button type="link" onClick={ () => handleShowIndexCard(record) }>{record.record.nombre}</Button>
						<Button type="link" onClick={ () => handleShowIndexCard(record) }>{record.record.rut}</Button>
					</div>
					</>
				})
			},
			{
				title: 'Fecha de actualización',
				width: '10%',
				dataIndex:'declDate',
				render: (text => {
					return text !== null ? moment(text).format('DD/MM/YYYY') : "Sin actualizar"
				}),
			},
			{
				title: "Cumplimiento",
				className: 'column-cumplimiento',
				children: [
					{
						title: 'Listas Obligatorias',
						key: Math.random(),
						dataIndex: 'record.compliance',
						width: 15,
						align: 'center',
						render: (text => {
							return <div className="item-risk-align">
										<div className={ 'child-risk-onb-circle risk-' + (text && text.PEPSAN && text.PEPSAN.color ? text.PEPSAN.color : "GRAY") }>
											{text && text.PEPSAN && text.PEPSAN.bases ? text.PEPSAN.bases.length : "n/a"}
										</div>
									</div>
						}),
					},
					{
						title: 'KYC',
						key: Math.random(),
						dataIndex: 'record.compliance',
						width: 15,
						align: 'center',
						render: (text => {
							return <div className="item-risk-align">
										<div className={ 'child-risk-onb-circle risk-' + (text && text.KYCAME && text.KYCAME.color ? text.KYCAME.color : "GRAY") }>
											{text && text.KYCAME && text.KYCAME.bases ? text.KYCAME.bases.length : "n/a"}
										</div>
									</div>
						}),
					},
					{
						title: 'UBO & Companies',
						key: Math.random(),
						dataIndex: 'record.compliance',
						width: 15,
						align: 'center',
						render: (text => {
							return <div className="item-risk-align">
										<div className={ 'child-risk-onb-circle risk-' + (text && text.UBOCOM && text.UBOCOM.color ? text.UBOCOM.color : "GRAY") }>
											{text && text.UBOCOM && text.UBOCOM.bases ? text.UBOCOM.bases.length : "n/a"}
										</div>
									</div>
						}),
					},
				],

			},
			{
				title: () => (
					<div className="">
						Riesgo AMLupdate
					</div>
				),
				className:"onbRiskTitle",
				width: '10%',
				dataIndex: 'record.amlStatus',
				render: (text => {
					return  <div className={ 'child-risk-onb risk-' + (text !== null ? text : 'GRAY') }>
								{ text === null && 'N/A'}
								{ text === 'BLACK' && 'Crítico' }
								{ text === 'RED' && 'Alto' }
								{ text === 'ORANGE' && 'Medio' }
								{ text === 'YELLOW' && 'Bajo' }
								{ text === 'GREEN' && 'No Posee' }
							</div>
				}),
			},
			{
				title: () => (
					<div className="">
						Riesgo modificado
					</div>
				),
				className:"onbRiskTitle",
				width: '10%',
				dataIndex: 'record.risk',
				render: (text => {
					return  <div className={ 'child-risk-onb risk-' + (text !== null ? text : 'GRAY') }>
								{ text === null && 'N/A'}
								{ text === 'BLACK' && 'Crítico' }
								{ text === 'RED' && 'Alto' }
								{ text === 'ORANGE' && 'Medio' }
								{ text === 'YELLOW' && 'Bajo' }
								{ text === 'GREEN' && 'No Posee' }
							</div>
				}),
			},
			{
				title: () => <div className="image"></div>,
				className:"onbLogoTitle",
				width: '10%',
				render: ((record) => {
					return(
						<div className="ellipsis-icon-onb">
							<Dropdown overlay={menuEllipsis(record)} onVisibleChange={setMoreStyle(false ? true : false)}>
								<Icon type="more"
									style={{fontSize: '30px', color: '#FE9F0C'}}
								/>
							</Dropdown>
						</div>
					)
				}
				)
			}
		]

		const handleShowIndexCard = (record) => {
			setItemTable(record)
		}
		return columns
	}


    return (
        <div className="clientTable-content">
			<Row>
				<Col span={4}>
					<div className="solicitudes-card-registros">
						Registros activos <br/>
						{activos}
					</div>
				</Col>
				<Col span={3}>
					<div className="solicitudes-card">
						Solicitadas <br/>
						{pendientesCount}
					</div>
				</Col>
				<Col span={3}>
					<div className="solicitudes-card">
						Realizadas <br/>
						{evaluacionCount+rechazadasCount+autorizadasCount}
					</div>
				</Col>
				<Col span={4} offset={10} >
					<div className="action-button-form">
						<Dropdown overlay={menuAccion()} disabled={selectedItem.length===0}>
							<Button style={{marginTop: 8}}>
								Acción <Icon type="down" />
							</Button>
						</Dropdown>
					</div>
				</Col>
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
			<div className="">
				<Row>
					<Table
						className=""
						size="small"
						loading={isItemsLoading}
						pagination={false}
						columns={getTableColumns()}
						dataSource={items}
						indentSize={30}

					/>
				</Row>
				{itemTable &&
					<Modal
						wrapClassName="modal-fichaCliente-onb"
						style={{top:'10px'}}
						title={"Ficha de Cliente"}
						visible={true}
						onCancel={handleCancel}
						cancelText="Cerrar"
						footer={null}
						width={'95vw'}
					>
						<ModalClientCardPage item={itemTable} currentUser={currentUser} handleCancel={handleCancel} />
					</Modal>
				}
				{formId &&
					<Modal
					className="modal-pdf-viewer"
					title="Formulario"
					centered={true}
					width={1000}
					header={null}
					footer={[<Button key="back" onClick={onCancelPdfViewer}>Cerrar</Button>]}
					onCancel={onCancelPdfViewer}
					visible={true}>
					{/*<ModalPdfViewer pdfId={formId} />*/}
					</Modal>
				}
				{recordsAction.length !== 0 &&
					<Modal
					title={ actionType==='newRequest' ? [ <Icon type="mail" />," "," Enviar Formulario de Onboarding" ] : [ <Icon type="clock-circle" />, " "," Actualizar periódicamente la ficha" ] }
					centered={true}
					width={500}
					footer={false}
					onCancel={handleCancel}
					visible={true}
					>
						<ModalRequest type={actionType} recipients={recordsAction} category={categoria} handleCancel={handleCancel}/>
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
        </div>
    )
}

export default ClientsTable
