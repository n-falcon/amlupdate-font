import "./ModalViewMonitoring.scss";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Modal,
  Row,
  Spin,
  Table,
  Checkbox,
} from "antd";
import { getMatchesPromise, saveMitigatorPromise } from "./promises";
import moment from "moment";
import { camelizerHelper } from "../../../../helpers/";
import { useTranslation } from "react-i18next";
import { ModalViewItem, ModalViewMatch } from "../";
import { ModalPdfViewer } from '../';

const ModalViewMonitoring = ({ item, onCancel, onOk, type, vinculos }) => {
  const { t } = useTranslation();
  const [itemData, setItemData] = useState({});
  const [isItemDataLoading, setIsItemDataLoading] = useState(true);
  const [isModalViewItemVisible, setIsModalViewItemVisible] = useState(false);
  const [isModalViewMatchVisble, setIsModalMatchItemVisible] = useState(false);
	const [clickedItem, setClickedItem] = useState({});
  const [formType,setFormType] = useState("");
  const [formId, setFormId] = useState(null);
  const [record, setRecord] = useState(null);
  const [state,setState]=useState({
    mitigador:false,
    obsMitigador:'',
    obs:'',
  });

  const handleGetMatches = async () => {
    const i = await getMatchesPromise(item.id);
    setItemData(i.data);
    const {id,mitigador,obsMitigador,obs}=i.data
    setState({...state,id,mitigador,obsMitigador,obs,})
    setIsItemDataLoading(false);
  };

  const handleChangeField = async (field,value) =>{
    setState({...state,[field]:value})
  }

  const handleSubmit = async ()=>{
    const {id,mitigador,obsMitigador,obs} = state
    const response = await saveMitigatorPromise({id, mitigador,obsMitigador,obs})
    onCancel();
  }

  const onCancelFormModal = () => {
    setFormId(null);
	}

	const onClickFormModal = (id) => {
    setFormId(id);
	}

  useEffect(() => {
    handleGetMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableColumns = [
    {
      title: "Tipo",
      dataIndex: "type",
      render: (text) => {
        if(text === 'M') return 'Investigación'
        return t("messages.aml.type." + text);
      },
    },
    {
      title: "Folio",
      dataIndex: "folio",
    },
    {
      title: "Estado",
      dataIndex: "status",
      render: (text, record) => {
        if(record.type === 'M') {
          return t('messages.aml.cdi.status.'+text)
        }else {
          if(text === 'SENT') return 'Completado'
          else return 'Enviado'
        }
      }
    },
    {
      title: "Vínculos",
      dataIndex: "hasPositives",
      render: (text, record) => {
        if(text === true) return 'Sí'
        else {
          if(record.type === 'M') {
            if(record.status === 'FINISHED') return 'No'
            else return '-'
          }else {
            if(record.type === 'CDI' || record.type === 'DIR' || record.type === 'PATR' || record.type === 'REL') {
              if(record.status === 'SENT') return 'No'
              else return '-'
            }else return 'N/A'
          }
        }
      }
    },
    {
      title: "Riesgo Asignado",
      dataIndex: "risk",
      render: (text, record) => {
        if(record.type === 'M') {
          if(record.status === 'FINISHED') {
            return text === null ? t("messages.aml.risk.NA"):t("messages.aml.risk." + text);
          }else {
            return '-'
          }
        }else {
          if(record.status === 'SENT') {
            return text === null ? t("messages.aml.risk.NA"):t("messages.aml.risk." + text);
          }else {
            return '-'
          }
        }
      },
    },
    {
      title: "Ver Documento",
      render: (text, record) =>
        record.status === "SENT" && (
          <Button
            style={{
              fontSize: "0.8em",
              backgroundColor: "rgba(0, 0, 0, .3) !important",
            }}
            icon="menu"
            size="small"
            type="primary"
            onClick= { ()=> onClickFormModal(record.id) }
          >
            {" "}

              Ver formulario
          </Button>
        ),
    },
    {
			title: "Ver Ficha",
			render: (text, record) =>
				<Button
					style={{
						fontSize: "0.8em",
						backgroundColor: "rgba(0, 0, 0, .3) !important",
					}}
					icon="menu"
					size="small"
					type="primary"
					onClick = {handleOnFicha(record)}
				>
					{" "}
					Ver Ficha
				</Button>,
    }
  ];

  const tableColumnsRelated = [
    {
      title: t("messages.aml.type"),
      dataIndex: "type",
      render: (text) => {
        return t("messages.aml." + text.toLowerCase());
      }
    },
    {
      title: t("messages.aml.name"),
      dataIndex: "nombre"
    },
    {
      title: t("messages.aml.rutNumber"),
      dataIndex: "rut"
    },
    {
      title: t("messages.aml.category"),
      dataIndex: "category",
      render: (text) => {
        return t("messages.aml.category." + text);
      }
    },
    {
      title: t("messages.aml.detail"),
      render: (rec) => {
        return <Button onClick={() => setRecord(rec)} icon="file"></Button>
      }
    }
  ];

  const handleModalCancel = () => {
    setIsModalViewItemVisible(false)
    setIsModalMatchItemVisible(false)
  };

  const handleModalOk = () => {
    setIsModalViewItemVisible(false)
    setIsModalMatchItemVisible(false)
  };

  const handleOnFicha = (record) => {
		return(
			()=>{
				setClickedItem(record);
        if(record.type === 'M') setIsModalMatchItemVisible(true)
        else {
          setFormType(record.type!=='CDI' && record.type!=='DIR' && record.type!=='PATR' && record.type!=='REL' ? record.type:type);
          setIsModalViewItemVisible(true);
        }
			}
		)
  };

  const handleModalCancelRecord = () => {
		setRecord(null)
	}


  return (
  <>
    <Modal
      className="modal-view-monitoring"
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
                      <div className="value">
                        {camelizerHelper(itemData.nombre)}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="col-inner">
                      <div className="key">Rut</div>
                      <div className="value">{itemData.rut}</div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <div className="col-inner">
                      <div className="key">Empresa</div>
                      <div className="value">
                        {camelizerHelper(itemData.company)}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="col-inner">
                      <div className="key">Area</div>
                      <div className="value">
                        {camelizerHelper(itemData.area)}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              { !vinculos &&
                <>
                  <div className="box-inner" style={{ padding: "10px 5px 0px" }}>
                    <Row>
                      <Col span={16}>
                        <div className="col-inner">
                          <div className="value">
                            Vínculos por persona (indica la existencia de a lo menos una relación identificada)
                          </div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className="col-inner">
                          <div className="value">
                            {itemData.hasPositives ? 'Sí':'No'}
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={16}>
                        <div className="col-inner">
                          <div className="value">
                            Riesgo asignado
                          </div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className="col-inner">
                          <div className="value">
                            {itemData.risk === null ? t("messages.aml.risk.NA"):t("messages.aml.risk."+ itemData.risk)}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div className="box-inner" style={{ padding: "10px 5px 0px" }}>
                    <Row>
                      <Col span={20}>
                        <div className="col-inner">
                          <div className="key">
                            <div style = {{display:"inline-block"}}>
                                <Checkbox id="mitigador" checked = {state.mitigador} onChange={({target})=>{handleChangeField(target.id,target.checked)}} value={state.mitigador} />
                            </div>
                            <div style = {{display:"inline-block", padding:"0px 10px"}}>
                              Mitigador
                            </div>
                          </div>
                          <div className="value" style={{ height: 67 }}>
                            <textarea disabled = {!state.mitigador} id="obsMitigador" style={{ height: 60 }} onChange={({target})=>handleChangeField(target.id,target.value)} value={state.obsMitigador} ></textarea>
                          </div>
                        </div>
                      </Col>
                      <Col span={4}>
                        <div className="col-inner">
                          <div className="key" style={{ height: 20 }} >Fecha</div>
                          <div className="value">{itemData.fecMitigador === null ? '-':moment(itemData.fecMitigador).format('DD/MM/YYYY')}</div>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={20}>
                        <div className="col-inner">
                          <div className="key" style={{ height: 20 }}>Observaciones</div>
                          <div className="value" style={{ height: 67 }}>
                            <textarea id="obs" style={{ height: 60 }} onChange={({target})=>handleChangeField(target.id,target.value)} value={state.obs}  ></textarea>
                          </div>
                        </div>
                      </Col>
                      <Col span={4}>
                        <div className="col-inner">
                          <div className="key" style={{ height: 20 }}>Fecha</div>
                          <div className="value">{itemData.fecObs === null ? '-':moment(itemData.fecObs).format('DD/MM/YYYY')}</div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </>
              }
            </div>

            <div className="box">
              <h2>Declaraciones y Formularios​</h2>
              <div className="box-inner">
                <Row>
                  <Col xs={24}>
                    <Table
                      bordered
                      className="table-data"
                      pagination={itemData.records && itemData.records.length > 10}
                      dataSource={itemData.records}
                      columns={tableColumns}
                      size="small"
                    ></Table>
                  </Col>
                </Row>
              </div>
            </div>
            { !vinculos && itemData.related && itemData.related.length > 0 &&
              <div className="box">
                <h2>Vínculos​</h2>
                <div className="box-inner">
                  <Row>
                    <Col>
                      <Table
                        bordered
                        className="table-data"
                        pagination={itemData.related && itemData.related.length > 10}
                        dataSource={itemData.related}
                        columns={tableColumnsRelated}
                        size="small"
                      ></Table>
                    </Col>
                  </Row>
                </div>
              </div>
            }

            { !vinculos &&
              <div className="bottom">
                <Button type="primary" onClick={handleSubmit} >Guardar</Button>
              </div>
            }
            { isModalViewItemVisible && <ModalViewItem item={ clickedItem } onCancel={ handleModalCancel } onOk={ handleModalOk } type={ formType } /> }
            { isModalViewMatchVisble && <ModalViewMatch item={ clickedItem } onCancel={ handleModalCancel } onOk={ handleModalOk } type={ type } /> }
          </>
        )}
    </Modal>

    {formId &&
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
    { record && 
      <ModalViewMonitoring item={ record } onCancel={ handleModalCancelRecord } type={ type } vinculos /> 
    }
  </>
  );
};

export default ModalViewMonitoring;
