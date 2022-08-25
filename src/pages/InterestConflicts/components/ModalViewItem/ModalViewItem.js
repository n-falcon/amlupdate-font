import './ModalViewItem.scss';
import React, { useEffect, useState } from 'react';
import { Button, Col, Input, Modal, notification, Radio, Row, Select, Spin, Switch, Table } from 'antd';
import { getMatchesPromise, saveCommentsPromise, saveObsFormPromise } from './promises';
import moment from 'moment';
import apiConfig from '../../../../config/api';
import authImg from './authorization.png';
import { camelizerHelper } from '../../../../helpers/';
import { ModalPdfViewer } from '../';
import { HistoryModal } from '../../../../layouts/Private/components';
import TextArea from 'antd/lib/input/TextArea';

const ModalViewItem = ({ item, onCancel, onOk, type }) => {
  const [itemData, setItemData] = useState({})
  const [isItemDataLoading, setIsItemDataLoading] = useState(true)
  const [selectedRisk, setSelectedRisk] = useState(null)
  const [observations, setObservations] = useState(null)
  const [title, setTitle] = useState(null)
  const [comments, setComments] = useState(null)
  const [lastDateComment, setLastDateComment] = useState(null);
  const [lastDateRisk, setLastDateRisk] = useState(null);
  const [histRisk, setHistRisk] = useState(null);
  const [showHistRisk, setShowHisRisk] = useState(false);
  const [histComment, setHistComments] = useState(null);
  const [showHistComments, setShowHisComments] = useState(false);
  const [isEnabledRisk, setIsEnabledRisk] = useState(false)
  const [isEnabledComments, setIsEnabledComments] = useState(false)
  const [authorized, setAuthorized] = useState(null)
  const [formId, setFormId] = useState(null)
  const handleGetMatches = async id => {
    const i = await getMatchesPromise(id)

    setAuthorized(i.data.authorized)

    await setItemData(i.data)
    await setSelectedRisk(i.data.risk)
    await setObservations(i.data.observations)


    const riskHis = i.data.histRisk;

    let creationDateRisk = 'N/A';

    if (riskHis.length > 0) {
      setHistRisk(riskHis);
      creationDateRisk = moment(riskHis[0].creationDate).format('DD/MM/YYYY HH:mm:ss');
    }
    setLastDateRisk(creationDateRisk)

    const commentsHis = i.data.histComments;

    let creationDateComment = 'N/A'
    if (commentsHis.length > 0) {
      setHistComments(commentsHis);
      creationDateComment = moment(commentsHis[0].creationDate).format('DD/MM/YYYY HH:mm:ss');
    }
    setLastDateComment(creationDateComment);


    setIsItemDataLoading(false)
  }

  useEffect(() => {
    handleGetMatches(item.id)
    setSelectedRisk(item.risk)
    setObservations(observations)
  }, [])

  const tableColumns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      render: (text) => {
        return camelizerHelper(text)
      }
    },
    {
      title: 'Rut',
      dataIndex: 'rut'
    },
    {
      title: 'Categoría',
      dataIndex: 'category',
      render: (text, record) => {
        if (text === 'COLABORADOR') return 'Trabajador'
        else if (text === 'PROVEEDOR') return 'Proveedor'
        else if (text === 'CLIENTE') return 'Cliente'
        else if (text === 'DIRECTOR') return 'Director'
      }
    },
    {
      title: 'Folio',
      dataIndex: 'formRelated.folio',
      render: (text, record) => {
        return record.formRelated !== null ? text : '-'
      }
    },
    {
      title: 'Fecha completado',
      dataIndex: 'formRelated.receiveDate',
      render: (text, record) => {
        return record.formRelated !== null ? moment(text).format('DD/MM/YYYY') : '-'
      }
    },
    {
      title: 'Rut relacionado',
      dataIndex: 'rutRelated'
    },
    {
      title: 'Ver formulario',
      render: (text, record) => record.formRelated !== null && <Button onClick={() => onClickPdfView(record.formRelated.id)} icon="file"></Button>
    }
  ]

  const riskSchema = [
    {
      title: 'Fecha',
      dataIndex: 'creationDate',
      cols: 6
    },
    {
      title: 'Nombre',
      dataIndex: 'userName',
      cols: 12
    },
    {
      title: 'Riesgo',
      dataIndex: 'risk',
      cols: 6
    }
  ];

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

  const onClickPdfView = (id) => {
    setFormId(id);
  }

  const onCancelPdfViewer = () => {
    setFormId(null);
  }

  const hanldeOnChangeRiskEnabled = () => {
    setIsEnabledRisk(!isEnabledRisk);
  }

  const hanldeOnChangeCommentsEnabled = () => {
    setIsEnabledComments(!isEnabledComments);
  }

  const handleHisRisk = () => {
    console.log(histRisk);
    setShowHisRisk(true);
  }

  const handleHisComments = () => {
    setShowHisComments(true);
  }

  const handleCloseModals = () => {
    setShowHisRisk(false);
    setShowHisComments(false);
  }

  const handleTitleChange = (e) => {
    let val = e == null ? '' : e.target.value;
    setTitle(val)
  }

  const handleCommentariesChange = (e) => {
    let val = e == null ? '' : e.target.value;
    setComments(val)
  }

  const handleRiskChange = (e) => {
    setSelectedRisk(e.target.value)
  }

  const handleObservationsChange = (e) => {
    let val = e.target.value == null ? '' : e.target.value;
    setObservations(e.target.value)
  }

  const handleSaveCommentary = async () => {
   let i = await saveCommentsPromise(item.id, title, comments);
   handleTitleChange(null);
   handleCommentariesChange(null);

   handleGetMatches(item.id)
    notification['success']({ message: 'Operacion Exitosa'});
  }

  const handleSaveRisk = async () => {
    let i = await saveObsFormPromise(item.id, authorized, selectedRisk, observations)
    item.autDate = i.data.autDate
    item.authorized = authorized
    item.risk = selectedRisk

    handleGetMatches(item.id)

    notification['success']({ message: 'Operacion Exitosa'});
  }

  const changeAuthorized = async (e) => {
    setAuthorized(e.target.value)
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
      className="modal-view-item"
      footer={null}
      header={null}
      onCancel={onCancel}
      onOk={onOk}
      visible="true"
    >
      <>
        {
          isItemDataLoading ? <div className="spinner"><Spin spinning={true} size="big" /></div> :
            <>
              <div className="box">
                <h2>{type === 'CLIENTE' ? (itemData.recipient.record.type === 'Person' ? 'Ficha de Persona Natural' : 'Ficha de Persona Jurídica') : 'Ficha'}</h2>
                <div className="box-inner" style={{ padding: '10px 5px' }}>
                  {
                    (type === 'COLABORADOR' || type === 'DIRECTOR') &&
                    <>
                      <Row>
                        <Col span={12}>
                          <div className="col-inner">
                            <div className="key">Nombre</div>
                            <div className="value">{camelizerHelper(itemData.recipient.record.nombre)}</div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="col-inner">
                            <div className="key">Rut</div>
                            <div className="value">{itemData.recipient.record.rut}</div>
                          </div>
                        </Col>
                        {type === 'COLABORADOR' &&
                          <Col span={12}>
                            <div className="col-inner">
                              <div className="key">Gerencia</div>
                              <div className="value">{camelizerHelper(itemData.gerencia)}</div>
                            </div>
                          </Col>
                        }
                        <Col span={12}>
                          <div className="col-inner">
                            <div className="key">Area</div>
                            <div className="value">{camelizerHelper(itemData.recipient.record.area)}</div>
                          </div>
                        </Col>
                        {type === 'COLABORADOR' &&
                          <Col span={12}>
                            <div className="col-inner">
                              <div className="key">Cargo</div>
                              <div className="value">{itemData.cargo}</div>
                            </div>
                          </Col>
                        }
                        <Col span={12}>
                          <div className="col-inner">
                            <div className="key">E-Mail</div>
                            <div className="value">{itemData.recipient.record.email}</div>
                          </div>
                        </Col>
                      </Row>
                    </>
                  }
                  {
                    (type === 'PROVEEDOR') &&
                    <>
                      <Row>
                        <Col xs={12}>
                          <div className="col-inner">
                            <div className="key">Razón Social</div>
                            <div className="value">{camelizerHelper(itemData.recipient.record.nombre)}</div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="col-inner">
                            <div className="key">Rut</div>
                            <div className="value">{itemData.recipient.record.rut}</div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12}>
                          <div className="col-inner">
                            <div className="key">Empresa</div>
                            <div className="value">{itemData.recipient.record.subcliente !== null ? itemData.recipient.record.subcliente.name : itemData.recipient.request.createUser.cliente.name}</div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="col-inner">
                            <div className="key">Area</div>
                            <div className="value">{camelizerHelper(itemData.recipient.record.area)}</div>
                          </div>
                        </Col>

                      </Row>
                      <Row>
                        <Col span={12}>
                          <div className="col-inner">
                            <div className="key">Nombre de la persona que completa la declaración</div>
                            <div className="value">{itemData.name}</div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="col-inner">
                            <div className="key">Cargo</div>
                            <div className="value">{itemData.cargo}</div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <div className="col-inner">
                            <div className="key">E-Mail</div>
                            <div className="value">{itemData.email}</div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="col-inner">
                            <div className="key">Teléfono</div>
                            <div className="value">{itemData.phone}</div>
                          </div>
                        </Col>
                      </Row>
                    </>
                  }
                  {type === 'CLIENTE' &&
                    <>
                      {itemData.recipient.record.type === 'Person' &&
                        <>
                          <Row>
                            <Col span={12}>
                              <div className="col-inner">
                                <div className="key">Nombre</div>
                                <div className="value">{camelizerHelper(itemData.recipient.record.nombre)}</div>
                              </div>
                            </Col>
                            <Col span={12}>
                              <div className="col-inner">
                                <div className="key">Rut</div>
                                <div className="value">{itemData.recipient.record.rut}</div>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={12}>
                              <div className="col-inner">
                                <div className="key">Area</div>
                                <div className="value">{camelizerHelper(itemData.recipient.record.area)}</div>
                              </div>
                            </Col>
                            <Col span={12}>
                              <div className="col-inner">
                                <div className="key">E-Mail</div>
                                <div className="value">{itemData.recipient.record.email}</div>
                              </div>
                            </Col>
                          </Row>
                        </>
                      }
                      {itemData.recipient.record.type === 'Entity' &&
                        <>
                          <Row>
                            <Col xs={12}>
                              <div className="col-inner">
                                <div className="key">Razón Social</div>
                                <div className="value">{camelizerHelper(itemData.recipient.record.nombre)}</div>
                              </div>
                            </Col>
                            <Col span={12}>
                              <div className="col-inner">
                                <div className="key">Rut</div>
                                <div className="value">{itemData.recipient.record.rut}</div>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={12}>
                              <div className="col-inner">
                                <div className="key">Area</div>
                                <div className="value">{camelizerHelper(itemData.recipient.record.area)}</div>
                              </div>
                            </Col>
                            <Col span={12}>
                              <div className="col-inner">
                                <div className="key">Nombre de la persona que completa la declaración</div>
                                <div className="value">{itemData.name}</div>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                          </Row>
                        </>
                      }
                    </>
                  }
                  {
                    (type === 'GIFT' || type === 'TRAVEL' || type === 'FP' || type === 'SOC') &&
                    <>
                      <Row>
                        <Col span={12}>
                          <div className="col-inner">
                            <div className="key">Nombre</div>
                            <div className="value">{itemData.recipient.record.nombre}</div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="col-inner">
                            <div className="key">Rut</div>
                            <div className="value">{itemData.recipient.record.rut}</div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <div className="col-inner">
                            <div className="key">Empresa</div>
                            <div className="value">{itemData.recipient.record.subcliente !== null ? itemData.recipient.record.subcliente.name : itemData.recipient.request.createUser.cliente.name}</div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="col-inner">
                            <div className="key">Area</div>
                            <div className="value">{camelizerHelper(itemData.recipient.record.area)}</div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <div className="col-inner">
                            <div className="key">Gerencia</div>
                            <div className="value">{camelizerHelper(itemData.gerencia)}</div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="col-inner">
                            <div className="key">Cargo</div>
                            <div className="value">{camelizerHelper(itemData.cargo)}</div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <div className="col-inner">
                            <div className="key">Nombre de Jefatura</div>
                            <div className="value">{itemData.jefatura}</div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="col-inner">
                            <div className="key">E-mail de Jefatura</div>
                            <div className="value">{itemData.mailJefatura}</div>
                          </div>
                        </Col>
                      </Row>
                    </>
                  }
                </div>
              </div>
              <div className="box">
                <h2>Declaración</h2>
                {
                  itemData.status === 'SENT' &&
                  <div className="download-report">
                    <Button onClick={() => onClickPdfView(item.id)} icon="menu" size="small" type="primary">Ver formulario</Button>
                  </div>
                }
                <div className="box-inner">
                  <div className="declarations">
                    <Row style={{ padding: 0 }}>
                      <Col xs={24}>
                        <ul className="top-5-items">
                          <li>
                            <div className="col-inner">
                              <div className="key">Folio</div>
                              <div className="value">{item.folio}</div>
                            </div>
                          </li>
                          {
                            (type === 'COLABORADOR' || type === 'PROVEEDOR' || type === 'CLIENTE' || type === 'DIRECTOR') &&
                            <>
                              <li>
                                <div className="col-inner">
                                  <div className="key">Estado / Fecha</div>
                                  <div className="value">{renderStatus(itemData.status)} - <span style={{ fontStyle: 'italic', color: 'grey !important', fontWeight: 'normal' }}>{itemData.status === 'SENT' ? moment(itemData.sendDate).format('DD/MM/YYYY') : moment(itemData.sendDate).fromNow()}</span></div>
                                </div>
                              </li>
                              <li>
                                <div className="col-inner">
                                  <div className="key">Respuestas afirmativas</div>
                                  <div className="value">{itemData.affirmative}</div>
                                </div>
                              </li>
                              <li>
                                <div className="col-inner">
                                  <div className="key">Vinculos</div>
                                  <div className="value">{itemData.hasPositives ? 'Sí' : 'No'} </div>
                                </div>
                              </li>
                              <li>
                                <div className="col-inner">
                                  <div className="key">Recordatorios: Nro / Fecha</div>
                                  <div className="value">
                                    {itemData.nroReminders}
                                    {itemData.lastReminder !== null && ' - ' + moment(itemData.lastReminder).format('DD/MM/YYYY')}
                                  </div>
                                </div>
                              </li>
                            </>
                          }
                          {
                            (type === 'GIFT' || type === 'TRAVEL' || type === 'FP' || type === 'SOC') &&
                            <li>
                              <div className='col-inner'>
                                <div className="key">Fecha de Recepción</div>
                                <div className="value">{itemData.receiveDate ? moment(itemData.receiveDate).format('DD/MM/YYYY') : '-'}</div>
                              </div>
                            </li>
                          }
                          {
                            (type === 'SOC' || type === 'FP') &&
                            <li>
                              <div className="col-inner">
                                <div className="key">Nombre Funcionario</div>
                                <div className="value">{(itemData.reunion !== null && itemData.reunion.partName1 !== null) ? itemData.reunion.partName1 : '-'}</div>
                              </div>
                            </li>
                          }
                          {
                            (type === 'GIFT' || type === 'TRAVEL') &&
                            <li>
                              <div className="col-inner">
                                <div className="key">Empresa que regala</div>
                                <div className="value">{(itemData.reunion !== null && itemData.reunion.organism) ? itemData.reunion.organism : '-'}</div>
                              </div>
                            </li>
                          }
                          {
                            type === 'GIFT' &&
                            <li>
                              <div className="col-inner">
                                <div className="key">Tipo de Regalo</div>
                                <div className="value">{(itemData.reunion !== null && itemData.reunion.category) ? itemData.reunion.category : '-'}</div>
                              </div>
                            </li>
                          }
                          {
                            type === 'SOC' &&
                            <li>
                              <div className="col-inner">
                                <div className="key">Fecha de Reunión</div>
                                <div className="value">{(itemData.reunion !== null && itemData.reunion.date !== null) ? moment(itemData.reunion.date).format('DD/MM/YYYY') : '-'}</div>
                              </div>
                            </li>
                          }
                          {
                            type === 'FP' &&
                            <li>
                              <div className="col-inner">
                                <div className="key">Tipo de reunión</div>
                                <div className="value">{itemData.reunion !== null && itemData.reunion.type !== null ? itemData.reunion.type : '-'}</div>
                              </div>
                            </li>
                          }
                          {
                            type === 'SOC' &&
                            <li>
                              <div className="col-inner">
                                <div className="key">Nombre de asociación</div>
                                <div className="value">{(itemData.reunion !== null && itemData.reunion.organism !== null) ? itemData.reunion.organism : '-'}</div>
                              </div>
                            </li>
                          }
                          {
                            type === 'FP' &&
                            <li>
                              <div className="col-inner">
                                <div className="key">Folio Audiencia Lobby</div>
                                <div className="value">{itemData.reunion !== null && itemData.reunion.folio !== null ? itemData.reunion.folio : '-'}</div>
                              </div>
                            </li>
                          }
                          {
                            type === 'TRAVEL' &&
                            <li>
                              <div className="col-inner">
                                <div className="key">Destino</div>
                                <div className="value">{itemData.reunion !== null && itemData.reunion.country !== null ? itemData.reunion.country : '-'}</div>
                              </div>
                            </li>
                          }
                          {
                            (type === 'GIFT' || type === 'TRAVEL') &&
                            <li>
                              <div className="col-inner">
                                <div className="key">Valor Estimado</div>
                                <div className="value">{(itemData.reunion !== null && itemData.reunion.value) ? itemData.reunion.value : '-'}</div>
                              </div>
                            </li>
                          }
                        </ul>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
              <div className="box">
                <h2>Comentarios</h2>
                <div className="switch-action">
                  <Switch size="small" onChange={hanldeOnChangeCommentsEnabled} />
                </div>
                <div className={isEnabledComments ? 'enabledComments' : 'disabledComments'}>
                  <Row >
                    <Col xs={24}>
                      <div class="comentary-title">
                        <div className="key">Titulo</div>
                        <div className="value">
                          <Input value={title} onChange={handleTitleChange} size="small" maxLength={200} />
                        </div>
                      </div>
                    </Col>
                    <Col xs={24}>
                      <div className="comentary-description">
                        <div className="key">Comentarios</div>
                        <div className="value">
                          <TextArea value={comments} style={{ maxHeight: 100 }} onChange={handleCommentariesChange} size="small" maxLength={2000}></TextArea>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: 10 }}>
                    <Col push={5} span={6} offset={6}>Historial: {lastDateComment}</Col>
                    {itemData.histComments && itemData.histComments.length > 0 && <Col span={6} offset={6}><a onClick={handleHisComments}>Ver Comentarios Anteriores</a></Col>}
                  </Row>

                  <div className="bottom">
                    <Button type="primary" onClick={handleSaveCommentary} >Guardar</Button>
                  </div>
                </div>

              </div>

              { itemData.status === 'SENT' &&
              <div className="box">
                <h2>Riesgo</h2>
                <div className="switch-action">
                  <Switch size="small" onChange={hanldeOnChangeRiskEnabled} />
                </div>

                <div className={isEnabledRisk ? 'enabledRisk' : 'disabledRisk'}>
                  <Row>
                    {
                      (type === 'GIFT' || type === 'TRAVEL') && (
                        <Col span={4} className='col-travel-extra' >
                          <div className='col-inner'>
                            <div className="key">Autorización</div>
                            <div className="value" style={{ height: 110 }}>
                              <div className='authorization'>
                                <div className='header'>
                                  <Radio.Group defaultValue={authorized} size="small" onChange={changeAuthorized}>
                                    <ul className="value-items">
                                      <li><Radio value={true} /> Autorizado</li>
                                      <li><Radio value={false} /> Rechazado</li>
                                    </ul>
                                  </Radio.Group>
                                </div>
                                <div className='footer'>
                                  <p>Fecha</p>
                                  <small>{itemData.autDate !== null ? moment(itemData.autDate).format('DD/MM/YYYY') : '-'}</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      )
                    }
                    <Col span={4} >
                      <div className="col-inner">
                        <div className="key">Selector de riesgo</div>
                        <div className="value" style={{ height: 'auto' }}>
                          {(itemData.recipient.request.type === 'CDI' || itemData.recipient.request.type === 'DIR' || itemData.recipient.request.type === 'PATR') && !itemData.hasPositives && itemData.affirmative === 0 &&
                              <div className="block-risk">

                              </div>
                            }
                          <Radio.Group defaultValue={selectedRisk} onChange={handleRiskChange}>
                            <ul className="value-items">
                              <li><Radio value="HIGH" /> Alto</li>
                              <li><Radio value="MEDIUM" /> Medio</li>
                              <li><Radio value="LOW" /> Bajo</li>
                              <li><Radio value="N" /> No posee</li>
                            </ul>
                          </Radio.Group>
                        </div>
                      </div>
                    </Col>
                    <Col className={(type === 'GIFT' || type === 'TRAVEL') ? 'col-travel' : ''} span={(type === 'GIFT' || type === 'TRAVEL') ? 16 : 20} >

                      <div className="col-inner">
                        <div className="key">Comentarios</div>
                        <div className="value" style={{ height: 111 }}>
                          <TextArea id="observations" value={observations} onChange={handleObservationsChange} maxLength={2000}
                            disabled={(itemData.recipient.request.type === 'CDI' || itemData.recipient.request.type === 'DIR' || itemData.recipient.request.type === 'PATR') && !itemData.hasPositives && itemData.affirmative === 0}
                          >
                          </TextArea>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: 10 }}>
                    <Col push={5} span={6} offset={6}>Historial: {lastDateRisk}</Col>
                    {itemData.histRisk && itemData.histRisk.length > 0 && <Col span={6} offset={6}><a onClick={handleHisRisk}>Ver Riesgo Anteriores</a></Col>}
                  </Row>
                  <div className="bottom">
                    <Button type="primary" onClick={handleSaveRisk} disabled={(authorized === itemData.authorized && selectedRisk === null) || ((itemData.recipient.request.type === 'CDI' || itemData.recipient.request.type === 'DIR' || itemData.recipient.request.type === 'PATR') && !itemData.hasPositives && itemData.affirmative === 0) }>Guardar</Button>
                  </div>
                </div>
              </div>
              }
              {
                (itemData.recipient.request.type === 'CDI' || itemData.recipient.request.type === 'DIR' || itemData.recipient.request.type === 'PATR' || itemData.recipient.request.type === 'REL') &&
                <div className="box">
                  <h2>Vínculos</h2>
                  <div className="box-inner">
                    {
                      !isItemDataLoading && itemData.relations.length > 0 ?
                        <Table pagination={false} dataSource={itemData.relations} columns={tableColumns} size='small' />
                        :
                        <div className="no-matches">No se ha identificado conflicto de interés.</div>
                    }
                  </div>
                </div>
              }
            </>
        }
      </>
      {
        showHistRisk && <HistoryModal type={'Historial de Riesgo'} schema={riskSchema} data={histRisk} closeHandler={handleCloseModals} />
      }
      {
        showHistComments && <HistoryModal type={'Historial de Comentarios'} schema={commentSchema} data={histComment} closeHandler={handleCloseModals} />
      }
      {formId &&
        <Modal
          className="modal-pdf-viewer"
          title="Formulario"
          centered={true}
          width={1000}
          header={null}
          footer={[<Button key="back" onClick={onCancelPdfViewer}>Cerrar</Button>]}
          onCancel={onCancelPdfViewer}
          visible="true"
        ><ModalPdfViewer
            pdfId={formId}
          />
        </Modal>
      }
    </Modal>
  )
}

export default ModalViewItem
