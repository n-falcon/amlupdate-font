import './ModalViewMatch.scss'
import React, { useEffect, useState } from 'react'
import { Button, Col, Modal, Radio, Row, Select, Spin, Switch, Table, Tooltip, Icon } from 'antd'
import { getMatchesPromise, saveObsFormPromise, getVinculosPromise } from './promises'
import moment from 'moment'
import apiConfig from '../../../../config/api'
import authImg from './authorization.png'
import { camelizerHelper } from '../../../../helpers/'
import { useTranslation } from "react-i18next";
import { ReportService } from '../../../../services/'


const ModalViewMatch = ({ item, onCancel, onOk }) => {
	const {t} = useTranslation()
	const [itemData, setItemData] = useState({})
	const [vinculos, setVinculos] = useState([])
	const [isItemDataLoading, setIsItemDataLoading] = useState(true)
  const [selectedRisk, setSelectedRisk] = useState(null)
	const [observations, setObservations] = useState(null)
	const [category, setCategory] = useState(null)
	const [isLoadingVinculos, setIsLoadingVinculos] = useState(true)

	const handleGetMatches = async id => {
		const i = await getMatchesPromise(id)
		setItemData(i.data)
    setSelectedRisk(i.data.risk)
    setObservations(i.data.observations)
		if(i.data.group.id === i.data.group.request.group1.id) {
			if(i.data.group.request.group2 !== null) setCategory(i.data.group.request.group2.category)
			else setCategory(i.data.group.request.group1.category)
		}
		else setCategory(i.data.group.request.group1.category)
		setIsItemDataLoading(false)

		getVinculosPromise(i.data.destVersionId).then((response) => {
			setVinculos(response.data)
			setIsLoadingVinculos(false)
		})
	}

	const handleDownloadReport = async (id) => {
		await ReportService.read('/cdi/excelMatchRelacionados/' + id, null, null, (itemData.record.type === 'Person' ?  "Parientes":"Ubos") + itemData.record.rut + ".xlsx")
	}

	const handleDownloadReportParientes = async (id) => {
		await ReportService.read('/cdi/excelParientesUbos/' + id, null, null,  "ParientesUbos" + itemData.record.rut + ".xlsx")
	}


	useEffect(() => {
		handleGetMatches(item.id)
	}, [])

	const tableColumns = [
		{
			title: 'Categoría: ' + t('messages.aml.category.'+category)
			,
			children: [
				{
					title: 'Nombre',
					dataIndex: 'nombre',
					width: 200,
					render: (text) => {
						return camelizerHelper(text)
					}
				},
				{
					title: 'Rut',
					dataIndex: 'rut',
					width: 100
				},
				{
					title: 'Tipo Relación',
					dataIndex: 'rut',
					width: 100,
					render: (text, record) => {
						if(record.rutRelacionadoA === null && record.rutRelacionadoB === null && (record.rutRelacion.toUpperCase() === record.rut.toUpperCase() || record.rutRelacion.toUpperCase() === itemData.record.rut.toUpperCase())) return 'Directa'
						else return 'Indirecta'
					}
				},
				{
					title: 'Relación',
					dataIndex: 'relacion',
					width: 100,
					render: (text, record) => {
						if(record.rutRelacionadoA === null && record.rutRelacionadoB === null) {
							if(record.rutRelacion.toUpperCase() === record.rut.toUpperCase()) return camelizerHelper(text)
							else if(record.rutRelacion.toUpperCase() === itemData.record.rut.toUpperCase()) return camelizerHelper(record.relacionRelacion)
						}
					}
				}
			]
		},
		{
			title: 'Vinculos identificados',
			dataIndex: 'relacion',
			render: (text, record) => {
				let data = [{rut: itemData.record.rut, name: itemData.record.nombre, type: 'nodo', category: itemData.record.category}]
				if(record.rutRelacionadoA === null && record.rutRelacionadoB === null) {
					if(record.rutRelacion.toUpperCase() === record.rut.toUpperCase()) {
						data.push({type: 'conector', name: record.relacion, iconType: 'caret-right', iconClass: 'right', participacion: record.participacion})
					}else if(record.rutRelacion.toUpperCase() === itemData.record.rut.toUpperCase()) {
						data.push({type: 'conector', name: record.relacionRelacion, iconType: 'caret-right', iconClass: 'right', participacion: record.participacionRelacion})
					}else {
						data.push({type: 'conector', name: record.relacion, iconType: 'caret-right', iconClass: 'right', participacion: record.participacion})
						data.push({type: 'nodo', rut: record.rutRelacion, name: record.nombreRelacion})
						data.push({type: 'conector', name: record.relacionRelacion, iconType: 'caret-left', iconClass: 'left', participacion: record.participacionRelacion})
					}
				}else if(record.rutRelacionadoA !== null && record.rutRelacionadoB === null) {
					data.push({type: 'conector', name: record.relacionA, iconType: 'caret-right', iconClass: 'right', participacion: record.participacionA})
					data.push({type: 'nodo', rut: record.rutRelacionadoA, name: record.nombreRelacionadoA})
					data.push({type: 'conector', name: record.relacion, iconType: 'caret-right', iconClass: 'right', participacion: record.participacion})
				}else if(record.rutRelacionadoA === null && record.rutRelacionadoB !== null) {
					data.push({type: 'conector', name: record.relacion, iconType: 'caret-right', iconClass: 'right', participacion: record.participacion})
					data.push({type: 'nodo', rut: record.rutRelacion, name: record.nombreRelacion})
					data.push({type: 'conector', name: record.relacionRelacion, iconType: 'caret-left', iconClass: 'left', participacion: record.participacionRelacion})
					data.push({type: 'nodo', rut: record.rutRelacionadoB, name: record.nombreRelacionadoB})
					data.push({type: 'conector', name: record.relacionB, iconType: 'caret-right', iconClass: 'right', participacion: record.participacionB})
				}else {
					data.push({type: 'conector', name: record.relacionA, iconType: 'caret-right', iconClass: 'right', participacion: record.participacionA})
					data.push({type: 'nodo', rut: record.rutRelacionadoA, name: record.nombreRelacionadoA})
					data.push({type: 'conector', name: record.relacion, iconType: 'caret-right', iconClass: 'right', participacion: record.participacion})
					data.push({type: 'nodo', rut: record.rutRelacion, name: record.nombreRelacion})
					data.push({type: 'conector', name: record.relacionRelacion, iconType: 'caret-left', iconClass: 'left', participacion: record.participacionRelacion})
					data.push({type: 'nodo', rut: record.rutRelacionadoB, name: record.nombreRelacionadoB})
					data.push({type: 'conector', name: record.relacionB, iconType: 'caret-right', iconClass: 'right', participacion: record.participacionB})
				}
				data.push({type: 'nodo', rut: record.rut, name: record.nombre, category: record.categoria})
				return (
					<div className="relation">
					{ data.map((item, i) =>
						<div className={'relation-type-' + item.type + (item.category !== undefined ? ' category category-'+item.category : '')} title={camelizerHelper(item.name)}>
							{ item.type === 'nodo' ?
								<>
									{ item.category !== undefined &&
										<span className="category">{item.category === 'COLABORADOR' ? 'T' : item.category === 'PROVEEDOR' ? 'P' : 'C'}</span>
									}
									<Tooltip title={camelizerHelper(item.name)}>
										<div className="rut">{item.rut}</div>
									</Tooltip>
								</>
								:
								<>
								<Icon type={item.iconType} className={item.iconClass}/>
								<div className="name">{camelizerHelper(item.name)}{item.name === 'UBO' && item.participacion !== null && ' ('+item.participacion+'%)'}</div>
								</>
							}
						</div>
						)
					}
					</div>
				)
			}
		}
	]

  const handleRiskChange = async(e) => {
		setSelectedRisk(e.target.value)
  }

  const handleObservationsChange = async(e) => {
    setObservations(e.target.value)
  }

  const handleSave = async () => {
    let i = await saveObsFormPromise(item.id, selectedRisk, observations)
    onCancel()
  }

  const renderStatus = (text) => {
    switch (text) {
      case 'NEW':
        return 'Enviado'

      case 'OPEN':
        return 'Enviado'

      case 'SAVED':
        return 'Enviado'

      case 'SENT':
        return 'Completado'
    }
  }

	return (
		<Modal
			className="modal-view-match"
			footer={ null }
			header={ null }
			onCancel={ onCancel }
			onOk={ onOk }
			visible="true"
		>
			<>
			{
				isItemDataLoading ? <div className="spinner"><Spin spinning={true} size="big" /></div> :
				<>
				<div className="box">

					<h2>
						<span>Ficha</span>
						<span style = {{marginLeft:'750px'}}>Folio: {itemData.group.request.folio}</span>
					</h2>


					<div className="box-inner" style={{ padding: '10px 5px 0px' }}>
							<Row>
								<Col span={ 12 }>
									<div className="col-inner">
										<div className="key">Nombre</div>
										<div className="value">{ camelizerHelper(itemData.record.nombre) }</div>
									</div>
								</Col>
								<Col span={ 12 }>
									<div className="col-inner">
										<div className="key">Rut</div>
										<div className="value">{ itemData.record.rut }</div>
									</div>
								</Col>
							</Row>
							<Row>
								<Col span={ 12 }>
									<div className="col-inner">
										<div className="key">Empresa</div>
										<div className="value">{ itemData.record.subcliente !== null ? camelizerHelper(itemData.record.subcliente.name):'-'}</div>
									</div>
								</Col>
								<Col span={ 12 }>
									<div className="col-inner">
										<div className="key">Area</div>
										<div className="value">{ camelizerHelper(itemData.record.area) }</div>
									</div>
								</Col>
							</Row>
					</div>
				</div>

				<div className="box">

						<Row style={{ padding: 0 }}>
							<Col xs={ 24 }>
										<ul className="top-5-items" style={{ paddingTop: 0 }} >
													{
														itemData.record.type === 'Person' && itemData.group.request.levels.includes('PARENT') &&
														<li>
														<Button className ="buttonx" type = "primary" onClick={ () => handleDownloadReport(item.id) }>
															Descargar Malla Parental
														</Button>
														</li>
													}

													{
													 itemData.record.type === 'Entity' &&
														<>
														{ itemData.group.request.levels.includes('UBO') &&
														<li>
															<Button className ="buttonx" type = "primary" onClick={ () => handleDownloadReport(item.id) }  >
																Descargar Beneficiarios Finales
															</Button>
														</li>
														}
														{ itemData.group.request.levels.includes('PARENT-UBO') &&
														<li>
															<Button className ="buttonx" type = "primary" onClick={ () => handleDownloadReportParientes(item.id) }>
																Descargar Mallas Parentales <br/>
																Beneficiarios Finales
															</Button>
														</li>
														}
													</>
													}
										</ul>
							</Col>
						</Row>

				</div>


				<div className="box">
					<h2>Observaciones</h2>
					<div className="box-inner">
						<div className="declarations">
							<Row className="declaration-foot">
                <Col xs={ 24 }>
									<ul className="bottom-2-items">
										<li>
											<div className="col-inner">
												<div className="key">Riesgo</div>
												<div className="value" style={{ height: 'auto' }}>
													{ (itemData.status !== 'FINISHED' || !itemData.hasPositives) &&
														<div className="block-risk">

														</div>
													}
													<Radio.Group defaultValue={selectedRisk} size="small" onChange={ handleRiskChange }>
														<ul className="value-items">
															<li><Radio value="HIGH" /> Alto</li>
															<li><Radio value="MEDIUM" /> Medio</li>
                              <li><Radio value="LOW" /> Bajo</li>
                              <li><Radio value="N" /> No posee</li>
														</ul>
													</Radio.Group>
												</div>
											</div>
										</li>
										<li>
											<div className="col-inner">
												<div className="key">Detalle</div>
												<div className="value" style={{ height: 111 }}>
													<textarea id="observations" value={ observations } onChange={ handleObservationsChange }></textarea>
												</div>
											</div>
										</li>
									</ul>
								</Col>
							</Row>
						</div>
					</div>
				</div>
          <div className="box">
            <h2>Vínculos</h2>
							<div className="box-inner">
								<Row>
									<Col xs = {24}>
										{ isLoadingVinculos ? <Spin /> :
										<Table bordered className = "table-data" pagination = {false} dataSource = {vinculos} columns = {tableColumns} size ='small'></Table>
										}
									</Col>
								</Row>
	            </div>
          </div>
        <div className="bottom">
          <Button type="primary" onClick={handleSave} disabled={ selectedRisk === null }>Guardar</Button>
        </div>
          </>
        }
			</>
		</Modal>
	)
}

export default ModalViewMatch
