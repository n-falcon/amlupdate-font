import "./formPatr.scss";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, Form, Input, Row, Spin, Select, Tooltip, Radio, Table, Icon, notification, Descriptions, } from "antd";
import apiConfig from '../../../../../config/api'
import { FormLayout } from "../../../../../layouts";
import { withRouter } from "react-router-dom";
import { getFormPromise, getParamsPromise, sendFormPromise, signCDIFormPromise, saveFormCDIprovPromise} from "../../../promises";
import moment from "moment";
import Logo from "./components/Logo/Logo";
import { validateRutHelper, validateCompanyRutHelper, } from "../../../../../helpers";
import HelloSign from 'hellosign-embedded';


const FormPatr = ({ form, match }) => {
  const [formType, setFormType] = useState(null)
  const [repeatedCompany, setRepatedCompany] = useState(null)
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

  let registersStop = { family: false, relProvCont: false, relLabAnt: false, outsideActivities: false,
    relCompetitor: false, relRelationship: false, relPepFp: false, relFundPjsfl: false, othersCDI: false, };

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
        case 'laboral':
          setLaboral({...laboralIS})
          setFieldsValue(Object.keys(laboralIS).reduce((acu,key)=>{
            return {...acu,[key]:null}
          },{}))
          break;
      default:
        break;
    }
  }

  const baseParamsIS = {
      name: {key:'name' ,max:150, id:'name',readOnly:true, type:'input', title:"Nombre de la persona declarante" , titleJ: "Nombre de la persona que completa la declaración"},
      tipoDoc: {key:'tipoDoc', id:'tipoDoc',readOnly:true, type:'input', title: "Tipo de documento de identidad de la persona declarante", titleJ: "Tipo de documento de identidad de la persona que completa la declaración"},
      rut: {key: 'rut', max:20, id:'rut',readOnly:true, type:'input',title:"Documento de identidad de la persona declarante" ,titleJ: "Número de Documento de identidad de la persona que completa la declaración"},
      comAddress: {key: 'comAddress', max:255, id:'comAddress',readOnly:true, type:'input',title:"Dirección de la persona declarante" ,titleJ: ""},
      tipoDocCompany: {key:'giro', id:'tipoDocCompany',readOnly:true, type:'select', title: "Tipo de documento de identidad de la Empresa declarante"},
      nameEmpresa:{key:'nameEmpresa', id:'nameEmpresa', readOnly:true,type:'input', title:'Nombre o Razón Social de la Empresa declarante'},
      rutEmpresa:{key:'rutEmpresa', id:'rutEmpresa',  readOnly:true,type:'input', title:'Documento de identidad de la Empresa declarante'},
      comAddressEmpresa:{key:'comAddress', id:'comAddressEmpresa', readOnly:true,type:'input', title:"Dirección de la Empresa declarante"},
  }
  const [baseParams, setBaseParams]=useState(baseParamsIS)

  const handleReadOnly = (field,readOnly,sectionId=null)=>{
    if (sectionId===null){
      const key = Object.entries(baseParams).filter(([key,value])=>{
        return value.id === field
      })[0][0]
      setBaseParams({...baseParams,[key]:{...baseParams[key],readOnly:readOnly}})
    }else{
      settingStateObj(sectionId,readOnly)
    }
  }

  const settingStateObj=(sectionId,readOnly)=>{
    const [stateObject,stateObjectSetter] = customState(sectionId)
    stateObjectSetter({...stateObject,[sectionId]:{...stateObject[sectionId],readOnly:readOnly}})
  }

  const customState=(sectionId)=>{
    if (sectionId.startsWith('relationParentesco')) {
      return([relationParentesco,setRelationParentesco])
    }
    if (sectionId.startsWith('prov')) {
      return([relationProveedor,setRelationProveedor])
    }
    if (sectionId.startsWith('laboral')) {
      return([laboral,setLaboral])
    }
  }

  const handleOnChangeField = (sectionId, value) => {
    const [stateObject,stateObjectSetter] = customState(sectionId)
    stateObjectSetter({ ...stateObject, [sectionId]: { ...stateObject[sectionId], val: value }});
  };

  const handleOnChangeIntro = async (fieldObj, value) => {
    let formToUpdate = { ...apiForm, [fieldObj.key]: value };
    let ret = await saveFormPromiseLocal(formToUpdate);
    // if(!ret.success) { setFieldsValue({[field]: ret.form[field]}) }
};

  const relationParentescoIS = {
    relationParentescoName: { key: "name", val: "",maxLength:150, readOnly:true, type:'input', id:"relationParentescoName", title: "Nombre de la Sociedad"  },
    relationParentescoTipoDoc: { key: "tipoDoc", val: "",id:"relationParentescoTipoDoc", title: "Tipo de documento de identidad de la Sociedad" },
    relationParentescoRut: { key: "rut", val: "",maxLength:20, readOnly:true, type:'input', id:"relationParentescoRut", title: "Documento de identidad " },
    relationParentescoDirecta: { key: "position", val: "",maxLength:5, readOnly:true, type:'input', id:"relationParentescoDirecta", title: "% participación" },
  }
  const [relationParentesco, setRelationParentesco] = useState(relationParentescoIS);

  const relationProveedorIS = {
    provName: { key: "name", val: "", maxLength:150, readOnly:true, type:'input', id:"provName", title: "Nombre de la Sociedad"},
    provTipoDoc: { key: "tipoDoc", val: "", id:"provTipoDoc", title: "Tipo de documento de identidad de la Sociedad" },
    provRut: { key: "rut", val: "", maxLength:20, readOnly:true, type:'input', id:"provRut", title: "Documento de identidad" },
    provCapital: { key: "percentage", val: "", maxLength:5, readOnly:true, type:'input', id:"provCapital", title: "% participación" },
  }
  const [relationProveedor, setRelationProveedor] = useState(relationProveedorIS);

  const laboralIS = {
    laboralName: { key: "name", val: "", maxLength:150, readOnly:true, type:'input', id:"laboralName", title: "Nombre del socio o accionista" },
    laboralTipoDoc: { key: "tipoDoc", val: "", title: "Tipo de Documento de Identidad del socio o accionista", id:'laboralTipoDoc'},
    laboralRut: { key: "rut", val: "", maxLength:20, readOnly:true, type:'input', id:"laboralRut", title: "Número de Documento de identidad del socio o accionista" },
    laboralPosition: { key: "position", val: "", maxLength:5, readOnly:true, type:'input', id:"laboralPosition", title: "Porcentaje de participación del Capital Social" },
  }
  const [laboral, setLaboral] = useState(laboralIS);

  const validateLengthBaseParam = (field)=>
  {
    return {
      max: field.max,
      message: "Debe tener un máximo de "+ field.max + " caracteres."
    }
  }

  const validateLengthFieldWithInnerLength = (section)=>{
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
    if (Object.keys(stateObject)[0].startsWith('laboral')) {
      setLaboral(stateCopy)
    }
    validateFields(Object.keys(stateObject))
  }

  const testLengthBaseParams = (offset)=>{
    const test = Object.entries(baseParams).filter(([key,value])=>{
      return value.type==='input'
    }).reduce((acu,item)=>{
      return {...acu, [item[1].id]: 'x'.repeat(item[1].max+offset)}
    },{})
    setFieldsValue(test)
    validateFields(Object.values(baseParams).map(obj=>obj.id))
  }

  const doTests = ()=>{
    setTimeout(()=>{
      testLength(relationProveedor,1)
      testLength(relationParentesco,1)
      testLength(laboral,1)
      testLengthBaseParams(1)
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

        setFormType(response.data.recipient.record.type)
        setApiForm(responseData);
        setUser(response.data.recipient.request.createUser);
        setRepatedCompany(response.data.recipient.request.createUser.cliente.name)
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
    //  doTests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const saveFormPromiseLocal = async (form) => {
    let response = await saveFormCDIprovPromise(form);
    if(response.code !== 'OK' && response.form !== undefined && response.form !== null) {
      setApiForm(response.form)
      if(response.code === 'ERROR') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
        });
      }else if(response.code === 'E01') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
          description: 'Error al grabar datos de la declaración'
        });
      }else if(response.code === 'E02') {
        notification["error"]({
          message: t("messages.aml.notifications.anErrorOcurred"),
          description: 'Error al grabar datos de la declaración'
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
      return { success: false, form: response.form}
    }else {
      setApiForm(form)
      return { success: true }
    }
  }

  const hancleOnChangeRadioButton = (field, value) => {
    if(!signed) {
      formToUpdate = { ...apiForm, [field]: value };
      saveFormPromiseLocal(formToUpdate);
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
    validateFields(["hasRelRelationship", "hasRelProvCont", "hasRelLabAnt", ...Object.values(baseParamsIS).map(obj=>obj.id)]);

    if (apiForm.hasRelRelationship && apiForm.relRelationship.length === 0) {
      validateFields(Object.keys(relationParentesco));
      registersStop = { ...registersStop, relRelationship: true };
    }
    if (apiForm.hasRelProvCont && apiForm.relProvCont.length === 0) {
      validateFields(Object.keys(relationProveedor));
      registersStop = { ...registersStop, relProvCont: true };
    }
    if (apiForm.hasRelLabAnt && apiForm.relLabAnt.length === 0) {
      validateFields(Object.keys(laboral));
      registersStop = { ...registersStop, relLabAnt: true };
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
            let errores = sentErrors+1
            setSentErrors(errores)

            notification["error"]({
              message: "Error al iniciar servicio de Firma Electronica",
              description: errores === 1 ? 'Error Interno: Actualice y reintente.' : 'Comuníquese con soporte.aml@gesintel.cl'
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
              title="El sistema requiere que se ingrese un Rut, en caso que el sujeto identificado no tenga Rut por favor ingresar tu mismo Rut "
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

  const renderFormItemTable = ({ section, cols=12, type='input', options=[], required=true, validator=null, customRule=null }) => {
      return renderFormItem({
        label: section.title,
        name: section.id,
        initialValue: section.val,
        colClassName: "topLabel",
        labelCol: 0,
        wrapperCol: 0,
        rules:
        [
          { required: required, message: t( "messages.aml.requestedField")},
          { validator: validator },
          validateLengthFieldWithInnerLength(section),
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
            <Select
              onChange={(value) => handleOnChangeField(section.id, value) }
            >
              { options.map((option) => (<Select.Option value={option.val}>{ option.text }</Select.Option>)) }
              </Select>
            :
            <Input/>
        ),
      })
  }

  const renderFormItemBase = ({ section, title, cols=12, type='input', disabled=false, required = true, options=[], initialValue, validator=null }) => {
    return renderFormItem({
        label: title ? title : section.title,
        name: section.id,
        initialValue: initialValue,
        colClassName: "topLabel",
        labelCol: 0,
        wrapperCol: 0,
        rules: [
          { required: required, message: t("messages.aml.requestedField"), },
          { validator: validator },
          validateLengthBaseParam(section)
        ],
        wrapperCols: cols,
        item: (
          type === 'input' ?
            <Input
              disabled = {disabled}
              autoComplete="off"
              onFocus= {(e)=>handleReadOnly(e.target.id,false)}
              onBlur= {(e)=>handleReadOnly(e.target.id,true)}
              readOnly = {section.readOnly}
              onChange={(e) => handleOnChangeIntro(section, e.target.value) }
            />
          : format === 'html' ?
              <Select
                disabled = {disabled}
                onChange={(value) => handleOnChangeIntro(section, value) }
              >
              { options.map((option) => (<Select.Option value={option.val}>{ option.text }</Select.Option>)) }
              </Select>
            :
            <Input/>
        )
      })
  }


  const handleOnAddRelationProveedor = () => {
    setIsValidate(true);
    validateFields(Object.keys(relationProveedor)).then((error, values) => {
      const relationProveedorOk = Object.keys(relationProveedor).reduce((acc, e) => {
          return {
            ...acc, [relationProveedor[e].key]: relationProveedor[e].val,
          };
      }, {} );
      apiForm.relProvCont.push({ ...relationProveedorOk });
      saveFormPromiseLocal(apiForm)
      handleOnClear('relationProveedor')
    });
    registersStop.relProvCont = false;
  };

  const handleDeleteRelationProveedor = (index) => {
    return () => {
      let xx = [...apiForm.relProvCont];
      xx.splice(index, 1);
      formToUpdate = { ...apiForm, relProvCont: xx };
      saveFormPromiseLocal(formToUpdate)
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

      saveFormPromiseLocal(apiForm)
      handleOnClear('relationParentesco')
    });
    registersStop.relRelationship = false;
  };

  const handleDeleteRelationParentesco = (index) => {
    return () => {
      let xx = [...apiForm.relRelationship];
      xx.splice(index, 1);
      formToUpdate = { ...apiForm, relRelationship: xx };

      saveFormPromiseLocal(formToUpdate)
    };
  };

  const handleOnAddLaboralRelation = () => {
    setIsValidate(true);

    validateFields(Object.keys(laboral))
      .then((error, values) => {
        const laboralOk = Object.keys(laboral).reduce((acc, e) => {
          return { ...acc, [laboral[e].key]: laboral[e].val };
        }, {});

        apiForm.relLabAnt.push({ ...laboralOk });
        saveFormPromiseLocal(apiForm).then(ret => {
          if(ret.success) handleOnClear('laboral')
        });
      })
      .catch((error) => {});
    registersStop.relLabAnt = false;
  };

  const handleDeleteLaboral = (index) => {
    return () => {
      let xx = [...apiForm.relLabAnt];
      xx.splice(index, 1);
      let formToUpdate = { ...apiForm, relLabAnt: xx };
      saveFormPromiseLocal(formToUpdate);
    };
  };

  let formToUpdate = {};

  const relationParentescoColumns = [
    {
      title: relationParentesco.relationParentescoRut.title,
      dataIndex: relationParentesco.relationParentescoRut.key,
    },
    {
      title: relationParentesco.relationParentescoName.title,
      dataIndex: relationParentesco.relationParentescoName.key,
    },
    {
      title: relationParentesco.relationParentescoDirecta.title,
      dataIndex: relationParentesco.relationParentescoDirecta.key,

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


  const relationProveedorColumns = [
    {
      title: relationProveedor.provName.title,
      dataIndex: relationProveedor.provName.key,
    },
    {
      title: relationProveedor.provRut.title,
      dataIndex: relationProveedor.provRut.key,
    },
    {
      title: relationProveedor.provCapital.title,
      dataIndex: relationProveedor.provCapital.key,
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

  const laboralColumns = [
    {
      title: laboral.laboralName.title,
      dataIndex: laboral.laboralName.key,
    },
    {
      title: laboral.laboralRut.title,
      dataIndex: laboral.laboralRut.key,
    },
    {
      title: laboral.laboralPosition.title,
      dataIndex: laboral.laboralPosition.key,
    },
    format === "html"
      ? {
          title: "Acción",
          dataIndex: "",
          key: "x",

          render: (text, record, index) => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a onClick={handleDeleteLaboral(index)}>
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
                          style={{ backgroundColor: "rgba(255,255,255,0.9)", marginTop: "0px", marginBottom: "0px", textAlign: "left", paddingTop: "10px", paddingLeft: "10px", }}
                        >
                          <Col xs={24 - colLogo} sm={24 - colLogo} md={24 - colLogo} lg={24 - colLogo} xl={24 - colLogo} >
                            <h3> DECLARACIÓN JURADA SOBRE RELACIONES PATRIMONIALES CONTROL MÁRGENES DE CRÉDITO </h3>
                            <h4> Articulo 85 General de Bancos – {formType==='Entity' ? 'Persona Jurídica':'Persona Natural'}</h4>
                            <h4> {repeatedCompany} </h4>
                          </Col>
                          <Col className="logo-col" xs={colLogo} sm={colLogo} md={colLogo} lg={colLogo} xl={colLogo} >
                            <Logo currentUser={{ userId: user.id, subclienteId }} />
                          </Col>
                        </Row>

                        <Row
                          className="date"
                          gutter={[0, 6]}
                          style={{ backgroundColor: "rgba(255,255,255,0.9)", marginTop: "0px", marginBottom: "0px", textAlign: "left", paddingBottom: "15px", paddingLeft: "10px", }}
                        >
                          <Col span={2} style={{ textAlign: "left" }}>
                            Fecha:
                        </Col>

                          <Col span={4}>
                            <div
                              className="formDate"
                              style={{ marginLeft: "5px", borderStyle: "solid", borderWidth: "1px", borderColor: "#e8e8e8", display: "flex", justifyContent: "center", }}
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
                              style={{ borderStyle: "solid", borderWidth: "1px", borderColor: "#e8e8e8", display: "flex", justifyContent: "center", marginRight: "10px", marginLeft: "8px", }}
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
                                <Col xl={24}>{formType === 'Entity' ? 'Datos de la Persona que completa la declaración' : 'Datos de la Persona declarante'} </Col>
                              </Row>
                              <Row className="summary">
                                <Col span={24}>
                                A continuación, por favor complete los datos solicitados
                                </Col>
                              </Row>
                              <Row className="content">
                                    <Row className="inner-row" gutter={[16, 8]}>
                                      {renderFormItemBase({
                                        section: baseParams.name,
                                        title: formType === 'Entity' ? baseParamsIS.name.titleJ:baseParamsIS.name.title,
                                        disabled: apiForm.recipient.record.type==="Person" && format === "html",
                                        initialValue: (apiForm.name !== null || apiForm.recipient.record.type==="Entity") ? apiForm.name : apiForm.recipient.record.nombre,
                                      })}

                                      { renderFormItemBase({
                                        section: baseParams.tipoDoc,
                                        title: formType === 'Entity' ? baseParamsIS.tipoDoc.titleJ:baseParamsIS.tipoDoc.title,
                                        options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                        initialValue: apiForm.tipoDoc,
                                        type: 'select'
                                      })}
                                    </Row>
                                    <Row className="inner-row" gutter={[16, 8]}>
                                      {renderFormItemBase({
                                        section: baseParams.rut,
                                        title: formType === 'Entity' ? baseParamsIS.rut.titleJ:baseParamsIS.rut.title,
                                        disabled: apiForm.recipient.record.type==="Person" && format === "html",
                                        initialValue: (apiForm.rut !== null || apiForm.recipient.record.type==="Entity") ? apiForm.rut : apiForm.recipient.record.rut,
                                        validator: docValidator(apiForm.tipoDoc,'persona')
                                      })}

                                      {apiForm.recipient.record.type==="Person" &&
                                        renderFormItemBase({
                                          section: baseParams.comAddress,
                                          title: baseParams.comAddress.title,
                                          initialValue: apiForm.comAddress
                                        })
                                      }
                                    </Row>
                              </Row>

                              {
                                apiForm.recipient.record.type==="Entity"&&
                                <>
                                   <Row
                                    className="lineamiento subheader"
                                    style={{ marginTop: "0px" }}
                                  >
                                    <Col xl={24}>Datos de la Empresa declarante</Col>
                                  </Row>
                                  <Row className="summary">
                                    <Col span={24}>
                                    A continuación, por favor complete los datos solicitados
                                    </Col>
                                  </Row>
                                  <Row className="content">
                                    <Row className="inner-row" gutter={[16, 8]}>
                                      {renderFormItemBase({
                                        section: baseParams.nameEmpresa,
                                        disabled: format === "html",
                                        required:false,
                                        initialValue: apiForm.recipient.record.nombre,
                                      })}

                                      {renderFormItemBase({
                                        section: baseParams.tipoDocCompany,
                                        initialValue: apiForm.giro,
                                        required:false,
                                        type:'select',
                                        options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }]
                                      })}
                                    </Row>
                                  </Row>
                                  <Row className="content">
                                        <Row className="inner-row" gutter={[16, 8]}>
                                          {renderFormItemBase({
                                            section: baseParams.rutEmpresa,
                                            disabled: format === "html",
                                            required:false,
                                            initialValue: apiForm.recipient.record.rut,
                                            cols: 8,
                                          })}
                                          {renderFormItemBase({
                                            section: baseParams.comAddressEmpresa,
                                            initialValue: apiForm.comAddress,
                                            cols: 16,
                                          })}
                                        </Row>
                                  </Row>
                                </>
                              }

                              <Row
                                className="lineamiento subheader"
                                style={{ marginTop: "0px" }}
                              >
                                <Col xl={24}>Introducción</Col>
                              </Row>
                              <Row className="summary">
                                {
                                  formType==='Entity' ?
                                  <Col xl={24}>
                                  Para efectos que {" "} <strong>{repeatedCompany}</strong> , de acuerdo con el Art. 85 Ley General
                                  de Bancos, pueda calcular el monto de las obligaciones complementarias que puedan afectar los márgenes contemplados
                                  en el Art. 84 de la citada ley, el (los) infrascrito(s) actuando como sí o como actual(es) apoderado(s) de la persona
                                  jurídica que representa, declaramos bajo juramento
                                </Col>
                                :
                                <Col xl={24}>
                                Para efectos que {" "} <strong>{repeatedCompany}</strong> , de acuerdo con el Art. 85 Ley General de
                                Bancos, pueda calcular el monto de las obligaciones complementarias que puedan afectar los márgenes contemplados en el
                                Art. 84 de la citada ley, el infrascrito actuando por sí, declara bajo juramento:
                              </Col>

                                }
                              </Row>


                              <Row className="subheader">
                                <Col xl={24}>
                                  I. Participación en sociedades {" "}
                                </Col>
                              </Row>
                              <Row className="summary">
                                <Col span={21}>
                                  {
                                    formType==='Entity' ?
                                    'La persona jurídica que represento tiene una participación directa y/o indirecta porcentual superior al 2% del capital social, en las siguientes sociedades'
                                    :
                                    'Tengo una participación porcentual directa y/o indirecta superior al 2% del capital social, en las siguientes sociedades:'
                                  }
                               </Col>

                                {renderFormItem({
                                  label: "",
                                  name: "hasRelRelationship",
                                  initialValue: apiForm.hasRelRelationship !== null ? apiForm.hasRelRelationship : null,
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
                                      onChange={({ target }) => hancleOnChangeRadioButton( "hasRelRelationship", target.value ) }
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
                                          { renderFormItemTable({
                                            section: relationParentesco.relationParentescoName,
                                          })}
                                          { renderFormItemTable({
                                            section: relationParentesco.relationParentescoTipoDoc,
                                            type: 'select',
                                            options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Cédula de Identidad", text: "Cédula de Identidad" }, { val: "Tax ID", text: "Tax ID" }]
                                          })}
                                        </Row>

                                        <Row className="inner-row" gutter={[16, 8]}>
                                          { renderFormItemTable({
                                            section: relationParentesco.relationParentescoRut,
                                            validator: docValidator(relationParentesco.relationParentescoTipoDoc.val, 'company'),
                                          })
                                          }
                                          { renderFormItemTable({
                                            section: relationParentesco.relationParentescoDirecta,
                                            customRule:{
                                              pattern: new RegExp(/^((100(\.0{1,2})?)|(\d{1,2}(\,\d{1,2})?))$/),
                                              message: "Por favor introduzca un porcentaje (Formato XX,XX)"
                                            },
                                           })
                                          }
                                        </Row>
                                        <Row className="button-row">
                                          {apiForm.relRelationship.length < 1 &&
                                            validarRegistros &&
                                            apiForm.hasRelRelationship && (
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
                                  II. Participación en sociedades en comandita comercial o sociedades colectivas comerciales {" "}
                                </Col>
                              </Row>
                              <Row className="summary">
                                {
                                  formType==='Entity' ?
                                  <Col span={21}>
                                  La persona jurídica que represento es socio gestor de las siguientes sociedades en comandita comercial, o
                                  bien, es socio solidario en las siguientes sociedades colectivas comerciales, con un porcentaje superior al 2% del
                                  capital social:
                                  </Col>
                                  :
                                  <Col span={21}>
                                   Soy socio gestor de las siguientes sociedades en comandita comercial, o bien, socio solidario en las
                                   siguientes sociedades colectivas comerciales, con un porcentaje superior al 2% del capital social:
                                  </Col>
                                }

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
                                      onChange={({ target }) => hancleOnChangeRadioButton( "hasRelProvCont", target.value ) }
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
                                    {format === "html" && !signed && (
                                        <>
                                          <Row className="inner-row" gutter={[16, 8]}>
                                            { renderFormItemTable({
                                              section: relationProveedor.provName,
                                            })}
                                            { renderFormItemTable({
                                              section: relationProveedor.provTipoDoc,
                                              type:'select',
                                              options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Cédula de Identidad", text: "Cédula de Identidad" }, { val: "Tax ID", text: "Tax ID" }]
                                            })}
                                          </Row>
                                          <Row className="inner-row" gutter={[16, 8]}>
                                            { renderFormItemTable({
                                              section: relationProveedor.provRut,
                                              validator: docValidator(relationProveedor.provTipoDoc.val,'company'),
                                            })}
                                            { renderFormItemTable({
                                              section: relationProveedor.provCapital,
                                              customRule:{
                                                pattern: new RegExp(/^((100(\.0{1,2})?)|(\d{1,2}(\,\d{1,2})?))$/),
                                                message: "Por favor introduzca un porcentaje (Formato XX,XX)"
                                              },
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
                                          columns={relationProveedorColumns}
                                          dataSource={apiForm.relProvCont}
                                          size="middle"
                                          pagination={false}
                                        ></Table>
                                      ) : (
                                        toDescriptionsPdf(
                                          apiForm.relProvCont,
                                          relationProveedor
                                        )
                                      )}
                                  </Row>
                                )}



                                {

                                  formType === 'Entity'&&
                                  <>
                                    <Row className="subheader">
                                      <Col xl={24}>III. Composición Accionaria </Col>
                                    </Row>
                                    <Row className="summary">
                                      <Col span={21}>
                                      La persona jurídica que represento está a su vez compuesta por los siguientes socios o accionistas
                                      con una partipación superior al 2% del capital social.{" "}
                                      </Col>
                                      {renderFormItem({
                                        label: "",
                                        name: "hasRelLabAnt",
                                        initialValue: apiForm.hasRelLabAnt !== null ? apiForm.hasRelLabAnt : null,
                                        colClassName: "switch-col",
                                        itemClassName: "radio-item",
                                        labelCol: 0,
                                        wrapperCol: 0,
                                        offset: 0,
                                        rules: [ { required: true, message: t("messages.aml.dontForgetSelect"), }, ],
                                        wrapperCols: 3,
                                        item: (
                                          <Radio.Group
                                            onChange={({ target }) => hancleOnChangeRadioButton( "hasRelLabAnt", target.value ) }
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

                                    {apiForm.hasRelLabAnt !== null && apiForm.hasRelLabAnt && (
                                      <div className="content">
                                        {format === "html" && (
                                          <>
                                            <Row className="inner-row" gutter={[16, 8]}>
                                            { renderFormItemTable({
                                              section: laboral.laboralName,
                                            })}
                                           { renderFormItemTable({
                                              section: laboral.laboralTipoDoc,
                                              type:'select',
                                              options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }]
                                            })}
                                            </Row>
                                            <Row className="inner-row" gutter={[16, 8]}>
                                            { renderFormItemTable({
                                              section: laboral.laboralRut,
                                              validator: docValidator( laboral.laboralTipoDoc.val ),
                                            })}
                                            { renderFormItemTable({
                                              section: laboral.laboralPosition,
                                              customRule:{
                                                pattern: new RegExp(/^((100(\.0{1,2})?)|(\d{1,2}(\,\d{1,2})?))$/),
                                                message: "Por favor introduzca un porcentaje (Formato XX,XX)"
                                              },
                                            })}
                                            </Row>

                                            <Row className="button-row">
                                              {apiForm.relLabAnt.length < 1 && validarRegistros && apiForm.hasRelLabAnt && (
                                                  <Col span={24} className="missing-registers ant-form-explain" >
                                                    {t("messages.aml.registersRequired")}
                                                  </Col>
                                              )}
                                              <Col className="addRelation" xl={3}>
                                                <Button type="primary" htmlType="button" onClick={handleOnAddLaboralRelation} icon="plus" >
                                                  Añadir
                                                </Button>
                                              </Col>
                                              <Col className="addRelation" xl={3}>
                                                    <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('laboral')} >
                                                      Limpiar
                                                    </Button>
                                              </Col>
                                            </Row>
                                          </>
                                        )}

                                        {apiForm.relLabAnt !== null && apiForm.relLabAnt !== undefined && apiForm.relLabAnt.length > 0 && format === "html" ? (
                                          <Table
                                            columns={laboralColumns}
                                            dataSource={apiForm.relLabAnt}
                                            size="middle"
                                            pagination={false}
                                          ></Table>
                                        ) : (
                                          toDescriptionsPdf(apiForm.relLabAnt, laboral)
                                        )}
                                      </div>
                                    )}

                                  </>
                                }
                              <Row className="subheader">
                                <Col xl={24}>
                                  {formType === 'Entity' ? 'IV.' : 'III.'} Declaración de responsabilidad
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
                                    {formType === 'Entity' ?
                                      <>
                                        El declarante se obliga a comunicar de inmediato a <strong> {repeatedCompany} </strong>  cualquier
                                        modificación que sufran las nóminas señaladas anteriormente ya sea por variación de porcentajes de participación, por
                                        nuevas participaciones en otras sociedades o por variación de la composición en la sociedad que declara.
                                      </>
                                      :
                                      <>
                                       El declarante se obliga a comunicar de inmediato a <strong> {repeatedCompany} </strong> cualquier modificación que
                                       sufran las nóminas señaladas anteriormente ya sea por variación de porcentajes de participación o por nuevas
                                       participaciones en otras sociedades.
                                    </>
                                    }
                                    <br />
                                    <br />
                                    Acepto desde ya que <strong> {repeatedCompany} </strong> haga
                                    exigible de inmediato y considere como de plazo vencido cualquier obligación que tenga para con
                                    este <strong> {repeatedCompany} </strong> si, por lo declarado en el
                                    presente documento, el <strong> {repeatedCompany} </strong> determinare
                                    un monto de obligaciones para los efectos de márgenes en el otorgamiento de créditos que difiera de la realidad, y que
                                    por este motivo quede expuesto a multas y otras sanciones pecuniarias, situación en la cual es declarante
                                    resarcirá a <strong> {repeatedCompany} </strong> de todos los
                                    desembolsos que tuviere que realizar por dicho concepto, más intereses calculados a la tasa máxima convencional
                                    que estipula la Ley, quedando autorizado para realizar cargos en la Cuenta Corriente del declarante y/o descontarlo de
                                    cualquier otro depósito o captación en poder de él.
                                    <br />
                                    <br />
                                    El declarante conoce que, ante cualquier inexactitud, omisión o falta de actualización en esta declaración
                                    constituye el delito sancionado en el artículo 160 de la Ley General de Bancos.
                                    <br />
                                    <br />
                                    Sin perjuicio de lo anterior, el declarante autoriza a <strong> {repeatedCompany} </strong>
                                    para verificar la exactitud de la información por los medios que estime conveniente.
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

export default withRouter(Form.create()(FormPatr));
