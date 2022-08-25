import "./formGift.scss";
import React, { useState, useEffect } from "react";
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
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import {
  getFormPromise,
  saveFormPromise,
  sendFormPromise,
} from "../../promises";
import { validateRutHelper } from "../../../../helpers";
import Logo from "./components/Logo/Logo";
import moment from "moment";

const FormGift = ({ form, match, formId }) => {
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
  const test = true
  const [sentErrors, setSentErrors] = useState(0);

  const baseParamsIS = {
      gerencia: {key:'gerencia', max:100, id:'gerencia',readOnly:true,type:'input'},
      cargo: {key:'cargo',max:100, id:'cargo',readOnly:true,type:'input'},
      jefatura: {key:'jefatura',max:100, id:'jefatura',readOnly:true,type:'input'},
      mailJefatura: {key:'mailJefatura',max:100, id:'mailJefatura',readOnly:true,type:'input'},
      type: {key:'type', id:'type',readOnly:true,type:'select'},
      organism: {key:'organism',max:100, id:'organism',readOnly:true,type:'input'},
      category: {key:'category', id:'category',readOnly:true,type:'select'},
      value: {key:'value',max:10, id:'value',readOnly:true,type:'input'},
      anomalies: {key:'anomalies',max:4000, id:'anomalies',readOnly:true,type:'textArea'},
      reason:{key:'reason',max:100, id:'reason',readOnly:true,type:'input'},
      date:{key:'date', id:'date',readOnly:true,type:'date'},
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
      return (value.type!=='date')
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

    // doTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    let idForm = formId ? formId : match.params.id;  

    e.preventDefault();
    setHasValidateMsg(true);
    const y = validateFields();
    const x=getFieldsError()
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
      let formToUpdate = { ...apiForm, [fieldObj.key]: value };
      let ret = await saveFormPromiseLocal(formToUpdate);
      //if(!ret.success) { setFieldsValue({[field]: ret.form[field]}) }
  };

  const handleOnChangeReunion = async (fieldObj, value, fieldForm) => {
      let formToUpdate = { ...apiForm, reunion: { ...apiForm.reunion, [fieldObj.key]: value }};
      let ret = await saveFormPromiseLocal(formToUpdate);
      //if(!ret.success) { setFieldsValue({[fieldForm]: ret.form.reunion[field]}) }
  };

  const checkRut = (rule, value, cb) => {
    if (!validateRutHelper(value)) {
      cb("RUT no válido");
    } else {
      cb();
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
                            DECLARACIÓN DE REGALOS | INVITACIONES | BENEFICIOS
                            NO MONETARIOS
                          </h3>
                          :
                          <h4>
                            DECLARACIÓN DE REGALOS | INVITACIONES | BENEFICIOS
                            NO MONETARIOS
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
                          Estimado(a) <strong>{apiForm.recipient.record.nombre}</strong>, le informamos que su declaración fue correctamente completada, agradecemos su tiempo y disposición.
                          <br/>
                          <br/>
                          Hemos enviado una copia de la declaración realizada al mail registrado: <strong>{apiForm.recipient.record.email}</strong>
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
                              La empresa ha establecido que los
                              trabajadores(as) tienen prohibición de recibir
                              regalos, invitaciones (por ejemplo a cursos o
                              seminarios) o beneficios no monetarios (por
                              ejemplo descuentos, entradas a eventos deportivos
                              o conciertos) de parte de clientes, proveedores o
                              terceros en general, evitando así que al hacerlo
                              estas acciones puedan influir en sus decisiones.
                              Aún así, si nos encontramos frente a una de estas
                              situaciones, estas deberán ser informadas a su
                              jefatura directa; adicionalmente se les recuerda
                              que es posible que se tomen acciones posteriores
                              (por ejemplo se solicite la devolución del regalo
                              enviado)
                              <br />
                              <br />
                              Regalos (excepción) Sólo se podrán recibir regalos
                              que tengan un valor monetario manifiestamente
                              bajo, que lleven la marca del proveedor y que
                              busquen promocionarlo, como cuadernos, carpetas y
                              lápices, entre otros
                              <br />
                              <br />
                              Invitaciones (excepción) Sólo se podrá aceptar
                              invitaciones a capacitaciones, seminarios u otro
                              tipo de evento siempre y cuando sean gratuitos o
                              bien pagados por la empresa y desarrollados dentro
                              de la región en la que vivo.
                            </Col>
                          </Row>
                          <br/>
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
                                  validateLengthBaseParam(baseParamsIS.gerencia)
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
                                  validateLengthBaseParam(baseParamsIS.cargo)
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
                                label: "Nombre Jefatura",
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
                                  validateLengthBaseParam(baseParamsIS.jefatura)
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
                                label: "Correo electrónico Jefatura",
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
                                  validateLengthBaseParam(baseParamsIS.mailJefatura)
                                ],
                                wrapperCols: 8,
                                item: (
                                  <Input
                                    autoComplete="off"
                                    onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                    onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                    readOnly = {baseParams.mailJefatura.readOnly} 
                                    onChange={(e) => handleOnChange( baseParamsIS.mailJefatura, e.target.value ) }
                                  />
                                ),
                              })}
                            </Row>
                          </Row>

                          <Row className="subheader">
                            <Col xl={24}>Contenido</Col>
                          </Row>

                          <Row className="content" style={{ padding: "0px" }}>
                            <Row className="fields-row" gutter={[16, 8]}>
                              {renderFormItem({
                                label: "Tipo",
                                name: baseParamsIS.type.id,
                                initialValue:
                                  apiForm.reunion !== null
                                    ? apiForm.reunion.type
                                    : null,
                                colClassName: "leftLabel",
                                labelCol: 4,
                                wrapperCol: 20,
                                rules: [
                                  { required: true, message: t( "messages.aml.dontForgetTipoContenido" ), },
                                ],
                                wrapperCols: 24,
                                item:
                                  format === 'html' ?
                                  <Select
                                    onChange={(e) => handleOnChangeReunion(baseParamsIS.type, e, "type") }
                                  >
                                    <Select.Option key="2" value="Regalos">
                                      Regalos
                                    </Select.Option>
                                    <Option key="3" value="Invitaciones">
                                      Invitaciones
                                    </Option>
                                    <Option
                                      key="4"
                                      value="Beneficios no monetarios"
                                    >
                                      Beneficios no monetarios
                                    </Option>
                                  </Select>
                                  :
                                  <Input/>
                                ,
                              })}
                            </Row>

                            <Row className="fields-row" gutter={[16, 8]}>
                              {renderFormItem({
                                label: "Empresa",
                                name: baseParamsIS.organism.id,
                                initialValue: apiForm.reunion !== null ? apiForm.reunion.organism : null,
                                colClassName: "leftLabel",
                                labelCol: 4,
                                wrapperCol: 20,
                                rules: [
                                  { required: true, message: t( "messages.aml.dontForgetNombreEmpresa" ), },
                                  validateLengthBaseParam(baseParamsIS.organism)
                                ],
                                wrapperCols: 24,
                                item: (
                                  <Input
                                    autoComplete="off"
                                    onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                    onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                    readOnly = {baseParams.organism.readOnly} 
                                    onChange={(e) => handleOnChangeReunion( baseParamsIS.organism, e.target.value, "organism" ) }
                                  />
                                ),
                              })}
                            </Row>

                            <Row className="fields-row" gutter={[16, 8]}>
                              {renderFormItem({
                                label: "Categoría",
                                name: baseParamsIS.category.id,
                                initialValue: apiForm.reunion !== null ? apiForm.reunion.category : null,
                                colClassName: "leftLabel",
                                labelCol: 4,
                                wrapperCol: 20,
                                rules: [
                                  {
                                    required: true,
                                    message: t(
                                      "messages.aml.dontForgetCategory"
                                    ),
                                  },
                                ],
                                wrapperCols: 24,
                                item: format === 'html' ?
                                  <Select
                                    onChange={(e) => handleOnChangeReunion(baseParamsIS.category, e, "category") }
                                  >
                                    <Select.Option
                                      key="2"
                                      value="Regalo de agradecimiento"
                                    >
                                      Regalo de agradecimiento
                                    </Select.Option>
                                    <Option
                                      key="3"
                                      value="Felicitaciones por Cumpleaños"
                                    >
                                      Felicitaciones por Cumpleaños
                                    </Option>
                                    <Option key="5" value="Regalo promocional">
                                      Regalo promocional
                                    </Option>
                                    <Option key="6" value="Capacitación">
                                      Capacitación
                                    </Option>
                                    <Option key="7" value="Curso">
                                      Curso
                                    </Option>
                                    <Option key="8" value="Seminario">
                                      Seminario
                                    </Option>
                                    <Option key="9" value="Feria">
                                      Feria
                                    </Option>
                                    <Option
                                      key="10"
                                      value="Evento de la industria"
                                    >
                                      Evento de la industria
                                    </Option>
                                    <Option key="9" value="Otros">
                                      Otros
                                    </Option>
                                  </Select>
                                  :
                                  <Input/>
                                ,
                              })}
                            </Row>

                            {apiForm.reunion !== null
                                    && apiForm.reunion.category === "Otros" &&(
                            <Row className="fields-row" gutter={[16, 8]}>
                              {renderFormItem({
                                label: "Motivo",
                                name: baseParamsIS.reason.id,
                                initialValue: apiForm.reunion !== null ? apiForm.reunion.reason : null,
                                colClassName: "leftLabel",
                                labelCol: 4,
                                wrapperCol: 20,
                                rules: [
                                  {
                                    required: apiForm.reunion !== null && apiForm.reunion.category === "Otros" ? true:false,
                                    message: t( "messages.aml.dontForgetMotivoReunion" ),
                                  },
                                  validateLengthBaseParam(baseParamsIS.reason)
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

                                    )}

                            <Row className="fields-row" gutter={[16, 8]}>
                              {renderFormItem({
                                label: "Fecha de Recepción",
                                name: baseParamsIS.date.id,
                                initialValue:
                                  apiForm.reunion !== null
                                  && apiForm.reunion.date !== undefined
                                  && apiForm.reunion.date !== null
                                   ? format === 'html' ?
                                    moment(apiForm.reunion.date)
                                    : moment(apiForm.reunion.date).format('DD/MM/YYYY')
                                    : null,
                                colClassName: "leftLabel reception-date",
                                labelCol: 12,
                                wrapperCol: 12,
                                rules: [
                                  { required: true, message: t( "messages.aml.dontForgetMeetingDate" ), },
                                ],
                                wrapperCols: 12,
                                item: format === 'html' ?
                                  <DatePicker
                                    format={dateFormat}
                                    placeholder="Ingrese la fecha"
                                    onChange={(momentObj) => handleOnChangeReunion( baseParamsIS.date, momentObj !== null ? moment(momentObj).valueOf() : null, "date" ) }
                                  />
                                  :
                                  <Input/>
                                ,
                              })}


                              {renderFormItem({
                                label: "Valor Estimado en pesos chilenos:",
                                name: baseParams.value.id,
                                initialValue:
                                  apiForm.reunion !== null
                                    ? apiForm.reunion.value
                                    : null,
                                colClassName: "leftLabel",
                                labelCol: 18,
                                wrapperCol: 6,
                                rules: [
                                  {
                                    required: true,
                                    message: t(
                                      "messages.aml.dontForgetValor"
                                    ),
                                  },
                                  validateLengthBaseParam(baseParamsIS.value)
                                ],
                                offset:0,
                                wrapperCols: 12,
                                item: (
                                  <Input
                                    autoComplete="off"
                                    onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                    onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                    readOnly = {baseParams.value.readOnly} 
                                    onChange={(e) => handleOnChangeReunion( baseParamsIS.value, e.target.value, "value" ) }
                                  />
                                ),
                              })}
                            </Row>

                            <br/>
                            <Row className="anomalies">
                            {renderFormItem({
                              label: "Comentarios Adicionales",
                              name: baseParamsIS.anomalies.id,
                              initialValue: apiForm.reunion!==null?apiForm.reunion.anomalies:null,
                              colClassName: "topLabel",
                              labelCol: 24,
                              rules: [
                                validateLengthBaseParam(baseParamsIS.anomalies)
                              ],
                              wrapperCol: 24,
                              wrapperCols: 24,
                              item: (
                                format === 'html' ?
                                  <TextArea
                                    autoComplete="off"
                                    onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                    onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                    readOnly = {baseParams.anomalies.readOnly} 
                                    defaultValue={apiForm.reunion!==null?apiForm.reunion.anomalies:null}
                                    autoSize={{ minRows: 3, maxRows: 4 }}
                                    style={{ width: "100%" }}
                                    onChange={e =>
                                      handleOnChangeReunion(baseParamsIS.anomalies,e.target.value, "anomalies")
                                    }
                                  />
                                  :
                                  apiForm.reunion!==null?
                                  <pre className="obs">{apiForm.reunion.anomalies}</pre>
                                  :
                                  null
                                  // <pre className="obs">{apiForm.reunion!==null?apiForm.reunion.anomalies:null}</pre>
                              )
                            })}
                          </Row>


                            {format === "html" && (
                              <Row className="button-row">
                                <Col className="submitTrabajador" xl={24}>
                                  <Button
                                    className="submit-button"
                                    type="primary"
                                    htmlType="submit"
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
  );
};

export default withRouter(Form.create()(FormGift));
