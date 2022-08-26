import './ModalNewRelease.scss'
import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next"
import moment from 'moment'
import { Button, Col, DatePicker, Icon, Input, Modal, Checkbox, Radio, Row, Select, Spin, notification, Popconfirm, Pagination } from 'antd'
import { getClientsMinPromise, saveItemPromise, getItemPromise, getAreasPromise } from './promises'
import periodicityImg from './time.png'
import periodicityDateImg from './date.png'
import forbiddenImg from './forbidden.png'
import groupPeopleImg from './group-people.png'
import { camelizerHelper } from '../../../../helpers'

const ModalNewRelease = ({ isVisible, onClose, onNewRelease, type, record, currentUser }) => {
	const { t } = useTranslation()
	const [ activeType, setActiveType ] = useState(record !== null ? record.type: null)
	const [ selectedType, setSelectedType ] = useState('')
	const [ chkAll , setChkAll ] = useState(false)
	const [ chkAllRecp , setChkAllRecp ] = useState(false)
	const [ itemsList, setItemsList ] = useState(null)
	const [ itemsRecpList, setItemsRecpList ] = useState(null)
	const [ clientsList, setClientsList ] = useState({})
	const [ recipientsList, setRecipientsList ] = useState({})
	const [ isClientsLoading, setIsClientsLoading ] = useState(false)
	const [ isSaving, setIsSaving ] = useState(false)
	const [ periodicityType, setPeriodicityType ] = useState(null)
	const [ periodicityStartDate, setPeriodicityStartDate ] = useState(null)
	const [ subject, setSubject ] = useState(null)
	const [ isPreviewOpen, setIsPreviewOpen ] = useState(false)
	const [ category, setCategory ] = useState('COLABORADOR')
	const [ nroClients, setNroClients ] = useState(0)
	const [ nroClientsSelected, setNroClientsSelected ] = useState(0)
	const [ keyword, setKeyword ] = useState(null)
	const [ company, setCompany ] = useState(null)
	const [ companyName, setCompanyName ] = useState(null)
	const [ area, setArea ] = useState(null)
	const [ keywordRecpt, setKeywordRecpt ] = useState(null)
	const [ companyRecpt, setCompanyRecpt ] = useState(null)
	const [ areaRecpt, setAreaRecpt ] = useState(null)
	const [ hasEmpresa, setHasEmpresa ] = useState(false)
	const [ areas, setAreas ] = useState([])
	const [ filters , setFilters ] = useState(null)
	const [ overLimit, setOverLimit ] = useState(false)
	const [ currentPage, setCurrentPage ] = useState(1)

	const limitRecords = 10

	useEffect(() => {
		getAreasPromise().then(data => {
			setAreas(data)
		})

		setRecipientsList({})
		setNroClientsSelected(0)
		if(record !== null) {
			setSubject(record.subject)
			setSelectedType(record.type)
			setPeriodicityType(record.periodicity)
			setPeriodicityStartDate(moment(record.startDate))
			if(type === 'D') setCategory(record.category)

			getItemPromise(record.id).then(data => {
				let list = {}
				for(let i=0;i<data.recipients.length && i<limitRecords;i++) {
					let item = { isSelected: false, data: {id: data.recipients[i].record.id, rut: data.recipients[i].record.rut, name: data.recipients[i].record.nombre, email: data.recipients[i].record.email, company: (data.recipients[i].record.subcliente !== null?data.recipients[i].record.subcliente.name:null), area: data.recipients[i].record.area}}
					list[item.data.id] = item
				}
				handleGetClients(list, null, null, null)
				setRecipientsList(list)
			})
		}else {
			handleGetClients({}, null, null, null)
		}
		if(currentUser.cliente.outsourcer && currentUser.cliente.clientes !== null && currentUser.cliente.clientes.length>0 && currentUser.subcliente === null) {
			setHasEmpresa(true)
		}
	}, [category])

	const handlePagination = async(page, selected, kyw, empresa, _area) => {
		setIsClientsLoading(true)

		setNroClients(0)
		setChkAll(false)
		const fromNum = ((page - 1) * limitRecords)
		const c = await getClientsMinPromise(fromNum, limitRecords, [category], kyw, empresa, _area)
		const items = {}

		let j = 0
		for (let i = 0; i < c.data.records.length; i++) {
			const id = c.data.records[i].id
			const data = c.data.records[i]
			const isSelected = false
			if(selected[id] === null || selected[id] === undefined) {
				items[id] = {
					data,
					isSelected
				}
				j++
			}
		}
		setItemsList({total: c.data.total, records: j})
		setClientsList(items)

		setIsClientsLoading(false)
	}

	const handlePaginationChange = async (value) => {
			setCurrentPage(value)
			handlePagination(value, recipientsList, keyword, company, area)
	}

	const handleGetClients = async (selected, kyw, empresa, _area) => {
		setCurrentPage(1)
		handlePagination(1, selected, kyw, empresa, _area)
	}

	const getFilterRecipientList = () => {
		let newList = []
		let i = 0
		for(let k in recipientsList) {
			let item = recipientsList[k]
			let addKyw = true
			let addEmp = true
			let addArea = true

			if(keywordRecpt !== null && !item.data.name.toLowerCase().includes(keywordRecpt.toLowerCase()) && !item.data.rut.toLowerCase().includes(keywordRecpt.toLowerCase())) addKyw = false
			if(companyRecpt !== null && item.data.company !== null && item.data.company.toLowerCase() !== companyRecpt.toLowerCase()) addEmp = false
			if(areaRecpt !== null && item.data.area !== null && !item.data.area.toLowerCase().includes(areaRecpt.toLowerCase())) addArea = false

			if(addKyw && addEmp && addArea && i<limitRecords) {
				newList[i] = item
				i++
			}
		}
		if(itemsRecpList === null) {
			setItemsRecpList({total: 0, records: i})
		}else if(itemsRecpList.records !== i) {
			let total = itemsRecpList.total
			setItemsRecpList({total, records: i})
		}
		return newList
	}

	const handlerFilterDest = (text) => {
			setKeyword(text)
			handleGetClients(recipientsList, text, company, area)
	}

	const handlerFilterDestRecpt = (text) => {
			setKeywordRecpt(text)
	}

	const handlerFilterCompany = (value, e) => {
		if(value === null) {
			setCompany(null)
			setCompanyName(null)
			handleGetClients(recipientsList, keyword, null, area)
		}else {
			setCompany(value)
			setCompanyName(e.props.children)
			handleGetClients(recipientsList, keyword, value, area)
		}
	}

	const handlerFilterCompanyRecpt = (value) => {
		setCompanyRecpt(value)
	}

	const handlerFilterArea = (value) => {
		setArea(value)
		handleGetClients(recipientsList, keyword, company, value)
	}

	const handlerFilterAreaRecpt = (value) => {
		setAreaRecpt(value)
	}

	const handleSubjectChange = (e) => {
		setSubject(e.target.value)
	}

	const handleSelectType = (value) => {
		if(record === null) setSelectedType(value)
	}

	const renderTypeTooltip = (type) => {
		const tooltip1 = <><h3 className="tooltip-h3">Regalos</h3><p className="tooltip-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget ullamcorper nunc.</p></>
		const tooltip2 = <><h3 className="tooltip-h3">Viajes</h3><p className="tooltip-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget ullamcorper nunc.</p></>
		const tooltip3 = <><h3 className="tooltip-h3">Funcionarios Públicos</h3><p className="tooltip-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget ullamcorper nunc.</p></>
		const tooltip4 = <><h3 className="tooltip-h3">Asociaciones Empresariales</h3><p className="tooltip-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget ullamcorper nunc.</p></>
		const tooltip5 = <><h3 className="tooltip-h3">Conflictos de Interés</h3><p className="tooltip-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget ullamcorper nunc.</p></>

		if (type === 1) {
			return tooltip1
		}

		if (type === 2) {
			return tooltip2
		}

		if (type === 3) {
			return tooltip3
		}

		if (type === 4) {
			return tooltip4
		}

		if (type === 5) {
			return tooltip5
		}
	}

	const handleClientClick = async (isSelected, id) => {
		let newList = JSON.parse(JSON.stringify(clientsList))
		newList[id].isSelected = !isSelected
		setClientsList(newList)
		let nro = nroClients
		if(isSelected) nro--
		else nro++
		setNroClients(nro)
		setChkAll(false)
	}

	const handleRecipientClick = async (item) => {
		let newList = JSON.parse(JSON.stringify(recipientsList))
		newList[item.data.id].isSelected = !item.isSelected
		setRecipientsList(newList)
		let nro = nroClientsSelected
		if(item.isSelected) nro--
		else nro++
		setNroClientsSelected(nro)
	}

	const handleSelectDeselectAll = async (e) => {
		let clients = JSON.parse(JSON.stringify(clientsList))
		for (let k in clients) {
			clients[k].isSelected = e.target.checked
		}
		setChkAll(e.target.checked)
		setClientsList(clients)
		setNroClients(e.target.checked ? Object.keys(clients).length : 0)
	}

	const handleSelectDeselectRecipient = async (e) => {
		let clients = JSON.parse(JSON.stringify(recipientsList))
		let i = 0
		for (let k in clients) {
			clients[k].isSelected = e.target.checked
			if(e.target.checked) i++
		}
		setChkAllRecp(e.target.checked)
		setRecipientsList(clients)
		if(e.target.checked) {
			setNroClientsSelected(i)
		}else {
			setNroClientsSelected(0)
		}
	}

	const handleMoveToRecipients = () => {
		let newClientsList = JSON.parse(JSON.stringify(clientsList))
		let newList = {}
		if(chkAll) {
			setFilters({keyword,  company, companyName, area})
		}else {
			setFilters(null)
			newList = JSON.parse(JSON.stringify(recipientsList))
		}

		let i = 0
		for (let k in newClientsList) {
			if(newClientsList[k].isSelected) {
				newList[k] = newClientsList[k]
				newList[k].isSelected = false

				delete clientsList[k]
			}else {
				i++
			}
		}

		setItemsList({ total: itemsList.total, records: i })
		setItemsRecpList({ total: Object.keys(newList).length })

		setClientsList(clientsList)
		setRecipientsList(newList)

		if(chkAll && itemsList.total > limitRecords) {
			setOverLimit(true)
			setItemsRecpList({ total: itemsList.total })
		}else {
			setOverLimit(false)
		}
		setChkAll(false)
		setNroClients(0)
	}

	const handleMoveToClients = () => {
		let newList = JSON.parse(JSON.stringify(clientsList))
		let newClientsList = JSON.parse(JSON.stringify(recipientsList))
		let i = itemsList.records
		for (let k in newClientsList) {
			if(newClientsList[k].isSelected || overLimit) {
				newList[k] = newClientsList[k]
				newList[k].isSelected = false
				delete recipientsList[k]
				i++
			}
		}

		setFilters(null)
		setChkAll(false)
		if(chkAllRecp || overLimit) {
			setItemsRecpList({total: 0, records: 0})
			setRecipientsList({})
		}else {
			setRecipientsList(recipientsList)
		}

		setClientsList(newList)
		setItemsList({ total: itemsList.total, records: i })
		setNroClientsSelected(0)

		setOverLimit(false)
		setChkAllRecp(false)
	}

	const handlePeriodicityTypeChange = (e) => {
		setPeriodicityType(e.target.value)
	}

	const handlePeriodicityStartDateChange = (date) => {
		setPeriodicityStartDate(date.valueOf())
	}

	const saveThis = async () => {
		let recipients = []
		for (let k in recipientsList) {
			recipients.push({
				record: {
					id: k
				}
			})
		}

		const body = {
			id: record !== null ? record.id : null,
			subject,
			type: selectedType,
			startDate: periodicityStartDate,
			periodicity: type === 'I' ? periodicityType : null,
			category
		}
		if(filters === null) {
			body.recipients = recipients
		}else {
			body.filters = filters
		}
		if(subject === null || subject === '' || selectedType === -1) {
			notification["error"]({
        message: 'Error',
        description: t("messages.aml.missingRequiredField")
      })
			return
		}
		if(recipients.length === 0) {
			notification["error"]({
        message: 'Error',
        description: 'Debe seleccionar al menos un destinatario'
      })
			return
		}
		setIsSaving(true)
		await saveItemPromise(type, body)
		setIsSaving(false)
		onClose()

	}

	const handleOpenPreview = () => {
		setIsPreviewOpen(true)
	}

	const handleClosePreview = () => {
		setIsPreviewOpen(false)
	}

	const handleCategorySelect = (categoryName) => {
		setCategory(categoryName)
		if(categoryName === 'PROVEEDOR' && currentUser.cliente.modules.includes('CDI-FORM-CDI')) {
			setSelectedType('CDI')
		}else {
			setSelectedType(null)
		}
	}

	const renderPeriodicitySelect = () => (
			<Col span={ 12 }>
				<div className="col-inner">
					<div id="periodicity-select" className="box">
						<h2>Seleccione la periodicidad</h2>
						<div className="periodicity-select-inner">
							<Col className="periodicity-left" span={10}>
								<img src={ periodicityImg } alt="" />
								<div className="options">
									<Radio.Group name="periodicity" onChange={ handlePeriodicityTypeChange } value={periodicityType}>
									<ul>
										<li><Radio value="MONTHLY" />	Mensual</li>
										<li><Radio value="QUARTERLY" />	Trimestral</li>
										<li><Radio value="BIANNUAL"/>	Semestral</li>
										<li><Radio value="ANNUAL"/> Anual</li>
									</ul>
									</Radio.Group>
								</div>
							</Col>
							<Col className="periodicity-right" span={14}>
								<div className="top-bar">
									<img src={ periodicityDateImg } alt="" />
									<p>Seleccione la fecha de inicio de envíos.</p>
								</div>
								<div className="bottom-bar">
									<DatePicker format="DD/MM/YYYY" value={periodicityStartDate===null?null:moment(periodicityStartDate)} onChange={ handlePeriodicityStartDateChange } placeholder="Click aquí para seleccionar" size="small" style={{ width: '100%' }} disabled={ record !== null } />
								</div>
							</Col>
						</div>
					</div>
				</div>
			</Col>
		)

		const renderCategorySelect = () => (
			<Col span={ 12 }>
				<div className="col-inner">
					<div id="category-select" className="box">
						<h2>Seleccionar Categoría</h2>
						<Select value={category} placeholder="Seleccione la Categoría" onChange={ (value) => handleCategorySelect(value) } >
							{ currentUser.cliente.modules.includes('CDI-FORM-CDI') && currentUser.modules.includes('CDI-FORM-GD-P') && <Select.Option value='PROVEEDOR'>Proveedor</Select.Option> }
							{ (currentUser.cliente.modules.includes('CDI-FORM-CDI') || currentUser.cliente.modules.includes('CDI-FORM-REL')) && (currentUser.modules.includes('CDI-FORM-GD-T') || currentUser.modules.includes('CDI-FORM-GF')) && <Select.Option value='COLABORADOR'>Colaborador</Select.Option> }
							{ currentUser.cliente.modules.includes('CDI-FORM-DIR') && currentUser.modules.includes('CDI-FORM-GDIR') && <Select.Option value='DIRECTOR'>Director</Select.Option> }
							{ currentUser.cliente.modules.includes('CDI-FORM-PATR') && currentUser.modules.includes('CDI-FORM-GPATR') && <Select.Option value='CLIENTE'>Cliente</Select.Option> }
						</Select>
						<img src={ groupPeopleImg } alt="" />
						<p>Seleccione el listado de usuarios que desea cargar</p>
					</div>
				</div>
			</Col>
		)

		const renderTypeSelect = () => (
      <>
      <Col span={12}>
        <div className="col-inner">
          <div id="type-select" className="box">
            <h2>Seleccione el tipo de comunicado</h2>
            <Select value={selectedType} placeholder="Seleccione el tipo de comunicado ..." onChange={ (value) => handleSelectType(value) } disabled={ record !== null || (category === 'PROVEEDOR' && !currentUser.cliente.modules.includes('CDI-FORM-PATR')) }>
							{ (category === 'COLABORADOR' || category === 'PROVEEDOR') && currentUser.modules.includes('CDI-FORM-GD') && currentUser.cliente.modules.includes('CDI-FORM-CDI') && <Select.Option value='CDI'>Conflictos de Interés</Select.Option> }
							{ category === 'DIRECTOR' && currentUser.modules.includes('CDI-FORM-GDIR') && currentUser.cliente.modules.includes('CDI-FORM-DIR') && <Select.Option value='DIR'>Declaración de Directores</Select.Option> }
							{ category === 'COLABORADOR' && currentUser.modules.includes('CDI-FORM-GREL') && currentUser.cliente.modules.includes('CDI-FORM-REL') && <Select.Option value='REL'>Declaración de Relacionados</Select.Option> }
							{ category === 'CLIENTE' && currentUser.modules.includes('CDI-FORM-GPATR') && currentUser.cliente.modules.includes('CDI-FORM-PATR') && <Select.Option value='PATR'>Relaciones Patrimoniales</Select.Option> }

							{ category === 'COLABORADOR' && currentUser.modules.includes('CDI-FORM-GF-G') && currentUser.cliente.modules.includes('CDI-FORM-G') && <Select.Option value='GIFT'>Regalos</Select.Option> }
              { category === 'COLABORADOR' && currentUser.modules.includes('CDI-FORM-GF-T') && currentUser.cliente.modules.includes('CDI-FORM-T') && <Select.Option value='TRAVEL'>Viajes</Select.Option> }
              { category === 'COLABORADOR' && currentUser.modules.includes('CDI-FORM-GF-F') && currentUser.cliente.modules.includes('CDI-FORM-F') && <Select.Option value='FP'>Reuniones con Funcionarios Públicos</Select.Option> }
              { category === 'COLABORADOR' && currentUser.modules.includes('CDI-FORM-GF-S') && currentUser.cliente.modules.includes('CDI-FORM-S') && <Select.Option value='SOC'>Participación en Asociaciones Empresariales</Select.Option> }
            </Select>
            <img className="forbidden" src={forbiddenImg} alt="" />
            <p>Seleccione el tipo de comunicado que será enviado a los destinatarios.</p>
          </div>
        </div>
      </Col>
      </>
    )

	return (
		<Modal className="modal-new-release"
			footer={ null }
			onCancel={ onClose }
			onOk={ onNewRelease }
			style={{ top: 10 }}
			visible={ isVisible }
			width={1100}
		>
			<div className="body-wrapper">
				<Row>
					<Col span={ 24 }>
						<div className="col-inner">
							<div id="subject-select" className="box">
								<h2>Ingrese el nombre del comunicado</h2>
								<div className="subject-select-inner">
									<Input onChange={ handleSubjectChange } value={subject} />
								</div>
							</div>
						</div>
					</Col>
				</Row>
				<Row>
					{
						type === 'I' ?
							<>
								{ renderPeriodicitySelect() }
								{ renderTypeSelect() }
							</>
						:
							<>
								{ renderCategorySelect() }
								{ renderTypeSelect() }
							</>
					}
				</Row>
				<Row>
					<Col span={ 24 }>
						<div className="col-inner">
							<div id="clients-unselected-list" className="box">
								<h2>Seleccione los destinatarios</h2>
								<Row className="clients">
									<Col span={12}>
										<div className="col-inner">
											<Row className="filter-row">
												<Col span={1} style={{paddingTop:'5px'}}><Checkbox onChange={ handleSelectDeselectAll } checked={chkAll}/></Col>
												<Col span={hasEmpresa ? 12 : 15}>
													<Input.Search size="small" onSearch={ handlerFilterDest } placeholder="Rut/Nombre" allowClear/>
												</Col>
												{hasEmpresa &&
													<Col span={6}>
														<Select placeholder="Empresa" style={{width:'100%'}} size="small" onChange={ handlerFilterCompany }>
															<Select.Option value={null}>[Todos]</Select.Option>
															{currentUser.cliente.clientes.map(company =>
																		<Select.Option value={company.id}>{company.name}</Select.Option>
																)
															}
														</Select>
													</Col>
												}
												<Col span={hasEmpresa ? 5 : 8}>
													<Select placeholder="Area" style={{width:'100%'}} size="small" onChange={ handlerFilterArea }>
														<Select.Option value={null}>[Todos]</Select.Option>
														{areas.map(area =>
																	<Select.Option value={area}>{area}</Select.Option>
															)
														}
													</Select>
												</Col>
											</Row>
											{ isClientsLoading ?
												<div className="loading"><Spin spinning="true" /></div>
												:
												<>
													<div className="items-wrapper">
															<div className="items-collection">
															{
																Object.keys(clientsList).map(id =>
																		<Row className="item-dest" onClick={ () => handleClientClick(clientsList[id].isSelected, id) }>
																			<Col span={1}><Checkbox checked={ clientsList[id].isSelected } /></Col>
																			<Col span={12}>{ camelizerHelper(clientsList[id].data.nombre) }</Col>
																			{hasEmpresa &&
																			<Col span={6}>{ camelizerHelper(clientsList[id].data.company) }</Col>
																		  }
																			<Col span={hasEmpresa ? 5 : 8}>{ camelizerHelper(clientsList[id].data.area) }</Col>
																		</Row>
																)
															}
															</div>
													</div>
													<Row>
														<Col className="total">
															<h4>
															{ itemsList &&
																<>
																{ itemsList.total > itemsList.records ?
																	<>Mostrando {itemsList.records} de {itemsList.total} registros</>
																:
																	<>{itemsList.total} registro{itemsList.total > 1 && 's'}</>
															  }
																</>
														  }
															</h4>
															{ itemsList !== null && itemsList.total > limitRecords &&
															<Pagination size="small" simple onChange={ handlePaginationChange } pageSize={ limitRecords } current={ currentPage } total={ itemsList.total } />
															}
														</Col>
													</Row>
												</>
											}
											<div className="add-button">
												<Button type="primary" disabled={nroClients === 0} onClick={ handleMoveToRecipients }>
													Agregar { chkAll ?
														<>
														&nbsp;{itemsList.total} contactos
														</>
														:
														<>
														{ nroClients > 0 && <span>&nbsp;{ nroClients }</span> } &nbsp;contacto{ nroClients > 1 && <>s</> }
														</>
													}
												</Button>
											</div>
										</div>
									</Col>
									<Col className="recipients" span={12}>
										<div className="col-inner">
											<Row className="filter-row">
												<Col span={1} style={{paddingTop:'5px'}}><Checkbox onChange={ handleSelectDeselectRecipient } checked={chkAllRecp} disabled={overLimit} /></Col>
												<Col span={hasEmpresa ? 12 : 15}>
													<Input.Search size="small" onSearch={ handlerFilterDestRecpt } placeholder="Rut/Nombre" allowClear/>
												</Col>
												{hasEmpresa &&
													<Col span={6}>
														<Select placeholder="Empresa" style={{width:'100%'}} size="small" onChange={ handlerFilterCompanyRecpt }>
															<Select.Option value={null}>[Todos]</Select.Option>
															{currentUser.cliente.clientes.map(company =>
																		<Select.Option value={company.name}>{company.name}</Select.Option>
																)
															}
														</Select>
													</Col>
												}
												<Col span={hasEmpresa ? 5 : 8}>
													<Select placeholder="Area" style={{width:'100%'}} size="small" onChange={ handlerFilterAreaRecpt }>
														<Select.Option value={null}>[Todos]</Select.Option>
														{areas.map(area =>
																	<Select.Option value={area}>{area}</Select.Option>
															)
														}
													</Select>
												</Col>
											</Row>
											{ isClientsLoading ?
												<div className="loading"><Spin spinning="true" /></div>
												:
												<>
												<div className="items-wrapper">
													{ !overLimit ?
														<div className="items-collection">
														{ getFilterRecipientList().map((item, index) =>
																<Row className="item-dest" onClick={ () => handleRecipientClick(item) }>
																	<Col span={1}><Checkbox checked={ item.isSelected } /></Col>
																	<Col span={12}>{ camelizerHelper(item.data.nombre) }</Col>
																	{hasEmpresa &&
																	<Col span={6}>{ camelizerHelper(item.data.company) }</Col>
																	}
																	<Col span={hasEmpresa ? 5 : 8}>{ camelizerHelper(item.data.area) }</Col>
																</Row>
														)}
														</div>
														:
														<div className="totalSelected">
															<h1>Se seleccionaron {itemsRecpList.total} registros</h1>
															<div className="filters">
																<Row>Rut/Nombre: <strong>{ filters.keyword !== null ? filters.keyword : '[Todos]' }</strong></Row>
																{hasEmpresa &&<Row>Empresa: <strong>{ filters.companyName !== null ? filters.companyName : '[Todos]' }</strong></Row>}
																<Row>Area: <strong>{ filters.area !== null ? filters.area : '[Todos]' }</strong></Row>
															</div>
														</div>
													}
												</div>
												<Row>
													<Col className="total">
														<h4>
														{ !overLimit && itemsRecpList !== null &&
																<>
																{ itemsRecpList.records === itemsRecpList.total ?
																	<>{itemsRecpList.records} registro{itemsRecpList.records>1 && 's'}</>
																	:
																	<>Mostrando {itemsRecpList.records} de { itemsRecpList.total } registros</>
																}
																</>
														}
														</h4>
													</Col>
												</Row>
												</>
											}
											<div className="add-button second">
												<Button type="primary" disabled={!overLimit && nroClientsSelected === 0} onClick={ handleMoveToClients }>
													Eliminar
													{ !overLimit ?
														<>
														{ nroClientsSelected > 0 && <span>&nbsp;{ nroClientsSelected }</span> } &nbsp;contacto{ nroClientsSelected > 1 && <>s</> }
														</>
														:
														<>&nbsp;{itemsRecpList.total} contactos</>
													}
												</Button>
											</div>
										</div>
									</Col>
								</Row>
							</div>
						</div>
					</Col>
				</Row>
				<div className="send-wrapper">
					<Popconfirm
							title={ ['Confirmar guardar', type === 'D' ? ' la Declaración? ' : ' el Informativo'] }
							placement="top"
							onConfirm={ saveThis }
							okText="Sí"
							cancelText="No"
						>
						<Button type="primary" id="send" disabled={isSaving} block={true}>
							{isSaving && <Icon type ="loading" />}
							Guardar comunicado</Button>
					</Popconfirm>
				</div>
				<div className={ isPreviewOpen ? 'visible preview-overlay' : 'no-visible preview-overlay' }>
					<Icon type="close" onClick={ handleClosePreview }/>
				</div>
			</div>
		</Modal>
	)
}

export default ModalNewRelease
