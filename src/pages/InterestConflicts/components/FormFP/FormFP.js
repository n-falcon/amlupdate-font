import "./formFP.scss";
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
import { validateRutHelper, validateCompanyRutHelper } from "../../../../helpers";

const FormFP = ({ form, match, formId }) => {
  const { t } = useTranslation();
  const { getFieldDecorator, getFieldsError, validateFields, setFieldsValue, getFieldError } = form;
  const [hasValidateMsg, setHasValidateMsg] = useState(true);
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
  const [sentErrors, setSentErrors] = useState(0);

  const baseParamsIS = {
      gerencia: {key:'gerencia', max:100, id:'gerencia', readOnly:true, type:'input'},
      cargo: {key:'cargo',max:100, id:'cargo', readOnly:true, type:'input'},
      jefatura: {key:'jefatura',max:100, id:'jefatura', readOnly:true,type:'input'},
      mailJefatura: {key:'mailJefatura',max:100, id:'mailJefatura', readOnly:true,type:'input'},
      nombreAcom: {key:'nombre',max:100, id:'nombreAcom', readOnly:true,type:'input'},
      tipoDoc: {key:'tipoDoc',max:100, id:'tipoDoc', readOnly:true,type:'select'},
      rutAcom: {key:'rut',max:100, id:'rutAcom', readOnly:true,type:'input'},
      gerenciaAcom: {key:'gerencia',max:100, id:'gerenciaAcom', readOnly:true,type:'input'},
      cargoAcom: {key:'cargo',max:100, id:'cargoAcom', readOnly:true,type:'input'},
      organismReu: {key:'organism',max:100, id:'organismReu', readOnly:true,type:'input'},
      type: {key:'type',max:100, id:'type', readOnly:true,type:'select'},
      folioReu: {key:'folio',max:50, id:'folioReu', readOnly:true,type:'input'},
      reason: {key:'reason',max:100, id:'reason', readOnly:true,type:'input'},
      partName1: {key:'partName1',max:100, id:'partName1', readOnly:true,type:'input'},
      partRole1: {key:'partRole1',max:100, id:'partRole1', readOnly:true,type:'input'},
      partName2: {key:'partName2',max:100, id:'partName2', readOnly:true,type:'input'},
      partRole2: {key:'partRole2',max:100, id:'partRole2', readOnly:true,type:'input'},
      date: {key:'date',max:10, id:'date', readOnly:true,type:'date'},
      place: {key:'place',max:100, id:'place', readOnly:true,type:'input'},
      summary: {key:'summary',max:4000, id:'summary', readOnly:true,type:'textArea'},
      anomalies: {key:'anomalies',max:4000, id:'anomalies', readOnly:true,type:'textArea'},
  }
  const [baseParams, setBaseParams]=useState(baseParamsIS)


  const handleReadOnly = (field,readOnly)=>{
    const key = Object.entries(baseParams).filter(([key,value])=>{
      return value.id === field
    })[0][0]
    setBaseParams({...baseParams,[key]:{...baseParams[key],readOnly:readOnly}})
  }

  const validateLengthBaseParam = (field)=>
  {
    return {
      max: field.max,
      message: "Debe tener un máximo de "+ field.max + " caracteres"
    }
  }

  const testLengthBaseParams = (offset)=>{
    const test = Object.entries(baseParams).filter(([key,value])=>{
      return value.type!=='date'
    }).reduce((acu,item)=>{
      return {...acu, [item[1].id]: 'x'.repeat(item[1].max+offset)}
    },{})
    setFieldsValue(test)
    validateFields(Object.values(baseParams).map(obj=>obj.id))
  }

  const doTests = ()=>{
    setTimeout(()=>{
      testLengthBaseParams(1)
    },1000)
  }

  function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some((field) => fieldsError[field]);
  }

  const handleSubmit = async (e) => {
    let idForm = formId ? formId : match.params.id;  

    e.preventDefault();
    setHasValidateMsg(true);
    validateFields();
    if (hasErrors(getFieldsError())) {
      notification["warning"]({
        message: t("messages.aml.missingRequiredField"),
      });
    } else {
      sendFormPromise(idForm).then((response) => {
        if (response.code === "OK") {
          let formSend = { ...apiForm, status: "SENT" };
          setApiForm(formSend);
        } else {
          let errores = sentErrors+1
          setSentErrors(errores)

          notification["error"]({
            message: t("messages.aml.notifications.anErrorOcurred"),
            description: errores === 1 ? 'Error Interno: Actualice y reintente.' : 'Comuníquese con soporte.aml@gesintel.cl'
          });
          setApiForm(response.form);
        }
      });
    }
  };

  let formToUpdate = {};

  const saveFormPromiseLocal = async (form) => {
    let response = await saveFormPromise(form);
    if(response.code !== 'OK' && response.form !== undefined && response.form !== null) {
      setApiForm(response.form)
      if(response.code === 'ERROR') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
        });
      }else if(response.code === 'E01') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
          description: 'Error al grabar datos del formulario'
        });
      }else if(response.code === 'E02') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
          description: 'Error al grabar datos del formulario'
        });
      }else if(response.code === 'E03') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
          description: 'Error al grabar datos del formulario'
        });
      }else if(response.code === 'E04') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
          description: 'Error al limiar datos'
        });
      }else if(response.code === 'E05') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
          description: 'Error al grabar datos de Participación en Otras Sociedades'
        });
      }else if(response.code === 'E06') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
          description: 'Error al grabar datos de Relaciones laborales anteriores'
        });
      }else if(response.code === 'E07') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
          description: 'Error al grabar datos de Participación en la Propiedad'
        });
      }else if(response.code === 'E08') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
          description: 'Error al grabar datos de PEP/FP'
        });
      }else if(response.code === 'E09') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
          description: 'Error al grabar datos de Otros conflictos de interés'
        });
      }else if(response.code === 'E10') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
          description: 'Error al grabar datos de Malla Parental'
        });
      }else if(response.code === 'E11') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
          description: 'Error al grabar datos de Actividades'
        });
      }else if(response.code === 'E12') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
          description: 'Error al grabar datos de Otras sociedades o personas jurídicas'
        });
      }else if(response.code === 'E13') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
          description: 'Error al grabar datos de Personas juridicas sin fines de lucro'
        });
      }else if(response.code === 'E14') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
          description: 'Error al grabar datos de Servicios de asesoria y consultoria'
        });
      }else if(response.code === 'E15') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
          description: 'Error al grabar datos de Partes relacionadas'
        });
      }else if(response.code === 'E16') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
          description: 'Error al grabar datos de Partes relacionadas'
        });
      }else if(response.code === 'E17') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
          description: 'Error al grabar datos de Interes en la propiedad'
        });
      }else if(response.code === 'E18') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
          description: 'Error al grabar datos de Responsabilidad penal'
        });
      }
      return { success: false, form: response.form}
    }else {
      setApiForm(form)
      return { success: true }
    }
  }

  const handleOnChange = async (fieldObj, value) => {
      formToUpdate = { ...apiForm, [fieldObj.key]: value };
      saveFormPromiseLocal(formToUpdate).then((ret)=>{
        if(!ret.success) {
          //setFieldsValue({[field]: ret.form[field]})
        }
      });
  };

  const handleOnChangeAcomp = async (fieldObj, value, fieldForm) => {
    formToUpdate = {...apiForm,acompanante: { ...apiForm.acompanante, [fieldObj.key]: value }};
    saveFormPromiseLocal(formToUpdate).then((ret)=>{
      if(!ret.success) {
        //setFieldsValue({[fieldForm]: ret.form.acompanante[field]})
      }
    })
  };

  const handleOnChangeReunion = async (fieldObj, value, fieldForm) => {
      formToUpdate = {...apiForm, reunion: { ...apiForm.reunion, [fieldObj.key]: value }};
      saveFormPromiseLocal(formToUpdate).then((ret)=>{
        if(!ret.success) {
          //setFieldsValue({[fieldForm]: ret.form.reunion[field]})
        }
      })
  };

  const checkRut = (rule, value, cb) => {
    if (value !== null && value !== undefined && value !== "") {
      if (!validateRutHelper(value)) {
        cb("Documento no válido");
      } else {
        cb();
      }
    } else {
      cb();
    }
  };

  const rutValidator = (rule, value, cb) => {
    if (value && !validateRutHelper(value)) {
      cb("Documento no válido");
    }
    cb();
  };

  const rutValidatorCompany = (rule, value, cb) => {
    if (value && !validateCompanyRutHelper(value)) {
      cb("Documento no válido");
    }
    cb();
  };

  const docValidator = (tipoDoc,company=false) => {
    if (tipoDoc === "Chile-Rut")
      if (company === false)
        return rutValidator
      else
        return rutValidatorCompany;
    else return null;
  };

  useEffect(() => {
    let idForm = formId ? formId : match.params.id;  

    setIsloading(true);
    getFormPromise(idForm).then((response) => {
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

        if(response.data.status === "SENT") {
          setDate(moment(response.data.receiveDate).format("DD-MM-YYYY"));
        }else {
          setDate(moment().format("DD-MM-YYYY"));
        }
      }
      setIsloading(false);
      if (match.params.view === "pdf") {
        setColLogo(5);
        setFormat("pdf");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // doTests();
  }, []);

  useEffect(() => {
    validateFields(["rutAcom"]);
  }, [apiForm]);

  const renderFormItem = (formItem) => {
    return (
      <Col
        className={formItem.colClassName}
        span={formItem.wrapperCols}
        offset={formItem.offset}
      >
        <Form.Item
          className="field"
          label={formItem.label}
          labelCol={formItem.labelCol > 0 ? { span: formItem.labelCol } : ""}
          wrapperCol={
            formItem.labelCol > 0 ? { span: formItem.wrapperCol } : ""
          }
        >
          {getFieldDecorator(formItem.name, {
            rules: formItem.rules,
            initialValue: formItem.initialValue,
          })(formItem.item)}
        </Form.Item>
      </Col>
    );
  };

  return (
    <div className="form-fp">
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
                          {
                            format === "html" ?
                            <h3>
                            DECLARACIÓN DE REUNIÓN CON AUTORIDADES Y
                            FUNCIONARIOS PÚBLICOS
                          </h3>
                          :
                          <h4>
                          DECLARACIÓN DE REUNIÓN CON AUTORIDADES Y
                          FUNCIONARIOS PÚBLICOS
                        </h4>
                          }
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
                            <strong>{apiForm.recipient.record.nombre}</strong>,
                            le informamos que su declaración fue correctamente
                            completada, agradecemos su tiempo y disposición.
                            <br />
                            <br />
                            Hemos enviado una copia de la declaración realizada
                            al mail registrado:{" "}
                            <strong>{apiForm.recipient.record.email}</strong>
                          </h3>
                        </>
                      ) : (
                        <>
                          <Row
                            className="lineamiento subheader"
                            style={{ marginTop: "0px" }}
                          >
                            <Col xl={24}>Lineamiento</Col>
                          </Row>

                          <Row className="summary">
                            <Col xl={24}>
                              La Compañía declara su compromiso de adherir y
                              promover prácticas de transparecia en sus
                              relaciones con autoridades y/o funcionarios
                              públicos. Toda reunión u otra instancia de
                              contacto que deba sostenerse con una autoridad y/o
                              funcionario público deberá contar con la
                              asistencia mínima de dos representantes de la
                              Empresa. Se deberá siempre informar al superior
                              directo de la existencia de la reunión.
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
                                name: "nombre",
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
                                label: "Documento",
                                name: "rut",
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
                                label: "Empresa",
                                name: "empresa",
                                initialValue:
                                  apiForm.recipient.record.subcliente !== null
                                    ? apiForm.recipient.record.subcliente.name
                                    : apiForm.recipient.request.createUser
                                        .cliente.name,
                                colClassName: "topLabel",
                                labelCol: 0,
                                wrapperCol: 0,
                                rules: [
                                  {
                                    required: true,
                                    message: t(
                                      "messages.aml.dontForgetEmpresa"
                                    ),
                                  },
                                ],
                                wrapperCols: 8,
                                item: <Input disabled={true} />,
                              })}

                              {renderFormItem({
                                label: "Gerencia",
                                name: baseParamsIS.gerencia.id,
                                x:10,
                                initialValue: apiForm.gerencia,
                                colClassName: "topLabel",
                                labelCol: 0,
                                wrapperCol: 0,
                                rules: [
                                  {
                                    required: true,
                                    message: t(
                                      "messages.aml.dontForgetGerencia"
                                    ),
                                  },
                                  validateLengthBaseParam(baseParamsIS.gerencia),
                                ],
                                wrapperCols: 8,
                                item: (
                                  <Input
                                    autoComplete="off"
                                    onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                    onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                    readOnly = {baseParams.gerencia.readOnly} 
                                    onChange={(e) => handleOnChange(baseParamsIS.gerencia, e.target.value) }
                                  />
                                ),
                              })}

                              {renderFormItem({
                                label: "Cargo",
                                name: baseParamsIS.cargo.id,
                                initialValue: apiForm.cargo,
                                colClassName: "topLabel",
                                labelCol: 0,
                                wrapperCol: 0,
                                rules: [
                                  {
                                    required: true,
                                    message: t("messages.aml.dontForgetCargo"),
                                  },
                                  validateLengthBaseParam(baseParamsIS.cargo),
                                ],
                                wrapperCols: 8,
                                item: (
                                  <Input
                                    autoComplete="off"
                                    onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                    onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                    readOnly = {baseParams.cargo.readOnly} 
                                    onChange={(e) => handleOnChange(baseParamsIS.cargo, e.target.value) }
                                  />
                                ),
                              })}
                            </Row>

                            <Row className="fields-row" gutter={[16, 8]}>
                              {renderFormItem({
                                label: "Nombre de Jefatura",
                                name: baseParamsIS.jefatura.id,
                                initialValue: apiForm.jefatura,
                                colClassName: "leftLabel",
                                labelCol: 0,
                                wrapperCol: 0,
                                rules: [
                                  {
                                    required: true,
                                    message: t(
                                      "messages.aml.dontForgetNombreJefatura"
                                    ),
                                  },
                                  validateLengthBaseParam(baseParamsIS.jefatura),
                                ],
                                wrapperCols: 16,
                                item: (
                                  <Input
                                    autoComplete="off"
                                    onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                    onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                    readOnly = {baseParams.jefatura.readOnly} 
                                    onChange={(e) => handleOnChange(baseParamsIS.jefatura, e.target.value) }
                                  />
                                ),
                              })}

                              {renderFormItem({
                                label: "Correo de Jefatura",
                                name: baseParamsIS.mailJefatura.id,
                                initialValue: apiForm.mailJefatura,
                                colClassName: "leftLabel",
                                labelCol: 0,
                                wrapperCol: 0,
                                rules: [
                                  {
                                    required: true,
                                    message: t(
                                      "messages.aml.dontForgetCorreoJefatura"
                                    ),
                                  },
                                  validateLengthBaseParam(baseParamsIS.mailJefatura),
                                ],
                                wrapperCols: 8,
                                item: (
                                  <Input
                                    autoComplete="off"
                                    onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                    onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                    readOnly = {baseParams.mailJefatura.readOnly} 
                                    onChange={(e) => handleOnChange(baseParamsIS.mailJefatura, e.target.value ) }
                                  />
                                ),
                              })}
                            </Row>
                          </Row>

                          <Row className="subheader">
                            <Col xl={24}>Trabajador(a) acompañante</Col>
                          </Row>

                          <Row className="content">
                            <Row className="fields-row" gutter={[16, 8]}>
                              {renderFormItem({
                                label: "Nombre",
                                name: baseParamsIS.nombreAcom.id,
                                initialValue:
                                  apiForm.acompanante !== null
                                    ? apiForm.acompanante.nombre
                                    : null,
                                colClassName: "topLabel",
                                labelCol: 0,
                                wrapperCol: 0,
                                rules: [
                                  {
                                    required: true,
                                    message: t(
                                      "messages.aml.dontForgetNombreAcompanante"
                                    ),
                                  },
                                  validateLengthBaseParam(baseParamsIS.nombreAcom),
                                ],
                                wrapperCols: 16,
                                item: (
                                  <Input
                                    autoComplete="off"
                                    onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                    onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                    readOnly = {baseParams.nombreAcom.readOnly} 
                                    onChange={(e) => handleOnChangeAcomp(baseParamsIS.nombreAcom, e.target.value, "nombreAcom" ) }
                                  />
                                ),
                              })}


                          {renderFormItem({
                            label: "Tipo de documento de identidad",
                            name: baseParamsIS.tipoDoc.id,

                            colClassName: "topLabel",
                            labelCol: 0,
                            wrapperCol: 0,
                            initialValue:
                              apiForm.acompanante !== null
                                ? apiForm.acompanante.tipoDoc
                                : null,
                            rules: [
                              {
                                required: false,
                                message: t(
                                  "messages.aml.requestedField"
                                ),
                              },
                            ],
                            wrapperCols: 8,
                            item: (
                              format === 'html' ? (
                              <Select
                                onChange={(value) => handleOnChangeAcomp(baseParamsIS.tipoDoc, value, "tipoDoc") }
                                // value={apiForm.reunion.type}
                              >
                                <Select.Option key="1" value="Chile-Rut">
                                  Chile-Rut
                                </Select.Option>
                                <Option key="2" value="Otros">
                                  Otros
                                </Option>
                              </Select>) : (
                                <Input/>
                              )
                            ),
                          })}


                            </Row>

                            <Row className="fields-row" gutter={[16, 8]}>
                            {renderFormItem({
                                label: "Documento",
                                name: baseParamsIS.rutAcom.id,
                                initialValue:
                                  apiForm.acompanante !== null
                                    ? apiForm.acompanante.rut
                                    : null,
                                colClassName: "topLabel",
                                labelCol: 0,
                                wrapperCol: 0,
                                rules: [
                                  {
                                    required: true,
                                    message: t(
                                      "messages.aml.dontForgetRutAcompanante"
                                    ),
                                  },
                                  {
                                    validator: docValidator(apiForm.acompanante !== null ? apiForm.acompanante.tipoDoc : null),
                                  },
                                  validateLengthBaseParam(baseParamsIS.rutAcom),
                                ],
                                wrapperCols: 8,
                                item: (
                                  <Input
                                    autoComplete="off"
                                    onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                    onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                    readOnly = {baseParams.rutAcom.readOnly} 
                                    onChange={(e) => handleOnChangeAcomp(baseParamsIS.rutAcom, e.target.value, "rutAcom") }
                                  />
                                ),
                              })}
                              {renderFormItem({
                                label: "Gerencia",
                                name: baseParamsIS.gerenciaAcom.id,
                                initialValue:
                                  apiForm.acompanante !== null
                                    ? apiForm.acompanante.gerencia
                                    : null,
                                colClassName: "topLabel",
                                labelCol: 0,
                                wrapperCol: 0,
                                rules: [
                                  {
                                    required: true,
                                    message: t(
                                      "messages.aml.dontForgetGerencia"
                                    ),
                                  },
                                  validateLengthBaseParam(baseParamsIS.gerenciaAcom),
                                ],
                                wrapperCols: 8,
                                item: (
                                  <Input
                                    autoComplete="off"
                                    onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                    onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                    readOnly = {baseParams.gerenciaAcom.readOnly} 
                                    onChange={(e) => handleOnChangeAcomp(baseParamsIS.gerenciaAcom, e.target.value, "gerenciaAcom" ) }
                                  />
                                ),
                              })}

                              {renderFormItem({
                                label: "Cargo",
                                name: baseParamsIS.cargoAcom.id,
                                initialValue:
                                  apiForm.acompanante !== null
                                    ? apiForm.acompanante.cargo
                                    : null,
                                colClassName: "topLabel",
                                labelCol: 0,
                                wrapperCol: 0,
                                rules: [
                                  {
                                    required: true,
                                    message: t("messages.aml.dontForgetCargo"),
                                  },
                                  validateLengthBaseParam(baseParamsIS.cargoAcom),
                                ],
                                wrapperCols: 8,
                                item: (
                                  <Input
                                    autoComplete="off"
                                    onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                    onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                    readOnly = {baseParams.cargoAcom.readOnly} 
                                    onChange={(e) => handleOnChangeAcomp(baseParamsIS.cargoAcom, e.target.value, "cargoAcom" ) }
                                  />
                                ),
                              })}
                            </Row>
                          </Row>

                          <Row className="subheader">
                            <Col xl={24}>Datos de la reunión</Col>
                          </Row>

                          <Row className="content" style={{ padding: "0px" }}>
                            <Row className="fields-row" gutter={[16, 8]}>
                              {renderFormItem({
                                label:
                                  "Organismo Público (Nacional o Extranjero)",
                                name: baseParamsIS.organismReu.id,
                                initialValue:
                                  apiForm.reunion !== null
                                    ? apiForm.reunion.organism
                                    : null,
                                colClassName: "leftLabel",
                                labelCol: 7,
                                wrapperCol: 17,
                                rules: [
                                  {
                                    required: true,
                                    message: t(
                                      "messages.aml.dontForgetOrganismo"
                                    ),
                                  },
                                  validateLengthBaseParam(baseParamsIS.organismReu),
                                ],
                                wrapperCols: 24,
                                item: (
                                  <Input
                                    autoComplete="off"
                                    onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                    onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                    readOnly = {baseParams.organismReu.readOnly} 
                                    onChange={(e) => handleOnChangeReunion( baseParamsIS.organismReu, e.target.value, "organismReu" ) }
                                  />
                                ),
                              })}
                            </Row>

                            <Row className="fields-row" gutter={[16, 8]}>
                              {renderFormItem({
                                label: "Tipo de reunión",
                                name: baseParamsIS.type.id,
                                initialValue:
                                  apiForm.reunion !== null
                                    ? apiForm.reunion.type
                                    : null,
                                colClassName: "leftLabel",
                                labelCol: 7,
                                wrapperCol: 17,
                                rules: [
                                  {
                                    required: true,
                                    message: t(
                                      "messages.aml.dontForgetTipoReunion"
                                    ),
                                  },
                                ],
                                wrapperCols: 24,
                                item:
                                  format === "html" ?
                                    <Select
                                      onChange={(e) =>
                                        handleOnChangeReunion(baseParamsIS.type, e, "type")
                                      }
                                    >
                                      <Select.Option key="1"></Select.Option>
                                      <Select.Option key="2" value="Reunión">
                                        Reunión
                                      </Select.Option>
                                      <Option
                                        key="3"
                                        value="Gestión de trámites"
                                      >
                                        Gestión de trámites
                                      </Option>
                                      <Option key="4" value="Audiencia">
                                        Audiencia
                                      </Option>
                                      <Option key="5" value="Mesa de trabajo">
                                        Mesa de trabajo
                                      </Option>
                                    </Select>
                                   :
                                    <Input />
                                  ,
                              })}
                            </Row>

                            <Row className="fields-row" gutter={[16, 8]}>
                              {renderFormItem({
                                label: "Folio Audiencia Lobby (aplica sólo Ley del Lobby)",
                                name: baseParamsIS.folioReu.id,
                                initialValue:
                                  apiForm.reunion !== null
                                    ? apiForm.reunion.folio
                                    : null,
                                colClassName: "leftLabel",
                                labelCol: 7,
                                wrapperCol: 17,
                                rules: [
                                  validateLengthBaseParam(baseParamsIS.folioReu),
                                ],
                                wrapperCols: 24,
                                item: (
                                  <Input
                                    autoComplete="off"
                                    onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                    onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                    readOnly = {baseParams.folioReu.readOnly} 
                                    onChange={(e) => handleOnChangeReunion( baseParamsIS.folioReu, e.target.value, "folioReu" ) }
                                  />
                                ),
                              })}
                            </Row>

                            <Row className="fields-row" gutter={[16, 8]}>
                              {renderFormItem({
                                label: "Motivo",
                                name: baseParamsIS.reason.id,
                                initialValue:
                                  apiForm.reunion !== null
                                    ? apiForm.reunion.reason
                                    : null,
                                colClassName: "leftLabel",
                                labelCol: 7,
                                wrapperCol: 17,
                                rules: [
                                  {
                                    required: true,
                                    message: t(
                                      "messages.aml.dontForgetMotivoReunion"
                                    ),
                                  },
                                  validateLengthBaseParam(baseParamsIS.reason),
                                ],
                                wrapperCols: 24,
                                item: (
                                  <Input
                                    autoComplete="off"
                                    onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                    onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                    readOnly = {baseParams.reason.readOnly} 
                                    onChange={(e) => handleOnChangeReunion( baseParamsIS.reason, e.target.value, "reason" ) }
                                  />
                                ),
                              })}
                            </Row>

                            <Row
                              className="middle-msg"
                              gutter={[0, 6]}
                              style={{
                                backgroundColor: "opacity(0%)",
                                marginTop: "20px",
                                marginBottom: "0px",
                                paddingLeft: "0px",
                              }}
                            >
                              <Col xl={24} style = {{marginBottom:"8px"}}>
                                Autoridad o Funcionario Público Participante
                                (señale 2, según su jerarquía){" "}
                              </Col>

                            </Row>

                            <Row className="fields-row" gutter={[16, 8]}>
                              {renderFormItem({
                                label: "Nombre",
                                name: baseParamsIS.partName1.id,
                                initialValue:
                                  apiForm.reunion !== null
                                    ? apiForm.reunion.partName1
                                    : null,
                                colClassName: "topLabel",
                                labelCol: 0,
                                wrapperCol: 0,
                                rules: [
                                  {
                                    required: true,
                                    message: t(
                                      "messages.aml.dontForgetNombreFuncionario"
                                    ),
                                  },
                                  validateLengthBaseParam(baseParamsIS.partName1),
                                ],
                                wrapperCols: 16,
                                item: (
                                  <Input
                                    autoComplete="off"
                                    onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                    onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                    readOnly = {baseParams.partName1.readOnly} 
                                    onChange={(e) => handleOnChangeReunion( baseParamsIS.partName1, e.target.value, "partName1" ) }
                                  />
                                ),
                              })}

                              {renderFormItem({
                                label: "Cargo",
                                name: baseParamsIS.partRole1.id,
                                initialValue:
                                  apiForm.reunion !== null
                                    ? apiForm.reunion.partRole1
                                    : null,
                                colClassName: "topLabel",
                                labelCol: 0,
                                wrapperCol: 0,
                                rules: [
                                  {
                                    required: true,
                                    message: t(
                                      "messages.aml.dontForgetCargoFuncionario"
                                    ),
                                  },
                                  validateLengthBaseParam(baseParamsIS.partRole1),
                                ],
                                wrapperCols: 8,
                                item: (
                                  <Input
                                    autoComplete="off"
                                    onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                    onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                    readOnly = {baseParams.partRole1.readOnly} 
                                    onChange={(e) => handleOnChangeReunion( baseParamsIS.partRole1, e.target.value, "partRole1" ) }
                                  />
                                ),
                              })}
                            </Row>

                            <Row className="fields-row" gutter={[16, 8]}>
                              {renderFormItem({
                                label: "Nombre",
                                name: baseParamsIS.partName2.id,
                                initialValue:
                                  apiForm.reunion !== null
                                    ? apiForm.reunion.partName2
                                    : null,
                                colClassName: "topLabel",
                                labelCol: 0,
                                wrapperCol: 0,
                                rules: [
                                  validateLengthBaseParam(baseParamsIS.partName2),
                                ],
                                wrapperCols: 16,
                                item: (
                                  <Input
                                    autoComplete="off"
                                    onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                    onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                    readOnly = {baseParams.partName2.readOnly} 
                                    onChange={(e) => handleOnChangeReunion( baseParamsIS.partName2, e.target.value, "partName2" ) }
                                  />
                                ),
                              })}

                              {renderFormItem({
                                label: "Cargo",
                                name: baseParamsIS.partRole2.id,
                                initialValue:
                                  apiForm.reunion !== null
                                    ? apiForm.reunion.partRole2
                                    : null,
                                colClassName: "topLabel",
                                labelCol: 0,
                                wrapperCol: 0,
                                rules: [
                                  validateLengthBaseParam(baseParamsIS.partRole2),
                                ],
                                wrapperCols: 8,
                                item: (
                                  <Input
                                    autoComplete="off"
                                    onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                    onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                    readOnly = {baseParams.partRole2.readOnly} 
                                    onChange={(e) => handleOnChangeReunion( baseParamsIS.partRole2, e.target.value, "partRole2" ) }
                                  />
                                ),
                              })}
                            </Row>

                            <Row className="fields-row" gutter={[16, 8]}>
                              {renderFormItem({
                                label: "Fecha de Reunión",
                                name: baseParamsIS.date.id,
                                initialValue:
                                  apiForm.reunion !== null &&
                                  apiForm.reunion.date !== undefined &&
                                  apiForm.reunion.date !== null
                                    ? format === "html"
                                      ? moment(apiForm.reunion.date)
                                      : moment(apiForm.reunion.date).format(
                                          "DD/MM/YYYY"
                                        )
                                    : null,
                                colClassName: "leftLabel",
                                labelCol: 13,
                                wrapperCol: 11,
                                rules: [
                                  {
                                    required: true,
                                    message: t(
                                      "messages.aml.dontForgetMeetingDate"
                                    ),
                                  },
                                ],
                                wrapperCols: 10,
                                item:
                                  format === "html" ?
                                    <DatePicker
                                      format={dateFormat}
                                      onChange={(momentObj) => handleOnChangeReunion( baseParamsIS.date, momentObj !== null ? momentObj.valueOf() : null ,"date" ) }
                                    />
                                   :
                                    <Input />
                                  ,
                              })}

                              {renderFormItem({
                                label: "Lugar de Reunión",
                                name: baseParamsIS.place.id,
                                initialValue:
                                  apiForm.reunion !== null
                                    ? apiForm.reunion.place
                                    : null,
                                colClassName: "leftLabel",
                                labelCol: 9,
                                wrapperCol: 15,
                                rules: [
                                  {
                                    required: true,
                                    message: t(
                                      "messages.aml.dontForgetMeetingPlace"
                                    ),
                                  },
                                  validateLengthBaseParam(baseParamsIS.place),
                                ],
                                wrapperCols: 14,
                                item: (
                                  <Input
                                    autoComplete="off"
                                    onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                    onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                    readOnly = {baseParams.place.readOnly} 
                                    onChange={(e) => handleOnChangeReunion( baseParamsIS.place, e.target.value, "place" ) }
                                  />
                                ),
                              })}
                            </Row>

                            <Row
                              className="resumen"
                              style={{ paddingTop: "25px" }}
                            >
                              {renderFormItem({
                                label:
                                  "Resumen de reunión (incluya aquí acuerdos, solicitudes, otros)",
                                name: baseParamsIS.summary.id,
                                initialValue:
                                  apiForm.reunion !== null
                                    ? apiForm.reunion.summary
                                    : null,
                                colClassName: "topLabel",
                                labelCol: 24,
                                wrapperCol: 24,
                                rules: [
                                  {
                                    required: true,
                                    message: t(
                                      "messages.aml.dontForgetMeetingSummary"
                                    ),
                                  },
                                  validateLengthBaseParam(baseParamsIS.summary),
                                ],
                                wrapperCols: 24,
                                item:
                                  format === "html" ? (
                                    <TextArea
                                      autoComplete="off"
                                      onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                      onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                      readOnly = {baseParams.summary.readOnly} 
                                      defaultValue={
                                        apiForm.reunion !== null
                                          ? apiForm.reunion.summary
                                          : null
                                      }
                                      autoSize={{ minRows: 3, maxRows: 4 }}
                                      style={{ width: "100%" }}
                                      onChange={(e) => handleOnChangeReunion( baseParamsIS.summary, e.target.value, "summary" ) }
                                    />
                                  ) : (
                                    <pre className="obs">{apiForm.reunion !== null?apiForm.reunion.summary:null}</pre>
                                  ),
                              })}
                            </Row>

                            <Row className="anomalies">
                              {renderFormItem({
                                label:
                                  "Si corresponde, indicar anomalías durante el proceso",
                                name: baseParamsIS.anomalies.id,
                                initialValue:
                                  apiForm.reunion !== null
                                    ? apiForm.reunion.anomalies
                                    : null,
                                colClassName: "topLabel",
                                labelCol: 24,
                                wrapperCol: 24,
                                wrapperCols: 24,
                                rules: [
                                  validateLengthBaseParam(baseParamsIS.anomalies),
                                ],
                                item:
                                  format === "html" ? (
                                    <TextArea
                                      autoComplete="off"
                                      onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                      onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                      readOnly = {baseParams.anomalies.readOnly} 
                                      defaultValue={
                                        apiForm.reunion !== null
                                          ? apiForm.reunion.anomalies
                                          : null
                                      }
                                      autoSize={{ minRows: 3, maxRows: 4 }}
                                      style={{ width: "100%" }}
                                      onChange={(e) => handleOnChangeReunion( baseParamsIS.anomalies, e.target.value, "anomalies" ) }
                                    />
                                  ) : (
                                    <pre className="obs">{apiForm.reunion !== null?apiForm.reunion.anomalies:null}</pre>
                                  ),
                              })}
                            </Row>

                            {format === "html" && (
                              <Row className="button-row">
                                <Col className="submitTrabajador" xl={24}>
                                  <Button
                                    className="submit-button"
                                    type="primary"
                                    htmlType="submit"
                                    // onClick={sendForm}
                                  >
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
              <h2 style={{ textAlign: "center" }}>Formulario no encontrado</h2>
            )}
          </>
        )}
      </div>
    </FormLayout>
    </div>
  );
};

export default withRouter(Form.create()(FormFP));
