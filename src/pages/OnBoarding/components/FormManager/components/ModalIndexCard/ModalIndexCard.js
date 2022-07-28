import './ModalIndexCard.scss'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Row, Col, Input, Modal, Button, Icon, Select, message, List, Radio } from 'antd'
//import { ModalPdfViewer } from '../../../../../ConflictsOfInterest/components'
import { ModalClientCardPage } from '../../../FichaCliente/components'
import { useTranslation } from 'react-i18next'
import { getFormPromise, saveStatePromise, saveCommentsPromise } from '../../promises'
import { HistoryModal } from '../../../../../../layouts/Private/components'
import { ReportService } from '../../../../../../services'

const ModalIndexCard = ({item, handleCancel}) => {

  const [seeMore1, setSeemore1] = useState(false);
  const [seeMore2, setSeemore2] = useState(false);
  const [seeMore3, setSeemore3] = useState(false);
  const [seeMore4, setSeemore4] = useState(false);
  const [itemTable, setItemTable] = useState(item);
  const [formId, setFormId] = useState(null);
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [statusComments, setStatusComments] = useState(null);
  const [comments, setComments] = useState(null);
  const [title, setTitle] = useState(null);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [lastCommentDate, setLastCommentDate] = useState(null);
  const [ itemClientCard, setItemClientCard ] = useState(null);
  const [ resendOnBoardingForm, setResendOnBoardingForm ] = useState(false);

  useEffect(() => {
    getFormPromise(item.id).then((response) => {
      setItemTable(response.data);
        if(response.data.histComments.length > 0){
          setLastCommentDate(moment(response.data.histComments[0].creationDate).format('DD/MM/YYYY HH:mm'));
        }
    })
  }, []);


  const handleMore1 = () => {
    if (seeMore1 === false){
      setSeemore1(true)
    }else
      setSeemore1(false)
  }

  const handleMore2 = () => {
    if (seeMore2 === false){
      setSeemore2(true)
    }else
      setSeemore2(false)
  }

  const handleMore3 = () => {
    if (seeMore3 === false){
      setSeemore3(true)
    }else
      setSeemore3(false)
  }

  const handleMore4 = () => {
    if (seeMore4 === false){
      setSeemore4(true)
    }else
      setSeemore4(false)
  }

  const varStateOptions = (actualState) => {
    var options = [];
    if (actualState === 'EVALUACION'){
      options.push({val: "AUTORIZADA", label: "Autorizado"}, {val: "RECHAZADA", label: "Rechazado"});
    }else if (actualState === 'AUTORIZADA'){
      options.push({val: "EVALUACION", label: "Realizado"}, {val: "RECHAZADA", label: "Rechazado"});
    }else if(actualState === 'RECHAZADA'){
        options.push({val: "EVALUACION", label: "Realizado"}, {val: "AUTORIZADA", label: "Autorizado"});
    }

    return options;
  }

  const handlePdfViewer = (record) => {
    setFormId(record.id);
  }

  const onCancelPdfViewer = () => {
    setFormId(null);
  }

  const handleSaveStatus = () => {
      saveStatePromise(item.id, selectedStatus, statusComments, resendOnBoardingForm).then((response) => {
        if(response.success === true){
          message.success("Se ha guardado el estado del formulario correctamente");
          handleCancel();
        }else{
        message.error("Ha ocurrido un error al guardar el estado del formulario")
        }
      })
  }

  const handleOnChangeStatus = (value) => {
    setSelectedStatus(value);
  }

  const handleCommentsStateChange = (comment) => {
    setStatusComments(comment);
  }

  const handleTitle = (title) => {
    setTitle(title);
  }

  const handleComments = (comment) => {
    setComments(comment);
  }

  const handleSaveComment = () => {
    saveCommentsPromise(item.id, title, comments).then((response) => {
      if(response.success === true){
        message.success("Se ha guardado el comentario")
        setItemTable(response.data)
        setLastCommentDate(moment(response.data.histComments[0].creationDate).format('DD/MM/YYYY HH:mm'));
        setComments(null);
        setTitle(null);
      }else{
      message.error("Ha ocurrido un error al guardar el comentario")
      }
    })
  }

  const handleGetFile = async (originalName) => {
    const obj = {
      formId: item.id,
      fileName: originalName,
    }
    await ReportService.read('/cdi/getFileForm', obj, null, originalName)
  }

  const handleCloseModals = () => {
    setIsHistoryVisible(false);
  }

  const commentSchema = [
    {
      title: 'Fecha',
      dataIndex: 'creationDate',
      cols: 4
    },
    {
      title: 'Nombre',
      dataIndex: 'userName',
      cols: 8
    },
    {
      title: 'Titulo',
      dataIndex: 'title',
      cols: 12
    },
  ];

  const handleCancelClientCard = () => {
		setItemClientCard(null);
  }

  const handleOpenClientCard = () => {
    const record = {...itemTable.recipient.record, record: itemTable.recipient.record}
		setItemClientCard(record);
  }

    return (
      <div className="modIndexCard">
        <Row className="titleRow" onClick={handleMore1}>
          <Col span={6}>
            <h3>Información Básica</h3>
          </Col>
          <Col span={4} push={16}>
            <Button type="link" onClick={handleMore1}>Ver más<Icon type={seeMore1 ? "minus" : "plus"}/></Button>
          </Col>
        </Row>
        <hr/>
        <Row>
          <Col span={6} >
            Nombre o razón social
            <Input readOnly value={itemTable.json && itemTable.json.basicInformation && itemTable.json.basicInformation.basicInfo ? itemTable.json.basicInformation.basicInfo.name : item.name}/>
          </Col>
          <Col span={5} offset={1}>
            Tipo de Documento
            <Input readOnly value={itemTable.json && itemTable.json.basicInformation && itemTable.json.basicInformation.basicInfo ? itemTable.json.basicInformation.basicInfo.tipoDocumento:"-"}/>
          </Col>
          <Col span={5} offset={1}>
            Nro. de Documento
            <Input readOnly value={itemTable.json && itemTable.json.basicInformation && itemTable.json.basicInformation.basicInfo ? itemTable.json.basicInformation.basicInfo.nroDocumento : item.rut} />
          </Col>
          <Col span={5} offset={1}>
            Tipo de Persona
            <Input readOnly value={itemTable.recipient && itemTable.recipient.record.type === 'Person' ? "Persona Natural" : "Persona Jurídica"} />
          </Col>
        </Row>
        {seeMore1 &&
          <Row className="div-more-info">
            <Col span={7} >
              Empresa
              <Input readOnly value={itemTable.recipient.record.subcliente ? itemTable.recipient.record.subcliente.name : "Sin empresa asignada"}/>
            </Col>
            <Col span={7} offset={1}>
              Área
              <Input readOnly value={itemTable.recipient.record.area}/>
            </Col>
            <Col span={7} offset={1}>
              Grupo
              <Input readOnly value={itemTable.recipient.record.grupo ? itemTable.recipient.record.grupo : "Sin grupo asignado"}/>
            </Col>
          </Row>
        }
        {/* FIN INFORMACION BASICA */}
          <Row>
            <Col span={9}>
              <h3>Información del formulario de OnBoarding</h3>
            </Col>
            {item.statusDecl !== 'PENDIENTE' &&
            <>
              <Col span={15}>
                <div className="button-box-index">
                  <Button type="danger" style={{marginRight:20}} onClick={handleOpenClientCard}>Informar riesgo<Icon type="warning" /></Button>
                  <Button type="primary" onClick={() => handlePdfViewer(item)}>Ver Formulario<Icon type="file-pdf" /></Button>
                </div>
              </Col>
            </>
            }
              {formId &&
                <Modal
                className="modal-pdf-viewer"
                title="Formulario"
                centered
                width={1000}
                header={null}
                footer={[<Button key="back" onClick={onCancelPdfViewer}>Cerrar</Button>]}
                onCancel={onCancelPdfViewer}
                visible="true">
                {/*<ModalPdfViewer pdfId={formId} />*/}
                </Modal>
              }
          </Row>
          <hr/>
          <Row>
            <Col span={6} >
              Estado
              <Input readOnly value={t("messages.aml.formKycStatus."+item.statusDecl)}/>
            </Col>
            <Col span={5} offset={1}>
              Fecha de solicitud
              <Input readOnly value={moment(item.fecSolicitud).format('DD/MM/YYYY')}/>
            </Col>
            <Col span={5} offset={1}>
              Nro. de recordatorios
              <Input readOnly value={item.nroReminders && item.nroReminders > 0 ? item.nroReminders : "Sin Recordatorios"}/>
            </Col>
            <Col span={5} offset={1}>
              Fecha último recordatorio
              <Input readOnly value={item.lastReminder !== null ? moment(item.lastReminder).format('DD/MM/YYYY') : '-'} />
            </Col>
          </Row>
          {item.statusDecl !== 'PENDIENTE' &&
            <Row>
              <Col span={6} >
                Adjuntos
                <Input readOnly value={itemTable.files && itemTable.files.length > 0 ? itemTable.files.length : "Sin Archivos Adjuntos"}/>
              </Col>
              <Col span={5} offset={1}>
                Fecha de recepción
                <Input readOnly value={moment(item.receiveDate).format('DD/MM/YYYY')}/>
              </Col>
              {item.statusDecl === 'AUTORIZADA' &&
                <Col span={5} offset={1}>
                  Fecha de autorización
                  <Input readOnly value={item.name}/>
                </Col>
              }
              {item.statusDecl === 'RECHAZADA' &&
                <Col span={5} offset={1}>
                  Fecha de rechazo
                  <Input readOnly value={item.name}/>
                </Col>
              }
            </Row>
          }

          {/* FIN INFORMACION SOLICITUD REALIZADA */}
          <Row onClick={handleMore2}>
            <Col span={6}>
              <h3>Comentarios</h3>
            </Col>
            <Col span={4} push={16}>
              <Button type="link" onClick={handleMore2}>Ver más <Icon type={seeMore2 ? "minus" : "plus"}/></Button>
            </Col>
          </Row>
          <hr/>
          {seeMore2 &&
            <div className="div-more-info">
              <Row>
                <Col span={5} >
                  Título
                  <Input onChange={(e) => {handleTitle(e.target.value)}} value={title}/>
                </Col>
                <Col span={18} push={1}>
                  Comentario
                  <Input.TextArea onChange={(e) => {handleComments(e.target.value)}} value={comments}/>
                </Col>
              </Row>
              <Col span={6}>
                {lastCommentDate &&
                  <Button onClick={() => setIsHistoryVisible(true)} style={{padding:'unset'}}type="link">Ver comentarios anteriores</Button>
                }
              </Col>
              <Col span={6}>
                <div>
                  Último comentario: {lastCommentDate ? lastCommentDate : "Sin comentarios"}
                </div>
              </Col>
              <Col span={12}>
                <Button onClick={() => handleSaveComment()} style={{float:'right', padding:'unset'}}type="link">Guardar</Button>
              </Col>
              <Row>
              </Row>
            </div>
          }
          {isHistoryVisible &&
              <HistoryModal schema={commentSchema} data={itemTable.histComments} closeHandler={handleCloseModals}/>
          }
          {/* FIN COMENTARIOS */}
          {item.statusDecl !== 'PENDIENTE' &&
          <>
            <Row onClick={handleMore3}>
              <Col span={10}>
                <h3>Documentos en el formulario de OnBoarding</h3>
              </Col>
              <Col span={4} push={12}>
                <Button type="link" onClick={handleMore3}>Ver más <Icon type={seeMore3 ? "minus" : "plus"}/></Button>
              </Col>
            </Row>
            <hr/>
            {seeMore3 &&
              <Row className="div-more-info">
                <Col span={24} >
                <List
                  size="small"
                  itemLayout="horizontal"
                  dataSource={itemTable.files}
                  renderItem={item => (
                    <List.Item
                      actions={[<a onClick={() => handleGetFile(item.originalName)}>Descargar</a>]}
                    >
                        <List.Item.Meta
                          description={item.name}
                        />
                        <List.Item.Meta
                          description={item.originalName}
                        />
                    </List.Item>
                  )}
                />
                </Col>
              </Row>
            }
          </>
          }
          {/* FIN DOC ADJUNTOS */}
          {item.statusDecl !== 'PENDIENTE' &&
          <>
            <Row onClick={handleMore4}>
              <Col span={10}>
                <h3>Modifique el estado</h3>
              </Col>
              <Col span={4} push={12}>
                <Button type="link" onClick={handleMore4}>Ver más <Icon type={seeMore4 ? "minus" : "plus"}/></Button>
              </Col>
            </Row>
            <hr/>
            {seeMore4 &&
              <div className="status-box div-more-info">
                <Row>
                  <Col span={6} >
                    <h3>Cambio de estado</h3>
                  </Col>
                  <Col span={8} push={10}>
                    <Select
                      style={{width: '100%'}}
                      defaultValue={t("messages.aml.formKycStatus."+item.statusDecl)}
                      onChange={handleOnChangeStatus}
                      // disabled={item.statusDecl === "EVALUACION" ? false : true} (se activa disabled si se cambia el estado)
                      >
                        {varStateOptions(item.statusDecl).map(option =>
                            <Select.Option value={option.val}>{option.label}</Select.Option>
                          )
                        }
                    </Select>
                  </Col>
                </Row>
                  {selectedStatus &&
                  <Modal
                    title="Cambio de estado"
                    centered
                    width={700}
                    visible="true"
                    onCancel={() => setSelectedStatus(null)}
                    footer={[
                      <Button key="save" onClick={() => handleSaveStatus()}>Guardar</Button>
                    ]}
                    >
                      <Row>
                        <Col span={24}>
                          Ha solicitado cambiar el estado del formulario a {t("messages.aml.formKycStatus."+selectedStatus)}. <br/>
                          Agregue comentarios para dejar registro de este evento los cuales se
                          guardarán automáticamente en el historial de
                          comentarios asociado a este formulario.
                        </Col>
                      </Row>
                      <Row gutter={[0, 32]}>
                        <Col span={24}>
                          <Input.TextArea placeholder="Agregue comentarios. Máximo 1000 caractéres" onChange={(e) => handleCommentsStateChange(e.target.value)} />
                        </Col>
                      </Row>
                      {selectedStatus === 'RECHAZADA' &&
                      <>
                        <Row gutter={[0, 32]}>
                          <Col span={20}>
                            ¿Requiere enviar una nueva solicitud del formulario?
                          </Col>
                          <Col span={4}>
                            <Radio.Group defaultValue={false} buttonStyle="solid" onChange={(e) => setResendOnBoardingForm(e.target.value)}>
                              <Radio.Button value={true}>Si</Radio.Button>
                              <Radio.Button value={false}>No</Radio.Button>
                            </Radio.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
                            Los comentarios agregados se ingresarán como contenido en el correo de solicitud del formulario
                          </Col>
                        </Row>
                      </>
                      }
                  </Modal>
                  }
              </div>
            }
          </>
        }
        {itemClientCard &&
					<Modal
						wrapClassName="modal-fichaCliente-onb"
						style={{top:'10px'}}
						title={"Ficha de Cliente"}
						visible={true}
						onCancel={handleCancelClientCard}
						cancelText="Cerrar"
						footer={null}
						width={'95vw'}
					>
						<ModalClientCardPage item={itemClientCard} />
					</Modal>
				}
      </div>
    );
}
export default ModalIndexCard
