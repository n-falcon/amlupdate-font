import React, { useState, useEffect } from 'react'
import './TabCdiForms.scss'
import {Row, Col, Icon, Table, Modal, message, Spin, Select, Button} from 'antd'
import { getFormsPromise } from '../TabDeclarations/promises'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import {ModalPdfViewer} from '../../../InterestConflicts/components'
import { FormModal } from '../../../../layouts/Private/components'
import { deleteDeclarationsPromise } from '../../promises'
import { ReportService } from '../../../../services/'

const TabCdiForms = ({currentUser, client}) => {

    const [isLoading, setIsLoading] = useState(false)
	const [items, setItems] = useState([])
	const [selectedForm, setSelectedForm] = useState({})
    const [filters, setFilters] = useState({}) 
	const [formId, setFormId] = useState (null)
	const [showForm, setShowForm] = useState(false)
    const { t } = useTranslation()
    const { confirm } = Modal;
    const [lastDoneDate, setLastDoneDate] = useState(null)
    const [completados, setCompletados] = useState([])
    const [pendientes, setPendientes] = useState([])
    const [enviados, setEnviados] = useState([])
    const [lastPendingDate, setLastPendingDate] = useState(null)
    const [lastEnviadoDate, setLastEnviadoDate] = useState(null)
    const [optionsByCat, setOptionsByCat] = useState([])
    const Option = Select
    const [selectedTypeForm, setSelectedTypeForm] = useState(null)

    useEffect(() => {
		handleRefresh();
        declOptions();
    }, []);

    const declOptions = () => {
    var declOptions = []
        if (currentUser.category === 'COLABORADOR' || currentUser.category === 'PROVEEDOR') {
            if(client.modules.includes('CDI-FORM-CDI')){
                declOptions.push(
                    {
                        id: 'CDI',
                        name: 'Declaración de Conflictos de Interes',
                    },
                )
            }
            if(currentUser.category === 'COLABORADOR' && client.modules.includes('CDI-FORM-REL')){
                declOptions.push(
                {
                    id: 'REL',
                    name: 'Relacionados',
                }
            )}
        } 
        if (currentUser.category === 'CLIENTE'){
            if(client.modules.includes('CDI-FORM-PATR')){
                declOptions.push(
                    {
                        id: 'PATR',
                        name: 'Relaciones Patrimoniales',
                    }
                )
            }
        } 
        if (currentUser.category === 'DIRECTOR'){
            if(client.modules.includes('CDI-FORM-DIR')){
                declOptions.push(
                    {
                        id: 'DIR',
                        name: 'Declaración de Conflicto de Interés de Directores'
                    }
                )
            }
        } 
        if (currentUser.category === 'COLABORADOR'){
            if(client.modules.includes('CDI-FORM-T')){
                declOptions.push(
                    {
                        id: 'TRAVEL',
                        name: 'Formulario de Viajes (Nacionales o Internacionales)'
                    }
                )
            }
            if(client.modules.includes('CDI-FORM-G')){
                declOptions.push(
                    {
                        id: 'GIFT',
                        name: 'Formulario de Regalos, Invitaciones y Beneficios No Monetarios'
                    }
                )
            }
            if(client.modules.includes('CDI-FORM-F')){
                declOptions.push(
                    {
                        id: 'FP',
                        name: 'Formulario de Reunión con Autoridades y Funcionarios Públicos'
                    }
                )
            }
            if(client.modules.includes('CDI-FORM-S')){
                declOptions.push(
                    {
                        id: 'SOC',
                        name: 'Formulario de Participación en Asociaciones Empresariales'
                    }
                )
            }
        }
        setOptionsByCat(declOptions)
    }

    const handleRefresh = () => {
        setIsLoading(true)
        getFormsPromise(currentUser.id).then((data) => {
            const itemCompletados = data.data.filter((item) => item.status === 'SENT')
            const itemEnviados = data.data.filter((item) => item.status !== 'SENT' && item.clasif === 'S')
            const itemPendientes = data.data.filter((item) => item.status !== 'SENT' && item.clasif !== 'S')
            const lastDone = itemCompletados.length > 0 ? moment(itemCompletados[0].recievedDate).format('DD/MM/YYYY') : null
            const lastFecPendiente = itemPendientes.length > 0 ? moment(itemPendientes[0].sendDate).format('DD/MM/YYYY') : null
            const lastFecEnviado = itemEnviados.length > 0 ? moment(itemEnviados[0].sendDate).format('DD/MM/YYYY') : null
            setLastDoneDate(lastDone)
            setCompletados(itemCompletados)
            setEnviados(itemEnviados)
            setPendientes(itemPendientes)
            setLastPendingDate(lastFecPendiente)
            setLastEnviadoDate(lastFecEnviado)
			setItems(data.data)
			setIsLoading(false)
		})
    }

    const handlePdfViewer = (record) => {
		setFormId(record.id);
	}

    const onCancelPdfViewer = () => {
        setFormId(null);
    }

    const modalReady = () => {
		setIsLoading(false)
		setShowForm(false)
        handleRefresh();
        setSelectedForm({});
	}

    const showConfirm = (record) => {
        confirm({
            title: 'Eliminar Declaración',
            content: '¿Está seguro que desea borrar la declaración?',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                setIsLoading(true)
                deleteDeclarationsPromise(currentUser.id,[record.id]).then((data) => {
                    if(data.success) {
                        message.success(t('messages.aml.declarations.delete.success'))
                        handleRefresh()
                    }else message.error(t('messages.aml.declarations.delete.error'))
                })
            },
            onCancel() {
            },
        });
    }
      const tableColumns = [
        {
            title: 'Tipo',
            dataIndex: 'type',
            width: '21%',
            sorter: (a, b) => { return a.type < b.type },
            render: (tipo) => {
                return t('messages.aml.type.' + tipo)
            }
        },
        {
            title: 'Folio',
            dataIndex: 'folio',
            width: '16%',
            sorter: (a, b) => { return a.folio < b.folio }
        },
        {
            title: 'Solicitud',
            width: '13%',
            dataIndex: 'sendDate',
            render: (text) => {
                return moment(text).format('DD/MM/YYYY')
            },
            sorter: (a, b) => a.sendDate - b.sendDate,
        },
        {
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
                    </>
                )
            },
		},
        {
            title: 'Fecha de Estado',
            width: '13%',
            dataIndex: 'status',
            render: (status, record) => {
                if (status === "SENT") {
                    return moment(record.receiveDate).format('DD/MM/YYYY')
                }else{
                    return moment(record.sendDate).format('DD/MM/YYYY')
                }
            },
            sorter: (a, b) => { return (a.status === 'SENT' ? a.receiveDate : a.sendDate) - (b.status === 'SENT' ? b.receiveDate : b.sendDate) },
        },
        {
            title: 'Recordatorio',
            width: '15%',
            dataIndex: 'lastReminder',
            render: (lastReminder) => lastReminder ? moment(lastReminder).format('DD/MM/YYYY'): "Sin recordatorio"
        },
        {
            width: '8%',
            render: ((record) => {
                return(
                    <Row>
                        <Col span={24}>
                            <div className="icon-wrapper-onb-tab">
                                <Row gutter={[0, 0]}>
                                { record.status === 'SENT' ?
                                <Col span={24}>
                                    <Icon type="file-pdf" className="file-pdf"
                                          onClick={ () =>
                                          handlePdfViewer(record) }
                                          style={{fontSize: '20px'}}
                                    />
                                </Col>
                                :
                                    <>
                                        <Col span={12}>
                                            <Icon 
                                                type="file-add" 
                                                theme="filled"
                                                style={{fontSize: '20px'}}
                                                onClick={ () => openForm(record) }
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <Icon 
                                                type="delete"
                                                theme="filled"
                                                style={{fontSize: '20px'}}
                                                onClick={ () => showConfirm(record) }
                                            />
                                        </Col>
                                    </>
                                }
                                </Row>
                            </div>
                        </Col>
                    </Row>
                )
            }
            )
        }
	]

    const openForm = async (form) => {
		setIsLoading(true)
		setSelectedForm(form);
		setShowForm(true);
	}

    const exportForms = () => {
		ReportService.read('/portal/excelCDIDeclarationsByRecordId/' + currentUser.id, null, null, "declaraciones.xlsx")
	}

    const getTypeDeclaration = (type) => {
        if(type === 'CDI') return 'Conflicto de Interés'
        else if(type === 'FP') return 'Reunión con Autoridades y Funcionarios Públicos'
        else if(type === 'TRAVEL') return 'Viajes'
        else if(type === 'GIFT') return 'Regalos'
        else if(type === 'SOC') return 'Participación en Asociaciones Empresariales'
        else if(type === 'DIR') return 'Declaracion de Directores'
        else if(type === 'PATR') return 'Relaciones Patrimoniales'
        else if(type === 'REL') return 'Relacionados'
        else if(type === 'KYC') return 'Onboarding'
    }

    return ( 
        <div className="tab-onboarding-stakeholder">
            <Row gutter={[8, 16]} type="flex">
                <Col span={14}>
                    <div className="section">
                        { isLoading ? <div className="spin-wrapper"><Spin size='large'/></div> :
                            <>
                                <h3>Notificaciones</h3>
                                <div>
                                    <p>Bienvenido {currentUser.nombre} al Portal de Usuario.</p>
                                    { items.length === 0 ?
                                        <p>Aún no tiene ninguna solicitud de declaración</p>
                                    : pendientes.length > 0 ?
                                        <p>Informamos que {client.name} con fecha {lastPendingDate} le solicitó completar la <a style={{cursor: 'pointer'}} onClick={ () => openForm(pendientes[0]) }>Declaración de {getTypeDeclaration(pendientes[0].type)}</a>.</p>
                                    : enviados.length > 0 ?
                                        <p>Posee una <a style={{cursor: 'pointer'}} onClick={ () => openForm(enviados[0]) }>declaración pendiente</a> generada en fecha {lastEnviadoDate}</p>
                                    :
                                        <p>La última declaración presentada fue realizada con fecha {lastDoneDate}</p>
                                    }
                                </div>
                            </>
                        }
                    </div>
                </Col>
                <Col span={10}>
                    <div className="section">
                    { isLoading ? <div className="spin-wrapper"><Spin size='large'/></div> :
                        <>
                            <h3>Soporte</h3>
                            <div>
                                <p>Si tiene alguna pregunta del contenido o proceso sugerimos comunicarse con {client.name}</p>
                                <p>Si tiene una pregunta técnica puede enviarla a: soporte.aml@gesintel.cl</p>
                            </div> 
                        </>
                    }
                    </div>
                </Col>
            </Row>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <div className="section">
                        <Row>
                            <Col span={24}>
                                <h3>Presentar una nueva declaración</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Row gutter={[10, 24]} type="flex" justify="space-around" align="middle">
                                    <Col span={1}>
                                        <Icon type="snippets" style={{fontSize: '20px'}} onClick={ () => openForm(null) }/>
                                    </Col>
                                    <Col span={6}>
                                        Seleccione el tipo de declaración
                                    </Col>
                                    <Col span={11}>
                                        <Select style={{width: '100%'}} onChange={(e) => setSelectedTypeForm(e)}>
                                            { optionsByCat.map(item => {
                                                return(
                                                    <Option key={item.id} value={item.id}>{item.name}</Option>
                                                ) 
                                                })
                                            }
                                        </Select>
                                    </Col>
                                    <Col span={5} offset={1}>
                                        <Button type="primary" 
                                                onClick={ () =>
                                                { if (selectedTypeForm){ 
                                                        openForm()
                                                    }else{
                                                        message.error("Debe seleccionar un tipo de declaración")
                                                    }
                                                }}
                                        >Generar
                                        </Button>
                                    </Col>
                                </Row>
                                <Row gutter={[10, 24]}>
                                    <Col span={24}>
                                        Recuerde que una vez realizada la declaración le llegará un comprobante en PDF al correo registrado
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <div className="section">
                        <Row>
                            <Col span={18}>
                                <h3>Historial</h3>
                            </Col>
                            <Col span={6} style={{textAlign:'right'}}>
                                <Icon 
                                    type="reload"
                                    onClick={handleRefresh}
                                    style={{fontSize: '20px', marginRight:'10px'}}
                                />
                                <Icon
                                    type="file-excel"
                                    style={{fontSize: '20px'}}
                                    onClick={exportForms}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Table dataSource={ items } columns={ tableColumns } size="small" loading={ isLoading }/>
                            </Col>
                        </Row>
                    </div>
                </Col>
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
                    visible={true}
                    ><ModalPdfViewer
                        pdfId={formId}
                    />
                </Modal>
            }
            { showForm &&
                <FormModal client={client} currentUser={currentUser} typeForm={selectedForm ? selectedForm.type : selectedTypeForm} form={selectedForm} modalReady={modalReady} showForm={showForm}/>
            }
        </div>
    );
}
 
export default TabCdiForms;