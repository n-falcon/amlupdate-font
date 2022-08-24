import "./ModalViewMonitoreo.scss";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Modal,
  Radio,
  Row,
  Spin,
  Table,
} from "antd";
//import { AlertManagerPage } from "../../..";
import moment from "moment";
import { camelizerHelper } from "../../../../helpers/";
import { useTranslation } from "react-i18next";
import { getMonitorRegistroPromise } from "../../promises";

const ModalViewMonitoreo = ({
  handleChangeModal,
  modalItem,
  onCancel,
  historyTable,
  currentUser
}) => {
  const { t } = useTranslation();
  const [isLoading,setIsLoading]=useState(true)
  const [itemCopy, setItemCopy] = useState(modalItem);
  const [visibleAlertManager, setVisibleAlertManager] = useState(false)
  const [clickedItem, setClickedItem] = useState({})
  const [clickedIndex, setClickedIndex] = useState(-1);
  const [changesCounter, setChangesCounter] = useState(0);

  const handleChangeField = (field, value) => {
    setItemCopy({ ...itemCopy, [field]: value });
    setChangesCounter(changesCounter + 1);
  };

  useEffect(()=>{
    getMonitorRegistroPromise(modalItem.id).then(i => {
      setItemCopy(i)
      setIsLoading(false)
    })
  },[])


  const handleOnRow=(record, rowIndex) => {
    return {
      onClick: event => {
        setClickedIndex(rowIndex)
        setClickedItem(record)
        setVisibleAlertManager(true)
      }
    };
  }

  const closeModalAlertHandler = () => {
    setVisibleAlertManager(false)
  }

  const getHandlePrevItem = () => {
    if (clickedIndex <= 0) {
      return null;
    } else {
      return () => {
        setClickedItem(historyTable[clickedIndex - 1]);
        setClickedIndex(clickedIndex - 1);
      };
    }
  };

  const getHandleNextItem = () => {
    if (clickedIndex >= historyTable.length - 1) {
      return null;
    } else {
      return () => {
        setClickedItem(historyTable[clickedIndex + 1]);
        setClickedIndex(clickedIndex + 1);
      };
    }
  };

  const tableColumns = [
    {
      title: "Tipo de Riesgo",
      dataIndex: "type",
      render: (text) => {
        return t("messages.aml.risk." + text);
      },
    },
    {
      title: "Puntaje",
      dataIndex: "score",
    },
    {
      title: "Folio",
      dataIndex: "folio",
    },
    {
      title: "Fecha de Alerta",
      dataIndex: "creationDate",
      render: (text) => {
        return text !== null ? moment(text).format('DD/MM/YYYY'):'-'
      }
    },

    {
      title: "Estado",
      dataIndex: "status",
      render: (text, record) => {
        return t("messages.aml.alert.status."+text)
      }
    },
    {
      title: "Asignado a",
      dataIndex: "assign",
      render: (text) => {
        return text !== null ? text:'-'
      }
    },
    {
      title: "Tareas Totales",
      dataIndex: "nroTareas",
      render: (text) => {
        return text !== null ? text:'-'
      }
    },
    {
      title: "Tareas Completadas",
      dataIndex: "nroTareasComp",
      width:"150px",
      render: (text) => {
        return text !== null ? text:'-'
      }
    },
  ];

  return (
    <>
      <Modal
        className="modal-view-monitoreo"
        footer={null}
        header={null}
        onCancel={onCancel}
        visible="true"
      >
        <>
          {isLoading ? (
            <div className="spinner">
              <Spin spinning={true} size="big" />
            </div>
          ) : (
            <>
              <div className="box">
                <h2>
                  <span>Detalle por Persona</span>
                </h2>

                <div className="box-inner">
                  <Row>
                    <Col span={12}>
                      <div className="col-inner">
                        <div className="key">{t("messages.aml.name")}</div>
                        <div className="value">
                          {camelizerHelper(itemCopy.record.nombre)}
                        </div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="col-inner">
                        <div className="key">{t("messages.aml.rutNumber")}</div>
                        <div className="value">{itemCopy.record.rut}</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="col-inner">
                        <div className="key">{t("messages.aml.subclient")}</div>
                        <div className="value">{itemCopy.record.company ? itemCopy.record.company : 'N/A'}</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="col-inner">
                        <div className="key">Area</div>
                        <div className="value">{itemCopy.record.area ? itemCopy.record.area : 'N/A'}</div>
                      </div>
                    </Col>
                    { itemCopy.record.citizenship &&
                      <Col span={12}>
                        <div className="col-inner">
                          <div className="key">{t("messages.aml.citizenship")}</div>
                          <div className="value">{itemCopy.record.citizenship}</div>
                        </div>
                      </Col>
                    }
                    { itemCopy.record.dateBirth &&
                      <Col span={12}>
                        <div className="col-inner">
                          <div className="key">{t("messages.aml.birthDate")}</div>
                          <div className="value">{itemCopy.record.dateBirth}</div>
                        </div>
                      </Col>
                    }
                  </Row>
                </div>
              </div>

              <div className="box">
                <h2>
                  <span>Análisis</span>
                </h2>

                <div className="box-inner">
                  <div className="declarations">
                    <Row className="declaration-foot">
                        <Col className="col-travel-extra">
                          <div className="columns-title">Riesgo Sistema</div>
                          <div className="col-inner">
                            <div className="key puntaje">
                              <Row>
                                <Col className="system-risk-tags" span={8}></Col>
                                <Col className="system-risk-data" span={6}>
                                  Alertas
                                </Col>
                                <Col className="system-risk-data" span={10}>
                                  Puntaje
                                </Col>
                              </Row>
                            </div>
                            <div className="value">
                              <div className="authorization">
                                <div className="header">
                                  <Row>
                                    <Col className="system-risk-tags" span={9}>
                                      Persona
                                    </Col>
                                    <Col className="system-risk-data" span={5}>
                                      {itemCopy.nroAlertPerson}
                                    </Col>
                                    <Col className="system-risk-data" span={10}>
                                      {t(
                                        "messages.aml.risk." +
                                        itemCopy.personRisk
                                      )}
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col span={9}>Demográfico</Col>
                                    <Col className="system-risk-data" span={5}>
                                      {itemCopy.nroAlertDemo}
                                    </Col>
                                    <Col className="system-risk-data" span={10}>
                                      {t(
                                        "messages.aml.risk." + itemCopy.demoRisk
                                      )}
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col span={9}>Transaccional</Col>
                                    <Col className="system-risk-data" span={5}>
                                      {itemCopy.nroAlertTrans}
                                    </Col>
                                    <Col className="system-risk-data" span={10}>
                                      {t(
                                        "messages.aml.risk." + itemCopy.transRisk
                                      )}
                                    </Col>
                                  </Row>
                                </div>
                              </div>
                            </div>
                            <div className="authorization">
                              <div className="footer">
                                <Row>
                                  <Col span={14}>
                                    <small className="footer-tag">
                                      Riesgo Sistema Total
                                    </small>
                                  </Col>
                                  <Col span={10} className="footer-data">
                                    <small>
                                      {t(
                                        "messages.aml.risk." +
                                        itemCopy.riskSystem
                                      )}
                                    </small>
                                  </Col>
                                </Row>
                              </div>
                            </div>
                          </div>
                        </Col>
                      <Col
                        className={"col-travel"}
                        xs={24}
                      >
                        <div className="columns-title">Riesgo Asignado</div>
                        <ul className="bottom-2-items">
                          <li>
                            <div className="col-inner">
                              <div className="key">Selector de riesgo</div>
                              <div className="value" style={{ height: "auto" }}>
                                <Radio.Group
                                  defaultValue={itemCopy.riskAsignedInt}
                                  size="small"
                                  onChange={e => handleChangeField("riskAsignedInt",e.target.value) }
                                >
                                  <ul className="value-items">
                                    <li>
                                      <Radio value={3} /> Alto
                                    </li>
                                    <li>
                                      <Radio value={2} /> Medio
                                    </li>
                                    <li>
                                      <Radio value={1} /> Bajo
                                    </li>
                                    <li>
                                      <Radio value={0} /> No posee
                                    </li>
                                  </ul>
                                </Radio.Group>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="col-inner">
                              <div className="key">Comentarios</div>
                              <div className="value" style={{ height: 111 }}>
                                <textarea
                                  id="observations"
                                  value={itemCopy.comments}
                                  onChange={(e) =>
                                    handleChangeField("comments", e.target.value)
                                  }
                                ></textarea>
                              </div>
                            </div>
                          </li>
                        </ul>
                        <div className="columns-wrapper">
                          <Row gutter={{ xs: 8, sm: 16, md: 16, lg: 16 }}>
                            <Col xs={5} className="row-label">
                              Modificado por:
                            </Col>
                            <Col xs={7} className="output">
                              {itemCopy.userStatus !== null
                                ? itemCopy.userStatus
                                : "-"}
                            </Col>
                            <Col xs={5} className="row-label">
                              Fecha:
                            </Col>
                            <Col xs={7} className="output">
                              {itemCopy.dateStatus !== null
                                ? moment(itemCopy.dateStatus).format("DD/MM/YYYY")
                                : "-"}
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>

              <div className="box">
                <h2>Historial de Alertas​</h2>
                <div className="box-inner">
                  <Row>
                    <Col xs={24}>
                      <Table
                        onRow={handleOnRow}
                        pagination= {{pageSize: 5}}
                        className="table-data"
                        dataSource={historyTable}
                        columns={tableColumns}
                        size="small"
                      ></Table>
                    </Col>
                  </Row>
                </div>
              </div>

              <div className="bottom">
                <Button
                  className="bottom-button"
                  type="primary"
                  onClick={() => handleChangeModal(itemCopy)}
                  disabled={changesCounter === 0}
                >
                  Guardar
                </Button>
              </div>
            </>
          )}
        </>
      </Modal>
      { visibleAlertManager &&
  			<Modal
  				className="alert-manager"
  				visible={ true }
  				header={ null }
  				footer={ null }
  				onCancel={ closeModalAlertHandler }
  				style={{top: '50px'}}
  				bodyStyle={{padding: '0px 0px 0px 0px'}}
  				>
              {/*<AlertManagerPage
  					key={"alert-detail-" + clickedItem.id}
  					currentPage={0}
  					item={clickedItem} currentUser={currentUser}
  					closeOverlayAlerta={closeModalAlertHandler}
  					handlePrevItem={getHandlePrevItem()}
  					handleNextItem={getHandleNextItem()}/>*/}
  			</Modal>
  		}
    </>
  );
};

export default ModalViewMonitoreo;
