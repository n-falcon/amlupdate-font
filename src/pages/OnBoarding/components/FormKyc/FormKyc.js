import "./FormKyc.scss";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, Form, Input, Row, Spin, DatePicker, Select, Radio, Table, Icon, notification, Descriptions, Checkbox, InputNumber, Upload, Divider, List, message } from "antd";
import { FormLayout } from "../../../../layouts";
import { withRouter } from "react-router-dom";
import apiConfig from '../../../../config/api'
import { getFormPromise, getParamsPromise, saveFormOnbPromise, sendFormPromise, signCDIFormPromise, sendFileFormPromise } from "../../promises";
import { getCountriesCodePromise } from '../../promises';
import moment from "moment";
import Logo from "./components/Logo/Logo";
import { validateRutHelper, validateCompanyRutHelper, } from "../../../../helpers";
import HelloSign from 'hellosign-embedded';
import { getSIIActivitiesPromise, getRegionComunaPromise } from "../../../../promises";

const FormKyc = ({ form, match }) => {
  const { t } = useTranslation();
  const { getFieldDecorator, validateFields, setFields, getFieldsError, setFieldsValue, getFieldError } = form;
  const [isValidate, setIsValidate] = useState(true);
  const [isLoading, setIsloading] = useState(false);
  const [paises, setPaises] = useState(null);
  const [date, setDate] = useState(0);
  const dateFormat = "DD/MM/YYYY";
  const { Option } = Select;
  const [user, setUser] = useState({});
  const [subclienteId, setSubclienteId] = useState("0");
  const [apiForm, setApiForm] = useState(null);
  const [params, setParams] = useState({});
  const [othersCDIobj, setOthersCDIobj] = useState({});
  const [colLogo, setColLogo] = useState(4);
  const [format, setFormat] = useState("html");
  const [validarRegistros, setValidarRegistros] = useState(false);
  const [signed, setSigned] = useState(false);
  const [openSigner, setOpenSigner] = useState(false);
  const hasSign = true
  const [clientName, setClientName] = useState("");
  const { Dragger } = Upload;
  const [sentErrors, setSentErrors] = useState(0);
  const [tmpFilesList, setTmpFilesList] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [userFileName, setUserFileName] = useState("");
  const [SIIActivities, setSIIActivities] = useState([]);
  const [regionComuna, setRegionComuna] = useState([]);
  const [comunas, setComunas] = useState([]);

  // const [registersStop, setRegistersStop] = useState({stop:false});
  let registersStop = {
    infoMo: false,
  };

  const radioStyle = {
      display: 'block',
      height: '22px',
      lineHeight: '22px',
    };

  const toDescriptionsPdf = (collection, stateObject, typeEntity) => (
    <>
      {collection.map((collectionObject, index) => (
        <>
          <div className="descriptions-pdf">
            <h4 className="descriptions-numeral">#{index + 1}</h4>
            <Descriptions title="" column={1} bordered size="small">
              {Object.keys(stateObject).map((key) => {
                if(!typeEntity || !stateObject[key].typeEntity || stateObject[key].typeEntity.includes(typeEntity)) {
                  return (
                    <Descriptions.Item label={stateObject[key].title}>
                      {collectionObject[stateObject[key].key]}
                    </Descriptions.Item>
                  );
                }else {
                  return null
                }
              })}
            </Descriptions>
          </div>
          <br />
        </>
      ))}
    </>
  );

  const handleListDeleted= (index) =>{
    setFileNames(oldFileNames => {
      const newFileNames = oldFileNames.slice();
      newFileNames.splice(index, 1)

      return newFileNames
    })

    setTmpFilesList(oldTmpFilesList => {
      const newTmpFilesList = oldTmpFilesList.slice();
      newTmpFilesList.splice(index, 1)

      return newTmpFilesList
    })
  }

  const propsUpload = {
    accept: ".pdf, .png, .docx, .xlsx",
    onRemove: file => {
      const index = tmpFilesList.indexOf(file);
      handleListDeleted(index);
    },
    beforeUpload: file => {
      validateFields(['fileName']).then((error, values) => {
        const validFiles = file.type === 'application/pdf' || file.type === 'image/png'|| file.name.endsWith('.docx') || file.name.endsWith('.xlsx');
        if (!validFiles) {
          message.error('Formato no permitido.');
        }else{
          const validSize = file.size / 1024 / 1024 < 2;
          if (!validSize) {
            message.error('Tamaño máximo 2MB!');
          }else{
            setTmpFilesList(oldTmpFilesList => [...oldTmpFilesList, file]);
            setFileNames(oldFileNames => [...oldFileNames, userFileName]);
          }
          setFieldsValue({fileName: null})
          setUserFileName(null)
        }
      })
      return false
    },
    multiple: false,
    showUploadList: false
  }

  const handleOnClear = (section)=>{
    switch (section) {
      case 'infoMo':
        setInfoMo({...infoMoIS})
        setFieldsValue(Object.keys(infoMoIS).reduce((acu,key)=>{
          return {...acu,[key]:undefined}
        },{}))
        break;
      case 'prodAct':
        setProdAct({...prodActIS})
        setFieldsValue(Object.keys(prodActIS).reduce((acu,key)=>{
          return {...acu,[key]:undefined}
        },{}))
        break;
      case 'benFinObj':
        setBenFinObj({...benFinObjIS})
        setFieldsValue(Object.keys(benFinObjIS).reduce((acu,key)=>{
          return {...acu,[key]:undefined}
        },{}))
        break;
      case 'activityEsp':
      setActivityEsp({...activityEspIS})
      setFieldsValue(Object.keys(activityEspIS).reduce((acu,key)=>{
        return {...acu,[key]:undefined}
      },{}))
      break;
      case 'pepPublicObj':
        setPepPublicObj({...pepPublicObjIS})
        setFieldsValue(Object.keys(pepPublicObjIS).reduce((acu,key)=>{
          return {...acu,[key]:undefined}
        },{}))
        break;
      case 'pepFamilyObj':
        setPepFamilyObj({...pepFamilyObjIS})
        setFieldsValue(Object.keys(pepFamilyObjIS).reduce((acu,key)=>{
          return {...acu,[key]:undefined}
        },{}))
        break;
      case 'pepRelationObj':
        setPepRelationObj({...pepRelationObjIS})
        setFieldsValue(Object.keys(pepRelationObjIS).reduce((acu,key)=>{
          return {...acu,[key]:undefined}
        },{}))
        break;
      case 'infoSoc':
        setInfoSoc({...infoSocIS})
        setFieldsValue(Object.keys(infoSocIS).reduce((acu,key)=>{
          return {...acu,[key]:undefined}
        },{}))
      break;
      default:
        break;
    }
  }

  const basicInfoIS= {
    basicInfoName: { key: "name", val: "", title: "Nombre", maxLength:200, id: "basicInfoName", required:true, type: 'input', readOnly:true, section: 'basicInfo', disabled: true },
    basicInfoTipoDoc: { key:"tipoDocumento", title:"Nombre de Documento", maxLength:200, id:'basicInfoTipoDoc',readOnly:true, type: 'select', section: 'basicInfo' },
    basicInfoNroDoc: { key: "nroDocumento", val: "", title: "Nro. de Identificación", maxLength:200, id: "basicInfoNroDoc", required:true, readOnly:true, type: 'input', section: 'basicInfo', disabled: true },
    basicInfoTipoSociedad: { key:"tipoSociedad",title:"Tipo Sociedad", maxLength:200, id:'basicInfoTipoSociedad',readOnly:true, type: 'select', section: 'basicInfo' },
    basicInfoTipoEmpresa: { key:"tipoEmpresa",title:"Tipo de Empresa:", maxLength:200, id:'basicInfoTipoEmpresa',readOnly:true, type: 'select', section: 'basicInfo' },
    basicInfoNombreFantasia: { key:"nombreFantasia",title:"Nombre de Fantasía:", maxLength:200, id:'basicInfoNombreFantasia',readOnly:true, type: 'input', section: 'basicInfo' },
    basicInfoTamEmpresa: { key:"tamEmpresa",title:"Tamaño de la Empresa", maxLength:200, id:'basicInfoTamEmpresa',readOnly:true, type: 'select', section: 'basicInfo' },
    basicInfoNationality: { key:"nationality", title:"Nacionalidad", mFxLength:200, id:'basicInfoNationality',readOnly:true, type: 'select', section: 'basicInfo' },
    basicInfoProfesion: { key:"profesion", title:"Profesional en el área de:" ,maxLength:200, id:'basicInfoProfesion',readOnly:true, type: 'select', section: 'basicInfo' },
    basicInfoPropositoRel: { key:"propositoRel",val: undefined, title:"Propósito de la Relación", maxLength:200, id:'basicInfoPropositoRel',readOnly:true, type:'select', section: 'basicInfo' },
    basicInfoResindenciaPais: {  key:"residenciaPais", title:"País de residencia", maxLength:200, id:'basicInfoResindenciaPais',readOnly:true, type:'select', section: 'basicInfo' },
    basicInfoOcupacion: { key:"oficio", title: "Ocupación u oficio", maxLength:200, id:'basicInfoOcupacion',readOnly:true, type: 'select', section: 'basicInfo' },
    basicInfoContactName: { key:"contactName",val: "", title:"Nombre persona de contacto", maxLength:200, id:'basicInfoContactName',readOnly:true, section:'contacto' },
    basicInfoCargo: { key: "infoCargo", val:"",title:"Cargo", maxLength:200, id:'basicInfoCargo', readOnly:true, section:'contacto' },
    basicInfoOtraProfesion: { key:"otraProfesion",val: "", title:"Especifique otra profesión" ,maxLength:200, id:'basicInfoOtraProfesion',readOnly:true, type: 'input' },
    basicInfoOcupacionOtros: { key:"otroOficio",val: "", title:"Especifique otro oficio" ,maxLength:200, id:'basicInfoOcupacionOtros',readOnly:true, type: 'input' },
    basicInfoResindencia: { key:"residencia",val: undefined, title:"¿Tiene residencia permanente en otro país?", maxLength:200, id:'basicInfoResindencia',readOnly:true, type:'select' },
    basicInfoPropositoRelOtro: { key:"propositoRelOtro", title:"Describa Otro", maxLength:200, id:'basicInfoPropositoRelOtro',readOnly:true, type:'input' },
    basicInfoWeb: { key:"web",val: "", title:"Página web" ,maxLength:200, id:'basicInfoWeb',readOnly:true, section:'ubicacion', required: false },
    basicInfoMail: { key:"mail",val: "", title:"Correo Electrónico" ,maxLength:200, id:'basicInfoMail',readOnly:true, section:'contacto' },
    basicInfoDir: { key:"direccion",val: "", title: "Dirección domicilio" ,maxLength:200, id:'basicInfoDir',readOnly:true, section:'ubicacion' },
    basicInfoRegion: { key:"region",val: "", title: "Región", id:"basicInfoRegion", readOnly: true, section:'ubicacion', type: 'select'},
    basicInfoComuna: { key:"comuna",val: "", title: "Comuna", id:"basicInfoComuna", readOnly: true, section:'ubicacion', type: 'select'},
    basicInfoPais: { key:"pais", title: "País", id:"basicInfoPais", readOnly: true, type: 'select', section:'ubicacion' },
    basicInfoCodigoPais: { key:"codigoPais", id:"basicInfoCodigoPais", readOnly: true, section:'ubicacion' },
    basicInfoTel: { key:"tel",val: "", title: "Teléfono Fijo", id:"basicInfoTel", readOnly: true, required: false, type: 'input', section:'contacto' },
    basicInfoCel: { key:"cel",val: "", title: "Teléfono Celular", id:"basicInfoCel", readOnly: true, type: 'input', section:'contacto' },
    basicInfoMtrz: { key:"matriz", title: "Tiene Casa Matriz?", id:"basicInfoMtrz", readOnly: true, type: 'select', section: 'casaMatriz' },
    basicInfoMtrzName: { key:"nombreMatriz",val: "", title: "Nombre de la Casa Matriz", id:"basicInfoMtrzName", readOnly: true, section: 'casaMatriz' },
    basicInfoMtrzDir: { key:"direccionMatriz",val: "", title: "Dirección Casa Matriz", id:"basicInfoMtrzDir", readOnly: true, section: 'casaMatriz' },
    basicInfoMtrzPais: { key:"paisMatriz", title: "País de casa matriz", id:"basicInfoMtrzPais", readOnly: true, type: 'select', section: 'casaMatriz' },
    basicInfoMtrzCity: { key:"ciudadMatriz",val: "", title: "Ciudad de la casa matriz", id:"basicInfoMtrzCity", readOnly: true, section: 'casaMatriz' },
  };
  const [basicInformation, setBasicInformation]=useState(basicInfoIS);

  const repLegalIS= {
    repLegalName: { key: "name", val: "", title: "Nombres y Apellidos", maxLength:200, id: "repLegalName", required:true, readOnly:true },
    repLegalNroId: { key: "nroid", val: "", title: "Nro. Identificación", maxLength:200, id: "repLegalNroId", required:true, readOnly:true },
    repLegalTipoDoc: { key: "tipoDoc", title: "Tipo de Documento", id: "repLegalTipoDoc", required:true, readOnly:true, type: 'select' },
    repLegalFecNac: { key: "fecNac", val: "", title: "Fecha de Nacimiento", id: "repLegalFecNac", required:true, readOnly:true, type: 'date' },
    repLegalNation: { key: "nationality", title: "Nacionalidad", id: "repLegalNation", required:true, readOnly:true, type: 'select' },
    repLegalProfesion: { key: "profesion", val: "", title: "Profesión", id: "repLegalProfesion", required:true, readOnly:true },
    repLegalAccionista: { key: "esAccionista", title: "Es accionista de la empresa", id: "repLegalAccionista", required:true, readOnly:true, type: 'select' },
    repLegalCorreo: { key: "correo", val: "", title: "Correo electrónico", id: "repLegalCorreo", required:true, readOnly:true },
    repLegalTel: { key: "telefono", val: "", title: "Teléfono de Contacto", id: "repLegalTel", required:false, readOnly:true },
  };
  const [repLegal, setRepLegal]=useState(repLegalIS);

  const infoEcoIS= {
    infoEcoTipoContri: { key: "tipoContribuyente", title: "Tipo de contribuyente", id: "infoEcoTipoContri", required:true, readOnly:true, type: 'select', section: 'tributaria' },
    infoEcoResolucion: { key: "nroResolucion", val: "", title: "Nro. Resolución", id: "infoEcoResolucion", required:false, readOnly:true, type: 'input', section: 'tributaria'},
    infoEcoRegimen: { key: "regimen", title:"Tipo de Régimen", id: 'infoEcoRegimen', required: true, type: 'input', required: false, section: 'tributaria'},
    infoEcoFiscalObligations: { key: "fiscalObligations", title: "¿Tiene obligaciones fiscales en otro país?", id: "infoEcoFiscalObligations", required:true, readOnly:true, type: 'select', section: 'tributaria' },
    infoEcoFisObligationsCountry: { key: "fisObligationsCountry", title: "Indicar el país", id: "infoEcoFisObligationsCountry", required:true, readOnly:true, type: 'select', section: 'tributaria' },
    infoEcoHasExMon: { key: "hasExMon", val: null, title: "¿Cuál(es) de las siguientes operaciones realiza en moneda extranjera", maxLength:200, id: "infoEcoHasExMon", required:true, readOnly:true, section:'monedaExtranjera' },
    infoEcoExMonRecords: { key: "exMonRecords", val: [], id: "infoEcoExMonRecords", section:'monedaExtranjera' },
    infoEcoActRecords: { key: "actRecords", val: [], id: "infoEcoActRecords", section:'actividadEconomica' },
    infoEcoActEspRecords: { key: "actEspRecords", val: [], id: "infoEcoActEspRecords", section:'actividadEconomica'},
    infoEcoInitAct: { key: "initDate", val: null, title: "Fecha de Inicio de Actividades", id: "infoEcoInitAct", type:'date', required:true, readOnly:true, section: 'actividadEconomica' },
    infoEcoAniosExp: { key:"aniosExp",val: "", title:"Experiencia en el mercado (años)", maxLength:200, id:'infoEcoAniosExp',readOnly:true, section: 'actividadEconomica' },
  };
  const [infoEco, setInfoEco]=useState(infoEcoIS);
  const prodActIS= {
    prodActCiiu: { key: "ciiu", val: "", title: "Código", maxLength:200, id: "prodActCiiu", required:false , readOnly:true, type: 'input'},
    prodActDescripcion: { key: "linea", val: "", title: "Seleccione Actividad Económica:", maxLength:200, id: "prodActDescripcion", required:false, readOnly:true, type: 'select'},
  };
  const [prodAct, setProdAct]=useState(prodActIS);

  const activityEspIS= {
    activityEspAct: { key: "activity", title: "Actividad", maxLength:200, id: "activityEspAct", required:true , readOnly:true, type: 'select'},
    activityEspPais: { key: "actPais", title: "País", maxLength:200, id: "activityEspPais", required:true, readOnly:true, type: 'select'},
  }
  const [activityEsp, setActivityEsp]=useState(activityEspIS);

  const infoMoIS= {
    infoMoTipoProd: { key: "tipoProd", val: undefined, title: "Tipo de Producto", id: "infoMoTipoProd", type: 'select'},
    infoMoTipoMon: {key: "tipoMon", val: "", title:"Tipo de Moneda", id:"infoMoTipoMon"},
    infoMoNroCuenta: { key: "nroCuenta", val: "", title: "Número de cuenta", maxLength:200, id: "infoMoNroCuenta", required:true, readOnly:true },
    infoMoCountry: { key: "country", title: "País", maxLength:200, id: "infoMoCountry", required:true, readOnly:true, type: 'select'},
    infoMoEntity: { key: "entity", val: "", title: "Nombre de la entidad", maxLength:200, id: "infoMoEntity", required:true, readOnly:true },
  };
  const [infoMo, setInfoMo]=useState(infoMoIS);

  const infoFinancieraIS= {
    infoFinancieraAnio: { key: "anio", val: "", title: "Año (Ultimo año fiscal)", maxLength:200, id: "infoFinancieraAnio", required:true, readOnly:true},
    infoFinancieraIngreso: { key: "ingreso", val: "", title: "Ingresos Totales Anual", maxLength:200, id: "infoFinancieraIngreso", required:true, readOnly:true, isCurrency: true},
    infoFinancieraEgreso: { key: "egreso", val: "", title: "Egresos Totales Anual", maxLength:200, id: "infoFinancieraEgreso", required:true, readOnly:true, isCurrency: true},
    infoFinancieraActivos: { key: "activos", val: "", title: "Valor activos", id: "infoFinancieraActivos", isCurrency: true},
    infoFinancieraPasivos: {key: "pasivos", val: "", title:"Valor pasivos (deudas)", id:"infoFinancieraPasivos", isCurrency: true},
    infoFinancieraUtilidad: { key: "utilidad", val: "", title: "Utilidad o Pérdida Anual ", maxLength:200, id: "infoFinancieraUtilidad", required:true, readOnly:true, isCurrency: true },
    infoFinancieraNroEmpleados: { key: "nroEmpleados", val: "", title: "Número de Empleados", maxLength:200, id: "infoFinancieraNroEmpleados", required:true, readOnly:true },
  };
  const [infoFinanciera, setInfoFinanciera]=useState(infoFinancieraIS);

  const benFinObjIS= {
    benFinObjNom: { key: "name", val: "", title: "Nombres y Apellidos (Completos)", maxLength:200, id: "benFinObjNom", required:true, readOnly:true},
    benFinObjPais: { key: "pais", title: "País (Domicilio)", maxLength:200, id: "benFinObjPais", required:true, readOnly:true, type: 'select'},
    benFinObjNacionalidad: { key: "nacionalidad", title: "Nacionalidad", maxLength:200, id: "benFinObjNacionalidad", required:true, readOnly:true, type: 'select'},
    benFinObjTipoDoc: { key: "tipoDoc", title: "Tipo Documento", id: "benFinObjTipoDoc", type: 'select'},
    benFinObjNroDoc: {key: "nroDoc", val: "", title:"Número Documento", id:"benFinObjNroDoc"},
    benFinObjPorcParti: { key: "porcParti", val: "", title: "Participación en %", maxLength:200, id: "benFinObjPorcParti", required:true, readOnly:true, isPercentage: true, min: 0, max: 100 },
    // benFinObjParticipacion: { key: "participacion", val: "", title: "Participación en $", maxLength:200, id: "benFinObjParticipacion", required:true, readOnly:true, isCurrency: true },
  };
  const [benFinObj, setBenFinObj]=useState(benFinObjIS);

  const benFinalesIS= {
    benFinalesRecords: { key: "records", val: [], id: "benFinalesRecords"},
  }
  const [benFinales, setBenFinales]=useState(benFinalesIS);

  const ofCumplimientoIS= {
    ofCumplimientoHasCumplimiento: { key: "hasCumplimiento", val: null, id: "ofCumplimientoHasCumplimiento"},
    ofCumplimientoName: { key: "ofCumplimientoName", val: "", title: "Nombres y Apellidos Oficial de Cumplimiento", maxLength:200, id: "ofCumplimientoName", required:true, readOnly:true},
    ofCumplimientoEmail: { key: "email", val: "", title: "Correo Electrónico", maxLength:200, id: "ofCumplimientoEmail", required:true, readOnly:true},
    ofCumplimientoTel: { key: "tel", val: "", title: "Teléfono de contacto", maxLength:200, id: "ofCumplimientoTel", required:true, readOnly:true},
    ofCumplimientoObs: { key: "observacion", val: "", title: "Observaciones", maxLength:200, id: "ofCumplimientoObs", required:true, readOnly:true, type: 'textarea'},
  };
  const [ofCumplimiento, setOfCumplimiento]=useState(ofCumplimientoIS);

  const infoPepIS= {
    infoPepIsPublic: { key: "isPublic", val: undefined, title: "", maxLength:200, id: "infoPepIsPublic", required: false},
    infoPepHasFamily: { key: "hasFamily", val: "", title: "", maxLength:200, id: "infoPepHasFamily", required: false},
    infoPepHasRelation: { key: "hasRelation", val: "", title: "", maxLength:200, id: "infoPepHasRelation", required: false},
    infoPepPublicRecords: { key: "publicRecords", val: [], id: "infoPepPublicRecords"},
    infoPepFamilyRecords: { key: "familyRecords", val: [], id: "infoPepFamilyRecords"},
    infoPepRelationRecords: { key: "relationRecords", val: [], id: "infoPepRelationRecords"},
  };
  const [infoPep, setInfoPep]=useState(infoPepIS);

  const  pepPublicObjIS={
    pepPublicGrupo: { key: "grupo", title: "Grupo de la persona relacionada", maxLength:200, id: "pepPublicGrupo", required: true, type: 'select', typeEntity: ['PJ']},
    pepPublicName: { key: "name", val: "", title: "Nombre Completo", maxLength:200, id: "pepPublicName", required: true, typeEntity: ['PJ']},
    pepPublicTipoId: { key: "tipoId", title: "Tipo de Identificación", maxLength:200, id: "pepPublicTipoId", required: true, type: 'select', typeEntity: ['PJ']},
    pepPublicNroId: { key: "nroIdentificacion", val: "", title: "Nro. de identificación", maxLength:200, id: "pepPublicNroId", required: true, type: 'input', typeEntity: ['PJ']},
    pepPublicOrgPublic: { key: "orgPublic", val: "", title: "Organismo Público", maxLength:200, id: "pepPublicOrgPublic", required: true, typeEntity: ['PJ','PN']},
    pepPublicPais: { key: "pais", title: "País", maxLength:200, id: "pepPublicPais", required: true, type: 'select', typeEntity: ['PJ','PN']},
    pepPublicCargo: { key: "cargo", val: "", title: "Cargo Funcionario Público", maxLength:200, id: "pepPublicCargo", required: true, typeEntity: ['PJ','PN']},
    pepPublicFecTermino: { key: "fecTermino", val: null, title: "Fecha de término", maxLength:200, id: "pepPublicFecTermino", required: false, type: 'date', typeEntity: ['PJ','PN']},
  }
  const [pepPublicObj, setPepPublicObj]=useState(pepPublicObjIS);

  const  pepFamilyObjIS={
    pepFamilyGrupo: { key: "grupo", title: "Grupo de la persona relacionada", maxLength:200, id: "pepFamilyGrupo", required: true, type: 'select', typeEntity: ['PJ']},
    pepFamilyOrgPublic: { key: "orgPublic", val: "", title: "Organismo Público", maxLength:200, id: "pepFamilyOrgPublic", required: true},
    pepFamilyPais: { key: "pais", title: "País", maxLength:200, id: "pepFamilyPais", required: true, type: 'select'},
    pepFamilyParentesco: { key: "parentesco", title: "Tipo de Parentesco", maxLength:200, id: "pepFamilyParentesco", required: true, type: 'select'},
    pepFamilyNamePublicFunc: { key: "nombreFuncPublic", title: "Nombre Funcionario Público", maxLength:200, id: "pepFamilyNamePublicFunc", required: true, type: 'input'},
    pepFamilyNroIdPublicFunc: { key: "nroIdFuncPublic", title: "Nro de Identi. Funcionario Publico", maxLength:200, id: "pepFamilyNroIdPublicFunc", required: true, type: 'input'},
    pepFamilyCargo: { key: "cargo", val: "", title: "Cargo funcionario público", maxLength:200, id: "pepFamilyCargo", required: true},
    pepFamilyFecTermino: { key: "fecTermino", val: null, title: "Fecha de término", maxLength:200, id: "pepFamilyFecTermino", required: false, type: 'date'},
  }
  const [pepFamilyObj, setPepFamilyObj]=useState(pepFamilyObjIS);

  const  pepRelationObjIS={
    pepRelationGrupo: { key: "grupo", title: "Grupo de la persona relacionada", maxLength:200, id: "pepRelationGrupo", required: true, type: 'select', typeEntity: ['PJ']},
    pepRelationName: { key: "name", val: "", title: "Nombre Completo", maxLength:200, id: "pepRelationName", required: true, typeEntity: ['PJ']},
    pepRelationTipoId: { key: "tipoId", title: "Tipo de Identificación", maxLength:200, id: "pepRelationTipoId", required: true, type: 'select', typeEntity: ['PJ']},
    pepRelationNroId: { key: "nroIdentificacion", val: "", title: "Nro. de identificación", maxLength:200, id: "pepRelationNroId", required: true, typeEntity: ['PJ']},
    //pepRelationOrgPublico: { key: "orgPubic", val: "", title: "Organismo Público", maxLength:200, id: "pepRelationOrgPublico", required: true},
    pepRelationPais: { key: "pais", title: "País (empresa)", maxLength:200, id: "pepRelationPais", required: true, type: 'select', typeEntity: ['PJ','PN']},
    pepRelationEmpresa: { key: "empresa", val: "", title: "Empresa con la cual se celebró el pacto", maxLength:200, id: "pepRelationEmpresa", required: true, typeEntity: ['PJ','PN']},
    pepRelationNroIdEmp: { key: "nroIdEmp", val: "", title: "Nro. de identificación (empresa)", maxLength:200, id: "pepRelationNroIdEmp", required: true, typeEntity: ['PJ','PN']},
    pepRelationTipoRelacion: { key: "tipoRel", val: "", title: "Tipo de relación", maxLength:200, id: "pepRelationTipoRelacion", required: true, typeEntity: ['PJ','PN']},
    //pepRelationTipoDocEmp: { key: "tipoDocEmp", title: "Tipo de Documento (empresa)", maxLength:200, id: "pepRelationTipoDocEmp", required: true, type: 'select'},
  }
  const [pepRelationObj, setPepRelationObj]=useState(pepRelationObjIS);

  const  fondosIS={
    fondosOrigenRecursos: { key: "origenRecursos", val: "", maxLength:200, title: "El Origen de Fondos o los recursos con los que se realizarán las operaciones, provienen de:", id: "fondosOrigenRecursos", required: false, type: 'check', colsOption: 8},
    fondosMediosPago: { key: "mediosPago", val: "", maxLength:200, title: "El o los medios de pagos a ser utilizados serán:", id: "fondosMediosPago", required: false, type: 'check', colsOption: 8},
    fondosOrigenRecursosOtro: { key: "origenRecursosOtro", val: "", maxLength:200, title: "Ingrese Otro", id: "fondosOrigenRecursosOtro", required: false, type: 'input', colsOption: 8},
    fondosMediosPagoOtro: { key: "mediosPagoOtro", val: "", maxLength:200, title: "Ingrese Otro", id: "fondosMediosPagoOtro", required: false, type: 'input', colsOption: 8},
  }
  const [fondos, setFondos]=useState(fondosIS);

  const  infoSocIS={
    infoSocRazonSoc: { key: "razonSoc", val: "", title: "Razón Social", maxLength:200, id: "infoSocRazonSoc", required: true, typeEntity: ['PJ','PN']},
    infoSocNroId: { key: "nroId", val: "", title: "Nro. de identificación", maxLength:200, id: "infoSocNroId", required: true, typeEntity: ['PJ','PN']},
    infoSocPais: { key: "pais", val: "", title: "País de Constitución", maxLength:200, id: "infoSocPais", required: true, type: 'select', typeEntity: ['PJ','PN']},
    infoSocPorcParti: { key: "porcParti", val: "", title: "Participación en %", maxLength:200, id: "infoSocPorcParti", required:true, readOnly:true, isPercentage: true, min: 0, max: 100, typeEntity: ['PJ','PN'] },
    infoSocCargo: { key: "cargo", val: "",title: "Cargo", maxLength:200, id: "infoSocCargo", required: true, type: 'select', typeEntity: ['PN']},
    infoSocTipoProp: { key: "tipoPropiedad", val: "", title: "Tipo de Propiedad", maxLength:200, id: "infoSocTipoProp", required: true, type: 'select', typeEntity: ['PJ','PN']},
    infoSocNombrePi: { key: "nombrePropIndirect", val: "", title: "Nombre Empresa Propie. Indirecta", maxLength:200, id: "infoSocNombrePi", required: true, typeEntity: ['PJ','PN']},
    infoSocNroIdPi: { key: "nroIdPropIndirect", val: "", title: "Nro. ID Empresa Propie. Indirecta", maxLength:200, id: "infoSocNroIdPi", required: true, typeEntity: ['PJ','PN']},

  }
  const [infoSoc, setInfoSoc]=useState(infoSocIS);

  const  sociedadesRecordIS={
    sociedadesHasSociedades: { key: "hasSociedades", val: null, title: "", maxLength:200, id: "sociedadesHasSociedades", required: false},
    sociedadesRecords: { key: "socRecords", val: [], id: "sociedadesRecords"},
  }
  const [sociedades, setSociedades]=useState(sociedadesRecordIS)

  const actividades = [
    'Administradora de fondos',
    'Agencia de viaje',
    'Arriendo de estacionamientos',
    'Banco',
    'Casa de cambio',
    'Casa de corretaje bursátil',
    'Casa de empeño',
    'Casa de intermediación de valores',
    'Casa de juegos de azar y lotería',
    'Casas de remate y martillo',
    'Casino',
    'Centros de diversiones',
    'Comercializador o agencia de bienes raíces',
    'Comercializadora / arrendadora de vehículos automotores, embarcaciones y aeronaves',
    'Comercializadora bajo el esquema de ventas multinivel o piramidal',
    'Comercializadora de armas, explosivos o municiones',
    'Comerciante de joyas, piedras y metales preciosos',
    'Compañía de Seguros de vida',
    'Compañía de Seguros generales',
    'Corporación, fundación o entidad sin ánimo de lucro',
    'Empresa de comercio de antigüedades, objetos de arte y joyas',
    'Empresa de comercio exterior',
    'Empresa de compra, venta o cambio de cheques',
    'Empresa de locomoción colectiva',
    'Empresa de transferencia y transporte de valores y dinero',
    'Empresa ubicada en zona franca',
    'Exportadora',
    'Financiera',
    'Hipodromo',
    'Importadora',
    'Inmobiliaria',
    'Prestamista',
    'Servicios de envío de dinero',
    'Subsidiaria de instituciones bancarias o financieras',
    'Subsidiaria internacional de una corporación',
    'Venta de piezas para camiones, compraventa de vehículos usados y maquinaria',
    'No realiza ninguna de las actividades señaladas',
  ]

  // end init Objects

  const validateLengthFieldWithInnerLength = (section)=>{
    return {
      max: section.maxLength,
      message: "Debe tener un máximo de "+ section.maxLength  + " caracteres"
    }
  }



  const handleReadOnly = (field,readOnly,sectionId=null)=>{
    if (sectionId===null){
      const key = Object.entries(basicInformation).filter(([key,value])=>{
        return value.id === field
      })[0][0]
      setBasicInformation({...basicInformation,[key]:{...basicInformation[key],readOnly:readOnly}})
    }else{
      settingStateObj(sectionId,readOnly)
    }
  }

  const settingStateObj=(sectionId,readOnly)=>{
    const [stateObject,stateObjectSetter] = customState(sectionId)
    stateObjectSetter({...stateObject,[sectionId]:{...stateObject[sectionId],readOnly:readOnly}})
  }

  const customState=(sectionId)=>{
    if (sectionId.startsWith('basicInfo')) {
      return([basicInformation,setBasicInformation])
    }else if (sectionId.startsWith('repLegal')) {
      return([repLegal,setRepLegal])
    }else if (sectionId.startsWith('infoEco')) {
      return([infoEco,setInfoEco])
    }else if (sectionId.startsWith('infoMo')) {
      return([infoMo,setInfoMo])
    }else if (sectionId.startsWith('benFinObj')) {
      return([benFinObj,setBenFinObj])
    }else if (sectionId.startsWith('ofCumplimiento')) {
      return([ofCumplimiento,setOfCumplimiento])
    }else if (sectionId.startsWith('infoPep')) {
      return([infoPep,setInfoPep])
    }else if (sectionId.startsWith('infoFinanciera')) {
      return([infoFinanciera,setInfoFinanciera])
    }else if (sectionId.startsWith('benFinales')) {
      return([benFinales,setBenFinales])
    }else if (sectionId.startsWith('prodAct')) {
      return([prodAct,setProdAct])
    }else if (sectionId.startsWith('activityEsp')) {
      return([activityEsp,setActivityEsp])
    }else if (sectionId.startsWith('pepPublic')) {
      return([pepPublicObj,setPepPublicObj])
    }else if (sectionId.startsWith('pepFamily')) {
      return([pepFamilyObj,setPepFamilyObj])
    }else if (sectionId.startsWith('pepRelation')) {
      return([pepRelationObj,setPepRelationObj])
    }else if (sectionId.startsWith('fondos')) {
      return([fondos,setFondos])
    }else if (sectionId.startsWith('sociedades')) {
      return([sociedades,setSociedades])
    }else if (sectionId.startsWith('infoSoc')) {
      return([infoSoc,setInfoSoc])
    }
  }
  const entriesToObj = (obj) => {
    const objAttr = {}
    Object.entries(obj).map(([key, value]) => {
      if(value.section) {
        if(!objAttr[value.section]) objAttr[value.section] = {}
        objAttr[value.section][value.key] = value.val
      }else {
        objAttr[value.key] = value.val
      }
    })
    return objAttr
  }

  const handlerOnChangeObjAttr = async (sectionId, value, formObj) => {
    handleOnChangeField(sectionId, value)
    const [stateObject,stateObjectSetter] = customState(sectionId)
    stateObject[sectionId].val = value


    const basicInfo = entriesToObj(basicInformation)
    const rLegal = entriesToObj(repLegal)
    const iEco = entriesToObj(infoEco)
    const oCump = entriesToObj(ofCumplimiento)
    const iFin = entriesToObj(infoFinanciera)
    const bFin = entriesToObj(benFinales)
    const iPep = entriesToObj(infoPep)
    const fond = entriesToObj(fondos)
    const socR = entriesToObj(sociedades)

    if(!formObj) formObj = apiForm
    const json = { basicInformation: basicInfo, repLegal: rLegal, infoEco: iEco, ofCumplimiento: oCump, infoPep: iPep, infoFinanciera: iFin, benFinales: bFin, fondos: fond, sociedades: socR }
    let formToUpdate = { ...formObj, json };
    let ret = await saveFormOnbPromiseLocal(formToUpdate);
    if(!ret.success) {
    //  setFieldsValue({[field]: ret.form[field]})
    }
  }

  const handleOnChangeField = (sectionId, value) => {
    const [stateObject, stateObjectSetter] = customState(sectionId)
    stateObjectSetter({ ...stateObject, [sectionId]: { ...stateObject[sectionId], val: value }});
  };

  const objToVariable = (variable, obj) => {
    let varAttr = { ...variable }
    for(var key in obj) {
      for(var prop in variable) {
        if(variable[prop].key === key && varAttr[prop]) {
          varAttr[prop].val = obj[key]
        }else if(typeof obj[key] === "object" && variable[prop].section === key) {
          for(var attr in obj[key]) {
            if(variable[prop].key === attr && varAttr[prop]) {
              varAttr[prop].val = obj[key][attr]
            }
          }
        }
      }
    }
    return varAttr
  }


  useEffect(() => {
    if (match.params.view === "pdf") {
      setColLogo(5);
      setFormat("pdf");
    }
    setIsloading(true);
    getCountriesCodePromise().then((response) => {
      setPaises(response)
    })
    getFormPromise(match.params.id).then((response) => {
      if (
          response.data !== null &&
          response.data !== "" &&
          response.data.status !== undefined
      ) {
        if (response.data.recipient.record.type === 'Entity'){
          response.data["typeSol"] = 'PJ'
        }else{
          response.data["typeSol"] = 'PN'
        }
        setApiForm(response.data);
        initVariablesFromObject(response.data)
        setUser(response.data.recipient.request.createUser);
        setClientName(response.data.recipient.request.createUser.cliente.name);
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
    });

    getSIIActivitiesPromise().then((response) => {
      setSIIActivities(response)
    })
  }, []);

  const initVariablesFromObject = (obj) => {
    if(obj.json) {
      if(obj.json.basicInformation) {
        if (obj.json.basicInformation.ubicacion && obj.json.basicInformation.ubicacion.codigoPais) {
          getRegionComunaPromise(obj.json.basicInformation.ubicacion.codigoPais).then((response) => {
            setRegionComuna(response)
            if(obj.json.basicInformation.ubicacion.region) {
              let comunas = response.filter(e => e.name === obj.json.basicInformation.ubicacion.region)
              if (comunas && comunas.length > 0){
                setComunas(comunas[0].comunas)
              }else{
                setComunas([])
              }
            }
          })
        }
        let basicInfo = objToVariable(basicInformation, obj.json.basicInformation)
        setBasicInformation(basicInfo)
      }
      if(obj.json.repLegal) {
        let rLegal = objToVariable(repLegal, obj.json.repLegal)
        setRepLegal(rLegal)
      }
      if(obj.json.infoEco) {
        let iEco = objToVariable(infoEco, obj.json.infoEco)
        setInfoEco(iEco)
      }
      if(obj.json.infoPep) {
        let iPep = objToVariable(infoPep, obj.json.infoPep)
        setInfoPep(iPep)
      }
      if(obj.json.ofCumplimiento) {
        let oCump = objToVariable(ofCumplimiento, obj.json.ofCumplimiento)
        setOfCumplimiento(oCump)
      }
      if(obj.json.infoFinanciera) {
        let iFin = objToVariable(infoFinanciera, obj.json.infoFinanciera)
        setInfoFinanciera(iFin);
      }
      if(obj.json.benFinales) {
        let bFin = objToVariable(benFinales, obj.json.benFinales)
        setBenFinales(bFin)
      }
      if(obj.json.fondos) {
        let fond = objToVariable(fondos, obj.json.fondos)
        setFondos(fond)
      }
      if(obj.json.sociedades) {
        let socR = objToVariable(sociedades, obj.json.sociedades)
        setSociedades(socR)
      }
    }else {
      const record = obj.recipient.record
      let bi = { name: record.nombre, nroDocumento: record.rut, propositoRel: record.proposito, nationality: record.citizenship, profesion: record.giroProfesion, pais: record.pais, city: record.ciudad, direccion: record.direccion, tel: record.telefono, cel: record.mobileNumber, mail: record.email }

      let basicInfo = objToVariable(basicInformation, bi)
      setBasicInformation(basicInfo)
    }
  }

  const saveFormOnbPromiseLocal = async (form) => {
    let response = await saveFormOnbPromise(form);
    if(response.code !== 'OK' && response.form !== undefined && response.form !== null) {
      setApiForm(response.form)
      initVariablesFromObject(response.form)

      notification["error"]({
        message: t("messages.aml.notifications.anErrorOcurred"),
      });

      return { success: false, form: response.form}
    }else {
      setApiForm(form)
      return { success: true }
    }
  }

  const handleOnChangeRadioButton = async (field, value) => {
    let formToUpdate = { ...apiForm, [field]: value };
    let ret = await saveFormOnbPromiseLocal(formToUpdate);
    if(!ret.success) {
      setFieldsValue({[field]: ret.form[field]})
    }else{
       if (field === 'typeSol') {
         if (value === 'PJ'){
           handlerOnChangeObjAttr('basicInfoTipoDoc', 'Codigo de Identificación Fiscal', formToUpdate)
         }else{
           handlerOnChangeObjAttr('basicInfoTipoDoc', undefined, formToUpdate)
         }
       }
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
    setFieldsValue({fileName: undefined})
    setIsValidate(true);
    setValidarRegistros(true);

    validateFields(Object.keys(basicInformation));

    if(apiForm.typeSol === "PJ") {
      validateFields(['ofCumplimientoHasCumplimiento'])

      validateFields(Object.keys(repLegal));
      validateFields(Object.keys(infoFinanciera));

      if (infoEco.infoEcoActEspRecords.val.length === 0) {
        validateFields(Object.keys(activityEsp));
        registersStop = { ...registersStop, activityEsp: true };
      }
    }

    validateFields(['infoEcoHasExMon','infoPepIsPublic','infoPepHasFamily','infoPepHasRelation','sociedadesHasSociedades'])

    // if (infoEco.infoEcoActRecords.val.length === 0) {
    //   validateFields(Object.keys(prodAct));
    //   registersStop = { ...registersStop, prodAct: true };
    // }

    validateFields(Object.keys(infoEco));
    validateFields(Object.keys(infoPep));
    validateFields(Object.keys(fondos));

    if (sociedades.sociedadesHasSociedades.val && sociedades.sociedadesRecords.val.length === 0) {
      validateFields(Object.keys(infoSoc));
      registersStop = { ...registersStop, infoSoc: true };
    }

    if (infoEco.infoEcoHasExMon.val && infoEco.infoEcoExMonRecords.val.length === 0) {
      validateFields(Object.keys(infoMo));
      registersStop = { ...registersStop, infoMo: true };
    }

    if (ofCumplimiento.ofCumplimientoHasCumplimiento.val) {
      validateFields(Object.keys(ofCumplimiento));
    }

    if (
      hasErrors(getFieldsError()) ||
      Object.values(registersStop).find((value) => value === true) !== undefined
    ) {
      notification["warning"]({
        message: t("messages.aml.missingRequiredField"),
      });
    } else {
      setOpenSigner(true)

      if(tmpFilesList !== null && tmpFilesList.length > 0){
        const formData = new FormData()
        tmpFilesList.forEach((file, index) => {
          formData.append('file', file)
          formData.append('fileName', fileNames[index])
        })
        formData.append('formId', apiForm.id);

        await sendFileFormPromise(formData);
      }

      if(hasSign) {
        let record = apiForm.recipient.record
        let _emails = ["no@email.com"];
  			if(record.email != null) {
  					_emails = record.email.split(",");
  			}
  			var _email = _emails[0].trim();
        let signParams = await signCDIFormPromise(apiForm.id, _email)
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
      setOpenSigner(false)
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



  const renderFormItemTable = ({ section, cols=format === 'html' ? 6 : 8, offset, labelCol=0, wrapperCol=0, options=[], validator=null, customRule=null, handlerOnChangeObj=handleOnChangeField, customTitle, colsOption }) => {
    const type = section.type ? section.type : 'input'
    const required = "required" in section ? section.required : true
    const disabled = "disabled" in section ? section.disabled : false
    const initialValue = section.val && section.val !== '' && format === 'html' && type === 'date' ? moment(section.val, "DD/MM/YYYY") : section.val
    return renderFormItem({
      label: customTitle ? customTitle : section.title,
      name: section.id,
      initialValue: initialValue,
      colClassName: "topLabel",
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      rules:
      [
        { required: required, message: t( "messages.aml.requestedField")},
        ...validator ? [{ validator: validator }]:[],
        ...type==='input' ? [validateLengthFieldWithInnerLength(section)]:[],
        ...customRule ? [customRule]:[]
      ],
      wrapperCols: cols,
      offset: offset,
      item: (
        format === 'html' || type === 'check' ?
          type === 'input' ?
            <Input
              placeholder="Ingrese texto"
              autoComplete="off"
              onFocus= {(e)=>handleReadOnly(e.target.id,false,section.id)}
              onBlur= {(e)=>handleReadOnly(e.target.id,true,section.id)}
              readOnly = {section.readOnly}
              onChange={(e) => handlerOnChangeObj( section.id, e.target.value ) }
              disabled={disabled}
            />
          : type === 'number' ?
            <InputNumber
              placeholder="Ingrese un número"
              autoComplete="off"
              onFocus= {(e)=>handleReadOnly(e.target.id,false,section.id)}
              onBlur= {(e)=>handleReadOnly(e.target.id,true,section.id)}
              min= {section.min}
              max={section.max}
              formatter = { section.isCurrency ? (value => `$ ${value}`)  : section.isPercentage ? (value => `${value}%`) : null}
              readOnly = {section.readOnly}
              onChange={(value) => {
              handlerOnChangeObj( section.id, value )
              }}
              disabled={disabled}
            />
          : type === 'textarea' ?
            <Input.TextArea
              placeholder="Ingrese texto"
              autoComplete="off"
              onFocus= {(e)=>handleReadOnly(e.target.id,false,section.id)}
              onBlur= {(e)=>handleReadOnly(e.target.id,true,section.id)}
              readOnly = {section.readOnly}
              onChange={(e) => handlerOnChangeObj( section.id, e.target.value ) }
              disabled={disabled}
              style = {{width: '100%'}}
            />
          : type === 'select' ?
            <Select
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder={section.multiple ? "Seleccione una o más opciones" : "Seleccione una opción"}
              onChange={(value, codigo) => handlerOnChangeObj(section.id, value, null, codigo)}
              disabled={disabled}
              style={{ width: '100%' }}
              mode = {section.multiple ? 'multiple' : ''}
            >
              { options.map((option) => (<Select.Option value={option.val} key={option.key} code={option.code}>{ option.text }</Select.Option>)) }
            </Select>
          : type === 'date' ?
            <DatePicker
              onFocus= {(e)=>handleReadOnly(e.currentTarget.id,false,section.id)}
              onBlur= {(e)=>handleReadOnly(e.currentTarget.id,true,section.id)}
              readOnly = {section.readOnly}
              format={"DD/MM/YYYY"}
              placeholder={"Ingrese la fecha"}
              style = {{width: '100%'}}
              disabled={disabled}
              mode={type}
              onChange={(momentObj, str) => {
                handlerOnChangeObj( section.id, momentObj ? moment(momentObj).format( "DD/MM/YYYY" ) : null )
              }}
            />
          : type === 'check' ?
            <Checkbox.Group
              style={{width: '100%'}}
              className={section.title && section.title !== '' ? 'has-title' : ''}
              onChange={(value) => handlerOnChangeObj(section.id, value) }
              >
                <hr/>
              {options.map((option) => (
                <Col span={colsOption ? colsOption : section.colsOption}>
                  <Checkbox value={option.val}>
                    { option.text }
                  </Checkbox>
                </Col>
              ))}
            </Checkbox.Group>
          :<Input/>
        :
          <Input/>
      ),
    })
  }

  const renderFormItemObj = (params) => {
    return renderFormItemTable({...params, handlerOnChangeObj: handlerOnChangeObjAttr})
  }

  const handleOnAddAttrTable = (attr, attrObj, attrTable) => {
    setIsValidate(true);
    const [stateObject,stateObjectSetter] = customState(attr)
    validateFields(Object.keys(stateObject)).then((error, values) => {
      const tableOk = Object.keys(stateObject).reduce(
        (acc, e) => {
          return {
            ...acc,
            [stateObject[e].key]: stateObject[e].val,
          };
        },
        {}
      );
      const [stateObject1,stateObject1Setter] = customState(attrObj)
      let obj = { ...stateObject1 }
      let attr2 = Object.entries(obj).filter(([k,v]) => {
        return v.key === attrTable
      })[0]
      obj[attr2[1].id].val.push(tableOk)
      stateObject1Setter(obj)

      let formToUpdate = { ...apiForm }
      saveFormOnbPromiseLocal(formToUpdate).then(ret => {
        if(ret.success){
          handleOnClear(attr)
        }
      });

      registersStop[attr] = false;
    });
  };

  // attrObj (obj con los campos)
  // attTable ()
  // index
  const handleDeleteAttrTable = (attrObj, attrTable, index) => {
    return () => {
      const [stateObject,stateObjectSetter] = customState(attrObj)
      let obj = { ...stateObject }
      let attr2 = Object.entries(obj).filter(([k,v]) => {
        return v.key === attrTable
      })[0]

      let xx = [...obj[attr2[1].id].val];
      xx.splice(index, 1);
      obj[attr2[1].id].val = xx
      stateObjectSetter(obj)

      let formToUpdate = { ...apiForm };
      formToUpdate.json[attrObj][attrTable] = xx
      saveFormOnbPromiseLocal(formToUpdate);
    };
  };

  const infoEcoColums = [
    {
      title: "Tipo de Producto",
      dataIndex: "tipoProd",
    },
    {
      title: "Tipo de Moneda",
      dataIndex: "tipoMon",
    },
    {
      title: "Nombre de la Entidad",
      dataIndex: "entity",
    },
    {
      title: "Número de cuenta",
      dataIndex: "nroCuenta",
    },
    {
      title: "País",
      dataIndex: "country"
    },
      format === "html" && !signed ? {
          title: "Acción",
          dataIndex: "",
          key: "x",
          width: "8%",
          render: (text, record, index) => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a onClick={handleDeleteAttrTable('infoEco', 'exMonRecords', index)}>
              <Icon type="delete" />
            </a>
          ),
        }
      : {},
  ];

  const activityEspColums = [
    {
      title: "Actividades",
      dataIndex: "activity",
      width: "70%"
    },
    {
      title: "País",
      dataIndex: "actPais",
      width: "22%"
    },
    format === "html" && !signed ? {
          title: "Acción",
          dataIndex: "",
          key: "x",
          width: "8%",
          render: (text, record, index) => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a onClick={handleDeleteAttrTable('infoEco', 'actEspRecords', index)}>
              <Icon type="delete" />
            </a>
          ),
        }
      : {},
  ];

  const prodActColums = [
    {
      title: "Actividad Económica",
      dataIndex: "linea",
      width: "70%",
      render: (linea) => {
        const arr = linea.slice(7)
        return arr
      }
    },
    {
       title: "Código de actividad",
       dataIndex: "linea",
       width: "22%",
       render: (linea) => {
        const arr = linea.substr(0,6)
        return arr
      }
    },
    format === "html" && !signed ? {
          title: "Acción",
          dataIndex: "",
          key: "x",
          width: "8%",
          render: (text, record, index) => (
            <a onClick={handleDeleteAttrTable('infoEco', 'actRecords', index)}>
              <Icon type="delete" />
            </a>
          ),
        }
      : {},
  ];

  const benFinalesColumns = [
    {
      title: "Nombre Completo",
      dataIndex: "name",
    },
    {
      title: "País (Domicilio)",
      dataIndex: "pais",
    },
    {
      title: "Nacionalidad",
      dataIndex: "nacionalidad",
    },
    {
      title: "Tipo Documento",
      dataIndex: "tipoDoc",
    },
    {
      title: "Número documento",
      dataIndex: "nroDoc",
    },
    {
      title: "Participación en %",
      dataIndex: "porcParti"
    },
      format === "html" && !signed ? {
          title: "Acción",
          dataIndex: "",
          key: "x",
          width: "8%",
          render: (text, record, index) => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a onClick={handleDeleteAttrTable('benFinales', 'records', index)}>
              <Icon type="delete" />
            </a>
          ),
        }
      : {},
  ];

  const getPepPublicColumns = () => {
    var columns = []
    if(apiForm.typeSol === 'PN') {
      columns.push(
        {
          title: "Organismo Público",
          dataIndex: "orgPublic",
          width:"23%"
        },
        {
          title: "Cargo",
          dataIndex: "cargo",
          width:"23%"
        },
        {
          title: "País",
          dataIndex: "pais",
          width:"23%"
        },
        {
          title: "Fecha de término",
          dataIndex: "fecTermino",
          width:"23%"
        },
      )
    }else{
    columns.push(
    {
      title: "Grupo de la persona relacionada",
      dataIndex: "grupo",
      width:"18.4%"
    },
    {
      title: "Nombre Completo",
      dataIndex: "name",
      width:"18.4%"
    },
    {
      title: "Tipo Identificación",
      dataIndex: "tipoId",
      width:"18.4%"
    },
    {
      title: "Nro. de identificación",
      dataIndex: "nroIdentificacion",
      width:"18.4%"
    },
    {
      title: "Fecha de término",
      dataIndex: "fecTermino",
      width:"18.4%"
    },
    )}

    if(format === "html" && !signed) {
      columns.push({
          title: "Acción",
          dataIndex: "",
          key: "x",
          width: "8%",
          render: (text, record, index) => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a onClick={handleDeleteAttrTable('infoPep', 'publicRecords', index)}>
              <Icon type="delete" />
            </a>
          ),
        }
      )
    }
    return columns
  }

  const getPepFamilyColumns = () => {
    var columns = []
      if(apiForm.typeSol === 'PJ') {
        columns.push(
          {
            title: "Grupo",
            dataIndex: "grupo",
          },
          // {
          //   title: "Organismo Público",
          //   dataIndex: "orgPublic",
          // },
          // {
          //   title: "País",
          //   dataIndex: "pais",
          // },
          // {
          //   title: "Parentesco",
          //   dataIndex: "parentesco",
          // },
          {
            title: "Nombre funcionario público",
            dataIndex: "nombreFuncPublic",
          },
          {
            title: "Nro. id funcionario público",
            dataIndex: "nroIdFuncPublic",
          },
          {
            title: "Cargo",
            dataIndex: "cargo"
          },

          {
            title: "Fecha de término",
            dataIndex: "fecTermino",
          },
        )
      }else{
        columns.push(

          // {
          //   title: "Organismo Público",
          //   dataIndex: "orgPublic",
          // },
          // {
          //   title: "País",
          //   dataIndex: "pais",
          // },
          // {
          //   title: "Parentesco",
          //   dataIndex: "parentesco",
          // },
          {
            title: "Nombre funcionario público",
            dataIndex: "nombreFuncPublic",
          },
          {
            title: "Nro. id funcionario público",
            dataIndex: "nroIdFuncPublic",
          },
          {
            title: "Cargo",
            dataIndex: "cargo"
          },
          {
            title: "Fecha de término",
            dataIndex: "fecTermino",
          },
    )}

    if(format === "html" && !signed) {
      columns.push({
          title: "Acción",
          dataIndex: "",
          key: "x",
          width: "8%",
          render: (text, record, index) => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a onClick={handleDeleteAttrTable('infoPep', 'familyRecords', index)}>
              <Icon type="delete" />
            </a>
          ),
        }
      )
    }
    return columns
  }

  const getPepRelationColumns = () => {
    var columns = []
    if(apiForm.typeSol === 'PN') {
      columns.push(
        {
          title: "Nombre Empresa",
          dataIndex: "empresa",
        },
        {
          title: "Nro. id (empresa)",
          dataIndex: "nroIdEmp",
        },
        {
          title: "Tipo de relación",
          dataIndex: "tipoRel",
        },
        {
          title: "País (empresa)",
          dataIndex: "pais",
        },
      )
    }else{
      columns.push(
        {
          title: "Nombre Completo",
          dataIndex: "name",
        },
        // {
        //   title: "Tipo Identificación",
        //   dataIndex: "tipoId",
        // },
        {
          title: "Nro. de identificación",
          dataIndex: "nroIdentificacion",
        },
        {
          title: "Nombre Empresa",
          dataIndex: "empresa",
        },
        {
          title: "Tipo de relación",
          dataIndex: "tipoRel",
        },
        // {
        //   title: "País (empresa)",
        //   dataIndex: "pais",
        // },
        {
          title: "Nro. id (empresa)",
          dataIndex: "nroIdEmp",
        },
      )
    }

    if(format === "html" && !signed) {
      columns.push({
          title: "Acción",
          dataIndex: "",
          key: "x",
          width: "8%",
          render: (text, record, index) => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a onClick={handleDeleteAttrTable('infoPep', 'relationRecords', index)}>
              <Icon type="delete" />
            </a>
          ),
        }
      )
    }
    return columns
  }

  const getSociedadesColumns = () => {
    var columns = [
      {
        title: "Empresa",
        dataIndex: 'razonSoc'
      },
      {
        title: "Nro. Identificación",
        dataIndex: 'nroId'
      },
      {
        title: "País",
        dataIndex: 'pais'
      },
      {
        title: "% de participación",
        dataIndex: 'porcParti'
      },
      {
        title: "Tipo de Propiedad",
        dataIndex: 'tipoPropiedad'
      },
    ]
    if (apiForm.typeSol === 'PN'){
      columns.push(
        {
          title: "Cargo",
          dataIndex: 'cargo'
        },
      )
    }


    if(format === "html" && !signed) {
      columns.push({
          title: "Acción",
          dataIndex: "",
          key: "x",
          width: "8%",
          render: (text, record, index) => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a onClick={handleDeleteAttrTable('sociedades', 'socRecords', index)}>
              <Icon type="delete" />
            </a>
          ),
        }
      )
    }
    return columns
  }



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
    <FormLayout view={match.params.view} >
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
                  "form-content-kyc " + format + " " +(!isValidate ? " form-validate-messages" : "")
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
                      <h3> {apiForm.typeSol === 'PN' ? "FORMULARIO ONBOARDING - PERSONA NATURAL":"FORMULARIO ONBOARDING - PERSONA JURÍDICA"}</h3>
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
                    <Col span={19} style={{ textAlign: "right" }}>
                      Proceso:
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
                        {apiForm.proceso === 'CREATE' ? 'Creación' : 'Actualización'}
                      </div>
                    </Col>
                  </Row>


                  {apiForm.status === "SENT" &&
                  (format === "html") ? (
                    <>
                      <br />
                      <h3 style={{ textAlign: "center" }}>
                        Estimado {/* {apiForm.recipient.record.nombre} */}
                        {apiForm.recipient.record.name}
                        ,le informamos que su declaración fue correctamente
                        completada, agradecemos su tiempo y disposición.
                        <br />
                        Hemos enviado una copia de la declaración realizada al
                        mail registrado:<br/><br/>
                        {apiForm.recipient.record.email}
                      </h3>
                    </>
                  ) : (
                    <>
                      <Col className="summary" style={{textAlign: "justify", marginRight: 10}}>
                        En cumplimiento con lo establecido en el Sistema de
                        Detección y Prevención de Lavado de Activos y Otros
                        Delitos Relacionados de {clientName}, que tiene
                        como objetivo evitar la comisión de delitos de corrupción,
                        lavado de activos, entre otros. Solicitamos
                        su participación para completar siguiente información.
                      </Col>
                {/* INICIO RADIOBTN PARA SELECCIONAR TIPO DE PERSONA */}


                      {/* <Row className="form-radio-center">
                        {renderFormItem({
                          label: "Tipo de Solicitud",
                          name: "typeSol",
                          initialValue: apiForm.recipient.record.type === 'Entity' ? 'PJ' : 'PN',
                          colClassName: "",
                          itemClassName: "radio-button-title",
                          labelCol: 0,
                          wrapperCols: 8,
                          offset: 2,
                          rules: [ { required: true, message: t("messages.aml.dontForgetSelect"), }, ],
                          item: (
                              <Radio.Group
                              onChange={({ target }) => handleOnChangeRadioButton( "typeSol", target.value ) }
                                // disabled
                              >
                                <Radio value="PJ">
                                  {format === 'html' ? 'Persona Jurídica' : 'P. Jurídica' }
                                </Radio>
                                <Radio value="PN">
                                  {format === 'html' ? 'Persona Natural' : 'P. Natural' }
                                </Radio>
                              </Radio.Group>
                          ),
                        })}

                        {renderFormItem({
                          label: "Proceso",
                          name: "proceso",
                          initialValue: apiForm.proceso,
                          colClassName: "",
                          itemClassName: "radio-button-title",
                          labelCol: 0,
                          wrapperCol: 0,
                          offset: 0,
                          rules: [ { required: true, message: t("messages.aml.dontForgetSelect"), }, ],
                          wrapperCols: 8,
                          offset: 4,
                          item: (
                            <Radio.Group
                              onChange={({ target }) => handleOnChangeRadioButton( "proceso", target.value ) }
                            >
                              <Radio value="CREATE">
                                Creación
                              </Radio>
                              <Radio value="UPDATE">
                                Actualización
                              </Radio>
                            </Radio.Group>
                          ),
                        })}
                    </Row> */}


                {/* FIN RADIOBTN PARA SELECCIONAR TIPO DE PERSONA */}
                    { apiForm.typeSol !== undefined &&
                    <>
                      <Row
                        className="subheader"
                        style={{
                          marginTop: "0px",
                        }}
                      >
                        <Col xl={24}>
                        I. INFORMACIÓN BÁSICA{" "}
                        </Col>
                      </Row>
                      <Row className="content">
                      <Row className="inner-row" gutter={[16, 8]}>
                          <Col className="subsection-title" xs={24}>
                            Identificación
                            <hr/>
                          </Col>
                          {renderFormItemObj({
                            section: basicInformation.basicInfoName,
                            customTitle: apiForm.typeSol === 'PN' ? "Nombre" : "Razón Social"
                          })}

                          {apiForm.typeSol === 'PJ' &&
                            renderFormItemObj({
                            section: basicInformation.basicInfoTipoDoc,
                            options: [
                              { val: "Rut", text: "Rut" },
                            ]
                          })}

                          {apiForm.typeSol === 'PN' &&
                            renderFormItemObj({
                            section: basicInformation.basicInfoTipoDoc,
                            options: [
                              { val: "Documento de Identidad", text: "Documento de Identidad" },
                              { val: "Cédula de Extranjería", text: "Cédula de Extranjería" },
                              { val: "Pasaporte", text: "Pasaporte" },
                            ]
                          })}

                          {renderFormItemObj({
                            section: basicInformation.basicInfoNroDoc,
                          })}

                          {apiForm.typeSol === 'PJ' &&
                            renderFormItemObj({
                              section: basicInformation.basicInfoTipoSociedad,
                              options: [
                                { val: "Sociedad por Acciones", text: "Sociedad por Acciones" },
                                { val: "Sociedad Colectiva ", text: "Sociedad Colectiva" },
                                { val: "Sociedad Anónima", text: "Sociedad Anónima" },
                                { val: "Sociedad de Responsabilidad Limitada", text: "Sociedad de Responsabilidad Limitada" },
                                { val: "Sociedad en Comandita por Acciones", text: "Sociedad en Comandita por Acciones" },
                                { val: "Empresa Individual de Responsabilidad Limitada o Unipersonal", text: "Responsabilidad Limitada o Unipersonal" },
                                { val: "Family Office", text: "Family Office" },
                                { val: "Cooperativa", text: "Cooperativa" },
                                { val: "Comandita Simple", text: "Comandita Simple" },
                              ],
                            })
                          }

                          {apiForm.typeSol === 'PJ' &&
                            renderFormItemObj({
                              section: basicInformation.basicInfoTipoEmpresa,
                              options: [
                                { val: "Privada", text: "Privada" },
                                { val: "Pública", text: "Pública" },
                                { val: "Mixta", text: "Mixta" },
                                { val: "Entidad sin ánimo de lucro", text: "Entidad sin ánimo de lucro" },
                              ]
                            })
                          }

                          {apiForm.typeSol === 'PJ' &&
                            renderFormItemObj({
                              section: basicInformation.basicInfoNombreFantasia,
                              options: [
                                { val: "Privada", text: "Privada" },
                                { val: "Pública", text: "Pública" },
                                { val: "Mixta", text: "Mixta" },
                                { val: "Entidad sin ánimo de lucro", text: "Entidad sin ánimo de lucro" },
                              ]
                            })
                          }

                          {apiForm.typeSol === 'PJ' &&
                            renderFormItemObj({
                              section: basicInformation.basicInfoTamEmpresa,
                              options: [
                                { val: "Microempresa", text: "Microempresa" },
                                { val: "Pequeña", text: "Pequeña" },
                                { val: "Mediana", text: "Mediana" },
                                { val: "Grande", text: "Grande" },
                              ]
                            })
                          }
                          
                          {renderFormItemObj({
                            section: basicInformation.basicInfoPropositoRel,
                            options: [
                              { val: "Activación de marca", text: "Activación de marca" },
                              { val: "Contrato de arrendamiento", text: "Contrato de arrendamiento" },
                              { val: "Contrato de concesión", text: "Contrato de concesión" },
                              { val: "Comodato", text: "Comodato" },
                              { val: "Otro", text: "Otro" },
                            ],
                          })}

                          {basicInformation.basicInfoPropositoRel.val === 'Otro' &&
                            renderFormItemObj({
                            section: basicInformation.basicInfoPropositoRelOtro,
                          })}

                          {apiForm.typeSol === 'PN' &&
                            renderFormItemObj({
                              section: basicInformation.basicInfoNationality,
                              options:
                                paises.map(item => {
                                  return {val: item.country, text: item.country}
                              })
                            })
                          }
                          {apiForm.typeSol === 'PN' &&
                            renderFormItemObj({
                              section: basicInformation.basicInfoProfesion,
                              options: [
                                { val: "Administración de Empresas", text: "Administración de Empresas" },
                                { val: "Derecho", text: "Derecho" },
                                { val: "Mercadotecnia", text: "Mercadotecnia" },
                                { val: "Ciencias políticas", text: "Ciencias políticas" },
                                { val: "Ingeniería en Sistemas", text: "Ingeniería en Sistemas" },
                                { val: "Ingeniería Comercial", text: "Ingeniería Comercial" },
                                { val: "Psicología", text: "Psicología" },
                                { val: "Contaduría", text: "Contaduría" },
                                { val: "Arquitectura", text: "Arquitectura" },
                                { val: "Ingeniería Industrial", text: "Ingeniería Industrial" },
                                { val: "Diseño Gráfico", text: "Diseño Gráfico" },
                                { val: "Medicina", text: "Medicina" },
                                { val: "Ciencias de la Comunicación", text: "Ciencias de la Comunicación" },
                                { val: "Turismo", text: "Turismo" },
                                { val: "Nutrición", text: "Nutrición" },
                                { val: "Comercio Internacional", text: "Comercio Internacional" },
                                { val: "Otros", text: "Otros" },
                              ]
                            })
                          }

                          {basicInformation.basicInfoProfesion.val === 'Otros' && apiForm.typeSol === 'PN' &&
                            renderFormItemObj({
                              section: basicInformation.basicInfoOtraProfesion,
                            })
                          }

                          {apiForm.typeSol === 'PN' &&
                            renderFormItemObj({
                              section: basicInformation.basicInfoOcupacion,
                              options:[
                                { val: "Ama de casa", text: "Ama de casa" },
                                { val: "Desempleado", text: "Desempleado" },
                                { val: "Empleado", text: "Empleado" },
                                { val: "Estudiante", text: "Estudiante" },
                                { val: "Jubilado", text: "Jubilado" },
                                { val: "Miembro de las fuerzas armadas", text: "Miembro de las fuerzas armadas" },
                                { val: "Miembro del clero", text: "Miembro del clero" },
                                { val: "Trabajador del hogar", text: "Trabajador del hogar" },
                                { val: "Trabajador dependiente", text: "Trabajador dependiente" },
                                { val: "Otros", text: "Otros" },
                              ]
                            })
                          }

                          {basicInformation.basicInfoOcupacion.val === 'Otros' && apiForm.typeSol === 'PN' &&
                            renderFormItemObj({
                            section: basicInformation.basicInfoOcupacionOtros,
                          })
                          }

                          {apiForm.typeSol === 'PN' &&
                            renderFormItemObj({
                            section: basicInformation.basicInfoResindencia,
                            options: [
                              { val: "Si", text: "Si" },
                              { val: "No", text: "No" },
                            ]
                          })
                          }

                          {basicInformation.basicInfoResindencia.val === 'Si' && apiForm.typeSol === 'PN' &&
                            renderFormItemObj({
                            section: basicInformation.basicInfoResindenciaPais,
                            options:
                              paises.map(item => {
                                return {val: item.country, text: item.country}
                              })
                            })
                          }

                          {apiForm.typeSol === 'PJ' &&
                            renderFormItemObj({
                            section: basicInformation.basicInfoMtrz,
                            options: [
                              {val:"SI",text:"Si"},
                              {val:"NO",text:"No"},
                            ]
                          })
                          }
                        {basicInformation.basicInfoMtrz.val === "SI" && apiForm.typeSol === 'PJ' && (
                        <>
                          <Col className="subsection-title" span= {24}>
                            Información Casa Matriz
                            <hr/>
                          </Col>
                            {renderFormItemObj({
                                section: basicInformation.basicInfoMtrzName,
                              })
                            }

                            {renderFormItemObj({
                                section: basicInformation.basicInfoMtrzPais,
                                options:
                                paises.map(item => {
                                return {val: item.country, text: item.country}
                              })
                              })
                            }

                            {renderFormItemObj({
                                section: basicInformation.basicInfoMtrzCity,
                              })
                            }

                            {renderFormItemObj({
                                section: basicInformation.basicInfoMtrzDir,
                              })
                            }
                        </>
                        )}
                          <Col className="subsection-title" span= {24}>
                            Ubicación
                            <hr/>
                          </Col>

                          {apiForm.typeSol === 'PJ' &&
                            renderFormItemObj({
                              section: basicInformation.basicInfoWeb,
                          })}

                          {/* FIELD PAIS */}
                          {renderFormItemTable({
                            section: basicInformation.basicInfoPais,
                            options: paises.map(item => {
                              return {val: item.country, text: item.country, code: item.iso2}
                            }),
                              handlerOnChangeObj: (id, value, obj, item) => {
                                handlerOnChangeObjAttr(id, value)
                                if (item && item.props && item.props.code) {
                                  getRegionComunaPromise(item.props.code).then((response) => {
                                    setRegionComuna(response)
                                  })
                                  handlerOnChangeObjAttr(basicInformation.basicInfoCodigoPais.id, item.props.code)
                                }else{
                                  setRegionComuna([])
                                  handlerOnChangeObjAttr(basicInformation.basicInfoCodigoPais.id, null)
                                }
                                setComunas([])
                                setFieldsValue({[basicInformation.basicInfoComuna.id]: null})
                                handlerOnChangeObjAttr(basicInformation.basicInfoComuna.id, null)
                                setFieldsValue({[basicInformation.basicInfoRegion.id]: null})
                                handlerOnChangeObjAttr(basicInformation.basicInfoRegion.id, null)
                              }
                            })
                          }
                      
                          {/* FIELD REGIÓN */}
                          {renderFormItemTable({
                            section: regionComuna.length > 0 ? basicInformation.basicInfoRegion : {...basicInformation.basicInfoRegion, type: 'input'} ,
                            options: regionComuna.map((item) => {
                              return {val: item.name, text: item.name}
                            }),
                              handlerOnChangeObj: (id, value) => {
                                handlerOnChangeObjAttr(id, value)
                                if(value) {
                                  let comunas = regionComuna.filter(e => e.name === value)
                                  if (comunas && comunas.length > 0){
                                    setComunas(comunas[0].comunas)
                                  }else{
                                    setComunas([])
                                  }
                                }
                                setFieldsValue({[basicInformation.basicInfoComuna.id]: null})
                                handlerOnChangeObjAttr(basicInformation.basicInfoComuna.id, null)
                              }
                            })
                            }
                          {/* FIELD COMUNA */}
                          {renderFormItemObj({
                            section: comunas.length > 0 ? basicInformation.basicInfoComuna : {...basicInformation.basicInfoComuna, type: 'input'} ,
                            options: comunas.map((item) => {
                              return {val: item.name, text: item.name}
                            })
                          })}

                          {renderFormItemObj({
                            section: basicInformation.basicInfoDir,
                          })}

                          <Col className="subsection-title" span= {24}>
                            Contacto
                            <hr/>
                          </Col>

                          {apiForm.typeSol === 'PJ' &&
                            renderFormItemObj({
                              section: basicInformation.basicInfoContactName,
                            })
                          }

                          {apiForm.typeSol === 'PJ' &&
                            renderFormItemObj({
                              section: basicInformation.basicInfoCargo,
                            })
                          }

                          {renderFormItemObj({
                            section: basicInformation.basicInfoMail,
                          })}

                          {renderFormItemObj({
                            section: basicInformation.basicInfoTel,
                          })}

                          {apiForm.typeSol === 'PN' &&
                            renderFormItemObj({
                            section: basicInformation.basicInfoCel,
                          })}
                        </Row>
                    </Row>

                    {apiForm.typeSol === 'PJ' && (
                      <Row>
                        <>
                          <Row>
                            <Col className="subsection-title" span= {24}>
                               Información del Representante Legal que firma documento
                              <hr/>
                            </Col>
                          </Row>
                          <Row className="inner-row" gutter={[16, 8]}>
                              {renderFormItemObj({
                                  section: repLegal.repLegalName,
                                })
                              }

                              {renderFormItemObj({
                                section: repLegal.repLegalTipoDoc,
                                options: [
                                  {val: "Documento de Identidad" , text:"Documento de Identidad"},
                                  {val: "Cédula de Extranjería" , text:"Cédula de Extranjería"},
                                  {val: "Pasaporte" , text:"Pasaporte"},
                                ],
                              })
                              }

                              {renderFormItemObj({
                                section: repLegal.repLegalNroId,
                              })
                              }

                            {/*
                              {renderFormItemObj({
                                section: repLegal.repLegalExpDate,
                              })
                              }

                              {renderFormItemObj({
                                section: repLegal.repLegalExpPlace,
                              })}


                              {renderFormItemObj({
                                section: repLegal.repLegalBirthPlace,
                              })}
                            */}

                              {renderFormItemObj({
                                section: repLegal.repLegalFecNac,
                              })}

                              {renderFormItemObj({
                                section: repLegal.repLegalNation,
                                options:
                                paises.map(item => {
                                  return {val: item.country, text: item.country}
                                })
                              })}

                              {renderFormItemObj({
                                section: repLegal.repLegalProfesion,
                              })}

                              {renderFormItemObj({
                                section: repLegal.repLegalAccionista,
                                options: [
                                  {val: "SI", text:"Si"},
                                  {val: "NO", text:"No"},
                                ],
                              })}

                              {renderFormItemObj({
                                section: repLegal.repLegalCorreo,
                              })}

                              {renderFormItemObj({
                                section: repLegal.repLegalTel,
                              })}
                          </Row>
                        </>
                      </Row>
                    )}

                
                  <>
                    <Row className="subheader">
                      <Col xl={24}>
                        II. INFORMACIÓN SOBRE LA ACTIVIDAD ECONÓMICA
                      </Col>
                    </Row>
                    <div className="content">
                      {format === "html" && !signed && (
                        <>
                        <Row gutter={[16, 8]}>
                        {/* ↓ CAMPO INICIO DE ACTIVIDADES ↓ */}
                          {renderFormItemTable({section: infoEco.infoEcoInitAct, handlerOnChangeObj: (id, value) => {
                              handlerOnChangeObjAttr(id, value)
                              if(value) {
                                var now = moment(new Date());
                                var end = moment(value, "DD/MM/YYYY");
                                var duration = moment.duration(now.diff(end));
                                var years = ""+Math.floor(duration.asYears())
                                if(years < 0){
                                  years = "0"
                                }
                                setFieldsValue({[infoEco.infoEcoAniosExp.id]: years})
                                handlerOnChangeObjAttr(infoEco.infoEcoAniosExp.id, years)
                              }
                            }})
                          }

                          {/* ↓CAMPO ANIOS DE EXPERIENCIA↓ */}
                          {renderFormItemObj({
                              section: infoEco.infoEcoAniosExp,
                              val: console.log(moment().diff(infoEco.infoEcoInitAct.val, 'days'))
                            })
                          }
                          
                            {/* {renderFormItemTable({
                              section: prodAct.prodActDescripcion,
                              cols: 19,
                              options: SIIActivities.map(item => {
                                return {val: item.codigo+"|"+ item.descripcion, text: item.codigo+" - "+ item.descripcion}
                              }),
                            })} */}

                            {/* <Col className="button-col" xl={2}>
                              <Button type="primary" htmlType="button" onClick={()=> handleOnAddAttrTable('prodAct', 'infoEco', 'actRecords')} icon="plus" > Añadir </Button>
                            </Col>
                            <Col className="button-col" xl={2}>
                              <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('prodAct')}> Limpiar </Button>
                            </Col> */}
                          </Row>
                        </>
                      )}

                        {/* {infoEco.infoEcoActRecords.val.length > 0 &&
                        <Table columns={prodActColums} dataSource={infoEco.infoEcoActRecords.val} size="middle" pagination={false} ></Table>
                        } */}

                      {format === "html" && !signed && (
                        <>
                          <Row gutter={[16, 8]}>
                            {renderFormItemTable({
                              section: activityEsp.activityEspAct,
                              cols: 14,
                              options:
                                actividades.map(item => {
                                  return {val: item, text: item}
                                })
                            })}

                            { activityEsp.activityEspAct.val === 'No realiza ninguna de las actividades señaladas' &&
                              <Col span={5}></Col>
                            }

                            { activityEsp.activityEspAct.val !== 'No realiza ninguna de las actividades señaladas' &&
                              renderFormItemTable({
                              section: activityEsp.activityEspPais,
                              cols: 5,
                              options:
                              paises.map(item => {
                                return {val: item.country, text: item.country}
                              })
                            })}

                            <Col className="button-col" xl={2}>
                              <Button type="primary" htmlType="button" onClick={()=> handleOnAddAttrTable('activityEsp', 'infoEco', 'actEspRecords')} icon="plus" > Añadir </Button>
                            </Col>
                            <Col className="button-col" xl={2}>
                              <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('activityEsp')}> Limpiar </Button>
                            </Col>

                            {infoEco.infoEcoActEspRecords.val.length < 1 &&
                              validarRegistros && (
                                <Col
                                  span={24}
                                  style= {{color: 'red'}}
                                  className="missing-registers ant-form-explain"
                                >
                                  {t("messages.aml.registersRequired")}
                                </Col>
                            )}
                          </Row>
                        </>
                      )}

                        {infoEco.infoEcoActEspRecords.val.length > 0 &&
                          <Table columns={activityEspColums} dataSource={infoEco.infoEcoActEspRecords.val} size="middle" pagination={false} ></Table>
                        }
                    </div>
                  </>
                

                    {/* <Row className="inner-row" gutter={[16, 8]}>
                      {renderFormItemObj({
                        section: infoEco.infoEcoAct,
                        options: [
                          {val:"prod/bienes" , text: "Productos / Bienes"},
                          {val:"servicios" , text: "Servicios"},
                        ],
                        cols: 8
                      })}
                      {renderFormItemObj({
                        section: infoEco.infoEcoEsp,
                        cols: 16,
                        options: [
                          {val:"fabricante" , text: "Fabricante"},
                          {val:"importador" , text: "Importador"},
                          {val: "exportador", text: "Exportador"},
                          {val: "administrador de fondos", text: "Administrador de Fondos"},
                          {val: "corredor", text: "Corredor"},
                          {val:"intermediario" , text: "Intermediario"},
                          {val:"distribuidor" , text: "Distribuidor"},
                      ]
                      })}
                      <Row>
                        <Col className="question-title"  style={{marginLeft: 10}} span={9}>
                          Por su actividad ¿realiza operaciones internacionales?
                        </Col>
                        {renderFormItem({
                          label: "",
                          name: "hasExOp",
                          colClassName: "switch-col",
                          itemClassName: "radio-item-flat",
                          labelCol: 0,
                          wrapperCol: 0,
                          offset: 0,
                          initialValue: infoEco.infoEcoHasExOp.val,
                          rules: [
                            {
                              required: true,
                              message: t("messages.aml.dontForgetSelect"),
                            },
                          ],
                          wrapperCols: 13,
                          item: (
                            <Radio.Group
                              onChange={({ target }) =>
                                handlerOnChangeObjAttr(
                                  "infoEcoHasExOp",
                                  target.value
                                )
                              }
                            >
                              <Radio value={true}>
                                Sí
                              </Radio>
                              <Radio value={false}>
                                No
                              </Radio>
                            </Radio.Group>
                          ),
                        })}
                      </Row>
                      {infoEco.infoEcoHasExOp.val && (
                        <Row>
                          <div className="content">
                            {(match.params.view === undefined ||
                              match.params.view === "html") && (
                              <>
                                <Row className="" gutter={[16, 8]}>
                                  {renderFormItemObj({
                                    section: infoEco.infoEcoOperacion,
                                    cols: 18,
                                    options: [
                                      {val:"importacion", text:"Importación"},
                                      {val:"exportacion", text:"Exportación"},
                                      {val:"pago servicios", text:"Pago de Servicios"},
                                      {val:"prestamos", text:"Préstamos"},
                                      {val:"inversiones", text:"Inversiones"},
                                      {val:"otros", text:"Otros"},
                                    ]
                                  })}

                                  { infoEco.infoEcoOperacion.val.includes('otros') &&
                                    renderFormItemObj({
                                    section: infoEco.infoEcoOtros,
                                  })}
                                </Row>
                                </>
                            )}
                          </div>
                        </Row>
                      )}
                    </Row> */}

                    {apiForm.typeSol === 'PJ' &&
                      <>
                        <Row className="subheader">
                          <Col xl={24}>
                            III. INFORMACIÓN FINANCIERA
                          </Col>
                        </Row>
                        <div className="content">
                          <Row className="" gutter={[16, 8]}>
                            {renderFormItemObj({
                              section: infoFinanciera.infoFinancieraAnio,
                            })}
                            {renderFormItemObj({
                              section: infoFinanciera.infoFinancieraIngreso
                            })}
                            {renderFormItemObj({
                              section: infoFinanciera.infoFinancieraEgreso
                            })}
                            {renderFormItemObj({
                              section: infoFinanciera.infoFinancieraActivos
                            })}
                            {renderFormItemObj({
                              section: infoFinanciera.infoFinancieraPasivos
                            })}
                            {renderFormItemObj({
                              section: infoFinanciera.infoFinancieraUtilidad
                            })}
                            {renderFormItemObj({
                              section: infoFinanciera.infoFinancieraNroEmpleados
                            })}
                          </Row>
                        </div>
                      </>
                    }

                    <Row className="subheader">
                      <Col xl={24}>
                        {apiForm.typeSol === 'PJ' ? "IV." : "III."} INFORMACIÓN TRIBUTARIA
                      </Col>
                    </Row>
                    <Row className="inner-row" gutter={[16, 8]}>

                        {apiForm.typeSol === 'PN' &&
                          renderFormItemObj({
                          section: infoEco.infoEcoTipoContri,
                          options: [
                            {val:"Trabajador independiente" , text: "Trabajador independiente"},
                            {val:"Empresario individual" , text: "Empresario individual"},
                            {val:"Empleado" , text: "Empleado"},
                            {val:"Pensionado" , text: "Pensionado"},
                          ],
                        })}

                        {apiForm.typeSol === 'PJ' &&
                          renderFormItemObj({
                          section: infoEco.infoEcoTipoContri,
                          options: [
                            {val:"Microempresa" , text: "Microempresa"},
                            {val:"Pequeña empresa" , text: "Pequeña empresa"},
                            {val:"Mediana empresa" , text: "Mediana empresa"},
                            {val:"Gran contribuyente" , text: "Gran contribuyente"},
                          ],
                        })}

                        {renderFormItemObj({
                          section: infoEco.infoEcoRegimen,
                        })}

                        {renderFormItemObj({
                          section: infoEco.infoEcoResolucion,
                        })}


                        {renderFormItemObj({
                          section: infoEco.infoEcoFiscalObligations,
                          options: [
                            {val:"Sí" , text: "Si"},
                            {val:"No" , text: "No"},
                          ]
                        })}

                        {infoEco.infoEcoFiscalObligations.val === "Sí" &&
                          renderFormItemObj({
                            section: infoEco.infoEcoFisObligationsCountry,
                            options:
                              paises.map(item => {
                              return {val: item.country, text: item.country}
                            })
                        })}

                      </Row>
                      <Row className="subheader">
                        <Col xl={24}>
                          {apiForm.typeSol === 'PJ' ? "V." : "IV."} INFORMACIÓN SOBRE CUENTAS EN MONEDA EXTRANJERA
                        </Col>
                      </Row>
                      <Row>
                        <Col className="question-title" span={20}>
                          ¿Posee cuentas en moneda extranjera en países diferentes al domicilio?
                        </Col>
                        {renderFormItem({
                          label: "",
                          colClassName: "switch-col",
                          itemClassName: "radio-item-flat",
                          name: "infoEcoHasExMon",
                          labelCol: 0,
                          wrapperCol: 0,
                          offset: 1,
                          initialValue: infoEco.infoEcoHasExMon.val,
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
                                handlerOnChangeObjAttr(
                                  "infoEcoHasExMon",
                                  target.value
                                )
                              }
                            >
                              <Radio style={radioStyle} value={true}>
                                Sí
                              </Radio>
                              <Radio style={radioStyle} value={false}>
                                No
                              </Radio>
                            </Radio.Group>
                          ),
                        })}
                      </Row>
                      {infoEco.infoEcoHasExMon.val && (
                          <div className="content">
                            {format === "html" && !signed && (
                              <>
                                <Row className="" gutter={[16, 8]}>
                                  {renderFormItemTable({
                                    section: infoMo.infoMoTipoProd,
                                    options: [
                                      {val:"Cuenta Corriente", text:"Cuenta Corriente"},
                                      {val:"Cuenta Ahorro", text:"Cuenta Ahorro"},
                                    ],
                                    cols: 5
                                  })}
                                  {renderFormItemTable({
                                    section: infoMo.infoMoTipoMon,
                                    cols: 5
                                  })}
                                  {renderFormItemTable({
                                    section: infoMo.infoMoEntity,
                                    cols: 5
                                  })}
                                  {renderFormItemTable({
                                    section: infoMo.infoMoNroCuenta,
                                    cols: 5
                                  })}
                                  {renderFormItemTable({
                                    section: infoMo.infoMoCountry,
                                    cols: 4,
                                    options:
                                    paises.map(item => {
                                      return {val: item.country, text: item.country}
                                    })
                                  })}
                                </Row>

                                <Row className="button-row">
                                  {infoEco.infoEcoExMonRecords.val.length < 1 &&
                                    validarRegistros && (
                                      <Col
                                        span={24}
                                        style= {{color: 'red'}}
                                        className="missing-registers ant-form-explain"
                                      >
                                        {t("messages.aml.registersRequired")}
                                      </Col>
                                    )}

                                  <Col className="addRelation" xl={3}>
                                    <Button type="primary" htmlType="button" onClick={()=> handleOnAddAttrTable('infoMo', 'infoEco', 'exMonRecords')} icon="plus" > Añadir </Button>
                                  </Col>
                                  <Col className="addRelation" xl={3}>
                                    <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('infoMo')} > Limpiar </Button>
                                  </Col>
                                </Row>
                              </>
                            )}

                            {infoEco.infoEcoExMonRecords.val.length > 0 && format === "html" ?
                              <Table columns={infoEcoColums} dataSource={infoEco.infoEcoExMonRecords.val} size="middle" pagination={false} ></Table>
                              :
                              toDescriptionsPdf( infoEco.infoEcoExMonRecords.val, infoMo)
                            }
                          </div>
                      )}

                        <Row className="subheader">
                          <Col xl={24}>
                            { apiForm.typeSol === 'PJ' ? 'VI.' : 'V.' } INFORMACIÓN RESPECTO AL ORIGEN DE FONDOS
                          </Col>
                        </Row>
                        <div className="content">
                          <Row className="summary">
                            <Col xl={24}>
                              {apiForm.typeSol === 'PJ' ?
                                  <p>
                                    De acuerdo a la normativa y al programa de cumplimiento establecido en la empresa, debemos asegurar que
                                    las operaciones a ser realizadas a lo largo de la relación contractual correspondan con el propósito declarado,
                                    su giro comercial y perfil de riesgo, incluyendo el origen de los fondos. Para ello le agradecemos entregar
                                    la siguiente información:
                                  </p>
                                :
                                  <p>
                                    De acuerdo a la normativa y al programa de cumplimiento establecido en la empresa,
                                    debemos asegurar que las operaciones a ser realizadas a lo largo de la relación
                                    contractual correspondan con el propósito declarado y perfil de riesgo, incluyendo
                                    el origen de los fondos. Para ello le agradecemos entregar la siguiente información:
                                  </p>
                              }
                            </Col>
                          </Row>

                            <Row className="check-grid" gutter={[16, 8]}>
                              {apiForm.typeSol === 'PJ' ?
                                renderFormItemObj({
                                section: fondos.fondosOrigenRecursos,
                                colsOption: format === 'html' ? 8 : 12,
                                options: [
                                  {val: "Actividad propia de la sociedad", text: "Actividad propia de la sociedad"},
                                  {val: "Aporte de socios", text: "Aporte de socios"},
                                  {val: "Financiamiento", text: "Financiamiento"},
                                  {val: "Transferencia desde otra entidad", text: "Transferencia desde otra entidad"},
                                  {val: "Administración de inversiones", text: "Administración de inversiones"},
                                  {val: "Donaciones", text: "Donaciones"},
                                  {val: "Otros", text: "Otros"},
                                ],
                                cols: 24,
                               })
                               :
                               renderFormItemObj({
                                section: fondos.fondosOrigenRecursos,
                                colsOption: format === 'html' ? 8 : 12,
                                options: [
                                  {val: "Ahorros", text: "Ahorros"},
                                  {val: "Honorarios profesionales", text: "Honorarios profesionales"},
                                  {val: "Remuneraciones en relación de dependencia ", text: "Remuneraciones en relación de dependencia "},
                                  {val: "Préstamo de Institución Financiera", text: "Préstamo de Institución Financiera"},
                                  {val: "Préstamo de una Institución No Financiera", text: "Préstamo de una Institución No Financiera"},
                                  {val: "Venta de bienes propios", text: "Venta de bienes propios"},
                                  {val: "Alquileres percibidos según contrato", text: "Alquileres percibidos según contrato"},
                                  {val: "Renta por Jubilación o Pensión", text: "Renta por Jubilación o Pensión"},
                                  {val: "Prestaciones Públicas", text: "Prestaciones Públicas"},
                                  {val: "Remesas", text: "Remesas"},
                                  {val: "Herencia", text: "Herencia"},
                                  {val: "Inversiones a titulo personal", text: "Inversiones a titulo personal"},
                                  {val: "Utilidades", text: "Utilidades"},
                                  {val: "Otros", text: "Otros"},
                                ],
                                cols: 24,
                              })
                              }

                              {fondos.fondosOrigenRecursos.val && fondos.fondosOrigenRecursos.val.includes("Otros") &&
                                renderFormItemObj({
                                section: fondos.fondosOrigenRecursosOtro,
                                cols: 24,
                              })}

                              {renderFormItemObj({
                                section: fondos.fondosMediosPago,
                                colsOption:8,
                                options: [
                                  {val: "Efectivo", text: "Efectivo"},
                                  {val: "Letra de Cambio", text: "Letra de Cambio"},
                                  {val: "Cheque", text: "Cheque"},
                                  {val: "Transferencia de fondos", text: "Transferencia de fondos"},
                                  {val: "Otros", text: "Otros"},
                                ],
                                cols: 24,
                              })}

                              {fondos.fondosMediosPago.val && fondos.fondosMediosPago.val.includes("Otros") &&
                                renderFormItemObj({
                                section: fondos.fondosMediosPagoOtro,
                                cols: 24
                              })}
                            </Row>
                          </div>

                      <Row className="subheader">
                        <Col xl={24}>
                          {apiForm.typeSol === 'PJ' ? 'VII.' : 'VI.'} INFORMACIÓN DE PERSONA EXPUESTA POLÍTICAMENTE O PÚBLICAMENTE (PEP)
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col xl={24}>
                          {apiForm.typeSol === 'PN' ?
                          "Sección que tiene como objetivo identificar aquellas personas que desempeñan o han desempeñado funciones públicas destacadas durante los últimos 12 meses."
                          :
                          "Sección que tiene como objetivo identificar aquellas personas que ocupan el cargo de director, administrador, representante legal, miembro de junta directiva, accionista, socios con participación directa o indirecta con más del 5% capital social, y que desempeñan o han desempeñado funciones públicas destacadas durante los últimos 12 meses."
                          }
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col span={20}>
                        {apiForm.typeSol === 'PN' ?
                         "Desempeño o he desempeñado en el último año funciones públicas destacadas, en el país o en el extranjero"
                         :
                         "En alguno de los grupos antes mencionados existe una persona que desempeñe o haya desempeñado en el último año funciones públicas destacadas, en el país o en el extranjero"
                        }
                        </Col>
                        {renderFormItem({
                          label: "",
                          colClassName: "switch-col",
                          itemClassName: "radio-item-flat",
                          name: "infoPepIsPublic",
                          labelCol: 0,
                          wrapperCol: 0,
                          offset: 1,
                          initialValue: infoPep.infoPepIsPublic.val,
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
                                handlerOnChangeObjAttr(
                                  "infoPepIsPublic",
                                  target.value
                                )
                              }
                            >
                              <Radio style={radioStyle} value={true}>
                                Sí
                              </Radio>
                              <Radio style={radioStyle} value={false}>
                                No
                              </Radio>
                            </Radio.Group>
                          ),
                        })
                        }
                      </Row>
                      {infoPep.infoPepIsPublic.val && (
                          <div className="content">
                            {format === "html" && !signed && (
                              <>
                                {apiForm.typeSol === 'PJ' ?
                                  <Row gutter={[16, 8]}>
                                    {renderFormItemTable({
                                      section: pepPublicObj.pepPublicGrupo,
                                      options:[
                                        {val: "Director", text: "Director"},
                                        {val: "Administrador", text: "Administrador"},
                                        {val: "Rep. Legal", text: "Representante Legal"},
                                        {val: "Miembro de Junta", text: "Miembro de Junta"},
                                        {val: "Directiva", text: "Directiva"},
                                        {val: "Accionista", text: "Accionista"},
                                        {val: "Socio", text: "Socio"},
                                      ],
                                      cols: 6
                                    })}

                                    {renderFormItemTable({
                                      section: pepPublicObj.pepPublicName,
                                      cols: 6
                                    })}

                                    {renderFormItemTable({
                                      section: pepPublicObj.pepPublicTipoId,
                                      options: [
                                        {val: "Documento de identidad", text: "Documento de identidad"},
                                        {val: "Cédula de extranjería", text: "Cédula de extranjería"},
                                        {val: "Pasaporte", text: "Pasaporte"},
                                      ],
                                      cols: 6
                                    })}

                                    {renderFormItemTable({
                                      section: pepPublicObj.pepPublicNroId,
                                      cols: 6
                                    })}

                                    {renderFormItemTable({
                                      section: pepPublicObj.pepPublicOrgPublic,
                                      cols: 6
                                    })}

                                    {renderFormItemTable({
                                      section: pepPublicObj.pepPublicPais,
                                      cols: 6,
                                      options:
                                      paises.map(item => {
                                        return {val: item.country, text: item.country}
                                      })
                                    })}

                                    {renderFormItemTable({
                                      section: pepPublicObj.pepPublicCargo,
                                      customTitle: 'Cargo Funcionario Público',
                                      cols: 6
                                    })}

                                    {renderFormItemTable({
                                      section: pepPublicObj.pepPublicFecTermino,
                                      cols: 6
                                    })}
                                  </Row>

                                  :

                                  <Row gutter={[16, 8]}>
                                      {renderFormItemTable({
                                        section: pepPublicObj.pepPublicOrgPublic,
                                        cols: 6
                                      })}

                                      {renderFormItemTable({
                                        section: pepPublicObj.pepPublicCargo,
                                        customTitle: 'Cargo',
                                        cols: 6
                                      })}

                                      {renderFormItemTable({
                                        section: pepPublicObj.pepPublicPais,
                                        cols: 6,
                                        options:
                                        paises.map(item => {
                                          return {val: item.country, text: item.country}
                                        })
                                      })}

                                      {renderFormItemTable({
                                        section: pepPublicObj.pepPublicFecTermino,
                                        cols: 6
                                      })}
                                    </Row>
                                }
                                <Row className="button-row">
                                  {infoPep.infoPepPublicRecords.val.length < 1 &&
                                    validarRegistros && (
                                      <Col
                                        span={24}
                                        style= {{color: 'red'}}
                                        className="missing-registers ant-form-explain"
                                      >
                                        {t("messages.aml.registersRequired")}
                                      </Col>
                                    )}

                                  <Col className="addRelation" xl={3}>
                                    <Button type="primary" htmlType="button" onClick={()=> handleOnAddAttrTable('pepPublicObj', 'infoPep', 'publicRecords')} icon="plus" > Añadir </Button>
                                  </Col>
                                  <Col className="addRelation" xl={3}>
                                    <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('pepPublicObj')}> Limpiar </Button>
                                  </Col>
                                </Row>
                              </>
                            )}

                            {infoPep.infoPepPublicRecords.val.length > 0 && format === "html" ?
                              <Table columns={getPepPublicColumns()} dataSource={infoPep.infoPepPublicRecords.val} size="middle" pagination={false} ></Table>
                              :
                              toDescriptionsPdf( infoPep.infoPepPublicRecords.val, pepPublicObj, apiForm.typeSol )
                            }
                          </div>
                      )}

                      <Row className="summary">
                        <Col span={20}>
                          {apiForm.typeSol === 'PN' ?
                            "Poseo un cónyuge o pariente hasta el segundo grado de consanguinidad (abuelo(a), padre, madre, hijo(a), hermano(a), nieto(a)), que desempeña o ha desempeñado en el último año funciones públicas destacadas, en el país o en el extranjero"
                            :
                            "En alguno de los grupos antes mencionados existe una persona que posea un cónyuge o pariente hasta el segundo grado de consanguinidad (abuelo(a), padre, madre, hijo(a), hermano(a), nieto(a)), que desempeñe o haya desempeñado en el último año funciones públicas destacadas, en el país o en el Extranjero"
                          }
                        </Col>
                        {renderFormItem({
                          label: "",
                          colClassName: "switch-col",
                          itemClassName: "radio-item-flat",
                          name: "infoPepHasFamily",
                          labelCol: 0,
                          wrapperCol: 0,
                          offset: 1,
                          initialValue: infoPep.infoPepHasFamily.val,
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
                                handlerOnChangeObjAttr(
                                  "infoPepHasFamily",
                                  target.value
                                )
                              }
                            >
                              <Radio style={radioStyle} value={true}>
                                Sí
                              </Radio>
                              <Radio style={radioStyle} value={false}>
                                No
                              </Radio>
                            </Radio.Group>
                          ),
                        })}
                      </Row>

                      {infoPep.infoPepHasFamily.val && (
                          <div className="content">
                            {format === "html" && !signed && (
                              <>
                                <Row gutter={[16, 8]}>

                                {apiForm.typeSol === 'PJ' &&
                                    renderFormItemTable({
                                    section: pepFamilyObj.pepFamilyGrupo,
                                    options:[
                                      {val: "Director", text: "Director"},
                                      {val: "Administrador", text: "Administrador"},
                                      {val: "Rep. Legal", text: "Representante Legal"},
                                      {val: "Miembro de Junta", text: "Miembro de Junta"},
                                      {val: "Directiva", text: "Directiva"},
                                      {val: "Accionista", text: "Accionista"},
                                      {val: "Socio", text: "Socio"},
                                    ],
                                    cols: 6
                                  })}

                                  {renderFormItemTable({
                                    section: pepFamilyObj.pepFamilyOrgPublic,
                                    cols: 6
                                  })}

                                  {renderFormItemTable({
                                    section: pepFamilyObj.pepFamilyPais,
                                    cols: 6,
                                    options:
                                    paises.map(item => {
                                      return {val: item.country, text: item.country}
                                    })
                                  })}

                                  {renderFormItemTable({
                                    section: pepFamilyObj.pepFamilyParentesco,
                                    cols: 6,
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
                                    section: pepFamilyObj.pepFamilyNamePublicFunc,
                                    cols: 6
                                  })}

                                  {renderFormItemTable({
                                    section: pepFamilyObj.pepFamilyNroIdPublicFunc,
                                    cols: 6
                                  })}

                                  {renderFormItemTable({
                                    section: pepFamilyObj.pepFamilyCargo,
                                    cols: 6
                                  })}

                                  {renderFormItemTable({
                                    section: pepFamilyObj.pepFamilyFecTermino,
                                    cols: 6
                                  })}
                                </Row>

                                <Row className="button-row">
                                  {infoPep.infoPepFamilyRecords.val.length < 1 &&
                                    validarRegistros && (
                                      <Col
                                        span={24}
                                        style= {{color: 'red'}}
                                        className="missing-registers ant-form-explain"
                                      >
                                        {t("messages.aml.registersRequired")}
                                      </Col>
                                    )}

                                  <Col className="addRelation" xl={3}>
                                    <Button type="primary" htmlType="button" onClick={()=> handleOnAddAttrTable('pepFamilyObj', 'infoPep', 'familyRecords')} icon="plus" > Añadir </Button>
                                  </Col>
                                  <Col className="addRelation" xl={3}>
                                    <Button type="primary" htmlType="button" icon="delete" onClick={(e)=>handleOnClear('pepFamilyObj')}> Limpiar </Button>
                                  </Col>
                                </Row>
                              </>
                            )}

                            {infoPep.infoPepFamilyRecords.val.length > 0 && format === "html" ?
                              <Table columns={getPepFamilyColumns()} dataSource={infoPep.infoPepFamilyRecords.val} size="middle" pagination={false} ></Table>
                              :
                              toDescriptionsPdf( infoPep.infoPepFamilyRecords.val, pepFamilyObj, apiForm.typeSol )
                            }
                          </div>
                      )}

                      <Row className="summary">
                        <Col span={20}>
                          {apiForm.typeSol === 'PN' ?
                          "He celebrado un pacto de actuación conjunta que otorgue poder de voto suficiente para influir en sociedades constituidas dentro del país, con una persona que desempeña o ha desempeñado en el último año funciones públicas destacadas, en el país o en el Extranjero."
                          :
                          "En alguno de los grupos antes mencionados existe una persona que ha celebrado un pacto de actuación conjunta que otorgue poder de voto suficiente para influir en sociedades constituidas en Chile, con una persona que desempeñe o haya desempeñado en el último año funciones públicas destacadas, en el país o en el Extranjero."
                          }
                        </Col>
                        {renderFormItem({
                          label: "",
                          colClassName: "switch-col",
                          itemClassName: "radio-item-flat",
                          name: "infoPepHasRelation",
                          labelCol: 0,
                          wrapperCol: 0,
                          offset: 1,
                          initialValue: infoPep.infoPepHasRelation.val,
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
                                handlerOnChangeObjAttr(
                                  "infoPepHasRelation",
                                  target.value
                                )
                              }
                            >
                              <Radio style={radioStyle} value={true}>
                                Sí
                              </Radio>
                              <Radio style={radioStyle} value={false}>
                                No
                              </Radio>
                            </Radio.Group>
                          ),
                        })}
                      </Row>

                      {infoPep.infoPepHasRelation.val && (
                          <div className="content">
                            {format === "html" && !signed && (
                              <>
                                {apiForm.typeSol === 'PJ' ?
                                    <Row className="" gutter={[16, 8]}>
                                    {renderFormItemTable({
                                        section: pepRelationObj.pepRelationGrupo,
                                        options:[
                                          {val: "Director", text: "Director"},
                                          {val: "Administrador", text: "Administrador"},
                                          {val: "Rep. Legal", text: "Representante Legal"},
                                          {val: "Miembro de Junta", text: "Miembro de Junta"},
                                          {val: "Directiva", text: "Directiva"},
                                          {val: "Accionista", text: "Accionista"},
                                          {val: "Socio", text: "Socio"},
                                        ],
                                        cols: 6
                                      })}

                                      {renderFormItemTable({
                                        section: pepRelationObj.pepRelationName,
                                        cols: 6
                                      })}

                                      {renderFormItemTable({
                                        section: pepRelationObj.pepRelationTipoId,
                                        options: [
                                          {val: "Documento de identidad", text: "Documento de identidad"},
                                          {val: "Cédula de extranjería", text: "Cédula de extranjería"},
                                          {val: "Pasaporte", text: "Pasaporte"},
                                        ],
                                        cols: 6
                                      })}

                                      {renderFormItemTable({
                                        section: pepRelationObj.pepRelationNroId,
                                        cols: 6
                                      })}

                                      {renderFormItemTable({
                                        section: pepRelationObj.pepRelationEmpresa,
                                        cols: 6
                                      })}

                                      {renderFormItemTable({
                                        section: pepRelationObj.pepRelationTipoRelacion,
                                        cols: 6
                                      })}

                                      {renderFormItemTable({
                                        section: pepRelationObj.pepRelationPais,
                                        options:
                                        paises.map(item => {
                                          return {val: item.country, text: item.country}
                                        }),
                                        cols: 6
                                      })}

                                      {renderFormItemTable({
                                        section: pepRelationObj.pepRelationNroIdEmp,
                                        cols: 6,
                                      })}
                                    </Row>
                                  :
                                    <Row className="" gutter={[16, 8]}>
                                      {renderFormItemTable({
                                        section: pepRelationObj.pepRelationEmpresa,
                                        cols: 6
                                      })}

                                      {renderFormItemTable({
                                        section: pepRelationObj.pepRelationNroIdEmp,
                                        cols: 6,
                                      })}

                                      {renderFormItemTable({
                                        section: pepRelationObj.pepRelationTipoRelacion,
                                        cols: 6
                                      })}

                                      {renderFormItemTable({
                                        section: pepRelationObj.pepRelationPais,
                                        options:
                                        paises.map(item => {
                                          return {val: item.country, text: item.country}
                                        }),
                                        cols: 6
                                      })}
                                    </Row>
                                }

                                <Row className="button-row">
                                  {infoPep.infoPepRelationRecords.val.length < 1 &&
                                    validarRegistros && (
                                      <Col
                                        span={24}
                                        style= {{color: 'red'}}
                                        className="missing-registers ant-form-explain"
                                      >
                                        {t("messages.aml.registersRequired")}
                                      </Col>
                                    )}

                                  <Col className="addRelation" xl={3}>
                                    <Button type="primary" htmlType="button" onClick={()=> handleOnAddAttrTable('pepRelationObj', 'infoPep', 'relationRecords')} icon="plus" > Añadir </Button>
                                  </Col>
                                  <Col className="addRelation" xl={3}>
                                    <Button type="primary" htmlType="button" icon="delete" onClick={()=>handleOnClear('pepRelationObj')}> Limpiar </Button>
                                  </Col>
                                </Row>
                              </>
                            )}

                            {infoPep.infoPepRelationRecords.val.length > 0 && format === "html" ?
                              <Table columns={getPepRelationColumns()} dataSource={infoPep.infoPepRelationRecords.val} size="middle" pagination={false} ></Table>
                              :
                              toDescriptionsPdf( infoPep.infoPepRelationRecords.val, pepRelationObj, apiForm.typeSol )
                            }
                          </div>
                      )}

                      <Row className="summary">
                        <Col span={21}>
                          <strong>Funciones públicas destacadas:</strong>
                          <ol>
                            <li> Presidente de la República. </li>
                            <li> Senadores, Diputados y Alcaldes.</li>
                            <li> Ministros de la Corte Suprema y Cortes de Apelaciones.</li>
                            <li> Ministros de Estado, Subsecretarios, Intendentes, Gobernadores, Secretarios Regionales Ministeriales,
                              Embajadores, Jefes Superiores de Servicio, tanto centralizados como descentralizados y
                              el directivo superior inmediato que deba subrogar a cada uno de ellos.</li>
                            <li> Comandantes en Jefe de las Fuerzas Armadas, Director General Carabineros,
                              Director General de Investigaciones, y el oficial superior inmediato que deba subrogar a cada uno de ellos.</li>
                            <li> Fiscal Nacional del Ministerio Público y Fiscales Regionales.</li>
                            <li> Contralor General de la República.</li>
                            <li> Consejeros del Banco Centra.</li>
                            <li> Consejeros del Consejo de Defensa del Estado.</li>
                            <li> Ministros del Tribunal Constitucional.</li>
                            <li> Ministros del Tribunal de la Libre Competencia.</li>
                            <li> Integrantes titulares y suplentes del Tribunal de Contratación Pública.</li>
                            <li> Consejeros del Consejo de Alta Dirección Pública.</li>
                            <li> Los directores y ejecutivos principales de empresas públicas.</li>
                            <li> Directores de sociedades anónimas nombrados por el Estado.</li>
                          </ol>

                        </Col>
                      </Row>

                      {apiForm.typeSol === 'PJ' &&
                       <>
                        <Row className="subheader">
                          <Col xl={24}>
                            VIII. IDENTIFICACIÓN DE LOS BENEFICIARIOS FINALES.
                          </Col>
                        </Row>
                        <div className="content">
                          <Row className="summary">
                            <Col xl={24}>
                            Se entenderá como Beneficiarios finales a la(s) persona(s) natural(es)
                            que finalmente posee, directa o indirectamente, a través de sociedades u otros mecanismos,
                            una participación igual o mayor al 5% del capital o de los derechos a voto de una persona jurídica determinada.
                            Asimismo, se entenderá como Beneficiario Final a la(s) persona(s) natural(es) que,
                            sin perjuicio de poseer directa o indirectamente una participación inferior al 5% del capital o de los derechos
                            a voto de una persona jurídica, a través de sociedades u otros mecanismos,
                            ejerce el control efectivo de la persona o estructura jurídica.
                            solicitados
                            </Col>
                          </Row>
                          {format === "html" && !signed &&
                            <>
                            <Row className="" gutter={[16, 8]}>
                              {renderFormItemTable({
                                section: benFinObj.benFinObjNom
                              })}
                              {renderFormItemTable({
                                section: benFinObj.benFinObjPais,
                                options:
                                paises.map(item => {
                                return {val: item.country, text: item.country}
                              })
                              })}
                              {renderFormItemTable({
                                section: benFinObj.benFinObjNacionalidad,
                                options:
                                paises.map(item => {
                                return {val: item.country, text: item.country}
                              })
                              })}
                              {renderFormItemTable({
                                section: benFinObj.benFinObjTipoDoc,
                                options: [
                                  { val: "Documento de Identidad", text: "Documento de Identidad" },
                                  { val: "Cédula de Extranjería", text: "Cédula de Extranjería" },
                                  { val: "Pasaporte", text: "Pasaporte" },
                                ]
                              })}
                              {renderFormItemTable({
                                section: benFinObj.benFinObjNroDoc
                              })}

                              {renderFormItemTable({
                                section: benFinObj.benFinObjPorcParti
                              })}

                            </Row>
                            <Row className="button-row">
                              <Col className="addRelation" xl={3}>
                                <Button type="primary" htmlType="button" onClick={()=> handleOnAddAttrTable('benFinObj', 'benFinales', 'records')} icon="plus" > Añadir </Button>
                              </Col>
                              <Col className="addRelation" xl={3}>
                                <Button type="primary" htmlType="button" icon="delete" onClick={()=>handleOnClear('benFinObj')}> Limpiar </Button>
                              </Col>
                            </Row>
                            </>
                          }
                          {benFinales.benFinalesRecords.val.length > 0 && format === "html" ?
                            <Table columns={benFinalesColumns} dataSource={benFinales.benFinalesRecords.val} size="middle" pagination={false} ></Table>
                          :
                            toDescriptionsPdf( benFinales.benFinalesRecords.val, benFinObj)
                          }
                        </div>
                      </>
                    }
                        <Row className="subheader">
                          <Col xl={24}>
                            { apiForm.typeSol === 'PJ' ? 'IX.' : 'VII.' } INFORMACIÓN RESPECTO A LA PARTICIPACIÓN EN SOCIEDADES
                          </Col>
                        </Row>
                        <Row className="summary">
                        <Col span={20}>
                          {apiForm.typeSol === 'PN' ?
                            "¿Participo en sociedades, en forma directa o a través de otras personas naturales o jurídicas, con un 10% o más de su capital, o bien ocupo el cargo de director, gerente general o ejecutivo principal, tanto en el país como en el extranjero?"
                          :
                            "¿La empresa que represento participa en sociedades, en forma directa o a través de otras personas jurídicas, con un 10% o más de su capital, tanto en el país como en el extranjero?"
                          }
                        </Col>
                        {renderFormItem({
                            label: "",
                            colClassName: "switch-col",
                            itemClassName: "radio-item-flat",
                            name: "sociedadesHasSociedades",
                            labelCol: 0,
                            wrapperCol: 0,
                            offset: 1,
                            initialValue: sociedades.sociedadesHasSociedades.val,
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
                                  handlerOnChangeObjAttr(
                                    "sociedadesHasSociedades",
                                    target.value
                                  )
                                }
                              >
                                <Radio style={radioStyle} value={true}>
                                  Sí
                                </Radio>
                                <Radio style={radioStyle} value={false}>
                                  No
                                </Radio>
                              </Radio.Group>
                            ),
                          })
                          }
                       </Row>

                        {sociedades.sociedadesHasSociedades.val && (
                          <div className="content">
                            {format === "html" && !signed && (
                              <>
                                <>
                                  <Row gutter={[16, 8]}>
                                    {renderFormItemTable({
                                      section: infoSoc.infoSocRazonSoc,

                                      cols: 6
                                    })}

                                    {renderFormItemTable({
                                      section: infoSoc.infoSocNroId,
                                      cols: 6
                                    })}

                                    {renderFormItemTable({
                                      section: infoSoc.infoSocPais,
                                      cols: 6,
                                      options:
                                      paises.map(item => {
                                        return {val: item.country, text: item.country}
                                      })
                                    })}

                                    {renderFormItemTable({
                                      section: infoSoc.infoSocPorcParti,
                                      cols: 6
                                    })}

                                    {apiForm.typeSol === 'PN' &&
                                      renderFormItemTable({
                                        section: infoSoc.infoSocCargo,
                                        options:[
                                          {val: "Accionista", text: "Accionista"},
                                          {val: "Director", text: "Director"},
                                          {val: "Gerente General", text: "Gerente General"},
                                          {val: "Ejecutivo Principal", text: "Ejecutivo Principal"},
                                        ],
                                        cols: 6
                                    })}

                                    {(apiForm.typeSol=== 'PJ' || (apiForm.typeSol=== 'PN' && infoSoc.infoSocCargo.val ==='Accionista')) &&
                                      renderFormItemTable({
                                      section: infoSoc.infoSocTipoProp,
                                      options:[
                                        {val: "Directa", text: "Directa"},
                                        {val: "Indirecta", text: "Indirecta"},
                                      ],
                                      cols: 6
                                    })}

                                    {infoSoc.infoSocTipoProp.val && infoSoc.infoSocTipoProp.val === 'Indirecta' &&
                                      renderFormItemTable({
                                        section: infoSoc.infoSocNombrePi,
                                        cols: 6
                                    })}

                                    {infoSoc.infoSocTipoProp.val && infoSoc.infoSocTipoProp.val === 'Indirecta' &&
                                      renderFormItemTable({
                                        section: infoSoc.infoSocNroIdPi,
                                        cols: 6
                                    })}


                                  </Row>
                                  <Row className="button-row">
                                    {sociedades.sociedadesRecords.val.length < 1 &&
                                      validarRegistros && (
                                        <Col
                                          span={24}
                                          style= {{color: 'red'}}
                                          className="missing-registers ant-form-explain"
                                        >
                                          {t("messages.aml.registersRequired")}
                                        </Col>
                                      )}

                                    <Col className="addRelation" xl={3}>
                                      <Button type="primary" htmlType="button" onClick={()=> handleOnAddAttrTable('infoSoc', 'sociedades', 'socRecords')} icon="plus" > Añadir </Button>
                                    </Col>
                                    <Col className="addRelation" xl={3}>
                                      <Button type="primary" htmlType="button" icon="delete" onClick={()=>handleOnClear('infoSoc')}> Limpiar </Button>
                                    </Col>
                                  </Row>
                                </>
                              </>
                            )}

                            {sociedades.sociedadesRecords.val.length > 0 && format === "html" ?
                              <Table columns={getSociedadesColumns()} dataSource={sociedades.sociedadesRecords.val} size="middle" pagination={false} ></Table>
                              :
                              toDescriptionsPdf( sociedades.sociedadesRecords.val, infoSocIS, apiForm.typeSol)
                            }
                          </div>
                      )}

                    {apiForm.typeSol === 'PN' &&
                      <>
                        <Row className="subheader">
                          <Col xl={24}>
                            VIII. DECLARACIÓN DE PREVENCIÓN DEL LAVADO DE ACTIVOS Y FINANCIACIÓN AL TERRORISMO
                          </Col>
                        </Row>
                        <div className="content">
                          <Row className="summary">
                            <Col xl={24}>
                              Declaro lo siguiente:
                              Mis recursos provienen de actividades lícitas y están ligados al desarrollo normal de mis actividades.
                              No he efectuado transacciones u operaciones consistentes en o destinadas a la ejecución de actividades
                              ilícitas, o a favor de personas que ejecuten o estén relacionadas con la ejecución de dichas actividades.
                              En la ejecución del contrato o el desarrollo de las actividades en que consista el negocio jurídico
                              con {clientName} no contrataré ni tendré vínculos de ningún tipo con terceros que realicen
                              operaciones o cuyos recursos provengan de actividades ilícitas.
                              No existe contra mí investigaciones o procesos penales por delitos dolosos, estando {clientName} facultado
                              para efectuar las verificaciones que considere pertinentes en bases de datos o informaciones
                              públicas nacionales o internacionales y para dar por terminada cualquier relación comercial o
                              jurídica si verifica que yo tienen investigaciones o procesos, o existen informaciones en dichas
                              bases de datos públicas que puedan colocar a {clientName} frente a un riesgo legal o de reputación.
                              En el evento en que tenga conocimiento de alguna de las circunstancias descritas los párrafos anteriores,
                              me comprometo a comunicarlo de inmediato a {clientName}.
                              Acepto que {clientName} está en la obligación legal de solicitar las aclaraciones que estime
                              pertinentes en el evento en que se presenten circunstancias con base en las cuales {clientName} pueda
                              tener dudas razonables sobre mis operaciones, evento en el cual suministraremos las aclaraciones
                              que sean del caso. Si estas no son satisfactorias, a juicio de {clientName}, autorizamos para
                              dar por terminada cualquier relación comercial o jurídica.
                              Autorizo cancelar cualquier producto o servicio que mantenga en esta institución, en el caso de
                              infracción, eximiendo a {clientName} de toda responsabilidad que se derive por información
                              errónea, falsa o inexacta que hubiere proporcionado en este documento, o de la violación del mismo.
                            </Col>
                          </Row>
                        </div>
                      </>
                    }

                {apiForm.typeSol === 'PJ' &&
                  <>
                      <Row className="subheader">
                        <Col xl={24}>{apiForm.typeSol === 'PJ' ? 'X' : 'VI'}. DECLARACIÓN SOBRE GESTIÓN DEL RIESGO & COMPLIANCE</Col>
                      </Row>
                      <Row className="summary">
                        <Col xl={24}>
                          {/* Bajo la gravedad de juramento y/o actuando en calidad de representante legal de la
                          empresa cuyos datos se incluyen en este formulario, según aplique, declaro en mi propio nombre y en la
                          sociedad que represento, su matriz, afiliadas, subsidiarias, directores, administradores, representantes
                          legales, accionistas, asociados o socios que directa o indirectamente tengan el cinco por ciento (5%)
                          o más del capital social, aporte o participación, que: */}
                          En nombre de la empresa y grupo empresarial que represento, así como sus directores y
                          accionistas, declaro que:
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col xl={24}>
                          <strong>1. </strong>
                          {/* Conocemos  la existencia de las leyes y reglamentos anti corrupción
                          y su exigibilidad; no hemos realizado, directa o indirectamente, cualquier acto que constituya
                          una violación de las leyes anti corrupción o cualquier reglamento promulgado bajo dichas
                          leyes, incluyendo sin limitación, el prometer, hacer, ofrecer o dar cualquier contribución,
                          regalo, soborno, descuento, recompensa, pago de influencia o cualquier otro tipo de pago
                          a cualquier funcionario, cualquier partido político o funcionario del mismo, cualquier funcionario
                          o candidato a cargo político, ya sea en dinero, propiedad, servicios o cualquier otra cosa
                          de valor, en violación de las leyes enunciadas en este numeral, con el propósito de: (i) Obtener
                          un trato favorable en la obtención de negocios con las Compañías, (ii) Pagar por obtener un trato
                          favorable en la obtención de negocios con las Compañías, (iii) Obtener concesiones especiales
                          o por concesiones especiales ya obtenidas, (iv) De otro modo influenciar los actos de tal
                          funcionario, partido político u oficial del mismo o candidato a cualquier cargo político
                          en su capacidad oficial o, (v) De otro modo obtener una ventaja indebida en asegurar o mantener
                          negocios. Nos abstendremos  de realizar alguno de los actos antes enunciados durante la
                          vigencia de las relaciones comerciales y contractuales con las Compañías; cooperaremos
                          plenamente con investigaciones sobre posibles violaciones de las leyes y reglamentos
                          anti corrupción emitidos que puedan surgir durante las relaciones comerciales
                          y contractuales con las Compañías; durante las relaciones comerciales y contractuales
                          con las Compañías prepararemos y mantendremos los libros y registros financieros,
                          contables y fiscales de acuerdo con las normas y los principios contables de
                          general aceptación. */}

                          Conocemos la existencia de las leyes y reglamentos anti corrupción y su exigibilidad;
                          no hemos realizado, directa o indirectamente, cualquier acto que constituya una
                          violación de las leyes anti corrupción o cualquier reglamento promulgado bajo dichas
                          leyes. Nos abstendremos de realizar cualquier actividad ilícita durante la vigencia de
                          las relaciones comerciales y contractuales con {clientName}; así mismo cooperaremos
                          plenamente con investigaciones sobre posibles violaciones de las leyes y reglamentos anti
                          corrupción emitidos que puedan surgir durante las relaciones comerciales y contractuales.
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col xl={24}>
                          <strong>2. </strong>
                          {/* Nuestros  recursos y/o bienes, los fondos, dineros, productos y activos, así como
                          los de nuestros socios o accionistas y administradores, destinados a la ejecución
                          de las relaciones comerciales y contractuales con las Compañías son de procedencia
                          lícita, provienen del giro ordinario de nuestros negocios que se desarrollan
                          lícitamente, y están ligados al desarrollo normal de nuestras actividades,
                          no provienen de  ninguna actividad ilícita de las contempladas en el Código Penal,
                          o en cualquier norma que lo sustituya, adicione o modifique u otra norma que
                          regule la materia,  no están vinculados directa ni indirectamente con el lavado de activos,
                          financiamiento del terrorismo, financiamiento de la proliferación de armas de destrucción
                          masiva, ni con ninguno de sus delitos fuente, no  van a ser destinados para la financiación
                          del narcotráfico, terrorismo o cualquier otra conducta delictiva, de acuerdo con las normas
                          penales vigentes. Para el efecto, siempre que sea aplicable, nos comprometemos a
                          cumplir con los requisitos que el Sistema de Autocontrol y Gestión del Riesgo
                          Integral de Lavado de Activos, Financiamiento del Terrorismo y
                          Financiamiento de la Proliferación de Armas de Destrucción Masiva – SAGRILAFT impone,
                          dentro de los que se encuentran entregar los documentos soporte respectivos y actualizar
                          la información que se requiera anualmente. */}

                          Nuestros recursos y/o bienes, los fondos, dineros, productos y activos,
                          así como los de nuestros socios o accionistas son de procedencia lícita y provienen
                          del giro ordinario de nuestros negocios que se desarrollan lícitamente, y están
                          ligados al desarrollo normal de nuestras actividades. No están vinculados directa
                          ni indirectamente con el lavado de activos, financiamiento del terrorismo, ni con
                          ninguno de sus delitos fuente
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col xl={24}>
                          <strong>3. </strong>
                            {/* Los productos utilizados para ejecutar o cumplir con la relación comercial o
                            contractual con las Compañías fueron nacionalizados y cuentan con todos los permisos
                            y licencias requeridos para ser ofrecidos al público, no son de contrabando, no corresponden
                            a aquellos calificados como de venta restringida y, de serlo,
                            tienen la autorización correspondiente. */}

                          No existen en nuestra contra investigaciones penales por delitos de lavado de activos,
                          financiación del terrorismo, financiamiento de la proliferación de armas de
                          destrucción masiva o sus delitos fuente o procesos de extinción de dominio.
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col xl={24}>
                          <strong>4. </strong>
                          {/* No nos encontramos designados o mencionados en las listas internacionales
                          vinculantes de conformidad con el derecho internacional
                          (listas del Consejo de Seguridad de las Naciones Unidas) o en las listas de la
                          OFAC y demás listas inhibitorias internacionales o locales, o en medios de comunicación o
                          bases de datos públicas relacionadas con información sobre delitos de lavado de activos,
                          financiamiento del terrorismo, financiamiento de la proliferación de armas de destrucción
                          masiva o sus delitos fuente.  De igual forma, declaramos y garantizamos que no pertenecemos
                          ni hemos pertenecido a una lista nacional o internacional que relacione personas
                          que amenazan la seguridad, la política exterior y la economía de cualquier país. */}

                          Que en el evento en que tenga conocimiento, me comprometo a comunicarlo de
                          inmediato a {clientName}.
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col xl={24}>
                          <strong>5. </strong>
                          {/* No existen en nuestra contra investigaciones penales
                          por delitos de lavado de activos, financiación del terrorismo, financiamiento de la
                          proliferación de armas de destrucción masiva o sus delitos fuente o procesos de extinción de dominio. */}

                          Que toda la documentación e información aportada para la ejecución de la relación
                          contractual y comercial con las Compañías es veraz y exacta.
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col xl={24}>
                          <strong>6. </strong>
                          Conocemos, declaramos y aceptamos que:
                          i) las Compañías están facultadas para efectuar las verificaciones que
                          considere pertinentes y están en la obligación legal de solicitar las
                          aclaraciones que estime pertinentes en el evento en que se presenten circunstancias.

                          ii) En caso de incumplimiento, incongruencia o discrepancia respecto de las obligaciones
                          y declaraciones incorporadas en este documento, {clientName} podrá dar por terminada
                          con justa causa cualquier relación comercial o contractual que exista,
                          sin exponer a {clientName}  a un riesgo legal, reputacional, de contagio y/u
                          operativo y sin que sea necesario reconocer suma alguna a título de
                          indemnización o cualquier otro concepto.

                        </Col>
                      </Row>
                      {/* <Row className="summary">
                        <Col xl={24}>
                          <strong>7.</strong> Que toda la documentación e información
                          aportada para la ejecución de la relación contractual y
                          comercial con las Compañías es veraz y exacta.
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col xl={24}>
                          <strong>8.</strong> Conocemos que es política de las Compañías, contratar con partes
                          que cumplan con las leyes, reglamentos y requisitos administrativos aplicables a
                          los negocios desarrollados en las jurisdicciones en las que operan.
                          Por tal razón, conocemos que las Compañías exigen que el
                          cliente (incluyendo sus directivos, empleados, contratistas y asesores) observen,
                          además de las leyes y reglamentaciones aplicables, los más altos niveles éticos durante
                          la etapa de suscripción y ejecución de cualquier contrato que se suscriba con las
                          Compañías. Por lo tanto  nos obligamos frente a cualquiera de las Compañías, a:
                          (i) no participar en actos de corrupción y/o soborno que los puedan involucrar, o que
                          puedan ser considerados que brindan un beneficio ilegítimo a los mismos,
                          (ii) evitar influir en la decisión de funcionarios públicos a través del
                          otorgamiento de beneficios personales con el propósito de obtener algún beneficio a
                          nombre o a favor de cualquiera de las Compañías,
                          (iii) no realizar pagos de facilitación
                          por encargo o cuyo beneficio sea a favor de alguna de las Compañías,
                          (iv) no otorgar beneficios personales a funcionarios de otras entidades privadas
                          con quienes sea necesario tratar en representación de alguna de las
                          Compañías si se tiene evidencia o sospecha que las decisiones de dicho
                          funcionario obedecen a algún beneficio personal distinto al beneficio de la
                          entidad que representa.
                          (v) informar cualquier conducta desleal o propuesta por parte de algún colaborador de
                          alguna de las Compañías , que no se encuentre alineado a la presente política.
                          (vi) informar cuando entre sus representantes se encuentre un funcionario público
                          o si en alguna de las Compañías o sus representantes están relacionados
                          con un funcionario público, hasta en el tercer grado de consanguinidad, segundo de
                          afinidad o primero civil ni en unión permanente;
                          (vii) aceptar que, en caso de que se tengan indicios razonables
                          de que ha incurrido en una conducta impropia o que haya incumplido la
                          política establecida en estas cláusulas, se podrá resolver el contrato unilateralmente
                          por parte de  alguna de las Compañías ;
                          (viii) aceptar que en caso que realice algo
                          en contra de lo dispuesto en esta política y generen reclamos, denuncias, perdidas
                          o daños productos de su actuación, éste deberá indemnizar a  alguna de las
                          Compañías si hay lugar a ello. Las Compañías tomarán las medidas adecuadas
                          para informar al personal interesado respecto de las condiciones mencionadas.
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col xl={24}>
                          <strong>9.</strong> Conocemos, declaramos y aceptamos que:
                          i) las Compañías están facultadas para efectuar las verificaciones
                          que considere pertinentes y están en la obligación legal de solicitar las
                          aclaraciones que estime pertinentes en el evento en que se presenten
                          circunstancias con base en las cuales pueda tener dudas razonables sobre
                          nuestras operaciones, así como del origen de nuestros activos, evento en el
                          cual suministraremos las aclaraciones que sean del caso;
                          ii) Las declaraciones y garantías que se disponen en este documento
                          sobrevivirán a la celebración y suscripción de cualquier relación contractual
                          o comercial con las Compañías, durante toda la vigencia de las mismas.
                          iii) En caso de incumplimiento, incongruencia o discrepancia respecto de
                          las obligaciones y declaraciones incorporadas en este documento, las Compañías
                          podrán dar por terminada con justa causa cualquier relación comercial o
                          contractual que exista, sin exponer a las Compañías a un riesgo legal,
                          reputacional, de contagio y/u operativo y sin que sea necesario reconocer
                          suma alguna a título de indemnización o cualquier otro concepto.
                        </Col>
                      </Row> */}
                    {apiForm.typeSol === 'PJ' &&
                      <>
                        <Row>
                          <Col className="summary" span={20}>
                            <strong>7. </strong>¿Disponen de Medios o Herramientas para el control de Lavado de Activos,
                            Financiamiento del Terrorismo y Financiamiento de la Proliferación de Armas de Destrucción Masiva?
                            (Si su respuesta es si, por favor indicar datos de contacto del Oficial de Cumplimiento).
                          </Col>
                          {renderFormItem({
                            label: "",
                            name: "ofCumplimientoHasCumplimiento",
                            initialValue: ofCumplimiento.ofCumplimientoHasCumplimiento.val,
                            colClassName: "switch-col",
                            itemClassName: "radio-item",
                            labelCol: 0,
                            wrapperCol: 0,
                            offset: 1,
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
                                  handlerOnChangeObjAttr(
                                    "ofCumplimientoHasCumplimiento",
                                    target.value
                                  )
                                }
                              >
                                <Radio style={radioStyle} value={true}>
                                  Sí
                                </Radio>
                                <Radio style={radioStyle} value={false}>
                                  No
                                </Radio>
                              </Radio.Group>
                            ),
                          })}
                        </Row>
                        {ofCumplimiento.ofCumplimientoHasCumplimiento.val &&
                          <>
                            <Row className="inner-row" gutter={[16, 8]}>
                              {renderFormItemObj({
                                section: ofCumplimiento.ofCumplimientoName,
                                cols: 8
                              })}
                              {renderFormItemObj({
                                section: ofCumplimiento.ofCumplimientoEmail,
                                cols: 8
                              })}
                              {renderFormItemObj({
                                section: ofCumplimiento.ofCumplimientoTel,
                                cols: 8
                              })}
                            </Row>
                            <Row className="inner-row" gutter={[16, 8]}>
                              {renderFormItemObj({
                                section: ofCumplimiento.ofCumplimientoObs,
                                cols: 24
                              })}
                            </Row>
                          </>
                        }
                      </>
                    }
                  </>
                }

                      {/* <Row className="subheader">
                        <Col xl={24}>
                          {apiForm.typeSol === 'PJ' ? 'XI.' : 'VIII.'} AUTORIZACIÓN Y REGLAMENTACIÓN PROTECCIÓN DE DATOS PERSONALES
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col xl={24}>
                          <p>En cumplimiento a lo estipulado en la Ley 1581 de 2012, demás normas
                          concordantes y al  Programa Integral de Protección de Datos Personales adoptado
                          por el Grupo Empresarial Parque Arauco . Yo como persona natural o
                          representante legal, según aplique:</p>
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col xl={24}>

                          <p>
                            <strong>1.</strong> Autorizo de manera voluntaria, previa, expresa, informada e inequívoca a Inversiones
                            Arauco S.A.S. (INVECA)<strong>²</strong>, responsable del tratamiento de los datos personales suministrados,
                            para que recolecte, almacene, suprima, actualice, transmita, transfiera y use los datos personales para:
                          </p>
                          <ul>
                            <li>
                              La ejecución de las relaciones comerciales y contractuales que sostenga o llegaré a sostener
                              con cualquiera de las Compañías<strong>³</strong> en calidad de concesionario (en adelante las “Relaciones”) y exigir el cumplimiento de las mismas.
                            </li>
                            <li>
                              Efectuar procedimientos y consultas para el conocimiento del cliente; registrarme como cliente o locatario,
                                administrar y almacenar mi información y la relacionada con la ejecución de las
                                Relaciones en las bases de datos y los sistemas de información, software, aplicaciones o
                                cualquier otro programa o desarrollo informático que usen las Compañías para tal efecto;
                                contactarme para efectos del cumplimiento o ejecución de las Relaciones; procesar pagos expedir o solicitar facturas
                                (o su equivalente) e información relacionada con estas; registrar los datos personales en los sistemas de
                                información de las Compañías y en sus bases de datos.
                            </li>
                              Conocer y tratar los datos de los empleados y contratistas que emplee para la ejecución de las Relaciones,
                              cuando sea necesario para la ejecución de las mismas.
                            <li>
                              Implementar las medidas de salud y seguridad industrial necesarias para el ingreso a las instalaciones
                              de las Compañías y la ejecución de las Relaciones.
                            </li>
                            <li>
                              Transmitir o Transferir los datos personales a terceros (proveedores de bienes y servicios y
                              aliados comerciales de las Compañías) a distintas áreas de las Compañías y a sus empresas vinculadas,
                              ubicados a nivel local o en el exterior, cuando ello sea necesario para la ejecución de las Relaciones,
                              el cumplimiento de obligaciones legales o contractuales, para el desarrollo de las operaciones de INVECA
                              y/o el cumplimiento y ejecución de estas finalidades.  El almacenamiento puede llevarse a cabo en servidores
                              ubicados en terceros países, lo que a su vez puede conllevar a la transmisión o trasferencia internacional
                              de los datos personales a cualquier país, incluyendo países con un nivel de protección de datos diferentes
                              a los del país donde los datos son recolectados Gestionar la prestación médica de emergencias, de ser requerido
                            </li>
                              Controlar mi acceso, el de los contratistas y empleados que utilice para la ejecución de las
                              Relaciones, a las Compañías y/o sus Centros Comerciales y establecer medidas de seguridad,
                              incluyendo el establecimiento de zonas video-vigiladas.
                            <li>
                              Contactarme y enviar, a mi y/o a mis contratistas y empleados (telefónicamente, vía email, SMS
                              y cualquier otro medio), información o publicidad relacionada con las Compañías y sus centros
                              comerciales y cualquier otro producto y/o servicio ofrecido por estas. Utilizar los datos personales con
                              fines comerciales y de mercadeo. Realizar análisis estadísticos y reportes de mercadeo
                            </li>
                            <li>
                              Cualquier otra actividad de naturales similar a las anteriormente descritas que sean necesarias para la ejecución del Contrato.
                            </li>
                          </ul>
                            <p>
                                Así mismo, declaro que:
                            </p>
                          <ul>
                            <li>
                              He sido informado por INVECA del carácter facultativo de responder preguntas que versen sobre datos sensibles y sobre
                              datos personales de menores y que  los titulares tienen los derechos previstos en la Constitución Política,
                              la Ley de Protección de Datos Personales y en la Política de Tratamiento de la Información disponible
                              en la página web https://www.parauco.com.
                            </li>
                            <li>
                              Conozco mis derechos como titular de los datos personales, en virtud de los cuales podré:
                              Conocer, solicitar que sea actualizado, rectificado o suprimido (cuando no tenga el deber
                              legal o contractual de permanecer en la base de datos)  cualquier dato contenido en bases de datos;
                              solicitar prueba de la autorización otorgada al Responsable; ser informado por el Responsable
                              sobre el uso que se le han dado a los datos personales; revocar la autorización otorgada cuando
                              no se respeten los principios, derechos y garantías legales y constitucionales; presentar quejas
                              por infracciones ante la autoridad competente y acceder gratuitamente a los datos personales
                              objeto de tratamiento, los cuales podré ejercer siguiendo los procedimientos previstos para el
                              efecto en la Política de Tratamiento de la Información disponible en la página web  https://www.parauco.com,
                              los cuales declaro conocer y entender.
                            </li>
                            <li>
                              INVECA se reserva el derecho de modificar su Política de Tratamiento de la Información
                              en cualquier momento, cambio que será informado y publicado oportunamente en la página web
                              o a través de los medios que disponga para tal fin.
                            </li>
                            <li>
                              En el evento que desee ejercer mis derechos de consulta o reclamación podré contactar a INVECA en el
                              correo electrónico quejasyreclamosdp@parauco.com.
                            </li>
                          </ul>
                          <p>
                            <strong>2.</strong>	Protección De Datos Personales.- Por la naturaleza de las Relaciones,
                              es entendido y aceptado que dentro del desarrollo de la misma, las Compañías podrán hacerme
                              entrega o poner en conocimiento datos personales de sus clientes y/o empleados para que  lleve
                              a cabo las actividades propias de la naturaleza las Relaciones.  Como consecuencia de lo anterior,
                              me comprometo a tratar como confidencial, en todo momento, dicha información personal y a abstenerme
                              de usarla para fines distintos a los especificados por las Compañías; a no vender, ceder, compartir
                              con terceros, ni usar a ningún título los datos personales; a implementar las medidas de seguridad
                              que correspondan para proteger los datos personales y las bases de datos personales que me entreguen
                              las Compañías;  garantizar que cuando las Relaciones se terminen, cuando el titular del dato lo
                              requiera o cuando la información que me hubiere sido entregada haya sido utilizada para los fines
                              establecidos por las Compañías, la información será destruida o restituida a estas para su destrucción,
                              de tal manera que se imposibilite acceder a ella; velar porque mis empleados, contratistas o cualquier
                              persona que conozca o maneje datos personales entregados por las Compañías, cumplan y acaten las normas
                              vigentes sobre protección de datos personales y garanticen la confidencialidad de los datos personales
                              a los que tendrán acceso; a tratar los datos personales entregados de conformidad con la Ley 1581 de
                              2012 y las demás normas que la reglamenten, adicionen, modifiquen o sustituyan, incluyendo aquellos
                              deberes establecidos para  los encargados, en caso de que durante la ejecución de las Relaciones adquiera
                              tal calidad. Si llegare a utilizar la información para fines distintos a los especificados por las
                              Compañías, asumiré la responsabilidad y mantendré indemne a las Compañías frente a posibles reclamaciones
                              y las indemnizaré por los daños que les cause. <br/><br/>
                              Respecto de los datos personales de clientes, empleados,  contratistas y otros terceros que entregue
                              para efectos de la ejecución de las Relaciones, declaró y garantizó que cuento y contaré con las
                              autorizaciones previas de los titulares para efectuar dicha transmisión o transferencia y que las
                              mismas han sido otorgadas de conformidad con las normas aplicables y que cuentan con la autorización
                              de las finalidades requeridas para la ejecución de las Relaciones.
                          </p>
                          <p>
                            <strong>3.</strong>	Las declaraciones y obligaciones que se disponen en este documento sobrevivirán a la
                            celebración y suscripción de cualquier contrato con la(s) Compañía(s), durante toda la vigencia del mismo,
                            así como a cualquier otro tipo de vinculación con la(s) Compañía(s). El incumplimiento,
                            incongruencia o discrepancia respecto de las obligaciones y declaraciones incorporadas en este documento
                            constituirá incumplimiento del contrato que se suscriba.
                          </p>

                        </Col>
                      </Row> */}

                      {/* <Row className="subheader">
                        <Col xl={24}>
                          {apiForm.typeSol === 'PJ' ? 'XII.' : 'IX.'} AUTORIZACIÓN DE CONSULTA Y REPORTE ANTE CENTRALES DE RIESGO
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col xl={24}>
                          Yo como persona natural o representante legal, según aplique:
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col xl={24}>
                          Declaró que la información que he suministrado es verídica y autorizo de manera
                          voluntaria, previa, expresa, informada e inequívoca a EJE CONSTRUCCIONES SAS
                          con Nit: 900.079.790-5, INVERSIONES INMOBILIARIAS BUCARAMANGA ARAUCO SAS (INBUCA)
                          con Nit: 900.460.297-8; PARQUE ARAUCO S.A.  (PASA) con Nit: 900.252.139.-0,
                          INVERSIONES ARAUCO S.A.S. con NIT: 900.197.303-7, ADMINISTRADORA PARQUE ARAUCO S.A.S.
                          con Nit: 901.394.357-2  o a quien representa sus derechos (en adelante las “Compañías”) para:
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col xl={24}>
                          <strong>a)</strong> Consultar en cualquier tiempo, procesar, solicitar, consultar y divulgar a la
                          Central de Información del Sector Financiero – CIFIN – que administra la Asociación
                          Bancaria y de Entidades Financiera, a Transunión, o a DATACRÉDITO, o a
                          cualquier otra entidad que maneje y/o administre bases de datos con los mismos fines,
                          toda la información referente a su comportamiento comercial y financiero y toda la
                          información relevante para conocer mi desempeño como deudor y mi capacidad de pago,
                          para usar esta información como elemento de análisis para concederme un crédito, establecer
                          y/o mantener una relación contractual o comercial con alguna de las Compañías,
                          cualquiera que sea su naturaleza.
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col xl={24}>
                          <strong>b)</strong> Recolectar, usar y registrar en las bases o bancos de datos de las Compañías los datos,
                          tratados o sin tratar, sobre el cumplimiento o incumplimiento de las obligaciones
                          dinerarias o crediticias contraídas con alguna de las Compañías o de mis deberes legales
                          o contractuales de contenido patrimonial.
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col xl={24}>
                          <strong>c)</strong> Reportar a DataCrédito o a cualquier central de información de riesgo, los datos,
                          tratados o sin tratar, sobre el cumplimiento oportuno o el incumplimiento, si lo hubiere,
                          de las obligaciones dinerarias contraídas con alguna de las Compañías, de tal forma que éstos
                          presenten una información veraz, pertinente, completa actualizada y exacta de mi
                          desempeño como deudor.
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col xl={24}>
                          <strong>d)</strong> Suministrar a DataCrédito o a cualquier otra central de información de riesgo,
                          datos relativos al cumplimiento de mis obligaciones contractuales, de mis relaciones comerciales
                          y jurídicas, financieras y/o socioeconómicas que yo haya entregado o que consten en registros
                          públicos, bases de datos públicas o documentos públicos.
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col xl={24}>
                          <strong>e)</strong> Conservar, tanto en los bancos de datos de las Compañías, en DataCrédito o en
                          cualquier otra central de información de riesgo, con la debidas actualizaciones y
                          durante el período señalado en la ley, la información indicada en los literales a) b), c)  y d)
                          de esta autorización.
                        </Col>
                      </Row>
                      <Row className="summary">
                        <Col xl={24}>
                          <strong>f)</strong> Que he sido informado de que mis derechos son los previstos en la Constitución
                          Política, la Ley 1266 de 2008 y sus decretos reglamentarios, especialmente:
                          ejercer los derechos fundamentales de habeas data, conocer, actualizar, rectificar la información
                          contenida en bases de datos y solicitar prueba de la autorización otorgada.
                        </Col>
                      </Row>
                      <Row className="summary" style={{paddingBottom:'30px'}}>
                        <Col xl={24}>
                          Lo anterior implica que el cumplimiento o incumplimiento de sus obligaciones se reflejará en las
                           mencionadas bases de datos, en donde se consignan de manera completa, todos los datos
                           referentes a su actual y pasado comportamiento frente al sector financiero y, en general, al
                           cumplimiento de sus obligaciones comerciales y financieras. Para todos los efectos, el cliente
                           conoce y acepta expresamente que los reportes y plazos se efectuarán de conformidad con las normas
                           que al respecto sean incluidas en el reglamento de CIFIN, Transunión y/o de DATACRÉDITO, y las
                           normas legales que regulan la materia. Igualmente, el cliente manifiesta que conoce y acepta
                           que la consecuencia de esta autorización será la consulta e inclusión de sus datos financieros y
                           comerciales en la Central de Información del Sector Financiero CIFIN, Transunión y/o de DATACRÉDITO
                           y demás entidades que manejen este tipo de información, por lo tanto, las entidades del sector
                           financiero afiliadas a dichas centrales conocerán su comportamiento presente y pasado relacionado
                           con el cumplimiento o incumplimiento de sus obligaciones financieras y comerciales. En los casos en
                           que suscriba contratos u acuerdos para la explotación, a cualquier título, de un espacio o local en
                           Parque Caracolí o Parque la Colina Centro Comercial,  CREDICORP CAPITAL, en su calidad de
                           encargado, podrá consultar  en la Central de Información del Sector Financiero – CIFIN – que administra
                           la Asociación Bancaria y de Entidades Financiera, a Transunión, o a DATA CRÉDITO, o a
                           cualquier otra entidad que maneje y/o administre bases de datos con los mismos fines, toda la
                           información referente a su comportamiento comercial y financiero y toda la información relevante
                           para conocer su desempeño como deudor y su capacidad de pago, para usar esta información como elemento
                           de análisis para concederle un crédito, establecer y/o mantener una relación contractual o comercial,
                           cualquiera que sea su naturaleza.
                        </Col>
                      </Row> */}
                      <Row className="subheader">
                        <Col xl={24}>
                          {apiForm.typeSol === 'PJ' ? 'XI. ' : 'IX. '} Documentos Adjuntos.
                        </Col>
                      </Row>
                      <Row className="summary" style={{marginBottom:20}}>
                        A continuación adjunte la documentación solicitada por {clientName}.
                        Recuerde que debe indicar el nombre del documento que adjuntará.
                        Puede adjuntar documentos en formato pdf, jpg, word, excel cuyo peso no supere los 2MB por archivo.
                        En total se pueden adjuntar hasta 10 archivos.
                      </Row>
                      { format === 'pdf' ?
                        <Row>
                          <List
                            size="small"
                            header="Documentos adjuntos"
                            itemLayout="horizontal"
                            dataSource={apiForm.files}
                            renderItem={item => (
                              <List.Item>
                                <List.Item.Meta
                                    description={item.name}
                                />
                                <List.Item.Meta
                                  description={item.originalName}
                                />
                              </List.Item>
                            )}
                          />
                        </Row>
                        : format === 'html' &&
                        <>
                          <Row>
                            {renderFormItem({
                                  label: "Nombre del documento",
                                  name: "fileName",
                                  initialValue: userFileName,
                                  colClassName: "topLabel",
                                  labelCol: 0,
                                  wrapperCol: 0,
                                  rules:
                                  [
                                    { required: true, message: t( "messages.aml.requestedField")},
                                  ],
                                  wrapperCols: 8,
                                  offset: 0,
                                  item: (
                                    <Input
                                      placeholder="Ingrese nombre de documento"
                                      autoComplete="off"
                                      onChange={(e) => setUserFileName(e.target.value) }
                                    />
                                  ),
                                })
                              }
                              <Col span={4} offset={1}>
                                <Upload {...propsUpload} disabled={userFileName === null || userFileName === ""}>
                                  <Button style={{marginTop:25}} onClick={() => validateFields(['fileName'])} disabled={tmpFilesList.length > 9} >
                                    <Icon type="upload" /> Subir Archivo
                                  </Button>
                                </Upload>
                              </Col>
                          </Row>
                          <Row>
                            <List
                              size="small"
                              header="Documentos adjuntos"
                              itemLayout="horizontal"
                              dataSource={tmpFilesList.map((file, index)=> {return {fileName: file.name, docName: fileNames[index], index: index}})}
                              renderItem={item => (
                                <List.Item
                                  actions={[<a onClick={() => handleListDeleted(item.index)}>Eliminar</a>]}
                                >
                                  <List.Item.Meta
                                      description={item.docName}
                                  />
                                  <List.Item.Meta
                                    description={item.fileName}
                                  />
                                </List.Item>
                              )}
                            />
                          </Row>
                        </>
                      }
                      <Row className="subheader">
                        <Col xl={24}>
                          {apiForm.typeSol === 'PJ' ? 'XII. ' : 'X. '} {apiForm.typeSol === 'PJ' ? 'FIRMA DEL REPRESENTANTE LEGAL' : 'FIRMA'}
                        </Col>
                      </Row>
                      <Row className="summary" style={{textAlign: "center"}}>
                        En constancia de haber leído, entendido y aceptado lo anterior, firmo el presente documento:
                      </Row>

                      {format === "html" && !signed &&
                        <Row className="button-row">
                          <Col className="submitTrabajador" xl={24}>
                            <Button type="primary" htmlType="submit" disabled={openSigner} icon={openSigner ? 'loading' : 'file-protect'}>
                              { hasSign ? 'Firmar' : 'Enviar' }
                            </Button>
                          </Col>
                        </Row>
                      }
                    </>
                    }
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

export default withRouter(Form.create()(FormKyc));
