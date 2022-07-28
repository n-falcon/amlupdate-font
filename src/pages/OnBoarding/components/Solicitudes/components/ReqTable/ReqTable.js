import './ReqTable.scss'
import React,{useState, useEffect} from 'react'
import {Table, Row, Col, Icon, message, DatePicker, Spin, Button} from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import {getDeclarationsPromise} from '../../../../promises'
import {ReportService} from '../../../../../../services/'
import {ModalNewRequestPage} from '../../..'

const ReqTable = ({categoria, dateRange, currentUser}) => {

	const [modalRequestIsVisible, setModalRequestIsVisible] = useState(false);
	const [items, setItems] = useState([])
	const [showTable, setShowTable] = useState(false)
  const { t } = useTranslation()

	useEffect(() =>{

			const fromDate = (dateRange && dateRange.length > 1) ? dateRange[0].format('DD/MM/YYYY') : null
			const toDate = (dateRange && dateRange.length > 1) ? dateRange[1].format('DD/MM/YYYY') : null
			getDeclarationsPromise(categoria, fromDate, toDate).then(results => {
				if(results.success) {
					setItems(results.data)
					setShowTable(true)
				}else{
					message.error(results.message)
				}
			})

	},[])

	const handleDownloadReport = async (record) => {
		await ReportService.read('/cdi/excelDeclaration/' + record.id, null, null, record.clasif + "-" + moment(record.startDate).format('YYYYMMDD') + "-rep.xlsx")
	}

  const getTableColumns = () => {
		let columns = [
			{
				title: 'Fecha de solicitud',
				dataIndex: 'creationDate',
				width: '20%',
				render: (text => {
					return moment(text).format('DD/MM/YYYY')
				}),
				sorter: (a, b) => a.creationDate - b.creationDate,

			},
			{
				title: 'Nro. de Personas',
				dataIndex: 'nroRecipients',
	            width: '20%',
				sorter: (a, b) => a.nroRecipients - b.nroRecipients
			},
			{
				title: 'Fecha de envío',
				width: '20%',
				dataIndex: 'startDate',
				render: (text => {
					return moment(text).format('DD/MM/YYYY')
				}),
				sorter: (a, b) => a.startDate - b.startDate
			}
		]

		columns.push(
			{
				title: 'Indicadores',
				style: {textAlign: 'center'},
				width: '20%',
				render: ((text, record) => {
					const receivedRatio = parseInt(100 * record.received / record.nroRecipients)
					const openRatio = record.received > 0 ? parseInt(100 * record.open / record.sent) : 0
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
										<span className="label">Relizados ({ record.sentForm })</span>
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

		columns.push(
			{
				title: 'Descargas',
				dataIndex: 'downloads',
				render: ((item, record) => {
					return(
						<div className="download-report" onClick={ () => handleDownloadReport(record) }><Icon type="cloud-download" /> Descargar</div>
					)
				}
				)
			}
		)

		return columns
	}

	const openModalRequest = () => {
			setModalRequestIsVisible(true);
	}

	const closeModalRequest = () => {
			setModalRequestIsVisible(false);
	}

    return (
        <div className="reqTable-content">
					{!modalRequestIsVisible ?
						<>
							<Row>
								<Col span={3}>
									<div className="solicitudes-card">
										Solicitudes <br/>
										{items.length}
									</div>
								</Col>
								<Col span={3}>
									<div className="solicitudes-card">
										Formularios <br/>
										{items.map(item => item.nroRecipients).reduce((acc, item) => acc + item, 0)}
									</div>
								</Col>
								<Col span={18}>
									<div className="action-button-form">
										<Button icon="plus" onClick={openModalRequest} style={{marginTop: 8}}>
											Nueva Solicitud
										</Button>
									</div>
								</Col>
							</Row>
							<div className="table-req-onb">
								<Row>
									<Table size="small" columns={getTableColumns()} dataSource={items} loading={!showTable}/>
								</Row>
							</div>
						</>
						:
						<ModalNewRequestPage currentUser={currentUser} closeModalRequest={closeModalRequest} />
					}
        </div>
    )
}

export default ReqTable
