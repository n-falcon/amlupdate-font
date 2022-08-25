import './Filters.scss'
import React, { useEffect, useState } from 'react'
import ReactDom from 'react-dom'
import moment from 'moment'
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd'

const Filters = ({ form, onSubmit, type }) => {
	const { Option } = Select
	const [ isCustomDateRangeEnabled, setIsCustomDateRangeEnabled ] = useState(false)
	const { getFieldDecorator } = form
  const [optDates, setOptDates] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [keyword, setKeyword] = useState('')
  const [hasMatches, setHasMatches] = useState('')
	const [status, setStatus] = useState('')
	const [risk, setRisk] = useState('')


	useEffect(() => {
	}, [])

  const handleKeywordChange = async e => {
    setKeyword(e.target.value)
  }

	const handleDateRangeChange = async (value) => {
    await setOptDates(value)

		if (value === 'RANGE') {
			await setIsCustomDateRangeEnabled(true)
		} else {
			if (isCustomDateRangeEnabled) {
				await setIsCustomDateRangeEnabled(false)
			}
		}
	}

  const handleStatusChange = value => {
    setStatus(value)
	}
	const handleRiskChange = value => {
    setRisk(value)
  }

  const handleHasMatchesChange = async value => {
    await setHasMatches(value)
  }

  const handleDateFromToChange = async (type, value) => {
    switch(type) {
      case 'from':
        await setFromDate(moment(value).format('DD/MM/YYYY'))
        break

      case 'to':
        await setToDate(moment(value).format('DD/MM/YYYY'))
        break
    }
  }

	const handleFormSubmit = (e) => {
		e.preventDefault()

    onSubmit({ keyword, optDates, fromDate, toDate, status,risk, hasMatches })
	}

	const handleClear = () => {
    setKeyword('')
    setOptDates('')
    setFromDate('')
    setToDate('')
		setStatus('')
		setRisk('')
    setHasMatches('')

    form.setFieldsValue({ keyword: '', optDates: '', fromDate: '', toDate: '', status: '',risk: '', hasMatches: '' })

    onSubmit({ keyword:null, optDates:null, fromDate:null, toDate:null, status:null,risk:null, hasMatches:null })
  }

	return (
		<div className="conflicts-filters">
			<Form id="filters" onSubmit={ handleFormSubmit }>
				<div className="filters-inner">
					<Row>
						<Col span={ type === 'CDI' || type === 'MATCH' ? 8 : (type === 'FORM' || type === 'REGISTRO' ? 16 : 24) }>
							<div className="col-inner">
								<label>Palabras clave</label>
							</div>
						</Col>
						{ type === 'FORM' &&
							<Col span={ 8 }>
								<div className="col-inner">
									<label>Riesgo</label>
								</div>
							</Col>
						}
            { (type === 'CDI' || type === 'MATCH' || type === 'REGISTRO') &&
              <>
								{(type === 'CDI' || type === 'MATCH') &&
	                <Col span={ 8 }>
	    							<div className="col-inner">
											<label>Estado</label>
	    							</div>
	    						</Col>
								}
                <Col span={ type === 'REGISTRO' ? 8 : 4 }>
    							<div className="col-inner">
    								<label>Con vínculos</label>
    							</div>
    						</Col>
								{ (type === 'CDI' || type === 'MATCH') &&
									<Col span={ 4 }>
	    							<div className="col-inner">
											<label>Riesgo</label>
	    							</div>
	    						</Col>
								}
              </>
            }
					</Row>
					<Row>
						<Col span={ type === 'CDI' || type === 'MATCH' ? 8 : (type === 'FORM' || type === 'REGISTRO' ? 16 : 24) }>
              <div className="col-inner">
  							<Form.Item>
  								{ getFieldDecorator('keyword')(<Input.Search suffix={null} onChange={ handleKeywordChange } size="small" />) }
  							</Form.Item>
              </div>
						</Col>
						{ type === 'FORM' &&
							<Col span={ 8 }>
								<div className="col-inner">
									<Form.Item>
									{
										getFieldDecorator('risk')(
											<Select value={risk} placeholder="Seleccione un riesgo ..." onChange={ handleRiskChange } size="small">
												<Option value="NA">No Asignado</Option>
												<Option value="N">No Posee</Option>
												<Option value="LOW">Bajo</Option>
												<Option value="MEDIUM">Medio</Option>
												<Option value="HIGH">Alto</Option>
											</Select>
										)
									}
									</Form.Item>
								</div>
							</Col>
						}
            { (type === 'CDI' || type === 'MATCH' || type === 'REGISTRO') &&
              <>
								{(type === 'CDI' || type === 'MATCH') &&
	                <Col span={ 8 }>
	                  <div className="col-inner">
	      							<Form.Item>
	      								{ getFieldDecorator('status')(
														origin === 'form' ?
	                          <Select value={status} placeholder="Seleccione un estado ..." onChange={ handleStatusChange } size="small">
	                            <Option value="ENVIADO">Enviado</Option>
	                            <Option value="COMPLETADO">Completado</Option>
	                          </Select>
														:
														<Select value={status} placeholder="Seleccione un estado ..." onChange={ handleStatusChange } size="small">
	                            <Option value="PENDING">Pendiente</Option>
	                            <Option value="FINISHED">Finalizado</Option>
	                          </Select>
													)
	                      }
	      							</Form.Item>
	                  </div>
    							</Col>
								}
                <Col span={ type === 'REGISTRO' ? 8 : 4 }>
                  <div className="col-inner">
      							<Form.Item>
                      {
                        getFieldDecorator('hasMatches')(
                          <Select placeholder="Seleccionar" onChange={ handleHasMatchesChange } size="small">
                            <Option value={true}>Si</Option>
                            <Option value={false}>No</Option>
                          </Select>
                        )
                      }
                    </Form.Item>
                  </div>
    						</Col>
								{ (type === 'CDI' || type === 'MATCH') &&
									<Col span={ 4 }>
										<Form.Item>
											{
												getFieldDecorator('risk')(
													<Select value={risk} placeholder="Seleccione un riesgo ..." onChange={ handleRiskChange } size="small">
														<Option value="NA">No Asignado</Option>
														<Option value="N">No Posee</Option>
														<Option value="LOW">Bajo</Option>
														<Option value="MEDIUM">Medio</Option>
														<Option value="HIGH">Alto</Option>
													</Select>
												)
											}
										</Form.Item>
									</Col>
								}
              </>
            }
					</Row>
					<Row>
						<Col span={8}>
							<div className="col-inner">
								<label>Rango de tiempo</label>
							</div>
						</Col>
						<Col span={8}>
							<div className="col-inner">
								<label>Fecha desde</label>
							</div>
						</Col>
						<Col span={8}>
							<div className="col-inner">
								<label>Fecha hasta</label>
							</div>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
							<div className="col-inner">
								<Form.Item>
									{
										getFieldDecorator('optDates')(
											<Select defaultValue="ALL" value={optDates} onChange={ handleDateRangeChange } size="small">
												<Option value="ALL">[ Todas las fechas ]</Option>
												<Option value="TODAY">Hoy</Option>
												<Option value="WEEK">Última semana</Option>
												<Option value="MONTH">Último mes</Option>
												<Option value="3MONTH">Últimos 3 meses</Option>
												<Option value="RANGE">Rango personalizado</Option>
											</Select>
										)
									}
								</Form.Item>
							</div>
						</Col>
						<Col span={8}>
							<div className="col-inner">
								<Form.Item>
									{
										getFieldDecorator('fromDate')(
											<DatePicker disabled={ !isCustomDateRangeEnabled } format="DD/MM/YYYY" style={{ width: '100%' }} onChange={ (value) => handleDateFromToChange('from', value) }  size="small" />
										)
									}
								</Form.Item>
							</div>
						</Col>
						<Col span={8}>
							<div className="col-inner">
								<Form.Item>
									{
										getFieldDecorator('toDate')(
											<DatePicker disabled={ !isCustomDateRangeEnabled } format="DD/MM/YYYY" style={{ width: '100%' }} onChange={ (value) => handleDateFromToChange('to', value) } size="small" />
										)
									}
								</Form.Item>
							</div>
						</Col>
					</Row>
				</div>
				<div className="buttons">
					<Row>
						<Col span={ 24 }>
							<div className="col-inner">
								<Button htmlType="submit" icon="check" type="primary">Aplicar</Button>
								<Button icon="stop" type="primary" onClick={ handleClear }>Limpiar</Button>
							</div>
						</Col>
					</Row>
				</div>
			</Form>
		</div>
	)
}

export default Form.create()(Filters)
