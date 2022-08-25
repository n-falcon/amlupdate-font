import "./formTrab.scss";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, Form, Input, Row, Spin, Select, Tooltip, Radio, Table, Icon, notification, Descriptions, DatePicker } from "antd";
import apiConfig from '../../../../../config/api'
import { FormLayout } from "../../../../../layouts";
import { withRouter } from "react-router-dom";
import { getFormPromise, getParamsPromise, sendFormPromise, saveFormCDItrabPromise, signCDIFormPromise } from "../../../promises";
import moment from "moment";
import Logo from "./components/Logo/Logo";
import { validateRutHelper, validateCompanyRutHelper, } from "../../../../../helpers";
import HelloSign from 'hellosign-embedded';

const FormTrab = ({ form, match }) => {
  const { t } = useTranslation();
  const { getFieldDecorator, validateFields, setFields, getFieldsError, setFieldsValue } = form;
  const [isValidate, setIsValidate] = useState(true);
  const [isLoading, setIsloading] = useState(false);
  const [format, setFormat] = useState("html");
  const [date, setDate] = useState(0);
  const dateFormat = "DD/MM/YYYY";
  const { Option } = Select;
  const [user, setUser] = useState({});
  const [subclienteId, setSubclienteId] = useState("0");
  const [apiForm, setApiForm] = useState(null);
  const [params, setParams] = useState({});
  const [othersCDIobj, setOthersCDIobj] = useState({});
  const [colLogo, setColLogo] = useState(4);
  const [openContent, setopenContent] = useState(false);
  const [validarRegistros, setValidarRegistros] = useState(false);
  const [signed, setSigned] = useState(false);
  const [openSigner, setOpenSigner] = useState(false);
  const hasSign = true
  const [sentErrors, setSentErrors] = useState(0);

  let registersStop = {
    family: false,
    relProvCont: false,
    relLabAnt: false,
    outsideActivities: false,
    relCompetitor: false,
    relRelationship: false,
    relPepFp: false,
    relFundPjsfl: false,
    othersCDI: false,
  };

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


  const handleOnClear = (section)=>{
    switch (section) {
      case 'relationParentesco':
        setRelationParentesco({...relationParentescoIS})
        setFieldsValue(Object.keys(relationParentescoIS).reduce((acu,key)=>{
          return {...acu,[key]:null}
        },{}))
        break;
      case 'relationProveedor':
        setRelationProveedor({...relationProveedorIS})
        setFieldsValue(Object.keys(relationProveedorIS).reduce((acu,key)=>{
          return {...acu,[key]:null}
        },{}))
        break;
      case 'competencia':
        setCompetencia({...competenciaIS})
        setFieldsValue(Object.keys(competenciaIS).reduce((acu,key)=>{
          return {...acu,[key]:null}
        },{}))
        break;
      case 'malla':
        setMalla({...mallaIS})
        setFieldsValue(Object.keys(mallaIS).reduce((acu,key)=>{
          return {...acu,[key]:null}
        },{}))
        break;
      default:
        break;
    }
  }

  // const handleReadOnly = (field,readOnly,stateObject=null)=>{
  //     console.log(Object.keys(stateObject))
  //     const stateObjSection = Object.entries(stateObject).filter(([key,value])=> {
  //       return value.id === field
  //     } )[0][0]
  //     settingStateObj(stateObject,stateObjSection,readOnly)
  // }

  const handleReadOnly = (field,readOnly,sectionId=null)=>{
    if (sectionId===null){
    }else{
      settingStateObj(sectionId,readOnly)
    }
  }

  const settingStateObj=(sectionId,readOnly)=>{
    const [stateObject,stateObjectSetter] = customState(sectionId)
    stateObjectSetter({...stateObject,[sectionId]:{...stateObject[sectionId],readOnly:readOnly}})
  }


  const relationParentescoIS = {
    relationParentescoRelationship: { key: "relationship", val: "", title: "Tipo de relación a través de la que participa en el Banco", id:"relationParentescoRelationship", type:'select' },
    relationParentescoTipoDoc: { key: "tipoDoc", val: "", title: "Tipo de documento de la persona a través de la que participa ", id:"relationParentescoTipoDoc", type:'select' },
    relationParentescoName: { key: "name", val: "", title: "Nombre o razón social de la Persona Natural o Jurídica a través de la que participa en el Banco",maxLength:150, readOnly:true, id:"relationParentescoName" },
    relationParentescoRut: { key: "rut", val: "", title: "Número de documento de identidad ",maxLength:20, readOnly:true, type:'input', id:"relationParentescoRut" },
    relationParentescoDirecta: { key: "rutTrab", val: "", title: "Directa",maxLength:5, readOnly:true, id:"relationParentescoDirecta" },
    relationParentescoIndirecta: { key: "nameTrab", val: "", title: "Indirecta",maxLength:5, readOnly:true, id:"relationParentescoIndirecta" },
    relationParentescoTotal: { key: "position", val: "", title: "Total",maxLength:5, readOnly:true, id:"relationParentescoTotal" },
  }
  const [relationParentesco, setRelationParentesco] = useState(relationParentescoIS);

  const relationProveedorIS = {
    provName: { key: "name", val: "", title: "Nombre de la Persona Natural o Jurídica", maxLength:150, readOnly:true, id:"provName"},
    provTipoDoc: { key: "tipoDoc", val: "", title: "Tipo de documento de la persona Natural o Jurídica", id:"provTipoDoc", type:'select' },
    provRut: { key: "rut", val: "", title: "Número de documento de la persona Natural o Jurídica", maxLength:20, readOnly:true, id:"provRut" },
    provCompanyName: { key: "companyName", val: "", title: "Nombre de la Persona Jurídica", maxLength:150, readOnly:true, id:"provCompanyName" },
    provCompanyTipoDoc: { key: "companyTipoDoc", val: "", title: "Tipo de documento de la Persona Jurídica", type:'input', id:"provCompanyTipoDoc", type:'select' },
    provCompanyRut: { key: "companyRut", val: "", title: "Número de documento de la Persona Jurídica", maxLength:20, readOnly:true, id:"provCompanyRut" },
    provPais: { key: "relationship", val: "", title: "País en que se Constituyó la Persona Jurídica", maxLength:50, readOnly:true, id:"provPais" },
    provCapital: { key: "percentage", val: "", title: "Porcentaje de participación en el Capital de la Persona Jurídica", maxLength:5, readOnly:true, id:"provCapital" },
    provUtilidad: { key: "position", val: "", title: "Porcentaje de participación en la Utilidad de la Persona Jurídica", maxLength:5, readOnly:true, id:"provUtilidad" },
  }
  const [relationProveedor, setRelationProveedor] = useState(relationProveedorIS);

  const competenciaIS = {
    competenciaTipoCargo: { key: "position", val: "", title: "Tipo de Cargo ", id: "competenciaTipoCargo", type:'select' },
    competenciaCompanyName: { key: "companyName", val: "", title: "Nombre o Razón Social de la Persona Jurídica en la que ejerce el cargo", maxLength:150, readOnly:true, type:'input', id:"competenciaCompanyName" },
    competenciaCompanyTipoDoc: { key: "companyTipoDoc", val: "", title: "Tipo de documento de la Persona Jurídica en la que ejerce el cargo", id:"competenciaCompanyTipoDoc", type: 'select' },
    competenciaCompanyRut: { key: "companyRut", val: "", title: "Número de documento de identidad de la Persona Jurídica en la que ejerce el cargo  ",maxLength:20, readOnly:true, type:'input', id:"competenciaCompanyRut" },
    competenciaPais: { key: "relationship", val: "", title: "País de constitución ", maxLength:150, readOnly:true, type:'input', id:"competenciaPais"},
  }
  const [competencia, setCompetencia] = useState(competenciaIS);

  const mallaIS = {
    mallaType: { key: "type", val: "", title: "Parentesco", id:'mallaType', type:"select"},
    mallaName: { key: "name", val: "", title: "Nombre de la Persona", maxLength:255, readOnly:true, type:'input', id:"mallaName" },
    mallaRut: { key: "rut", val: "", title: "Documento de Identidad", maxLength:20, readOnly:true, type:'input', id:"mallaRut", tooltip:"El sistema requiere que se ingrese un Documento. En caso que el sujeto identificado no tenga Documento por favor ingresar tu mismo Documento" },
    mallaTipoDoc: { key: "tipoDoc", val: "", title: "Tipo de documento de identidad",id:"mallaTipoDoc", type:"select" },
  }
  let [malla, setMalla] = useState(mallaIS);

  const validateLengthFieldWithInnerLength = (obj,section)=>{
    return {
      max: obj[section].maxLength,
      message: "Debe tener un máximo de "+ obj[section].maxLength  + " caracteres."
    }
  }

  const validateLengthFieldWithInnerLength2 = (section)=>{
    return {
      max: section.maxLength,
      message: "Debe tener un máximo de "+ section.maxLength  + " caracteres."
    }
  }

  const testLength = (stateObject,offset)=>{
    let stateCopy = {...stateObject}
    Object.entries(stateObject).map(([section,innerSection])=>{
      if (Object.keys(innerSection).indexOf('maxLength')>-1){
        let test = stateCopy[section].maxLength+offset
        stateCopy = {...stateCopy, [section]: {...stateCopy[section], val:'x'.repeat(stateCopy[section].maxLength+offset)}}
      }
    })
    if (Object.keys(stateObject)[0].startsWith('relationParentesco')) {
      setRelationParentesco(stateCopy)
    }
    if (Object.keys(stateObject)[0].startsWith('prov')) {
      setRelationProveedor(stateCopy)
    }
    if (Object.keys(stateObject)[0].startsWith('competencia')) {
      setCompetencia(stateCopy)
    }
    if (Object.keys(stateObject)[0].startsWith('malla')) {
      setMalla(stateCopy)
    }
    validateFields(Object.keys(stateObject))
  }

  const doTests = ()=>{
    setTimeout(()=>{
      testLength(relationProveedor,1)
      testLength(relationParentesco,1)
      testLength(competencia,1)
      testLength(malla,1)
      // Object.keys(maxLength).map((section)=>{
      //   testLength2(section,1)
      // })
    },1000)
  }

  useEffect(() => {
    setIsloading(true);
    getFormPromise(match.params.id).then((response) => {
      if (
        response.data !== null &&
        response.data !== "" &&
        response.data.status !== undefined
      ) {
        let responseData = response.data;
        // responseData = {...response.data,hasRelProvCont:undefined}
        setApiForm(responseData);
        setUser(response.data.recipient.request.createUser);
        getParamsPromise(
          response.data.recipient.request.createUser.cliente.id
        ).then((response) => {
          setParams(response.data);
        });
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
    // doTests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
  }, [malla]);



  /*
  useEffect(() => {
    validateFields(["relationParentescoRut"]);
  }, [relationParentesco.relationParentescoTipoDoc]);
  useEffect(() => {
    validateFields(["provCompanyRut"]);
  }, [relationProveedor.provCompanyTipoDoc]);
  useEffect(() => {
    validateFields(["provRut"]);
  }, [relationProveedor.provTipoDoc]);
  useEffect(() => {
    validateFields(["competenciaCompanyRut"]);
  }, [competencia.competenciaCompanyTipoDoc]);
  useEffect(() => {
    validateFields(["mallaRut"]);
  }, [malla.mallaTipoDoc]);
  */

  const saveFormCDItrabPromiseLocal = (form) => {
    saveFormCDItrabPromise(form).then((response) => {
      if(response.code !== 'OK' && response.form !== undefined && response.form !== null) {
        setApiForm(response.form)
        if(response.code === 'ERROR') {
          notification["error"]({
            message: t("messages.aml.notifications.anErrorOcurred"),
          });
        }else if(response.code === 'E01') {
          notification["error"]({
            message: t("messages.aml.notifications.anErrorOcurred"),
            description: 'Error al grabar datos de la declaracion'
          });
        }else if(response.code === 'E02') {
          notification["error"]({
            message: t("messages.aml.notifications.anErrorOcurred"),
            description: 'Error al grabar datos del formulario'
          });
        }else if(response.code === 'E03') {
          notification["error"]({
            message: t("messages.aml.notifications.anErrorOcurred"),
            description: 'Error al grabar datos de la declaración'
          });
        }else if(response.code === 'E04') {
          notification["error"]({
            message: t("messages.aml.notifications.anErrorOcurred"),
            description: 'Error al limpiar datos'
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
      }else {
        setApiForm(form)
      }
    });
  }

  const handleOnChangeIntro = (field, value) => {
    if(!signed) {
      formToUpdate = { ...apiForm, [field]: value };
      saveFormCDItrabPromiseLocal(formToUpdate)
    }
  };

  const hancleOnChangeRadioButton = (field, value) => {
    if(!signed) {
      formToUpdate = { ...apiForm, [field]: value };
      saveFormCDItrabPromiseLocal(formToUpdate);
    }
  };

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some((field) => fieldsError[field]);
  }

  const sendDocument = (requestId = "") => {
    sendFormPromise(match.params.id, requestId).then((response) => {
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidarRegistros(true);
    setIsValidate(true);
    validateFields([
      "gerencia",
      "cargo",
      "hasRelRelationship",
      "hasRelProvCont",
      "hasRelCompetitor",
    ]);

    // if (apiForm.family.length < 1) {
    //   validateFields(Object.keys(malla));
    //   registersStop = { ...registersStop, family: true };
    // }
    if (apiForm.hasRelProvCont && apiForm.relProvCont.length === 0) {
      validateFields(Object.keys(relationProveedor));
      registersStop = { ...registersStop, relProvCont: true };
    }
    if (apiForm.hasRelCompetitor && apiForm.relCompetitor.length === 0) {
      validateFields(Object.keys(competencia));
      registersStop = { ...registersStop, relCompetitor: true };
    }
    if (apiForm.hasRelRelationship && apiForm.relRelationship.length === 0) {
      validateFields(Object.keys(relationParentesco));
      registersStop = { ...registersStop, relRelationship: true };
    }
    if (
      hasErrors(getFieldsError()) ||
      Object.values(registersStop).find((value) => value === true) !== undefined
    ) {
      notification["warning"]({
        message: t("messages.aml.missingRequiredField"),
      });
    } else {
      if(hasSign) {
        let record = apiForm.recipient.record
        let _emails = ["no@email.com"];
  			if(record.email != null) {
  					_emails = record.email.split(",");
  			}
  			var _email = _emails[0].trim();
        setOpenSigner(true)
        let signParams = await signCDIFormPromise(apiForm.id, _email)
        setOpenSigner(false)
        if(signParams.embedUrl == "signed") {
          notification["warning"]({
            message: "Ya esta firmado"
          })
          setSigned(true)
          sendDocument(signParams.requestId)
        }else {
          if(signParams.clientId != "") {
            const client = new HelloSign({
              clientId: signParams.clientId
            });
            let testMode = !apiConfig.url.startsWith('https://api.amlupdate')
            client.open(signParams.embedUrl, {
              testMode
            });
            client.on('sign', () => {
              setSigned(true)
              sendDocument(signParams.requestId)
            });
          }else {
            notification["error"]({
              message: "Error al iniciar servicio de Firma Electronica",
              description: signParams.message
            })
          }
        }
      }else {
        sendDocument()
      }
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
          {formItem.tooltip ? (
            <Tooltip
              className="tooltip-form-field"
              title= {formItem.tooltip}
            >
              {getFieldDecorator(formItem.name, {
                rules: formItem.rules,
                initialValue: formItem.initialValue,
                validateTrigger: "onChange",
              })(formItem.item)}
            </Tooltip>
          ) : (
              getFieldDecorator(formItem.name, {
                rules: formItem.rules,
                initialValue: formItem.initialValue,
                validateTrigger: "onChange",
              })(formItem.item)
            )}
        </Form.Item>
      </Col>
    );
  };

  const renderFormItemTable = ({ section, initialValue, cols=12, options=[], validator=null, customRule=null }) => {
    const type = section.type ? section.type : 'input'
    const required = "required" in section ? section.required : true
    return renderFormItem({
      label: section.title,
      name: section.id,
      tooltip:section.tooltip,
      initialValue: initialValue,
      colClassName: "topLabel",
      labelCol: 0,
      wrapperCol: 0,
      rules:
      [
        { required: required, message: t( "messages.aml.requestedField")},
        ... validator ? [{ validator: validator }]:[],
        ...type==='input' ? [validateLengthFieldWithInnerLength2(section)]:[],
        ...customRule ? [customRule]:[]
      ],
      wrapperCols: cols,
      item: (
        type === 'input' ?
          <Input
            autoComplete="off"
            onFocus= {(e)=>handleReadOnly(e.target.id,false,section.id)}
            onBlur= {(e)=>handleReadOnly(e.target.id,true,section.id)}
            readOnly = {section.readOnly}
            onChange={(e) => handleOnChangeField( section.id, e.target.value ) }
          />
          : format === 'html' ?
            type === 'select' ?
              <Select
                onChange={(value) => handleOnChangeField(section.id, value) }
              >
                { options.map((option) => (<Select.Option value={option.val}>{ option.text }</Select.Option>)) }
              </Select>
              :
              <DatePicker
                onFocus= {(e)=>handleReadOnly(e.currentTarget.id,false,section.id)}
                onBlur= {(e)=>handleReadOnly(e.currentTarget.id,true,section.id)}
                readOnly = {section.readOnly}
                format="DD/MM/YYYY"
                placeholder="Ingrese la fecha"
                onChange={(momentObj) => handleOnChangeField( section.id, momentObj ? moment(momentObj).format( "DD/MM/YYYY" ) : null ) }
              />
            :
            <Input/>
      ),
    })
}


const handleOnChangeField = (sectionId, value) => {
  const [stateObject,stateObjectSetter] = customState(sectionId)
  stateObjectSetter({ ...stateObject, [sectionId]: { ...stateObject[sectionId], val: value }});
};

const customState=(sectionId)=>{
  if (sectionId.startsWith('relationParentesco')) {
    return([relationParentesco,setRelationParentesco])
  }
  if (sectionId.startsWith('prov')) {
    return([relationProveedor,setRelationProveedor])
  }
  if (sectionId.startsWith('competencia')) {
    return([competencia,setCompetencia])
  }
  if (sectionId.startsWith('malla')) {
    return([malla,setMalla])
  }
}


  const handleOnAddMalla = () => {
    setIsValidate(true);

    validateFields(Object.keys(malla)).then((error, values) => {
      const mallaOk = Object.keys(malla).reduce((acc, e) => {
        return { ...acc, [malla[e].key]: malla[e].val };
      }, {});
      apiForm.family.push({ ...mallaOk });
      formToUpdate = { ...apiForm, family: apiForm.family };

      saveFormCDItrabPromiseLocal(formToUpdate)

      handleOnClear('malla')

      //setApiForm(formToUpdate); //better call api and get last id
    });
    registersStop.family = false;
  };
  const handleDeleteMalla = (index) => {
    return () => {
      let xx = [...apiForm.family];
      xx.splice(index, 1);
      formToUpdate = { ...apiForm, family: xx };
      saveFormCDItrabPromiseLocal(formToUpdate)
    };
  };



  const handleOnAddRelationProveedor = () => {
    setIsValidate(true);
    validateFields(Object.keys(relationProveedor)).then((error, values) => {
      const relationProveedorOk = Object.keys(relationProveedor).reduce(
        (acc, e) => {
          return {
            ...acc,
            [relationProveedor[e].key]: relationProveedor[e].val,
          };
        },
        {}
      );
      apiForm.relProvCont.push({ ...relationProveedorOk });
      //formToUpdate =   {...apiForm,family: apiForm.relProvCont }

      saveFormCDItrabPromiseLocal(apiForm)

      handleOnClear('relationProveedor')
    });
    registersStop.relProvCont = false;
  };

  const handleDeleteRelationProveedor = (index) => {
    return () => {
      // let temp = relationProveedorCollection.filter(e => e.key !== record.key);
      // setRelationProveedorCollection(temp);

      let xx = [...apiForm.relProvCont];
      xx.splice(index, 1);
      formToUpdate = { ...apiForm, relProvCont: xx };

      saveFormCDItrabPromiseLocal(formToUpdate)
    };
  };


  const handleOnAddCompetencia = () => {
    setIsValidate(true);
    console.log(competencia);

    validateFields(Object.keys(competencia)).then((error, values) => {
      const competenciaOk = Object.keys(competencia).reduce((acc, e) => {
        return { ...acc, [competencia[e].key]: competencia[e].val };
      }, {});

      apiForm.relCompetitor.push({ ...competenciaOk });

      saveFormCDItrabPromiseLocal(apiForm)
      handleOnClear('competencia')
    });
    registersStop.relCompetitor = false;
  };
  const handleDeleteCompetencia = (index) => {
    return () => {
      let xx = [...apiForm.relCompetitor];
      xx.splice(index, 1);
      formToUpdate = { ...apiForm, relCompetitor: xx };

      saveFormCDItrabPromiseLocal(formToUpdate)
    };
  };


  const handleOnAddRelationParentesco = () => {
    setIsValidate(true);
    validateFields(Object.keys(relationParentesco)).then((error, values) => {
      const relationParentescoOk = Object.keys(relationParentesco).reduce(
        (acc, e) => {
          return {
            ...acc,
            [relationParentesco[e].key]: relationParentesco[e].val,
          };
        },
        {}
      );
      apiForm.relRelationship.push({ ...relationParentescoOk });

      saveFormCDItrabPromiseLocal(apiForm)
      handleOnClear('relationParentesco')
    });
    registersStop.relRelationship = false;
  };

  const handleDeleteRelationParentesco = (index) => {
    return () => {
      let xx = [...apiForm.relRelationship];
      xx.splice(index, 1);
      formToUpdate = { ...apiForm, relRelationship: xx };

      saveFormCDItrabPromiseLocal(formToUpdate)
    };
  };

  //const relation = [{nombreEmpresa:'gesintel',tipoEmpresa:'limitada'}]

  let formToUpdate = {};

  const mallaColumns = [
    {
      title: "Parentesco",
      dataIndex: "type",
    },
    {
      title: "Nombre",
      dataIndex: "name",
      width: '400px'
    },
    {
      title: "Tipo de documento de identidad",
      dataIndex: "tipoDoc",
    },
    {
      title: "Documento",
      dataIndex: "rut",
    },
    format === "html" && !signed
      ? {
        title: "Acción",
        dataIndex: "",
        key: "x",
        render: (text, record, index) => (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a onClick={handleDeleteMalla(index)}>
            <Icon type="delete" />
          </a>
        ),
      }
      : {},
  ];

  const relationProveedorColumns = [
    {
      title: "Accionista",
      dataIndex: relationProveedor.provName.key,
    },
    {
      title: "Documento Accionista",
      dataIndex: relationProveedor.provRut.key,
    },
    {
      title: "Persona Jurídica",
      dataIndex: relationProveedor.provCompanyName.key,
    },
    {
      title: "Documento Persona Jurídica",
      dataIndex: relationProveedor.provCompanyRut.key,
    },
    {
      title: "País",
      dataIndex: relationProveedor.provPais.key,
    },
    {
      title: "Capital",
      dataIndex: relationProveedor.provCapital.key,
    },
    {
      title: "Utilidad",
      dataIndex: relationProveedor.provUtilidad.key,
    },
    format === "html" && !signed
      ? {
        title: "Acción",
        dataIndex: "",
        key: "x",
        render: (text, record, index) => (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a onClick={handleDeleteRelationProveedor(index)}>
            <Icon type="delete" />
          </a>
        ),
      }
      : {},
  ];


  const competenciaColumns = [
    {
      title: "Tipo de Cargo",
      dataIndex: "position",
    },
    {
      title: "Nombre o Razón Social",
      dataIndex: "companyName",
    },
    {
      title: "Tipo de Documento",
      dataIndex: "companyTipoDoc",
    },
    {
      title: "Nro. de documento",
      dataIndex: "companyRut",
    },
    {
      title: "Pais",
      dataIndex: "relationship",
    },
    format === "html" && !signed
      ? {
        title: "Acción",
        dataIndex: "",
        key: "x",
        render: (text, record, index) => (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a onClick={handleDeleteCompetencia(index)}>
            <Icon type="delete" />
          </a>
        ),
      }
      : {},
  ];

  const relationParentescoColumns = [
    {
      title: "Tipo de Relación",
      dataIndex: relationParentesco.relationParentescoRelationship.key,
    },
    {
      title: "Número de Documento",
      dataIndex: relationParentesco.relationParentescoRut.key,
    },
    {
      title: "Nombre",
      dataIndex: relationParentesco.relationParentescoName.key,
    },
    {
      title: "Directa",
      dataIndex: relationParentesco.relationParentescoDirecta.key,
    },
    {
      title: "Indirecta",
      dataIndex: relationParentesco.relationParentescoIndirecta.key,
    },
    {
      title: "Total",
      dataIndex: relationParentesco.relationParentescoTotal.key,
    },
    format === "html" && !signed
      ? {
        title: "Acción",
        dataIndex: "",
        key: "x",
        render: (text, record, index) => (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a onClick={handleDeleteRelationParentesco(index)}>
            <Icon type="delete" />
          </a>
        ),
      }
      : {},
  ];





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

  const rutValidatorCompanyPerson = (rule, value, cb) => {
    if (value && !validateCompanyRutHelper(value)&&!validateRutHelper(value)) {
      cb("Documento no válido");
    }
    cb();
  };

  const docValidator = (tipoDoc, type) => {
    if (tipoDoc === "Chile-Rut")
      if (type === 'persona') return rutValidator
      else if (type === 'company') return rutValidatorCompany
      else return rutValidatorCompanyPerson
    else return null;
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

  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };

  return (
    <FormLayout
      currentUser={{ userId: user.id, subclienteId }}
      view={format}
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
                    (!isValidate ? " form-validate-messages" : "")
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
                            <h3>
                              DECLARACIÓN JURADA DE PERSONA RELACIONADA
                          </h3>
                          </Col>
                          <Col
                            className="logo-col"
                            xs={colLogo}
                            sm={colLogo}
                            md={colLogo}
                            lg={colLogo}
                            xl={colLogo}
                          >
                            <Logo
                              currentUser={{ userId: user.id, subclienteId }}
                            />
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
                                Estimado {apiForm.recipient.record.nombre}, le
                            informamos que su declaración fue correctamente
                            completada, agradecemos su tiempo y disposición.
                            <br />
                            Hemos enviado una copia de la declaración realizada
                            al mail registrado: {apiForm.recipient.record.email}
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
                                  El suscrito,{" "}
                                  <strong>{apiForm.recipient.record.nombre}</strong>
                                  , en mi calidad de{" "}
                                  {
                                    <Form.Item className="introduction-item">
                                      {getFieldDecorator("cargo", {
                                        initialValue: apiForm.cargo,
                                        rules: [
                                          {
                                            required: true,
                                            message: t(
                                              "messages.aml.dontForgetCargo"
                                            ),
                                          },
                                        ],
                                      })(
                                        format === "html" ? (
                                        <Select
                                          placeholder="Ingrese cargo que ocupa"
                                          onChange={(value) =>
                                            handleOnChangeIntro(
                                              "cargo",
                                              value
                                            )
                                          }
                                        >
                                          <Select.Option value="Director">
                                            Director
                                          </Select.Option>
                                          <Select.Option value="Gerente General" >
                                            Gerente General
                                          </Select.Option>
                                          <Select.Option value="Subgerente General">
                                            Subgerente General
                                          </Select.Option>
                                          <Select.Option value="Gerente de Área o División">
                                            Gerente de Área o División
                                          </Select.Option>
                                          <Select.Option value="Subgerente">
                                            Subgerente
                                          </Select.Option>
                                          <Select.Option value="Asesor del Directorio">
                                          Asesor del Directorio
                                          </Select.Option>
                                          <Select.Option value="Fiscal del Banco">
                                          Fiscal del Banco
                                          </Select.Option>
                                          <Select.Option value="Abogado Jefe del Banco">
                                          Abogado Jefe del Banco
                                          </Select.Option>
                                          <Select.Option value="Contralor o Auditor Interno">
                                          Contralor o Auditor Interno
                                          </Select.Option>
                                          <Select.Option value="Otros">
                                          Otros
                                          </Select.Option>
                                        </Select>
                                        ):(
                                          <Input/>
                                        )

                                      )}
                                    </Form.Item>
                                  } <span> </span>
                                  de <span> </span>
                                  {
                                    <Form.Item className="introduction-item empresa">
                                      {getFieldDecorator("gerencia", {
                                        initialValue: apiForm.gerencia,
                                        rules: [
                                          {
                                            required: true,
                                            message: t(
                                              "messages.aml.requestedField"
                                            ),
                                          },
                                        ],
                                      })(

                                        format === "html" ? (
                                        <Select
                                          // style={{width:'300px'}}
                                          placeholder="Nombre de la empresa"
                                          onChange={(value) =>
                                            handleOnChangeIntro(
                                              "gerencia",
                                               value
                                            )
                                          }
                                        >
                                          {
                                            params.empresas && params.empresas.map(empresa =>{
                                              return(
                                                <Select.Option key={empresa} value={empresa}>
                                                  {empresa}
                                                </Select.Option>
                                              )
                                            })
                                          }
                                        </Select>
                                        ):(
                                          <Input/>
                                        )



                                      )}
                                    </Form.Item>
                                  }
                                  {"                                                "}

                                   y para efectos de lo previsto en el Artículo 84 N°2 de la Ley General de Bancos, declaro, a esta fecha, lo siguiente:
                                </Col>
                              </Row>


                              <Row className="subheader">
                                <Col xl={24}>
                                  I. Participación en la Propiedad de {apiForm.recipient.request.createUser.cliente.name} {" "}
                                </Col>
                              </Row>
                              <Row className="summary">
                                <Col span={21}>
                                  Poseo una participación directa, indirecta o a través de terceros, incluyendo en estos a mi cónyuge e hijos menores, en la propiedad de
                                  {" "} {apiForm.recipient.request.createUser.cliente.name}.
                               </Col>
                                {renderFormItem({
                                  label: "",
                                  name: "hasRelRelationship",
                                  initialValue:
                                    apiForm.hasRelRelationship !== null
                                      ? apiForm.hasRelRelationship
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
                                          "hasRelRelationship",
                                          target.value
                                        )
                                      }
                                    >
                                      <Radio className="radio-switch" value={true}>
                                        Sí
                                  </Radio>
                                      <Radio className="radio-switch" value={false}>
                                        No
                                  </Radio>
                                    </Radio.Group>
                                  ),
                                })}
                              </Row>
                              {(apiForm.hasRelRelationship || openContent) && (
                                <Row className="content">
                                  {format === "html" && !signed && (
                                      <>
                                        <Row className="inner-row" gutter={[16, 8]}>
                                          {renderFormItemTable({
                                            section: relationParentesco.relationParentescoRelationship,
                                            options: [{ val: "Personal", text: "Personal" },
                                            { val: "Conyugue", text: "Cónyuge" },
                                            { val: "Hijos Menores", text: "Hijos Menores" },
                                            { val: "Terceros", text: "Terceros" }
                                          ],
                                          })}
                                          {renderFormItemTable({
                                            section: relationParentesco.relationParentescoTipoDoc,
                                            options: [
                                              { val: "Chile-Rut", text: "Chile-Rut" },
                                              { val: "Cédula de Identidad", text: "Cédula de Identidad" },
                                              { val: "Tax Id", text: "Tax Id" }
                                            ],
                                          })}
                                        </Row>
                                        <Row className="inner-row" gutter={[16, 8]}>
                                          {renderFormItemTable({
                                            section: relationParentesco.relationParentescoRut,
                                            validator: docValidator(relationParentesco.relationParentescoTipoDoc.val)
                                          })}
                                          {renderFormItemTable({
                                            section: relationParentesco.relationParentescoName,
                                            cols:24
                                          })}
                                        </Row>
                                        <Row className="inner-row" gutter={[16, 8]}>
                                          {renderFormItemTable({
                                            section: relationParentesco.relationParentescoDirecta,
                                            customRule:{ pattern: new RegExp(/^((100(\.0{1,2})?)|(\d{1,2}(\,\d{1,2})?))$/), message: "Por favor introduzca un porcentaje (Formato XX,XX)" },
                                          })}
                                          {renderFormItemTable({
                                            section: relationParentesco.relationParentescoIndirecta,
                                            customRule:{ pattern: new RegExp(/^((100(\.0{1,2})?)|(\d{1,2}(\,\d{1,2})?))$/), message: "Por favor introduzca un porcentaje (Formato XX,XX)" },
                                          })}
                                          {renderFormItemTable({
                                            section: relationParentesco.relationParentescoTotal,
                                            customRule:{ pattern: new RegExp(/^((100(\.0{1,2})?)|(\d{1,2}(\,\d{1,2})?))$/), message: "Por favor introduzca un porcentaje (Formato XX,XX)" }
                                          })}
                                        </Row>

                                        <Row className="button-row">
                                          {apiForm.relRelationship.length < 1 && validarRegistros && apiForm.hasRelRelationship && (
                                              <Col
                                                span={24}
                                                className="missing-registers ant-form-explain"
                                              >
                                                {t("messages.aml.registersRequired")}
                                              </Col>
                                            )}
                                          <Col className="addRelation" xl={3}>
                                            <Button type="primary" htmlType="button" onClick={handleOnAddRelationParentesco} > Añadir </Button>
                                          </Col>
                                          <Col className="addRelation" xl={3}>
                                            <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('relationParentesco')} > Limpiar </Button>
                                          </Col>
                                        </Row>
                                      </>
                                    )}

                                  {apiForm.relRelationship.length > 0 &&
                                    format === "html" ? (
                                      <Table
                                        columns={relationParentescoColumns}
                                        dataSource={apiForm.relRelationship}
                                        size="middle"
                                        pagination={false}
                                      ></Table>
                                    ) : (
                                      toDescriptionsPdf(
                                        apiForm.relRelationship,
                                        relationParentesco
                                      )
                                    )}
                                </Row>
                              )}

                              <Row className="subheader">
                                <Col xl={24}>
                                  II. Participación en Otras Sociedades {" "}
                                </Col>
                              </Row>
                              <Row className="summary">
                                <Col span={21}>
                                  El que suscribe la presente declaración, directamente o a través de las sociedades relacionadas por propiedad declaradas en el sección II, participo o participamos directamente, o a través de otras sociedades, de mi cónyuge, o mis hijos menores de edad, en la propiedad, de las siguientes sociedades (declarar sólo participaciones iguales o superiores a un 5% del capital o las utilidades).
                                </Col>


                                {renderFormItem({
                                  label: "",
                                  name: "hasRelProvCont",
                                  initialValue: apiForm.hasRelProvCont !== null ? apiForm.hasRelProvCont : null,
                                  colClassName: "switch-col",
                                  itemClassName: "radio-item",
                                  labelCol: 0,
                                  wrapperCol: 0,
                                  offset: 0,
                                  rules: [
                                    { required: true, message: t("messages.aml.dontForgetSelect"), },
                                  ],
                                  wrapperCols: 3,
                                  item: (
                                    <Radio.Group
                                      onChange={({ target }) =>
                                        hancleOnChangeRadioButton(
                                          "hasRelProvCont",
                                          target.value
                                        )
                                      }
                                    >
                                      <Radio className="radio-switch" value={true}>
                                        Sí
                                  </Radio>
                                      <Radio className="radio-switch" value={false}>
                                        No
                                  </Radio>
                                    </Radio.Group>
                                  ),
                                })}
                              </Row>

                              {((apiForm.hasRelProvCont !== null &&
                                apiForm.hasRelProvCont) ||
                                openContent) && (
                                  <Row className="content">

                                    <Col span={24} className="subtitle-section">
                                      <strong>Datos del socio o accionista</strong>
                                    </Col>
                                    {format === "html" && !signed && (
                                        <>

                                          <Row className="inner-row" gutter={[16, 8]}>
                                            {renderFormItemTable({
                                              section: relationProveedor.provName,
                                              cols:12
                                            })}
                                            {renderFormItemTable({
                                              section: relationProveedor.provTipoDoc,
                                              cols: 12,
                                              options: [
                                              { val: "Chile-Rut", text: "Chile-Rut" },
                                              { val: "Cédula de Identidad", text: "Cédula de Identidad" },
                                              { val: "Tax Id", text: "Tax Id" }
                                            ],
                                            })}
                                          </Row>

                                          <Row className="inner-row" gutter={[16, 8]}>
                                            {renderFormItemTable({
                                              section: relationProveedor.provRut,
                                              cols:12,
                                              validator: docValidator(relationProveedor.provTipoDoc.val)
                                            })}
                                            </Row>

                                            <Row className="inner-row" gutter={[16, 8]}>
                                              <Col span={24} className="subtitle-section">
                                                <strong>Datos de la Persona Jurídica en la que participa</strong>
                                              </Col>
                                                {renderFormItemTable({
                                                  section: relationProveedor.provCompanyName,
                                                  cols:12
                                                })}
                                                {renderFormItemTable({
                                                  section: relationProveedor.provCompanyTipoDoc,
                                                  cols:12,
                                                  options: [
                                                    { val: "Chile-Rut", text: "Chile-Rut" },
                                                    { val: "Tax Id", text: "Tax Id" }
                                                  ],
                                                })}
                                          </Row>
                                          <Row className="inner-row" gutter={[16, 8]}>
                                            {renderFormItemTable({
                                              section: relationProveedor.provCompanyRut,
                                              validator: docValidator(relationProveedor.provCompanyTipoDoc.val, 'company'),
                                            })}

                                            {renderFormItemTable({
                                              section: relationProveedor.provPais,
                                            })}

                                          </Row>

                                          <Row className="inner-row" gutter={[16, 8]}>
                                            {
                                              renderFormItemTable({
                                                section: relationProveedor.provCapital,
                                                customRule:{ pattern: new RegExp(/^((100(\.0{1,2})?)|(\d{1,2}(\,\d{1,2})?))$/), message: "Por favor introduzca un porcentaje (Formato XX,XX)" },
                                              })}
                                              {renderFormItemTable({
                                                section: relationProveedor.provUtilidad,
                                                customRule:{ pattern: new RegExp(/^((100(\.0{1,2})?)|(\d{1,2}(\,\d{1,2})?))$/), message: "Por favor introduzca un porcentaje (Formato XX,XX)" },
                                              })}
                                          </Row>
                                          <Row className="button-row">
                                            {apiForm.relProvCont.length < 1 &&
                                              validarRegistros &&
                                              apiForm.hasRelProvCont && (
                                                <Col
                                                  span={24}
                                                  className="missing-registers ant-form-explain"
                                                >
                                                  {t("messages.aml.registersRequired")}
                                                </Col>
                                              )}
                                            <Col className="addRelation" xl={3}>
                                              <Button type="primary" htmlType="button" onClick={handleOnAddRelationProveedor} > Añadir </Button>
                                            </Col>
                                            <Col className="addRelation" xl={3}>
                                              <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('relationProveedor')} > Limpiar </Button>
                                            </Col>
                                          </Row>
                                        </>
                                      )}

                                    {apiForm.relProvCont.length > 0 &&
                                      format === "html" ? (
                                        <Table
                                          columns={relationProveedorColumns} dataSource={apiForm.relProvCont} size="middle" pagination={false} ></Table>
                                      ) : (
                                        toDescriptionsPdf( apiForm.relProvCont, relationProveedor )
                                      )}
                                  </Row>
                                )}

                              <Row className="subheader">
                                <Col xl={24}>III. Ejercicio del cargo de Director o Ejecutivo Principal en otras sociedades o personas jurídicas </Col>
                              </Row>
                              <Row className="summary">
                                <Col span={21}>
                                  Declaro que ejerzo el cargo de director, representante legal, gerente general u otro equivalente
                                  en la (s) siguiente(s) sociedad (es) o compañía (s).{" "}
                                </Col>

                                {renderFormItem({
                                  label: "",
                                  name: "hasRelCompetitor",
                                  initialValue:
                                    apiForm.hasRelCompetitor !== null
                                      ? apiForm.hasRelCompetitor
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
                                      onChange={({ target }) => hancleOnChangeRadioButton( "hasRelCompetitor", target.value ) }
                                    >
                                      <Radio className="radio-switch" value={true}>
                                        Sí
                                  </Radio>
                                      <Radio className="radio-switch" value={false}>
                                        No
                                  </Radio>
                                    </Radio.Group>
                                  ),
                                })}
                              </Row>

                              {(apiForm.hasRelCompetitor || openContent) && (
                                <Row className="content">
                                  {format === "html" && !signed &&
                                    <>
                                      <Row className="inner-row" gutter={[16, 8]}>

                                        {renderFormItemTable({
                                          section: competencia.competenciaTipoCargo,
                                          options: [
                                            { val: "Director", text: "Director" },
                                            { val: "Gerente General", text: "Gerente General" },
                                            { val: "Representante Legal", text: "Representante Legal" },
                                            { val: "Administrador", text: "Administrador" },
                                            { val: "Socio Gestor", text: "Socio Gestor" },
                                          ],
                                        })}

                                        {renderFormItemTable({
                                          section: competencia.competenciaCompanyName,
                                        })}
                                      </Row>

                                      <Row className="inner-row" gutter={[16, 8]}>
                                        {renderFormItemTable({
                                          section: competencia.competenciaCompanyTipoDoc,
                                          options: [
                                            { val: "Chile-Rut", text: "Chile-Rut" },
                                            { val: "Tax Id", text: "Tax Id" }
                                          ],
                                        })}

                                        {renderFormItemTable({
                                          section: competencia.competenciaCompanyRut,
                                          validator: docValidator(competencia.competenciaCompanyTipoDoc.val, 'company')
                                        })}
                                      </Row>

                                      <Row className="inner-row" gutter={[16, 8]}>
                                        {renderFormItemTable({
                                          section: competencia.competenciaPais,
                                        })}
                                      </Row>

                                      <Row className="button-row">
                                        {apiForm.relCompetitor.length < 1 &&
                                          validarRegistros &&
                                          apiForm.hasRelCompetitor && (
                                            <Col
                                              span={24}
                                              className="missing-registers ant-form-explain"
                                            >
                                              {t("messages.aml.registersRequired")}
                                            </Col>
                                          )}

                                        <Col className="addRelation" xl={3}>
                                          <Button type="primary" htmlType="button" onClick={handleOnAddCompetencia} > Añadir </Button>
                                        </Col>
                                        <Col className="addRelation" xl={3}>
                                            <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('competencia')} > Limpiar </Button>
                                        </Col>
                                      </Row>
                                    </>
                                  }

                                  {apiForm.relCompetitor.length > 0 &&
                                    format === "html" ? (
                                      <Table
                                        columns={competenciaColumns}
                                        dataSource={apiForm.relCompetitor}
                                        size="middle"
                                        pagination={false}
                                      ></Table>
                                    ) : (
                                      toDescriptionsPdf(
                                        apiForm.relCompetitor,
                                        competencia
                                      )
                                    )}
                                </Row>
                              )}


                              <Row
                                className="subheader"
                                style={{
                                  marginTop: "0px",
                                }}
                              >
                                <Col xl={24}>IV. Malla Parental </Col>
                              </Row>
                              <Row className="content">
                                <Row className="summary">
                                  <Col xl={24}>
                                    Mi grupo familiar directo está compuesto por:
                                  </Col>
                                </Row>

                                {format === "html" && !signed &&
                                    <>
                                      <Row className="fields-row" gutter={[16, 8]}>
                                        {renderFormItemTable({
                                          section: malla.mallaType,
                                          cols:8,
                                          options: [
                                            { val: "Cónyuge", text: "Cónyuge" },
                                            { val: "Hijo(a)", text: "Hijo(a)" }
                                          ],
                                        })}

                                        {renderFormItemTable({
                                          section: malla.mallaName,
                                          cols:8
                                        })}

                                        {renderFormItemTable({
                                          section: malla.mallaTipoDoc,
                                          cols:8,
                                          options: [
                                            { val: "Chile-Rut", text: "Chile-Rut" },
                                            { val: "Cédula de Identidad", text: "Cédula de Identidad" },
                                            { val: "Tax Id", text: "Tax Id" }
                                          ],
                                        })}
                                      </Row>

                                      <Row className="fields-row" gutter={[16, 8]}>

                                        {renderFormItemTable({
                                          section: malla.mallaRut,
                                          cols:8,
                                          validator: docValidator( malla.mallaTipoDoc.val,'persona' )
                                        })}
                                      </Row>

                                      <Row className="button-row">
                                        <Col className="addRelation" xl={3}>
                                          <Button type="primary" htmlType="button" onClick={handleOnAddMalla} > Añadir </Button>
                                        </Col>
                                        <Col className="addRelation" xl={3}>
                                            <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('malla')} > Limpiar </Button>
                                          </Col>
                                      </Row>
                                    </>
                                  }

                                {
                                  apiForm.family.length > 0 && (
                                    <Table
                                      columns={mallaColumns}
                                      dataSource={apiForm.family}
                                      size="middle"
                                      pagination={false}
                                    ></Table>
                                  )
                                }
                              </Row>{" "}
                              {/*end of content row */}





                              <Row className="subheader">
                                <Col xl={24}>
                                  V. Declaración de responsabilidad
                            </Col>
                              </Row>
                              {/* <Row className="summary">
                            <Col xl={24}>

                            </Col>
                          </Row> */}

                              <Row
                                className="content"
                                style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                              >
                                <Row className="summary">
                                  <Col xl={24}>

                                    <div>
                                      Declaro expresamente que la información entregada en esta declaración es veraz y completa, y declaro estar en pleno conocimiento de la
                                      importancia que ella tiene para <strong> {apiForm.recipient.request.createUser.cliente.name} </strong>  y sus filiales, y el cumplimiento por parte de éstas, de la
                                      normativa legal y regulatoria en el proceso de otorgamiento de créditos y control de límites legales.

                                    <br />
                                      <br />

                                      Finalmente, declaro conocer y aceptar que es mi obligación informar a mi empleador sobre cualquier cambio que se produzca en la
                                      información entregada precedentemente, tan pronto dicho cambio de produzca.
                                  </div>

                                  </Col>
                                </Row>
                                {format === "html" && !signed &&
                                  <Row className="button-row">
                                    <Col className="submitTrabajador" xl={24}>
                                      <Button type="primary" htmlType="submit" icon={openSigner ? 'loading' : 'file-protect'}>
                                        { hasSign ? 'Firmar' : 'Enviar' }
                                      </Button>
                                    </Col>
                                  </Row>
                                }
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

export default withRouter(Form.create()(FormTrab));
