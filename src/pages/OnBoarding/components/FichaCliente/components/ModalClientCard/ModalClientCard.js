import './ModalClientCard.scss'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import {Row, Col, Input, Button, Icon, Select, Table, Radio, message, Modal, Progress, Divider, Spin } from 'antd'
import { updateRiskPromise } from '../../promises';
//import {ModalPdfViewer} from '../../../../../ConflictsOfInterest/components'
import { FalsesPositivesBlock } from '../../../../../AlertManager/components'
import { getFichaPromise, saveCommentsPromise, getUbosCtrlPromise, savePeriodicityPromise } from '../../promises'
import { HistoryModal } from '../../../../../../layouts/Private/components'
import apiConfig from '../../../../../../config/api'
import {Contact,
        InfoBasic,
        InfoTrib,
        MonedaExt,
        OrigenFondos,
        Ubicacion,
        CasaMatriz,
        ActividadEco,
        RepLegal,
        InfoFinanciera,
        InfoPep,
        BenFinales,
        OficialCumplimiento,
        ParticipacionSoc
        } from './components'

const ModalClientCard = ({item, currentUser, handleCancel}) => {
  const { confirm } = Modal;
  const { t } = useTranslation()
  const [itemTable, setItemTable] = useState(null);
  const [seeMore1, setSeemore1] = useState(false);
  const [seeMore2, setSeemore2] = useState(false);
  const [seeMore3, setSeemore3] = useState(true);
  const [seeMore4, setSeemore4] = useState(false);
  const [formId, setFormId] = useState(null);
  const [riskComment, setRiskComment] = useState(null);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [falsosPositivos, setFalsosPositivos] = useState(null);
  const [comments, setComments] = useState(null);
  const [title, setTitle] = useState(null);
  const [lastCommentDate, setLastCommentDate] = useState(null);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [ubos, setUbos] = useState(null);
  const [lastRiskDate, setLastRiskDate] = useState(null);
  const [isRiskVisible, setIsRiskVisible] = useState(false);
  const [isPeriodicityVisible, setIsPeriodicityVisible] = useState(false);
  const [periodicity, setPeriodicity] = useState(item.periodicity);

  const [showPrevBasicInfo, setShowPrevBasicInfo] = useState(false);
  const [showPrevCasaMatriz, setShowPrevCasaMatriz] = useState(false);
  const [showPrevUbicacion, setShowPrevUbicacion] = useState(false);
  const [showPrevContacto, setShowPrevContacto] = useState(false);
  const [showPrevActividadEco, setShowPrevActividadEco] = useState(false);
  const [showPrevRepLegal, setShowPrevRepLegal] = useState(false);
  const [showPrevInfoTrib, setShowPrevInfoTrib] = useState(false);
  const [showPrevInfoFinanciera, setShowPrevInfoFinanciera] = useState(false);
  const [showPrevMonedaExt, setShowPrevMonedaExt] = useState(false);
  const [showPrevOrigenFondos, setShowPrevOrigenFondos] = useState(false);
  const [showPrevInfoPep, setShowPrevInfoPep] = useState(false);
  const [showPrevBenFinales, setShowPrevBenFinales] = useState(false);
  const [showPrevOficialCumplimiento, setShowPrevOficialCumplimiento] = useState(false);
  const [showPrevParticipacionSoc, setShowPrevParticipacionSoc] = useState(false);

  useEffect(() => {
    loadFicha()

    getUbosCtrlPromise(item.record.rut, "CHIL").then(ubos => {
      if(ubos.success) {
        setUbos(ubos.data)
      }else{
        message.error("Ha ocurrido un error al obtener propietarios/sociedades")
      }
    });
  }, [])

  const loadFicha = () => {
    getFichaPromise(item.id).then(ficha => {
      setSelectedRisk(ficha.record.risk)
      setRiskComment(ficha.record.commentRisk)

      if(ficha.json === null) ficha.json = {}
      setItemTable(ficha)
      if(ficha.histComments.length > 0){
        setLastCommentDate(moment(ficha.histComments[0].creationDate).format('DD/MM/YYYY HH:mm'));
      }
      if(ficha.histRisks.length > 0){
        setLastRiskDate(moment(ficha.histRisks[0].creationDate).format('DD/MM/YYYY HH:mm'));
      }
      if(ficha.alert && (ficha.alert.estadoFP === 'PENDIENTE' || ficha.alert.estadoFP === 'TRATADO')) {
        setFalsosPositivos(ficha.alert)
      }else if(ficha.record && (ficha.record.estadoFP === 'PENDIENTE' || ficha.record.estadoFP === 'TRATADO')) {
        let rec = {record: ficha.record, estadoFP: ficha.record.estadoFP}
        setFalsosPositivos(rec)
      }
    })
  }
  const textFormHeader = () => {
    return  <Row gutter={[0, 36]}>
                <Col span={24}>
                    Se informa un cambio de circunstancia
                    ya que en fecha {moment(itemTable.declAnt.receiveDate).format("DD/MM/YYYY")},
                    la persona presentó la siguiente información. Los cambios se señalan en un marco rojo.
                </Col>
            </Row>
    }
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

  const handlePdfViewer = (id) => {
    setFormId(id);
  }


  const onCancelPdfViewer = () => {
		setFormId(null);
  }

  const onCancelPeriodicity = () => {
    setIsPeriodicityVisible(false)
  }

  const savePeriodicity = () => {
    confirm({
      title: 'Modificar Periodicidad?',
      content: '¿Está seguro que desea modificar la Periodicidad?',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        savePeriodicityPromise(item.id, periodicity).then(r => {
          setIsPeriodicityVisible(false)
          loadFicha()
        })
      },
    });
  }

  const handleComments = (comment) => {
    setComments(comment);
  }

  const handleTitle = (title) => {
    setTitle(title);
  }

  const handleSaveComment = () => {
    saveCommentsPromise(itemTable.id, title, comments).then((response) => {
      if(response.success === true){
        message.success("Se ha guardado el comentario")
        let ficha = response.data
        if(ficha.json === null) ficha.json = {}
        setItemTable(ficha)
        setLastCommentDate(moment(response.data.histComments[0].creationDate).format('DD/MM/YYYY HH:mm'));
        setComments(null);
        setTitle(null);
      }else{
      message.error("Ha ocurrido un error al guardar el comentario")
      }
    })
  }

  const handleSaveRisk = (e) => {
    updateRiskPromise(itemTable.id, selectedRisk, riskComment).then(res => {
      if(res.success){
        message.success("Riesgo actualizado correctamente");
        loadFicha()
      }else{
        message.error("Error al actualizar el riesgo");
      }

    })
  }

  const downloadReportRisk = (pdfFile) => {
    window.open(apiConfig.url + '/../getPDFUboFinder?path=' + pdfFile)
  }

  const handleCloseModals = () => {
    setIsHistoryVisible(false);
  }

  const handleCloseRiskModal = () =>{
    setIsRiskVisible(false);
  }


  const propColumns = [
    {
      dataIndex: item.record.type === 'Person' || (ubos && ubos.ubos && ubos.ubos.length === 0) ? 'participacionDirecta' : 'participacion',
      width: '20%',
      render: (porcent) => {
        return <div className="porcent-onb-modal">{porcent}%</div>
      }
    },
    {
      dataIndex: 'name',
      width: '15%',
      render: () => {
        return <div className="prop-onb-modal">p</div>
      }
    },
    {
      dataIndex: 'name',
      ellipsis: true,
    },
  ]

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

  const riskSchema = [
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
      title: 'Riesgo',
      dataIndex: 'risk',
      cols: 12
    },
  ];

  const titleStyle={
    backgroundColor: '#FAFFBD',
    padding: '10px',
  }

  const localeObj = {
    emptyText: 'No hay datos',
  }

  const formsColumns = [
      {
        title: "Folio",
        dataIndex: 'folio'
      },
      {
        title: "Solicitud",
        dataIndex: 'creationDate',
        sorter: (a, b) => a.creationDate - b.creationDate,
        render: (date) => {
          return moment(date).format('DD/MM/YYYY')
        }
      },
      {
        title: "Estado",
        dataIndex: 'statusDecl',
        sorter: (a, b) => a.statusDecl < b.statusDecl,
        render: (status) => {
          return t("messages.aml.formKycStatus." + status)
        }
      },
      {
        title: "Fecha estado",
        dataIndex: 'statusDate',
        sorter: (a, b) => a.statusDate - b.statusDate,
        render: (date) => {
          return moment(date).format('DD/MM/YYYY')
        }
      },
      {
        title: "Recordatorio",
        dataIndex: 'lastReminder',
        render: (date, record) => {
          return date ? record.nroReminders+" - "+ moment(date).format('DD/MM/YYYY') : "Sin Recordatorio"
        }
      },
      {
        title: "Ver",
        dataIndex: 'id',
        render: (id, record) => {
          return record.statusDecl !== 'PENDIENTE' && <Icon type="file-pdf" onClick={ () => handlePdfViewer(id) } style={{fontSize: '20px'}}/>
        }
      }
  ]

  const actEspColumns = [
    {
      title: "Actividad económica de Riesgo",
      dataIndex: 'activity'
    },
    {
      title: "País",
      dataIndex: 'actPais'
    }
  ]

  const handleRefreshItem = () => {

  }

  const onCancelModalSection = (section) => {
    if (section === 'casaMatriz'){
    setShowPrevBasicInfo(false)
    }else if (section === 'contacto'){
      setShowPrevContacto(false)
    }else if (section === 'ubicacion'){
      setShowPrevUbicacion(false)
    }else if (section === 'basicInfo'){
      setShowPrevBasicInfo(false)
    }else if (section === 'actividadEco'){
      setShowPrevActividadEco(false)
    }else if (section === 'repLegal'){
      setShowPrevRepLegal(false)
    }else if (section === 'infoFinanciera'){
      setShowPrevInfoFinanciera(false)
    }else if (section === 'infoTributaria'){
      setShowPrevInfoTrib(false)
    }else if (section === 'monedaExt'){
      setShowPrevMonedaExt(false)
    }else if (section === 'origenFondos'){
      setShowPrevOrigenFondos(false)
    }else if (section === 'infoPep'){
      setShowPrevInfoPep(false)
    }else if (section === 'benFinales'){
      setShowPrevBenFinales(false)
    }else if (section === 'ofCumplimiento'){
      setShowPrevOficialCumplimiento(false)
    }else if (section === 'sociedades'){
      setShowPrevParticipacionSoc(false)
    }
  }

    return (
      <div className="modClientCard">
        { itemTable === null ? <Spin/>
          :
          <>
            <Row className="titleRow">
              <Col span={12}>
                <h3>Formulario</h3>
              </Col>
              <Col span={12} style={{textAlign:'right'}}>
                {itemTable.periodicity &&
                  <Button type="primary" className="primario" icon="clock-circle" onClick={() => setIsPeriodicityVisible(true)}>
                    {t('messages.aml.periodicity')}: {t('messages.aml.onboarding.period.'+itemTable.periodicity)}
                  </Button>
                }
                <div style={{width:120, float:'right'}}>
                <Button type="link" onClick={handleMore1}>
                  {seeMore1 ?
                    <>Ver menos <Icon type="minus"/></>
                    :
                    <>Ver más <Icon type="plus"/></>
                  }
                </Button>
                </div>
              </Col>
            </Row>
            <hr/>

            {/* INFORMACION BASICA */}
            <Row className="field-section-row">
              <Col span={24}>
                <div className="title-section">
                  <Row>
                    <Col span={22}>
                      <h4>Información Básica</h4>
                    </Col>
                    <Col span={1} offset={1} >
                      {itemTable.json && itemTable.json.basicInformation && itemTable.json.basicInformation.basicInfo && itemTable.json.basicInformation.basicInfo.hasChanges &&
                        <a onClick={() => setShowPrevBasicInfo(true)}>
                          <Icon type="block" style={{fontSize: "20px", float:'right'}} />
                        </a>
                      }
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
            { !showPrevBasicInfo ?
              <InfoBasic
                basicInfo={itemTable.json && itemTable.json.basicInformation && itemTable.json.basicInformation.basicInfo ? itemTable.json.basicInformation.basicInfo : {}}
                record={itemTable.record} />
              :
              <Modal
                title="Información Básica"
                wrapClassName="modal-client-previous-data"
                visible={true}
                header={null}
                width={'95vw'}
                footer={[<Button onClick={() => onCancelModalSection("basicInfo")}>Cerrar</Button>]}
                onCancel={() => onCancelModalSection("basicInfo")}
              >
                {textFormHeader()}
                <InfoBasic
                  basicInfo={itemTable.declAnt && itemTable.declAnt.json && itemTable.declAnt.json.basicInformation && itemTable.declAnt.json.basicInformation.basicInfo}
                  record={itemTable.record}
                  actual={itemTable.json && itemTable.json.basicInformation && itemTable.json.basicInformation.basicInfo ? itemTable.json.basicInformation.basicInfo : {}}
                />
              </Modal>
            }

          {/* INICIO DESPLEGABLE INFORMACIÓN BÁSICA (VER MÁS) */}
            {seeMore1 &&
            <div className="div-more-info">
              {itemTable.record.type==='Entity' &&
                <>
                  <Row className="field-section-row">
                    <Col span={24}>
                      <div className="title-section">
                        <Row>
                          <Col span={22}>
                            <h4>Casa Matriz</h4>
                          </Col>
                          <Col span={1} offset={1} >
                            {itemTable.json.basicInformation && itemTable.json.basicInformation.casaMatriz && itemTable.json.basicInformation.casaMatriz.hasChanges &&
                            <a onClick={() => setShowPrevCasaMatriz(true)}>
                              <Icon type="block" style={{fontSize: "20px", float:'right'}} />
                            </a>
                            }
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                  { !showPrevCasaMatriz ?
                    <CasaMatriz
                      casaMatriz={itemTable.json && itemTable.json.basicInformation && itemTable.json.basicInformation.casaMatriz ? itemTable.json.basicInformation.casaMatriz : {}}
                      record={itemTable.record} />
                    :
                    <Modal
                      title="Casa Matriz"
                      wrapClassName="modal-client-previous-data"
                      visible={true}
                      header={null}
                      width={'95vw'}
                      footer={[<Button onClick={() => onCancelModalSection('casaMatriz')}>Cerrar</Button>]}
                      onCancel={() => onCancelModalSection('casaMatriz')}
                    >
                      {textFormHeader()}
                      <CasaMatriz
                        casaMatriz={itemTable.declAnt && itemTable.declAnt.json && itemTable.declAnt.json.basicInformation && itemTable.declAnt.json.basicInformation.casaMatriz ? itemTable.declAnt.json.basicInformation.casaMatriz : {}}
                        record={itemTable.record}
                        actual={itemTable.json && itemTable.json.basicInformation && itemTable.json.basicInformation.casaMatriz ? itemTable.json.basicInformation.casaMatriz : {}}
                      />
                    </Modal>
                  }
                </>
              }
              <Row className="field-section-row">
                <Col span={24}>
                  <div className="title-section">
                    <Row>
                      <Col span={23}><h4>Ubicación</h4></Col>
                      <Col span={1}>
                        {itemTable.json.basicInformation && itemTable.json.basicInformation.ubicacion && itemTable.json.basicInformation.ubicacion.hasChanges &&
                          <a onClick={() => setShowPrevUbicacion(true)}>
                            <Icon type="block" style={{fontSize: "20px", float:'right'}} />
                          </a>
                        }
                      </Col>
                    </Row>
                  </div>
                  { !showPrevUbicacion ?
                    <Ubicacion
                      ubicacion={itemTable.json && itemTable.json.basicInformation && itemTable.json.basicInformation.ubicacion ? itemTable.json.basicInformation.ubicacion : {}}
                      record={itemTable.record} />
                    :
                    <Modal
                      title="Ubicación"
                      wrapClassName="modal-client-previous-data"
                      visible={true}
                      header={null}
                      width={'95vw'}
                      footer={[<Button onClick={() => onCancelModalSection('ubicacion')}>Cerrar</Button>]}
                      onCancel={() => onCancelModalSection('ubicacion')}
                    >
                      {textFormHeader()}
                      <Ubicacion
                        ubicacion={itemTable.declAnt && itemTable.declAnt.json && itemTable.declAnt.json.basicInformation && itemTable.declAnt.json.basicInformation.ubicacion ? itemTable.declAnt.json.basicInformation.ubicacion : {}}
                        record={itemTable.record}
                        actual={itemTable.json && itemTable.json.basicInformation && itemTable.json.basicInformation.ubicacion ? itemTable.json.basicInformation.ubicacion : {}}
                      />
                    </Modal>
                  }
                </Col>
                <Col span={24} className="col-contacto-onb">
                  <div className="title-section">
                    <Row>
                      <Col span={23}><h4>{itemTable.record.type==='Entity' ?"Persona de Contacto":"Contacto"}</h4></Col>
                      <Col span={1}>
                      {itemTable.json.basicInformation && itemTable.json.basicInformation.contacto && itemTable.json.basicInformation.contacto.hasChanges &&
                        <a onClick={() => setShowPrevContacto(true)}>
                          <Icon type="block" style={{fontSize: "20px", float:'right'}} />
                        </a>
                      }
                      </Col>
                    </Row>
                  </div>
                  { !showPrevContacto ?
                    <Contact
                      contacto={itemTable.json && itemTable.json.basicInformation && itemTable.json.basicInformation.contacto ? itemTable.json.basicInformation.contacto : {}}
                      record={itemTable.record}
                    />
                    :
                    <Modal
                      title={itemTable.record.type==='Entity' ?"Persona de Contacto":"Contacto"}
                      wrapClassName="modal-client-previous-data"
                      visible={true}
                      header={null}
                      width={'95vw'}
                      footer={[<Button onClick={() => onCancelModalSection('contacto')}>Cerrar</Button>]}
                      onCancel={() => onCancelModalSection('contacto')}
                    >
                      {textFormHeader()}
                      <Contact
                        contacto={itemTable.declAnt && itemTable.declAnt.json && itemTable.declAnt.json.basicInformation && itemTable.declAnt.json.basicInformation.contacto ? itemTable.declAnt.json.basicInformation.contacto : {}}
                        record={itemTable.record}
                        actual={itemTable.json && itemTable.json.basicInformation && itemTable.json.basicInformation.contacto ? itemTable.json.basicInformation.contacto : {}}
                      />
                    </Modal>
                  }
                </Col>
              </Row>
              <Row className="field-section-row">
                    <Col span={24}>
                      <div className="title-section">
                        <Row>
                          <Col span={22}><h4>Actividad Económica</h4></Col>
                          <Col span={1} offset={1} >
                            {itemTable.json.infoEco && itemTable.json.infoEco.actividadEconomica && itemTable.json.infoEco.actividadEconomica.hasChanges &&
                              <a onClick={() => setShowPrevActividadEco(true)}>
                                <Icon type="block" style={{fontSize: "20px", float:'right'}} />
                              </a>
                            }
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                  { !showPrevActividadEco ?
                    <ActividadEco
                      actividadEco={itemTable.json && itemTable.json.infoEco && itemTable.json.infoEco.actividadEconomica ? itemTable.json.infoEco.actividadEconomica : {}}
                    />
                    :
                    <Modal
                      title="Actividad Económica"
                      wrapClassName="modal-client-previous-data"
                      visible={true}
                      header={null}
                      width={'95vw'}
                      footer={[<Button onClick={() => onCancelModalSection('actividadEco')}>Cerrar</Button>]}
                      onCancel={() => onCancelModalSection('actividadEco')}
                    >
                      {textFormHeader()}
                      <ActividadEco
                        actividadEco={itemTable.declAnt && itemTable.declAnt.json && itemTable.declAnt.json.infoEco && itemTable.declAnt.json.infoEco.actividadEconomica ? itemTable.declAnt.json.infoEco.actividadEconomica : {}}
                        actual={itemTable.json && itemTable.json.infoEco && itemTable.json.infoEco.actividadEconomica ? itemTable.json.infoEco.actividadEconomica : {}}
                      />
                    </Modal>
                  }
              {itemTable.record.type==='Entity' &&
                <>
                  <Row className="field-section-row">
                    <div className="title-section">
                      <Row>
                        <Col span={23}><h4>Representante Legal que firma documento</h4></Col>
                        <Col span={1}>
                          {itemTable.json.repLegal && itemTable.json.repLegal.hasChanges &&
                          <a onClick={() => setShowPrevRepLegal(true)}>
                            <Icon type="block" style={{fontSize: "20px", float:'right'}} />
                          </a>
                          }
                        </Col>
                      </Row>
                    </div>
                  </Row>
                  { !showPrevRepLegal ?
                    <RepLegal
                      repLegal={itemTable.json && itemTable.json.repLegal ? itemTable.json.repLegal : {}}
                    />
                    :
                    <Modal
                      title="Representante Legal que firma documento"
                      wrapClassName="modal-client-previous-data"
                      visible={true}
                      header={null}
                      width={'95vw'}
                      footer={[<Button onClick={() => onCancelModalSection('repLegal')}>Cerrar</Button>]}
                      onCancel={() => onCancelModalSection('repLegal')}
                    >
                      {textFormHeader()}
                      <RepLegal
                        repLegal={itemTable.declAnt && itemTable.declAnt.json && itemTable.declAnt.json.repLegal ? itemTable.declAnt.json.repLegal : {}}
                        actual={itemTable.json && itemTable.json.repLegal}
                      />
                    </Modal>
                  }
                  {itemTable.json.infoFinanciera &&
                  <>
                    <Row className="field-section-row">
                      <Col span={24}>
                        <div className="title-section">
                          <Row>
                            <Col span={22}><h4>Información Financiera</h4></Col>
                            <Col span={1} offset={1} >
                              {itemTable.json.infoFinanciera && itemTable.json.infoFinanciera.hasChanges &&
                              <a onClick={() => setShowPrevInfoFinanciera(true)}>
                                <Icon type="block" style={{fontSize: "20px", float:'right'}} />
                              </a>
                              }
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                    { !showPrevInfoFinanciera ?
                      <InfoFinanciera
                        infoFinanciera={itemTable.json && itemTable.json.infoFinanciera ? itemTable.json.infoFinanciera : {}}
                        record={itemTable.record}
                      />
                      :
                      <Modal
                        title="Información Financiera"
                        wrapClassName="modal-client-previous-data"
                        visible={true}
                        header={null}
                        width={'95vw'}
                        footer={[<Button onClick={() => onCancelModalSection('infoFinanciera')}>Cerrar</Button>]}
                        onCancel={() => onCancelModalSection('infoFinanciera')}
                      >
                        {textFormHeader()}
                        <InfoFinanciera
                          infoFinanciera={itemTable.declAnt && itemTable.declAnt.json && itemTable.declAnt.json.infoFinanciera ? itemTable.declAnt.json.infoFinanciera : {}}
                          actual={itemTable.json && itemTable.json.infoFinanciera}
                        />
                      </Modal>
                    }
                  </>
                  }
                </>
              }
              {itemTable.json.infoEco && itemTable.json.infoEco.tributaria &&
                <>
                  <Row className="field-section-row">
                    <Col span={24}>
                      <div className="title-section">
                        <Row>
                          <Col span={22}><h4>Información Tributaria</h4></Col>
                          <Col span={1} offset={1} >
                            {itemTable.json.infoEco && itemTable.json.infoEco.tributaria && itemTable.json.infoEco.tributaria.hasChanges &&
                            <a onClick={() => setShowPrevInfoTrib(true)}>
                              <Icon type="block" style={{fontSize: "20px", float:'right'}} />
                            </a>
                            }
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                  { !showPrevInfoTrib ?
                    <InfoTrib
                      infoTributaria={ itemTable.json && itemTable.json.infoEco && itemTable.json.infoEco.tributaria ? itemTable.json.infoEco.tributaria : {} }
                    />
                    :
                    <Modal
                      title="Información Tributaria"
                      wrapClassName="modal-client-previous-data"
                      visible={true}
                      header={null}
                      width={'95vw'}
                      footer={[<Button onClick={() => onCancelModalSection('infoTributaria')}>Cerrar</Button>]}
                      onCancel={() => onCancelModalSection('infoTributaria')}
                    >
                      {textFormHeader()}
                      <InfoTrib
                        infoTributaria={itemTable.declAnt && itemTable.declAnt.json && itemTable.declAnt.json.infoEco.tributaria ? itemTable.declAnt.json.infoEco.tributaria : {}}
                        actual={itemTable.json && itemTable.json.infoEco && itemTable.json.infoEco.tributaria ? itemTable.json.infoEco.tributaria : {}}
                      />
                    </Modal>
                  }
                </>
              }
              <Row className="field-section-row">
                  <Col span={24}>
                    <div className="title-section">
                      <Row>
                        <Col span={22}><h4>Cuentas en Moneda Extranjera</h4></Col>
                        <Col span={1} offset={1} >
                          {itemTable.json.infoEco && itemTable.json.infoEco.monedaExtranjera && itemTable.json.infoEco.monedaExtranjera.hasChanges &&
                          <a onClick={() => setShowPrevMonedaExt(true)}>
                            <Icon type="block" style={{fontSize: "20px", float:'right'}} />
                          </a>
                          }
                        </Col>
                      </Row>
                    </div>
                  </Col>
              </Row>
              { !showPrevMonedaExt ?
                <MonedaExt
                  monedaExt={ itemTable.json && itemTable.json.infoEco && itemTable.json.infoEco.monedaExtranjera ? itemTable.json.infoEco.monedaExtranjera : {}}
                />
                :
                <Modal
                  title="Cuentas en Moneda Extranjera"
                  wrapClassName="modal-client-previous-data"
                  visible={true}
                  header={null}
                  width={'95vw'}
                  footer={[<Button onClick={() => onCancelModalSection('monedaExt')}>Cerrar</Button>]}
                  onCancel={() => onCancelModalSection('monedaExt')}
                >
                  {textFormHeader()}
                  <MonedaExt
                    monedaExt={itemTable.declAnt && itemTable.declAnt.json && itemTable.declAnt.json.infoEco && itemTable.declAnt.json.infoEco.monedaExtranjera ? itemTable.declAnt.json.infoEco.monedaExtranjera : {}}
                    actual={itemTable.json && itemTable.json.infoEco && itemTable.json.infoEco.monedaExtranjera ? itemTable.json.infoEco.monedaExtranjera : {}}
                  />
                </Modal>
              }
              <Row className="field-section-row">
                  <Col span={24}>
                    <div className="title-section">
                      <Row>
                        <Col span={22}><h4>Origen de los fondos</h4></Col>
                        <Col span={1} offset={1} >
                          {itemTable.json.fondos && itemTable.json.fondos && itemTable.json.fondos.hasChanges &&
                          <a onClick={() => setShowPrevOrigenFondos(true)}>
                          <Icon type="block" style={{fontSize: "20px", float:'right'}} />
                          </a>
                          }
                        </Col>
                      </Row>
                    </div>
                  </Col>
              </Row>
              { !showPrevOrigenFondos ?
                <OrigenFondos
                  origenFondos={ itemTable.json && itemTable.json.fondos ? itemTable.json.fondos : {}}
                />
                :
                <Modal
                  title="Origen de los fondos"
                  wrapClassName="modal-client-previous-data"
                  visible={true}
                  header={null}
                  width={'95vw'}
                  footer={[<Button onClick={() => onCancelModalSection('origenFondos')}>Cerrar</Button>]}
                  onCancel={() => onCancelModalSection('origenFondos')}
                >
                  {textFormHeader()}
                  <OrigenFondos
                    origenFondos={itemTable.declAnt && itemTable.declAnt.json && itemTable.declAnt.json.fondos ? itemTable.declAnt.json.fondos : {}}
                    actual={itemTable.json && itemTable.json.fondos}
                  />
                </Modal>
              }
              <Row className="field-section-row">
                  <Col span={24}>
                    <div className="title-section">
                      <Row>
                        <Col span={22}><h4>Personas expuestas políticamente</h4></Col>
                        <Col span={1} offset={1} >
                          {itemTable.json.infoPep && itemTable.json.infoPep.hasChanges &&
                          <a onClick={() => setShowPrevInfoPep(true)}>
                            <Icon type="block" style={{fontSize: "20px", float:'right'}} />
                          </a>
                          }
                        </Col>
                      </Row>
                    </div>
                  </Col>
              </Row>
              {itemTable.record.type === 'Entity' &&
                <Row gutter={[0, 48]}>
                  <Col span={23}>
                      En la empresa existe un director, administrador,
                      representante legal, miembro de junta directiva, accionista,
                      socios con participación directa o indirecta con más del 5%
                      del capital social que:
                      <Divider />
                  </Col>
                  <Col span={1}/>
                </Row>
              }
              { !showPrevInfoPep ?
                <InfoPep
                  infoPep={ itemTable.json && itemTable.json.infoPep ? itemTable.json.infoPep : {}}
                  record={itemTable.record}
                />
                :
                <Modal
                  title="Personas expuestas políticamente"
                  wrapClassName="modal-client-previous-data"
                  visible={true}
                  header={null}
                  width={'95vw'}
                  footer={[<Button onClick={() => onCancelModalSection('infoPep')}>Cerrar</Button>]}
                  onCancel={() => onCancelModalSection('infoPep')}
                >
                  {textFormHeader()}
                  <InfoPep
                    infoPep={itemTable.declAnt && itemTable.declAnt.json && itemTable.declAnt.json.infoPep ? itemTable.declAnt.json.infoPep : {}}
                    actual={itemTable.json && itemTable.json.infoPep}
                    record={itemTable.record}
                  />
                </Modal>
              }
              {itemTable.record.type === 'Entity' &&
                <>
                  <Row className="field-section-row">
                      <Col span={24}>
                        <div className="title-section">
                          <Row>
                            <Col span={22}><h4>Beneficiarios Finales</h4></Col>
                            <Col span={1} offset={1} >
                              {itemTable.json.benFinales && itemTable.json.benFinales.hasChanges &&
                                <Icon type="block" style={{fontSize: "20px", float:'right'}} />
                              }
                            </Col>
                          </Row>
                        </div>
                      </Col>
                  </Row>
                  <Row className="field-section-row">
                    Aquellas persona(s) natural(es) que finalmente posee, directa o indirectamente,
                    a través de sociedades u otros mecanismos, una participación igual o mayor al 5%
                    del capital o de los derechos a voto de una persona jurídica determinada. Asimismo,
                    se entenderá como Beneficiario Final a la(s) persona(s) natural(es) que, sin
                    perjuicio de poseer directa o indirectamente una participación inferior al 5% del
                    capital o de los derechos a voto de una persona jurídica, a través de sociedades
                    u otros mecanismos, ejerce el control efectivo de la persona o estructura jurídica.
                  </Row>
                  { !showPrevBenFinales ?
                    <BenFinales
                      benFinales={ itemTable.json && itemTable.json.benFinales ? itemTable.json.benFinales : {}}
                    />
                    :
                    <Modal
                      title="Personas expuestas políticamente"
                      wrapClassName="modal-client-previous-data"
                      visible={true}
                      header={null}
                      width={'95vw'}
                      footer={[<Button onClick={() => onCancelModalSection('benFinales')}>Cerrar</Button>]}
                      onCancel={() => onCancelModalSection('benFinales')}
                    >
                      {textFormHeader()}
                      <BenFinales
                        benFinales={itemTable.declAnt && itemTable.declAnt.json && itemTable.declAnt.json.benFinales ? itemTable.declAnt.json.benFinales : {}}
                        actual={itemTable.json && itemTable.json.benFinales}
                      />
                    </Modal>
                  }
                </>
              }
              {itemTable.record.type === 'Entity' &&
                <>
                  <Row className="field-section-row">
                      <Col span={24}>
                        <div className="title-section">
                          <Row>
                            <Col span={22}><h4>Oficial de Cumplimiento</h4></Col>
                            <Col span={1} offset={1} >
                              {itemTable.json.ofCumplimiento && itemTable.json.ofCumplimiento.hasChanges &&
                                <Icon type="block" style={{fontSize: "20px", float:'right'}} />
                              }
                            </Col>
                          </Row>
                        </div>
                      </Col>
                  </Row>
                  { !showPrevOficialCumplimiento ?
                    <OficialCumplimiento
                      ofCumplimiento={ itemTable.json && itemTable.json.ofCumplimiento ? itemTable.json.ofCumplimiento : {}}
                    />
                    :
                    <Modal
                      title="Oficial de Cumplimiento"
                      wrapClassName="modal-client-previous-data"
                      visible={true}
                      header={null}
                      width={'95vw'}
                      footer={[<Button onClick={() => onCancelModalSection('ofCumplimiento')}>Cerrar</Button>]}
                      onCancel={() => onCancelModalSection('ofCumplimiento')}
                    >
                      {textFormHeader()}
                      <OficialCumplimiento
                        ofCumplimiento={itemTable.declAnt && itemTable.declAnt.json && itemTable.declAnt.json.ofCumplimiento ? itemTable.declAnt.json.ofCumplimiento : {}}
                        actual={itemTable.json && itemTable.json.ofCumplimiento}
                      />
                    </Modal>
                  }
                </>
              }
              <Row className="field-section-row">
                  <Col span={24}>
                    <div className="title-section">
                      <Row>
                        <Col span={22}><h4>Participación en Sociedades</h4></Col>
                        <Col span={1} offset={1} >
                          {itemTable.json.sociedades && itemTable.json.sociedades.hasChanges &&
                            <Icon type="block" style={{fontSize: "20px", float:'right'}} />
                          }
                        </Col>
                      </Row>
                    </div>
                  </Col>
              </Row>
              { !showPrevParticipacionSoc ?
                  <ParticipacionSoc
                    sociedades={ itemTable.json && itemTable.json.sociedades ? itemTable.json.sociedades : {}}
                    record={itemTable.record}
                  />
                  :
                  <Modal
                    title="Participación en Sociedades"
                    wrapClassName="modal-client-previous-data"
                    visible={true}
                    header={null}
                    width={'95vw'}
                    footer={[<Button onClick={() => onCancelModalSection('sociedades')}>Cerrar</Button>]}
                    onCancel={() => onCancelModalSection('sociedades')}
                  >
                    {textFormHeader()}
                    <ParticipacionSoc
                      sociedades={itemTable.declAnt && itemTable.declAnt.json && itemTable.declAnt.json.sociedades ? itemTable.declAnt.json.sociedades : {}}
                      record={itemTable.record}
                      actual={itemTable.json && itemTable.json.sociedades ? itemTable.json.sociedades : {}}
                    />
                  </Modal>
                }
            </div>
            }
            {/* FIN INFORMACIÓN BÁSICA */}
            <Row className="field-section-row">
              <Col span={22}>
                <h3>Análisis de riesgo</h3>
              </Col>
              <Col span={2} style={{textAlign:'right'}}>
                <Button type="link" onClick={handleMore3}>
                  {seeMore3 ?
                    <>Ver menos <Icon type="minus"/></>
                    :
                    <>Ver más <Icon type="plus"/></>
                  }
                </Button>
              </Col>
            </Row>
            <hr/>
            {seeMore3 &&
            <div className="div-more-info">
              <div className="riesgo-fields-section-wrapper">
                <Row>
                  <Col span={5}>
                  <Row>
                      <Col>
                        <strong>Riesgo AMLupdate</strong>
                      </Col>
                      <Col style={{marginTop:15, marginBottom:10}}>
                        <div className= "radioBtn-wrapper-onb">
                          <Radio.Group
                            className={"radioGroupOnbRisk-"+(itemTable.record.amlStatus !== null ? itemTable.record.amlStatus : 'GRAY')}
                            size="large"
                            defaultValue={itemTable.record.amlStatus !== null && itemTable.record.amlStatus}
                            name="radioRiskObn"
                            buttonStyle="solid"
                            onChange={(e) => setSelectedRisk(e.target.value)}
                          >
                            <Radio.Button value={itemTable.record.amlStatus}>
                              { itemTable.record.amlStatus === null ? "N/A"
                                :
                                itemTable.record.amlStatus === 'GREEN' ? "No posee"
                                :
                                itemTable.record.amlStatus === 'YELLOW' ? "Bajo"
                                :
                                itemTable.record.amlStatus === 'ORANGE' ? "Medio"
                                :
                                itemTable.record.amlStatus === 'RED' ? "Alto"
                                :
                                itemTable.record.amlStatus === 'BLACK' && "Crítico"
                              }
                            </Radio.Button>
                          </Radio.Group>
                        </div>
                      </Col>
                    </Row>
                    <Row style={{marginRight:30, marginTop:20}}>
                      El Riesgo AML es entregado por AMLupdate resultado del cruce de información con las bases de datos.
                    </Row>
                  </Col>
                  <Col span={19}>
                    <Row>
                      <Col>
                        <strong>Riesgo modificado por {currentUser.cliente.name}</strong>
                      </Col>
                      <Col style={{marginTop:15, marginBottom:10}}>
                        <div className= "radioBtn-wrapper-onb">
                          <Radio.Group
                            className={"radioGroupOnbRisk-"+selectedRisk}
                            size="large"
                            defaultValue={itemTable.record.risk}
                            name="radioRiskObn"
                            buttonStyle="solid"
                            onChange={(e) => setSelectedRisk(e.target.value)}
                          >
                            <Radio.Button value="GREEN">No Posee</Radio.Button>
                            <Radio.Button value="YELLOW">Bajo</Radio.Button>
                            <Radio.Button value="ORANGE">Medio</Radio.Button>
                            <Radio.Button value="RED">Alto</Radio.Button>
                            <Radio.Button value="BLACK">Crítico</Radio.Button>
                          </Radio.Group>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        Comentario
                        <Input.TextArea
                          onChange={(e) => {setRiskComment(e.target.value)}} 
                          value={riskComment}
                          placeholder="Sugerimos agregar un comentario cuando modifique o seleccione un riesgo como sustento de la acción. Máximo de 1.000 caracteres"/>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6}>
                        <div>
                          Último comentario: {lastRiskDate ? lastRiskDate : "Sin comentarios"}
                        </div>
                      </Col>
                      <Col span={6} offset={6}>
                        {lastRiskDate &&
                          <Button onClick={() => setIsRiskVisible(true)} style={{padding:'unset'}}type="link">Ver comentarios anteriores</Button>
                        }
                      </Col>
                      <Col span={6}>
                        <Button onClick={() => handleSaveRisk()} style={{float:'right', padding:'unset'}}type="link">Guardar</Button>
                      </Col>
                    </Row>
                      {isRiskVisible &&
                        <HistoryModal schema={riskSchema} data={itemTable.histRisks} closeHandler={handleCloseRiskModal}/>
                      }
                  </Col>
                </Row>
              </div>
              <div className="riesgo-fields-section-wrapper" style={{marginTop:10}}>
                {itemTable.record.compliance && itemTable.record.compliance.total > 0 &&
                  <Row style={{padding:'0px 0px 10px 2px'}}>Se han identificado {itemTable.record.compliance.total} coincidencias. A continuación se muestra la de mayor riesgo.</Row>
                }
                <Row type="flex" gutter={[6,0]}>
                  <Col span={9}>
                    <div className="field-section-row-wrapper">
                      <Row>
                        <div className="header-card-onb-form">
                          Cumplimiento
                        </div>
                      </Row>
                      <Row>
                        <Col span={8}>
                          <div className="title-card-onb-form">
                            Listas Obligatorias
                          </div>
                        </Col>
                        <Col span={8}>
                          <div className="title-card-onb-form">
                            KYC
                          </div>
                        </Col>
                        <Col span={8}>
                          <div className="title-card-onb-form">
                            UBO & Companies
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8}>
                          <>
                            <div className="item-risk-align">
                              <div className={ 'child-risk-onb-circle risk-' + (itemTable.record.compliance && itemTable.record.compliance.PEPSAN && itemTable.record.compliance.PEPSAN.color ? itemTable.record.compliance.PEPSAN.color : "GRAY") }>
                                {itemTable.record.compliance && itemTable.record.compliance.PEPSAN && itemTable.record.compliance.PEPSAN.bases && itemTable.record.compliance.PEPSAN.bases.length}
                              </div>
                            </div>
                          </>
                        </Col>
                        <Col span={8}>
                          <>
                            <div className="item-risk-align">
                              <div className={ 'child-risk-onb-circle risk-' + (itemTable.record.compliance && itemTable.record.compliance.KYCAME && itemTable.record.compliance.KYCAME.color ? itemTable.record.compliance.KYCAME.color : "GRAY") }>
                                {itemTable.record.compliance && itemTable.record.compliance.KYCAME && itemTable.record.compliance.KYCAME.bases && itemTable.record.compliance.KYCAME.bases.length}
                              </div>
                            </div>
                          </>
                        </Col>
                        <Col span={8}>
                          <>
                            <div className="item-risk-align">
                              <div className={ 'child-risk-onb-circle risk-' + (itemTable.record.compliance && itemTable.record.compliance.UBOCOM && itemTable.record.compliance.UBOCOM.color ? itemTable.record.compliance.UBOCOM.color : "GRAY") }>
                                {itemTable.record.compliance && itemTable.record.compliance.UBOCOM && itemTable.record.compliance.UBOCOM.bases && itemTable.record.compliance.UBOCOM.bases.length}
                              </div>
                            </div>
                          </>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col span={9}>
                    <div className="field-section-row-wrapper">
                      <Row>
                        <div className="header-card-onb-form">
                          Sociedades / Propietarios
                        </div>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <div className="table-col-wrapper-onb">
                            <Table
                              dataSource={ubos === null ? null : (itemTable.record.type === 'Person' || (ubos.ubos && ubos.ubos.length === 0))
                                          ? ubos.psoc : ubos.ubos}
                              columns={propColumns}
                              showHeader={false}
                              tableLayout="fixed"
                              scroll={{ y: 120 }}
                              pagination={false}
                              loading = {ubos === null}
                              locale = {localeObj}
                            />
                          </div>
                        </Col>
                        {/* <Col span={6}>
                          <div className="text-5mas-wrapper">
                            y 5 más...
                          </div>
                        </Col> */}
                      </Row>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className="field-section-row-wrapper">
                      <Row>
                        <div className="header-card-onb-form">
                          Relevancia
                        </div>
                      </Row>
                      <Row>
                        <div className="progress-flat-wrapper">
                          <Progress
                          // type="circle"
                          percent={itemTable.record.compliance && itemTable.record.compliance.percent}
                          status="normal"
                          width={80}
                          />
                        </div>
                      </Row>
                      {itemTable.record.pdfFile &&
                        <Row>
                          <div className="progress-button-wrapper">
                            <Button onClick={() =>{downloadReportRisk(itemTable.record.pdfFile)}}>Ver Certificado</Button>
                          </div>
                        </Row>
                      }
                    </div>
                  </Col>
                </Row>
              </div>
              {falsosPositivos &&
                <FalsesPositivesBlock alert={falsosPositivos} refreshHandler={handleRefreshItem} />
              }
            </div>
            }
            {/* FIN RIESGO */}
            <Row className="field-section-row">
              <Col span={22}>
                <h3>Comentarios</h3>
              </Col>
              <Col span={2} style={{textAlign:'right'}}>
                <Button type="link" onClick={handleMore2}>
                  {seeMore2 ?
                    <>Ver menos <Icon type="minus"/></>
                    :
                    <>Ver más <Icon type="plus"/></>
                  }
                </Button>
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
              <Row>
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
              </Row>
            </div>
            }
            {isHistoryVisible &&
                <HistoryModal schema={commentSchema} data={itemTable.histComments} closeHandler={handleCloseModals}/>
            }
            {/* FIN COMENTARIOS */}

            <Row className="field-section-row">
              <Col span={22}>
                <h3>Formularios de Onboarding</h3>
              </Col>
              <Col span={2} style={{textAlign:'right'}}>
                <Button type="link" onClick={handleMore4}>
                  {seeMore4 ?
                    <>Ver menos <Icon type="minus"/></>
                    :
                    <>Ver más <Icon type="plus"/></>
                  }
                </Button>
              </Col>
            </Row>
            <hr/>
            {seeMore4 &&
            <div className="div-more-info">
              <Row className="field-section-row">
              <Col span={3}>
                <div className="formCard-onb-modal">
                  Solicitudes <br/>
                  {itemTable.forms && itemTable.forms.length}
                </div>
              </Col>
              <Col span={3}>
                <div className="formCard-onb-modal">
                  Pendientes <br/>
                  {itemTable.forms && itemTable.forms.filter(form => form.statusDecl === 'PENDIENTE').length}
                </div>
              </Col>
              <Col span={3}>
                <div className="formCard-onb-modal">
                  Realizadas <br/>
                  {itemTable.forms && itemTable.forms.filter(form => form.statusDecl === 'EVALUACION').length}
                </div>
              </Col>
              <Col span={3}>
                <div className="formCard-onb-modal">
                  Autorizadas <br/>
                  {itemTable.forms && itemTable.forms.filter(form => form.statusDecl === 'AUTORIZADA').length}
                </div>
              </Col>
              <Col span={3}>
                <div className="formCard-onb-modal">
                  Rechazadas <br/>
                  {itemTable.forms && itemTable.forms.filter(form => form.statusDecl === 'RECHAZADA').length}
                </div>
              </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Table
                    columns={formsColumns}
                    dataSource={itemTable.forms}
                    pagination={itemTable.forms && itemTable.forms.length > 5 ? { pageSize: 5, size:"small" } : false}
                  />
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
                      >
                      {/*<ModalPdfViewer pdfId={formId} />*/}
                      </Modal>
                  }
                </Col>
              </Row>
            </div>
            }

            { isPeriodicityVisible &&
              <Modal
                title={<div><Icon type="clock-circle"/> Modificar periodicidad</div>}
                header={null}
                footer={[<Button onClick={onCancelPeriodicity}>Cerrar</Button>, <Button type="primary" onClick={savePeriodicity}>{t('messages.aml.modify')}</Button>]}
                onCancel={onCancelPeriodicity}
                visible={true}
              >
                  <p style={{textAlign:'justify'}}>
                    Informamos que la siguiente solicitud del formulario de OnBoarding está programada para {moment(itemTable.nextDate).format('DD/MM/YYYY')}.
                    <br/>
                    Si lo requiere a continuación puede seleccionar una nueva periodicidad
                  </p>
                  <p>
                    <Row>
                      <Col>
                        <Select style={{width: '70%', float:'right'}} onChange={(v) => setPeriodicity(v)} defaultValue={itemTable.periodicity}>
                          <Select.Option value={null}>{t('messages.aml.none')}</Select.Option>
                          <Select.Option value="MONTHLY">{t('messages.aml.onboarding.period.MONTHLY')}</Select.Option>
                          <Select.Option value="QUARTERLY">{t('messages.aml.onboarding.period.QUARTERLY')}</Select.Option>
                          <Select.Option value="BIANNUAL">{t('messages.aml.onboarding.period.BIANNUAL')}</Select.Option>
                          <Select.Option value="ANNUAL">{t('messages.aml.onboarding.period.ANNUAL')}</Select.Option>
                        </Select>
                      </Col>
                    </Row>
                  </p>

                  <p style={{textAlign:'justify'}}>
                    Recuerde si selecciona la opción Ninguno el sistema dejará sin efecto el envío de la solicitud del formulario.
                  </p>
              </Modal>
            }
        </>
      }
      </div>
    );
}
export default ModalClientCard
