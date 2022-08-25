import './TabDeclarations.scss'
import React, { useCallback, useEffect, useState } from 'react'
import { Col, Row, Button, Table, Modal } from 'antd'
import { getFormsPromise } from './promises'
import moment from 'moment'
import apiConfig from '../../../../config/api'
import { ModalPdfViewer } from '../../../InterestConflicts/components'
import { FormModal } from '../../../../layouts/Private/components'

const TabDeclarations = ({ client, currentUser }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [items, setItems] = useState([])
	const [selectedForm, setSelectedForm] = useState({})
	const [formIsVisible, setFormIsVisible] = useState (false)
	const [formId, setFormId] = useState (null)
	const [showForm, setShowForm] = useState(false)

	useEffect(() => {
		setFormIsVisible(false)
		setIsLoading(true)
		getFormsPromise(currentUser.id).then((data) => {
			setItems(data.data)
			setIsLoading(false)
		})
	}, [])

	const onCancelFormModal = () => {
		setFormIsVisible(false);
	}

	const onClickFormModal = (id) => {
		setFormId(id);
		setFormIsVisible(true);
	}

	const tableColumns = [
		{
			title: 'Tipo',
			dataIndex: 'type',
			render: (text, record) => {
				if(text === 'CDI') return 'Conflicto de Interés'
				else if(text === 'FP') return 'Reunión con Autoridades y Funcionarios Públicos'
				else if(text === 'TRAVEL') return 'Viajes'
				else if(text === 'GIFT') return 'Regalos'
				else if(text === 'SOC') return 'Participación en Asociaciones Empresariales'
				else if(text === 'DIR') return 'Declaracion de Directores'
				else if(text === 'PATR') return 'Relaciones Patrimoniales'
				else if(text === 'REL') return 'Relacionados'
				else if(text === 'KYC') return 'Onboarding'
			}
		}/*, {
			title: 'Nombre',
			dataIndex: 'subject'
		}*/, {
			title: 'Folio',
			dataIndex: 'folio'
		}, {
			title: 'Fecha',
			dataIndex: 'creationDate',
      render: (text, record) => {
        return moment(text).format('DD/MM/YYYY')
      }
		}, {
			title: 'Estado',
			dataIndex: 'status',
      render: (text, record) => {
		let status
		let date
		switch (text) {
			case 'NEW':
				if(record.sendDate === null) status = 'Pendiente'
				else status = 'Enviado'
				date = record.sendDate
			break;

			case 'OPEN':
				status = 'Enviado'
				date = record.sendDate
			break;

			case 'SAVED':
				status = 'Enviado'
				date = record.sendDate
			break;

			case 'SENT':
				status = 'Completado'
				date = record.receiveDate
			break;
			}

		return (
			<>
				<div>{ status }</div>
				<small>{ text === 'SENT' ? moment(date).format('DD/MM/YYYY') : (date !== null ? moment(date).fromNow() : null) }</small>
			</>
		)
      }
		}, ,{
			title: 'Recordatorios',
			dataIndex: 'nroReminders',
			render: (text, record) => {
				return text + (record.lastReminder !== null && ' - ' + moment(record.lastReminder).format('DD/MM/YYYY'))
			}
		}, {
			title: 'Formulario',
			dataIndex: 'id',
			render: (text, record) => {
				if(record.status === 'SENT') {
					return (<Button icon="menu" size="small" type="primary" onClick={ () => onClickFormModal(record.id) }> Ver formulario </Button>)
				}else if(record.sendDate !== null) {
					return (<Button icon={isLoading ? 'loading': 'MENU'} disabled={isLoading} size="small" type="primary" onClick={ () => openForm(record) }> <a style={{ color: 'white', fonSize: '0.9em' }} target="_blank">Completar formulario</a></Button>)
				}
			}
		},
	]

	const openForm = async (form) => {
		setIsLoading(true)
		setSelectedForm(form);
		setShowForm(true);
	}

	const modalReady = () => {
		setIsLoading(false)
		setShowForm(false)
	}

	return (
		<>
		<div className="tab-declarations">
			<Table dataSource={ items } columns={ tableColumns } size="small" />
		</div>

		<FormModal client={client} currentUser={currentUser} typeForm={selectedForm.type} form={selectedForm} modalReady={modalReady} showForm={showForm} />

		{formIsVisible &&
			<Modal
			className="modal-pdf-viewer"
			title = "Formulario"
			centered = { true }
			width = {1000}
			header={ null }
			footer= { [<Button key="back" onClick={ onCancelFormModal }>Cerrar</Button>] }
			onCancel={ onCancelFormModal }
			visible="true"
			><ModalPdfViewer
			pdfId = {formId}
			/>
			</Modal>
		}
		</>
	)
}

export default TabDeclarations
