import React, { useState, useEffect } from 'react'
import './TabOnboarding.scss'
import {Row, Col, Icon, Table, Modal, message, Spin} from 'antd'
import { getONBFormsPromise } from '../TabDeclarations/promises'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import {ModalPdfViewer} from '../../../InterestConflicts/components'
import { FormModal } from '../../../../layouts/Private/components'
import { deleteDeclarationsPromise } from '../../promises'
import { ReportService } from '../../../../services/'

const TabOnboarding = ({currentUser, client}) => {

    const [isLoading, setIsLoading] = useState(false)
	const [items, setItems] = useState([])
	const [selectedForm, setSelectedForm] = useState({})
    const [filters, setFilters] = useState({}) 
	const [formId, setFormId] = useState (null)
	const [showForm, setShowForm] = useState(false)
    const { t } = useTranslation()
    const { confirm } = Modal;
    const [lastDoneDate, setLastDoneDate] = useState([])
    const [realizados, setRealizados] = useState([])
    const [pendientes, setPendientes] = useState([])
    const [lastPendingDate, setLastPendingDate] = useState([])

    useEffect(() => {
		handleRefresh();
    }, []);

    const handleRefresh = () => {
        setIsLoading(true)
        getONBFormsPromise(currentUser.id).then((data) => {
            const itemRealizados = data.data.filter((item) => item.statusDecl !== 'PENDIENTE')
            const itemPendientes = data.data.filter((item) => item.statusDecl === 'PENDIENTE')
            const lastDone = itemRealizados.length > 0 ? moment(itemRealizados[0].statusDate).format('DD/MM/YYYY') : null
            const lastFecPendiente = itemPendientes.length > 0 ? moment(itemPendientes[0].statusDate).format('DD/MM/YYYY') : null
            setLastDoneDate(lastDone)
            setRealizados(itemRealizados)
            setPendientes(itemPendientes)
            setLastPendingDate(lastFecPendiente)
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
            title: 'Folio',
            dataIndex: 'folio',
            width: '21%',
            sorter: (a, b) => { return false }
        },
        {
            title: 'Solicitud',
            width: '18%',
            dataIndex: 'sendDate',
            render: (text) => {
                return moment(text).format('DD/MM/YYYY')
            },
            sorter: (a, b) => a.sendDate - b.sendDate,
        },
        {
            title: 'Estado',
            width: '18%',
            dataIndex: 'statusDecl',
            render: (text) => {
                return t("messages.aml.formKycStatus."+text)
            },
            sorter: (a, b) => a.statusDecl > b.statusDecl,
        },
        {
            title: 'Fecha de Estado',
            width: '18%',
            dataIndex: 'statusDate',
            render: (statusDate) => moment(statusDate).format('DD/MM/YYYY'),
            sorter: (a, b) => a.statusDate - b.statusDate,
        },
        {
            title: 'Recordatorio',
            width: '18%',
            dataIndex: 'lastReminder',
            render: (lastReminder) => lastReminder ? moment(lastReminder).format('DD/MM/YYYY'): "Sin recordatorio",
            sorter: (a, b) => a.lastReminder - b.lastReminder,
        },
        {
            width: '8%',
            render: ((record) => {
                return(
                    <Row>
                        <Col span={24}>
                            <div className="icon-wrapper-onb-tab">
                                <Row gutter={[0, 0]}>
                                { record.statusDecl !== 'PENDIENTE' ?
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
		ReportService.read('/portal/excelONBDeclarationsByRecordId/' + currentUser.id, null, null, "formularios.xlsx")
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
                                        <p>Bienvenido {currentUser.nombre} al módulo de OnBoarding.</p>
                                        { items.length === 0 ?
                                            <p>Aún no tiene ninguna solicitud de formulario Onboarding</p>
                                        :
                                            pendientes.length === 0 ?
                                            <p>El último formulario realizado fue en fecha {lastDoneDate}</p>
                                        :
                                            <p>Informamos que {client.name} con fecha {lastPendingDate} le solicitó completar el <a style={{cursor: 'pointer'}} onClick={ () => openForm(pendientes[0]) }>formulario de Onboarding</a>.</p>
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
                    <FormModal client={client} currentUser={currentUser} typeForm={selectedForm.type} form={selectedForm} modalReady={modalReady} showForm={showForm} />
                }
        </div>
    );
}
 
export default TabOnboarding;