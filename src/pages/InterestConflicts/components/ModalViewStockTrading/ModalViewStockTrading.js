import "./ModalViewStockTrading.scss";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
  Switch,
  Table,
  Checkbox,
} from "antd";
import { getMatchesPromise, saveMitigatorPromise } from "./promises";
import moment from "moment";
import apiConfig from "../../../../config/api";
import authImg from "./authorization.png";
import { camelizerHelper } from "../../../../helpers/";
import { useTranslation } from "react-i18next";
import { ModalViewItem, ModalViewMatch } from "../";
import { ModalPdfViewer } from '../';

const ModalViewStockTrading = ({ item, onCancel, onOk, type }) => {
  const { t } = useTranslation();
  const [isItemDataLoading, setIsItemDataLoading] = useState(true);
  const [isModalViewItemVisble, setIsModalViewItemVisible] = useState(false);
  const [isModalViewMatchVisble, setIsModalMatchItemVisible] = useState(false);
  const [clickedItem, setClickedItem] = useState({});
  const [formType, setFormType] = useState("");
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [observations, setObservations] = useState(null);
  const [authorized, setAuthorized] = useState(null);
  const [itemData, setItemData] = useState({});
  const [formId, setFormId] = useState(null);
  const [state, setState] = useState({
    mitigador: false,
    obsMitigador: "",
    obs: "",
  });
  const [fakeItemData, setfakeItemData] = useState({
    relation: "Operaciones Financieras",
  });

  const handleObservationsChange = (e) => {
    setObservations(e.target.value);
  };

  const changeAuthorized = async (e) => {
    setAuthorized(e.target.value);
  };

  const handleRiskChange = (e) => {
    setSelectedRisk(e.target.value);
  };

  const renderStatus = (text) => {
    switch (text) {
      case "NEW":
        return "Enviado";

      case "OPEN":
        return "Enviado";

      case "SAVED":
        return "Enviado";

      case "SENT":
        return "Completado";
    }
  };

  const handleGetMatches = async () => {
    const i = await getMatchesPromise(item.id);
    setItemData(i.data);
    const { id, mitigador, obsMitigador, obs } = i.data;
    setState({ ...state, id, mitigador, obsMitigador, obs });
    setIsItemDataLoading(false);
  };

  const handleChangeField = async (field, value) => {
    setState({ ...state, [field]: value });
  };

  const handleSubmit = async () => {
    const { id, mitigador, obsMitigador, obs } = state;
    const response = await saveMitigatorPromise({
      id,
      mitigador,
      obsMitigador,
      obs,
    });
    onCancel();
  };

  useEffect(() => {
    handleGetMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const tableColumns = [
  //   {
  //     title: "Tipo",
  //     dataIndex: "type",
  //     render: (text) => {
  //       if(text === 'M') return 'Investigación'
  //       return t("messages.aml.type." + text);
  //     },
  //   },
  //   {
  //     title: "Folio",
  //     dataIndex: "folio",
  //   },
  //   {
  //     title: "Estado",
  //     dataIndex: "status",
  //     render: (text, record) => {
  //       if(record.type === 'M') {
  //         return t('messages.aml.cdi.status.'+text)
  //       }else {
  //         if(text === 'SENT') return 'Completado'
  //         else return 'Enviado'
  //       }
  //     }
  //   },
  //   {
  //     title: "Vínculos",
  //     dataIndex: "hasPositives",
  //     render: (text, record) => {
  //       if(text === true) return 'Sí'
  //       else {
  //         if(record.type === 'M') {
  //           if(record.status === 'FINISHED') return 'No'
  //           else return '-'
  //         }else {
  //           if(record.type === 'CDI') {
  //             if(record.status === 'SENT') return 'No'
  //             else return '-'
  //           }else return 'N/A'
  //         }
  //       }
  //     }
  //   },
  //   {
  //     title: "Riesgo Asignado",
  //     dataIndex: "risk",
  //     render: (text, record) => {
  //       if(record.type === 'M') {
  //         if(record.status === 'FINISHED') {
  //           return text === null ? t("messages.aml.risk.NA"):t("messages.aml.risk." + text);
  //         }else {
  //           return '-'
  //         }
  //       }else {
  //         if(record.status === 'SENT') {
  //           return text === null ? t("messages.aml.risk.NA"):t("messages.aml.risk." + text);
  //         }else {
  //           return '-'
  //         }
  //       }
  //     },
  //   },
  //   {
  //     title: "Ver Documento",
  //     render: (text, record) =>
  //       record.status === "SENT" && (
  //         <Button
  //           style={{
  //             fontSize: "0.8em",
  //             backgroundColor: "rgba(0, 0, 0, .3) !important",
  //           }}
  //           icon="menu"
  //           size="small"
  //           type="primary"
  //         >
  //           {" "}
  //           <a
  //             style={{ color: "white", fonSize: "0.9em" }}
  //             href={apiConfig.url + "/cdi/pdfForm/" + record.id}
  //             target="_blank"
  //           >
  //             Ver formulario
  //           </a>
  //         </Button>
  //       ),
  //   },
  //   {
  // 		title: "Ver Ficha",
  // 		render: (text, record) =>
  // 			<Button
  // 				style={{
  // 					fontSize: "0.8em",
  // 					backgroundColor: "rgba(0, 0, 0, .3) !important",
  // 				}}
  // 				icon="menu"
  // 				size="small"
  // 				type="primary"
  // 				onClick = {handleOnFicha(record)}
  // 			>
  // 				{" "}
  // 				Ver Ficha
  // 			</Button>,
  //   }
  // ];

  const handleModalCancel = () => {
    setIsModalViewItemVisible(false);
    setIsModalMatchItemVisible(false);
  };

  const handleModalOk = () => {
    setIsModalViewItemVisible(false);
    setIsModalMatchItemVisible(false);
  };

  const onClickFormModal = (id) => {
    setFormId(id);
  }

  const handleFormModalCancel = () => {
    setFormId(null);
  }

  const handleOnFicha = (record) => {
    return () => {
      setClickedItem(record);
      if (record.type === "M") setIsModalMatchItemVisible(true);
      else {
        setFormType(record.type !== "CDI" ? record.type : type);
        setIsModalViewItemVisible(true);
      }
    };
  };

  return (
    <React.Fragment>
      <Modal
        className="modal-view-stock-trading"
        footer={null}
        header={null}
        onCancel={onCancel}
        onOk={onOk}
        visible="true"
      >
        
        {isItemDataLoading ? (
          <div className="spinner">
            <Spin spinning={true} size="big" />
          </div>
        ) : (
          <>
            <div className="box">
              <h2>
                <span>Detalle por Persona</span>
                {/* <span style = {{marginLeft:'750px'}}>Folio: {itemData.group.request.folio}</span> */}
              </h2>

              <div className="box-inner" style={{ padding: "10px 5px 0px" }}>
                <Row>
                  <Col span={12}>
                    <div className="col-inner">
                      <div className="key">Nombre</div>
                      <div className="value">{camelizerHelper(item.name)}</div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="col-inner">
                      <div className="key">Rut</div>
                      <div className="value">{item.rut}</div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <div className="col-inner">
                      <div className="key">Empresa</div>
                      <div className="value">
                        {camelizerHelper(item.company)}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="col-inner">
                      <div className="key">Area</div>
                      <div className="value">{camelizerHelper(item.area)}</div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <div className="col-inner">
                      <div className="key">Relación</div>
                      <div className="value">
                        {camelizerHelper(fakeItemData.relation)}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>

            <div className="box">
              <h2>Declaración</h2>
              {itemData.status === "SENT" && (
                <div className="download-report">
                  <Button icon="menu" size="small" type="primary" onClick={ onClickFormModal(item.id) }>
                      Ver formulario
                  </Button>
                </div>
              )}
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
                        {(type === "COLABORADOR" || type === "PROVEEDOR") && (
                          <>
                            <li>
                              <div className="col-inner">
                                <div className="key">Fecha de Recepción</div>
                                <div className="value">
                                  <span
                                    style={{
                                      fontStyle: "italic",
                                      color: "grey !important",
                                      fontWeight: "normal",
                                    }}
                                  >
                                    {itemData.status === "SENT"
                                      ? moment(itemData.sendDate).format(
                                          "DD/MM/YYYY"
                                        )
                                      : moment(itemData.sendDate).fromNow()}
                                  </span>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="col-inner">
                                <div className="key">Periodo</div>
                                <div className="value">-</div>
                              </div>
                            </li>
                            <li>
                              <div className="col-inner">
                                <div className="key">Nro. de Transacciones</div>
                                <div className="value"> - </div>
                              </div>
                            </li>
                            <li>
                              <div className="col-inner">
                                <div className="key">
                                  Recordatorios: Nro / Fecha
                                </div>
                                <div className="value">
                                  {itemData.nroReminders}
                                  {itemData.lastReminder !== null &&
                                    " - " +
                                      moment(itemData.lastReminder).format(
                                        "DD/MM/YYYY"
                                      )}
                                </div>
                              </div>
                            </li>
                          </>
                        )}
                      </ul>
                    </Col>
                  </Row>
                  <Row className="declaration-foot">
                    {type === "COLABORADOR" && (
                      <Col className="col-travel-extra">
                        <div className="col-inner">
                          <div className="key">Autorización</div>
                          <div className="value">
                            <div className="authorization">
                              <div className="header">
                                <Radio.Group
                                  defaultValue={authorized}
                                  size="small"
                                  onChange={changeAuthorized}
                                >
                                  <ul className="value-items">
                                    <li>
                                      <Radio value={true} /> Autorizado
                                    </li>
                                    <li>
                                      <Radio value={false} /> Rechazado
                                    </li>
                                  </ul>
                                </Radio.Group>
                              </div>
                              <div className="footer">
                                <small>Fecha</small>
                                <small>
                                  {itemData.autDate !== null
                                    ? moment(itemData.autDate).format(
                                        "DD/MM/YYYY"
                                      )
                                    : "-"}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    )}
                    <Col
                      className={type === "COLABORADOR" ? "col-travel" : ""}
                      xs={24}
                    >
                      <ul className="bottom-2-items">
                        <li>
                          <div className="col-inner">
                            <div className="key">Selector de riesgo</div>
                            <div className="value" style={{ height: "auto" }}>
                              {(itemData.status !== "SENT" ||
                                (itemData.recipient.request.type === "CDI" &&
                                  !itemData.hasPositives)) && (
                                <div className="block-risk"></div>
                              )}
                              <Radio.Group
                                defaultValue={selectedRisk}
                                size="small"
                                onChange={handleRiskChange}
                              >
                                <ul className="value-items">
                                  <li>
                                    <Radio value="HIGH" /> Alto
                                  </li>
                                  <li>
                                    <Radio value="MEDIUM" /> Medio
                                  </li>
                                  <li>
                                    <Radio value="LOW" /> Bajo
                                  </li>
                                  <li>
                                    <Radio value="N" /> No posee
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
                                value={observations}
                                onChange={handleObservationsChange}
                              ></textarea>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>

            {/* <div className="box">
              <h2>Declaraciones y Formularios​</h2>
              <div className="box-inner">
                <Row>
                  <Col xs={24}>
                    <Table
                      bordered
                      className="table-data"
                      pagination={false}
                      dataSource={itemData.records}
                      columns={tableColumns}
                      size="small"
                    ></Table>
                  </Col>
                </Row>
              </div>
            </div> */}

            <div className="bottom">
              <Button type="primary" onClick={handleSubmit}>
                Guardar
              </Button>
            </div>
            {isModalViewItemVisble && (
              <ModalViewItem
                item={clickedItem}
                onCancel={handleModalCancel}
                onOk={handleModalOk}
                type={formType}
              />
            )}
            {isModalViewMatchVisble && (
              <ModalViewMatch
                item={clickedItem}
                onCancel={handleModalCancel}
                onOk={handleModalOk}
                type={type}
              />
            )}
          </>
        )}
      </Modal>

      { formId && 
        <Modal
          className="modal-pdf-viewer"
          title = "Formulario"
          centered = { true }
          width = {1000}
          header={ null }
          footer= { [<Button key="back" onClick={ handleFormModalCancel }>Cerrar</Button>] }
          onCancel={ handleFormModalCancel }
          visible="true"
        ><ModalPdfViewer
          pdfId = { formId }
        />
        </Modal>
      }
    </React.Fragment>

    
  );
};

export default ModalViewStockTrading;
