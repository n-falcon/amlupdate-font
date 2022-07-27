import "./ModalFiles.scss";
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
  Input,
} from "antd";
// import { getMatchesPromise, saveMitigatorPromise } from "./promises";
import moment from "moment";
import authImg from "./authorization.png";
import { camelizerHelper } from "../../../../../../helpers";
import { useTranslation } from "react-i18next";
import { ReportService } from '../../../../../../services'

const ModalFiles = ({
  currentUser,
  fakeModalOutput,
  modalHandler,
  item,
  puntaje,
  onCancel,
  onOk,
  type,
  comment,
  files,
  alertId,
  origin,
  userId
}) => {
  const { t } = useTranslation();
  const [itemData, setItemData] = useState({});
  const [isItemDataLoading, setIsItemDataLoading] = useState(false);
  const [isModalViewItemVisble, setIsModalViewItemVisible] = useState(false);
  const [isModalViewMatchVisble, setIsModalMatchItemVisible] = useState(false);
  const [clickedItem, setClickedItem] = useState({});
  const [formType, setFormType] = useState("");
  const [state, setState] = useState({
    mitigador: false,
    obsMitigador: "",
    obs: "",
  });
  // const handleGetMatches = async () => {
  //   const i = await getMatchesPromise(item.id);
  //   // setItemData(i.data);
  //   setItemData({ name: item.name, rut: item.rut });
  //   const { id, mitigador, obsMitigador, obs } = i.data;
  //   setState({ ...state, id, mitigador, obsMitigador, obs });
  //   setIsItemDataLoading(false);
  // };

  const [selectedRisk, setSelectedRisk] = useState(null);
  const [observations, setObservations] = useState("hola");
  const [authorized, setAuthorized] = useState(null);

  const handleObservationsChange = (e) => {
    setObservations(e.target.value);
  };

  const changeAuthorized = async (e) => {
    setAuthorized(e.target.value);
  };

  const handleRiskChange = (e) => {
    setSelectedRisk(e.target.value);
  };

  const handleChangeField = async (field, value) => {
    setState({ ...state, [field]: value });
  };


  const handleOnFile = async (path, fileName) =>{
    await ReportService.read('/transaction/portal/getFile', {alertId,path,origin,userId}, null, fileName)
  }

  const handleSubmit = async () => {
    // const { id, mitigador, obsMitigador, obs } = state;
    // const response = await saveMitigatorPromise({
    //   id,
    //   mitigador,
    //   obsMitigador,
    //   obs,
    // });

    // modalHandler({
    //   selectedRisk:selectedRisk,
    // 	comentarios:observations,
    // 	modificadoPor:currentUser.name,
    // 	fecha:moment().subtract(1, 'days').valueOf(),
    // })

    onCancel();
  };

  useEffect(() => {
    console.log(fakeModalOutput);
    // handleGetMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableColumns = [
    {
      title: "Tipo de Riesgo",
      dataIndex: "type",
      render: (text) => {
        if (text === "M") return "Investigación";
        return t("messages.aml.type." + text);
      },
    },
    {
      title: "Fecha de Inicio",
      dataIndex: "folio",
    },
    {
      title: "Puntaje",
      dataIndex: "risk",
      render: (text, record) => {
        if (record.type === "M") {
          if (record.status === "FINISHED") {
            return text === null
              ? t("messages.aml.risk.NA")
              : t("messages.aml.risk." + text);
          } else {
            return "-";
          }
        } else {
          if (record.status === "SENT") {
            return text === null
              ? t("messages.aml.risk.NA")
              : t("messages.aml.risk." + text);
          } else {
            return "-";
          }
        }
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        if (record.type === "M") {
          return t("messages.aml.cdi.status." + text);
        } else {
          if (text === "SENT") return "Completado";
          else return "Enviado";
        }
      },
    },
    {
      title: "Fecha Status",
      dataIndex: "folio",
    },
    {
      title: "Responsable",
      dataIndex: "folio",
    },

    {
      title: "Ver",
      render: (text, record) => (
        <Button
          style={{
            fontSize: "0.8em",
            backgroundColor: "rgba(0, 0, 0, .3) !important",
          }}
          icon="menu"
          size="small"
          type="primary"
          onClick={handleOnFicha(record)}
        >
          {" "}
          Ver Ficha
        </Button>
      ),
    },
  ];

  const handleModalCancel = () => {
    setIsModalViewItemVisible(false);
    setIsModalMatchItemVisible(false);
  };

  const handleModalOk = () => {
    setIsModalViewItemVisible(false);
    setIsModalMatchItemVisible(false);
  };

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

  const getFile = (file) => {
    let parts = file.split("/")
    let fileName = parts[parts.length-1]
    return (<a onClick = {e => handleOnFile(file, fileName)}>{fileName}</a>)
  }

  return (
    <Modal
      className="modal-files"
      footer={null}
      header={null}
      onCancel={onCancel}
      onOk={onOk}
      visible="true"
    >
        <div className="box">
          <h2>
            <span>Archivos</span>
          </h2>
          <div className="box-inner">
            <div>
              <Row>
                <Col>
                  <ul className="value">
                    {
                      files.map(file=>
                        <li>
                          { getFile(file)}
                        </li>
                      )
                    }
                  </ul>
                </Col>
              </Row>
            </div>
          </div>
        </div>
    </Modal>
  );
};

export default ModalFiles;
