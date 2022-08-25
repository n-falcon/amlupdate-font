import "./formValues.scss";
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

const FormValues = ({ form, match }) => {
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
    hasTransaction: null,
    transactions: [],
    recipient: {
      record: {
        trabRelationship: null,
      },
    },
  });
  const [transaction, setTransaction] = useState({
    transDate: { key: "date", val: "", title: "Fecha de la transacción" },
    transBroker: {
      key: "broker",
      val: "",
      title: "Corredor o Intermediario utilizado",
    },
    transIssuingCompany: {
      key: "issuingCompany",
      val: "",
      title: "Empresa Emisora",
    },
    transNemo: { key: "nemo", val: "", title: "Nemotécnico" },
    transType: { key: "type", val: "", title: "Tipo de Transacción" },
    transInstrumentType: {
      key: "instrumentType",
      val: "",
      title: "Tipo de Instrumento",
    },
    transSerie: { key: "serie", val: "", title: "Serie" },
    transSerieCode: { key: "serieCode", val: "", title: "Codigo de Serie" },
    transUnits: { key: "units", val: "", title: "Unidades Transadas" },
    transExpresado: { key: "expresado", val: "", title: "Expresado en" },
    transUnitPrice: {
      key: "unitPrice",
      val: "",
      title: "Precio unitario de transacción",
    },
    transTotal: { key: "total", val: "", title: "Total transado" },
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
    {
      title: () => (
        <>
          <div>Fecha de la</div>
          <div>Transacción</div>
        </>
      ),
      dataIndex: "date",
      render: (text) =>
        text !== null ? moment(parseInt(text)).format("DD-MM-YYYY") : "",
    },

    {
      title: () => (
        <>
          <div>Corredor</div>
          <div>Utilizado</div>
        </>
      ),
      dataIndex: "broker",
    },
    {
      title: () => (
        <>
          <div>Empresa</div>
          <div>Emisora</div>
        </>
      ),
      dataIndex: "issuingCompany",
    },
    {
      title: transaction.transNemo.title,
      dataIndex: "nemo",
    },
    {
      title: () => (
        <>
          <div>Tipo de</div>
          <div>Transacción</div>
        </>
      ),
      dataIndex: "type",
    },
    {
      title: () => (
        <>
          <div>Tipo de</div>
          <div>Instrumento</div>
        </>
      ),
      dataIndex: "instrumentType",
    },
    {
      title: transaction.transSerie.title,
      dataIndex: "serie",
      render: (text, record) => (text === "otros" ? record.serieCode : text),
    },
    {
      title: () => (
        <>
          <div>Unidades</div>
          <div>Transadas</div>
        </>
      ),
      dataIndex: "units",
    },
    {
      title: () => (
        <>
          <div>{transaction.transExpresado.title}</div>
        </>
      ),
      dataIndex: "expresado",
    },
    {
      title: () => (
        <>
          <div>Precio Unitario</div>
          <div>de Transacción</div>
        </>
      ),
      dataIndex: "unitPrice",
    },
    {
      title: () => (
        <>
          <div>Total</div>
          <div>Transado</div>
        </>
      ),
      dataIndex: "total",
      render: (text, record) => {
        return record.units * record.unitPrice;
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

  const handleOnDeleteTransaction = (index) => {
    return () => {
      const currentTransactions = fakeApi.transactions;
      currentTransactions.splice(index, 1);
      setFakeApi({ ...fakeApi, transactions: currentTransactions });
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

  const seed = ()=>{
    const transactionOk = Object.keys(transaction)
    .filter((str) => str !== "transDate")
    .reduce((acc, e) => {
      return { ...acc, [transaction[e].key]: "fake" };
    }, {});
    transactionOk["date"] = "1584316800000";
    fakeApi.transactions.push(transactionOk);
    fakeApi.transactions.push(transactionOk);
    fakeApi.transactions.push(transactionOk);
    fakeApi.transactions.push(transactionOk);
  }

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
    <div className="form-values">
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
                                Declaración de Compra o Venta de Valores de
                                Oferta Pública
                              </h3>
                            ) : (
                              <h4>
                                Declaración de Compra o Venta de Valores de
                                Oferta Pública
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
                              className="lineamiento subheader"
                              style={{ marginTop: "0px" }}
                            >
                              <Col xl={24}>Introducción</Col>
                            </Row>

                            <Row className="summary">
                              <Col xl={24}>
                                El artículo 171 de la Ley Nº 18.045 sobre
                                Mercado de Valores, establece que, las personas
                                que participen en las decisiones de adquisición
                                y enajenación de valores para inversionistas
                                institucionales e intermediarios de valores y
                                aquellas que, en razón de su cargo o posición,
                                tengan acceso a la información respecto de las
                                transacciones de estas entidades deberán
                                informar a la dirección de su empresa, de toda
                                adquisición o enajenación de valores de oferta
                                pública que ellas hayan realizado. <br /> <br />
                                Por tal motivo solicitamos pueda completar la
                                siguiente información respecto de aquellas
                                transacciones realizadas
                              </Col>
                            </Row>

                            <Row
                              className="subheader"
                              style={{
                                marginTop: "0px",
                              }}
                            >
                              <Col xl={24}>Trabajador(a)</Col>
                            </Row>

                            <Row className="content">
                              <Row className="fields-row" gutter={[16, 8]}>
                                {renderFormItem({
                                  label: "Nombre",
                                  id: "nombre",
                                  initialValue: apiForm.recipient.record.nombre,
                                  colClassName: "topLabel item-field",
                                  labelCol: 0,
                                  wrapperCol: 0,
                                  rules: [{}],
                                  wrapperCols: 16,
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
                                  wrapperCols: 8,
                                  item: <Input disabled={true} />,
                                })}
                              </Row>

                              <Row className="fields-row" gutter={[16, 8]}>
                                {renderFormItem({
                                  label: "Relación",
                                  id: "trabRelationship",
                                  initialValue:
                                    fakeApi.recipient.record.trabRelationship,
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
                                  wrapperCols: 8,
                                  item:
                                    format === "html" ? (
                                      <Select
                                        onChange={(value) =>
                                          handleOnChangeFieldIntro(
                                            "trabRelationship",
                                            value
                                          )
                                        }
                                      >
                                        <Select.Option key="1"></Select.Option>
                                        <Select.Option
                                          key="2"
                                          value="Gerente General"
                                        >
                                          Gerente General
                                        </Select.Option>
                                        <Select.Option
                                          key="3"
                                          value="Gerente de Área o Subgerente"
                                        >
                                          Gerente de Área o Subgerente
                                        </Select.Option>
                                        <Option
                                          key="4"
                                          value="Operador de Mesa de dinero"
                                        >
                                          Operador de Mesa de dinero
                                        </Option>
                                        <Option key="5" value="otra">
                                          Otra relación distinta a las
                                          anteriores
                                        </Option>
                                      </Select>
                                    ) : (
                                      <Input />
                                    ),
                                })}

                                {fakeApi.recipient.record.trabRelationship ===
                                  "otra" &&
                                  renderFormItem({
                                    label: "Indique su cargo actual",
                                    id: "introCargo",
                                    initialValue:
                                      fakeApi.transaction !== null
                                        ? fakeApi.recipient.record.cargo
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
                                    wrapperCols: 16,
                                    item: (
                                      <Input
                                        onChange={(e) =>
                                          handleOnChangeFieldIntro(
                                            e.target.id,
                                            e.target.value
                                          )
                                        }
                                      />
                                    ),
                                  })}
                              </Row>
                            </Row>

                            <Row className="subheader">
                              <Col xl={24}>
                                Detalle de la Compra o Venta de valores
                                realizada
                              </Col>
                            </Row>

                            <Row className="content">
                              <Row className="summary" gutter={[16, 8]}>
                                <Col xl={24}>
                                  Periodo:{" "}
                                  <strong>{moment().format("MMMM")}</strong>
                                </Col>
                              </Row>
                            </Row>

                            <Row className="summary">
                              <Col span={21}>
                                A continuación, indique si ha realizado
                                operaciones de Compra o Venta de valores de
                                oferta pública durante el periodo señalado
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
                                <Row className="content">
                                  {format === "html" && (
                                    <>
                                      <Row
                                        className="fields-row"
                                        gutter={[16, 8]}
                                      >
                                        {renderFormItem({
                                          label: "Fecha de la transacción",
                                          id: "transDate",
                                          initialValue:
                                            fakeApi.transaction !== null &&
                                            fakeApi.transaction !== undefined
                                              ? moment(
                                                  transaction.transDate.val
                                                ).format("DD-MM-YYYY")
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
                                                onChange={(momentObj) =>
                                                  handleOnChangeFieldTransactions(
                                                    "transDate",
                                                    moment(momentObj).valueOf()
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
                                            "Corredor o Intermediario utilizado",
                                          id: "transBroker",
                                          initialValue:
                                            fakeApi.transaction !== null
                                              ? transaction.transBroker.val
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
                                          label: "Empresa Emisora",
                                          id: "transIssuingCompany",
                                          initialValue:
                                            fakeApi.transaction !== null
                                              ? transaction.transIssuingCompany
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
                                          wrapperCols: 12,
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
                                      </Row>

                                      <Row
                                        className="fields-row"
                                        gutter={[16, 8]}
                                      >
                                        {renderFormItem({
                                          label: "Nemotécnico",
                                          id: "transNemo",
                                          initialValue:
                                            fakeApi.transaction !== null
                                              ? transaction.transNemo.val
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
                                          label: "Tipo de Transacción",
                                          id: "transType",
                                          initialValue:
                                            fakeApi.transactions !== null
                                              ? transaction.transType.val
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
                                          wrapperCols: 12,
                                          item:
                                            format === "html" ? (
                                              <Select
                                                onChange={(value) =>
                                                  handleOnChangeFieldTransactions(
                                                    "transType",
                                                    value
                                                  )
                                                }
                                              >
                                                <Select.Option key="1"></Select.Option>
                                                <Select.Option
                                                  key="2"
                                                  value="compra"
                                                >
                                                  Compra
                                                </Select.Option>
                                                <Select.Option
                                                  key="3"
                                                  value="venta"
                                                >
                                                  Venta
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
                                          label: "Tipo de Instrumento",
                                          id: "transInstrumentType",
                                          initialValue:
                                            fakeApi.transactions !== null
                                              ? transaction.transInstrumentType
                                                  .val
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
                                          wrapperCols: 12,
                                          item:
                                            format === "html" ? (
                                              <Select
                                                onChange={(value) =>
                                                  handleOnChangeFieldTransactions(
                                                    "transInstrumentType",
                                                    value
                                                  )
                                                }
                                              >
                                                <Select.Option key="1"></Select.Option>
                                                <Select.Option
                                                  key="2"
                                                  value="2"
                                                >
                                                  ACCIONES DE SOCIEDADES
                                                  ANONIMAS ABIERTAS - (ACC)
                                                </Select.Option>
                                                <Select.Option
                                                  key="3"
                                                  value="3"
                                                >
                                                  ACCIONES DE SOCIEDADES
                                                  ANONIMAS CERRADAS - (ACCR)
                                                </Select.Option>
                                                <Select.Option
                                                  key="4"
                                                  value="4"
                                                >
                                                  APORTES DE FINANCIAMIENTO
                                                  REEMBOLSABLES - (AFR)
                                                </Select.Option>
                                                <Select.Option
                                                  key="5"
                                                  value="5"
                                                >
                                                  BONOS DE BANCOS E
                                                  INSTITUCIONES FINANCIERAS –
                                                  (BB)
                                                </Select.Option>
                                                <Select.Option
                                                  key="6"
                                                  value="6"
                                                >
                                                  BONOS DE EMPRESAS - (BE)
                                                </Select.Option>
                                                <Select.Option
                                                  key="7"
                                                  value="7"
                                                >
                                                  BONOS EMITIDOS POR BANCOS Y
                                                  FINANCIERAS EXTRANJERAS -
                                                  (BBFE)
                                                </Select.Option>
                                                <Select.Option
                                                  key="8"
                                                  value="8"
                                                >
                                                  BONOS EMITIDOS POR EMPRESAS
                                                  EXTRANJERAS - (BEE)
                                                </Select.Option>
                                                <Select.Option
                                                  key="9"
                                                  value="9"
                                                >
                                                  BONOS EMPRESAS NACIONALES
                                                  EMITIDOS EN EL EXTRANJERO -
                                                  (BNEE)
                                                </Select.Option>
                                                <Select.Option
                                                  key="10"
                                                  value="10"
                                                >
                                                  BONOS SECURITIZADOS- (BS)
                                                </Select.Option>
                                                <Select.Option
                                                  key="11"
                                                  value="11"
                                                >
                                                  BONOS SUBORDINADOS - (BU)
                                                </Select.Option>
                                                <Select.Option
                                                  key="12"
                                                  value="12"
                                                >
                                                  EFECTOS DE COMERCIO - (EC)
                                                </Select.Option>
                                                <Select.Option
                                                  key="13"
                                                  value="13"
                                                >
                                                  LETRAS HIPOTECARIAS DE BANCOS
                                                  E INSTITUCIONES FINANCIERAS -
                                                  (LH)
                                                </Select.Option>
                                                <Select.Option
                                                  key="14"
                                                  value="14"
                                                >
                                                  MUTUOS HIPOTECARIOS EMITIDOS
                                                  POR BANCOS - (MHB)
                                                </Select.Option>
                                                <Select.Option
                                                  key="15"
                                                  value="15"
                                                >
                                                  OTROS INSTRUMENTOS DE DEUDA -
                                                  (OTROD)
                                                </Select.Option>
                                                <Select.Option
                                                  key="16"
                                                  value="16"
                                                >
                                                  OTROS INSTRUMENTOS DE
                                                  INVERSION DE RENTA FIJA -
                                                  (OTROF)
                                                </Select.Option>
                                                <Select.Option
                                                  key="17"
                                                  value="17"
                                                >
                                                  OTROS INSTRUMENTOS E
                                                  INVERSIONES FINANCIERAS -
                                                  (OIIF)
                                                </Select.Option>
                                                <Select.Option
                                                  key="18"
                                                  value="18"
                                                >
                                                  PAGARE DE EMPRESAS - (PE)
                                                </Select.Option>
                                                <Select.Option
                                                  key="19"
                                                  value="19"
                                                >
                                                  ACCIONES DE SOCIEDADES
                                                  EXTRANJERAS - (ACE)
                                                </Select.Option>
                                                <Select.Option
                                                  key="20"
                                                  value="20"
                                                >
                                                  AMERICAN DEPOSITARY RECEIPTS -
                                                  (ADR)
                                                </Select.Option>
                                                <Select.Option
                                                  key="21"
                                                  value="21"
                                                >
                                                  CERTIFICADO DE DEPOSITO DE
                                                  VALORES - (CDV)
                                                </Select.Option>
                                                <Select.Option
                                                  key="22"
                                                  value="22"
                                                >
                                                  CUOTAS DE FONDOS DE INVERSION
                                                  - (CFI)
                                                </Select.Option>
                                                <Select.Option
                                                  key="23"
                                                  value="23"
                                                >
                                                  CUOTAS DE FONDOS MUTUOS -
                                                  (CFM)
                                                </Select.Option>
                                                <Select.Option
                                                  key="24"
                                                  value="24"
                                                >
                                                  CUOTAS DE FONDOS MUTUOS
                                                  EXTRANJEROS - (CFME)
                                                </Select.Option>
                                                <Select.Option
                                                  key="25"
                                                  value="25"
                                                >
                                                  SIMULTANEAS - (SIM)
                                                </Select.Option>
                                                <Select.Option
                                                  key="26"
                                                  value="26"
                                                >
                                                  CALL AMERICANA MERCADO
                                                  ESTANDAR - (CAMS)
                                                </Select.Option>
                                                <Select.Option
                                                  key="27"
                                                  value="27"
                                                >
                                                  CALL AMERICANA OVER THE
                                                  COUNTER - (CAOC)
                                                </Select.Option>
                                                <Select.Option
                                                  key="28"
                                                  value="28"
                                                >
                                                  FORWARD COMPRADOR - (FWC)
                                                </Select.Option>
                                                <Select.Option
                                                  key="29"
                                                  value="29"
                                                >
                                                  FORWARD VENDEDOR - (FWV)
                                                </Select.Option>
                                                <Select.Option
                                                  key="30"
                                                  value="30"
                                                >
                                                  PACTO COMPROMISO DE COMPRA -
                                                  (PCCO)
                                                </Select.Option>
                                                <Select.Option
                                                  key="31"
                                                  value="31"
                                                >
                                                  PACTO CON COMPROMISO DE VENTA
                                                  - (PCV)
                                                </Select.Option>
                                                <Select.Option
                                                  key="32"
                                                  value="32"
                                                >
                                                  PACTO DE COMPRA CON COMPROMISO
                                                  DE VENTA - (PCCV)
                                                </Select.Option>
                                                <Select.Option
                                                  key="33"
                                                  value="33"
                                                >
                                                  PACTO DE VENTA CON COMPROMISO
                                                  DE COMPRA - (PVCC)
                                                </Select.Option>
                                                <Select.Option
                                                  key="34"
                                                  value="34"
                                                >
                                                  SWAPS - (S)
                                                </Select.Option>
                                                <Select.Option
                                                  key="35"
                                                  value="35"
                                                >
                                                  OTROS
                                                </Select.Option>
                                              </Select>
                                            ) : (
                                              <Input />
                                            ),
                                        })}

                                        {renderFormItem({
                                          label: "Serie",
                                          id: "transSerie",
                                          initialValue:
                                            transaction.transSerie.val,
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
                                          wrapperCols: 6,
                                          item:
                                            format === "html" ? (
                                              <Select
                                                onChange={(value) =>
                                                  handleOnChangeFieldTransactions(
                                                    "transSerie",
                                                    value
                                                  )
                                                }
                                              >
                                                <Select.Option key="1"></Select.Option>
                                                <Select.Option
                                                  key="2"
                                                  value="unica"
                                                >
                                                  Única
                                                </Select.Option>
                                                <Select.Option
                                                  key="3"
                                                  value="otros"
                                                >
                                                  Otros
                                                </Select.Option>
                                              </Select>
                                            ) : (
                                              <Input />
                                            ),
                                        })}

                                        {transaction.transSerie.val ===
                                          "otros" &&
                                          renderFormItem({
                                            label: "Indique Serie",
                                            id: "transSerieCode",
                                            initialValue:
                                              fakeApi.transactions !== null
                                                ? transaction.transSerieCode.val
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
                                            wrapperCols: 6,
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
                                      </Row>

                                      <Row
                                        className="fields-row"
                                        gutter={[16, 8]}
                                      >
                                        {renderFormItem({
                                          label: "Unidades Transadas",
                                          id: "transUnits",
                                          initialValue:
                                            fakeApi.transactions !== null
                                              ? transaction.transUnits.val
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
                                          wrapperCols: 6,
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
                                          label: "Expresado en",
                                          id: "transExpresado",
                                          initialValue:
                                            transaction.transExpresado.val,
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
                                          wrapperCols: 6,
                                          item:
                                            format === "html" ? (
                                              <Select
                                                onChange={(value) =>
                                                  handleOnChangeFieldTransactions(
                                                    "transExpresado",
                                                    value
                                                  )
                                                }
                                              >
                                                <Select.Option key="1"></Select.Option>
                                                <Select.Option
                                                  key="2"
                                                  value="UF"
                                                >
                                                  UF
                                                </Select.Option>
                                                <Select.Option
                                                  key="3"
                                                  value="Pesos Chilenos"
                                                >
                                                  Pesos Chilenos
                                                </Select.Option>
                                              </Select>
                                            ) : (
                                              <Input />
                                            ),
                                        })}

                                        {renderFormItem({
                                          label:
                                            format === "html"
                                              ? "Precio Unitario de Transacción"
                                              : "Precio Unitario",
                                          id: "transUnitPrice",
                                          initialValue:
                                            fakeApi.transactions !== null
                                              ? transaction.transUnitPrice.val
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
                                          wrapperCols: 6,
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
                                          label: "Total transado",
                                          id: "transTotal",
                                          initialValue:
                                            fakeApi.transactions !== null
                                              ? transaction.transUnits.val !==
                                                  "" &&
                                                transaction.transUnitPrice
                                                  .val !== ""
                                                ? parseInt(
                                                    transaction.transUnitPrice
                                                      .val
                                                  ) *
                                                  parseInt(
                                                    transaction.transUnits.val
                                                  )
                                                : 0
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
                                          wrapperCols: 6,
                                          item: (
                                            <Input
                                              disabled
                                              // onChange={(e) =>
                                              //   handleOnChangeFieldTransactions(
                                              //     e.target.id,
                                              //     e.target.value
                                              //   )
                                              // }
                                            />
                                          ),
                                        })}
                                      </Row>

                                      {format === "html" && (
                                        <Row className="button-row">
                                          <Col className="addRelation" xl={24}>
                                            <Button
                                              type="primary"
                                              htmlType="button"
                                              onClick={handleOnAddTransactions}
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
                              )}

                            <Row
                              className="content submit-content"
                              style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                            >
                              <Row className="summary">
                                <Col xl={24}>
                                  Certifico que mis respuestas están completas y
                                  son correctas a mi mejor saber y entender.
                                  Además, acepto que tengo la obligación
                                  permanente de comunicar a la brevedad y por
                                  escrito a la Compañía, en el evento que se
                                  originen cambios a la presente declaración
                                  antes de la siguiente presentación, con el
                                  objeto de que se proceda a actualizar los
                                  antecedentes entregados, y si fuera el caso,
                                  también tengo la obligación de inhibirme de
                                  tomar decisiones que pudieran verse afectadas
                                  por un posible conflicto de interés declarado
                                  mientras este no se resuelva.
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

export default withRouter(Form.create()(FormValues));
