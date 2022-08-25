import "./formTrab.scss";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, Form, Input, Row, Spin, DatePicker, Select, Tooltip, Radio, Table, Icon, notification, Descriptions, } from "antd";
import { FormLayout } from "../../../../../layouts";
import { withRouter } from "react-router-dom";
import { getFormPromise, getParamsPromise, sendFormPromise, saveFormCDItrabPromise, } from "../../../promises";
import moment from "moment";
import Logo from "./components/Logo/Logo";
import { validateRutHelper, validateCompanyRutHelper, } from "../../../../../helpers";

const FormTrab = ({ form, match }) => {
  const { t } = useTranslation();
  const { getFieldDecorator, validateFields, setFields, getFieldsError, setFieldsValue, getFieldError } = form;
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
  const [sentErrors, setSentErrors] = useState(0);
  const [clienteNombre, setClienteNombre] = useState("");

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
      case 'malla':
        setMalla({...mallaIS})
        setFieldsValue(Object.keys(mallaIS).reduce((acu,key)=>{
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

      case 'outdoor':
        setOutdoor({...outdoorIS})
        setFieldsValue(Object.keys(outdoorIS).reduce((acu,key)=>{
          return {...acu,[key]:null}
        },{}))
        break;

      case 'competencia':
        setCompetencia({...competenciaIS})
        setFieldsValue(Object.keys(competenciaIS).reduce((acu,key)=>{
          return {...acu,[key]:null}
        },{}))
        break;

      case 'relationParentesco':
        setRelationParentesco({...relationParentescoIS})
        setFieldsValue(Object.keys(relationParentescoIS).reduce((acu,key)=>{
          return {...acu,[key]:null}
        },{}))
        break;

      case 'relationPep':
        setRelationPep({...relationPepIS})
        setFieldsValue(Object.keys(relationPepIS).reduce((acu,key)=>{
          return {...acu,[key]:null}
        },{}))
        break;

      case 'relationFundaciones':
        setRelationFundaciones({...relationFundacionesIS})
        setFieldsValue(Object.keys(relationFundacionesIS).reduce((acu,key)=>{
          return {...acu,[key]:null}
        },{}))
        break;

      case 'relationOtros':
        setRelationOtros({...relationOtrosIS})
        setFieldsValue(Object.keys(relationOtrosIS).reduce((acu,key)=>{
          return {...acu,[key]:null}
        },{}))
        break;

      default:
        break;
    }
  }

  const baseParamsIS = {
      gerencia:{key:'gerencia', max:100, id:'gerencia', readOnly:true, type:'input', placeholder: "Ingrese la gerencia"},
      cargo:{key:'cargo', max:100, id:'cargo', readOnly:true, type:'input', placeholder: "Ingrese el cargo que ocupa"},
      relationOtrosDescripcion:{key:'relationOtrosDescripcion', max:4000, id:'relationOtrosDescripcion', readOnly:true , type:'input'},
      fechaCargo:{key:'fechaCargo', max:10, id:'fechaCargo', readOnly:true , type:'date', placeholder: "Ingrese la fecha del cargo"},
  }
  const [baseParams, setBaseParams]=useState(baseParamsIS)

  const handleReadOnlyTable = (stateObj,field,readOnly)=>{
    if (stateObj === 'relationProveedor'){

    }
    // const key = Object.entries(baseParams).filter(([key,value])=>{
    //   return value.id === field
    // })[0][0]
    // setBaseParams({...baseParams,[key]:{...baseParams[key],readOnly:readOnly}})
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
      return value.type==='input'
    }).reduce((acu,item)=>{
      return {...acu, [item[1].id]: 'x'.repeat(item[1].max+offset)}
    },{})
    setFieldsValue(test)
    validateFields(Object.values(baseParams).map(obj=>obj.id))
  }

  const handleOnChangeIntro = async (fieldObj, value) => {
    let formToUpdate = { ...apiForm, [fieldObj.key]: value };
    let ret = await saveFormCDItrabPromiseLocal(formToUpdate);
    //if(!ret.success) { setFieldsValue({[field]: ret.form[field]}) }
  };

  const mallaIS = {
    mallaType: { key: "type", val: "", id:"mallaType", type:'select', title:'Parentesco'},
    mallaName: { key: "name", val: "", id:"mallaName", maxLength:255, readOnly:true, title:'Nombre de la Persona' },
    mallaTipoDoc: { key: "tipoDoc", val: "", id:"mallaTipoDoc", type:'select', title: "Tipo de documento de la Persona"},
    mallaRut: { key: "rut", val: "", id:"mallaRut",maxLength:20, readOnly:true,title:"Documento de la Persona" },
  }
  const [malla, setMalla] = useState(mallaIS);

  const relationProveedorIS = {
    provCompanyType: { key: "companyType", val: "", title: "Tipo de Empresa", id:"provCompanyType", type:'select' },
    provCompanyName: { key: "companyName", val: "", title: "Nombre Empresa", maxLength:150, readOnly:true, id:"provCompanyName" },
    provCompanyTipoDoc: { key: "companyTipoDoc", val: "", title: "Tipo de documento de la Empresa", id:"provCompanyTipoDoc", type:'select' },
    provCompanyRut: { key: "companyRut", val: "", title: "Documento de la Empresa", maxLength:20, readOnly:true, id:"provCompanyRut" },
    provRelationship: { key: "relationship", val: "", title: "Parentesco", id:"provRelationship", type:'select' },
    provName: { key: "name", val: "", title: "Nombre de la Persona", maxLength:150, readOnly:true,id:"provName" },
    provTipoDoc: { key: "tipoDoc", val: "", title: "Tipo de documento de la Persona",id:"provTipoDoc", type:'select' },
    provRut: { key: "rut", val: "", title: "Documento de la Persona", maxLength:20, readOnly:true,id:"provRut" },
    provPosition: { key: "position", val: "", title: "Cargo en la Empresa",id:"provPosition", type:'select' },
    provPropertyType: { key: "propertyType", val: "", title: "Tipo de Propiedad",id:"provPropertyType", type:'select' },
    provPercentage: { key: "percentage", val: "", title: "Porcentaje de Participación", maxLength:10, readOnly:true,id:"provPercentage" },
    provIndCompanyName: { key: "indCompanyName", val: "", title: "Nombre Empresa Propiedad Indirecta", maxLength:150, readOnly:true,id:"provIndCompanyName" },
    provIndCompanyTipoDoc: { key: "indCompanyTipoDoc", val: "", title: "Tipo documento Empresa Propiedad Indirecta",id:"provIndCompanyTipoDoc" },
    provIndCompanyRut: { key: "indCompanyRut", val: "", title: "Documento Empresa Propiedad Indirecta", maxLength:20, readOnly:true,id:"provIndCompanyRut"},
  }
  const [relationProveedor, setRelationProveedor] = useState(relationProveedorIS);

  const laboralIS = {
    laboralCompanyName: { key: "name",id:"laboralCompanyName", val: "", maxLength:150, readOnly:true, title: "Nombre de Empresa" },
    laboralCompanyTipoDoc: { key: "tipoDoc", id:"laboralCompanyTipoDoc", val: "", title: "Tipo de Documento de la Empresa", type:'select' },
    laboralCompanyRut: { key: "rut", id:"laboralCompanyRut", val: "", maxLength:20, readOnly:true, title: "Documento de la Empresa" },
    laboralPosition: { key: "position", id:"laboralPosition", val: "", maxLength:150, readOnly:true, title: "Cargo Ejercido" },
    laboralStartDate: { key: "startDate", id:"laboralStartDate", val: null, title: "Fecha de Ingreso",maxLength:10,type:'date' },
    laboralEndDate: { key: "endDate", id:"laboralEndDate", val: null, title: "Fecha de Salida",maxLength:10,type:'date' },
  }
  const [laboral, setLaboral] = useState(laboralIS);

  const outdoorIS = {
    outdoorCompanyName: { key: "companyName", id:"outdoorCompanyName", val: "", maxLength:150, readOnly:true, title: "Nombre Sociedad o Institución" },
    outdoorCompanyTipoDoc: { key: "companyTipoDoc", id:"outdoorCompanyTipoDoc", val: "", title:"Tipo de documento de la empresa", type:'select' },
    outdoorCompanyRut: { key: "companyRut", id:"outdoorCompanyRut", val: "", maxLength:20, readOnly:true,title: "Documento de la empresa" },
    outdoorActivity: { key: "activity", id:"outdoorActivity", val: "", maxLength:150, readOnly:true, title:"Trabajo o Actividad realizada" },
  }
  const [outdoor, setOutdoor] = useState(outdoorIS);

  const competenciaIS = {
    competenciaCompanyName: { key: "companyName",id:"competenciaCompanyName", val: "", maxLength:150, readOnly:true,title: "Nombre Empresa de la Competencia" },
    competenciaCompanyTipoDoc: { key: "companyTipoDoc", id:"competenciaCompanyTipoDoc", val: "", title: "Tipo de Documento de Empresa de la Competencia", type:'select'},
    competenciaCompanyRut: { key: "companyRut", id:"competenciaCompanyRut", val: "", maxLength:20, readOnly:true, title: "Documento de Empresa de la Competencia" },
    competenciaRelationship: { key: "relationship", id:"competenciaRelationship", val: "", maxLength:20, readOnly:true, title: "Parentesco", type:'select'  },
    competenciaName: { key: "name",  id:"competenciaName", val: "",  maxLength:150, readOnly:true, title: "Nombre de la Persona"  },
    competenciaTipoDoc: { key: "rut", id:"competenciaTipoDoc", val: "", title: "Tipo de documento de la Persona", type:'select' },
    competenciaRut: { key: "rut", id:"competenciaRut", val: "", maxLength:20, readOnly:true, title: "Documento de la Persona"  },
    competenciaPosition: { key: "position", id:"competenciaPosition", val: "", maxLength:50, readOnly:true, title: "Cargo en la Empresa"},
  }
  const [competencia, setCompetencia] = useState(competenciaIS);

  const relationParentescoIS = {
    relationParentescoRelationship: { key: "relationship", id:"relationParentescoRelationship", val: "", title: "Parentesco", type:'select' },
    relationParentescoName: { key: "name", id:"relationParentescoName", val: "", maxLength:150, readOnly:true, title: "Nombre" },
    relationParentescoTipoDoc: { key: "tipoDoc", id:"relationParentescoTipoDoc", val: "", title: "Tipo de documento", type:'select' },
    relationParentescoRut: { key: "rut", id:"relationParentescoRut", val: "", maxLength:20, readOnly:true, title: "Documento"  },
    relationParentescoPosition: { key: "position", id:"relationParentescoPosition", val: "", maxLength:50, readOnly:true, title: "Cargo" },
    relationParentescoCompanyName: { key: "companyName", id:"relationParentescoCompanyName", val: "", title: "Empresa", type:'select' },
  }
  const [relationParentesco, setRelationParentesco] = useState(relationParentescoIS);

  const relationPepIS = {
    relationPepRelationship: { key: "field1", id:"relationPepRelationship", val: "", title: "Parentesco", type:'select' },
    relationPepName: { key: "field2", id:"relationPepName", val: "", maxLength:150, readOnly:true, title: "Nombre del PEP o Funcionario Publico "  },
    relationPepTipoDoc: { key: "field3", id:"relationPepTipoDoc", val: "", title: "Tipo de documento", type:'select' },
    relationPepRut: { key: "field4", id:"relationPepRut", val: "", maxLength:20, readOnly:true, title: "Documento"  },
    relationPepCategory: { key: "field5", id:"relationPepCategory", val: "", title: "Categoría" , type:'select' },
    relationPepInstitution: { key: "field6", id:"relationPepInstitution", val: "", maxLength:100, readOnly:true, title: "Institución u Organismo Público "  },
    relationPepPosition: { key: "field7", id:"relationPepPosition", val: "", maxLength:50, readOnly:true, title: "Cargo" },
    relationPepEndDate: { key: "field8", id:"relationPepEndDate", val: null, title: "Fecha de Término", type:'date', required: false },
  }
  const [relationPep, setRelationPep] = useState(relationPepIS);

  const relationFundacionesIS = {
    relationFundacionesCompanyName: { key: "companyName", id:"relationFundacionesCompanyName", val: "", maxLength:150, readOnly:true, title: "Nombre de la Institución"  },
    relationFundacionesCompanyTipoDoc: { key: "companyTipoDoc", id:"relationFundacionesCompanyTipoDoc", val: "", title: "Tipo de documento de la Institución", type:'select' },
    relationFundacionesCompanyRut: { key: "companyRut", id:"relationFundacionesCompanyRut", val: "", maxLength:20, readOnly:true, title: "Documento de la Institución"  },
    relationFundacionesCompanyType: { key: "companyType", id:"relationFundacionesCompanyType", type:'select', val: "", title: "Tipo de Institución", },
    relationFundacionesPosition: { key: "position", id:"relationFundacionesPosition", type:'select', val: "", title: "Cargo en la Institución", },
    relationFundacionesRelationship: { key: "relationship", id:"relationFundacionesRelationship", type:'select',  val: "", title: "Parentesco", },
    relationFundacionesName: { key: "name", id:"relationFundacionesName", val: "", maxLength:150, readOnly:true, title: "Nombre de la Persona"  },
    relationFundacionesTipoDoc: { key: "tipoDoc", id:"relationFundacionesTipoDoc", val: "", title: "Tipo de documento de la Persona", type:'select' },
    relationFundacionesRut: { key: "rut", val: "", id:"relationFundacionesRut", maxLength:20, readOnly:true, title: "Documento de la Persona"  },
    relationFundacionesArea: { key: "area", id:"relationFundacionesArea", val: "", maxLength:50, readOnly:true, title: "Área(s) y/o empresa(s) filial(es) con la que se relaciona"},
  }
  const [relationFundaciones, setRelationFundaciones] = useState(relationFundacionesIS);

  const relationOtrosIS = {
    relationOtrosDescripcion: ""
  }
  const [relationOtros, setRelationOtros] = useState(relationOtrosIS);

  const testLength = (stateObject,offset)=>{
    let stateCopy = {...stateObject}
    Object.entries(stateObject).map(([section,innerSection])=>{
      if (Object.keys(innerSection).indexOf('maxLength')>-1){
        let test = stateCopy[section].maxLength+offset
        stateCopy = {...stateCopy, [section]: {...stateCopy[section], val:'x'.repeat(stateCopy[section].maxLength+offset)}}
      }
    })
    if (Object.keys(stateObject)[0].startsWith('malla')) {
      setMalla(stateCopy)
    }
    if (Object.keys(stateObject)[0].startsWith('prov')) {
      setRelationProveedor(stateCopy)
    }
    if (Object.keys(stateObject)[0].startsWith('laboral')) {
      setLaboral(stateCopy)
    }
    if (Object.keys(stateObject)[0].startsWith('outdoor')) {
      setOutdoor(stateCopy)
    }
    if (Object.keys(stateObject)[0].startsWith('competencia')) {
      setCompetencia(stateCopy)
    }
    if (Object.keys(stateObject)[0].startsWith('relationParentesco')) {
      setRelationParentesco(stateCopy)
    }
    if (Object.keys(stateObject)[0].startsWith('relationPep')) {
      setRelationPep(stateCopy)
    }
    if (Object.keys(stateObject)[0].startsWith('relationFundaciones')) {
      setRelationFundaciones(stateCopy)
    }
    validateFields(Object.keys(stateObject))
  }

  const doTests = ()=>{
    setTimeout(()=>{
      testLength(malla,1)
      testLength(relationProveedor,1)
      testLength(laboral,1)
      testLength(outdoor,1)
      testLength(competencia,1)
      testLength(relationParentesco,1)
      testLength(relationPep,1)
      testLength(relationFundaciones,1)
      testLengthBaseParams(1)
    },1000)
  }

  const validateLengthFieldWithInnerLength = (section)=>{
    return {
      max: section.maxLength,
      message: "Debe tener un máximo de "+ section.maxLength  + " caracteres"
    }
  }

  const handleTest = (e) => {};

  useEffect(() => {


    setIsloading(true);
    getFormPromise(match.params.id).then((response) => {
      if (
        response.data !== null &&
        response.data !== "" &&
        response.data.status !== undefined
      ) {
        let responseData = response.data;

        const nombreCliente = responseData.recipient.record.subcliente !== null
        ? responseData.recipient.record.subcliente.name
        : responseData.recipient.request.createUser.cliente
            .name;

        setClienteNombre(nombreCliente);

        // responseData = {...response.data,hasRelProvCont:undefined}
        setApiForm(responseData);
        setUser(response.data.recipient.request.createUser);
        getParamsPromise(
          response.data.recipient.request.createUser.cliente.id
        ).then((response) => {
          setParams(response.data);
        });

        if(responseData.status === "SENT") {
          setDate(moment(responseData.receiveDate).format("DD-MM-YYYY"));
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

  // useEffect(() => {
  //   validateFields(["mallaRut"]);
  // }, [malla]);
  // useEffect(() => {
  //   validateFields(["provCompanyRut","provRut","provIndCompanyRut"]);
  // }, [relationProveedor]);
  // useEffect(() => {
  //   validateFields(["laboralCompanyRut"]);
  // }, [laboral]);
  // useEffect(() => {
  //   validateFields(["outdoorCompanyRut"]);
  // }, [outdoor]);
  // useEffect(() => {
  //   validateFields(["competenciaCompanyRut","competenciaRut"]);
  // }, [competencia]);
  // useEffect(() => {
  //   validateFields(["relationParentescoRut"]);
  // }, [relationParentesco]);
  // useEffect(() => {
  //   validateFields(["relationPepRut"]);
  // }, [relationPep]);
  // useEffect(() => {
  //   validateFields(["relationFundacionesCompanyRut","relationFundacionesRut"]);
  // }, [relationFundaciones]);

  const saveFormCDItrabPromiseLocal = async (form) => {
    let response = await saveFormCDItrabPromise(form);
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

  const hancleOnChangeRadioButton = async (field, value) => {
    let formToUpdate = { ...apiForm, [field]: value };
    let ret = await saveFormCDItrabPromiseLocal(formToUpdate);
    if(!ret.success) {
      setFieldsValue({[field]: ret.form[field]})
    }
  };

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some((field) => fieldsError[field]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidarRegistros(true);
    setIsValidate(true);
    validateFields([
      "gerencia",
      "cargo",
      "fechaCargo",
      "hasRelProvCont",
      "hasOutsideActivities",
      "hasRelCompetitor",
      "hasRelRelationship",
      "hasRelPepFp",
      "hasRelFundPjsfl",
      "hasOthersCDI",
      "hasRelLabAnt",
    ]);

    if (apiForm.family.length < 2) {
      validateFields(Object.keys(malla));
      registersStop = { ...registersStop, family: true };
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
      apiForm.hasOutsideActivities &&
      apiForm.outsideActivities.length === 0
    ) {
      validateFields(Object.keys(outdoor));
      registersStop = { ...registersStop, outsideActivities: true };
    }

    if (apiForm.hasRelCompetitor && apiForm.relCompetitor.length === 0) {
      validateFields(Object.keys(competencia));
      registersStop = { ...registersStop, relCompetitor: true };
    }

    if (apiForm.hasRelRelationship && apiForm.relRelationship.length === 0) {
      validateFields(Object.keys(relationParentesco));
      registersStop = { ...registersStop, relRelationship: true };
    }

    if (getRadioButtonValue('PEP') && getFilteredRegistersByType('PEP').length === 0) {
      validateFields(Object.keys(relationPep));
      registersStop = { ...registersStop, relPepFp: true };
    }

    if (apiForm.hasRelFundPjsfl && apiForm.relFundPjsfl.length === 0) {
      validateFields(Object.keys(relationFundaciones));
      registersStop = { ...registersStop, relFundPjsfl: true };
    }

    if (apiForm.hasOthersCDI && apiForm.othersCDI.length === 0) {
      validateFields(Object.keys(relationOtros));
      registersStop = { ...registersStop, othersCDI: true };
    }

    if (
      hasErrors(getFieldsError()) ||
      Object.values(registersStop).find((value) => value === true) !== undefined
    ) {
      notification["warning"]({
        message: t("messages.aml.missingRequiredField"),
      });
    } else {
      sendFormPromise(match.params.id).then((response) => {
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

  const renderFormItemTable = ({ section, initialValue, cols=8, options=[], validator=null, customRule=null }) => {
    const type = section.type ? section.type : 'input'
    const required = "required" in section ? section.required : true
    return renderFormItem({
      label: section.title,
      name: section.id,
      initialValue: initialValue,
      colClassName: "topLabel",
      labelCol: 0,
      wrapperCol: 0,
      rules:
      [
        { required: required, message: t( "messages.aml.requestedField")},
        ... validator ? [{ validator: validator }]:[],
        ...type==='input' ? [validateLengthFieldWithInnerLength(section)]:[],
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
        ...type==='input' ? [validateLengthBaseParam(section)]:[],
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
            type === 'select' ? <Select
              disabled = {disabled}
              onChange={(value) => handleOnChangeIntro(section, value) }
            >
            { options.map((option) => (<Select.Option value={option.val}>{ option.text }</Select.Option>)) }
            </Select>
            :
            <DatePicker
              onFocus= {(e)=>handleReadOnly(e.currentTarget.id,false)}
              onBlur= {(e)=>handleReadOnly(e.currentTarget.id,true)}
              readOnly = {section.readOnly}
              format="DD/MM/YYYY"
              placeholder="Ingrese la fecha"
              onChange={(momentObj) => handleOnChangeIntro( section, momentObj !== null ? moment(momentObj).format( "DD/MM/YYYY" ) : null ) }
            />
          :
          <Input/>
      )
    })
}

const renderFormItemIntro = ({section, initialValue, required = true, type = 'input'})=>{
  return (
    <Form.Item className="introduction-item">
    {getFieldDecorator(section.id, {
      initialValue: initialValue,
      rules: [
        { required: required, message: t( "messages.aml.requestedField" ), },
      ],
    })(
      format === "html" ? (
        type === 'date' ?
          <DatePicker
            onFocus= {(e)=>handleReadOnly(e.currentTarget.id,false)}
            onBlur= {(e)=>handleReadOnly(e.currentTarget.id,true)}
            readOnly = {section.readOnly}
            format="DD/MM/YYYY"
            placeholder="Ingrese la fecha"
            onChange={(momentObj) => handleOnChangeIntro( section, momentObj !== null ? moment(momentObj).format( "DD/MM/YYYY" ) : null ) }
          />
          :
          <Input
            autoComplete="off"
            onFocus= {(e)=>handleReadOnly(e.target.id,false)}
            onBlur= {(e)=>handleReadOnly(e.target.id,true)}
            readOnly = {section.readOnly}
            placeholder = {section.placeholder}
            onChange={(e) => handleOnChangeIntro( section, e.target.value ) }
          />
      ) : (
        <Input />
      )
    )}
  </Form.Item>
  )
}

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

  const getFilteredRegistersByType = (type) => apiForm.attributes.filter(obj => obj.type===type)

  const getRadioButtonValue = (type) => {
    let hasCollections = apiForm.hasCollections
    if (hasCollections===null){
      return null
    }
    const arrIndex = hasCollections.findIndex(obj=>obj.type === type)
    if (arrIndex === -1)
      return null
    else
      return hasCollections[arrIndex].value
  }

  const handleOnChangeRadioButton2 = async (type,field, value) => {
    let hasCollections = apiForm.hasCollections
    if (hasCollections===null){
      hasCollections = []
    }
    const arrIndex = hasCollections.findIndex(obj=>obj.type === type)
    arrIndex > -1 ? hasCollections[arrIndex].value=value : hasCollections.push({type:type, value:value})
    let formToUpdate = { ...apiForm, hasCollections: hasCollections };
    let ret = await saveFormCDItrabPromiseLocal(formToUpdate);
    // if(!ret.success) {
    //   setFieldsValue({[field]: ret.form[field]})
    // }
  };

  const handleDeletAttributes = (id) => {
    return () => {
      const index = apiForm.attributes.findIndex(obj => obj.id === id)
      let attributes = [...apiForm.attributes];
      attributes.splice(index, 1);
      let formToUpdate = { ...apiForm, attributes: attributes };
      saveFormCDItrabPromiseLocal(formToUpdate);
    };
  };

  const handleOnAddAttributes = (objState,type,sectionId) => {
    setIsValidate(true);
    validateFields(Object.keys(objState)).then((error, values) => {
      const objStateOk = Object.keys(objState).reduce(
        (acc, e) => {
          return { ...acc, [objState[e].key]: objState[e].val, type: type };
        },
        {}
      );
      apiForm.attributes.push({ ...objStateOk });
      saveFormCDItrabPromiseLocal(apiForm).then(ret => {
        if(ret.success) handleOnClear(sectionId)
      });
    });
    registersStop[sectionId] = false;
  };





  const settingStateObj=(sectionId,readOnly)=>{
    const [stateObject,stateObjectSetter] = customState(sectionId)
    stateObjectSetter({...stateObject,[sectionId]:{...stateObject[sectionId],readOnly:readOnly}})
  }

  const customState=(sectionId)=>{
    if (sectionId.startsWith('malla')) {
      return([malla,setMalla])
    }
    if (sectionId.startsWith('relationParentesco')) {
      return([relationParentesco,setRelationParentesco])
    }
    if (sectionId.startsWith('prov')) {
      return([relationProveedor,setRelationProveedor])
    }
    if (sectionId.startsWith('laboral')) {
      return([laboral,setLaboral])
    }
    if (sectionId.startsWith('outdoor')) {
      return([outdoor,setOutdoor])
    }
    if (sectionId.startsWith('competencia')) {
      return([competencia,setCompetencia])
    }
    if (sectionId.startsWith('relationParentesco')) {
      return([relationParentesco,setRelationParentesco])
    }
    if (sectionId.startsWith('relationPep')) {
      return([relationPep,setRelationPep])
    }
    if (sectionId.startsWith('relationFundaciones')) {
      return([relationFundaciones,setRelationFundaciones])
    }
  }

  const handleOnChangeField = (sectionId, value) => {
    const [stateObject,stateObjectSetter] = customState(sectionId)
    stateObjectSetter({ ...stateObject, [sectionId]: { ...stateObject[sectionId], val: value }});
    if (sectionId === "provRelationship" && value === "Mi persona") {
      setRelationProveedor({
        ...relationProveedor,
        [sectionId]: { ...relationProveedor[sectionId], val: value },
        provName: {
          ...relationProveedor["provName"],
          val: apiForm.recipient.record.nombre,
        },
        provRut: {
          ...relationProveedor["provRut"],
          val: apiForm.recipient.record.rut,
        },
      });
      setFields({
        provName: { value: apiForm.recipient.record.nombre },
        provRut: { value: apiForm.recipient.record.rut },
      });
    } else if (sectionId === "provRelationship" && value !== "Mi persona") {
      setRelationProveedor({
        ...relationProveedor,
        [sectionId]: { ...relationProveedor[sectionId], val: value },
        provName: { ...relationProveedor["provName"], val: "" },
        provRut: { ...relationProveedor["provRut"], val: "" },
      });
      setFields({
        provName: { value: "" },
        provRut: { value: "" },
      });
    } else
    if (sectionId === "relationPepRelationship" && value === "Mi persona") {
      setRelationPep({
        ...relationPep,
        [sectionId]: { ...relationPep[sectionId], val: value },
        relationPepName: {
          ...relationPep["relationPepName"],
          val: apiForm.recipient.record.nombre,
        },
        relationPepRut: {
          ...relationPep["relationPepRut"],
          val: apiForm.recipient.record.rut,
        },
      });
      setFields({
        relationPepName: { value: apiForm.recipient.record.nombre },
        relationPepRut: { value: apiForm.recipient.record.rut },
      });
    } else if (sectionId === "relationPepRelationship" && value !== "Mi persona") {
      setRelationPep({
        ...relationPep,
        [sectionId]: { ...relationPep[sectionId], val: value },
        relationPepName: { ...relationPep["relationPepName"], val: "" },
        relationPepRut: { ...relationPep["relationPepRut"], val: "" },
      });
      setFields({
        relationPepName: { value: "" },
        relationPepRut: { value: "" },
      });
    }else
    if (sectionId === "relationFundacionesRelationship" && value === "Mi persona") {
      setRelationFundaciones({
        ...relationFundaciones,
        [sectionId]: { ...relationFundaciones[sectionId], val: value },
        relationFundacionesName: {
          ...relationFundaciones["relationFundacionesName"],
          val: apiForm.recipient.record.nombre,
        },
        relationFundacionesRut: {
          ...relationFundaciones["relationFundacionesRut"],
          val: apiForm.recipient.record.rut,
        },
      });
      setFields({
        relationFundacionesName: { value: apiForm.recipient.record.nombre },
        relationFundacionesRut: { value: apiForm.recipient.record.rut },
      });
    } else if (
      sectionId === "relationFundacionesRelationship" && value !== "Mi persona"
    ) {
      setRelationFundaciones({
        ...relationFundaciones,
        [sectionId]: { ...relationFundaciones[sectionId], val: value },
        relationFundacionesName: {
          ...relationFundaciones["relationFundacionesName"],
          val: "",
        },
        relationFundacionesRut: {
          ...relationFundaciones["relationFundacionesRut"],
          val: "",
        },
      });
      setFields({
        relationFundacionesName: { value: "" },
        relationFundacionesRut: { value: "" },
      });
    }

  };

  const handleOnChangeFieldMalla = (field, value) => {
    setMalla({ ...malla, [field]: { ...malla[field], val: value } });
  };

  const handleOnAddMalla = async () => {
    setIsValidate(true);

    validateFields(Object.keys(malla)).then((error, values) => {
      const mallaOk = Object.keys(malla).reduce((acc, e) => {
        return { ...acc, [malla[e].key]: malla[e].val };
      }, {});
      apiForm.family.push({ ...mallaOk });
      let formToUpdate = { ...apiForm, family: apiForm.family };

      saveFormCDItrabPromiseLocal(formToUpdate).then(ret => {
        if(ret.success) handleOnClear('malla')
      });
    });
    registersStop.family = false;
  };

  const handleDeleteMalla = (index) => {
    return () => {
      //let temp = mallaCollection.filter(e => e.key !== record.key);    fake collection works ok
      //setMallaCollection(temp);
      //let temp = apiForm.family.filter(e => e.id !== record.id);

      let xx = [...apiForm.family];
      xx.splice(index, 1);
      let formToUpdate = { ...apiForm, family: xx };
      saveFormCDItrabPromiseLocal(formToUpdate);
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

      saveFormCDItrabPromiseLocal(apiForm).then(ret => {
        if(ret.success) handleOnClear('relationProveedor')
      });
    });
    registersStop.relProvCont = false;
  };

  const handleDeleteRelationProveedor = (index) => {
    return () => {
      // let temp = relationProveedorCollection.filter(e => e.key !== record.key);
      // setRelationProveedorCollection(temp);

      let xx = [...apiForm.relProvCont];
      xx.splice(index, 1);
      let formToUpdate = { ...apiForm, relProvCont: xx };

      saveFormCDItrabPromiseLocal(formToUpdate);
    };
  };

  const handleOnChangeFieldLaboral = (field, value) => {
    setLaboral({ ...laboral, [field]: { ...laboral[field], val: value } });
  };

  const handleOnAddLaboralRelation = () => {
    setIsValidate(true);
    validateFields(Object.keys(laboral)).then((error, values) => {
      const laboralOk = Object.keys(laboral).reduce((acc, e) => {
        return { ...acc, [laboral[e].key]: laboral[e].val };
      }, {});
      apiForm.relLabAnt.push({ ...laboralOk });
      //formToUpdate =   {...apiForm,family: apiForm.family }

      saveFormCDItrabPromiseLocal(apiForm).then(ret => {
        if(ret.success) handleOnClear('laboral')
      });
    });
    registersStop.relLabAnt = false;
  };
  const handleDeleteLaboral = (index) => {
    return () => {
      let xx = [...apiForm.relLabAnt];
      xx.splice(index, 1);
      let formToUpdate = { ...apiForm, relLabAnt: xx };

      saveFormCDItrabPromiseLocal(formToUpdate);
    };
  };

  const handleOnChangeFieldOutdoor = (field, value) => {
    setOutdoor({ ...outdoor, [field]: { ...outdoor[field], val: value } });
  };

  const handleOnAddOutdoor = () => {
    setIsValidate(true);
    validateFields(Object.keys(outdoor)).then((error, values) => {
      const outdoorOk = Object.keys(outdoor).reduce((acc, e) => {
        return { ...acc, [outdoor[e].key]: outdoor[e].val };
      }, {});

      apiForm.outsideActivities.push({ ...outdoorOk });

      saveFormCDItrabPromiseLocal(apiForm).then(ret => {
        if(ret.success) handleOnClear('outdoor')
      });
    });
    registersStop.outsideActivities = false;
  };

  const handleDeleteOutdoor = (index) => {
    return () => {
      let xx = [...apiForm.outsideActivities];
      xx.splice(index, 1);
      let formToUpdate = { ...apiForm, outsideActivities: xx };

      saveFormCDItrabPromiseLocal(formToUpdate);
    };
  };

  const handleOnChangeFieldCompetencia = (field, value) => {
    setCompetencia({
      ...competencia,
      [field]: { ...competencia[field], val: value },
    });
  };

  const handleOnAddCompetencia = () => {
    setIsValidate(true);
    console.log(competencia);

    validateFields(Object.keys(competencia)).then((error, values) => {
      const competenciaOk = Object.keys(competencia).reduce((acc, e) => {
        return { ...acc, [competencia[e].key]: competencia[e].val };
      }, {});

      apiForm.relCompetitor.push({ ...competenciaOk });

      saveFormCDItrabPromiseLocal(apiForm).then(ret => {
        if(ret.success) handleOnClear('competencia')
      });
    });
    registersStop.relCompetitor = false;
  };

  const handleDeleteCompetencia = (index) => {
    return () => {
      let xx = [...apiForm.relCompetitor];
      xx.splice(index, 1);
      let formToUpdate = { ...apiForm, relCompetitor: xx };

      saveFormCDItrabPromiseLocal(formToUpdate);
    };
  };

  const handleOnChangeFieldRelationParentesco = (field, value) => {
    setRelationParentesco({
      ...relationParentesco,
      [field]: { ...relationParentesco[field], val: value },
    });
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

      saveFormCDItrabPromiseLocal(apiForm).then(ret => {
        if(ret.success) handleOnClear('relationParentesco')
      });
    });
    registersStop.relRelationship = false;
  };

  const handleDeleteRelationParentesco = (index) => {
    return () => {
      let xx = [...apiForm.relRelationship];
      xx.splice(index, 1);
      let formToUpdate = { ...apiForm, relRelationship: xx };

      saveFormCDItrabPromiseLocal(formToUpdate);
    };
  };

  const handleOnChangeFieldRelationPep = (field, value) => {
    setRelationPep({
      ...relationPep,
      [field]: { ...relationPep[field], val: value },
    });
    if (field === "relationPepRelationship" && value === "Mi persona") {
      setRelationPep({
        ...relationPep,
        [field]: { ...relationPep[field], val: value },
        relationPepName: {
          ...relationPep["relationPepName"],
          val: apiForm.recipient.record.nombre,
        },
        relationPepRut: {
          ...relationPep["relationPepRut"],
          val: apiForm.recipient.record.rut,
        },
      });
      setFields({
        relationPepName: { value: apiForm.recipient.record.nombre },
        relationPepRut: { value: apiForm.recipient.record.rut },
      });
    } else if (field === "relationPepRelationship" && value !== "Mi persona") {
      setRelationPep({
        ...relationPep,
        [field]: { ...relationPep[field], val: value },
        relationPepName: { ...relationPep["relationPepName"], val: "" },
        relationPepRut: { ...relationPep["relationPepRut"], val: "" },
      });
      setFields({
        relationPepName: { value: "" },
        relationPepRut: { value: "" },
      });
    }
  };

  const handleOnAddRelationPep = () => {
    setIsValidate(true);
    validateFields(Object.keys(relationPep)).then((error, values) => {
      const relationPepOk = Object.keys(relationPep).reduce((acc, e) => {
        return { ...acc, [relationPep[e].key]: relationPep[e].val };
      }, {});

      apiForm.relPepFp.push({ ...relationPepOk });
      saveFormCDItrabPromiseLocal(apiForm).then(ret => {
        if(ret.success) handleOnClear('relationPep')
      });
    });
    registersStop.relPepFp = false;
  };

  const handleDeleteRelationPep = (index) => {
    return () => {
      let xx = [...apiForm.relPepFp];
      xx.splice(index, 1);
      let formToUpdate = { ...apiForm, relPepFp: xx };

      saveFormCDItrabPromiseLocal(formToUpdate);
    };
  };

  const handleOnChangeFieldRelationFundaciones = (field, value) => {
    if (field === "relationFundacionesRelationship" && value === "Mi persona") {
      setRelationFundaciones({
        ...relationFundaciones,
        [field]: { ...relationFundaciones[field], val: value },
        relationFundacionesName: {
          ...relationFundaciones["relationFundacionesName"],
          val: apiForm.recipient.record.nombre,
        },
        relationFundacionesRut: {
          ...relationFundaciones["relationFundacionesRut"],
          val: apiForm.recipient.record.rut,
        },
      });
      setFields({
        relationFundacionesName: { value: apiForm.recipient.record.nombre },
        relationFundacionesRut: { value: apiForm.recipient.record.rut },
      });
    } else if (
      field === "relationFundacionesRelationship" && value !== "Mi persona"
    ) {
      setRelationFundaciones({
        ...relationFundaciones,
        [field]: { ...relationFundaciones[field], val: value },
        relationFundacionesName: {
          ...relationFundaciones["relationFundacionesName"],
          val: "",
        },
        relationFundacionesRut: {
          ...relationFundaciones["relationFundacionesRut"],
          val: "",
        },
      });
      setFields({
        relationFundacionesName: { value: "" },
        relationFundacionesRut: { value: "" },
      });
    } else {
      setRelationFundaciones({
        ...relationFundaciones,
        [field]: { ...relationFundaciones[field], val: value },
      });
    }
  };

  const handleOnAddRelationFundaciones = () => {
    setIsValidate(true);
    validateFields(Object.keys(relationFundaciones)).then((error, values) => {
      console.log(relationFundaciones);

      const relationFundacionesOk = Object.keys(relationFundaciones).reduce(
        (acc, e) => {
          return {
            ...acc,
            [relationFundaciones[e].key]: relationFundaciones[e].val,
          };
        },
        {}
      );

      apiForm.relFundPjsfl.push({ ...relationFundacionesOk });
      saveFormCDItrabPromiseLocal(apiForm).then(ret => {
        if(ret.success) handleOnClear('relationFundaciones')
      });
    });
    registersStop.relFundPjsfl = false;
  };

  const handleDeleteRelationFundaciones = (index) => {
    return () => {
      let xx = [...apiForm.relFundPjsfl];
      xx.splice(index, 1);
      let formToUpdate = { ...apiForm, relFundPjsfl: xx };

      saveFormCDItrabPromiseLocal(formToUpdate);
    };
  };

  const handleOnChangeFieldRelationOtros = (field, value) => {
    setRelationOtros({ ...relationOtros, [field]: value });
  };

  const handleOnAddRelationOtros = () => {
    setIsValidate(true);

    validateFields(Object.keys(relationOtros)).then((error, values) => {
      apiForm.othersCDI.push(relationOtros.relationOtrosDescripcion);
      saveFormCDItrabPromiseLocal(apiForm).then(ret => {
        if(ret.success) handleOnClear('relationOtros')
      });
    });
    registersStop.othersCDI = false;
  };

  const handleDeleteRelationOtros = (index) => {
    return () => {
      let xx = [...apiForm.othersCDI];
      xx.splice(index, 1);
      let formToUpdate = { ...apiForm, othersCDI: xx };
      saveFormCDItrabPromiseLocal(formToUpdate);
    };
  };

  //const relation = [{nombreEmpresa:'gesintel',tipoEmpresa:'limitada'}]

  const mallaColumns = [
    {
      title: "Parentesco",
      dataIndex: "type",
    },
    {
      title: "Nombre",
      dataIndex: "name",
    },
    {
      title: "Tipo de documento de identidad",
      dataIndex: "tipoDoc",
    },
    {
      title: "Documento",
      dataIndex: "rut",
    },
    format === "html"
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
      title: "Tipo de Empresa",
      dataIndex: "companyType",
    },
    {
      title: "Nombre de Empresa",
      dataIndex: "companyName",
    },
    {
      title: "Documento de Empresa",
      dataIndex: "companyRut",
    },
    {
      title: "Parentesco",
      dataIndex: "relationship",
    },
    {
      title: "Nombre de Persona",
      dataIndex: "name",
    },
    {
      title: "Documento de Persona",
      dataIndex: "rut",
    },
    {
      title: "Cargo en la Empresa",
      dataIndex: "position",
    },
    format === "html"
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

  // render: (text,record,index) => {
  //   if (record.pdfFile !== null) {
  //     return (<a onClick={() => handleDownloadReport(record)} ><Icon type="file-pdf" /></a>)
  //   } else {
  //     return (<Checkbox checked={record.checked} onChange ={handleOnChangeCheckPep(record)}/>)
  //   }
  // }

  const laboralColumns = [
    {
      title: "Nombre de Empresa",
      dataIndex: "name",
    },
    {
      title: "Documento de Empresa",
      dataIndex: "rut",
    },
    {
      title: "Cargo Ejercido",
      dataIndex: "position",
    },
    {
      title: "Fecha de Ingreso",
      dataIndex: "startDate",
      render: (text, record, index) =>
        text ?  text : "",
    },
    {
      title: "Fecha de Salida ",
      dataIndex: "endDate",
      render: (text, record, index) =>
        text ?  text : "",
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

  const outdoorColumns = [
    {
      title: "Nombre Sociedad o Institución ",
      dataIndex: "companyName",
    },
    {
      title: "Tipo de documento de la Empresa",
      dataIndex: "companyTipoDoc",
    },
    {
      title: "Documento de Empresa",
      dataIndex: "companyRut",
    },
    {
      title: "Trabajo o Actividad laboral realizada ",
      dataIndex: "activity",
    },
    format === "html"
      ? {
          title: "Acción",
          dataIndex: "",
          key: "x",
          render: (text, record, index) => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a onClick={handleDeleteOutdoor(index)}>
              <Icon type="delete" />
            </a>
          ),
        }
      : {},
  ];

  const competenciaColumns = [
    {
      title: "Nombre Empresa de la Competencia ",
      dataIndex: "companyName",
    },
    {
      title: "Documento de Empresa de la Competencia ",
      dataIndex: "companyRut",
    },
    {
      title: "Parentesco",
      dataIndex: "relationship",
    },
    {
      title: "Nombre de la persona",
      dataIndex: "name",
    },
    {
      title: "Documento de la persona",
      dataIndex: "rut",
    },
    {
      title: "Cargo de la persona",
      dataIndex: "position",
    },
    format === "html"
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
      title: "Parentesco",
      dataIndex: "relationship",
    },
    {
      title: "Nombre",
      dataIndex: "name",
    },
    {
      title: "Documento",
      dataIndex: "rut",
    },
    {
      title: "Cargo",
      dataIndex: "position",
    },
    {
      title: "Empresa",
      dataIndex: "companyName",
    },
    format === "html"
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

  const relationPepColumns = [
    {
      title: relationPep.relationPepRelationship.title,
      dataIndex: relationPep.relationPepRelationship.key,
    },
    {
      title: relationPep.relationPepName.title,
      dataIndex: relationPep.relationPepName.key,
    },
    {
      title: relationPep.relationPepCategory.title,
      dataIndex: relationPep.relationPepCategory.key,
    },
    {
      title: relationPep.relationPepInstitution.title,
      dataIndex: relationPep.relationPepInstitution.key,
    },
    {
      title: relationPep.relationPepPosition.title,
      dataIndex: relationPep.relationPepPosition.key,
    },
    format === "html"
      ? {
          title: "Acción",
          dataIndex: "",
          key: "x",
          render: (text, record, index) => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a onClick={handleDeletAttributes(record.id)}> <Icon type="delete" /> </a>
          ),
        }
      : {},
  ];

  const relationFundacionesColumns = [
    {
      title: "Nombre de la Institución ",
      dataIndex: "companyName",
    },
    {
      title: "Documento de la Institución",
      dataIndex: "companyRut",
    },
    {
      title: "Tipo de Institución",
      dataIndex: "companyType",
    },
    {
      title: "Cargo en la Institución ",
      dataIndex: "position",
    },
    {
      title: "Parentesco",
      dataIndex: "relationship",
    },
    {
      title: "Nombre de la persona ",
      dataIndex: "name",
    },
    {
      title: "Documento de la persona ",
      dataIndex: "rut",
    },
    {
      title: "Área(s) y/o empresa(s) filial(es) con la que se relaciona",
      dataIndex: "area",
    },
    format === "html"
      ? {
          title: "Acción",
          dataIndex: "",
          key: "x",
          render: (text, record, index) => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a onClick={handleDeleteRelationFundaciones(index)}>
              <Icon type="delete" />
            </a>
          ),
        }
      : {},
  ];

  const relationOtrosColumns = () => {
    let columns = [
      {
        title: "Descripción de la situación",
        dataIndex: "",
        width: "90%",
        render: (text, record, index) => {
          return record;
        },
      },
    ];
    if (format === "html") {
      columns.push({
        title: "Acción",
        dataIndex: "",
        render: (text, record, index) => (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a onClick={handleDeleteRelationOtros(index)}>
            <Icon type="delete" />
          </a>
        ),
      });
    }
    return columns;
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

  const docValidator = (tipoDoc, company = false) => {
    if (tipoDoc === "Chile-Rut"){
      if (company === false) return rutValidator;
      else return rutValidatorCompany;
    }
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
                            DECLARACIÓN DE CONFLICTO DE INTERÉS TRABAJADORES(AS)
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
                            <Col xl={24}>INTRODUCCIÓN</Col>
                          </Row>
                          <Row className="summary">
                            <Col xl={24}>
                              Yo,{" "}
                              <strong>{apiForm.recipient.record.nombre}</strong>
                              ,{" "}
                              <strong>
                                con Rut {apiForm.recipient.record.rut}
                              </strong>
                              , perteneciente a la Gerencia{" "}
                              {renderFormItemIntro({
                                  section: baseParams.gerencia,
                                  initialValue: apiForm.gerencia,
                              })}

                              , en mi calidad de{" "}

                              {renderFormItemIntro({
                                  section: baseParams.cargo,
                                  initialValue: apiForm.cargo,
                              })}
                              , función que ocupo desde{" "}

                              {renderFormItemIntro({
                                  section: baseParams.fechaCargo,
                                  type:'date',
                                  initialValue: format === "html" ? apiForm.fechaCargo ? moment(apiForm.fechaCargo, "DD/MM/YYYY") : null : apiForm.fechaCargo,
                              })}
                              , declaro: conocer el Código de Ética
                              de {" "}
                              <strong>
                                {clienteNombre}
                              </strong>
                              {" "} y del Grupo Santander (en adelante "La Empresa"), cumplo con mi deber de informar sobre cualquier
                               situación que pueda dar origen a
                               un potencial conflicto de interés en el desempeño
                                de mis funciones y la necesidad de informar
                                a la Empresa, de acuerdo al artículo 100 de la Ley
                                 N° 18.045 y al artículo 146 de la Ley N°
                                18.046.
                              <br />
                              <br />
                              Por lo anterior informo y declaro (marque el
                              casillero correspondiente):
                            </Col>
                          </Row>
                          <Row
                            className="subheader"
                            style={{
                              marginTop: "0px",
                            }}
                          >
                            <Col xl={24}>I. MALLA PARENTAL </Col>
                          </Row>
                          <Row className="content">
                            <Row className="summary">
                              <Col xl={24}>
                                Indique a su cónyuge, conviviente civil (AUC) y/o
                                parientes hasta el segundo grado de{" "}
                                <Tooltip
                                  className="tooltip-form"
                                  title="(esto es: abuelos, padres, hermanos, hijos, nietos)"
                                >
                                  consanguinidad
                                </Tooltip>{" "}
                                o{" "}
                                <Tooltip
                                  className="tooltip-form"
                                  title="(entiéndase por tal: yerno/nuera, cuñado, suegros),"
                                >
                                  afinidad inclusive,
                                </Tooltip>{" "}
                                mayores de 18 años.
                                {/* <br />
                                Trabajadores que hayan recibido una comunicación
                                del Encargado de Prevención de Delitos deberán
                                completar esta sección y todas las restantes
                                hasta el{" "}
                                <Tooltip title="Corresponde a los siguientes familiares: Bisabuelo(a), Biznieto(a), Tío(a) y Sobrino(a)">
                                  <strong>tercer grado</strong>
                                </Tooltip>{" "}
                                de consanguineidad y afinidad. */}
                              </Col>
                            </Row>

                            {format === "html" && (
                              <>
                                <Row className="fields-row" gutter={[16, 8]}>
                                  {renderFormItemTable({
                                    section: malla.mallaType,
                                    options:
                                    [
                                      { val: "Conyuge", text: "Conyuge" },
                                      { val: "Conviviente civil", text: "Conviviente civil" },
                                      { val: "Padre", text: "Padre" },
                                      { val: "Madre", text: "Madre" },
                                      { val: "Hijo(a)", text: "Hijo(a)" },
                                      { val: "Hermano(a)", text: "Hermano(a)" },
                                      { val: "Abuelo(a)", text: "Abuelo(a)" },
                                      { val: "Nieto(a)", text: "Nieto(a)" },
                                      { val: "Suegro(a)", text: "Suegro(a)" },
                                      { val: "Hijo(a) del conyuge que no sean suyos", text: "Hijo(a) del conyuge que no sean suyos" },
                                      { val: "Abuelo(a) del cónyuge", text: "Abuelo(a) del cónyuge" },
                                      { val: "Nieto(a) del cónyuge", text: "Nieto(a) del cónyuge" },
                                      { val: "Hermano(a) del cónyuge", text: "Hermano(a) del cónyuge" },
                                      { val: "Yerno", text: "Yerno" },
                                      { val: "Nuera", text: "Nuera" },
                                      { val: "Tío(a)", text: "Tío(a)" },
                                      { val: "Sobrino(a)", text: "Sobrino(a)" },
                                      { val: "Bisabuelo(a)", text: "Bisabuelo(a)" },
                                      { val: "Biznieto(a)", text: "Biznieto(a)" },
                                      { val: "Bisabuelo(a) del cónyuge", text: "Bisabuelo(a) del cónyuge" },
                                      { val: "Cuñado(a)", text: "Cuñado(a)" },
                                      { val: "Sobrino(a) del conyuge", text: "Sobrino(a) del conyuge" },
                                    ],
                                  })}
                                  {renderFormItemTable({
                                    section: malla.mallaName,
                                  })}
                                  {renderFormItemTable({
                                    section: malla.mallaTipoDoc,
                                    options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                  })}
                                </Row>
                                <Row className="fields-row" gutter={[16, 8]}>
                                  {renderFormItemTable({
                                    section: malla.mallaRut,
                                    validator: docValidator( malla.mallaTipoDoc.val ),
                                    itemWrapper: (
                                      <Tooltip
                                        className="tooltip-form-field"
                                        title="El sistema requiere que se ingrese un Documento. En caso que el sujeto identificado no tenga Documento por favor ingresar tu mismo Documento"
                                      ></Tooltip>
                                    ),
                                    tooltip: false,
                                  })}
                                </Row>
                              </>
                            )}
                            {apiForm.family.length < 2 && validarRegistros && (
                              <Col
                                span={24}
                                className="missing-registers ant-form-explain"
                              >
                                Se requieren al menos 2 registros de parientes;
                                luego de ingresarlos, presione añadir
                              </Col>
                            )}
                            {format === "html" && (
                                <Row className="button-row">
                                  <Col className="addRelation" xl={3}>
                                    <Button type="primary" htmlType="button" onClick={handleOnAddMalla} icon="plus" > Añadir </Button>
                                  </Col>
                                  <Col className="addRelation" xl={3}>
                                    <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('malla')} > Limpiar </Button>
                                  </Col>
                                </Row>
                            )}
                            {
                              apiForm.family.length > 0 && (
                                <Table columns={mallaColumns} dataSource={apiForm.family} size="middle" pagination={false} ></Table>
                              )
                            }
                          </Row>{" "}
                          {/*end of content row */}
                          <Row className="subheader">
                            <Col xl={24}>
                              II. RELACIÓN CON PROVEEDORES, CONTRATISTAS, Y/O CLIENTES INSTITUCIONALES DE LA EMPRESA{" "}
                            </Col>
                          </Row>
                          <Row className="summary">
                            <Col span={21}>
                              Declaro que tengo participación, directa o indirectamente, o lo hace mi cónyuge, conviviente civil (AUC) y/o parientes hasta el segundo grado de{" "}
                              <Tooltip
                                className="tooltip-form"
                                title="Hasta segundo grado de consanguinidad, se consideran padres, hijos, abuelos, nietos y hermanos"
                              >
                                consanguinidad
                              </Tooltip>{" "}
                              o{" "}
                              <Tooltip
                                className="tooltip-form"
                                title="Hasta segundo grado de afinidad, se consideran Padres, hijos que no sean suyos, Abuelos, Nietos y hermanos del cónyuge o conviviente civil (AUC)"
                              >
                                afinidad
                              </Tooltip>{" "}
                              inclusive, hasta donde tengo conocimiento, en
                              sociedades que sean proveedoras, contratistas o
                              clientes institucionales de la empresa, ya sea
                              como propietario, socio, accionista principal,
                              director, o como ejecutivo principal, gerente,
                              administrador, o con cualquier cargo que suponga
                              capacidad para tomar decisiones y obligar al
                              proveedor, contratista y/o cliente institucional.
                            </Col>
                            {renderFormItem({
                              label: "",
                              name: "hasRelProvCont",
                              initialValue:
                                apiForm.hasRelProvCont !== null
                                  ? apiForm.hasRelProvCont
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
                          {/* {
                              format === "html"
                              ?
                              <>
                              </>
                              :
                              <>
                              <br/>
                              <br/>
                              <br/>
                              <br/>
                              </>
                          } */}
                          {((apiForm.hasRelProvCont !== null && apiForm.hasRelProvCont) || openContent) && (
                            <Row className="content">
                              {format === "html" && (
                                <>
                                  <Row className="inner-row" gutter={[16, 8]}>
                                    {renderFormItemTable({
                                        section: relationProveedor.provCompanyType,
                                        options:
                                        [
                                          { val: "Proveedor", text: "Proveedor" },
                                          { val: "Cliente Institucional", text: "Cliente Institucional" },
                                          { val: "Contratista", text: "Contratista" },
                                        ],
                                    })}
                                    {renderFormItemTable({
                                      section: relationProveedor.provCompanyName,
                                    })}
                                    {renderFormItemTable({
                                      section: relationProveedor.provCompanyTipoDoc,
                                      options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                    })}
                                  </Row>
                                  <Row className="inner-row" gutter={[16, 8]}>
                                    {renderFormItemTable({
                                        section: relationProveedor.provCompanyRut,
                                        validator: docValidator(relationProveedor.provCompanyTipoDoc.val,true)
                                    })}
                                    {renderFormItemTable({
                                        section: relationProveedor.provRelationship,
                                        options:
                                        [
                                          { val: "Mi persona", text: "Mi persona" },
                                          { val: "Conyuge", text: "Conyuge" },
                                          { val: "Conviviente civil", text: "Conviviente civil" },
                                          { val: "Padre", text: "Padre" },
                                          { val: "Madre", text: "Madre" },
                                          { val: "Hijo(a)", text: "Hijo(a)" },
                                          { val: "Hermano(a)", text: "Hermano(a)" },
                                          { val: "Abuelo(a)", text: "Abuelo(a)" },
                                          { val: "Nieto(a)", text: "Nieto(a)" },
                                          { val: "Suegro(a)", text: "Suegro(a)" },
                                          { val: "Hijo(a) del conyuge que no sean suyos", text: "Hijo(a) del conyuge que no sean suyos" },
                                          { val: "Abuelo(a) del cónyuge", text: "Abuelo(a) del cónyuge" },
                                          { val: "Nieto(a) del cónyuge", text: "Nieto(a) del cónyuge" },
                                          { val: "Hermano(a) del cónyuge", text: "Hermano(a) del cónyuge" },
                                          { val: "Yerno", text: "Yerno" },
                                          { val: "Nuera", text: "Nuera" },
                                          { val: "Tío(a)", text: "Tío(a)" },
                                          { val: "Sobrino(a)", text: "Sobrino(a)" },
                                          { val: "Bisabuelo(a)", text: "Bisabuelo(a)" },
                                          { val: "Biznieto(a)", text: "Biznieto(a)" },
                                          { val: "Bisabuelo(a) del cónyuge", text: "Bisabuelo(a) del cónyuge" },
                                          { val: "Cuñado(a)", text: "Cuñado(a)" },
                                          { val: "Sobrino(a) del conyuge", text: "Sobrino(a) del conyuge" },
                                        ],
                                    })}
                                    {renderFormItemTable({
                                      section: relationProveedor.provName,
                                    })}
                                  </Row>
                                  <Row className="inner-row" gutter={[16, 8]}>
                                    {renderFormItemTable({
                                      section: relationProveedor.provTipoDoc,
                                      options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                    })}
                                    {renderFormItemTable({
                                        section: relationProveedor.provRut,
                                        validator: docValidator(relationProveedor.provTipoDoc.val)
                                    })}
                                    {renderFormItemTable({
                                        section: relationProveedor.provPosition,
                                        options:
                                        [
                                          { val: "Director", text: "Director" },
                                          { val: "Socio", text: "Socio" },
                                          { val: "Accionista", text: "Accionista" },
                                          { val: "Propietario", text: "Propietario" },
                                          { val: "Ejecutivo Principal", text: "Ejecutivo Principal" },
                                          { val: "Administrador", text: "Administrador" },
                                          { val: "Asesor", text: "Asesor" },
                                        ],
                                    })}
                                  </Row>
                                  <Row className="inner-row" gutter={[16, 8]}>
                                    {(relationProveedor.provPosition.val === "Accionista" || relationProveedor.provPosition.val === "Propietario") &&
                                      renderFormItemTable({
                                        section: relationProveedor.provPropertyType,
                                        options:
                                        [
                                          { val: "Directa", text: "Directa" },
                                          { val: "Indirecta", text: "Indirecta" },
                                        ],
                                      })
                                    }
                                    {(relationProveedor.provPosition.val === "Accionista" || relationProveedor.provPosition.val === "Propietario") &&
                                      renderFormItemTable({
                                        section: relationProveedor.provPercentage,
                                      })
                                    }
                                    {(relationProveedor.provPosition.val === "Accionista" || relationProveedor.provPosition.val === "Propietario") && relationProveedor.provPropertyType.val === "Indirecta" &&
                                      renderFormItemTable({
                                        section: relationProveedor.provIndCompanyName,
                                      })
                                    }
                                  </Row>
                                  <Row className="inner-row" gutter={[16, 8]}>
                                    {(relationProveedor.provPosition.val === "Accionista" || relationProveedor.provPosition.val === "Propietario") && relationProveedor.provPropertyType.val === "Indirecta" &&
                                        renderFormItemTable({
                                          section: relationProveedor.provIndCompanyTipoDoc,
                                          type:'select',
                                          options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                        })
                                    }
                                    {(relationProveedor.provPosition.val === "Accionista" || relationProveedor.provPosition.val === "Propietario") && relationProveedor.provPropertyType.val === "Indirecta" &&
                                        renderFormItemTable({
                                          section: relationProveedor.provIndCompanyRut,
                                          validator: docValidator( relationProveedor.provIndCompanyTipoDoc.val,true)
                                        })
                                    }
                                  </Row>
                                  <Row className="button-row">
                                    {
                                      apiForm.relProvCont.length < 1 && validarRegistros && apiForm.hasRelProvCont && (
                                        <Col
                                          span={24}
                                          className="missing-registers ant-form-explain"
                                        >
                                          {t("messages.aml.registersRequired")}
                                        </Col>
                                      )
                                    }
                                    <Col className="addRelation" xl={3}>
                                      <Button type="primary" htmlType="button" onClick={handleOnAddRelationProveedor} icon = "plus" > Añadir </Button>
                                    </Col>
                                    <Col className="addRelation" xl={3}>
                                      <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('relationProveedor')} > Limpiar </Button>
                                    </Col>
                                  </Row>
                                </>
                              )}

                              {apiForm.relProvCont.length > 0 &&
                              format === "html" ? (
                                <Table columns={relationProveedorColumns} dataSource={apiForm.relProvCont} size="middle" pagination={false} ></Table>
                              ) : (
                                toDescriptionsPdf( apiForm.relProvCont, relationProveedor )
                              )}
                            </Row>
                          )}
                          <Row className="subheader">
                            <Col xl={24}>
                              III. RELACIONES LABORALES ANTERIORES DISTINTOS (ÚLTIMOS 18 MESES)
                            </Col>
                          </Row>
                          <Row className="summary">
                            <Col span={21}>
                              {format !== "html" && ( <> <br /> <br /> </> )}
                              Declaro que en los últimos 18 meses he tenido vinculos laborales anteriores a {" "}
                              <strong>
                                {clienteNombre}
                              </strong>
                              <br />
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
                                      "hasRelLabAnt",
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
                          {(apiForm.hasRelLabAnt || openContent) && (
                            <Row className="content">
                              {format === "html" && (
                                <>
                                  <Row className="fields-row" gutter={[16, 8]}>
                                    {renderFormItemTable({
                                      section: laboral.laboralCompanyName,
                                    })}
                                    {renderFormItemTable({
                                      section: laboral.laboralCompanyTipoDoc,
                                      options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                    })}
                                    {renderFormItemTable({
                                      section: laboral.laboralCompanyRut,
                                      validator: docValidator(laboral.laboralCompanyTipoDoc.val,true)
                                    })}
                                  </Row>

                                  <Row className="fields-row" gutter={[16, 8]}>
                                    {renderFormItemTable({
                                      section: laboral.laboralPosition,
                                    })}

                                  {renderFormItemTable({
                                    section: laboral.laboralStartDate,
                                    initialValue: laboral.laboralStartDate.val !== null && laboral.laboralStartDate.val !== "" ? moment(laboral.laboralStartDate.val) : null,
                                  })}

                                  {renderFormItemTable({
                                    section: laboral.laboralEndDate,
                                    initialValue: laboral.laboralEndDate.val !== null && laboral.laboralEndDate.val !== undefined ? moment(laboral.laboralEndDate.val) : null,
                                  })}


                                  </Row>
                                  <Row className="button-row">
                                    {apiForm.relLabAnt.length < 1 && validarRegistros && apiForm.hasRelLabAnt && (
                                        <Col span={24} className="missing-registers ant-form-explain" > {t("messages.aml.registersRequired")} </Col>
                                    )}
                                    <Col className="addRelation" xl={3}>
                                      <Button type="primary" htmlType="button" onClick={handleOnAddLaboralRelation} icon = "plus" > Añadir </Button>
                                    </Col>
                                    <Col className="addRelation" xl={3}>
                                      <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('laboral')} > Limpiar </Button>
                                    </Col>
                                  </Row>
                                </>
                              )}

                              {apiForm.relLabAnt.length > 0 &&
                              format === "html" ? (
                                <Table
                                  columns={laboralColumns}
                                  dataSource={apiForm.relLabAnt}
                                  size="middle"
                                  pagination={false}
                                ></Table>
                              ) : (
                                toDescriptionsPdf(apiForm.relLabAnt, laboral)
                              )}
                            </Row>
                          )}
                          <Row className="subheader">
                            <Col xl={24}>
                              IV. ACTIVIDADES FUERA DE LA EMPRESA Y DEL HORARIO
                              LABORAL
                            </Col>
                          </Row>
                          <Row className="summary">
                            <Col span={21}>
                              Declaro que participo o contribuyo en
                              conferencias, seminarios, artículos a revistas e
                              instituciones privadas o públicas, y/o realizo
                              actividades docentes de cualquier tipo, fuera de
                              mi horario laboral, en otros trabajos o
                              actividades laborales que no entren en competencia
                              con el giro de la Empresa o en conflicto con sus intereses.

                            </Col>

                            {renderFormItem({
                              label: "",
                              name: "hasOutsideActivities",
                              initialValue: apiForm.hasOutsideActivities !== null ? apiForm.hasOutsideActivities : null,
                              colClassName: "switch-col",
                              itemClassName: "radio-item",
                              labelCol: 0,
                              wrapperCol: 0,
                              offset: 0,
                              rules: [ { required: true, message: t("messages.aml.dontForgetSelect"), }, ],
                              wrapperCols: 3,
                              item: (
                                <Radio.Group
                                  onChange={({ target }) => hancleOnChangeRadioButton( "hasOutsideActivities", target.value ) }
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
                          {(apiForm.hasOutsideActivities || openContent) && (
                            <Row className="content">
                              {format === "html" && (
                                <>
                                  <Row className="fields-row" gutter={[16, 8]}>
                                    {renderFormItemTable({
                                      section: outdoor.outdoorCompanyName,
                                    })}
                                    {renderFormItemTable({
                                      section: outdoor.outdoorCompanyTipoDoc,
                                      options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                    })}
                                    {renderFormItemTable({
                                      section: outdoor.outdoorCompanyRut,
                                      validator: docValidator(outdoor.outdoorCompanyTipoDoc.val,true)
                                    })}
                                  </Row>
                                  <Row className="fields-row" gutter={[16, 8]}>
                                    {renderFormItemTable({
                                      section: outdoor.outdoorActivity,
                                    })}
                                  </Row>

                                  <Row className="button-row">
                                    {apiForm.outsideActivities.length < 1 && validarRegistros && apiForm.hasOutsideActivities && (
                                        <Col span={24} className="missing-registers ant-form-explain" > {t("messages.aml.registersRequired")} </Col>
                                      )}

                                    <Col className="addRelation" xl={3}>
                                      <Button type="primary" htmlType="button" onClick={handleOnAddOutdoor} icon = "plus" > Añadir </Button>
                                    </Col>
                                    <Col className="addRelation" xl={3}>
                                      <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('outdoor')} > Limpiar </Button>
                                    </Col>
                                  </Row>
                                </>
                              )}

                              {apiForm.outsideActivities.length > 0 && (
                                <Table
                                  columns={outdoorColumns}
                                  dataSource={apiForm.outsideActivities}
                                  size="middle"
                                  pagination={false}
                                ></Table>
                              )}
                            </Row>
                          )}
                          <Row className="subheader">
                            <Col xl={24}>V. RELACIÓN CON LA COMPETENCIA</Col>
                          </Row>
                          <Row className="summary">
                            <Col span={21}>
                              Declaro que tengo relaciones de parentesco hasta
                              el segundo grado de{" "}
                              <Tooltip
                                className="tooltip-form"
                                title="Hasta segundo grado de consanguinidad, se consideran padres, hijos, abuelos, nietos y hermanos"
                              >
                                consanguinidad
                              </Tooltip>{" "}
                              o{" "}
                              <Tooltip
                                className="tooltip-form"
                                title="Hasta segundo grado de afinidad, se consideran Padres, hijos que no sean suyos, Abuelos, Nietos y hermanos del cónyuge o conviviente civil (AUC)"
                              >
                                afinidad
                              </Tooltip>{" "}
                              inclusive con trabajadores de la
                              <Tooltip
                                className="tooltip-form"
                                title="Sin que el siguiente listado sea taxativo,
                                  algunos ejemplos de competencia son: Cencosud, Walmart Chile,
                                  Líder, Tottus, Jumbo, Santa Isabel, Oxxo, Ekono, SuperBodega Acuenta,
                                 Central Mayorista, entre otros"
                              >
                                {" "}
                                competencia
                              </Tooltip>
                              , y/o mi pareja, conviviente civil (AUC) o cónyuge son
                              trabajadores de la competencia.
                            </Col>

                            {renderFormItem({
                              label: "",
                              name: "hasRelCompetitor",
                              initialValue: apiForm.hasRelCompetitor !== null ? apiForm.hasRelCompetitor : null,
                              colClassName: "switch-col",
                              itemClassName: "radio-item",
                              labelCol: 0,
                              wrapperCol: 0,
                              offset: 0,
                              rules: [ { required: true, message: t("messages.aml.dontForgetSelect"), }, ],
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
                              {format === "html" && (
                                <>
                                  <Row className="inner-row" gutter={[16, 8]}>
                                    {renderFormItemTable({
                                      section: competencia.competenciaCompanyName,
                                    })}
                                    {renderFormItemTable({
                                      section: competencia.competenciaCompanyTipoDoc,
                                      options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                    })}
                                    {renderFormItemTable({
                                      section: competencia.competenciaCompanyRut,
                                      validator: docValidator(competencia.competenciaCompanyTipoDoc.val,true)
                                    })}
                                  </Row>
                                  <Row className="inner-row" gutter={[16, 8]}>
                                  {renderFormItemTable({
                                        section: competencia.competenciaRelationship,
                                        options:
                                        [
                                          { val: "Conyuge", text: "Conyuge" },
                                          { val: "Conviviente civil", text: "Conviviente civil" },
                                          { val: "Padre", text: "Padre" },
                                          { val: "Madre", text: "Madre" },
                                          { val: "Hijo(a)", text: "Hijo(a)" },
                                          { val: "Hermano(a)", text: "Hermano(a)" },
                                          { val: "Abuelo(a)", text: "Abuelo(a)" },
                                          { val: "Nieto(a)", text: "Nieto(a)" },
                                          { val: "Suegro(a)", text: "Suegro(a)" },
                                          { val: "Hijo(a) del conyuge que no sean suyos", text: "Hijo(a) del conyuge que no sean suyos" },
                                          { val: "Abuelo(a) del cónyuge", text: "Abuelo(a) del cónyuge" },
                                          { val: "Nieto(a) del cónyuge", text: "Nieto(a) del cónyuge" },
                                          { val: "Hermano(a) del cónyuge", text: "Hermano(a) del cónyuge" },
                                          { val: "Yerno", text: "Yerno" },
                                          { val: "Nuera", text: "Nuera" },
                                          { val: "Tío(a)", text: "Tío(a)" },
                                          { val: "Sobrino(a)", text: "Sobrino(a)" },
                                          { val: "Bisabuelo(a)", text: "Bisabuelo(a)" },
                                          { val: "Biznieto(a)", text: "Biznieto(a)" },
                                          { val: "Bisabuelo(a) del cónyuge", text: "Bisabuelo(a) del cónyuge" },
                                          { val: "Cuñado(a)", text: "Cuñado(a)" },
                                          { val: "Sobrino(a) del conyuge", text: "Sobrino(a) del conyuge" },
                                        ],
                                    })}

                                    {renderFormItemTable({
                                      section: competencia.competenciaName,
                                    })}
                                    {renderFormItemTable({
                                      section: competencia.competenciaTipoDoc,
                                      options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                    })}
                                  </Row>

                                  <Row className="inner-row" gutter={[16, 8]}>
                                    {renderFormItemTable({
                                      section: competencia.competenciaRut,
                                      validator: docValidator(competencia.competenciaTipoDoc.val)
                                    })}
                                    {renderFormItemTable({
                                      section: competencia.competenciaPosition,
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
                                      <Button type="primary" htmlType="button" onClick={handleOnAddCompetencia} icon = "plus" > Añadir </Button>
                                    </Col>
                                    <Col className="addRelation" xl={3}>
                                      <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('competencia')} > Limpiar </Button>
                                    </Col>
                                  </Row>
                                </>
                              )}

                              {apiForm.relCompetitor.length > 0 && format === "html" ? (
                                <Table columns={competenciaColumns} dataSource={apiForm.relCompetitor} size="middle" pagination={false} ></Table>
                              ) : (
                                toDescriptionsPdf( apiForm.relCompetitor, competencia )
                              )}
                            </Row>
                          )}
                          <Row className="subheader">
                            <Col xl={24}>
                              VI. RELACIÓN DE PARENTESCO O DE PAREJA{" "}
                            </Col>
                          </Row>
                          <Row className="summary">
                            <Col span={21}>
                              Declaro que tengo parentesco hasta el segundo
                              grado de{" "}
                              <Tooltip
                                className="tooltip-form"
                                title="Hasta segundo grado de consanguinidad, se consideran padres, hijos, abuelos, nietos y hermanos"
                              >
                                consanguinidad
                              </Tooltip>{" "}
                              o{" "}
                              <Tooltip
                                className="tooltip-form"
                                title="Hasta segundo grado de afinidad, se consideran Padres, hijos que no sean suyos, Abuelos, Nietos y hermanos del cónyuge o conviviente civil (AUC) "
                              >
                                afinidad
                              </Tooltip>{" "}
                              inclusive o tengo una pareja que es trabajador(a)
                              de La Empresa o es mi conyuge o conviviente civil (AUC).
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
                              rules: [ { required: true, message: t("messages.aml.dontForgetSelect"), }, ],
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
                              {format === "html" && (
                                <>
                                  <Row className="inner-row" gutter={[16, 8]}>
                                    {renderFormItemTable({
                                          section: relationParentesco.relationParentescoRelationship,
                                          options:
                                          [
                                            { val: "Conyuge", text: "Conyuge" },
                                            { val: "Conviviente civil", text: "Conviviente civil" },
                                            { val: "Padre", text: "Padre" },
                                            { val: "Madre", text: "Madre" },
                                            { val: "Hijo(a)", text: "Hijo(a)" },
                                            { val: "Hermano(a)", text: "Hermano(a)" },
                                            { val: "Abuelo(a)", text: "Abuelo(a)" },
                                            { val: "Nieto(a)", text: "Nieto(a)" },
                                            { val: "Suegro(a)", text: "Suegro(a)" },
                                            { val: "Hijo(a) del conyuge que no sean suyos", text: "Hijo(a) del conyuge que no sean suyos" },
                                            { val: "Abuelo(a) del cónyuge", text: "Abuelo(a) del cónyuge" },
                                            { val: "Nieto(a) del cónyuge", text: "Nieto(a) del cónyuge" },
                                            { val: "Hermano(a) del cónyuge", text: "Hermano(a) del cónyuge" },
                                            { val: "Yerno", text: "Yerno" },
                                            { val: "Nuera", text: "Nuera" },
                                            { val: "Tío(a)", text: "Tío(a)" },
                                            { val: "Sobrino(a)", text: "Sobrino(a)" },
                                            { val: "Bisabuelo(a)", text: "Bisabuelo(a)" },
                                            { val: "Biznieto(a)", text: "Biznieto(a)" },
                                            { val: "Bisabuelo(a) del cónyuge", text: "Bisabuelo(a) del cónyuge" },
                                            { val: "Cuñado(a)", text: "Cuñado(a)" },
                                            { val: "Sobrino(a) del conyuge", text: "Sobrino(a) del conyuge" },
                                          ],
                                      })}
                                      {renderFormItemTable({
                                        section: relationParentesco.relationParentescoName,
                                      })}
                                      {renderFormItemTable({
                                        section: relationParentesco.relationParentescoTipoDoc,
                                        options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                      })}
                                  </Row>

                                  <Row className="inner-row" gutter={[16, 8]}>
                                    {renderFormItemTable({
                                        section: relationParentesco.relationParentescoRut,
                                        validator: docValidator(relationParentesco.relationParentescoTipoDoc.val)
                                    })}
                                    {renderFormItemTable({
                                      section: relationParentesco.relationParentescoPosition,
                                    })}
                                    {renderFormItemTable({
                                      section: relationParentesco.relationParentescoCompanyName,
                                      options: (params.empresas !== undefined && params.empresas != null && params.empresas.length > 0) ? params.empresas.map(empresa => ({ val: empresa, text: empresa })) : []
                                    })}
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
                                      <Button type="primary" htmlType="button" onClick={handleOnAddRelationParentesco} icon = "plus" > Añadir </Button>
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
                              VII. RELACIÓN CON FUNCIONARIOS PUBLICOS Y/O
                              PERSONAS EXPUESTAS POLÍTICAMENTE
                            </Col>
                          </Row>
                          <Row className="summary">
                            <Col span={21}>
                              Declaro que, hasta donde tengo conocimiento, tengo
                              parentesco hasta el segundo grado de{" "}
                              <Tooltip
                                className="tooltip-form"
                                title="Hasta segundo grado de consanguinidad, se consideran padres, hijos, abuelos, nietos y hermanos"
                              >
                                consanguinidad
                              </Tooltip>{" "}
                              o{" "}
                              <Tooltip
                                className="tooltip-form"
                                title="Hasta segundo grado de afinidad, se consideran Padres, hijos que no sean suyos, Abuelos, Nietos y hermanos del cónyuge o conviviente civil (AUC) "
                              >
                                afinidad,
                              </Tooltip>{" "}
                              con funcionarios públicos, tanto en la
                              administración central del Estado como en
                              instituciones o empresas fiscales o semifiscales,
                              municipales, autónomas u organismos creados por el
                              Estado o bajo su dependencia; o con Personas
                              Expuestas Políticamente{" "}
                              <Tooltip
                                placement="rightBottom"
                                º
                                className="tooltip-form"
                                overlayStyle={{ maxWidth: "700px" }}
                                title={() => {
                                  return (
                                    <>
                                      "Se consideraran como PEP a los chilenos o
                                      extranjeros que desempeñen o hayan
                                      desempeñado funciones políticas destacadas
                                      en Chile o el extranjero, hasta a lo menos
                                      un año de finalizado el ejercicio de las
                                      mismas. Se incluyen en esta categoría: "{" "}
                                      <br />
                                      1. Presidente de la República. <br />
                                      2. Senadores, diputados y alcaldes.
                                      <br />
                                      3. Ministros de la Corte Suprema y Cortes
                                      de Apelaciones.
                                      <br />
                                      4. Ministros de Estado, subsecretarios,
                                      intendentes, gobernadores, secretarios
                                      regionales ministeriales, embajadores,
                                      jefes superiores de Servicio, tanto
                                      centralizados como descentralizados, y el
                                      directivo superior inmediato que deba
                                      subrogar a cada uno de ellos.
                                      <br />
                                      5. Comandantes en Jefe de las Fuerzas
                                      Armadas, director General de Carabineros,
                                      director General de Investigaciones, y el
                                      oficial superior inmediato que deba
                                      subrogar a cada uno de ellos.
                                      <br />
                                      6. Fiscal Nacional del Ministerio Público
                                      y fiscales regionales.
                                      <br />
                                      7. Contralor General de la República.
                                      <br />
                                      8. Consejeros del Banco Central de Chile.
                                      <br />
                                      9. Consejeros del Consejo de Defensa del
                                      Estado.
                                      <br />
                                      10. Ministros del Tribunal Constitucional.
                                      <br />
                                      11. Ministros del Tribunal de la Libre
                                      Competencia.
                                      <br />
                                      12. Integrantes titulares y suplentes del
                                      Tribunal de Contratación Pública.
                                      <br />
                                      13. Consejeros del Consejo de Alta
                                      Dirección Pública.
                                      <br />
                                      14. Directores y ejecutivos principales de
                                      empresas públicas, según lo definido por
                                      la Ley Nº 18.045.
                                      <br />
                                      15. Directores de sociedades anónimas
                                      nombrados por el Estado o sus organismos.
                                      <br />
                                      16. Miembros de las directivas de los
                                      partidos políticos.
                                      <br />
                                    </>
                                  );
                                }}
                              >
                                (PEP),
                              </Tooltip>{" "}
                              es decir, con personas que desempeñan o hayan
                              desempeñado funciones públicas destacadas durante
                              los últimos 12 meses.
                            </Col>
                            {renderFormItem({
                              label: "",
                              name: "hasRelPepFp",
                              initialValue: getRadioButtonValue('PEP'),
                              colClassName: "switch-col",
                              itemClassName: "radio-item",
                              labelCol: 0,
                              wrapperCol: 0,
                              offset: 0,
                              rules: [ { required: true, message: t("messages.aml.dontForgetSelect"), }, ],
                              wrapperCols: 3,
                              item: (
                                <Radio.Group
                                  onChange={({ target }) => handleOnChangeRadioButton2( 'PEP', "hasRelPepFp", target.value ) }
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
                          {(getRadioButtonValue('PEP') || openContent) && (
                            <Row className="content">
                              {format === "html" && (
                                <>
                                  <Row className="inner-row" gutter={[16, 8]}>
                                    {renderFormItemTable({
                                      section: relationPep.relationPepRelationship,
                                      options:
                                      [
                                        { val: "Mi persona", text: "Mi persona" },
                                        { val: "Conyuge", text: "Conyuge" },
                                        { val: "Conviviente civil", text: "Conviviente civil" },
                                        { val: "Padre", text: "Padre" },
                                        { val: "Madre", text: "Madre" },
                                        { val: "Hijo(a)", text: "Hijo(a)" },
                                        { val: "Hermano(a)", text: "Hermano(a)" },
                                        { val: "Abuelo(a)", text: "Abuelo(a)" },
                                        { val: "Nieto(a)", text: "Nieto(a)" },
                                        { val: "Suegro(a)", text: "Suegro(a)" },
                                        { val: "Hijo(a) del conyuge que no sean suyos", text: "Hijo(a) del conyuge que no sean suyos" },
                                        { val: "Abuelo(a) del cónyuge", text: "Abuelo(a) del cónyuge" },
                                        { val: "Nieto(a) del cónyuge", text: "Nieto(a) del cónyuge" },
                                        { val: "Hermano(a) del cónyuge", text: "Hermano(a) del cónyuge" },
                                        { val: "Yerno", text: "Yerno" },
                                        { val: "Nuera", text: "Nuera" },
                                        { val: "Tío(a)", text: "Tío(a)" },
                                        { val: "Sobrino(a)", text: "Sobrino(a)" },
                                        { val: "Bisabuelo(a)", text: "Bisabuelo(a)" },
                                        { val: "Biznieto(a)", text: "Biznieto(a)" },
                                        { val: "Bisabuelo(a) del cónyuge", text: "Bisabuelo(a) del cónyuge" },
                                        { val: "Cuñado(a)", text: "Cuñado(a)" },
                                        { val: "Sobrino(a) del conyuge", text: "Sobrino(a) del conyuge" },
                                      ],
                                    })}
                                    {renderFormItemTable({
                                      section: relationPep.relationPepName,
                                    })}
                                    {renderFormItemTable({
                                      section: relationPep.relationPepTipoDoc,
                                      options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                    })}
                                  </Row>
                                  <Row className="inner-row" gutter={[16, 8]}>
                                    {renderFormItemTable({
                                      section: relationPep.relationPepRut,
                                      validator: docValidator(relationPep.relationPepTipoDoc.val)
                                    })}
                                    {renderFormItemTable({
                                      section: relationPep.relationPepCategory,
                                      options: [{ val: "PEP", text: "PEP" }, { val: "Funcionario Público", text: "Funcionario Público" }],
                                    })}
                                    {renderFormItemTable({
                                      section: relationPep.relationPepInstitution,
                                    })}
                                  </Row>

                                  <Row className="inner-row" gutter={[16, 8]}>
                                    {renderFormItemTable({
                                      section: relationPep.relationPepPosition,
                                    })}

                                    {renderFormItemTable({
                                      section: relationPep.relationPepEndDate,
                                      initialValue: relationPep.relationPepEndDate.val !== null && relationPep.relationPepEndDate.val !== undefined ? moment(relationPep.relationPepEndDate.val) : null,
                                    })}

                                  </Row>

                                  <Row className="button-row">
                                    {getFilteredRegistersByType('PEP').length < 1 && validarRegistros && getRadioButtonValue('PEP') && (
                                        <Col span={24} className="missing-registers ant-form-explain" > {t("messages.aml.registersRequired")} </Col>
                                      )}
                                    <Col className="addRelation" xl={3}>
                                      <Button type="primary" htmlType="button" onClick={(e)=> handleOnAddAttributes(relationPep,'PEP', 'relationPep')} icon = "plus" > Añadir </Button>
                                    </Col>
                                    <Col className="addRelation" xl={3}>
                                      <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('relationPep')} > Limpiar </Button>
                                    </Col>
                                  </Row>
                                </>
                              )}

                              {getFilteredRegistersByType('PEP').length > 0 &&
                              format === "html" ? (
                                <Table columns={relationPepColumns} dataSource={getFilteredRegistersByType('PEP')} size="middle" pagination={false} ></Table>
                              ) : (
                                toDescriptionsPdf(getFilteredRegistersByType('PEP'), relationPep)
                              )}
                            </Row>
                          )}
                          <Row className="subheader">
                            <Col xl={24}>
                              VIII. RELACIÓN CON FUNDACIONES, CORPORACIONES, INSTITUCIONES DE BENEFICIENCIA Y/O SIN FINES DE LUCRO
                            </Col>
                          </Row>
                          <Row className="summary">
                            <Col span={21}>
                              Declaro que participo, directa o indirectamente, o
                              lo hace mi cónyuge, conviviente civil (AUC) y/o
                              parientes hasta el segundo grado de{" "}
                              <Tooltip
                                className="tooltip-form"
                                title="Hasta segundo grado de consanguinidad, se consideran padres, hijos, abuelos, nietos y hermanos"
                              >
                                consanguinidad
                              </Tooltip>{" "}
                              o{" "}
                              <Tooltip
                                className="tooltip-form"
                                title="Hasta segundo grado de afinidad, se consideran Padres, hijos que no sean suyos, Abuelos, Nietos y hermanos del cónyuge o conviviente civil (AUC) "
                              >
                                afinidad,
                              </Tooltip>{" "}
                              inclusive, como fundador, director, consejero,
                              gerente, administrador, u otro similar, hasta
                              donde tengo conocimiento, en fundaciones,
                              corporaciones, instituciones de beneficencia y/o
                              sin fines de lucro.
                            </Col>
                            {renderFormItem({
                              label: "",
                              name: "hasRelFundPjsfl",
                              initialValue: apiForm.hasRelFundPjsfl !== null ? apiForm.hasRelFundPjsfl : null,
                              colClassName: "switch-col",
                              itemClassName: "radio-item",
                              labelCol: 0,
                              wrapperCol: 0,
                              offset: 0,
                              rules: [ { required: true, message: t("messages.aml.dontForgetSelect"), }, ],
                              wrapperCols: 3,
                              item: (
                                <Radio.Group
                                  onChange={({ target }) => hancleOnChangeRadioButton( "hasRelFundPjsfl", target.value ) }
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
                          {(apiForm.hasRelFundPjsfl || openContent) && (
                            <Row className="content">
                              {format === "html" && (
                                <>
                                  <Row className="inner-row" gutter={[16, 8]}>
                                    {renderFormItemTable({
                                      section: relationFundaciones.relationFundacionesCompanyName,
                                    })}
                                    {renderFormItemTable({
                                      section: relationFundaciones.relationFundacionesCompanyTipoDoc,
                                      options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                    })}
                                    {renderFormItemTable({
                                      section: relationFundaciones.relationFundacionesCompanyRut,
                                      validator: docValidator(relationFundaciones.relationFundacionesCompanyTipoDoc.val,true)
                                    })}
                                  </Row>
                                  <Row className="inner-row" gutter={[16, 8]}>
                                    {renderFormItemTable({
                                      section: relationFundaciones.relationFundacionesCompanyType,
                                      options: [
                                        { val: "Fundaciones", text: "Fundaciones" },
                                        { val: "Corporaciones", text: "Corporaciones" },
                                        { val: "Instituciones de beneficencia y/o sin fines de lucro", text: "Instituciones de beneficencia y/o sin fines de lucro" },
                                      ],
                                    })}
                                    {renderFormItemTable({
                                      section: relationFundaciones.relationFundacionesPosition,
                                      options: [
                                        { val: "Director", text: "Director" },
                                        { val: "Socio", text: "Socio" },
                                        { val: "Accionista", text: "Accionista" },
                                        { val: "Propietario", text: "Propietario" },
                                        { val: "Ejecutivo Principal", text: "Ejecutivo Principal" },
                                        { val: "Administrador", text: "Administrador" },
                                        { val: "Asesor", text: "Asesor" },
                                      ],
                                    })}
                                    {renderFormItemTable({
                                      section: relationFundaciones.relationFundacionesRelationship,
                                      options:
                                      [
                                        { val: "Mi persona", text: "Mi persona" },
                                        { val: "Conyuge", text: "Conyuge" },
                                        { val: "Conviviente civil", text: "Conviviente civil" },
                                        { val: "Padre", text: "Padre" },
                                        { val: "Madre", text: "Madre" },
                                        { val: "Hijo(a)", text: "Hijo(a)" },
                                        { val: "Hermano(a)", text: "Hermano(a)" },
                                        { val: "Abuelo(a)", text: "Abuelo(a)" },
                                        { val: "Nieto(a)", text: "Nieto(a)" },
                                        { val: "Suegro(a)", text: "Suegro(a)" },
                                        { val: "Hijo(a) del conyuge que no sean suyos", text: "Hijo(a) del conyuge que no sean suyos" },
                                        { val: "Abuelo(a) del cónyuge", text: "Abuelo(a) del cónyuge" },
                                        { val: "Nieto(a) del cónyuge", text: "Nieto(a) del cónyuge" },
                                        { val: "Hermano(a) del cónyuge", text: "Hermano(a) del cónyuge" },
                                        { val: "Yerno", text: "Yerno" },
                                        { val: "Nuera", text: "Nuera" },
                                        { val: "Tío(a)", text: "Tío(a)" },
                                        { val: "Sobrino(a)", text: "Sobrino(a)" },
                                        { val: "Bisabuelo(a)", text: "Bisabuelo(a)" },
                                        { val: "Biznieto(a)", text: "Biznieto(a)" },
                                        { val: "Bisabuelo(a) del cónyuge", text: "Bisabuelo(a) del cónyuge" },
                                        { val: "Cuñado(a)", text: "Cuñado(a)" },
                                        { val: "Sobrino(a) del conyuge", text: "Sobrino(a) del conyuge" },
                                      ],
                                    })}
                                  </Row>
                                  <Row className="inner-row" gutter={[16, 8]}>
                                    {renderFormItemTable({
                                      section: relationFundaciones.relationFundacionesName,
                                    })}
                                    {renderFormItemTable({
                                      section: relationFundaciones.relationFundacionesTipoDoc,
                                      options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                    })}
                                    {renderFormItemTable({
                                      section: relationFundaciones.relationFundacionesRut,
                                      validator: docValidator(relationFundaciones.relationFundacionesTipoDoc.val)
                                    })}
                                  </Row>

                                  <Row className="inner-row" gutter={[16, 8]}>
                                    {renderFormItemTable({
                                      section: relationFundaciones.relationFundacionesArea,
                                    })}
                                  </Row>

                                  <Row className="button-row">
                                    {apiForm.relFundPjsfl.length < 1 &&
                                      validarRegistros &&
                                      apiForm.hasRelFundPjsfl && (
                                        <Col
                                          span={24}
                                          className="missing-registers ant-form-explain"
                                        >
                                          {t("messages.aml.registersRequired")}
                                        </Col>
                                      )}
                                    <Col className="addRelation" xl={3}>
                                      <Button type="primary" htmlType="button" onClick={handleOnAddRelationFundaciones} icon = "plus" > Añadir </Button>
                                    </Col>
                                    <Col className="addRelation" xl={3}>
                                     <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('relationFundaciones')} > Limpiar </Button>
                                    </Col>
                                  </Row>
                                </>
                              )}

                              {apiForm.relFundPjsfl.length > 0 &&
                              format === "html" ? (
                                <Table
                                  columns={relationFundacionesColumns}
                                  dataSource={apiForm.relFundPjsfl}
                                  size="middle"
                                  pagination={false}
                                ></Table>
                              ) : (
                                toDescriptionsPdf(
                                  apiForm.relFundPjsfl,
                                  relationFundaciones
                                )
                              )}
                            </Row>
                          )}
                          <Row className="subheader">
                            <Col xl={24}>IX. OTROS CONFLICTOS DE INTERÉS</Col>
                          </Row>
                          <Row className="summary">
                            <Col span={21}>
                              Declaro que tengo conocimiento de algún otro
                              conflicto de interés no abordado en las preguntas
                              anteriores y que pudiera afectar o influir de
                              cualquier forma en mi relación con la Empresa,
                              tales como, existencia de relación comercial con
                              amigos intimos, parientes hasta el segundo grado de{" "}
                              <Tooltip
                                className="tooltip-form"
                                title="Hasta segundo grado de consanguinidad, se consideran padres, hijos, abuelos, nietos y hermanos"
                              >
                                consanguinidad
                              </Tooltip>{" "}
                              o{" "}
                              <Tooltip
                                className="tooltip-form"
                                title="Hasta segundo grado de afinidad, se consideran Padres, hijos que no sean suyos, Abuelos, Nietos y hermanos del cónyuge o conviviente civil (AUC) "
                              >
                                afinidad,
                              </Tooltip>{" "}
                            </Col>

                            {renderFormItem({
                              label: "",
                              name: "hasOthersCDI",
                              initialValue:
                                apiForm.hasOthersCDI !== null
                                  ? apiForm.hasOthersCDI
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
                                      "hasOthersCDI",
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
                          {(apiForm.hasOthersCDI || openContent) && (
                            <Row className="content">
                              {format === "html" && (
                                <>
                                  <Row className="fields-row" gutter={[16, 8]}>
                                    {renderFormItem({
                                      label: "Descripción de la situación",
                                      name: baseParamsIS.relationOtrosDescripcion.id,
                                      initialValue:
                                        relationOtros.relationOtrosDescripcion,
                                      colClassName: "topLabel",
                                      labelCol: 0,
                                      wrapperCol: 0,
                                      rules: [
                                        {
                                          required: true,
                                          message: t( "messages.aml.requestedField" ),
                                        },
                                        validateLengthBaseParam(baseParamsIS.relationOtrosDescripcion)
                                      ],
                                      wrapperCols: 24,
                                      item: (
                                        <Input
                                          autoComplete="off"
                                          onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                          onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                          readOnly = {baseParams.relationOtrosDescripcion.readOnly}
                                          disabled={false}
                                          onChange={(e) => handleOnChangeFieldRelationOtros("relationOtrosDescripcion", e.target.value ) }
                                        />
                                      ),
                                    })}
                                  </Row>

                                  <Row className="button-row">
                                    {apiForm.othersCDI.length < 1 &&
                                      validarRegistros &&
                                      apiForm.hasOthersCDI && (
                                        <Col
                                          span={24}
                                          className="missing-registers ant-form-explain"
                                        >
                                          {t("messages.aml.registersRequired")}
                                        </Col>
                                      )}
                                    <Col className="addRelation" xl={3}>
                                      <Button
                                        type="primary"
                                        htmlType="button"
                                        onClick={handleOnAddRelationOtros}
                                        icon = "plus"
                                      >
                                        Añadir
                                      </Button>
                                    </Col>
                                    <Col className="addRelation" xl={3}>
                                    <Button
                                      type="primary"
                                      htmlType="button"
                                      icon="delete"
                                      onClick={(e)=>handleOnClear('relationOtros')}
                                    >
                                      Limpiar
                                    </Button>
                                  </Col>
                                  </Row>
                                </>
                              )}

                              {apiForm.othersCDI.length > 0 && (
                                <Table
                                  columns={relationOtrosColumns()}
                                  dataSource={apiForm.othersCDI}
                                  size="middle"
                                  pagination={false}
                                ></Table>
                              )}
                            </Row>
                          )}
                          <Row className="subheader">
                            <Col xl={24}>
                              X. CONOCIMIENTO DEL USO DE INFORMACIÓN
                              CONFIDENCIAL, RESERVADA Y/O PRIVILEGIADA
                            </Col>
                          </Row>
                          <Row className="summary">
                            <Col xl={24}>
                              Declaro tener conocimiento de la Ley N° 18.045 en
                              lo relativo a la prohibición de utilizar o revelar
                              en beneficio propio o de terceros, información{" "}
                              <Tooltip
                                className="tooltip-form"
                                title="Información Confidencial: es aquella que se refiere a hechos que no presentan
                          el carácter de esenciales y respecto de los cuales no existe obligación
                          de darla a conocer a la Superintendencia y al público en general, o que no
                          reviste la calidad de información privilegiada o reservada, y que sin embargo
                          los directores, gerentes generales y gerentes de la Administradora
                          deciden mantener internamente, bajo sigilo. "
                              >
                                confidencial,
                              </Tooltip>{" "}
                              <Tooltip
                                className="tooltip-form"
                                title="Información reservada: se refiere a ciertos hechos o
                          antecedentes relativos a negociaciones aún pendientes
                          que al conocerse puedan perjudicar el interés social y
                           respecto de las cuales con la aprobación de las tres cuartas
                           partes de los directores en ejercicio, se les dio el carácter de reservados "
                              >
                                reservada
                              </Tooltip>{" "}
                              y/o{" "}
                              <Tooltip
                                className="tooltip-form"
                                title="Información Privilegiada: es toda información que se refiera
                           a uno o a varios emisores de valores, a sus negocios o a uno o
                           varios valores por ellos emitidos; no divulgada al mercado; y cuyo
                           conocimiento, por su naturaleza, sea capaz de influir en
                           la cotización de valores emitidos "
                              >
                                privilegiada
                              </Tooltip>{" "}
                            </Col>
                          </Row>
                          <Row className="subheader">
                            <Col xl={24}>
                              XI. CONOCIMIENTO DE LA LEY N°20.393 SOBRE
                              “RESPONSABILIDAD PENAL DE LAS PERSONAS JURÍDICAS
                            </Col>
                          </Row>
                          <Row className="summary">
                            <Col xl={24}>
                              Declaro estar en conocimiento que la Empresa ha
                              adoptado un modelo de prevención de delitos de
                              acuerdo a la Ley N°20.393 de “Responsabilidad
                              Penal de las Personas Jurídicas, y me comprometo a
                              no cometer o participar en la comisión de ninguno
                              de los delitos señalados en la citada Ley u otros
                              que pudiesen incorporarse en el futuro, así como
                              cumplir procesos y controles establecidos para
                              dicho fin.
                            </Col>
                          </Row>
                          <Row className="summary">
                            <Col xl={24}>
                              Declaro no haber cometido los delitos de
                              receptación, apropiación indebida, administración
                              desleal, negociación incompatible, corrupción
                              entre privados, lavado de activos, financiamiento
                              del terrorismo, contaminación de aguas,
                              comercialización prohibida de recursos
                              hidrobiológicos de la Ley N°18.892, cohecho de
                              funcionario público nacional y/o extranjero, e
                              inobservancia de las medidas de aislamiento u
                              otras medidas preventivas dispuestas por la
                              autoridad sanitaria en caso de epidemia o
                              pandemia, así como los que puedan incorporarse en
                              el futuro.
                            </Col>
                          </Row>
                          <Row className="summary">
                            <Col xl={24}>
                              Declaro tener la obligación de comunicar al
                              Encargado de Prevención de Delitos, todo acto o
                              conducta que revista caracteres de delito del cual
                              tome conocimiento, mediante el Canal Abierto del Grupo Santader.
                            </Col>
                          </Row>
                          <Row
                            className="content"
                            style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                          >
                            <Row className="summary">
                              <Col xl={24}>
                              Declaro expresamente que la información entregada
                              en esta declaración es veraz y completa,
                              y declaro estar en pleno conocimiento
                              de la importancia que ella tiene para {" "}
                              <strong>
                                {clienteNombre}
                              </strong>
                              {" "}y demás empresas del Grupo Santander,
                               y el cumplimiento por parte de éstas, de la normativa legal y regulatoria.

                              Finalmente, declaro conocer y aceptar que es mi obligación informar sobre cualquier cambio que se produzca en la información entregada precedentemente.
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
              <h2 style={{ textAlign: "center" }}>Formulario no encontrado</h2>
            )}
          </>
        )}
      </div>
    </FormLayout>
  );
};

export default withRouter(Form.create()(FormTrab));
