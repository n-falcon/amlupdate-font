import './TabNewRequest.scss'
import React, { useState } from 'react'
import { Col, Row, Button, Modal } from 'antd'
import { FormModal } from '../../../../layouts/Private/components'


const TabNewRequest = ({ client, currentUser }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [typeForm, setTypeForm] = useState(false)
	const [showForm, setShowForm] = useState(false);
	// const {t, closeHandler, embeded } = this.props;


	const openForm = (type) => {
		setTypeForm(type);
		console.log(showForm);
		setIsLoading(true)
		setShowForm(true);
	}

	const modalReady = () => {
		setIsLoading(false)
		setShowForm(false);
	}

	return (
		<div className="tab-new-request">
			<p>
				<h3>
				Bienvenido (a) a este Portal, donde en simples pasos podrás hacer tu declaración de
				conflictos de interés y/o completar distintos formularios dependiendo de las
				situaciones a las que te enfrentes y que así lo requieran.
				</h3>
			</p>
			{ (currentUser.category === 'COLABORADOR' || currentUser.category === 'PROVEEDOR')  &&
				<>
					{ client.modules.includes('CDI-FORM-CDI') &&
						<Row>
							<Button icon={isLoading ? 'loading': 'plus'} type="primary" disabled={isLoading} onClick={() => openForm('CDI')}>Declaración de Conflicto de Interes</Button>
						</Row>
					}
					{ currentUser.category === 'COLABORADOR' && client.modules.includes('CDI-FORM-REL') &&
						<Row>
							<Button icon={isLoading ? 'loading': 'plus'} disabled={isLoading} type="primary" onClick={() => openForm('REL')}>Relacionados</Button>
						</Row>
					}
				</>
			}
			{ (currentUser.category === 'CLIENTE')  &&
				<>
					{ client.modules.includes('CDI-FORM-PATR') &&
						<Row>
							<Button icon={isLoading ? 'loading': 'plus'} disabled={isLoading} type="primary" onClick={() => openForm('PATR')}>Relaciones Patrimoniales</Button>
						</Row>
					}
				</>
			}
			{ (currentUser.category === 'DIRECTOR')  &&
				<>
					{ client.modules.includes('CDI-FORM-DIR') &&
						<Row>
							<Button icon={isLoading ? 'loading': 'plus'} disabled={isLoading} type="primary" onClick={() => openForm('DIR')}>Declaración de Conflicto de Interés de Directores</Button>
						</Row>
					}
				</>
			}
			{ currentUser.category === 'COLABORADOR' &&
				<>
					{ client.modules.includes('CDI-FORM-T') &&
						<Row>
							<Button icon={isLoading ? 'loading': 'plus'} disabled={isLoading} type="primary" onClick={() => openForm('TRAVEL')}>Formulario de Viajes (Nacionales o Internacionales)</Button>
						</Row>
					}
					{ client.modules.includes('CDI-FORM-G') &&
						<Row>
							<Button icon={isLoading ? 'loading': 'plus'} disabled={isLoading} type="primary" onClick={() => openForm('GIFT')}>Formulario de Regalos, Invitaciones y Beneficios No Monetarios</Button>
						</Row>
					}
					{ client.modules.includes('CDI-FORM-F') &&
						<Row>
							<Button icon={isLoading ? 'loading': 'plus'} disabled={isLoading} type="primary" onClick={() => openForm('FP')}>Formulario de Reunión con Autoridades y Funcionarios Públicos</Button>
						</Row>
					}
					{ client.modules.includes('CDI-FORM-S') &&
						<Row>
							<Button icon={isLoading ? 'loading': 'plus'} disabled={isLoading} type="primary" onClick={() => openForm('SOC')}>Formulario de Participación en Asociaciones Empresariales</Button>
						</Row>
					}
				</>
			}

			<p>
				<h3>
				En las declaraciones se encuentran destacadas en negrita aquellos conceptos que te podrían generar dudas. De ser así, ubica el cursor encima y conoce de qué trata.<br/>
				En caso de dudas contáctate con soporte.aml@gesintel.cl
				</h3>
			</p>
			<FormModal client={client} currentUser={currentUser} typeForm={typeForm} modalReady={modalReady} showForm={showForm} />
		</div>


	)
}

export default TabNewRequest
