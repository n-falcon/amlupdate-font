import "./formPepNatural.scss";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Spin,
  DatePicker,
  Select,
  notification,
  Radio,
  Table,
  Icon,
  Descriptions,
} from "antd";
import { FormLayout } from "../../../../layouts";
import { withRouter } from "react-router-dom";
import {
  getFormPromise,
  saveFormPromise,
  sendFormPromise,
} from "../../promises";
import moment from "moment";
import Logo from "./components/Logo/Logo";
import { validateRutHelper } from "../../../../helpers";

const FormPepNatural = ({ form, match }) => {
  const { t } = useTranslation();
  const { getFieldDecorator, getFieldsError, validateFields, setFields } = form;
  const [hasValidateMsg, setHasValidateMsg] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [colLogo, setColLogo] = useState(4);

  const [date, setDate] = useState(0);
  const dateFormat = "DD/MM/YYYY";
  const { Option } = Select;
  const { TextArea } = Input;
  const [userId, setUserId] = useState("");
  const [subclienteId, setSubclienteId] = useState("0");
  const [apiForm, setApiForm] = useState(null);
  const [format, setFormat] = useState("html");
  const [fakeApi, setFakeApi] = useState({
    hasTransaction: true,
    hasRel: true,
    hasPacto: true,
    transactions: [],
    rels: [],
    pactos: [],
    recipient: {
      record: {
        tipoPersona: "Tipo",
        categoria: "Categoria",
        nombre: "Nombre",
        rut: "15.461.462-6",
        correo: "harove@gmail.com",
        empresa: "SMU",
      },
    },
    pep: {},
  });
  const [transaction, setTransaction] = useState({
    transCargo: { key: "cargo", val: "", title: "Cargo" },
    transOrganismoPublico: {
      key: "organismoPublico",
      val: "",
      title: "Organismo Público",
    },
    transPais: { key: "pais", val: "", title: "Pais" },
    transPasaporte: {
      key: "pasaporte",
      val: "",
      title: "Si es extranjero indicar Nro. de pasaporte",
    },
    transFechaInicio: {
      key: "fechaInicio",
      val: "",
      title: "Fecha en que asumió el cargo: ",
    },
    transFechaTermino: {
      key: "fechaTermino",
      val: "",
      title: "Fecha de término del cargo (si aplica):",
    },
    transFuenteIngresos: {
      key: "fuenteIngresos",
      val: "",
      title: "Fuente de ingresos mensuales:",
    },
    transPromedioRecibido: {
      key: "promedioRecibido",
      val: "",
      title: "Monto promedio mensual recibido:",
    },
    transIsRepLegal: {
      key: "isRepLegal",
      val: "",
      title:
        "Actúa como representante legal o posee una participación mayor al 10% en una o más sociedades:",
    },
    transRutSociedad: {
      key: "rutSociedad",
      val: "",
      title: "Rut de la sociedad:",
    },
    transNombreSociedad: {
      key: "nombreSociedad",
      val: "",
      title: "Nombre de la Sociedad:",
    },

    transSocioRepresentante: {
      key: "socioRepresentante",
      val: "",
      title: " Es socio o representante legal:",
    },
  });

  const [rel, setRel] = useState({
    relNombre: { key: "nombre", val: "", title: "Nombre" },
    relRut: {
      key: "rut",
      val: "",
      title: "Rut",
    },
    relParentesco: { key: "parentesco", val: "", title: "Parentesco" },
    relPasaporte: {
      key: "pasaporte",
      val: "",
      title: "Si es extranjero indicar Nro. de pasaporte",
    },
    relPais: {
      key: "pais",
      val: "",
      title: "País en que realizó la función pública:",
    },
    relCargo: {
      key: "cargo",
      val: "",
      title: "Cargo:",
    },
    relOrganismoPublico: {
      key: "organismoPublico",
      val: "",
      title: "Organismo Público:",
    },
    relFechaInicio: {
      key: "fechaInicio",
      val: "",
      title: "Fecha en que asumió el cargo:",
    },
    relFechaTermino: {
      key: "fechaTermino",
      val: "",
      title: "Fecha de término del cargo (si aplica):",
    },
    relFuenteIngresos: {
      key: "fuenteIngresos",
      val: "",
      title: "Fuente de ingresos mensuales:",
    },
    relPromedioRecibido: {
      key: "promedioRecibido",
      val: "",
      title: "Monto promedio mensual recibido:",
    },
    relIsRepLegal: {
      key: "isRepLegal",
      val: "",
      title:
        "Actúa como representante legal o posee una participación mayor al 10% en una o más sociedades:",
    },
    relRutSociedad: {
      key: "rutSociedad",
      val: "",
      title: "Rut de la sociedad:",
    },
    relNombreSociedad: {
      key: "nombreSociedad",
      val: "",
      title: "Nombre de la Sociedad:",
    },

    relSocioRepresentante: {
      key: "socioRepresentante",
      val: "",
      title: " Es socio o representante legal:",
    },
  });

  const [pacto, setPacto] = useState({
    pactoNombre: { key: "nombre", val: "", title: "Nombre" },
    pactoRut: {
      key: "rut",
      val: "",
      title: "Rut",
    },
    pactoRelacion: { key: "relacion", val: "", title: "Relacion" },
    pactoPasaporte: {
      key: "pasaporte",
      val: "",
      title: "Si es extranjero indicar Nro. de pasaporte",
    },
    pactoPais: {
      key: "pais",
      val: "",
      title: "País en que realizó la función pública:",
    },
    pactoOrganismoPublico: {
      key: "organismoPublico",
      val: "",
      title: "Organismo Público:",
    },
    pactoCargo: {
      key: "cargo",
      val: "",
      title: "Cargo:",
    },
    pactoFechaInicio: {
      key: "fechaInicio",
      val: null,
      title: "Fecha en que asumió el cargo:",
    },
    pactoFechaTermino: {
      key: "fechaTermino",
      val: null,
      title: "Fecha de término del cargo (si aplica):",
    },
    pactoFuenteIngresos: {
      key: "fuenteIngresos",
      val: "",
      title: "Fuente de ingresos mensuales:",
    },
    pactoPromedioRecibido: {
      key: "promedioRecibido",
      val: "",
      title: "Monto promedio mensual recibido:",
    },
    pactoIsRepLegal: {
      key: "isRepLegal",
      val: "",
      title:
        "Actúa como representante legal o posee una participación mayor al 10% en una o más sociedades:",
    },
    pactoRutSociedad: {
      key: "rutSociedad",
      val: "",
      title: "Rut de la sociedad:",
    },
    pactoNombreSociedad: {
      key: "nombreSociedad",
      val: "",
      title: "Nombre de la Sociedad:",
    },
    pactoSocioRepresentante: {
      key: "socioRepresentante",
      val: "",
      title: " Es socio o representante legal:",
    },
  });

  let formToUpdate = {};

  const toDescriptionsPdf = (collection, stateObject) => (
    <>
      {collection.map((collectionObject, index) => (
        <>
          <div className="descriptions-pdf">
            <h4 className="descriptions-numeral">#{index + 1}</h4>
            <Descriptions title="" column={1} bordered size="small">
              {Object.keys(stateObject).map((key) => {
                return (
                  <Descriptions.Item label={stateObject[key].title}>
                    {collectionObject[stateObject[key].key]}
                  </Descriptions.Item>
                );
              })}
            </Descriptions>
          </div>
          <br />
        </>
      ))}
    </>
  );

  const transactionsColumns = [
    // {
    //   title: () => (
    //     <>
    //       <div>{transaction.transCargo.title}</div>
    //     </>
    //   ),
    //   dataIndex: "cargo",
    // },
    {
      title: () => (
        <>
          <div>{transaction.transOrganismoPublico.title}</div>
        </>
      ),
      dataIndex: "organismoPublico",
    },
    {
      title: () => (
        <>
          <div>{transaction.transPais.title}</div>
        </>
      ),
      dataIndex: "pais",
    },

    {
      title: () => (
        <>
          <div>{transaction.transFechaInicio.title}</div>
        </>
      ),
      dataIndex: "fechaInicio",
      render: (text, record) => {
        return (
          <>
            <div>
              {text !== null ? moment(parseInt(text)).format("DD-MM-YYYY") : ""}
            </div>
          </>
        );
      },
    },

    {
      title: () => (
        <>
          <div>Fecha de término del cargo</div>
        </>
      ),
      dataIndex: "fechaTermino",
      render: (text, record) => {
        return (
          <>
            <div>
              {text !== null ? moment(parseInt(text)).format("DD-MM-YYYY") : ""}
            </div>
          </>
        );
      },
    },

    {
      title: "Acción",
      dataIndex: "serie",
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (index) => (
        <a onClick={handleOnDeleteTransaction(index)}>
          <Icon type="delete"></Icon>
        </a>
      ),
    },
  ];

  const relsColumns = [
    {
      title: () => (
        <>
          <div>{rel.relNombre.title}</div>
        </>
      ),
      dataIndex: "nombre",
    },
    {
      title: () => (
        <>
          <div>{rel.relRut.title}</div>
        </>
      ),
      dataIndex: "rut",
    },
    {
      title: () => (
        <>
          <div>{rel.relParentesco.title}</div>
        </>
      ),
      dataIndex: "parentesco",
    },
    {
      title: () => (
        <>
          <div>{rel.relPais.title}</div>
        </>
      ),
      dataIndex: "pais",
    },
    {
      title: () => (
        <>
          <div>{rel.relOrganismoPublico.title}</div>
        </>
      ),
      dataIndex: "organismoPublico",
    },
    {
      title: () => (
        <>
          <div>{rel.relFechaInicio.title}</div>
        </>
      ),
      dataIndex: "fechaInicio",
      render: (text, record) => {
        return (
          <>
            <div>
              {text !== null ? moment(parseInt(text)).format("DD-MM-YYYY") : ""}
            </div>
          </>
        );
      },
    },
    {
      title: () => (
        <>
          <div>Fecha de término del cargo</div>
        </>
      ),
      dataIndex: "fechaTermino",
      render: (text, record) => {
        return (
          <>
            <div>
              {text !== null ? moment(parseInt(text)).format("DD-MM-YYYY") : ""}
            </div>
          </>
        );
      },
    },
    {
      title: "Acción",
      dataIndex: "serie",
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (index) => (
        <a onClick={handleOnDeleteRel(index)}>
          <Icon type="delete"></Icon>
        </a>
      ),
    },
  ];

  const pactosColumns = [
    {
      title: () => (
        <>
          <div>{pacto.pactoNombre.title}</div>
        </>
      ),
      dataIndex: "nombre",
    },
    {
      title: () => (
        <>
          <div>{pacto.pactoRut.title}</div>
        </>
      ),
      dataIndex: "rut",
    },
    {
      title: () => (
        <>
          <div>{pacto.pactoRelacion.title}</div>
        </>
      ),
      dataIndex: "relacion",
    },
    {
      title: () => (
        <>
          <div>{pacto.pactoPais.title}</div>
        </>
      ),
      dataIndex: "pais",
    },
    {
      title: () => (
        <>
          <div>{pacto.pactoOrganismoPublico.title}</div>
        </>
      ),
      dataIndex: "organismoPublico",
    },
    {
      title: () => (
        <>
          <div>{pacto.pactoFechaInicio.title}</div>
        </>
      ),
      dataIndex: "fechaInicio",
      render: (text, record) => {
        return (
          <>
            <div>
              {text !== null ? moment(parseInt(text)).format("DD-MM-YYYY") : ""}
            </div>
          </>
        );
      },
    },
    {
      title: () => (
        <>
          <div>{pacto.pactoFechaTermino.title}</div>
        </>
      ),
      dataIndex: "fechaTermino",
      render: (text, record) => {
        return (
          <>
            <div>
              {text !== null ? moment(parseInt(text)).format("DD-MM-YYYY") : ""}
            </div>
          </>
        );
      },
    },
    {
      title: "Acción",
      dataIndex: "serie",
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (index) => (
        <a onClick={handleOnDeletePacto(index)}>
          <Icon type="delete"></Icon>
        </a>
      ),
    },
  ];

  const handleOnDeleteTransaction = (index) => {
    return () => {
      const currentTransactions = fakeApi.transactions;
      currentTransactions.splice(index, 1);
      setFakeApi({ ...fakeApi, transactions: currentTransactions });
    };
  };

  const handleOnDeleteRel = (index) => {
    return () => {
      const currentRels = fakeApi.rels;
      currentRels.splice(index, 1);
      setFakeApi({ ...fakeApi, rels: currentRels });
    };
  };


  const handleOnDeletePacto = (index) => {
    return () => {
      const currentPactos = fakeApi.pactos;
      currentPactos.splice(index, 1);
      setFakeApi({ ...fakeApi, pactos: currentPactos });
    };
  };



  const handleOnChangeFieldIntro = (field, value) => {
    setFakeApi({
      ...fakeApi,
      recipient: {
        ...fakeApi["recipient"],
        record: { ...fakeApi["recipient"].record, [field]: value },
      },
    });
  };

  const handleOnChangeFieldTransactions = (field, value) => {
    // setMalla({ ...malla, [field]: value });
    const xxx = {
      ...transaction,
      [field]: { ...transaction[field], val: value },
    };
    setTransaction({
      ...transaction,
      [field]: { ...transaction[field], val: value },
    });
  };

  const handleOnChangeFieldRels = (field, value) => {
    // setMalla({ ...malla, [field]: value });
    const xxx = {
      ...rel,
      [field]: { ...rel[field], val: value },
    };
    setRel({
      ...rel,
      [field]: { ...rel[field], val: value },
    });
  };

  const handleOnChangeFieldPactos = (field, value) => {
    // setMalla({ ...malla, [field]: value });
    const xxx = {
      ...pacto,
      [field]: { ...pacto[field], val: value },
    };
    setPacto({
      ...pacto,
      [field]: { ...pacto[field], val: value },
    });
  };

  const handleOnAddRels = () => {
    // console.log(rel.relNombre.);
    setHasValidateMsg(true);

    validateFields(Object.keys(rel)).then((error, values) => {
      const relOk = Object.keys(rel).reduce((acc, e) => {
        return { ...acc, [rel[e].key]: rel[e].val };
      }, {});
      fakeApi.rels.push({ ...relOk });
      formToUpdate = { ...fakeApi, rels: fakeApi.rels };

      // saveFormCDItrabPromise(formToUpdate)
      //   .then((response) => {})
      //   .catch((error) => {});

      setFields(
        Object.keys(rel).reduce((acc, e) => {
          return { ...acc, [e]: { value: "" } };
        }, {})
      );

      //setApiForm(formToUpdate); //better call api and get last id
    });
  };

  const handleOnAddPactos = () => {
    // console.log(rel.relNombre.);
    setHasValidateMsg(true);

    validateFields(Object.keys(pacto)).then((error, values) => {
      const apiObjOk = Object.keys(pacto).reduce((acc, e) => {
        return { ...acc, [pacto[e].key]: pacto[e].val };
      }, {});
      fakeApi.pactos.push({ ...apiObjOk });
      formToUpdate = { ...fakeApi, pactos: fakeApi.pactos };

      // saveFormCDItrabPromise(formToUpdate)
      //   .then((response) => {})
      //   .catch((error) => {});

      setFields(
        Object.keys(pacto).reduce((acc, e) => {
          return { ...acc, [e]: { value: "" } };
        }, {})
      );

      //setApiForm(formToUpdate); //better call api and get last id
    });
  };

  const handleOnAddTransactions = () => {
    console.log(transaction.title);
    setHasValidateMsg(true);

    validateFields(Object.keys(transaction)).then((error, values) => {
      const transactionOk = Object.keys(transaction).reduce((acc, e) => {
        return { ...acc, [transaction[e].key]: transaction[e].val };
      }, {});
      fakeApi.transactions.push({ ...transactionOk });
      formToUpdate = { ...fakeApi, transactions: fakeApi.transactions };

      // saveFormCDItrabPromise(formToUpdate)
      //   .then((response) => {})
      //   .catch((error) => {});

      setFields(
        Object.keys(transaction).reduce((acc, e) => {
          return { ...acc, [e]: { value: "" } };
        }, {})
      );

      //setApiForm(formToUpdate); //better call api and get last id
    });
  };

  const seed = () => {
    const transactionOk = Object.keys(transaction)
      .filter(
        (str) => str !== "transFechaInicio" && str !== "transFechaTermino"
      )
      .reduce((acc, e) => {
        return { ...acc, [transaction[e].key]: "fake" };
      }, {});

    const relOk = Object.keys(rel)
      .filter((str) => str !== "relFechaInicio" && str !== "relFechaTermino")
      .reduce((acc, e) => {
        return { ...acc, [rel[e].key]: "fake" };
      }, {});

      const pactoOk = Object.keys(pacto)
      .filter((str) => str !== "pactoFechaInicio" && str !== "pactoFechaTermino")
      .reduce((acc, e) => {
        return { ...acc, [pacto[e].key]: "fake" };
      }, {});


    transactionOk["fechaInicio"] = "1592278439000";
    transactionOk["fechaTermino"] = "1592278439000";
    transactionOk["pais"] = "Argentina";
    transactionOk["organismoPublico"] = "Congreso Nacional";
    fakeApi.transactions.push(transactionOk);
    fakeApi.transactions.push(transactionOk);
    fakeApi.transactions.push(transactionOk);
    fakeApi.transactions.push(transactionOk);
    relOk["fechaInicio"] = "1592278439000";
    relOk["fechaTermino"] = "1592278439000";
    relOk["pais"] = "Argentina";
    fakeApi.rels.push(relOk);
    fakeApi.rels.push(relOk);
    fakeApi.rels.push(relOk);
    fakeApi.rels.push(relOk);
    pactoOk["fechaInicio"] = "1592278439000";
    pactoOk["fechaTermino"] = "1592278439000";
    pactoOk["pais"] = "Argentina";
    fakeApi.pactos.push(pactoOk);
    fakeApi.pactos.push(pactoOk);
    fakeApi.pactos.push(pactoOk);
    fakeApi.pactos.push(pactoOk);





  };

  useEffect(() => {
    setDate(moment().format("DD-MM-YYYY"));
    setIsloading(true);

    seed();

    getFormPromise(match.params.id).then((response) => {
      if (
        response.data !== null &&
        response.data !== "" &&
        response.data.status !== undefined
      ) {
        setApiForm(response.data);

        setUserId(response.data.recipient.request.createUser.id);
        if (response.data.recipient.record.subcliente !== null) {
          setSubclienteId(response.data.recipient.record.subcliente.id);
        }
      }
      setIsloading(false);
      if (match.params.view === "pdf") {
        setColLogo(5);
        setFormat("pdf");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hancleOnChangeRadioButton = (field, value) => {
    setFakeApi({ ...fakeApi, [field]: value });
    // saveFormCDItrabPromise({
    //   ...apiForm,
    //   [field]: value,
    // }).then((response) => {});
  };

  function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some((field) => fieldsError[field]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setHasValidateMsg(true);
    validateFields(["trabRelationship", "hasTransaction"]);
    if (hasErrors(getFieldsError())) {
      notification["warning"]({
        message: t("messages.aml.missingRequiredField"),
      });
    } else {
      // sendFormPromise(match.params.id).then((response) => {
      //   if (response.data === "OK") {
      //     let formSend = { ...apiForm, status: "SENT" };
      //     setApiForm(formSend);
      //   } else {
      //     notification["error"]({
      //       message: t("messages.aml.notifications.anErrorOcurred"),
      //     });
      //   }
      // });
    }
  };

  const renderFormItem = (formItem) => {
    return (
      <Col
        className={formItem.colClassName}
        span={formItem.wrapperCols}
        offset={formItem.offset}
      >
        <Form.Item
          className={formItem.itemClassName}
          label={formItem.label}
          labelCol={formItem.labelCol > 0 ? { span: formItem.labelCol } : {}}
          wrapperCol={
            formItem.labelCol > 0 ? { span: formItem.wrapperCol } : {}
          }
        >
          {getFieldDecorator(formItem.id, {
            rules: formItem.rules,
            initialValue: formItem.initialValue,
            validateTrigger: "onSubmit",
          })(formItem.item)}
        </Form.Item>
      </Col>
    );
  };

  return (
    <div className="form-pep-natural">
      <FormLayout
        currentUser={{ userId, subclienteId }}
        view={match.params.view === undefined ? "html" : match.params.view}
      >
        <div style={{ position: "relative" }}>
          {isLoading ? (
            <div className="form-header">
              <Row>
                <Col xs={9}></Col>
                <Col xs={6}>
                  <div className="form-wrapper" style={{ textAlign: "center" }}>
                    <Spin style={{ fontColor: "#fff" }} size={"large"} />
                  </div>
                </Col>
                <Col xs={9}></Col>
              </Row>
            </div>
          ) : (
            <>
              {apiForm !== null ? (
                <div
                  className={
                    "form-content" +
                    (!hasValidateMsg ? " form-validate-messages" : "")
                  }
                >
                  <Row>
                    <Col>
                      <Form onSubmit={handleSubmit} className="form-form">
                        <Row
                          className="title-logo"
                          gutter={[0, 6]}
                          style={{
                            backgroundColor: "rgba(255,255,255,0.9)",
                            marginTop: "0px",
                            marginBottom: "0px",
                            textAlign: "left",
                            paddingTop: "10px",
                            paddingLeft: "10px",
                          }}
                        >
                          <Col
                            xs={24 - colLogo}
                            sm={24 - colLogo}
                            md={24 - colLogo}
                            lg={24 - colLogo}
                            xl={24 - colLogo}
                          >
                            {format === "html" ? (
                              <h3>
                                Declaración de vínculo con Personas Expuestas
                                Políticamente (PEP) – Personas Naturales
                              </h3>
                            ) : (
                              <h4>
                                Declaración de vínculo con Personas Expuestas
                                Políticamente (PEP) – Personas Naturales
                              </h4>
                            )}
                          </Col>
                          <Col
                            className="logo-col"
                            xs={colLogo}
                            sm={colLogo}
                            md={colLogo}
                            lg={colLogo}
                            xl={colLogo}
                          >
                            <Logo currentUser={{ userId, subclienteId }} />
                          </Col>
                        </Row>

                        <Row
                          className="date"
                          gutter={[0, 6]}
                          style={{
                            backgroundColor: "rgba(255,255,255,0.9)",
                            marginTop: "0px",
                            marginBottom: "0px",
                            textAlign: "left",
                            paddingBottom: "15px",
                            paddingLeft: "10px",
                          }}
                        >
                          <Col span={2} style={{ textAlign: "left" }}>
                            Fecha:
                          </Col>
                          <Col span={4}>
                            <div
                              className="formDate"
                              style={{
                                marginLeft: "5px",
                                borderStyle: "solid",
                                borderWidth: "1px",
                                borderColor: "#e8e8e8",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              {date}
                            </div>
                          </Col>
                          <Col span={13} style={{ textAlign: "right" }}>
                            Folio:
                          </Col>
                          <Col span={5}>
                            <div
                              className="formDate"
                              style={{
                                borderStyle: "solid",
                                borderWidth: "1px",
                                borderColor: "#e8e8e8",
                                display: "flex",
                                justifyContent: "center",
                                marginRight: "10px",
                                marginLeft: "8px",
                              }}
                            >
                              {apiForm.folio !== null ? apiForm.folio : ""}
                            </div>
                          </Col>
                        </Row>

                        {apiForm.status === "SENT" && format === "html" ? (
                          <>
                            <br />
                            <h3 style={{ textAlign: "center" }}>
                              Estimado(a){" "}
                              <strong>{apiForm.recipient.record.nombre}</strong>
                              , le informamos que su declaración fue
                              correctamente completada, agradecemos su tiempo y
                              disposición.
                              <br />
                              <br />
                              Hemos enviado una copia de la declaración
                              realizada al mail registrado:{" "}
                              <strong>{apiForm.recipient.record.email}</strong>
                            </h3>
                          </>
                        ) : (
                          <>
                            <Row
                              className="subheader"
                              style={{
                                marginTop: "0px",
                              }}
                            >
                              <Col xl={24}>Datos personales</Col>
                            </Row>

                            <Row className="content">
                              <Row className="fields-row" gutter={[16, 8]}>
                                {renderFormItem({
                                  label: "Tipo de Persona",
                                  id: "personalesTipoPersona",
                                  initialValue:
                                    fakeApi.recipient.record.tipoPersona,
                                  colClassName: "topLabel item-field",
                                  labelCol: 0,
                                  wrapperCol: 0,
                                  rules: [{}],
                                  wrapperCols: 12,
                                  item: (
                                    <Input
                                      className="Input-field"
                                      disabled={true}
                                    />
                                  ),
                                })}

                                {renderFormItem({
                                  label: "Categoría",
                                  id: "categoría",
                                  initialValue:
                                    fakeApi.recipient.record.categoria,
                                  colClassName: "topLabel item-field",
                                  labelCol: 0,
                                  wrapperCol: 0,
                                  rules: [{}],
                                  wrapperCols: 12,
                                  item: (
                                    <Input
                                      className="Input-field"
                                      disabled={true}
                                    />
                                  ),
                                })}
                              </Row>

                              <Row className="fields-row" gutter={[16, 8]}>
                                {renderFormItem({
                                  label: "Nombre",
                                  id: "nombre",
                                  initialValue: apiForm.recipient.record.nombre,
                                  colClassName: "topLabel item-field",
                                  labelCol: 0,
                                  wrapperCol: 0,
                                  rules: [{}],
                                  wrapperCols: 12,
                                  item: (
                                    <Input
                                      className="Input-field"
                                      disabled={true}
                                    />
                                  ),
                                })}

                                {renderFormItem({
                                  label: "Rut",
                                  id: "rut",
                                  initialValue: apiForm.recipient.record.rut,
                                  colClassName: "topLabel",
                                  labelCol: 0,
                                  wrapperCol: 0,
                                  rules: [{}],
                                  wrapperCols: 12,
                                  item: <Input disabled={true} />,
                                })}
                              </Row>

                              <Row className="fields-row" gutter={[16, 8]}>
                                {renderFormItem({
                                  label: "Correo",
                                  id: "correo",
                                  initialValue: fakeApi.recipient.record.correo,
                                  colClassName: "topLabel item-field",
                                  labelCol: 0,
                                  wrapperCol: 0,
                                  rules: [{}],
                                  wrapperCols: 12,
                                  item: (
                                    <Input
                                      className="Input-field"
                                      disabled={true}
                                    />
                                  ),
                                })}
                              </Row>
                            </Row>

                            <Row
                              className="lineamiento subheader"
                              style={{ marginTop: "0px" }}
                            >
                              <Col xl={24}>Introducción</Col>
                            </Row>

                            <Row className="summary">
                              <Col xl={24}>
                                La Circular N° 49 de la Unidad de Análisis
                                Financiero, del 3 de diciembre de 2012, define
                                como Personas Expuestas Políticamente (PEP) a
                                “los chilenos o extranjeros que desempeñan o
                                hayan desempeñado funciones públicas destacadas
                                en un país, hasta a lo menos un año de
                                finalizado el ejercicio de las mismas”. <br />
                                <br />
                                Se incluyen en esta categoría a jefes de Estado
                                o de un Gobierno, políticos de alta jerarquía,
                                funcionarios gubernamentales, judiciales o
                                militares de alta jerarquía, altos ejecutivos de
                                empresas estatales, así como sus cónyuges, sus
                                parientes hasta el segundo grado de
                                consanguinidad, y las personas naturales con las
                                que hayan celebrado un pacto de actuación
                                conjunta, mediante el cual tengan poder de voto
                                suficiente para influir en sociedades
                                constituidas en Chile. <br />
                                <br />
                                En este contexto la{" "}
                                <strong>
                                  {fakeApi.recipient.record.empresa}
                                </strong>{" "}
                                ha implementado medidas de debida diligencia con
                                el objetivo de determinar si es o no un PEP.{" "}
                                <br />
                                <br />
                                Por tal motivo solicitamos responder a las
                                siguientes secciones:
                              </Col>
                            </Row>

                            <Row className="subheader">
                              <Col xl={24}>SECCIÓN I</Col>
                            </Row>

                            <Row className="summary">
                              <Col span={21}>
                                Desempeña o se ha desempeñado en el último año{" "}
                                <strong>funciones públicas destacadas</strong>,
                                en Chile o en el extranjero.
                              </Col>

                              {renderFormItem({
                                label: "",
                                id: "hasTransaction",
                                initialValue:
                                  fakeApi.hasTransaction !== null
                                    ? fakeApi.hasTransaction
                                    : null,
                                colClassName: "switch-col",
                                itemClassName: "radio-item",
                                labelCol: 0,
                                wrapperCol: 0,
                                offset: 0,
                                rules: [
                                  {
                                    required: true,
                                    message: t("messages.aml.dontForgetSelect"),
                                  },
                                ],
                                wrapperCols: 3,
                                item: (
                                  <Radio.Group
                                    onChange={({ target }) =>
                                      hancleOnChangeRadioButton(
                                        "hasTransaction",
                                        target.value
                                      )
                                    }
                                  >
                                    <Radio
                                      className="radio-switch"
                                      value={true}
                                    >
                                      Sí
                                    </Radio>
                                    <Radio
                                      className="radio-switch"
                                      value={false}
                                    >
                                      No
                                    </Radio>
                                  </Radio.Group>
                                ),
                              })}
                            </Row>

                            {fakeApi.hasTransaction !== null &&
                              fakeApi.hasTransaction && (
                                <>
                                  <Row className="summary">
                                    <Col span={21}>
                                      A continuación, complete la siguiente
                                      información:
                                    </Col>
                                  </Row>

                                  <Row className="content">
                                    {format === "html" && (
                                      <>
                                        <Row
                                          className="fields-row"
                                          gutter={[16, 8]}
                                        >
                                          {renderFormItem({
                                            label: "Cargo",
                                            id: "transCargo",
                                            initialValue:
                                              fakeApi.transactions !== null
                                                ? transaction.transCargo.val
                                                : null,
                                            colClassName: "topLabel",
                                            labelCol: 0,
                                            wrapperCol: 0,
                                            rules: [
                                              {
                                                required: true,
                                                message: t(
                                                  "messages.aml.dontForgetParentesco"
                                                ),
                                              },
                                            ],
                                            wrapperCols: 24,
                                            item:
                                              format === "html" ? (
                                                <Select
                                                  onChange={(value) =>
                                                    handleOnChangeFieldTransactions(
                                                      "transCargo",
                                                      value
                                                    )
                                                  }
                                                >
                                                  <Select.Option key="1"></Select.Option>
                                                  <Select.Option
                                                    key="2"
                                                    value="Presidente de la República."
                                                  >
                                                    Presidente de la República.
                                                  </Select.Option>
                                                  <Select.Option
                                                    key="3"
                                                    value="Senadores, diputados y alcaldes."
                                                  >
                                                    Senadores, diputados y
                                                    alcaldes.
                                                  </Select.Option>
                                                  <Select.Option
                                                    key="4"
                                                    value="Ministros de la Corte Suprema y Cortes de Apelaciones. "
                                                  >
                                                    Ministros de la Corte
                                                    Suprema y Cortes de
                                                    Apelaciones.
                                                  </Select.Option>
                                                  <Select.Option
                                                    key="5"
                                                    value="Ministros de Estado, subsecretarios, intendentes, gobernadores, 
                                                  secretarios regionales ministeriales, embajadores, jefes superiores de Servicio, 
                                                  tanto centralizados como descentralizados, y el directivo superior inmediato 
                                                  que deba subrogar a cada uno de ellos. "
                                                  >
                                                    Ministros de Estado,
                                                    subsecretarios, intendentes,
                                                    gobernadores, secretarios
                                                    regionales ministeriales,
                                                    embajadores, jefes
                                                    superiores de Servicio,
                                                    tanto centralizados <br />{" "}
                                                    como descentralizados, y el
                                                    directivo superior inmediato
                                                    que deba subrogar a cada uno
                                                    de ellos.
                                                  </Select.Option>
                                                  <Select.Option
                                                    key="6"
                                                    value="Comandantes en Jefe de las Fuerzas Armadas, director General de 
                                                  Carabineros, director General de Investigaciones, y el oficial superior 
                                                  inmediato que deba subrogar a cada uno de ellos. "
                                                  >
                                                    Comandantes en Jefe de las
                                                    Fuerzas Armadas, director
                                                    General de Carabineros,
                                                    director General de
                                                    Investigaciones, y el
                                                    oficial superior inmediato
                                                    que deba subrogar <br /> a
                                                    cada uno de ellos.
                                                  </Select.Option>
                                                  <Select.Option
                                                    key="7"
                                                    value="Fiscal Nacional del Ministerio Público y fiscales regionales. "
                                                  >
                                                    Fiscal Nacional del
                                                    Ministerio Público y
                                                    fiscales regionales.
                                                  </Select.Option>
                                                  <Select.Option
                                                    key="7"
                                                    value="Contralor General de la República."
                                                  >
                                                    Contralor General de la
                                                    República.
                                                  </Select.Option>
                                                  <Select.Option
                                                    key="7"
                                                    value="Consejeros del Banco Central de Chile."
                                                  >
                                                    Consejeros del Banco Central
                                                    de Chile.
                                                  </Select.Option>
                                                  <Select.Option
                                                    key="7"
                                                    value="Consejeros del Consejo de Defensa del Estado"
                                                  >
                                                    Consejeros del Consejo de
                                                    Defensa del Estado
                                                  </Select.Option>
                                                  <Select.Option
                                                    key="7"
                                                    value="Ministros del Tribunal Constitucional. "
                                                  >
                                                    Ministros del Tribunal
                                                    Constitucional.
                                                  </Select.Option>
                                                  <Select.Option
                                                    key="7"
                                                    value="Ministros del Tribunal de la Libre Competencia."
                                                  >
                                                    Ministros del Tribunal de la
                                                    Libre Competencia.
                                                  </Select.Option>
                                                  <Select.Option
                                                    key="7"
                                                    value="Integrantes titulares y suplentes del Tribunal de Contratación Pública. "
                                                  >
                                                    Integrantes titulares y
                                                    suplentes del Tribunal de
                                                    Contratación Pública.
                                                  </Select.Option>
                                                  <Select.Option
                                                    key="7"
                                                    value="Consejeros del Consejo de Alta Dirección Pública."
                                                  >
                                                    Consejeros del Consejo de
                                                    Alta Dirección Pública.
                                                  </Select.Option>
                                                  <Select.Option
                                                    key="7"
                                                    value="Directores y ejecutivos principales de empresas públicas, según lo definido por la Ley Nº 18.045. "
                                                  >
                                                    Directores y ejecutivos
                                                    principales de empresas
                                                    públicas, según lo definido
                                                    por la Ley Nº 18.045.
                                                  </Select.Option>
                                                  <Select.Option
                                                    key="7"
                                                    value="Directores de sociedades anónimas nombrados por el Estado o sus organismos. "
                                                  >
                                                    Directores de sociedades
                                                    anónimas nombrados por el
                                                    Estado o sus organismos.
                                                  </Select.Option>
                                                  <Select.Option
                                                    key="7"
                                                    value="Consejeros del Consejo de Alta Dirección Pública."
                                                  >
                                                    Miembros de las directivas
                                                    de los partidos políticos.
                                                  </Select.Option>
                                                </Select>
                                              ) : (
                                                <Input />
                                              ),
                                          })}
                                        </Row>

                                        <Row
                                          className="fields-row"
                                          gutter={[16, 8]}
                                        >
                                          {renderFormItem({
                                            label: "Organismo público",
                                            id: "transOrganismoPublico",
                                            initialValue:
                                              fakeApi.transaction !== null
                                                ? transaction
                                                    .transOrganismoPublico.val
                                                : null,
                                            colClassName: "topLabel",
                                            labelCol: 0,
                                            wrapperCol: 0,
                                            rules: [
                                              {
                                                required: true,
                                                message: t(
                                                  "messages.aml.requestedField"
                                                ),
                                              },
                                            ],
                                            wrapperCols: 8,
                                            item: (
                                              <Input
                                                onChange={(e) =>
                                                  handleOnChangeFieldTransactions(
                                                    e.target.id,
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            ),
                                          })}

                                          {renderFormItem({
                                            label:
                                              "Si es extranjero indicar Nro. de pasaporte:",
                                            id: "transPasaporte",
                                            initialValue:
                                              fakeApi.transaction !== null
                                                ? transaction.transPasaporte.val
                                                : null,
                                            colClassName: "topLabel",
                                            labelCol: 0,
                                            wrapperCol: 0,
                                            rules: [{}],
                                            wrapperCols: 8,
                                            item: (
                                              <Input
                                                onChange={(e) =>
                                                  handleOnChangeFieldTransactions(
                                                    e.target.id,
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            ),
                                          })}

                                          {renderFormItem({
                                            label:
                                              "País en que realizó la función pública:",
                                            id: "transPais",
                                            initialValue:
                                              fakeApi.transactions !== null
                                                ? transaction.transPais.val
                                                : null,
                                            colClassName: "topLabel",
                                            labelCol: 0,
                                            wrapperCol: 0,
                                            rules: [
                                              {
                                                required: true,
                                                message: t("messages.aml.dontForgetSelect"),
                                              },
                                            ],
                                            wrapperCols: 8,
                                            item:
                                              format === "html" ? (
                                                <Select
                                                  onChange={(value) =>
                                                    handleOnChangeFieldTransactions(
                                                      "transPais",
                                                      value
                                                    )
                                                  }
                                                >
                                                  <Select.Option key="1"></Select.Option>
                                                  <Select.Option
                                                    key="2"
                                                    value="Chile"
                                                  >
                                                    Chile
                                                  </Select.Option>
                                                  <Select.Option
                                                    key="3"
                                                    value="Colombia"
                                                  >
                                                    Colombia
                                                  </Select.Option>
                                                </Select>
                                              ) : (
                                                <Input />
                                              ),
                                          })}
                                        </Row>

                                        <Row
                                          className="fields-row"
                                          gutter={[16, 8]}
                                        >
                                          {renderFormItem({
                                            label:
                                              transaction.transFechaInicio
                                                .title,
                                            id: "transFechaInicio",
                                            initialValue:
                                              transaction.transFechaInicio
                                                .val !== null &&
                                              transaction.transFechaInicio
                                                .val !== ""
                                                ? "hola"
                                                : null,
                                            colClassName: "topLabel",
                                            labelCol: 0,
                                            wrapperCol: 0,
                                            rules: [
                                              {
                                                required: true,
                                                message: t(
                                                  "messages.aml.requestedField"
                                                ),
                                              },
                                            ],
                                            wrapperCols: 8,
                                            item:
                                              format === "html" ? (
                                                <DatePicker
                                                  style={{ width: 225 }}
                                                  format={dateFormat}
                                                  placeholder="Ingrese la fecha"
                                                  onChange={(momentObj) =>
                                                    handleOnChangeFieldTransactions(
                                                      "transFechaInicio",
                                                      momentObj !== null
                                                        ? momentObj.valueOf()
                                                        : null
                                                    )
                                                  }
                                                />
                                              ) : (
                                                <Input />
                                              ),
                                          })}

                                          {renderFormItem({
                                            label:
                                              transaction.transFechaTermino
                                                .title,
                                            id: "fechaTermino",
                                            initialValue:
                                              transaction.transFechaTermino
                                                .val !== null &&
                                              transaction.transFechaTermino
                                                .val !== ""
                                                ? moment(
                                                    transaction
                                                      .transFechaTermino.val
                                                  )
                                                : null,
                                            colClassName: "topLabel",
                                            labelCol: 0,
                                            wrapperCol: 0,

                                            rules: [],
                                            wrapperCols: 5,
                                            item:
                                              format === "html" ? (
                                                <DatePicker
                                                  className="my-calendar"
                                                  style={{ width: 225 }}
                                                  format={dateFormat}
                                                  placeholder="Ingrese la fecha"
                                                  onChange={(momentObj) =>
                                                    handleOnChangeFieldTransactions(
                                                      "transFechaTermino",
                                                      momentObj !== null
                                                        ? momentObj.valueOf()
                                                        : null
                                                    )
                                                  }
                                                />
                                              ) : (
                                                <Input />
                                              ),
                                          })}
                                        </Row>

                                        <Row
                                          className="fields-row"
                                          gutter={[16, 8]}
                                        >
                                          {renderFormItem({
                                            label:
                                              transaction.transFuenteIngresos
                                                .title,
                                            id: "transFuenteIngresos",
                                            initialValue:
                                              fakeApi.transaction !== null
                                                ? transaction
                                                    .transFuenteIngresos.val
                                                : null,
                                            colClassName: "topLabel",
                                            labelCol: 0,
                                            wrapperCol: 0,
                                 
                                            wrapperCols: 5,
                                            item: (
                                              <Input
                                                onChange={(e) =>
                                                  handleOnChangeFieldTransactions(
                                                    e.target.id,
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            ),
                                          })}

                                          {renderFormItem({
                                            label:
                                              transaction.transPromedioRecibido
                                                .title,
                                            id: "transPromedioRecibido",
                                            initialValue:
                                              fakeApi.transaction !== null
                                                ? transaction
                                                    .transPromedioRecibido.val
                                                : null,
                                            colClassName: "topLabel",
                                            labelCol: 0,
                                            wrapperCol: 0,
                                            rules: [{}],
                                            wrapperCols: 5,
                                            item: (
                                              <Input
                                                onChange={(e) =>
                                                  handleOnChangeFieldTransactions(
                                                    e.target.id,
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            ),
                                          })}

                                          {renderFormItem({
                                            label:
                                              transaction.transIsRepLegal.title,
                                            id: "transIsRepLegal",
                                            initialValue:
                                              fakeApi.transactions !== null
                                                ? transaction.transIsRepLegal
                                                    .val
                                                : null,
                                            colClassName: "topLabel",
                                            labelCol: 0,
                                            wrapperCol: 0,
                                            rules: [
                                              {
                                                required: true,
                                                message: t("messages.aml.dontForgetSelect"),
                                              },
                                            ],
                                            wrapperCols: 14,
                                            item:
                                              format === "html" ? (
                                                <Select
                                                  onChange={(value) =>
                                                    handleOnChangeFieldTransactions(
                                                      "transIsRepLegal",
                                                      value
                                                    )
                                                  }
                                                >
                                                  <Select.Option key="1"></Select.Option>
                                                  <Select.Option
                                                    key="2"
                                                    value={true}
                                                  >
                                                    Si
                                                  </Select.Option>
                                                  <Select.Option
                                                    key="3"
                                                    value={false}
                                                  >
                                                    No
                                                  </Select.Option>
                                                </Select>
                                              ) : (
                                                <Input />
                                              ),
                                          })}
                                        </Row>

                                        {transaction.transIsRepLegal.val && (
                                          <Row
                                            className="fields-row"
                                            gutter={[16, 8]}
                                          >
                                            {renderFormItem({
                                              label:
                                                transaction.transRutSociedad
                                                  .title,
                                              id: "transRutSociedad",
                                              initialValue:
                                                fakeApi.transaction !== null
                                                  ? transaction.transRutSociedad
                                                      .val
                                                  : null,
                                              colClassName: "topLabel",
                                              labelCol: 0,
                                              wrapperCol: 0,
                                              rules: [
                                                {
                                                  required: true,
                                                  message: t(
                                                    "messages.aml.requestedField"
                                                  ),
                                                },
                                              ],
                                              wrapperCols: 5,
                                              item: (
                                                <Input
                                                  onChange={(e) =>
                                                    handleOnChangeFieldTransactions(
                                                      e.target.id,
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                              ),
                                            })}

                                            {renderFormItem({
                                              label:
                                                transaction.transNombreSociedad
                                                  .title,
                                              id: "transNombreSociedad",
                                              initialValue:
                                                fakeApi.transaction !== null
                                                  ? transaction
                                                      .transNombreSociedad.val
                                                  : null,
                                              colClassName: "topLabel",
                                              labelCol: 0,
                                              wrapperCol: 0,
                                                   rules: [
                                            {
                                              required: true,
                                              message: t(
                                                "messages.aml.requestedField"
                                              ),
                                            },
                                          ],
                                              wrapperCols: 5,
                                              item: (
                                                <Input
                                                  onChange={(e) =>
                                                    handleOnChangeFieldTransactions(
                                                      e.target.id,
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                              ),
                                            })}

                                            {renderFormItem({
                                              label:
                                                transaction
                                                  .transSocioRepresentante
                                                  .title,
                                              id: "transSocioRepresentante",
                                              initialValue:
                                                fakeApi.transactions !== null
                                                  ? transaction
                                                      .transSocioRepresentante
                                                      .val
                                                  : null,
                                              colClassName: "topLabel",
                                              labelCol: 0,
                                              wrapperCol: 0,
                                              rules: [
                                                {
                                                  required: true,
                                                  message: t("messages.aml.dontForgetSelect"),
                                                },
                                              ],
                                              wrapperCols: 14,
                                              item:
                                                format === "html" ? (
                                                  <Select
                                                    onChange={(value) =>
                                                      handleOnChangeFieldTransactions(
                                                        "transSocioRepresentante",
                                                        value
                                                      )
                                                    }
                                                  >
                                                    <Select.Option key="1"></Select.Option>
                                                    <Select.Option
                                                      key="2"
                                                      value="socio"
                                                    >
                                                      Socio
                                                    </Select.Option>
                                                    <Select.Option
                                                      key="3"
                                                      value="representante legal"
                                                    >
                                                      Representante Legal
                                                    </Select.Option>
                                                  </Select>
                                                ) : (
                                                  <Input />
                                                ),
                                            })}
                                          </Row>
                                        )}

                                        {format === "html" && (
                                          <Row className="button-row">
                                            <Col
                                              className="addRelation"
                                              xl={24}
                                            >
                                              <Button
                                                type="primary"
                                                htmlType="button"
                                                onClick={
                                                  handleOnAddTransactions
                                                }
                                              >
                                                Añadir
                                              </Button>
                                            </Col>
                                          </Row>
                                        )}
                                      </>
                                    )}

                                    {fakeApi.transactions.length > 0 &&
                                    format === "html" ? (
                                      <Table
                                        columns={transactionsColumns}
                                        dataSource={fakeApi.transactions}
                                        size="middle"
                                        pagination={false}
                                      ></Table>
                                    ) : (
                                      toDescriptionsPdf(
                                        fakeApi.transactions,
                                        transaction
                                      )
                                    )}
                                  </Row>
                                </>
                              )}

                            <Row className="subheader">
                              <Col xl={24}>SECCIÓN 2</Col>
                            </Row>

                            <Row className="summary">
                              <Col span={21}>
                                Su cónyuge o pariente hasta el segundo grado de
                                consanguinidad (abuelo(a), padre, madre,
                                hijo(a), hermano(a), nieto(a)), desempeña o se
                                ha desempeñado en el último año{" "}
                                <strong>funciones públicas destacadas</strong>,
                                en Chile o en el Extranjero.
                              </Col>

                              {renderFormItem({
                                label: "",
                                id: "hasRel",
                                initialValue:
                                  fakeApi.hasRel !== null
                                    ? fakeApi.hasRel
                                    : null,
                                colClassName: "switch-col",
                                itemClassName: "radio-item",
                                labelCol: 0,
                                wrapperCol: 0,
                                offset: 0,
                                rules: [
                                  {
                                    required: true,
                                    message: t("messages.aml.dontForgetSelect"),
                                  },
                                ],
                                wrapperCols: 3,
                                item: (
                                  <Radio.Group
                                    onChange={({ target }) =>
                                      hancleOnChangeRadioButton(
                                        "hasRel",
                                        target.value
                                      )
                                    }
                                  >
                                    <Radio
                                      className="radio-switch"
                                      value={true}
                                    >
                                      Sí
                                    </Radio>
                                    <Radio
                                      className="radio-switch"
                                      value={false}
                                    >
                                      No
                                    </Radio>
                                  </Radio.Group>
                                ),
                              })}
                            </Row>

                            {fakeApi.hasRel !== null && fakeApi.hasRel && (
                              <>
                                <Row className="summary">
                                  <Col span={21}>
                                    A continuación, complete la siguiente
                                    información:
                                  </Col>
                                </Row>
                                <Row className="content">
                                  {format === "html" && (
                                    <>
                                      <Row
                                        className="fields-row"
                                        gutter={[16, 8]}
                                      ></Row>

                                      <Row
                                        className="fields-row"
                                        gutter={[16, 8]}
                                      >
                                        {renderFormItem({
                                          label: rel.relNombre.title,
                                          id: "relNombre",
                                          initialValue:
                                            fakeApi.rels !== null
                                              ? rel.relNombre.val
                                              : null,
                                          colClassName: "topLabel",
                                          labelCol: 0,
                                          wrapperCol: 0,
                                          rules: [
                                            {
                                              required: true,
                                              message: t(
                                                "messages.aml.requestedField"
                                              ),
                                            },
                                          ],
                                          wrapperCols: 8,
                                          item: (
                                            <Input
                                              onChange={(e) =>
                                                handleOnChangeFieldRels(
                                                  e.target.id,
                                                  e.target.value
                                                )
                                              }
                                            />
                                          ),
                                        })}

                                        {renderFormItem({
                                          label: rel.relRut.title,
                                          id: "relRut",
                                          initialValue:
                                            fakeApi.rels !== null
                                              ? rel.relRut.val
                                              : null,
                                          colClassName: "topLabel",
                                          labelCol: 0,
                                          wrapperCol: 0,
                                          rules: [
                                            {
                                              required: true,
                                              message: t(
                                                "messages.aml.requestedField"
                                              ),
                                            },
                                          ],
                                          wrapperCols: 8,
                                          item: (
                                            <Input
                                              onChange={(e) =>
                                                handleOnChangeFieldRels(
                                                  e.target.id,
                                                  e.target.value
                                                )
                                              }
                                            />
                                          ),
                                        })}

                                        {renderFormItem({
                                          label: rel.relParentesco.title,
                                          id: "relParentesco",
                                          initialValue:
                                            fakeApi.rels !== null
                                              ? rel.relParentesco.val
                                              : null,
                                          colClassName: "topLabel",
                                          labelCol: 0,
                                          wrapperCol: 0,
                                          rules: [
                                            {
                                              required: true,
                                              message: t("messages.aml.dontForgetSelect"),
                                            },
                                          ],
                                          wrapperCols: 8,
                                          item: (
                                            <Select
                                              onChange={(value) =>
                                                handleOnChangeFieldRels(
                                                  "relParentesco",
                                                  value
                                                )
                                              }
                                            >
                                              <Select.Option key = "1">
                                              </Select.Option>
                                              <Select.Option key = "2" value = "Conyugue">
                                                Conyugue
                                              </Select.Option>
                                              <Select.Option key = "3" value = "Padre">
                                                Padre
                                              </Select.Option>
                                              <Select.Option key = "4" value = "Madre">
                                                Madre
                                              </Select.Option>
                                              <Select.Option key = "5" value = "Hijo(a)">
                                               Hijo(a) 
                                              </Select.Option>
                                              <Select.Option key = "6" value = "Hermano(a)">
                                               Hermano(a) 
                                              </Select.Option>
                                              <Select.Option key = "7" value = " Abuelo(a)">
                                               Abuelo(a) 
                                              </Select.Option>
                                              <Select.Option key = "8" value = "Nieto(a)">
                                               Nieto(a) 
                                              </Select.Option>
                                            </Select>


                                          ),
                                        })}

                                        {renderFormItem({
                                          label: rel.relPasaporte.title,
                                          id: "relPasaporte",
                                          initialValue:
                                            fakeApi.rels !== null
                                              ? rel.relPasaporte.val
                                              : null,
                                          colClassName: "topLabel",
                                          labelCol: 0,
                                          wrapperCol: 0,
                                          rules: [{}],
                                          wrapperCols: 8,
                                          item: (
                                            <Input
                                              onChange={(e) =>
                                                handleOnChangeFieldRels(
                                                  e.target.id,
                                                  e.target.value
                                                )
                                              }
                                            />
                                          ),
                                        })}

                                        {renderFormItem({
                                          label: rel.relPais.title,
                                          id: "relPais",
                                          initialValue:
                                            fakeApi.rels !== null
                                              ? rel.relPais.val
                                              : null,
                                          colClassName: "topLabel",
                                          labelCol: 0,
                                          wrapperCol: 0,
                                          rules: [
                                            {
                                              required: true,
                                              message: t("messages.aml.dontForgetSelect"),
                                            },
                                          ],
                                          wrapperCols: 8,
                                          item:
                                            format === "html" ? (
                                              <Select
                                                onChange={(value) =>
                                                  handleOnChangeFieldRels(
                                                    "relPais",
                                                    value
                                                  )
                                                }
                                              >
                                                <Select.Option key="1"></Select.Option>
                                                <Select.Option
                                                  key="2"
                                                  value="Chile"
                                                >
                                                  Chile
                                                </Select.Option>
                                                <Select.Option
                                                  key="3"
                                                  value="Colombia"
                                                >
                                                  Colombia
                                                </Select.Option>
                                              </Select>
                                            ) : (
                                              <Input />
                                            ),
                                        })}

                                        {renderFormItem({
                                          label: rel.relOrganismoPublico.title,
                                          id: "relOrganismoPublico",
                                          initialValue:
                                            fakeApi.rels !== null
                                              ? rel.relOrganismoPublico.val
                                              : null,
                                          colClassName: "topLabel",
                                          labelCol: 0,
                                          wrapperCol: 0,
                                          rules: [
                                            {
                                              required: true,
                                              message: t(
                                                "messages.aml.requestedField"
                                              ),
                                            },
                                          ],
                                          wrapperCols: 8,
                                          item: (
                                            <Input
                                              onChange={(e) =>
                                                handleOnChangeFieldRels(
                                                  e.target.id,
                                                  e.target.value
                                                )
                                              }
                                            />
                                          ),
                                        })}

                                        {renderFormItem({
                                          label: rel.relCargo.title,
                                          id: "relCargo",
                                          initialValue:
                                            fakeApi.rels !== null
                                              ? rel.relCargo.val
                                              : null,
                                          colClassName: "topLabel",
                                          labelCol: 0,
                                          wrapperCol: 0,
                                          rules: [
                                            {
                                              required: true,
                                              message: t("messages.aml.dontForgetSelect"),
                                            },
                                          ],
                                          wrapperCols: 24,
                                          item:
                                            format === "html" ? (
                                              <Select
                                                onChange={(value) =>
                                                  handleOnChangeFieldRels(
                                                    "relCargo",
                                                    value
                                                  )
                                                }
                                              >
                                                <Select.Option key="1"></Select.Option>
                                                <Select.Option
                                                  key="2"
                                                  value="Presidente de la República."
                                                >
                                                  Presidente de la República.
                                                </Select.Option>
                                                <Select.Option
                                                  key="3"
                                                  value="Senadores, diputados y alcaldes."
                                                >
                                                  Senadores, diputados y
                                                  alcaldes.
                                                </Select.Option>
                                                <Select.Option
                                                  key="4"
                                                  value="Ministros de la Corte Suprema y Cortes de Apelaciones. "
                                                >
                                                  Ministros de la Corte Suprema
                                                  y Cortes de Apelaciones.
                                                </Select.Option>
                                                <Select.Option
                                                  key="5"
                                                  value="Ministros de Estado, subsecretarios, intendentes, gobernadores, 
                                                  secretarios regionales ministeriales, embajadores, jefes superiores de Servicio, 
                                                  tanto centralizados como descentralizados, y el directivo superior inmediato 
                                                  que deba subrogar a cada uno de ellos. "
                                                >
                                                  Ministros de Estado,
                                                  subsecretarios, intendentes,
                                                  gobernadores, secretarios
                                                  regionales ministeriales,
                                                  embajadores, jefes superiores
                                                  de Servicio, tanto
                                                  centralizados <br /> como
                                                  descentralizados, y el
                                                  directivo superior inmediato
                                                  que deba subrogar a cada uno
                                                  de ellos.
                                                </Select.Option>
                                                <Select.Option
                                                  key="6"
                                                  value="Comandantes en Jefe de las Fuerzas Armadas, director General de 
                                                  Carabineros, director General de Investigaciones, y el oficial superior 
                                                  inmediato que deba subrogar a cada uno de ellos. "
                                                >
                                                  Comandantes en Jefe de las
                                                  Fuerzas Armadas, director
                                                  General de Carabineros,
                                                  director General de
                                                  Investigaciones, y el oficial
                                                  superior inmediato que deba
                                                  subrogar <br /> a cada uno de
                                                  ellos.
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Fiscal Nacional del Ministerio Público y fiscales regionales. "
                                                >
                                                  Fiscal Nacional del Ministerio
                                                  Público y fiscales regionales.
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Contralor General de la República."
                                                >
                                                  Contralor General de la
                                                  República.
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Consejeros del Banco Central de Chile."
                                                >
                                                  Consejeros del Banco Central
                                                  de Chile.
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Consejeros del Consejo de Defensa del Estado"
                                                >
                                                  Consejeros del Consejo de
                                                  Defensa del Estado
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Ministros del Tribunal Constitucional. "
                                                >
                                                  Ministros del Tribunal
                                                  Constitucional.
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Ministros del Tribunal de la Libre Competencia."
                                                >
                                                  Ministros del Tribunal de la
                                                  Libre Competencia.
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Integrantes titulares y suplentes del Tribunal de Contratación Pública. "
                                                >
                                                  Integrantes titulares y
                                                  suplentes del Tribunal de
                                                  Contratación Pública.
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Consejeros del Consejo de Alta Dirección Pública."
                                                >
                                                  Consejeros del Consejo de Alta
                                                  Dirección Pública.
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Directores y ejecutivos principales de empresas públicas, según lo definido por la Ley Nº 18.045. "
                                                >
                                                  Directores y ejecutivos
                                                  principales de empresas
                                                  públicas, según lo definido
                                                  por la Ley Nº 18.045.
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Directores de sociedades anónimas nombrados por el Estado o sus organismos. "
                                                >
                                                  Directores de sociedades
                                                  anónimas nombrados por el
                                                  Estado o sus organismos.
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Consejeros del Consejo de Alta Dirección Pública."
                                                >
                                                  Miembros de las directivas de
                                                  los partidos políticos.
                                                </Select.Option>
                                              </Select>
                                            ) : (
                                              <Input />
                                            ),
                                        })}
                                      </Row>

                                      <Row
                                        className="fields-row"
                                        gutter={[16, 8]}
                                      >
                                        {renderFormItem({
                                          label: rel.relFechaInicio.title,
                                          id: "relFechaInicio",
                                          initialValue:
                                            rel.relFechaInicio.val !== null &&
                                            rel.relFechaInicio.val !== ""
                                              ? moment(rel.relFechaInicio.val)
                                              : null,
                                          colClassName: "topLabel",
                                          labelCol: 0,
                                          wrapperCol: 0,
                                          rules: [
                                            {
                                              required: true,
                                              message: t(
                                                "messages.aml.requestedField"
                                              ),
                                            },
                                          ],
                                          wrapperCols: 8,
                                          item:
                                            format === "html" ? (
                                              <DatePicker
                                                style={{ width: 225 }}
                                                format={dateFormat}
                                                placeholder="Ingrese la fecha"
                                                onChange={(momentObj) =>
                                                  handleOnChangeFieldRels(
                                                    "relFechaInicio",
                                                    momentObj !== null
                                                      ? momentObj.valueOf()
                                                      : null
                                                  )
                                                }
                                              />
                                            ) : (
                                              <Input />
                                            ),
                                        })}

                                        {renderFormItem({
                                          label: rel.relFechaTermino.title,
                                          id: "relFechaTermino",
                                          initialValue:
                                            rel.relFechaTermino.val !== null &&
                                            rel.relFechaTermino.val !== ""
                                              ? moment(rel.relFechaTermino.val)
                                              : null,
                                          colClassName: "topLabel",
                                          labelCol: 0,
                                          wrapperCol: 0,

                                          rules: [],
                                          wrapperCols: 5,
                                          item:
                                            format === "html" ? (
                                              <DatePicker
                                                style={{ width: 225 }}
                                                format={dateFormat}
                                                placeholder="Ingrese la fecha"
                                                onChange={(momentObj) =>
                                                  handleOnChangeFieldRels(
                                                    "relFechaTermino",
                                                    momentObj !== null
                                                      ? momentObj.valueOf()
                                                      : null
                                                  )
                                                }
                                              />
                                            ) : (
                                              <Input />
                                            ),
                                        })}
                                      </Row>






                                      <Row
                                          className="fields-row"
                                          gutter={[16, 8]}
                                        >
                                          {renderFormItem({
                                            label:
                                              rel.relFuenteIngresos
                                                .title,
                                            id: "relFuenteIngresos",
                                            initialValue:
                                              fakeApi.rels !== null
                                                ? rel
                                                    .relFuenteIngresos.val
                                                : null,
                                            colClassName: "topLabel",
                                            labelCol: 0,
                                            wrapperCol: 0,
                                            rules: [{}],
                                            wrapperCols: 5,
                                            item: (
                                              <Input
                                                onChange={(e) =>
                                                  handleOnChangeFieldRels(
                                                    e.target.id,
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            ),
                                          })}

                                          {renderFormItem({
                                            label:
                                              rel.relPromedioRecibido
                                                .title,
                                            id: "relPromedioRecibido",
                                            initialValue:
                                              fakeApi.rels !== null
                                                ? rel
                                                    .relPromedioRecibido.val
                                                : null,
                                            colClassName: "topLabel",
                                            labelCol: 0,
                                            wrapperCol: 0,
                                            rules: [{}],
                                            wrapperCols: 5,
                                            item: (
                                              <Input
                                                onChange={(e) =>
                                                  handleOnChangeFieldRels(
                                                    e.target.id,
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            ),
                                          })}

                                          {renderFormItem({
                                            label:
                                              rel.relIsRepLegal.title,
                                            id: "relIsRepLegal",
                                            initialValue:
                                              fakeApi.rels !== null
                                                ? rel.relIsRepLegal
                                                    .val
                                                : null,
                                            colClassName: "topLabel",
                                            labelCol: 0,
                                            wrapperCol: 0,
                                            rules: [
                                              {
                                                required: true,
                                                message: t("messages.aml.dontForgetSelect"),
                                              },
                                            ],
                                            wrapperCols: 14,
                                            item:
                                              format === "html" ? (
                                                <Select
                                                  onChange={(value) =>
                                                    handleOnChangeFieldRels(
                                                      "relIsRepLegal",
                                                      value
                                                    )
                                                  }
                                                >
                                                  <Select.Option key="1"></Select.Option>
                                                  <Select.Option
                                                    key="2"
                                                    value={true}
                                                  >
                                                    Si
                                                  </Select.Option>
                                                  <Select.Option
                                                    key="3"
                                                    value={false}
                                                  >
                                                    No
                                                  </Select.Option>
                                                </Select>
                                              ) : (
                                                <Input />
                                              ),
                                          })}
                                        </Row>

                                        {rel.relIsRepLegal.val && (
                                          <Row
                                            className="fields-row"
                                            gutter={[16, 8]}
                                          >
                                            {renderFormItem({
                                              label:
                                                rel.relRutSociedad
                                                  .title,
                                              id: "relRutSociedad",
                                              initialValue:
                                                fakeApi.rels !== null
                                                  ? rel.relRutSociedad
                                                      .val
                                                  : null,
                                              colClassName: "topLabel",
                                              labelCol: 0,
                                              wrapperCol: 0,
                                              rules: [
                                                {
                                                  required: true,
                                                  message: t(
                                                    "messages.aml.requestedField"
                                                  ),
                                                },
                                              ],
                                              wrapperCols: 5,
                                              item: (
                                                <Input
                                                  onChange={(e) =>
                                                    handleOnChangeFieldRels(
                                                      e.target.id,
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                              ),
                                            })}

                                            {renderFormItem({
                                              label:
                                                rel.relNombreSociedad
                                                  .title,
                                              id: "relNombreSociedad",
                                              initialValue:
                                                fakeApi.rels !== null
                                                  ? rel
                                                      .relNombreSociedad.val
                                                  : null,
                                              colClassName: "topLabel",
                                              labelCol: 0,
                                              wrapperCol: 0,
                                              rules: [
                                                {
                                                  required: true,
                                                  message: t(
                                                    "messages.aml.requestedField"
                                                  ),
                                                },
                                              ],
                                              wrapperCols: 5,
                                              item: (
                                                <Input
                                                  onChange={(e) =>
                                                    handleOnChangeFieldRels(
                                                      e.target.id,
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                              ),
                                            })}

                                            {renderFormItem({
                                              label:
                                                rel
                                                  .relSocioRepresentante
                                                  .title,
                                              id: "relSocioRepresentante",
                                              initialValue:
                                                fakeApi.rels !== null
                                                  ? rel
                                                      .relSocioRepresentante
                                                      .val
                                                  : null,
                                              colClassName: "topLabel",
                                              labelCol: 0,
                                              wrapperCol: 0,
                                              rules: [
                                                {
                                                  required: true,
                                                  message: t("messages.aml.dontForgetSelect"),
                                                },
                                              ],
                                              wrapperCols: 14,
                                              item:
                                                format === "html" ? (
                                                  <Select
                                                    onChange={(value) =>
                                                      handleOnChangeFieldRels(
                                                        "relSocioRepresentante",
                                                        value
                                                      )
                                                    }
                                                  >
                                                    <Select.Option key="1"></Select.Option>
                                                    <Select.Option
                                                      key="2"
                                                      value="socio"
                                                    >
                                                      Socio
                                                    </Select.Option>
                                                    <Select.Option
                                                      key="3"
                                                      value="representante legal"
                                                    >
                                                      Representante Legal
                                                    </Select.Option>
                                                  </Select>
                                                ) : (
                                                  <Input />
                                                ),
                                            })}
                                          </Row>
                                        )}


                                      {format === "html" && (
                                        <Row className="button-row">
                                          <Col className="addRelation" xl={24}>
                                            <Button
                                              type="primary"
                                              htmlType="button"
                                              onClick={handleOnAddRels}
                                            >
                                              Añadir
                                            </Button>
                                          </Col>
                                        </Row>
                                      )}
                                    </>
                                  )}

                                  {fakeApi.rels.length > 0 &&
                                  format === "html" ? (
                                    <Table
                                      columns={relsColumns}
                                      dataSource={fakeApi.rels}
                                      size="middle"
                                      pagination={false}
                                    ></Table>
                                  ) : (
                                    toDescriptionsPdf(fakeApi.rels, rel)
                                  )}
                                </Row>
                              </>
                            )}

                            <Row className="subheader">
                              <Col xl={24}>SECCIÓN 3</Col>
                            </Row>

                            <Row className="summary">
                              <Col span={21}>
                                Ha celebrado un pacto de actuación conjunta que
                                otorgue poder de voto suficiente para influir en
                                sociedades constituidas en Chile, con una
                                persona que desempeñe o haya desempeñado en el
                                último año{" "}
                                <strong>funciones públicas destacadas</strong>,
                                en Chile o en el Extranjero.{" "}
                              </Col>

                              {renderFormItem({
                                label: "",
                                id: "hasPacto",
                                initialValue:
                                  fakeApi.hasPacto !== null
                                    ? fakeApi.hasPacto
                                    : null,
                                colClassName: "switch-col",
                                itemClassName: "radio-item",
                                labelCol: 0,
                                wrapperCol: 0,
                                offset: 0,
                                rules: [
                                  {
                                    required: true,
                                    message: t("messages.aml.dontForgetSelect"),
                                  },
                                ],
                                wrapperCols: 3,
                                item: (
                                  <Radio.Group
                                    onChange={({ target }) =>
                                      hancleOnChangeRadioButton(
                                        "hasPacto",
                                        target.value
                                      )
                                    }
                                  >
                                    <Radio
                                      className="radio-switch"
                                      value={true}
                                    >
                                      Sí
                                    </Radio>
                                    <Radio
                                      className="radio-switch"
                                      value={false}
                                    >
                                      No
                                    </Radio>
                                  </Radio.Group>
                                ),
                              })}
                            </Row>

                            {fakeApi.hasPacto !== null && fakeApi.hasPacto && (
                              <>
                                <Row className="summary">
                                  <Col span={21}>
                                    A continuación, complete la información
                                    referida de la persona con la que celebro el
                                    acuerdo (si es necesario puede informar más
                                    de una):
                                  </Col>
                                </Row>
                                <Row className="content">
                                  {format === "html" && (
                                    <>
                                      <Row
                                        className="fields-row"
                                        gutter={[16, 8]}
                                      ></Row>

                                      <Row
                                        className="fields-row"
                                        gutter={[16, 8]}
                                      >
                                        {renderFormItem({
                                          label: pacto.pactoNombre.title,
                                          id: "pactoNombre",
                                          initialValue:
                                            fakeApi.pactos !== null
                                              ? pacto.pactoNombre.val
                                              : null,
                                          colClassName: "topLabel",
                                          labelCol: 0,
                                          wrapperCol: 0,
                                          rules: [
                                            {
                                              required: true,
                                              message: t(
                                                "messages.aml.requestedField"
                                              ),
                                            },
                                          ],
                                          wrapperCols: 8,
                                          item: (
                                            <Input
                                              onChange={(e) =>
                                                handleOnChangeFieldPactos(
                                                  e.target.id,
                                                  e.target.value
                                                )
                                              }
                                            />
                                          ),
                                        })}

                                        {renderFormItem({
                                          label: pacto.pactoRut.title,
                                          id: "pactoRut",
                                          initialValue:
                                            fakeApi.pactos !== null
                                              ? pacto.pactoRut.val
                                              : null,
                                          colClassName: "topLabel",
                                          labelCol: 0,
                                          wrapperCol: 0,
                                          rules: [
                                            {
                                              required: true,
                                              message: t(
                                                "messages.aml.requestedField"
                                              ),
                                            },
                                          ],
                                          wrapperCols: 8,
                                          item: (
                                            <Input
                                              onChange={(e) =>
                                                handleOnChangeFieldPactos(
                                                  e.target.id,
                                                  e.target.value
                                                )
                                              }
                                            />
                                          ),
                                        })}

                                        {renderFormItem({
                                          label: pacto.pactoRelacion.title,
                                          id: "pactoRelacion",
                                          initialValue:
                                            fakeApi.pactos !== null
                                              ? pacto.pactoRelacion.val
                                              : null,
                                          colClassName: "topLabel",
                                          labelCol: 0,
                                          wrapperCol: 0,
                                          rules: [
                                            {
                                              required: true,
                                              message: t(
                                                "messages.aml.requestedField"
                                              ),
                                            },
                                          ],
                                          wrapperCols: 8,
                                          item: (
                                            <Input
                                              onChange={(e) =>
                                                handleOnChangeFieldPactos(
                                                  e.target.id,
                                                  e.target.value
                                                )
                                              }
                                            />
                                          ),
                                        })}

                                        {renderFormItem({
                                          label: pacto.pactoPasaporte.title,
                                          id: "pactoPasaporte",
                                          initialValue:
                                            fakeApi.pactos !== null
                                              ? pacto.pactoPasaporte.val
                                              : null,
                                          colClassName: "topLabel",
                                          labelCol: 0,
                                          wrapperCol: 0,
                                          rules: [{}],
                                          wrapperCols: 8,
                                          item: (
                                            <Input
                                              onChange={(e) =>
                                                handleOnChangeFieldPactos(
                                                  e.target.id,
                                                  e.target.value
                                                )
                                              }
                                            />
                                          ),
                                        })}

                                        {renderFormItem({
                                          label: pacto.pactoPais.title,
                                          id: "pactoPais",
                                          initialValue:
                                            fakeApi.pactos !== null
                                              ? pacto.pactoPais.val
                                              : null,
                                          colClassName: "topLabel",
                                          labelCol: 0,
                                          wrapperCol: 0,
                                          rules: [
                                            {
                                              required: true,
                                              message: t("messages.aml.dontForgetSelect"),
                                            },
                                          ],
                                          wrapperCols: 8,
                                          item:
                                            format === "html" ? (
                                              <Select
                                                onChange={(value) =>
                                                  handleOnChangeFieldPactos(
                                                    "pactoPais",
                                                    value
                                                  )
                                                }
                                              >
                                                <Select.Option key="1"></Select.Option>
                                                <Select.Option
                                                  key="2"
                                                  value="Chile"
                                                >
                                                  Chile
                                                </Select.Option>
                                                <Select.Option
                                                  key="3"
                                                  value="Colombia"
                                                >
                                                  Colombia
                                                </Select.Option>
                                              </Select>
                                            ) : (
                                              <Input />
                                            ),
                                        })}

                                        {renderFormItem({
                                          label:
                                            pacto.pactoOrganismoPublico.title,
                                          id: "pactoOrganismoPublico",
                                          initialValue:
                                            fakeApi.pacto !== null
                                              ? pacto.pactoOrganismoPublico.val
                                              : null,
                                          colClassName: "topLabel",
                                          labelCol: 0,
                                          wrapperCol: 0,
                                          rules: [
                                            {
                                              required: true,
                                              message: t(
                                                "messages.aml.requestedField"
                                              ),
                                            },
                                          ],
                                          wrapperCols: 8,
                                          item: (
                                            <Input
                                              onChange={(e) =>
                                                handleOnChangeFieldPactos(
                                                  e.target.id,
                                                  e.target.value
                                                )
                                              }
                                            />
                                          ),
                                        })}

                                        {renderFormItem({
                                          label: pacto.pactoCargo.title,
                                          id: "pactoCargo",
                                          initialValue:
                                            fakeApi.pactos !== null
                                              ? pacto.pactoCargo.val
                                              : null,
                                          colClassName: "topLabel",
                                          labelCol: 0,
                                          wrapperCol: 0,
                                          rules: [
                                            {
                                              required: true,
                                              message: t("messages.aml.dontForgetSelect"),
                                            },
                                          ],
                                          wrapperCols: 24,
                                          item:
                                            format === "html" ? (
                                              <Select
                                                onChange={(value) =>
                                                  handleOnChangeFieldPactos(
                                                    "pactoCargo",
                                                    value
                                                  )
                                                }
                                              >
                                                <Select.Option key="1"></Select.Option>
                                                <Select.Option
                                                  key="2"
                                                  value="Presidente de la República."
                                                >
                                                  Presidente de la República.
                                                </Select.Option>
                                                <Select.Option
                                                  key="3"
                                                  value="Senadores, diputados y alcaldes."
                                                >
                                                  Senadores, diputados y
                                                  alcaldes.
                                                </Select.Option>
                                                <Select.Option
                                                  key="4"
                                                  value="Ministros de la Corte Suprema y Cortes de Apelaciones. "
                                                >
                                                  Ministros de la Corte Suprema
                                                  y Cortes de Apelaciones.
                                                </Select.Option>
                                                <Select.Option
                                                  key="5"
                                                  value="Ministros de Estado, subsecretarios, intendentes, gobernadores, 
                                                  secretarios regionales ministeriales, embajadores, jefes superiores de Servicio, 
                                                  tanto centralizados como descentralizados, y el directivo superior inmediato 
                                                  que deba subrogar a cada uno de ellos. "
                                                >
                                                  Ministros de Estado,
                                                  subsecretarios, intendentes,
                                                  gobernadores, secretarios
                                                  regionales ministeriales,
                                                  embajadores, jefes superiores
                                                  de Servicio, tanto
                                                  centralizados <br /> como
                                                  descentralizados, y el
                                                  directivo superior inmediato
                                                  que deba subrogar a cada uno
                                                  de ellos.
                                                </Select.Option>
                                                <Select.Option
                                                  key="6"
                                                  value="Comandantes en Jefe de las Fuerzas Armadas, director General de 
                                                  Carabineros, director General de Investigaciones, y el oficial superior 
                                                  inmediato que deba subrogar a cada uno de ellos. "
                                                >
                                                  Comandantes en Jefe de las
                                                  Fuerzas Armadas, director
                                                  General de Carabineros,
                                                  director General de
                                                  Investigaciones, y el oficial
                                                  superior inmediato que deba
                                                  subrogar <br /> a cada uno de
                                                  ellos.
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Fiscal Nacional del Ministerio Público y fiscales regionales. "
                                                >
                                                  Fiscal Nacional del Ministerio
                                                  Público y fiscales regionales.
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Contralor General de la República."
                                                >
                                                  Contralor General de la
                                                  República.
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Consejeros del Banco Central de Chile."
                                                >
                                                  Consejeros del Banco Central
                                                  de Chile.
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Consejeros del Consejo de Defensa del Estado"
                                                >
                                                  Consejeros del Consejo de
                                                  Defensa del Estado
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Ministros del Tribunal Constitucional. "
                                                >
                                                  Ministros del Tribunal
                                                  Constitucional.
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Ministros del Tribunal de la Libre Competencia."
                                                >
                                                  Ministros del Tribunal de la
                                                  Libre Competencia.
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Integrantes titulares y suplentes del Tribunal de Contratación Pública. "
                                                >
                                                  Integrantes titulares y
                                                  suplentes del Tribunal de
                                                  Contratación Pública.
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Consejeros del Consejo de Alta Dirección Pública."
                                                >
                                                  Consejeros del Consejo de Alta
                                                  Dirección Pública.
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Directores y ejecutivos principales de empresas públicas, según lo definido por la Ley Nº 18.045. "
                                                >
                                                  Directores y ejecutivos
                                                  principales de empresas
                                                  públicas, según lo definido
                                                  por la Ley Nº 18.045.
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Directores de sociedades anónimas nombrados por el Estado o sus organismos. "
                                                >
                                                  Directores de sociedades
                                                  anónimas nombrados por el
                                                  Estado o sus organismos.
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="Consejeros del Consejo de Alta Dirección Pública."
                                                >
                                                  Miembros de las directivas de
                                                  los partidos políticos.
                                                </Select.Option>
                                              </Select>
                                            ) : (
                                              <Input />
                                            ),
                                        })}
                                      </Row>

                                      <Row
                                        className="fields-row"
                                        gutter={[16, 8]}
                                      >
                                        {renderFormItem({
                                          label: pacto.pactoFechaInicio.title,
                                          id: "pactoFechaInicio",
                                          initialValue:
                                            pacto.pactoFechaInicio.val !==
                                              null &&
                                            pacto.pactoFechaInicio.val !== ""
                                              ? moment(
                                                  pacto.pactoFechaInicio.val
                                                )
                                              : null,
                                          colClassName: "topLabel",
                                          labelCol: 0,
                                          wrapperCol: 0,
                                          rules: [
                                            {
                                              required: true,
                                              message: t(
                                                "messages.aml.requestedField"
                                              ),
                                            },
                                          ],
                                          wrapperCols: 12,
                                          item:
                                            format === "html" ? (
                                              <DatePicker
                                                style={{ width: 225 }}
                                                format={dateFormat}
                                                placeholder="Ingrese la fecha"
                                                onChange={(momentObj) =>
                                                  handleOnChangeFieldPactos(
                                                    "pactoFechaInicio",
                                                    momentObj !== null
                                                      ? momentObj.valueOf()
                                                      : null
                                                  )
                                                }
                                              />
                                            ) : (
                                              <Input />
                                            ),
                                        })}

                                        {renderFormItem({
                                          label: pacto.pactoFechaTermino.title,
                                          id: "pactoFechaTermino",
                                          initialValue:
                                            pacto.pactoFechaTermino.val !==
                                              null &&
                                            pacto.pactoFechaTermino.val !== ""
                                              ? moment(
                                                  pacto.pactoFechaTermino.val
                                                )
                                              : null,
                                          colClassName: "topLabel",
                                          labelCol: 0,
                                          wrapperCol: 0,

                             
                                          wrapperCols: 10,
                                          item:
                                            format === "html" ? (
                                              <DatePicker
                                                style={{ width: 225 }}
                                                format={dateFormat}
                                                placeholder="Ingrese la fecha"
                                                onChange={(momentObj) =>
                                                  handleOnChangeFieldPactos(
                                                    "pactoFechaTermino",
                                                    momentObj !== null
                                                      ? momentObj.valueOf()
                                                      : null
                                                  )
                                                }
                                              />
                                            ) : (
                                              <Input />
                                            ),
                                        })}
                                      </Row>








                                      <Row
                                          className="fields-row"
                                          gutter={[16, 8]}
                                        >
                                          {renderFormItem({
                                            label:
                                              pacto.pactoFuenteIngresos
                                                .title,
                                            id: "pactoFuenteIngresos",
                                            initialValue:
                                              fakeApi.pactos !== null
                                                ? pacto
                                                    .pactoFuenteIngresos.val
                                                : null,
                                            colClassName: "topLabel",
                                            labelCol: 0,
                                            wrapperCol: 0,
                                            rules: [{}],
                                            wrapperCols: 5,
                                            item: (
                                              <Input
                                                onChange={(e) =>
                                                  handleOnChangeFieldPactos(
                                                    e.target.id,
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            ),
                                          })}

                                          {renderFormItem({
                                            label:
                                               pacto.pactoPromedioRecibido
                                                .title,
                                            id: "pactoPromedioRecibido",
                                            initialValue:
                                              fakeApi.pactos !== null
                                                ? pacto
                                                    .pactoPromedioRecibido.val
                                                : null,
                                            colClassName: "topLabel",
                                            labelCol: 0,
                                            wrapperCol: 0,
                                            rules: [{}],
                                            wrapperCols: 5,
                                            item: (
                                              <Input
                                                onChange={(e) =>
                                                  handleOnChangeFieldPactos(
                                                    e.target.id,
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            ),
                                          })}

                                          {renderFormItem({
                                            label:
                                              pacto.pactoIsRepLegal.title,
                                            id: "pactoIsRepLegal",
                                            initialValue:
                                              fakeApi.pactos !== null
                                                ? pacto.pactoIsRepLegal
                                                    .val
                                                : null,
                                            colClassName: "topLabel",
                                            labelCol: 0,
                                            wrapperCol: 0,
                                            rules: [
                                              {
                                                required: true,
                                                message: t("messages.aml.dontForgetSelect"),
                                              },
                                            ],
                                            wrapperCols: 14,
                                            item:
                                              format === "html" ? (
                                                <Select
                                                  onChange={(value) =>
                                                    handleOnChangeFieldPactos(
                                                      "pactoIsRepLegal",
                                                      value
                                                    )
                                                  }
                                                >
                                                  <Select.Option key="1"></Select.Option>
                                                  <Select.Option
                                                    key="2"
                                                    value={true}
                                                  >
                                                    Si
                                                  </Select.Option>
                                                  <Select.Option
                                                    key="3"
                                                    value={false}
                                                  >
                                                    No
                                                  </Select.Option>
                                                </Select>
                                              ) : (
                                                <Input />
                                              ),
                                          })}
                                        </Row>

                                        {pacto.pactoIsRepLegal.val && (
                                          <Row
                                            className="fields-row"
                                            gutter={[16, 8]}
                                          >
                                            {renderFormItem({
                                              label:
                                                pacto.pactoRutSociedad
                                                  .title,
                                              id: "pactoRutSociedad",
                                              initialValue:
                                                fakeApi.pactos !== null
                                                  ? pacto.pactoRutSociedad
                                                      .val
                                                  : null,
                                              colClassName: "topLabel",
                                              labelCol: 0,
                                              wrapperCol: 0,
                                              rules: [
                                                {
                                                  required: true,
                                                  message: t(
                                                    "messages.aml.requestedField"
                                                  ),
                                                },
                                              ],
                                              wrapperCols: 5,
                                              item: (
                                                <Input
                                                  onChange={(e) =>
                                                    handleOnChangeFieldPactos(
                                                      e.target.id,
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                              ),
                                            })}

                                            {renderFormItem({
                                              label:
                                                pacto.pactoNombreSociedad
                                                  .title,
                                              id: "pactoNombreSociedad",
                                              initialValue:
                                                fakeApi.pactos !== null
                                                  ? pacto
                                                      .pactoNombreSociedad.val
                                                  : null,
                                              colClassName: "topLabel",
                                              labelCol: 0,
                                              wrapperCol: 0,
                                              rules: [
                                                {
                                                  required: true,
                                                  message: t(
                                                    "messages.aml.requestedField"
                                                  ),
                                                },
                                              ],
                                              wrapperCols: 5,
                                              item: (
                                                <Input
                                                  onChange={(e) =>
                                                    handleOnChangeFieldPactos(
                                                      e.target.id,
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                              ),
                                            })}

                                            {renderFormItem({
                                              label:
                                                pacto
                                                  .pactoSocioRepresentante
                                                  .title,
                                              id: "pactoSocioRepresentante",
                                              initialValue:
                                                fakeApi.pacto !== null
                                                  ? pacto
                                                      .pactoSocioRepresentante
                                                      .val
                                                  : null,
                                              colClassName: "topLabel",
                                              labelCol: 0,
                                              wrapperCol: 0,
                                              rules: [
                                                {
                                                  required: true,
                                                  message: t("messages.aml.dontForgetSelect"),
                                                },
                                              ],
                                              wrapperCols: 14,
                                              item:
                                                format === "html" ? (
                                                  <Select
                                                    onChange={(value) =>
                                                      handleOnChangeFieldPactos(
                                                        "pactoSocioRepresentante",
                                                        value
                                                      )
                                                    }
                                                  >
                                                    <Select.Option key="1"></Select.Option>
                                                    <Select.Option
                                                      key="2"
                                                      value="socio"
                                                    >
                                                      Socio
                                                    </Select.Option>
                                                    <Select.Option
                                                      key="3"
                                                      value="representante legal"
                                                    >
                                                      Representante Legal
                                                    </Select.Option>
                                                  </Select>
                                                ) : (
                                                  <Input />
                                                ),
                                            })}
                                          </Row>
                                        )}


                                      {format === "html" && (
                                        <Row className="button-row">
                                          <Col className="addRelation" xl={24}>
                                            <Button
                                              type="primary"
                                              htmlType="button"
                                              onClick={handleOnAddPactos}
                                            >
                                              Añadir
                                            </Button>
                                          </Col>
                                        </Row>
                                      )}
                                    </>
                                  )}

                                  {fakeApi.pactos.length > 0 &&
                                  format === "html" ? (
                                    <Table
                                      columns={pactosColumns}
                                      dataSource={fakeApi.pactos}
                                      size="middle"
                                      pagination={false}
                                    ></Table>
                                  ) : (
                                    toDescriptionsPdf(fakeApi.pactos, pacto)
                                  )}
                                </Row>
                              </>
                            )}

   

                            <Row
                              className="content submit-content"
                              style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                            >
                              <Row className="summary">
                                <Col xl={24}>
                                  Certifico que mis respuestas están completas y
                                  son correctas a mi mejor saber y entender.
                                  Además, acepto que tengo la obligación de
                                  comunicar a la brevedad y por escrito a la
                                  Compañía, en el evento que se originen cambios
                                  a la presente declaración, con el objeto de
                                  que se proceda a actualizar los antecedentes
                                  entregados.
                                </Col>
                              </Row>
                              {format === "html" && (
                                <Row className="button-row">
                                  <Col className="submitTrabajador" xl={24}>
                                    <Button type="primary" htmlType="submit">
                                      {t("messages.aml.send")}
                                    </Button>
                                  </Col>
                                </Row>
                              )}
                            </Row>
                          </>
                        )}
                      </Form>
                    </Col>
                  </Row>
                </div>
              ) : (
                <h2 style={{ textAlign: "center" }}>
                  Formulario no encontrado
                </h2>
              )}
            </>
          )}
        </div>
      </FormLayout>
    </div>
  );
};

export default withRouter(Form.create()(FormPepNatural));
