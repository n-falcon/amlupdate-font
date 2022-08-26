import "./formProv.scss";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, Form, Input, Row, Spin, DatePicker, Select, Tooltip, Radio, Table, Icon, notification, Descriptions } from "antd";
import { FormLayout } from "../../../../../layouts";
import { withRouter } from "react-router-dom";
import { getFormPromise, getParamsPromise, saveFormCDIprovPromise, sendFormPromise, } from "../../../promises";
import moment from "moment";
import Logo from "./components/Logo/Logo";
import { validateRutHelper, validateCompanyRutHelper, } from "../../../../../helpers";

const FormProv = ({ form, match, formId }) => {
  const { t } = useTranslation();
  const { getFieldDecorator, validateFields, setFields, getFieldsError, setFieldsValue } = form;
  const [isValidate, setIsValidate] = useState(true);
  const [isLoading, setIsloading] = useState(false);

  const [date, setDate] = useState(0);
  const { Option } = Select;
  const [user, setUser] = useState({});
  const [subclienteId, setSubclienteId] = useState("0");
  const [apiForm, setApiForm] = useState(null);
  const [params, setParams] = useState({});
  const [othersCDIobj, setOthersCDIobj] = useState({});
  const [colLogo, setColLogo] = useState(4);
  const [smuProv, setSmuProv] = useState("");
  const [smuClient, setSmuClient] = useState("");
  const [format, setFormat] = useState("html");
  const [validarRegistros, setValidarRegistros] = useState(false);

  const [sentErrors, setSentErrors] = useState(0);

  // const [registersStop, setRegistersStop] = useState({stop:false});
  let registersStop = {
    relProvCont: false,
    consService: false,
    relRelationship: false,
    relParts: false,
    relLabAnt: false,
    propInteres: false,
    relPepFp: false,
    penalResp: false,
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
      case 'relationProveedor':
        setRelationProveedor({...relationProveedorIS})
        setFieldsValue(Object.keys(relationProveedorIS).reduce((acu,key)=>{
          return {...acu,[key]:null}
        },{}))
        break;
      case 'consService':
        setConsService({...consServiceIS})
        setFieldsValue(Object.keys(consServiceIS).reduce((acu,key)=>{
          return {...acu,[key]:null}
        },{}))
        break;
      case 'relationParentesco':
        setRelationParentesco({...relationParentescoIS})
        setFieldsValue(Object.keys(relationParentescoIS).reduce((acu,key)=>{
          return {...acu,[key]:null}
        },{}))
        break;
      case 'relParts':
        setRelParts({...relPartsIS})
        setFieldsValue(Object.keys(relPartsIS).reduce((acu,key)=>{
          return {...acu,[key]:null}
        },{}))
        break;
      case 'laboral':
        setLaboral({...laboralIS})
        setFieldsValue(Object.keys(laboralIS).reduce((acu,key)=>{
          return {...acu,[key]:null}
        },{}))
        break;
      case 'propInteres':
        setPropInteres({...propInteresIS})
        setFieldsValue(Object.keys(propInteresIS).reduce((acu,key)=>{
          return {...acu,[key]:null}
        },{}))
        break;
      case 'relationPep':
        setRelationPep({...relationPepIS})
        setFieldsValue(Object.keys(relationPepIS).reduce((acu,key)=>{
          return {...acu,[key]:null}
        },{}))
        break;
      case 'penalResp':
        setPenalResp({...penalRespIS})
        setFieldsValue(Object.keys(penalRespIS).reduce((acu,key)=>{
          return {...acu,[key]:null}
        },{}))
        break;
      case 'relationOtros':
        setRelationOtros({...relationOtrosIS})
        setFieldsValue(Object.keys(relationOtrosIS).reduce((acu,key)=>{
          return {...acu,[key]:null}
        },{}))
        break;
        case 'relPartsCompanies':
          setRelPartsCompanies({...relPartsCompaniesIS})
          setFieldsValue({'relPartsCompanies':null})
          break;
      default:
        break;
    }
  }

  const baseParamsIS = {
      tipoDoc: {key:"tipoDoc", maxLength:200, id:'tipoDoc',readOnly:true},
      isRepLegal: {key:"isRepLegal", maxLength:200, id:'isRepLegal',readOnly:true},
      name: {key:"name", maxLength:200, id:'name2',readOnly:true},
      rut: {key:"rut", maxLength:20, id:'rut',readOnly:true},
      cargo: {key:"cargo", maxLength:100, id:'cargo',readOnly:true},
      phone: {key:"phone", maxLength:50, id:'phone',readOnly:true},
      email: {key:"email", maxLength:150, id:'email',readOnly:true},
      comAddress:{key:"comAddress", maxLength:255, id:'comAddress',readOnly:true},
      giro: {key:"giro", maxLength:255, id:'giro',readOnly:true},
      relationshipPart:{key:"relationshipPart", maxLength:500, id:'relationshipPart',readOnly:true},
      relationshipConsultancy:{key:"relationshipConsultancy", maxLength:500, id:'relationshipConsultancy',readOnly:true},
      relationshipDegree:{key:"relationshipDegree", maxLength:500, id:'relationshipDegree',readOnly:true},
      relPartsCompanies:{key:"relPartsCompanies", maxLength:500, id:'relPartsCompanies',readOnly:true},
      relationOtrosDescripcion:{key:"relationOtrosDescripcion", maxLength:4000, id:'relationOtrosDescripcion',readOnly:true},
  }
  const [baseParams, setBaseParams]=useState(baseParamsIS)

  const testLengthBaseParams = (offset)=>{
    const test = Object.entries(baseParams).reduce((acu,item)=>{
      return {...acu, [item[1].id]: 'x'.repeat(item[1].max+offset)}
    },{})
    setFieldsValue(test)
    validateFields(Object.values(baseParams).map(obj=>obj.id))
  }

  const handleOnChangeIntro = async (fieldObj, value) => {
    let formToUpdate = { ...apiForm, [fieldObj.key]: value };
    let ret = await saveFormCDIprovPromiseLocal(formToUpdate);
    //if(!ret.success) { setFieldsValue({[field]: ret.form[field]}) }
  };

  const validateLengthFieldWithInnerLength = (section)=>{
    return {
      max: section.maxLength,
      message: "Debe tener un máximo de "+ section.maxLength  + " caracteres"
    }
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

  const settingStateObj=(sectionId,readOnly)=>{
    const [stateObject,stateObjectSetter] = customState(sectionId)
    stateObjectSetter({...stateObject,[sectionId]:{...stateObject[sectionId],readOnly:readOnly}})
  }


  const customState=(sectionId)=>{
    if (sectionId.startsWith('prov')) {
      return([relationProveedor,setRelationProveedor])
    }
    if (sectionId.startsWith('consService')) {
      return([consService,setConsService])
    }
    if (sectionId.startsWith('relationParentesco')) {
      return([relationParentesco,setRelationParentesco])
    }
    if (sectionId.startsWith('propInteres')) {
      return([propInteres,setPropInteres])
    }
    if (sectionId.startsWith('relParts')) {
      return([relParts,setRelParts])
    }
    if (sectionId.startsWith('laboral')) {
      return([laboral,setLaboral])
    }
    if (sectionId.startsWith('relationParentesco')) {
      return([relationParentesco,setRelationParentesco])
    }
    if (sectionId.startsWith('penalResp')) {
      return([penalResp,setPenalResp])
    }
    if (sectionId.startsWith('relationPep')) {
      return([relationPep,setRelationPep])
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
    }
  };



  const relationProveedorIS = {
    provName: { key: "name", val: "", title: "Nombre", maxLength:150, readOnly:true, id:"provName" },
    provTipoDoc: { key: "tipoDoc", val: "", title: "Tipo de documento de identidad", id: 'provTipoDoc',type:'select'},
    provRut: { key: "rut", val: "", title: "Documento de Identidad", maxLength:20, readOnly:true, id:"provRut" },
    provCompanyPosition: { key: "companyPosition", val: "", title: "Cargo", id: "provCompanyPosition", type:'select' },
    provCompanyName: { key: "companyName", val: "", title: "Empresa Relacionada Cliente", id: "provCompanyName", type:'select'},
    provPosition: { key: "position", val: "", title: "Cargo en la Empresa", provPosition: "provPosition", id: "provPosition", type:'select'},
    provPropertyType: { key: "propertyType", val: "", title: "Tipo de Propiedad", id: "provPropertyType", type:'select' },
    provPercentage: { key: "percentage", val: "", title: "Porcentaje de Participación", maxLength:10, readOnly:true, id:"provPercentage" },
    provIndCompanyName: { key: "indCompanyName", val: "", title: "Nombre de Empresa Propiedad Indirecta", maxLength:150, readOnly:true, id:"provIndCompanyName" },
    provIndCompanyTipoDoc: { key: "indCompanyTipoDoc", val: "", title: "Tipo Documento Empresa Propiedad Indirecta", id: "provIndCompanyTipoDoc", type:'select' },
    provIndCompanyRut: { key: "indCompanyRut", val: "", title: "Documento Empresa Propiedad Indirecta", maxLength:20, readOnly:true, id:"provIndCompanyRut" },
  }
  const [relationProveedor, setRelationProveedor] = useState(relationProveedorIS);

  const consServiceIS = {
    consServiceName: { key: "name", val: "", title: "Nombre", maxLength:150, readOnly:true, id:"consServiceName" },
    consServiceTipoDoc: { key: "tipoDoc", val: "", title: "Tipo de documento de identidad", id: "consServiceTipoDoc", type:'select' },
    consServiceRut: { key: "rut", val: "", title: "Documento de Identidad", maxLength:20, readOnly:true, id:"consServiceRut" },
    consServicePosition: { key: "position", val: "", title: "Cargo", id: "consServicePosition", type:'select' },
    consServiceConsCompany: { key: "consCompany", val: "", title: "Nombre Empresa Asesora", maxLength:150, readOnly:true, id:"consServiceConsCompany" },
    consServiceConsTipoDoc: { key: "tipoDoc", val: "", title: "Tipo de documento de identidad Empresa Asesora", id: "consServiceConsTipoDoc", type:'select' },
    consServiceConsRut: { key: "consRut", val: "", title: "Documento de identidad de la Empresa Asesora", maxLength:20, readOnly:true, id:"consServiceConsRut" },
    consServiceType: { key: "type", val: "", title: "Tipo de Servicios", maxLength:100, readOnly:true, id:"consServiceType" },
    consServiceCompanyName: { key: "company", val: "", title: "Empresa Relacionada Cliente", id: "consServiceCompanyName", type:'select' },
  }
  const [consService, setConsService] = useState(consServiceIS);

  const relationParentescoIS = {
    relationParentescoName: { key: "name", val: "", title: "Nombre", maxLength:150, readOnly:true, type:'input', id:"relationParentescoName" },
    relationParentescoTipoDoc: { key: "tipoDoc", val: "", title: "Tipo de documento de identidad", id: "relationParentescoTipoDoc",type:'select' },
    relationParentescoRut: { key: "rut", val: "", title: "Documento de Identidad", maxLength:20, readOnly:true, type:'input', id:"relationParentescoRut" },
    relationParentescoPosition: { key: "position", val: "", title: "Cargo", id: "relationParentescoPosition", type:'select' },
    relationParentescoRelationship: { key: "relationship", val: "", title: "Parentesco", id: "relationParentescoRelationship", type:'select' },
    relationParentescoPositionTrab: { key: "positionTrab", val: "", title: "Cargo Ocupado en La Empresa", id: "relationParentescoPositionTrab", type:'select' },
    relationParentescoCompanyName: { key: "companyName", val: "", title: "Empresa Relacionada Cliente", id: "relationParentescoCompanyName", type:'select' },
    relationParentescoNameTrab: { key: "nameTrab", val: "", title: "Nombre de la persona en La Empresa", maxLength:150, readOnly:true, type:'input', id:"relationParentescoNameTrab" },
    relationParentescoTipoDocTrab: { key: "tipoDocTrab", val: "", title: "Tipo de documento de identidad de la persona", id: "relationParentescoTipoDocTrab", type:'select' },
    relationParentescoRutTrab: { key: "rutTrab", val: "", title: "Documento de identidad de la persona en La Empresa", maxLength:20, readOnly:true, type:'input', id:"relationParentescoRutTrab" },
  }
  const [relationParentesco, setRelationParentesco] = useState(relationParentescoIS);

  const relPartsIS = {
    relPartsCompany: { key: "company", id: "relPartsCompany", val: "" , title:"Empresa Relacionada Cliente", type:'select' },
    relPartsDescription: { key: "description", id:"relPartsDescription",  val: "", maxLength:500, readOnly:true, title:"Descripción de la situación",  },
  }
  const [relParts, setRelParts] = useState(relPartsIS);

  const relPartsCompaniesIS = {
    relPartsCompanies: "",
  }
  const [relPartsCompanies, setRelPartsCompanies] = useState(relPartsCompaniesIS);

  const laboralIS = {
    laboralName: { key: "name", val: "", title: "Nombre", maxLength:150, readOnly:true, id:"laboralName" },
    laboralTipoDoc: { key: "tipoDoc", val: "", title: "Tipo de documento de identidad", id: "laboralTipoDoc", type:'select' },
    laboralRut: { key: "rut", val: "", title: "Documento de Identidad", maxLength:20, readOnly:true, id:"laboralRut" },
    laboralPosition: { key: "position", val: "", title: "Cargo Ejercido", maxLength:150, readOnly:true, id:"laboralPosition" },
    laboralCompanyName: { key: "companyName", val: "", title: "Empresa Relacionada Cliente", id: "laboralCompanyName", type:'select' },
    laboralEndDate: { key: "endDate", val: null, title: "Fecha de Salida", id: "laboralEndDate", type:'date', required:false },
  }
  const [laboral, setLaboral] = useState(laboralIS);

  const propInteresIS = {
    propInteresName: { key: "name", val: "", title: "Nombre", maxLength:255, readOnly:true, id:"propInteresName" },
    propInteresTipoDoc: { key: "tipoDoc", val: "", title: "Tipo de documento de identidad", id: "propInteresTipoDoc", type:'select' },
    propInteresRut: { key: "rut", val: "", title: "Documento de Identidad", maxLength:20, readOnly:true, id:"propInteresRut" },
    propInteresDescription: { key: "description", val: "", title: "Descripción de la Situación", maxLength:500, readOnly:true, id:"propInteresDescription" },
  }
  const [propInteres, setPropInteres] = useState(propInteresIS);

  const relationPepIS = {
    relationPepName: { key: "field2", val: "", title: "Nombre", maxLength:255, readOnly:true, id:"relationPepName" },
    relationPepTipoDoc: { key: "field3", val: "", title: "Tipo de documento de identidad", id: "relationPepTipoDoc", type:'select' },
    relationPepRut: { key: "field4", val: "", title: "Documento de Identidad", maxLength:20, readOnly:true, id:"relationPepRut" },
    relationPepCategory: { key: "field5", val: "", title: "Categoría", id: "relationPepCategory", type:'select'  },
    relationPepInstitution: { key: "field6", val: "", title: "Institución u Organismo Público", maxLength:300, readOnly:true, type:'input', id:"relationPepInstitution" },
    relationPepPosition: { key: "field7", val: "", title: "Cargo ejercido en el organismo Publico", maxLength:300, readOnly:true, type:'input', id:"relationPepPosition" },
    relationPepEndDate: { key: "field8", val: null, title: "Fecha de Término", id: "relationPepEndDate", type:'date', required:false },
    relationPepPositionCompany: { key: "field9", val: "", title: "Cargo", id: "relationPepPositionCompany", type:'select'  },
  }
  const [relationPep, setRelationPep] = useState(relationPepIS);

  const penalRespIS = {
    penalRespName: { key: "name", val: "", title: "Nombre", maxLength:255, readOnly:true, id:"penalRespName" },
    penalRespTipoDoc: { key: "tipoDoc", val: "", title: "Tipo de documento de identidad", id: "penalRespTipoDoc", type:'select' },
    penalRespRut: { key: "rut", val: "", title: "Documento de Identidad", maxLength:20, readOnly:true, id:"penalRespRut" },
    penalRespDescription: { key: "description", val: "", title: "Descripción de la Situación", maxLength:500, readOnly:true, id:"penalRespDescription" },
  }
  const [penalResp, setPenalResp] = useState(penalRespIS);

  const relationOtrosIS = {
    relationOtrosDescripcion: "",
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
    if (Object.keys(stateObject)[0].startsWith('prov')) {
        setRelationProveedor(stateCopy)
    }
    if (Object.keys(stateObject)[0].startsWith('cons')) {
      setConsService(stateCopy)
    }
    if (Object.keys(stateObject)[0].startsWith('relationParentesco')) {
      setRelationParentesco(stateCopy)
    }
    if (Object.keys(stateObject)[0].startsWith('relParts')) {
      setRelParts(stateCopy)
    }
    if (Object.keys(stateObject)[0].startsWith('laboral')) {
      setLaboral(stateCopy)
    }
    if (Object.keys(stateObject)[0].startsWith('propInteres')) {
      setPropInteres(stateCopy)
    }
    if (Object.keys(stateObject)[0].startsWith('relationPep')) {
      setRelationPep(stateCopy)
    }
    if (Object.keys(stateObject)[0].startsWith('penalResp')) {
      setPenalResp(stateCopy)
    }
    validateFields(Object.keys(stateObject))
  }

  const doTests = ()=>{
    setTimeout(()=>{
      testLength(relationProveedor,1)
      testLength(consService,1)
      testLength(relationParentesco,1)
      testLength(relParts,1)
      testLength(laboral,1)
      testLength(propInteres,1)
      testLength(relationPep,1)
      testLength(penalResp,1)
      testLengthBaseParams(1)
    },1000)
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
        setUser(response.data.recipient.request.createUser);
        setSmuProv(response.data.recipient.record.nombre);
        setSmuClient(response.data.recipient.request.createUser.cliente.name);

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

    // doTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   validateFields(["provRut","provIndCompanyRut"]);
  // }, [relationProveedor]);

  // useEffect(() => {
  //   validateFields(["consServiceRut","consServiceConsRut"]);
  // }, [consService]);

  // useEffect(() => {
  //   validateFields(["relationParentescoRut","relationParentescoRutTrab"]);
  // }, [relationParentesco]);

  // useEffect(() => {
  //   validateFields(["laboralRut"]);
  // }, [laboral]);

  // useEffect(() => {
  //   validateFields(["propInteresRut"]);
  // }, [propInteres]);

  // useEffect(() => {
  //   validateFields(["relationPepRut"]);
  // }, [relationPep]);

  // useEffect(() => {
  //   validateFields(["penalRespRut"]);
  // }, [penalResp]);

  const saveFormCDIprovPromiseLocal = async (form) => {
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



  const hancleOnChangeRadioButton = async (field, value) => {
    let formToUpdate = { ...apiForm, [field]: value };
    let ret = await saveFormCDIprovPromiseLocal(formToUpdate);
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
    let idForm = formId ? formId : match.params.id;  

    e.preventDefault();

    setIsValidate(true);
    setValidarRegistros(true);

    validateFields([
      "name",
      "tipoDoc",
      "rut",
      "cargo",
      "phone",
      "email",
      "comAddress",
      "giro",
      "isRepLegal",
      "hasRelProvCont",
      "hasConsService",
      "hasRelRelationship",
      "hasRelParts",
      "hasRelLabAnt",
      "hasPropInteres",
      "hasRelPepFp",
      "hasPenalResp",
      "hasOthersCDI",
    ]);

    if (apiForm.hasRelProvCont && apiForm.relProvCont.length === 0) {
      validateFields(Object.keys(relationProveedor));
      registersStop = { ...registersStop, relProvCont: true };
    }

    if (apiForm.hasConsService && apiForm.consService.length === 0) {
      validateFields(Object.keys(consService));
      registersStop = { ...registersStop, consService: true };
    }

    if (apiForm.hasRelRelationship && apiForm.relRelationship.length === 0) {
      validateFields(Object.keys(relationParentesco));
      registersStop = { ...registersStop, relRelationship: true };
    }

    if (apiForm.hasRelParts && apiForm.relParts.length === 0) {
      validateFields(Object.keys(relParts));
      registersStop = { ...registersStop, relParts: true };
    }

    if (apiForm.hasRelLabAnt && apiForm.relLabAnt.length === 0) {
      validateFields(Object.keys(laboral));
      registersStop = { ...registersStop, relLabAnt: true };
    }

    if (apiForm.hasPropInteres && apiForm.propInteres.length === 0) {
      validateFields(Object.keys(propInteres));
      registersStop = { ...registersStop, propInteres: true };
    }

    if (getRadioButtonValue('PEP') && getFilteredRegistersByType('PEP').length === 0) {
      validateFields(Object.keys(relationPep));
      registersStop = { ...registersStop, relPepFp: true };
    }
    if (apiForm.hasPenalResp && apiForm.penalResp.length === 0) {
      validateFields(Object.keys(penalResp));
      registersStop = { ...registersStop, penalResp: true };
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
          {getFieldDecorator(formItem.name, {
            rules: formItem.rules,
            initialValue: formItem.initialValue,
            validateTrigger: "onChange",
          })(formItem.item)}
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


const renderFormItemIntro = ({section, initialValue, type = 'input', options = []})=>{
  const required = "required" in section ? section.required : true
  return (
    <Form.Item className="introduction-item">
    {getFieldDecorator(section.id, {
      initialValue: initialValue,
      rules: [
        { required: required, message: t("messages.aml.requestedField"), },
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
            onChange={(momentObj) => handleOnChangeIntro( section, momentObj ? moment(momentObj).format( "DD/MM/YYYY" ) : null ) }
          />
          : type === 'select' ?
            <Select
              onChange={(value) => handleOnChangeIntro(section, value) }
            >
              { options.map((option) => (<Select.Option value={option.val}>{ option.text }</Select.Option>)) }
            </Select>
            :
            <Input
              autoComplete="off"
              onFocus= {(e)=>handleReadOnly(e.target.id,false)}
              onBlur= {(e)=>handleReadOnly(e.target.id,true)}
              readOnly = {section.readOnly}
              placeholder="Ingrese el cargo que ocupa"
              onChange={(e) => handleOnChangeIntro( section, e.target.value ) }
            />
      ) : (
        <Input />
      )
    )}
  </Form.Item>
  )
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
  let ret = await saveFormCDIprovPromiseLocal(formToUpdate);
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
    saveFormCDIprovPromiseLocal(formToUpdate);
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
    saveFormCDIprovPromiseLocal(apiForm).then(ret => {
      if(ret.success) handleOnClear(sectionId)
    });
  });
  registersStop[sectionId] = false;
};








  const handleOnAddRelationProveedor = () => {
    setIsValidate(true);
    validateFields(Object.keys(relationProveedor)).then((error, values) => {
      const relationProveedorOk = Object.keys(relationProveedor).reduce(
        (acc, e) => {
          return { ...acc, [relationProveedor[e].key]: relationProveedor[e].val, };
        },
        {}
      );
      apiForm.relProvCont.push({ ...relationProveedorOk });
      saveFormCDIprovPromiseLocal(apiForm).then(ret => {
        if(ret.success) handleOnClear('relationProveedor')
      });
    });
    registersStop.relProvCont = false;
  };

  const handleDeleteRelationProveedor = (index) => {
    return () => {
      let xx = [...apiForm.relProvCont];
      xx.splice(index, 1);
      let formToUpdate = { ...apiForm, relProvCont: xx };
      saveFormCDIprovPromiseLocal(formToUpdate);
    };
  };



  const handleOnAddConsService = () => {
    setIsValidate(true);
    validateFields(Object.keys(consService)).then((error, values) => {
      const consServiceOk = Object.keys(consService).reduce((acc, e) => {
        return {
          ...acc,
          [consService[e].key]: consService[e].val,
        };
      }, {});
      apiForm.consService.push({ ...consServiceOk });
      saveFormCDIprovPromiseLocal(apiForm).then(ret => {
        if(ret.success) handleOnClear('consService')
      });
    });
    registersStop.consService = false;
  };

  const handleDeleteConsService = (index) => {
    return () => {
      let xx = [...apiForm.consService];
      xx.splice(index, 1);
      let formToUpdate = { ...apiForm, consService: xx };
      saveFormCDIprovPromiseLocal(formToUpdate);
    };
  };



  const handleOnAddRelParts = () => {
    setIsValidate(true);
    validateFields(Object.keys(relParts)).then((error, values) => {
      const relPartsOk = Object.keys(relParts).reduce((acc, e) => {
        return { ...acc, [relParts[e].key]: relParts[e].val, };
      }, {});
      apiForm.relParts.push({ ...relPartsOk });
      saveFormCDIprovPromiseLocal(apiForm).then(ret => {
        if(ret.success) handleOnClear('relParts')
      });
    });
    registersStop.relParts = false;
  };

  const handleDeleteRelParts = (index) => {
    return () => {
      let xx = [...apiForm.relParts];
      xx.splice(index, 1);
      let formToUpdate = { ...apiForm, relParts: xx };
      saveFormCDIprovPromiseLocal(formToUpdate);
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
        saveFormCDIprovPromiseLocal(apiForm).then(ret => {
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
      saveFormCDIprovPromiseLocal(formToUpdate);
    };
  };


  const handleOnAddPropInteres = () => {
    setIsValidate(true);

    validateFields(Object.keys(propInteres))
      .then((error, values) => {
        const propInteresOk = Object.keys(propInteres).reduce((acc, e) => {
          return { ...acc, [propInteres[e].key]: propInteres[e].val };
        }, {});

        apiForm.propInteres.push({ ...propInteresOk });
        saveFormCDIprovPromiseLocal(apiForm).then(ret => {
          if(ret.success) handleOnClear('propInteres')
        });
      })
      .catch((error) => {});
    registersStop.propInteres = false;
  };

  const handleDeletePropInteres = (index) => {
    return () => {
      let xx = [...apiForm.propInteres];
      xx.splice(index, 1);
      let formToUpdate = { ...apiForm, propInteres: xx };
      saveFormCDIprovPromiseLocal(formToUpdate);
    };
  };


  const handleOnAddPenalResp = () => {
    setIsValidate(true);

    validateFields(Object.keys(penalResp))
      .then((error, values) => {
        const penalRespOk = Object.keys(penalResp).reduce((acc, e) => {
          return { ...acc, [penalResp[e].key]: penalResp[e].val };
        }, {});

        apiForm.penalResp.push({ ...penalRespOk });
        saveFormCDIprovPromiseLocal(apiForm).then(ret => {
          if(ret.success) handleOnClear('penalResp')
        });
      })
      .catch((error) => {});
    registersStop.penalResp = false;
  };

  const handleDeletePenalResp = (index) => {
    return () => {
      let xx = [...apiForm.penalResp];
      xx.splice(index, 1);
      let formToUpdate = { ...apiForm, penalResp: xx };
      saveFormCDIprovPromiseLocal(formToUpdate);
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
      saveFormCDIprovPromiseLocal(apiForm).then(ret => {
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
      saveFormCDIprovPromiseLocal(formToUpdate);
    };
  };



  const handleOnChangeFieldRelPartsCompanies = (field, value) => {
    setRelPartsCompanies({ ...relPartsCompanies, [field]: value });
  };

  const handleOnAddRelPartsCompanies = () => {
    setIsValidate(true);
    validateFields(Object.keys(relPartsCompanies)).then((error, values) => {

      let  elements = apiForm.relPartsCompanies
      elements.push(relPartsCompanies.relPartsCompanies)
      let formToUpdate = { ...apiForm, relPartsCompanies: elements };
      saveFormCDIprovPromiseLocal(formToUpdate).then(ret => {
        if(ret.success) handleOnClear('relPartsCompanies')
      });

    });
  };

  const handleDeleteRelPartsCompanies = (index) => {
    return () => {
      let xx = [...apiForm.relPartsCompanies];
      xx.splice(index, 1);
      let formToUpdate = { ...apiForm, relPartsCompanies: xx };
      saveFormCDIprovPromiseLocal(formToUpdate);
    };
  };

  const handleOnChangeFieldRelationOtros = (field, value) => {
    setRelationOtros({ ...relationOtros, [field]: value });
  };

  const handleOnAddRelationOtros = () => {
    setIsValidate(true);

    validateFields(Object.keys(relationOtros)).then((error, values) => {
      apiForm.othersCDI.push(relationOtros.relationOtrosDescripcion);
      saveFormCDIprovPromiseLocal(apiForm).then(ret => {
        if(ret.success) handleOnClear('relationOtros')
      });
    });
  };

  const handleDeleteRelationOtros = (index) => {
    return () => {
      let xx = [...apiForm.othersCDI];
      xx.splice(index, 1);
      let formToUpdate = { ...apiForm, othersCDI: xx };
      saveFormCDIprovPromiseLocal(formToUpdate);
    };
  };

  //const relation = [{nombreEmpresa:'gesintel',tipoEmpresa:'limitada'}]

  const relationProveedorColumns = [
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
      dataIndex: "companyPosition",
    },
    {
      title: "Empresa Relacionada Cliente",
      dataIndex: "companyName",
    },
    {
      title: "Cargo en la Empresa",
      dataIndex: "position",
    },
    {
      title: "Tipo de Propiedad",
      dataIndex: "propertyType",
    },
    {
      title: "Porcentaje de Participación",
      dataIndex: "percentage",
    },

    match.params.view === undefined || match.params.view === "html"
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
      title: "Nombre",
      dataIndex: "name",
    },
    {
      title: "Documento",
      dataIndex: "rut",
    },
    {
      title: "Cargo Ejercido",
      dataIndex: "position",
    },
    {
      title: "Empresa Relacionada Cliente",
      dataIndex: "companyName",
    },
    {
      title: "Fecha de Salida ",
      dataIndex: "endDate",
      render: (text, record, index) => moment(text).format("DD-MM-YYYY"),
    },
    match.params.view === undefined || match.params.view === "html"
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

  const propInteresColumns = [
    {
      title: "Nombre",
      dataIndex: "name",
    },
    {
      title: "Documento",
      dataIndex: "rut",
    },
    {
      title: "Descripción de la Situación",
      dataIndex: "description",
    },
    match.params.view === undefined || match.params.view === "html"
      ? {
          title: "Acción",
          dataIndex: "",
          key: "x",
          width: "8%",
          render: (text, record, index) => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a onClick={handleDeletePropInteres(index)}>
              <Icon type="delete" />
            </a>
          ),
        }
      : {},
  ];

  const penalRespColumns = [
    {
      title: "Nombre",
      dataIndex: "name",
    },
    {
      title: "Documento",
      dataIndex: "rut",
    },
    {
      title: "Descripción de la Situación",
      dataIndex: "description",
    },
    match.params.view === undefined || match.params.view === "html"
      ? {
          title: "Acción",
          dataIndex: "",
          key: "x",
          width: "8%",

          render: (text, record, index) => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a onClick={handleDeletePenalResp(index)}>
              <Icon type="delete" />
            </a>
          ),
        }
      : {},
  ];

  const consServiceColumns = [
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
      title: "Nombre Empresa Asesora",
      dataIndex: "consCompany",
    },
    {
      title: "Documento Empresa Asesora",
      dataIndex: "consRut",
    },
    {
      title: "Tipo de Servicios",
      dataIndex: "type",
    },
    {
      title: "Empresa Relacionada Cliente",
      dataIndex: "company",
    },
    match.params.view === undefined || match.params.view === "html"
      ? {
          title: "Acción",
          dataIndex: "",
          key: "x",

          render: (text, record, index) => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a onClick={handleDeleteConsService(index)}>
              <Icon type="delete" />
            </a>
          ),
        }
      : {},
  ];

  const relPartsColumns = [
    {
      title: "Empresa Relacionada Cliente",
      dataIndex: "company",
    },
    {
      title: "Descripción de la situación",
      dataIndex: "description",
    },

    match.params.view === undefined || match.params.view === "html"
      ? {
          title: "Acción",
          dataIndex: "",
          key: "x",
          width: "8%",
          render: (text, record, index) => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a onClick={handleDeleteRelParts(index)}>
              <Icon type="delete" />
            </a>
          ),
        }
      : {},
  ];

  const relationParentescoColumns = [
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
      title: "Parentesco",
      dataIndex: "relationship",
    },
    {
      title: "Cargo Ocupado en La Empresa",
      dataIndex: "positionTrab",
    },
    {
      title: "Empresa Relacionada Cliente",
      dataIndex: "companyName",
    },
    {
      title: "Nombre de la Persona en La Empresa",
      dataIndex: "nameTrab",
    },
    match.params.view === undefined || match.params.view === "html"
      ? {
          title: "Acción",
          dataIndex: "",
          key: "x",
          width: "8%",
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

  const relPartsCompaniesColumns = () => {
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
        width: "8%",
        render: (text, record, index) => (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a onClick={handleDeleteRelPartsCompanies(index)}>
            <Icon type="delete" />
          </a>
        ),
      });
    }

    return columns;
  };

  const relationOtrosColumns = () => {
    let columnsx = [
      {
        title: "Descripción de la situación",
        dataIndex: "",
        render: (text, record, index) => {
          return record;
        },
      },
    ];

    if (format === "html") {
      columnsx.push({
        title: "Acción",
        dataIndex: "",
        width: "8%",
        render: (text, record, index) => (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a onClick={handleDeleteRelationOtros(index)}>
            <Icon type="delete" />
          </a>
        ),
      });
    }
    return columnsx;
  };

  const rutValidator = (rule, value, cb) => {
    if (value && !validateRutHelper(value)) {
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

  const rutValidatorCompany = (rule, value, cb) => {
    if (value && !validateCompanyRutHelper(value)) {
      cb("Documento no válido");
    }
    cb();
  };

  return (
    <FormLayout
      currentUser={{ userId: user.id, subclienteId }}
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
                  (!isValidate ? " form-validate-messages" : "")
                }
              >
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
                      <h3>DECLARACIÓN DE CONFLICTO DE INTERÉS PROVEEDORES</h3>
                    </Col>
                    <Col
                      className="logo-col"
                      xs={colLogo}
                      sm={colLogo}
                      md={colLogo}
                      lg={colLogo}
                      xl={colLogo}
                    >
                      <Logo currentUser={{ userId: user.id, subclienteId }} />
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
                  {apiForm.status === "SENT" &&
                  (match.params.view === undefined ||
                    match.params.view === "html") ? (
                    <>
                      <br />
                      <h3 style={{ textAlign: "center" }}>
                        Estimado {/* {apiForm.recipient.record.nombre} */}
                        {apiForm.name}
                        , le informamos que su declaración fue correctamente
                        completada, agradecemos su tiempo y disposición.
                        <br />
                        Hemos enviado una copia de la declaración realizada al
                        mail registrado:
                        {/* {apiForm.recipient.record.email} */}
                        {apiForm.email}
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
                        <Col xl={24}>
                          DATOS DE LA PERSONA QUE COMPLETA LA DECLARACIÓN{" "}
                        </Col>
                      </Row>
                      <Row className="content">
                        <Row className="summary">
                          <Col xl={24}>
                            A continuación, por favor complete los datos
                            solicitados
                          </Col>
                        </Row>

                        <Row className="inner-row" gutter={[16, 8]}>
                          {renderFormItem({
                            label: "Nombre",
                            name: baseParamsIS.name.id,
                            colClassName: "topLabel",
                            labelCol: 0,
                            wrapperCol: 0,
                            initialValue: apiForm.name,
                            rules: [
                              {
                                required: true,
                                message: t("messages.aml.requestedField"),
                              },
                              validateLengthFieldWithInnerLength(baseParamsIS.name)
                            ],
                            wrapperCols: 8,
                            item: (
                              <Input
                                autoComplete="off"
                                onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                readOnly = {baseParams.name.readOnly}
                                onChange={(e) =>
                                  handleOnChangeIntro(baseParamsIS.name, e.target.value)
                                }
                              />
                            ),
                          })}
                           {renderFormItem({
                            label: "Tipo de documento de identidad",
                            name: baseParamsIS.tipoDoc.id,

                            colClassName: "topLabel",
                            labelCol: 0,
                            wrapperCol: 0,
                            initialValue: apiForm.tipoDoc,
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
                              format === "html" ? (
                              <Select
                                onChange={(value) =>
                                  handleOnChangeIntro(baseParamsIS.tipoDoc, value)
                                }
                                // value={apiForm.reunion.type}
                              >
                                <Select.Option key="1" value="Chile-Rut">
                                  Chile-Rut
                                </Select.Option>
                                <Option key="2" value="Otros">
                                  Otros
                                </Option>
                              </Select>):(
                                <Input/>
                              )
                            ),
                          })}

                          {renderFormItem({
                            label: "Documento de Identidad",
                            name: baseParamsIS.rut.id,
                            initialValue: apiForm.rut,
                            colClassName: "topLabel",
                            labelCol: 0,
                            wrapperCol: 0,
                            rules: [
                              {
                                required: true,
                                message: t("messages.aml.requestedField"),
                              },
                              { validator: docValidator(apiForm.tipoDoc) },
                              validateLengthFieldWithInnerLength(baseParamsIS.rut)
                            ],
                            wrapperCols: 8,
                            item: (
                              <Input
                                autoComplete="off"
                                onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                readOnly = {baseParams.rut.readOnly}
                                onChange={(e) =>
                                  handleOnChangeIntro(baseParamsIS.rut, e.target.value)
                                }
                              />
                            ),
                          })}
                        </Row>

                        <Row className="inner-row" gutter={[16, 8]}>


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
                                message: t("messages.aml.requestedField"),
                              },
                              validateLengthFieldWithInnerLength(baseParamsIS.cargo)
                            ],
                            wrapperCols: 8,
                            item: (
                              <Input
                                autoComplete="off"
                                onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                readOnly = {baseParams.cargo.readOnly}
                                onChange={(e) =>
                                  handleOnChangeIntro(baseParamsIS.cargo, e.target.value)
                                }
                              />
                            ),
                          })}
                          {renderFormItem({
                            label: "Teléfono",
                            name: baseParamsIS.phone.id,
                            initialValue: apiForm.phone,
                            colClassName: "topLabel",
                            labelCol: 0,
                            wrapperCol: 0,
                            rules: [
                              {
                                required: true,
                                message: t("messages.aml.requestedField"),
                              },
                              validateLengthFieldWithInnerLength(baseParamsIS.phone)
                              // {
                              //   min: 9,
                              //   message: "se requieren al menos 9 dígitos",
                              // },
                            ],
                            wrapperCols: 8,
                            item: (
                              <Input
                              autoComplete="off"
                              onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                              onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                              readOnly = {baseParams.phone.readOnly}
                                // autoComplete="nope"
                                onChange={(e) =>
                                  handleOnChangeIntro(baseParamsIS.phone, e.target.value)
                                }
                              />
                            ),
                          })}

                          {renderFormItem({
                            label: "Mail",
                            name: baseParamsIS.email.id,
                            initialValue: apiForm.email,
                            colClassName: "topLabel",
                            labelCol: 0,
                            wrapperCol: 0,
                            rules: [
                              {
                                required: true,
                                message: t("messages.aml.requestedField"),
                              },
                              validateLengthFieldWithInnerLength(baseParamsIS.email)
                              // {
                              //   type: "email",
                              //   message: t("messages.aml.dontForgetEmail"),
                              // },
                            ],
                            wrapperCols: 8,
                            item: (
                              <Input
                                autoComplete="off"
                                onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                readOnly = {baseParams.email.readOnly}
                                onChange={(e) =>
                                  handleOnChangeIntro(baseParamsIS.email, e.target.value)
                                }
                              />
                            ),
                          })}
                        </Row>

                        <Row className="inner-row" gutter={[16, 8]}>


                          {renderFormItem({
                            label: "¿Es representante legal?  ",
                            name: baseParamsIS.isRepLegal.id,

                            colClassName: "topLabel",
                            labelCol: 0,
                            wrapperCol: 0,
                            initialValue: format === 'html' ? apiForm.isRepLegal:
                            apiForm.isRepLegal ? 'Sí':'No',
                            rules: [
                              {
                                required: true,
                                message: t("messages.aml.requestedField"),
                              },
                            ],
                            wrapperCols: 8,
                            item: (
                              format === "html" ? (
                              <Select
                                onChange={(value) =>
                                  handleOnChangeIntro(baseParamsIS.isRepLegal, value)
                                }
                              >
                                <Select.Option key={2} value={true} >
                                  Sí
                                </Select.Option>
                                <Option key={3} value={false}>
                                  No
                                </Option>
                              </Select>):(
                                <Input/>
                              )
                            ),
                          })}
                        </Row>

                        {!apiForm.isRepLegal &&
                          apiForm.isRepLegal !== null &&
                          apiForm.isRepLegal !== undefined &&
                          apiForm.isRepLegal !== "No" && (
                            <Row className="summary">
                              <Col xl={24}>
                                El representante legal se encuentra en pleno
                                conocimiento y ha autorizado expresamente que mi
                                persona complete en su nombre y de la empresa la
                                presente declaración, haciéndome plenamente
                                responsable de lo declarado y de la veracidad de
                                la información proporcionada.
                              </Col>
                            </Row>
                          )}

                        <br />
                      </Row>{" "}
                      {/*end of content row:  DATOS DE LA PERSONA QUE COMPLETA LA DECLARACIÓN */}
                      <Row className="subheader" style={{ marginTop: "0px" }}>
                        <Col xl={24}>INTRODUCCIÓN </Col>
                      </Row>
                      <Row className="summary">
                        <Col xl={24}>
                          {" "}
                          Yo <strong>{apiForm.name}</strong>, cédula nacional de
                          identidad N° <strong>{apiForm.rut}</strong>, con
                          domicilio en{" "}
                          {
                            <Form.Item
                              className="introduction-item"
                              style={{ width: "500px" }}
                            >
                              {getFieldDecorator(baseParamsIS.comAddress.id, {
                                initialValue: apiForm.comAddress,
                                rules: [
                                  {
                                    required: true,
                                    message: t("messages.aml.requestedField"),
                                  },
                                  validateLengthFieldWithInnerLength(baseParamsIS.comAddress)

                                ],
                              })(
                                <Input
                                  autoComplete="off"
                                  onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                  onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                  readOnly = {baseParams.comAddress.readOnly}
                                  placeholder="Dirección Comercial"
                                  onChange={(e) => handleOnChangeIntro(baseParamsIS.comAddress, e.target.value ) }
                                />
                              )}
                            </Form.Item>
                          }
                          , compareciendo en este acto personalmente y en
                          representación de{" "}
                          <strong>{apiForm.recipient.record.nombre}</strong>,
                          sociedad del giro{" "}
                          {
                            <Form.Item
                              className="introduction-item"
                              style={{ width: "300px" }}
                            >
                              {getFieldDecorator(baseParamsIS.giro.id, {
                                initialValue: apiForm.giro,
                                rules: [
                                  {
                                    required: true,
                                    message: t("messages.aml.requestedField"),
                                  },
                                  validateLengthFieldWithInnerLength(baseParamsIS.giro)
                                ],
                              })(
                                <Input
                                  autoComplete="off"
                                  onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                  onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                  readOnly = {baseParams.giro.readOnly}
                                  placeholder="Ingrese Giro"
                                  onChange={(e) =>
                                    handleOnChangeIntro(baseParamsIS.giro, e.target.value)
                                  }
                                />
                              )}
                            </Form.Item>
                          }
                          , R.U.T. N°{" "}
                          <strong>{apiForm.recipient.record.rut}</strong> de mí
                          mismo domicilio, declaro bajo juramento que toda la
                          información proporcionada en la presente Declaración
                          Jurada, es del todo exacta, fehaciente y verdadera
                          hasta donde tengo conocimiento y que no he omitido
                          ningún tipo de información que pudiese ser relevante o
                          pudiese producir un Conflicto de Interés para con{" "}
                          <strong>{smuClient}</strong>, asumiendo desde ya, las
                          responsabilidades que sean procedentes y que me
                          corresponderían en caso de falsedad o inexactitud de
                          esta Declaración Jurada. Se incluye dentro del
                          concepto <strong>{smuClient}</strong> a todas aquellas
                          sociedades relacionadas, de acuerdo al artículo 100 de
                          la Ley N° 18.045 y que en adelante serán identificadas
                          con el nombre <strong>"La Empresa"</strong>.
                          <br />
                          <br />
                          Por consiguiente, tengo la obligación permanente de
                          actualizar la presente declaración de conflictos de
                          interés por este medio, dando aviso a{" "}
                          <strong>{smuClient}</strong>, en el evento que se
                          originen cambios, tan pronto ocurran o tome
                          conocimiento de ellos.
                        </Col>
                      </Row>
                      <Row className="subheader">
                        <Col xl={24}>
                          I. PARTICIPACIÓN SOCIAL O PERTENENCIA A UN DIRECTORIO
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col span={21}>
                          Declaro que tengo conocimiento de que algún director,
                          gerente, ejecutivo principal o administrador de{" "}
                          <strong>{smuProv}</strong>, posee una participación
                          social directa y/o indirecta, u ocupa el cargo de
                          director, en La Empresa{" "}
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
                      {apiForm.hasRelProvCont !== null &&
                        apiForm.hasRelProvCont && (
                          <div className="content">
                            {(match.params.view === undefined ||
                              match.params.view === "html") && (
                              <>
                                <Row className="inner-row" gutter={[16, 8]}>
                                  {renderFormItemTable({
                                    section: relationProveedor.provName,
                                  })}
                                  {renderFormItemTable({
                                    section: relationProveedor.provTipoDoc,
                                    options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                  })}

                                  {renderFormItemTable({
                                    section: relationProveedor.provRut,
                                    validator: docValidator( relationProveedor.provTipoDoc.val )
                                  })}
                                </Row>

                                <Row className="inner-row" gutter={[16, 8]}>
                                  {renderFormItemTable({
                                    section: relationProveedor.provCompanyPosition,
                                    options:
                                    [
                                      { val: "Director", text: "Director" },
                                      { val: "Gerente", text: "Gerente" },
                                      { val: "Ejecutivo Principal", text: "Ejecutivo Principal" },
                                      { val: "Administrador", text: "Administrador" },
                                    ],
                                  })}
                                  {renderFormItemTable({
                                    section: relationProveedorIS.provCompanyName,
                                    options: params.empresas&&params.empresas.length > 0 ? params.empresas.map(empresa => ({val:empresa, text:empresa})):[]
                                  })}
                                  {renderFormItemTable({
                                    section: relationProveedor.provPosition,
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
                                    })}
                                  {(relationProveedor.provPosition.val === "Accionista" || relationProveedor.provPosition.val === "Propietario") &&
                                    renderFormItemTable({
                                      section: relationProveedor.provPercentage,
                                    })}
                                  {(relationProveedor.provPosition.val === "Accionista" || relationProveedor.provPosition.val === "Propietario") && relationProveedor.provPropertyType.val === "Indirecta" &&
                                    renderFormItemTable({
                                      section: relationProveedor.provIndCompanyName,
                                    })}
                                </Row>
                                <Row className="inner-row" gutter={[16, 8]}>
                                  {(relationProveedor.provPosition.val === "Accionista" || relationProveedor.provPosition.val === "Propietario") && relationProveedor.provPropertyType.val === "Indirecta" &&
                                    renderFormItemTable({
                                      section: relationProveedor.provIndCompanyTipoDoc,
                                      options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                  })}
                                  {(relationProveedor.provPosition.val === "Accionista" || relationProveedor.provPosition.val === "Propietario") && relationProveedor.provPropertyType.val === "Indirecta" &&
                                    renderFormItemTable({
                                      section: relationProveedor.provIndCompanyRut,
                                      validator: docValidator( relationProveedor.provIndCompanyTipoDoc.val,true ),
                                    })}
                                </Row>

                                <Row className="button-row">
                                  {apiForm.relProvCont.length < 1 && validarRegistros && apiForm.hasRelProvCont && (
                                      <Col
                                        span={24}
                                        className="missing-registers ant-form-explain"
                                      >
                                        {t("messages.aml.registersRequired")}
                                      </Col>
                                  )}
                                  <Col className="addRelation" xl={3}>
                                    <Button type="primary" htmlType="button" onClick={handleOnAddRelationProveedor} icon="plus" > Añadir </Button>
                                  </Col>
                                  <Col className="addRelation" xl={3}>
                                    <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('relationProveedor')} > Limpiar </Button>
                                  </Col>
                                </Row>
                              </>
                            )}

                            {apiForm.relProvCont !== null && apiForm.relProvCont !== undefined && apiForm.relProvCont.length > 0 && format === "html" ? (
                              <Table columns={relationProveedorColumns} dataSource={apiForm.relProvCont} size="middle" pagination={false} ></Table>
                            ) : (
                              toDescriptionsPdf( apiForm.relProvCont, relationProveedor )
                            )}

                            <Row className="summary">
                              <Col xl={24}>
                                Así mismo si uno de los cónyuges, o convivientes
                                civiles o parientes hasta el segundo grado de
                                consanguinidad o afinidad de algún director,
                                gerente, ejecutivo principal o administrador de{" "}
                                <strong>{smuProv}</strong> también posee una
                                relación, debe ser informado y agradecemos
                                realizarlo a continuación:
                              </Col>
                            </Row>

                            <div className="content">
                              <Row className="inner-row" gutter={[16, 8]}>
                                {renderFormItem({
                                  label: "",
                                  name: baseParamsIS.relationshipPart.id,
                                  initialValue: apiForm.relationshipPart,
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
                                    validateLengthFieldWithInnerLength(baseParamsIS.relationshipPart)
                                  ],
                                  wrapperCols: 24,
                                  item: (
                                    <Input
                                      autoComplete="off"
                                      onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                      onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                      readOnly = {baseParams.relationshipPart.readOnly}
                                      disabled={false}
                                      onChange={(e) => handleOnChangeIntro(baseParamsIS.relationshipPart, e.target.value ) }
                                    />
                                  ),
                                })}
                              </Row>
                            </div>
                          </div>
                        )}
                      <Row className="subheader">
                        <Col xl={24}>
                          II. SERVICIOS DE ASESORÍA Y/O CONSULTORÍA
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col span={21}>
                          Declaro que tengo conocimiento de que algún director,
                          gerente, ejecutivo principal o administrador de{" "}
                          <strong>{smuProv}</strong>, presta servicios de
                          asesoría y/o consultoría a <strong>La Empresa</strong>{" "}
                        </Col>

                        {renderFormItem({
                          label: "",
                          name: "hasConsService",
                          initialValue:
                            apiForm.hasConsService !== null
                              ? apiForm.hasConsService
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
                                  "hasConsService",
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
                      {apiForm.hasConsService !== null &&
                        apiForm.hasConsService && (
                          <div className="content">
                            {(match.params.view === undefined || match.params.view === "html") && (
                              <>
                                <Row className="inner-row" gutter={[16, 8]}>
                                  {renderFormItemTable({
                                    section: consService.consServiceName,
                                  })}
                                  {renderFormItemTable({
                                    section: consService.consServiceTipoDoc,
                                    options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                  })}

                                  {renderFormItemTable({
                                    section: consService.consServiceRut,
                                    validator: docValidator( consService.consServiceTipoDoc.val )
                                  })}

                                </Row>

                                <Row className="inner-row" gutter={[16, 8]}>
                                  {renderFormItemTable({
                                    section: consService.consServicePosition,
                                    options:
                                    [
                                      { val: "Director", text: "Director" },
                                      { val: "Gerente", text: "Gerente" },
                                      { val: "Ejecutivo Principal", text: "Ejecutivo Principal" },
                                      { val: "Administrador", text: "Administrador" },
                                    ],
                                  })}
                                  {renderFormItemTable({
                                    section: consService.consServiceConsCompany,
                                  })}

                                  {renderFormItemTable({
                                    section: consService.consServiceConsTipoDoc,
                                    options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                  })}
                                </Row>
                                <Row className="inner-row" gutter={[16, 8]}>
                                  {renderFormItemTable({
                                    section: consService.consServiceConsRut,
                                    validator: docValidator( consService.consServiceConsTipoDoc.val,true )
                                  })}
                                  {renderFormItemTable({
                                    section: consService.consServiceType,
                                  })}
                                  {renderFormItemTable({
                                    section: consService.consServiceCompanyName,
                                    options: params.empresas&&params.empresas.length > 0 ? params.empresas.map(empresa => ({val:empresa, text:empresa})):[]
                                  })}
                                </Row>
                                <Row className="button-row">
                                  {apiForm.consService.length < 1 && validarRegistros && apiForm.hasConsService && (
                                      <Col
                                        span={24}
                                        className="missing-registers ant-form-explain"
                                      >
                                        {t("messages.aml.registersRequired")}
                                      </Col>
                                    )}

                                  <Col className="addRelation" xl={3}>
                                    <Button type="primary" htmlType="button" onClick={handleOnAddConsService} icon="plus" > Añadir </Button>
                                  </Col>
                                  <Col className="addRelation" xl={3}>
                                    <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('consService')} > Limpiar </Button>
                                  </Col>
                                </Row>
                              </>
                            )}

                            {apiForm.consService !== null && apiForm.consService !== undefined && apiForm.consService.length > 0 && format === "html" ? (
                              <Table columns={consServiceColumns} dataSource={apiForm.consService} size="middle" pagination={false} ></Table>
                            ) : (
                              toDescriptionsPdf( apiForm.consService, consService )
                            )}

                            <Row className="summary">
                              <Col xl={24}>
                                Así mismo si uno de los cónyuges, o convivientes
                                civiles o parientes hasta el segundo grado de
                                consanguinidad o afinidad de algún director,
                                gerente, ejecutivo principal o administrador de{" "}
                                <strong>{smuProv}</strong> también posee una
                                relación, debe ser informado y agradecemos
                                realizarlo a continuación:
                              </Col>
                            </Row>

                            <div className="content">
                              <Row className="inner-row" gutter={[16, 8]}>
                                {renderFormItem({
                                  label: "",
                                  name: baseParamsIS.relationshipConsultancy.id,
                                  initialValue: apiForm.relationshipConsultancy,
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
                                    validateLengthFieldWithInnerLength(baseParamsIS.relationshipConsultancy)
                                  ],
                                  wrapperCols: 24,
                                  item: (
                                    <Input
                                      autoComplete="off"
                                      onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                      onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                      readOnly = {baseParams.relationshipConsultancy.readOnly}
                                      disabled={false}
                                      onChange={(e) => handleOnChangeIntro(baseParamsIS.relationshipConsultancy, e.target.value ) }
                                    />
                                  ),
                                })}
                              </Row>
                            </div>
                          </div>
                        )}
                      <Row className="subheader">
                        <Col xl={24}>III. GRADO DE PARENTESCO</Col>
                      </Row>
                      <Row className="summary">
                        <Col span={21}>
                          Declaro que tengo conocimiento de que algún director,
                          gerente, ejecutivo principal o administrador de{" "}
                          <strong>{smuProv}</strong>, tiene un grado de
                          parentesco con Directores, Gerentes, Socios,
                          Administradores, Ejecutivos Principales de{" "}
                          <strong>La Empresa</strong>
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
                      {apiForm.hasRelRelationship !== null &&
                        apiForm.hasRelRelationship && (
                          <div className="content">
                            {(match.params.view === undefined ||
                              match.params.view === "html") && (
                              <>
                                <Row className="inner-row" gutter={[16, 8]}>
                                  {renderFormItemTable({
                                    section: relationParentesco.relationParentescoName,
                                  })}
                                </Row>
                                <Row className="inner-row" gutter={[16, 8]}>
                                  {renderFormItemTable({
                                    section: relationParentesco.relationParentescoTipoDoc,
                                    options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                  })}
                                  {renderFormItemTable({
                                    section: relationParentesco.relationParentescoRut,
                                    validator: docValidator(relationParentesco .relationParentescoTipoDoc.val )
                                  })}
                                  {renderFormItemTable({
                                    section: relationParentesco.relationParentescoPosition,
                                    options:
                                    [
                                      { val: "Director", text: "Director" },
                                      { val: "Gerente", text: "Gerente" },
                                      { val: "Ejecutivo Principal", text: "Ejecutivo Principal" },
                                      { val: "Administrador", text: "Administrador" },
                                    ],
                                  })}
                                </Row>
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
                                    ],
                                  })}
                                  {renderFormItemTable({
                                    section: relationParentesco.relationParentescoPositionTrab,
                                    options:
                                    [
                                      { val: "Director", text: "Director" },
                                      { val: "Gerente", text: "Gerente" },
                                      { val: "Socio", text: "Socio" },
                                      { val: "Ejecutivo Principal", text: "Ejecutivo Principal" },
                                      { val: "Administrador", text: "Administrador" },
                                    ],
                                  })}

                                  {renderFormItemTable({
                                    section: relationParentesco.relationParentescoCompanyName,
                                    options: params.empresas&&params.empresas.length > 0 ? params.empresas.map(empresa => ({val:empresa, text:empresa})):[]
                                  })}
                                </Row>

                                <Row className="inner-row" gutter={[16, 8]}>
                                  {renderFormItemTable({
                                    section: relationParentesco.relationParentescoNameTrab,
                                  })}
                                  {renderFormItemTable({
                                    section: relationParentesco.relationParentescoTipoDocTrab,
                                    options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                  })}
                                  {renderFormItemTable({
                                    section: relationParentesco.relationParentescoRutTrab,
                                    validator: docValidator(relationParentesco .relationParentescoTipoDocTrab.val )
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
                                    <Button type="primary" htmlType="button" onClick={handleOnAddRelationParentesco} icon="plus" > Añadir </Button>
                                  </Col>
                                  <Col className="addRelation" xl={3}>
                                    <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('relationParentesco')}do > Limpiar </Button>
                                  </Col>
                                </Row>
                              </>
                            )}

                            {apiForm.relRelationship !== null && apiForm.relRelationship !== undefined && apiForm.relRelationship.length > 0 && format === "html" ? (
                              <Table columns={relationParentescoColumns} dataSource={apiForm.relRelationship} size="middle" pagination={false} ></Table>
                            ) : (
                              toDescriptionsPdf( apiForm.relRelationship, relationParentesco
                              )
                            )}

                            <Row className="summary">
                              <>
                                <Col xl={24}>
                                  Así mismo si uno de los cónyuges, o
                                  convivientes civiles o parientes hasta el
                                  segundo grado de consanguinidad o afinidad de
                                  algún director, gerente, ejecutivo principal o
                                  administrador de <strong>{smuProv}</strong>{" "}
                                  también posee una relación, debe ser informado
                                  y agradecemos realizarlo a continuación:
                                </Col>
                              </>
                            </Row>

                            <div className="content">
                              <Row className="inner-row" gutter={[16, 8]}>
                                {renderFormItem({
                                  label: "",
                                  name: baseParamsIS.relationshipDegree.id,
                                  initialValue: apiForm.relationshipDegree,
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
                                    validateLengthFieldWithInnerLength(baseParamsIS.relationshipDegree)
                                  ],
                                  wrapperCols: 24,
                                  item: (
                                    <Input
                                      autoComplete="off"
                                      onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                      onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                      readOnly = {baseParams.relationshipDegree.readOnly}
                                      disabled={false}
                                      onChange={(e) => handleOnChangeIntro(baseParamsIS.relationshipDegree, e.target.value ) }
                                    />
                                  ),
                                })}
                              </Row>
                            </div>
                          </div>
                        )}
                      <Row className="subheader">
                        <Col xl={24}>IV. PARTES RELACIONADAS</Col>
                      </Row>
                      <Row className="summary">
                        <Col span={21}>¿Es Ud. parte relacionada?</Col>
                        {renderFormItem({
                          label: "",
                          name: "hasRelParts",
                          initialValue:
                            apiForm.hasRelParts !== null
                              ? apiForm.hasRelParts
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
                                  "hasRelParts",
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

                        <Col>
                          En caso de ser afirmativo por favor indicar la empresa
                          relacionada
                        </Col>
                      </Row>
                      {apiForm.hasRelParts !== null && apiForm.hasRelParts && (
                        <div className="content">
                          {format === "html" && (
                            <>
                              <Row className="inner-row" gutter={[16, 8]}>
                                {renderFormItemTable({
                                  section: relParts.relPartsCompany,
                                  options: params.empresas&&params.empresas.length > 0 ? params.empresas.map(empresa => ({val:empresa, text:empresa})):[]
                                })}

                                {renderFormItemTable({
                                  section: relParts.relPartsDescription,
                                  cols: 16,
                                })}
                              </Row>

                              <Row className="button-row">
                                {apiForm.relParts.length < 1 && validarRegistros && apiForm.hasRelParts && (
                                    <Col span={24} className="missing-registers ant-form-explain" > {t("messages.aml.registersRequired")} </Col>
                                  )}

                                <Col className="addRelation" xl={3}>
                                  <Button type="primary" htmlType="button" onClick={handleOnAddRelParts} icon="plus" > Añadir </Button>
                                </Col>
                                <Col className="addRelation" xl={3}>
                                  <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('relParts')} > Limpiar </Button>
                                </Col>
                              </Row>
                            </>
                          )}

                          {apiForm.relParts !== null && apiForm.relParts !== undefined && apiForm.relParts.length > 0 && (
                              <Table columns={relPartsColumns} dataSource={apiForm.relParts} size="middle" pagination={false} ></Table>
                            )}
                        </div>
                      )}
                      {apiForm.hasRelParts !== null && apiForm.hasRelParts && (
                        <div className="content">
                          <Row className="summary">
                            <Col>
                              En caso de identificar otro tipo de relación no
                              contenida en la sección anterior y que se
                              encuentra dentro del alcance de lo establecido en
                              el art. 100 de la ley 18.045 7 y el art. 146 de la
                              ley 18.046 9 por favor indicar
                            </Col>
                          </Row>

                          {format === "html" && (
                            <>
                              <Row className="inner-row" gutter={[16, 8]}>
                                {renderFormItem({
                                  label: "Descripción de la Situación",
                                  name: baseParamsIS.relPartsCompanies.id,
                                  initialValue: relPartsCompanies.relPartsCompanies,
                                  colClassName: "topLabel",
                                  labelCol: 0,
                                  wrapperCol: 0,
                                  wrapperCols: 24,
                                  rules:[
                                    validateLengthFieldWithInnerLength(baseParamsIS.relPartsCompanies)
                                  ],
                                  item: (
                                    <Input
                                      autoComplete="off"
                                      onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                      onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                      readOnly = {baseParams.relPartsCompanies.readOnly}
                                      disabled={false}
                                      onChange={(e) => handleOnChangeFieldRelPartsCompanies(e.target.id, e.target.value ) }
                                    />
                                  ),
                                })}
                              </Row>

                              <Row className="button-row">
                                <Col className="addRelation" xl={3}>
                                  <Button type="primary" htmlType="button" onClick={handleOnAddRelPartsCompanies} icon="plus" > Añadir </Button>
                                </Col>
                              </Row>
                            </>
                          )}

                          {
                            apiForm.relPartsCompanies !== null && apiForm.relPartsCompanies !== undefined && apiForm.relPartsCompanies.length > 0 && (
                                <Table columns={relPartsCompaniesColumns()} dataSource={apiForm.relPartsCompanies} size="middle" pagination={false} ></Table>
                              )
                          }
                        </div>
                      )}
                      <Row className="subheader">
                        <Col xl={24}>V. EX DIRECTOR O TRABAJADOR</Col>
                      </Row>
                      <Row className="summary">
                        <Col span={21}>
                          Declaro que tengo conocimiento de que algún director,
                          gerente, ejecutivo principal o administrador de{" "}
                          <strong>{smuProv}</strong> ha ejercido funciones en{" "}
                          <strong>La Empresa</strong>, dentro de los últimos 18
                          meses.
                        </Col>
                        {renderFormItem({
                          label: "",
                          name: "hasRelLabAnt",
                          initialValue:
                            apiForm.hasRelLabAnt !== null
                              ? apiForm.hasRelLabAnt
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
                      {apiForm.hasRelLabAnt !== null && apiForm.hasRelLabAnt && (
                        <Row className="content">
                          {(match.params.view === undefined || match.params.view === "html") && (
                            <>
                              <Row className="inner-row" gutter={[16, 8]}>
                                {renderFormItemTable({
                                  section: laboral.laboralName,
                                })}
                                {renderFormItemTable({
                                  section: laboral.laboralTipoDoc,
                                  options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                })}
                                {renderFormItemTable({
                                  section: laboral.laboralRut,
                                  validator: docValidator( laboral.laboralTipoDoc.val )
                                })}
                              </Row>
                              <Row className="inner-row" gutter={[16, 8]}>
                                {renderFormItemTable({
                                  section: laboral.laboralPosition,
                                })}
                                {renderFormItemTable({
                                  section: laboral.laboralCompanyName,
                                  options: params.empresas&&params.empresas.length > 0 ? params.empresas.map(empresa => ({val:empresa, text:empresa})):[],
                                })}
                                {renderFormItemTable({
                                  section: laboral.laboralEndDate,
                                  initialValue: laboral.laboralEndDate.val ? moment(laboral.laboralEndDate.val) : null,
                                })}
                              </Row>
                              <Row className="button-row">
                                {apiForm.relLabAnt.length < 1 && validarRegistros && apiForm.hasRelLabAnt && (
                                    <Col span={24} className="missing-registers ant-form-explain" > {t("messages.aml.registersRequired")} </Col>
                                )}
                                <Col className="addRelation" xl={3}>
                                  <Button type="primary" htmlType="button" onClick={handleOnAddLaboralRelation} icon="plus" > Añadir </Button>
                                </Col>
                                <Col className="addRelation" xl={3}>
                                  <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('laboral')} > Limpiar </Button>
                                </Col>
                              </Row>
                            </>
                          )}

                          {apiForm.relLabAnt !== null && apiForm.relLabAnt !== undefined && apiForm.relLabAnt.length > 0 && format === "html" ? (
                            <Table columns={laboralColumns} dataSource={apiForm.relLabAnt} size="middle" pagination={false} ></Table>
                          ) : (
                            toDescriptionsPdf(apiForm.relLabAnt, laboral)
                          )}
                        </Row>
                      )}
                      <Row className="subheader">
                        <Col xl={24}>
                          VI. INTERES EN LA PROPIEDAD O GESTIÓN DE LA EMPRESA
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col span={21}>
                          Declaro que tengo conocimiento de que algún director,
                          gerente, ejecutivo principal o administrador de{" "}
                          <strong>{smuProv}</strong> tiene interés en la
                          propiedad o gestión de <strong>La Empresa</strong>.
                        </Col>

                        {renderFormItem({
                          label: "",
                          name: "hasPropInteres",
                          initialValue:
                            apiForm.hasPropInteres !== null
                              ? apiForm.hasPropInteres
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
                                  "hasPropInteres",
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
                      {apiForm.hasPropInteres !== null && apiForm.hasPropInteres && (
                          <div className="content">
                            {(match.params.view === undefined ||
                              match.params.view === "html") && (
                              <>
                                <Row className="inner-row" gutter={[16, 8]}>
                                  {renderFormItemTable({
                                    section: propInteres.propInteresName,
                                  })}
                                  {renderFormItemTable({
                                    section: propInteres.propInteresTipoDoc,
                                    options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                  })}
                                  {renderFormItemTable({
                                    section: propInteres.propInteresRut,
                                    validator: docValidator( propInteres.propInteresTipoDoc.val )
                                  })}
                                </Row>
                                <Row className="inner-row" gutter={[16, 8]}>
                                  {renderFormItemTable({
                                    section: propInteres.propInteresDescription,
                                    cols:24
                                  })}
                                </Row>

                                <Row className="button-row">
                                  <Col className="addRelation" xl={24}>
                                    {apiForm.propInteres.length < 1 && validarRegistros && apiForm.hasPropInteres && (
                                        <Col span={24} className="missing-registers ant-form-explain" > {t("messages.aml.registersRequired")} </Col>
                                    )}
                                  </Col>
                                  <Col className="addRelation" xl={3}>
                                      <Button type="primary" htmlType="button" onClick={handleOnAddPropInteres} icon="plus" > Añadir </Button>
                                    </Col>
                                  <Col className="addRelation" xl={3}>
                                      <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('propInteres')} > Limpiar </Button>
                                  </Col>
                                </Row>
                              </>
                            )}

                            {apiForm.propInteres !== null && apiForm.propInteres !== undefined && apiForm.propInteres.length > 0 && format === "html" ? (
                              <Table columns={propInteresColumns} dataSource={apiForm.propInteres} size="middle" pagination={false} ></Table>
                            ) : (
                              toDescriptionsPdf( apiForm.propInteres, propInteres )
                            )}
                          </div>
                        )}
                      <Row className="subheader">
                        <Col xl={24}>
                          VII. FUNCIONARIOS PUBLICOS O PERSONAS EXPUESTAS
                          POLÍTICAMENTE
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col span={21}>
                          Declaro que tengo conocimiento de que algún director,
                          gerente, ejecutivo principal o administrador de{" "}
                          <strong>{smuProv}</strong> es o ha sido un empleado o
                          funcionario público, tanto en la administración
                          central del Estado como en instituciones o empresas
                          fiscales o semifiscales, municipales, autónomas u
                          organismos creados por el Estado o bajo su
                          dependencia; o es una Persona Expuesta Políticamente{" "}
                          <Tooltip
                            placement="rightBottom"
                            className="tooltip-form"
                            overlayStyle={{ maxWidth: "700px" }}
                            title={() => {
                              return (
                                <>
                                  "Se consideraran como PEP a los chilenos o
                                  extranjeros que desempeñen o hayan desempeñado
                                  funciones políticas destacadas en Chile o el
                                  extranjero, hasta a lo menos un año de
                                  finalizado el ejercicio de las mismas. Se
                                  incluyen en esta categoría: " <br />
                                  1. Presidente de la República. <br />
                                  2. Senadores, diputados y alcaldes.
                                  <br />
                                  3. Ministros de la Corte Suprema y Cortes de
                                  Apelaciones.
                                  <br />
                                  4. Ministros de Estado, subsecretarios,
                                  intendentes, gobernadores, secretarios
                                  regionales ministeriales, embajadores, jefes
                                  superiores de Servicio, tanto centralizados
                                  como descentralizados, y el directivo superior
                                  inmediato que deba subrogar a cada uno de
                                  ellos.
                                  <br />
                                  5. Comandantes en Jefe de las Fuerzas Armadas,
                                  director General de Carabineros, director
                                  General de Investigaciones, y el oficial
                                  superior inmediato que deba subrogar a cada
                                  uno de ellos.
                                  <br />
                                  6. Fiscal Nacional del Ministerio Público y
                                  fiscales regionales.
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
                                  13. Consejeros del Consejo de Alta Dirección
                                  Pública.
                                  <br />
                                  14. Directores y ejecutivos principales de
                                  empresas públicas, según lo definido por la
                                  Ley Nº 18.045.
                                  <br />
                                  15. Directores de sociedades anónimas
                                  nombrados por el Estado o sus organismos.
                                  <br />
                                  16. Miembros de las directivas de los partidos
                                  políticos.
                                  <br />
                                </>
                              );
                            }}
                          >
                            (PEP)
                          </Tooltip>{" "}
                          o ha desempeñado funciones públicas destacadas durante
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
                          rules: [
                            {
                              required: true,
                              message: t("messages.aml.dontForgetSelect"),
                            },
                          ],
                          wrapperCols: 3,
                          item: (
                            <Radio.Group
                              onChange={({ target }) => handleOnChangeRadioButton2( "PEP", "hasRelPepFp", target.value ) }
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
                      {getRadioButtonValue('PEP') && (
                        <Row className="content">
                          {(match.params.view === undefined ||
                            match.params.view === "html") && (
                            <>
                              <Row className="inner-row" gutter={[16, 8]}>
                                {renderFormItemTable({
                                  section: relationPep.relationPepName,
                                })}
                                {renderFormItemTable({
                                  section: relationPep.relationPepTipoDoc,
                                  options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                })}
                                {renderFormItemTable({
                                  section: relationPep.relationPepRut,
                                  validator: docValidator(relationPep.relationPepTipoDoc.val)
                                })}
                              </Row>

                              <Row className="inner-row" gutter={[16, 8]}>
                                {renderFormItemTable({
                                  section: relationPep.relationPepPositionCompany,
                                  options: [{ val: "Director", text: "Director" },
                                            { val: "Gerente", text: "Gerente" },
                                            { val: "Ejecutivo Principal", text: "Ejecutivo Principal" },
                                            { val: "Administrador", text: "Administrador" }]
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
                                  type:'date',
                                  initialValue: relationPep.relationPepEndDate.val !== null && relationPep.relationPepEndDate.val !== undefined ? moment(relationPep.relationPepEndDate.val) : null,
                                })}
                              </Row>
                              <Row className="button-row">
                                {getFilteredRegistersByType('PEP').length < 1 && validarRegistros && getRadioButtonValue('PEP') && (
                                    <Col span={24} className="missing-registers ant-form-explain" > {t("messages.aml.registersRequired")} </Col>
                                  )}
                                <Col className="addRelation" xl={3}>
                                  <Button type="primary" htmlType="button" onClick={(e)=>handleOnAddAttributes(relationPep, 'PEP', 'relationPep')} icon="plus" > Añadir </Button>
                                </Col>
                                <Col className="addRelation" xl={3}>
                                    <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('relationPep')} > Limpiar </Button>
                                </Col>
                              </Row>
                            </>
                          )}

                          {getFilteredRegistersByType('PEP').length > 0 && format === "html" ? (
                            <Table columns={relationPepColumns} dataSource={getFilteredRegistersByType('PEP')} size="middle" pagination={false} ></Table>
                          ) : (
                            toDescriptionsPdf(getFilteredRegistersByType('PEP'), relationPep)
                          )}
                        </Row>
                      )}
                      <Row className="subheader">
                        <Col xl={24}>
                          VIII. RESPONSABILIDAD PENAL DE LAS PERSONAS JURÍDICAS
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col span={21}>
                          Declaro que tengo conocimiento de que algún director,
                          gerente, ejecutivo principal o administrador de{" "}
                          <strong>{smuProv}</strong> ha sido procesado o
                          condenado por alguno de los delitos contenidos en la
                          Ley N° 20.393 sobre responsabilidad penal de las
                          personas jurídicas.{" "}
                        </Col>
                        {renderFormItem({
                          label: "",
                          name: "hasPenalResp",
                          initialValue:
                            apiForm.hasPenalResp !== null
                              ? apiForm.hasPenalResp
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
                                  "hasPenalResp",
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
                      {apiForm.hasPenalResp !== null && apiForm.hasPenalResp && (
                        <div className="content">
                          {(match.params.view === undefined || match.params.view === "html") && (
                            <>
                              <Row className="inner-row" gutter={[16, 8]}>
                                {renderFormItemTable({
                                  section: penalResp.penalRespName,
                                })}
                                {renderFormItemTable({
                                  section: penalResp.penalRespTipoDoc,
                                  options: [{ val: "Chile-Rut", text: "Chile-Rut" }, { val: "Otros", text: "Otros" }],
                                })}
                                {renderFormItemTable({
                                  section: penalResp.penalRespRut,
                                  validator: docValidator( penalResp.penalRespTipoDoc.val )
                                })}
                              </Row>
                              <Row className="inner-row" gutter={[16, 8]}>
                                {renderFormItemTable({
                                  section: penalResp.penalRespDescription,
                                  cols: 24,
                                })}
                              </Row>
                              <Row className="button-row">
                                {apiForm.penalResp.length < 1 && validarRegistros && apiForm.hasPenalResp && (
                                    <Col span={24} className="missing-registers ant-form-explain" > {t("messages.aml.registersRequired")} </Col>
                                  )}
                                <Col className="addRelation" xl={3}>
                                  <Button type="primary" htmlType="button" onClick={handleOnAddPenalResp} icon="plus" > Añadir </Button>
                                </Col>
                                <Col className="addRelation" xl={3}>
                                  <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('penalResp')} > Limpiar </Button>
                                </Col>
                              </Row>
                            </>
                          )}

                          {apiForm.penalResp !== null && apiForm.penalResp !== undefined && apiForm.penalResp.length > 0 && format === "html" ? (
                            <Table columns={penalRespColumns} dataSource={apiForm.penalResp} size="middle" pagination={false} ></Table>
                          ) : (
                            toDescriptionsPdf(apiForm.penalResp, penalResp)
                          )}
                        </div>
                      )}
                      <Row className="subheader">
                        <Col xl={24}>IX. OTROS CONFLICTOS DE INTERÉS</Col>
                      </Row>
                      <Row className="summary">
                        <Col span={21}>
                          Declaro que tengo conocimiento de algún otro conflicto
                          de interés no abordado en las preguntas anteriores que
                          pudiera afectar o influir de cualquier forma en la
                          relación de <strong>{smuProv}</strong> con La Empresa.
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
                      {apiForm.hasOthersCDI && (
                        <Row className="content">
                          {format === "html" && (
                            <>
                              <Row className="fields-row" gutter={[16, 8]}>
                                {renderFormItem({
                                  label: "Descripción de la situación",
                                  name: baseParamsIS.relationOtrosDescripcion.id,
                                  initialValue: relationOtros.relationOtrosDescripcion,
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
                                    validateLengthFieldWithInnerLength(baseParamsIS.relationOtrosDescripcion)
                                  ],
                                  wrapperCols: 24,
                                  item: (
                                    <Input
                                      autoComplete="off"
                                      onFocus= {(e)=>handleReadOnly(e.target.id,false)}
                                      onBlur= {(e)=>handleReadOnly(e.target.id,true)}
                                      readOnly = {baseParams.relationOtrosDescripcion.readOnly}
                                      disabled={false}
                                      onChange={(e) => handleOnChangeFieldRelationOtros(e.target.id, e.target.value ) }
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
                                    icon="plus"
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

                          {apiForm.othersCDI !== null &&
                            apiForm.othersCDI !== undefined &&
                            apiForm.othersCDI.length > 0 && (
                              <Table
                                columns={relationOtrosColumns()}
                                dataSource={apiForm.othersCDI}
                                size="middle"
                                pagination={false}
                              ></Table>
                            )}
                        </Row>
                      )}
                      <Row
                        className="content"
                        style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                      >
                        <Row className="summary">
                          <Col xl={24}>
                            Declaro expresamente y bajo juramento que toda la
                            información contenida en la presente Declaración
                            Jurada es absolutamente verdadera y exacta, respecto
                            de mí y de la empresa a la que represento
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

export default withRouter(Form.create()(FormProv));
