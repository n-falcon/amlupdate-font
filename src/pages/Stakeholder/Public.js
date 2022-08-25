import './Stakeholder.scss'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from "react-i18next"
import { Button, Icon, Spin, Form, Row, Col, Input, notification, Select } from 'antd'
import { getUserPromise, createUserPromise, forgotUserPromise } from './promises'
import { SessionStorageService } from '../../services'
import { Captcha } from '../../layouts/Private/components'
import validateCaptchaGoogle from './promises/validateCaptchaGoogle'
import { validateRutHelper, validateCompanyRutHelper, } from "../../helpers";

const StakePublic = ({ form, match, client, successHandler }) => {
	const { t } = useTranslation();
	const { getFieldDecorator, getFieldsError, validateFields } = form
	const [isCreate, setIsCreate] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [isRestore, setIsRestore] = useState(false)
	const [rut, setRut] = useState(null)
	const [password, setPassword] = useState(null)
	const [captchaResponse, setCaptchaResponse] = useState(null);
	const [captchaSucess, setCaptchaSuccess] = useState(false);
	const [relationship, setRelationship] = useState(null);
	const [captchaKey, setCaptchaKey] = useState(Math.random());

	const renderFormItem = (formItem) => {
		return (
			<Row className = {formItem.styleClass}>
				<Form.Item label={ formItem.label }>
					{ getFieldDecorator(formItem.name, { rules: formItem.rules })(formItem.item) }
				</Form.Item>
			</Row>
		)
	}

	const handleSubmit = async (e) => {
		handleCatpcha(false)
		setCaptchaKey(Math.random());
		e.preventDefault()
		setIsLoading(true)

		if(isRestore) {

			if(!captchaResponse) {
				notification.error({
					placement: 'topLeft',
					message: "Error",
					description: "Validacion no Superada"
				})
				setIsLoading(false)
				return;
			}

			const u = await forgotUserPromise(client.id, rut, captchaResponse)
			if (u.data.status === 'OK') {
				if(u.data.code === '401') {
					handleErrors(u.data.code, "Error", true);
				}else if(u.data.code === '409') {
					handleErrors(u.data.code, "Error", true);
				}
				else if(u.data.code === '400-10') {
					handleErrors(u.data.code, "Aviso", true);
				}
				else if(u.data.code === '400-20') {
					handleErrors(u.data.code, "Aviso", true, u.data.attemps);
				}
				else if(u.data.code === '202') {
					handleErrors(u.data.code, "Operacion Exitosa", false, u.data.attemps);
				}
				else if(u.data.code === '200') {
					setIsRestore(false)
				}
	    	}
		}else if(isCreate) {

			if (relationship === null || relationship === undefined || relationship === undefined) {
				notification.error({
				placement: 'topLeft',
				message: "Error",
				description: "Se debe ingresar relación"
				})
				setIsLoading(false)
				return;
			}

			if(!captchaResponse) {
				notification.error({
				placement: 'topLeft',
				message: "Error",
				description: "Validacion no Superada"
				})
				setIsLoading(false)
				return;
			}

			if (relationship === 'PPJ' || relationship === 'CPJ'){
				if(!validateCompanyRutHelper(rut)){
					notification.error({
					placement: 'topLeft',
					message: "Error",
					description: "Rut de Empresa no es válido"
					})
					setIsLoading(false);
					return;
				}
			}else{
				if(!validateRutHelper(rut)){
					notification.error({
					placement: 'topLeft',
					message: "Error",
					description: "Rut Persona no válido"
					})
					setIsLoading(false);
					return;
				}
			}


			const u = await forgotUserPromise(client.id, rut, captchaResponse)
			if (u.data.status === 'OK') {
				if(u.data.code === '401') {
					handleErrors(u.data.code, "Error", true);
				}else if(u.data.code === '409') {
					handleErrors(u.data.code, "Error", true);
				}
				else if(u.data.code === '400-10') {
					handleErrors(u.data.code, "Aviso", true);
				}
				else if(u.data.code === '400-20') {
					handleErrors(u.data.code, "Aviso", true, u.data.attemps);
				}
				else if(u.data.code === '202') {
					handleErrors(u.data.code, "Operacion Exitosa", false, u.data.attemps);
				}
	    	}
		}
		else {
	    const u = await getUserPromise(client.id, rut, password)
	    if (u.data.status === 'OK') {
			if(u.data.code === '401') {
				handleErrors(u.data.code, "Error", true, u.data.attemps);
			}
			else if(u.data.code === '409') {
				handleErrors(u.data.code, "Error", true);
			}
			else if(u.data.code === '400-10') {
				handleErrors(u.data.code, "Aviso", true);
			}
			else if(u.data.code === '202') {
				await successHandler(u.data.record, u.data.code)
			}
			else if(u.data.code === '200') {
				await successHandler(u.data.record, u.data.code)
			}
	    }
		}
		setIsLoading(false)
  }

	const handleUsernameOnChange = (rut) => {
		setRut(rut);
	}

	const handlePasswordOnChange = (password) => {
		setPassword(password)
	}

	const handleRelationshipOnChange = (relationship) => {
		setRelationship(relationship)
	}

	const handleSwitchToRestore = async (e) => {
		form.setFieldsValue({rut: ''})
		e.preventDefault()
		setIsRestore(true)
		handleCatpcha(false)
	}

	const handleSwitchToCreate = async (e) => {
		form.setFieldsValue({rut: ''})
		e.preventDefault()
		setIsCreate(true)
		handleCatpcha(false)
	}

	const handleSwitchToLogin = async (e) => {
		e.preventDefault()
		setIsRestore(false)
		setIsCreate(false)
		handleCatpcha(false)
	}

	const handleCatpcha = async (success, response) => {
		setCaptchaSuccess(success);
		if(response){
			setCaptchaResponse(response);
		}else{
			setCaptchaResponse(null);
			setCaptchaSuccess(false);
		}
	}


	const handleErrors = (errorCode, title, isError, attemps = null) => {
		let errorMsg = "Ocurrio un Error";
		switch(errorCode){
			case "202":
			if(attemps){
				errorMsg = `Por favor, revise su correo electrónico, le hemos enviado una contraseña, el usuario será bloqueado en ${attemps} intentos`
			}else{
				errorMsg = "Hemos enviado una contraseña al correo electrónico registrado en la plataforma"
			}
			break;
			case "401":
			if(attemps){
				errorMsg = `Nombre de usuario y/o contraseña incorrectos, el usuario será bloqueado en ${attemps} intentos`
			}else{
				errorMsg = "Nombre de usuario y/o contraseña incorrectos"
			}
			break;
			case "400-10":
				errorMsg = "El usuario ha sido bloqueado, inténtelo más tarde.";
			break;
			case "409":
				errorMsg = "Ocurrio un problema con su solicitud, contacte al encargado de " + client.name;
			break;
		}

		if(isError){
			notification.error({
placement: 'topLeft',
				message: title,
				description: errorMsg
			  })
		}else{
			notification.success({
placement: 'topLeft',
				message: title,
				description: errorMsg
			  })
		}

		setIsCreate(false);
		setIsRestore(false);
	}

	return (

		<div className="stakeholder-public">
			<div className="login">
				<div className="login-content">
					<Row>
					{/* {!(isCreate || isRestore) &&

						<Col className="instructions-box" xs={4} sm={5} md={6} lg={7} xl={7} push={15}>
							<>
							<h3>
								Instrucciones
							</h3>
							<p>
								Estimado usuario para ingresar al portal considere lo siguiente:
								<ul>
								<li> Si es persona natural debe ingresar el número de su documento de identidad seguido de su contraseña.</li>
								<li> Si es persona jurídica debe ingresar el número de documento de su empresa seguido de su contraseña.</li>
								</ul>
							</p>
							<p>
								En caso sea un <u>Nuevo Usuario</u> debe seguir los siguientes pasos:
								<ol>
									<li>Ingrese su número de documento (teniendo en cuenta si es persona natural o jurídica)</li>
									<li>Presione <strong>Solicitar contraseña</strong></li>
									<li>Marque el captcha</li>
									<li>Presione <strong>Enviar</strong></li>
									<li>La contraseña será enviada al correo electrónico previamente registrado en la plataforma.</li>
									<li>Cuando eso suceda, ingrese su usuario y la contraseña enviada; seguidamente el sistema le solicitará definir una contraseña personalizada.</li>
								</ol>
							</p>
							</>
						</Col>
					} */}
						<Col xs={20} offset={2} className="login-container">
							<div className="login-box">
								<Form onSubmit={ handleSubmit } className="login-form">
									<Row>
										<Col xs={ 24 }>
										{ isRestore ?
												<h2>Olvidé mi contraseña</h2>
												:
												(isCreate ? <h2>Solicite su contraseña</h2>
												:
												(
													<h2 className="title">
														<span>Iniciar sesión <br/> Portal de Usuarios</span>
													</h2>
													)
												)
											}
										</Col>
									</Row>
									{(isCreate || isRestore) &&
										<Row>
											<Col xs={ 24 }>
												{
													renderFormItem({
														label: "Seleccione la relación que posee con " + client.name,
														styleClass: "crud-label",
														name: 'relationship',
														rules: [{ required: true, message: t('messages.aml.dontForgetUsername') }],
														item: (
															<Select
																disabled={ false }
																onChange={ handleRelationshipOnChange }
																prefix={ <Icon type="user" style={{ color: 'rgba(0,0,0,.2)' }} /> }
																placeholder={ "Selecciona una relación" }
															>
																<Select.Option value="PPN">Proveedor Persona Natural</Select.Option>
																<Select.Option value="PPJ">Proveedor Persona Jurídica</Select.Option>
																<Select.Option value="CPN">Cliente Persona Natural</Select.Option>
																<Select.Option value="CPJ">Cliente Persona Jurídica</Select.Option>
																<Select.Option value="COL">Colaborador</Select.Option>
																<Select.Option value="DIR">Director</Select.Option>
															</Select>
														)
													})
												}
											</Col>
										</Row>
									}
									<Row>
										<Col xs={ 24 }>
											{
												renderFormItem({
													label: (isCreate || isRestore) ? (relationship === 'PPJ' || relationship === 'CPJ' ? "Ingrese el Rut de su Empresa (sin puntos ni guiones)" : "Ingrese su Rut (sin puntos ni guiones)"):"Rut (sin puntos ni guiones)",
													styleClass: "crud-label",
													name: 'rut',
													rules: [{ required: true, message: t('messages.aml.dontForgetUsername') }],
													item: (
														<Input
															disabled={ false }
															onChange={ (e) => handleUsernameOnChange(e.target.value) }
															prefix={ <Icon type="user" style={{ color: 'rgba(0,0,0,.2)' }} /> }
															placeholder={ t('messages.aml.rutNumber') }
															/>
													)
												})
											}
										</Col>
									</Row>
									{ !isRestore && !isCreate &&
										<Row>
											<Col xs={ 24 }>
												{
													renderFormItem({
														label: "Contraseña",
														styleClass: "crud-label",
														name: 'password',
														rules: [{ required: true, message: t('messages.aml.dontForgetPassword') }],
														item: (
															<Input
																onChange={ (e) => handlePasswordOnChange(e.target.value) }
																type="password"
																autocomplete="off"
																prefix={ <Icon type="lock" style={{ color: 'rgba(0,0,0,.2)' }} /> }
																placeholder={ t('messages.aml.password') }
																/>
														)
													})
												}
											</Col>
										</Row>
									}
									{(isRestore || isCreate) &&
										<Row className="captchaVerify" style={{paddingTop:'10px'}}>
											<Captcha success={handleCatpcha} key={captchaKey}/>
										</Row>
									}
									{ (captchaSucess || (!isRestore && !isCreate)) &&
									<Row>
										<Col xs={ 24 }>
											<Button className="login-form-button-portal" type="primary" htmlType="submit">{ !isRestore && !isCreate ? "Iniciar Sesión" : t('messages.aml.send') }</Button>
										</Col>
									</Row>
									}
									{ isRestore ?
										<Row className="login-description">
											<Col xs={ 24 }>
											Una nueva contraseña será enviada al correo electrónico previamente registrado en la plataforma. Si el correo no llega por favor comuníquese con el encargado de <b>{client.name}</b>.
											</Col>
										</Row>
										: isCreate ?
										<Row className="login-description">
											<Col xs={ 24 }>
												La contraseña será enviada al correo electrónico previamente registrado en la plataforma. Si el correo no llega por favor comuníquese con el encargado de <b>{client.name}</b>.
											</Col>
										</Row>
										:
										<Row>
										</Row>
									}
									{(!isRestore && !isCreate) &&
									<>
										<Row className="forgot-container">
											<a href='#' onClick={ handleSwitchToRestore }> Olvidé mi contraseña </a>
										</Row>

										<Row className="forgot-container">
											¿Primera vez que usa al Portal de Usuarios?
										</Row>
										<Row>
											<a href='#' onClick={ handleSwitchToCreate }> Solicite su contraseña</a>
										</Row>
									</>
									}
									{ (isRestore || isCreate) &&
										<a href='#' className="login-link-portal" onClick={ handleSwitchToLogin } style={{ display: 'block', textAlign: 'center', paddingTop: 15 }}>{ t('messages.aml.backToLogin') }</a>
									}
								</Form>
							</div>


							</Col>
					</Row>
				</div>
			</div>
		</div>
	)
}

const StakeForm = Form.create({ name: 'login_form' })(StakePublic)
export default StakeForm
