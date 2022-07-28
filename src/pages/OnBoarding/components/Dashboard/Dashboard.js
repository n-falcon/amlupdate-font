import './Dashboard.scss'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Icon, Input, Button, DatePicker, Progress, Select, Modal, notification, Spin, message } from 'antd'
import {ModalNewRequestPage} from '../'
import { ModalClientCardPage } from '../FichaCliente/components'
import { getItemsPromise } from '../FichaCliente/promises'
import { getItemsPromise as getItemForm } from '../FormManager/promises'
import PieChart from 'react-minimal-pie-chart'
import moment from "moment";

const {RangePicker} = DatePicker;
const {Option} = Select;

const Dashboard = ({currentUser, handleTabChange}) =>{
    const [modalRequestIsVisible, setModalRequestIsVisible] = useState(false);
    const {t} = useTranslation();
    const [recordFicha, setRecordFicha ] = useState(null)
    const [rut, setRut ] = useState(null)
    const [itemsFormReceived, setItemsFormReceived ] = useState(null)
    const [itemsForm, setItemsForm ] = useState(null)
    const [pendientesForm, setPendientesForm ] = useState({})
    const [fichasForm, setFichasForm] = useState(null)
    const [fichasReal, setFichasReal] = useState({})

    //RISK STATES
    const [recordOnbRisk, setRecordOnbRisk] = useState(null)

    const [cliRisk, setCliRisk] = useState({})
    const [provRisk, setProvRisk] = useState({})
    const [colabRisk, setColabRisk] = useState({})
    const [dirRisk, setDirRisk] = useState({})

    const [sendDateFormPend, setSendDateFormPend] = useState(null)
    const [sendDateFormReal, setSendDateFormReal] = useState(null)
    const [typePersonFicReal, setTypePersonFicReal] = useState(null)
    const [typePersonFicForm, setTypePersonFicForm] = useState(null)
    const [typePersonRisk, setTypePersonRisk] = useState(null)

    useEffect(() => {
        handleFormDateReceived()
        handlePendientesDate()
        handleFormDate()
        loadFichasReal()
        loadFichasForm()
        loadFichasRisk()
    }, [])

    const clientPieData = [
        { title: t('messages.aml.riskCritical')+": "+cliRisk.black, value: cliRisk.black, color: 'rgba(0,0,0,.85)' },
        { title: t('messages.aml.riskHigh')+": "+cliRisk.red, value: cliRisk.red, color: 'rgba(245, 40, 30, .8)' },
        { title: t('messages.aml.riskMedium')+": "+cliRisk.orange, value: cliRisk.orange, color: '#FE9F0C' },
        { title: t('messages.aml.riskLow')+": "+cliRisk.yellow, value: cliRisk.yellow, color: 'rgba(240,240,10,.8)' },
        { title: t('messages.aml.risk.N')+": "+cliRisk.green, value: cliRisk.green, color: 'rgb(135,208,104)' },
        { title: t('messages.aml.notProcessed')+": "+cliRisk.na, value: cliRisk.na, color: '#999' }
    ]

    const provPieData = [
        { title: t('messages.aml.riskCritical')+": "+provRisk.black, value: provRisk.black, color: 'rgba(0,0,0,.85)' },
        { title: t('messages.aml.riskHigh')+": "+provRisk.red, value: provRisk.red, color: 'rgba(245, 40, 30, .8)' },
        { title: t('messages.aml.riskMedium')+": "+provRisk.orange, value: provRisk.orange, color: '#FE9F0C' },
        { title: t('messages.aml.riskLow')+": "+provRisk.yellow, value: provRisk.yellow, color: 'rgba(240,240,10,.8)' },
        { title: t('messages.aml.risk.N')+": "+provRisk.green, value: provRisk.green, color: 'rgb(135,208,104)' },
        { title: t('messages.aml.notProcessed')+": "+provRisk.na, value: provRisk.na, color: '#999' }
    ]

    const dirPieData = [
        { title: t('messages.aml.riskCritical')+": "+dirRisk.black, value: dirRisk.black, color: 'rgba(0,0,0,.85)' },
        { title: t('messages.aml.riskHigh')+": "+dirRisk.red, value: dirRisk.red, color: 'rgba(245, 40, 30, .8)' },
        { title: t('messages.aml.riskMedium')+": "+dirRisk.orange, value: dirRisk.orange, color: '#FE9F0C' },
        { title: t('messages.aml.riskLow')+": "+dirRisk.yellow, value: dirRisk.yellow, color: 'rgba(240,240,10,.8)' },
        { title: t('messages.aml.risk.N')+": "+dirRisk.green, value: dirRisk.green, color: 'rgb(135,208,104)' },
        { title: t('messages.aml.notProcessed')+": "+dirRisk.na, value: dirRisk.na, color: '#999' }
    ]

    const colabPieData = [
        { title: t('messages.aml.riskCritical')+": "+colabRisk.black, value: colabRisk.black, color: 'rgba(0,0,0,.85)' },
        { title: t('messages.aml.riskHigh')+": "+colabRisk.red, value: colabRisk.red, color: 'rgba(245, 40, 30, .8)' },
        { title: t('messages.aml.riskMedium')+": "+colabRisk.orange, value: colabRisk.orange, color: '#FE9F0C' },
        { title: t('messages.aml.riskLow')+": "+colabRisk.yellow, value: colabRisk.yellow, color: 'rgba(240,240,10,.8)' },
        { title: t('messages.aml.risk.N')+": "+colabRisk.green, value: colabRisk.green, color: 'rgb(135,208,104)' },
        { title: t('messages.aml.notProcessed')+": "+colabRisk.na, value: colabRisk.na, color: '#999' }
    ]

    const handleFormDateReceived = (dates) =>{
        let startdate = moment().valueOf()
        let endDate = moment().valueOf()
        if(dates && dates.length > 0) {
            startdate = dates[0].valueOf()
            endDate = dates[1].valueOf()
        }
        const completeDate = [ startdate, endDate ]

        getItemForm('KYC', {completeDate}).then(results => {
            if(results){
                setItemsFormReceived(results.data.filters.status.filter(i => i.status !== 'PENDIENTE').reduce((acc, value) => {return acc+value.total},0))
            }else{
                message.error("Error al cargar los datos")
            }
        })
    }

    const handlePendientesDate = (dates) =>{
        let startdate = moment().subtract('days', 30).valueOf()
        let endDate = moment().valueOf()
        if(dates && dates.length > 0) {
            startdate = dates[0].valueOf()
            endDate = dates[1].valueOf()
        }
        const sendDate = [ startdate, endDate ]
        setSendDateFormPend(sendDate)

        getItemForm('KYC', {sendDate, statusDecl: 'PENDIENTE'}).then(results => {
            if(results){
                const PROVEEDOR = results.data.filters.status.filter(i => i.categoria === 'PROVEEDOR').reduce((acc, value) => {return acc+value.total},0)
                const COLABORADOR = results.data.filters.status.filter(i => i.categoria === 'COLABORADOR').reduce((acc, value) => {return acc+value.total},0)
                const DIRECTOR = results.data.filters.status.filter(i => i.categoria === 'DIRECTOR').reduce((acc, value) => {return acc+value.total},0)
                const CLIENTE = results.data.filters.status.filter(i => i.categoria === 'CLIENTE').reduce((acc, value) => {return acc+value.total},0)

                setPendientesForm({CLIENTE, PROVEEDOR, COLABORADOR, DIRECTOR})
            }else{
                message.error("Error al cargar los datos")
            }
        })
    }

    const handleFormDate = (dates) =>{
        let startdate = moment().subtract('days', 30).valueOf()
        let endDate = moment().valueOf()
        if(dates && dates.length > 0) {
            startdate = dates[0].valueOf()
            endDate = dates[1].valueOf()
        }
        const sendDate = [ startdate, endDate ]
        setItemsForm(null)
        setSendDateFormReal(sendDate)

        getItemForm('KYC', {sendDate}).then(results => {
            if(results){
                const formProv = results.data.filters.status.filter(i => i.categoria === 'PROVEEDOR' && i.status !== 'PENDIENTE').reduce((acc, value) => {return acc+value.total},0)
                const formColab = results.data.filters.status.filter(i => i.categoria === 'COLABORADOR' && i.status !== 'PENDIENTE').reduce((acc, value) => {return acc+value.total},0)
                const formDire = results.data.filters.status.filter(i => i.categoria === 'DIRECTOR' && i.status !== 'PENDIENTE').reduce((acc, value) => {return acc+value.total},0)
                const formClient = results.data.filters.status.filter(i => i.categoria === 'CLIENTE' && i.status !== 'PENDIENTE').reduce((acc, value) => {return acc+value.total},0)

                const totalFormProv = results.data.filters.status.filter(i => i.categoria === 'PROVEEDOR').reduce((acc, value) => {return acc+value.total},0)
                const totalFormColab = results.data.filters.status.filter(i => i.categoria === 'COLABORADOR').reduce((acc, value) => {return acc+value.total},0)
                const totalFormDir = results.data.filters.status.filter(i => i.categoria === 'DIRECTOR').reduce((acc, value) => {return acc+value.total},0)
                const totalFormClient = results.data.filters.status.filter(i => i.categoria === 'CLIENTE').reduce((acc, value) => {return acc+value.total},0)

                const PROVEEDOR = {cant: formProv, total: totalFormProv}
                const COLABORADOR = {cant: formColab, total: totalFormColab}
                const DIRECTOR = {cant: formDire, total: totalFormDir}
                const CLIENTE = {cant: formClient, total: totalFormClient}
                setItemsForm({ PROVEEDOR, COLABORADOR, DIRECTOR, CLIENTE })
            }else{
                message.error("Error al cargar los datos")
            }
        })
    }

    const loadFichasForm = (tipoPersona) => {
        setFichasForm(null)
        getItemsPromise('N', {tipoPersona}).then(results => {
            if(results){
                const cliente = results.data.filters.estados.filter(i => i.categoria === "CLIENTE" && i.status_decl !== 'PENDIENTE').reduce((acc, value) => {return acc+value.cant},0)
                const prov = results.data.filters.estados.filter(i => i.categoria === "PROVEEDOR" && i.status_decl !== 'PENDIENTE').reduce((acc, value) => {return acc+value.cant},0)
                const colab = results.data.filters.estados.filter(i => i.categoria === "COLABORADOR" && i.status_decl !== 'PENDIENTE').reduce((acc, value) => {return acc+value.cant},0)
                const dir = results.data.filters.estados.filter(i => i.categoria === "DIRECTOR" && i.status_decl !== 'PENDIENTE').reduce((acc, value) => {return acc+value.cant},0)

                const totalCliente = results.data.filters.estados.filter(i => i.categoria === "CLIENTE" ).reduce((acc, value) => {return acc+value.cant},0)
                const totalProv = results.data.filters.estados.filter(i => i.categoria === "PROVEEDOR" ).reduce((acc, value) => {return acc+value.cant},0)
                const totalColab = results.data.filters.estados.filter(i => i.categoria === "COLABORADOR" ).reduce((acc, value) => {return acc+value.cant},0)
                const totalDir = results.data.filters.estados.filter(i => i.categoria === "DIRECTOR" ).reduce((acc, value) => {return acc+value.cant},0)

                const CLIENTE = {cant: cliente, total: totalCliente}
                const PROVEEDOR = {cant: prov, total: totalProv}
                const COLABORADOR = {cant: colab, total: totalColab}
                const DIRECTOR = {cant: dir, total: totalDir}
                setFichasForm({ PROVEEDOR, COLABORADOR, DIRECTOR, CLIENTE })
            }else{
                message.error("Error al cargar los datos")
            }
        })
    }

    const handleFicRealTypePerson = (tipoPersona) => {
        setTypePersonFicReal(tipoPersona)
        loadFichasReal(tipoPersona)
    }

    const handleFicFormTypePerson = (tipoPersona) => {
        setTypePersonFicForm(tipoPersona)
        loadFichasForm(tipoPersona)
    }

    const loadFichasReal = (tipoPersona) => {
        loadFichasRealCategory('CLIENTE', tipoPersona)
        loadFichasRealCategory('PROVEEDOR', tipoPersona)
        loadFichasRealCategory('DIRECTOR', tipoPersona)
        loadFichasRealCategory('COLABORADOR', tipoPersona)
    }

    const loadFichasRealCategory = (category, tipoPersona) =>{
        setFichasReal(oldFichasReal => {
            let newFichasReal = {...oldFichasReal}
            newFichasReal[category] = null

            return newFichasReal
        })
        getItemsPromise(category, {tipoPersona}).then(results => {
            if(results && results.data && results.data.filters){
                let objCat = {}
                objCat.cant = results.data.filters.estados.filter(i => i.categoria === category && i.status_decl !== 'PENDIENTE').reduce((acc, value) => {return acc+value.cant},0)
                objCat.activos = results.data.filters.activos

                setFichasReal(oldFichasReal => {
                    let newFichasReal = {...oldFichasReal}
                    newFichasReal[category] = objCat

                    return newFichasReal
                })
            }
        })
    }

    const loadFichasRisk = (tipoPersona) => {
        getItemsPromise('N', {tipoPersona}).then(results => {
            if(results){
                const cliGreenRisk = results.data.filters.estados.filter(i => i.categoria === "CLIENTE" && i.riesgo === 'GREEN').reduce((acc, value) => {return acc+value.cant},0)
                const cliYellowRisk = results.data.filters.estados.filter(i => i.categoria === "CLIENTE" && i.riesgo === 'YELLOW').reduce((acc, value) => {return acc+value.cant},0)
                const cliOrangeRisk = results.data.filters.estados.filter(i => i.categoria === "CLIENTE" && i.riesgo === 'ORANGE').reduce((acc, value) => {return acc+value.cant},0)
                const cliRedRisk = results.data.filters.estados.filter(i => i.categoria === "CLIENTE" && i.riesgo === 'RED').reduce((acc, value) => {return acc+value.cant},0)
                const cliBlackRisk = results.data.filters.estados.filter(i => i.categoria === "CLIENTE" && i.riesgo === 'BLACK').reduce((acc, value) => {return acc+value.cant},0)
                const cliNaRisk = results.data.filters.estados.filter(i => i.categoria === "CLIENTE" && i.riesgo === null).reduce((acc, value) => {return acc+value.cant},0)
                const cliTotalRisk = results.data.filters.estados.filter(i => i.categoria === "CLIENTE").reduce((acc, value) => {return acc+value.cant},0)
                setCliRisk({green: cliGreenRisk, yellow: cliYellowRisk, orange: cliOrangeRisk, red: cliRedRisk, black: cliBlackRisk, na: cliNaRisk, total: cliTotalRisk})

                const provGreenRisk = results.data.filters.estados.filter(i => i.categoria === "PROVEEDOR" && i.riesgo === 'GREEN').reduce((acc, value) => {return acc+value.cant},0)
                const provYellowRisk = results.data.filters.estados.filter(i => i.categoria === "PROVEEDOR" && i.riesgo === 'YELLOW').reduce((acc, value) => {return acc+value.cant},0)
                const provOrangeRisk = results.data.filters.estados.filter(i => i.categoria === "PROVEEDOR" && i.riesgo === 'ORANGE').reduce((acc, value) => {return acc+value.cant},0)
                const provRedRisk = results.data.filters.estados.filter(i => i.categoria === "PROVEEDOR" && i.riesgo === 'RED').reduce((acc, value) => {return acc+value.cant},0)
                const provBlackRisk = results.data.filters.estados.filter(i => i.categoria === "PROVEEDOR" && i.riesgo === 'BLACK').reduce((acc, value) => {return acc+value.cant},0)
                const provNaRisk = results.data.filters.estados.filter(i => i.categoria === "PROVEEDOR" && i.riesgo === null).reduce((acc, value) => {return acc+value.cant},0)
                const provTotalRisk = results.data.filters.estados.filter(i => i.categoria === "PROVEEDOR").reduce((acc, value) => {return acc+value.cant},0)
                setProvRisk({green: provGreenRisk, yellow: provYellowRisk, orange: provOrangeRisk, red: provRedRisk, black: provBlackRisk, na: provNaRisk, total: provTotalRisk})

                const colabGreenRisk = results.data.filters.estados.filter(i => i.categoria === "COLABORADOR" && i.riesgo === 'GREEN').reduce((acc, value) => {return acc+value.cant},0)
                const colabYellowRisk = results.data.filters.estados.filter(i => i.categoria === "COLABORADOR" && i.riesgo === 'YELLOW').reduce((acc, value) => {return acc+value.cant},0)
                const colabOrangeRisk = results.data.filters.estados.filter(i => i.categoria === "COLABORADOR" && i.riesgo === 'ORANGE').reduce((acc, value) => {return acc+value.cant},0)
                const colabRedRisk = results.data.filters.estados.filter(i => i.categoria === "COLABORADOR" && i.riesgo === 'RED').reduce((acc, value) => {return acc+value.cant},0)
                const colabBlackRisk = results.data.filters.estados.filter(i => i.categoria === "COLABORADOR" && i.riesgo === 'BLACK').reduce((acc, value) => {return acc+value.cant},0)
                const colabNaRisk = results.data.filters.estados.filter(i => i.categoria === "COLABORADOR" && i.riesgo === null).reduce((acc, value) => {return acc+value.cant},0)
                const colabTotalRisk = results.data.filters.estados.filter(i => i.categoria === "COLABORADOR").reduce((acc, value) => {return acc+value.cant},0)
                setColabRisk({green: colabGreenRisk, yellow: colabYellowRisk, orange: colabOrangeRisk, red: colabRedRisk, black: colabBlackRisk, na: colabNaRisk, total: colabTotalRisk})

                const dirGreenRisk = results.data.filters.estados.filter(i => i.categoria === "DIRECTOR" && i.riesgo === 'GREEN').reduce((acc, value) => {return acc+value.cant},0)
                const dirYellowRisk = results.data.filters.estados.filter(i => i.categoria === "DIRECTOR" && i.riesgo === 'YELLOW').reduce((acc, value) => {return acc+value.cant},0)
                const dirOrangeRisk = results.data.filters.estados.filter(i => i.categoria === "DIRECTOR" && i.riesgo === 'ORANGE').reduce((acc, value) => {return acc+value.cant},0)
                const dirRedRisk = results.data.filters.estados.filter(i => i.categoria === "DIRECTOR" && i.riesgo === 'RED').reduce((acc, value) => {return acc+value.cant},0)
                const dirBlackRisk = results.data.filters.estados.filter(i => i.categoria === "DIRECTOR" && i.riesgo === 'BLACK').reduce((acc, value) => {return acc+value.cant},0)
                const dirNaRisk = results.data.filters.estados.filter(i => i.categoria === "DIRECTOR" && i.riesgo === null).reduce((acc, value) => {return acc+value.cant},0)
                const dirTotalRisk = results.data.filters.estados.filter(i => i.categoria === "DIRECTOR").reduce((acc, value) => {return acc+value.cant},0)
                setDirRisk({green: dirGreenRisk, yellow: dirYellowRisk, orange: dirOrangeRisk, red: dirRedRisk, black: dirBlackRisk, na: dirNaRisk, total: dirTotalRisk})

                setRecordOnbRisk(results.data.filters.estados)
            }else{
                message.error("Error al cargar los datos")
            }
        })
    }

    const handleTypePersonRisk = (tipoPersona) =>{
        setTypePersonRisk(tipoPersona)
        loadFichasRisk(tipoPersona)
    }

    const openModalRequest = () => {
        setModalRequestIsVisible(true);
    }
    const closeModalRequest = () => {
        setModalRequestIsVisible(false);
    }

    const handleSearchRut = rut => {
        getItemsPromise('N', {rut}).then(items => {
            if(items && items.data && items.data.records && items.data.records.length > 0) {
                setRecordFicha(items.data.records[0])
            }else {
                notification.info({
                    message: 'Consulta rápida',
                    description: 'No hay coincidencias'
                })
            }
        })
    }

    const handleCloseModalFicha = () => {
        setRecordFicha(null)
    }

    const handleTabChangeFormsPend = (category, options) => {
        handleTabChange('tab-forms', {...options, category, sendDate: sendDateFormPend})
    }

    const handleTabChangeFormsReal = (category, options) => {
        handleTabChange('tab-forms', {...options, category, sendDate: sendDateFormReal})
    }

    const handleTabChangeFichasReal = (category, status) => {
        handleTabChange('tab-clientData', {category, tipoPersona: typePersonFicReal, status})
    }

    const handleTabChangeFichasForm = (category, status) => {
        handleTabChange('tab-clientData', {category, tipoPersona: typePersonFicForm, status})
    }

    const handleTabChangeFichasRisk = (category, risk) => {
        handleTabChange('tab-clientData', {category, tipoPersona: typePersonRisk, risk})
    }

    return(
        <div className="dashboard">
            {!modalRequestIsVisible ?
                <>
                    <Row gutter={[16, 16]}>
                        <Col span={16}>
                            <div className="section">
                                <h3>Notificaciones</h3>
                                <div>
                                    <div>Bienvenido {currentUser.name} al módulo de OnBoarding.</div>
                                    <div>Informamos que el día de hoy llegaron {itemsFormReceived} formularios</div>
                                </div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="section">
                                <h3>Solicitud</h3>
                                <div>
                                    <Icon type="right" /> <a href="#" onClick={openModalRequest}> Seleccione las personas a quienes enviará el formulario OnBoarding </a>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <div className="section">
                                <Row>
                                    <h3>Consulta rápida</h3>
                                </Row>
                                <Row>
                                    <p>
                                        Ingrese el documento de indentidad.
                                        <br/>
                                        El resultado lo llevará a la ficha de la persona consultada
                                    </p>
                                </Row>
                                <Row>
                                    <Col span={18} offset={6}>
                                        <Input.Search
                                            style={{marginTop: '11px'}}
                                            placeholder="Buscar rut"
                                            onChange={(e) => setRut(e.target.value)}
                                            onSearch={handleSearchRut}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p>
                                            <Button style={{float:'right', marginTop:'11px', backgroundColor:'rgb(53 53 195)', color:'white'}} onClick={() => rut && handleSearchRut(rut)}>Buscar</Button>
                                        </p>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="section">
                                <Row>
                                    <h3>Formularios pendientes</h3>
                                </Row>
                                <Row>
                                    <p>
                                        A continuación se presentan los formularios que se
                                        encuentran pendientes en el último mes.
                                    </p>
                                </Row>
                                <Row>
                                    <Row>
                                        <Col span={12}>
                                            <a className="pendientes-text-onb" onClick={() => handleTabChangeFormsPend('CLIENTE', {statusDecl: 'PENDIENTE'})}>
                                                Clientes: {pendientesForm.CLIENTE}
                                            </a>
                                        </Col>
                                        <Col span={12}>
                                            <a className="pendientes-text-onb" onClick={() => handleTabChangeFormsPend('DIRECTOR', {statusDecl: 'PENDIENTE'})}>
                                                Directores: {pendientesForm.DIRECTOR}
                                            </a>
                                        </Col>
                                        <Col span={12}>
                                            <a className="pendientes-text-onb" onClick={() => handleTabChangeFormsPend('PROVEEDOR', {statusDecl: 'PENDIENTE'})}>
                                                Proveedores: {pendientesForm.PROVEEDOR}
                                            </a>
                                        </Col>
                                        <Col span={12}>
                                            <a className="pendientes-text-onb" onClick={() => handleTabChangeFormsPend('COLABORADOR', {statusDecl: 'PENDIENTE'})}>
                                                Colaboradores: {pendientesForm.COLABORADOR}
                                            </a>
                                        </Col>
                                    </Row>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <div className="rp-inner-wrapper">
                                            <RangePicker
                                                style={{ width: "100%" }}
                                                placeholder={["Fec. Desde", "Hasta"]}
                                                onChange={(value) => {handlePendientesDate(value)}}
                                                format="DD/MM/YYYY"
                                            />
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <div className="section">
                                {itemsForm ?
                                    <>
                                        <Row gutter={[16, 16]}>
                                            <h3>Formularios de OnBoarding solicitados</h3>
                                            <p>Se presenta el avance del último mes</p>
                                        </Row>
                                        <Row gutter={[16, 16]}>
                                            <div className="percent-block-wrapper-onb">
                                                <Col span={6}>
                                                    <Progress
                                                        type="circle"
                                                        percent={itemsForm.CLIENTE.total > 0 && parseInt((itemsForm.CLIENTE.cant*100/itemsForm.CLIENTE.total).toFixed(0))}
                                                        format={percent => `${percent}%`}
                                                        onClick={() => handleTabChangeFormsReal('CLIENTE')}
                                                    />
                                                </Col>
                                                <Col span={6}>
                                                    <Progress
                                                        type="circle"
                                                        percent={itemsForm.PROVEEDOR.total > 0 && parseInt((itemsForm.PROVEEDOR.cant*100/itemsForm.PROVEEDOR.total).toFixed(0))}
                                                        format={percent => `${percent}%`}
                                                        onClick={() => handleTabChangeFormsReal('PROVEEDOR')}
                                                    />
                                                </Col>
                                                <Col span={6}>
                                                    <Progress
                                                        type="circle"
                                                        percent={itemsForm.DIRECTOR.total > 0 && parseInt((itemsForm.DIRECTOR.cant*100/itemsForm.DIRECTOR.total).toFixed(0))}
                                                        format={percent => `${percent}%`}
                                                        onClick={() => handleTabChangeFormsReal('DIRECTOR')}
                                                    />
                                                </Col>
                                                <Col span={6}>
                                                    <Progress
                                                        type="circle"
                                                        percent={itemsForm.COLABORADOR.total > 0 && parseInt((itemsForm.COLABORADOR.cant*100/itemsForm.COLABORADOR.total).toFixed(0))}
                                                        format={percent => `${percent}%`}
                                                        onClick={() => handleTabChangeFormsReal('COLABORADOR')}
                                                    />
                                                </Col>
                                            </div>
                                        </Row>
                                        <Row gutter={[16, 16]}>
                                            <div className="label-percent-wrapper-onb">
                                                <Col span={6}>
                                                    <a onClick={() => handleTabChangeFormsReal('CLIENTE')}>
                                                        <h3>Clientes</h3>
                                                    </a>
                                                    <a onClick={() => handleTabChangeFormsReal('CLIENTE', { statusesDecl: ['EVALUACION', 'AUTORIZADA', 'RECHAZADA']})}>
                                                        <h4>Realizados: {itemsForm.CLIENTE.cant}</h4>
                                                    </a>
                                                </Col>
                                                <Col span={6}>
                                                    <a onClick={() => handleTabChangeFormsReal('PROVEEDOR')}>
                                                        <h3>Proveedores</h3>
                                                    </a>
                                                    <a onClick={() => handleTabChangeFormsReal('PROVEEDOR', { statusesDecl: ['EVALUACION', 'AUTORIZADA', 'RECHAZADA']})}>
                                                        <h4>Realizados: {itemsForm.PROVEEDOR.cant}</h4>
                                                    </a>
                                                </Col>
                                                <Col span={6}>
                                                    <a onClick={() => handleTabChangeFormsReal('DIRECTOR')}>
                                                        <h3>Directores</h3>
                                                    </a>
                                                    <a onClick={() => handleTabChangeFormsReal('DIRECTOR', { statusesDecl: ['EVALUACION', 'AUTORIZADA', 'RECHAZADA']})}>
                                                        <h4>Realizados: {itemsForm.DIRECTOR.cant}</h4>
                                                    </a>
                                                </Col>
                                                <Col span={6}>
                                                    <a onClick={() => handleTabChangeFormsReal('COLABORADOR')}>
                                                        <h3>Colaboradores</h3>
                                                    </a>
                                                    <a onClick={() => handleTabChangeFormsReal('COLABORADOR', { statusesDecl: ['EVALUACION', 'AUTORIZADA', 'RECHAZADA']})}>
                                                        <h4>Realizados: {itemsForm.COLABORADOR.cant}</h4>
                                                    </a>
                                                </Col>
                                            </div>
                                        </Row>
                                        <Row>
                                            <Col span={6}>
                                                <RangePicker
                                                    style={{ width: "100%" }}
                                                    placeholder={["Fec. Desde", "Hasta"]}
                                                    onChange={(value) => {handleFormDate(value)}}
                                                    format="DD/MM/YYYY"
                                                />
                                            </Col>
                                        </Row>
                                    </>
                                    :
                                    <Row>
                                        <Col span={24}>
                                            <div className="spin-container-dashboard">
                                                <Spin/>
                                            </div>
                                        </Col>
                                    </Row>
                                }
                            </div>

                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <div className="section">
                                { fichasForm ?
                                    <>
                                        <Row gutter={[16, 16]}>
                                            <h3>Fichas de clientes con información del formulario de OnBoarding</h3>
                                            <p>Se presenta las personas y empresas que poseen una Ficha de Cliente con un formulario de OnBoarding realizado.</p>
                                        </Row>
                                        <Row gutter={[16, 16]}>
                                            <div className="percent-block-wrapper-onb">
                                                <Col span={6}>
                                                    <Progress
                                                        type="circle"
                                                        percent={fichasForm.CLIENTE.total > 0 && parseInt((fichasForm.CLIENTE.cant*100/fichasForm.CLIENTE.total).toFixed(0))}
                                                        format={percent => `${percent}%`}
                                                        onClick={() => handleTabChangeFichasForm('CLIENTE')}
                                                    />
                                                </Col>
                                                <Col span={6}>
                                                    <Progress
                                                        type="circle"
                                                        percent={fichasForm.PROVEEDOR.total > 0 && parseInt((fichasForm.PROVEEDOR.cant*100/fichasForm.PROVEEDOR.total).toFixed(0))}
                                                        format={percent => `${percent}%`}
                                                        onClick={() => handleTabChangeFichasForm('PROVEEDOR')}
                                                    />
                                                </Col>
                                                <Col span={6}>
                                                    <Progress
                                                        type="circle"
                                                        percent={fichasForm.DIRECTOR.total > 0 && parseInt((fichasForm.DIRECTOR.cant*100/fichasForm.DIRECTOR.total).toFixed(0))}
                                                        format={percent => `${percent}%`}
                                                        onClick={() => handleTabChangeFichasForm('DIRECTOR')}
                                                    />
                                                </Col>
                                                <Col span={6}>
                                                    <Progress
                                                        type="circle"
                                                        percent={fichasForm.COLABORADOR.total  > 0 && parseInt((fichasForm.COLABORADOR.cant*100/fichasForm.COLABORADOR.total).toFixed(0))}
                                                        format={percent => `${percent}%`}
                                                        onClick={() => handleTabChangeFichasForm('COLABORADOR')}
                                                    />
                                                </Col>
                                            </div>
                                        </Row>
                                        <Row gutter={[16, 16]}>
                                            <div className="label-percent-wrapper-onb">
                                                <Col span={6}>
                                                    <a onClick={() => handleTabChangeFichasForm('CLIENTE')}>
                                                        <h3>Clientes</h3>
                                                    </a>
                                                    <a onClick={() => handleTabChangeFichasForm('CLIENTE', 'FINISHED')}>
                                                        <h4>Fichas: {fichasForm.CLIENTE.cant}</h4>
                                                    </a>
                                                </Col>
                                                <Col span={6}>
                                                    <a onClick={() => handleTabChangeFichasForm('PROVEEDOR')}>
                                                        <h3>Proveedores</h3>
                                                    </a>
                                                    <a onClick={() => handleTabChangeFichasForm('PROVEEDOR', 'FINISHED')}>
                                                        <h4>Fichas: {fichasForm.PROVEEDOR.cant}</h4>
                                                    </a>
                                                </Col>
                                                <Col span={6}>
                                                    <a onClick={() => handleTabChangeFichasForm('DIRECTOR')}>
                                                        <h3>Directores</h3>
                                                    </a>
                                                    <a onClick={() => handleTabChangeFichasForm('DIRECTOR', 'FINISHED')}>
                                                        <h4>Fichas: {fichasForm.DIRECTOR.cant}</h4>
                                                    </a>
                                                </Col>
                                                <Col span={6}>
                                                    <a onClick={() => handleTabChangeFichasForm('COLABORADOR')}>
                                                        <h3>Colaboradores</h3>
                                                    </a>
                                                    <a onClick={() => handleTabChangeFichasForm('COLABORADOR', 'FINISHED')}>
                                                        <h4>Fichas: {fichasForm.COLABORADOR.cant}</h4>
                                                    </a>
                                                </Col>
                                            </div>
                                        </Row>
                                        <Row>
                                            <Col span={6}>
                                                <Select style={{width:'100%'}} placeholder="Tipo de Persona" onChange={(e)=>{handleFicFormTypePerson(e)}}>
                                                    <Option value={null}>
                                                        Todos
                                                    </Option>
                                                    <Option value='Person'>
                                                        Persona Natural
                                                    </Option>
                                                    <Option value='Entity'>
                                                        Persona Jurídica
                                                    </Option>
                                                </Select>
                                            </Col>
                                        </Row>
                                    </>
                                    :
                                    <Row>
                                        <Col span={24}>
                                            <div className="spin-container-dashboard">
                                                <Spin/>
                                            </div>
                                        </Col>
                                    </Row>
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <div className="section">
                                <Row gutter={[16, 16]}>
                                    <h3>Fichas de Clientes procesadas</h3>
                                    <p>Se presenta el acumulado en base a las personas y empresas en registro</p>
                                </Row>
                                <Row gutter={[16, 16]} className="percent-block-wrapper-onb" type="flex">
                                    <Col span={6}>
                                        <div className="content">
                                            { fichasReal.CLIENTE ?
                                                <Progress
                                                    type="circle"
                                                    percent={fichasReal.CLIENTE.activos > 0 && parseInt((fichasReal.CLIENTE.cant*100/fichasReal.CLIENTE.activos).toFixed(0))}
                                                    format={percent => `${percent}%`}
                                                    onClick={() => handleTabChangeFichasReal('CLIENTE')}
                                                />
                                                :
                                                <Spin/>
                                            }
                                        </div>
                                    </Col>
                                    <Col span={6}>
                                        <div className="content">
                                            { fichasReal.PROVEEDOR ?
                                                <Progress
                                                    type="circle"
                                                    percent={fichasReal.PROVEEDOR.activos > 0 && parseInt((fichasReal.PROVEEDOR.cant*100/fichasReal.PROVEEDOR.activos).toFixed(0))}
                                                    format={percent => `${percent}%`}
                                                    onClick={() => handleTabChangeFichasReal('PROVEEDOR')}
                                                />
                                                :
                                                <Spin/>
                                            }
                                        </div>
                                    </Col>
                                    <Col span={6}>
                                        <div className="content">
                                            { fichasReal.DIRECTOR ?
                                                <Progress
                                                    type="circle"
                                                    percent={fichasReal.DIRECTOR.activos > 0 && parseInt((fichasReal.DIRECTOR.cant*100/fichasReal.DIRECTOR.activos).toFixed(0))}
                                                    format={percent => `${percent}%`}
                                                    onClick={() => handleTabChangeFichasReal('DIRECTOR')}
                                                />
                                                :
                                                <Spin/>
                                            }
                                        </div>
                                    </Col>
                                    <Col span={6}>
                                        <div className="content">
                                            { fichasReal.COLABORADOR ?
                                                <Progress
                                                    type="circle"
                                                    percent={fichasReal.COLABORADOR.activos > 0 && parseInt((fichasReal.COLABORADOR.cant*100/fichasReal.COLABORADOR.activos).toFixed(0))}
                                                    format={percent => `${percent}%`}
                                                    onClick={() => handleTabChangeFichasReal('COLABORADOR')}
                                                />
                                                :
                                                <Spin/>
                                            }
                                        </div>
                                    </Col>
                                </Row>
                                <Row gutter={[16, 16]} className="label-percent-wrapper-onb">
                                    <Col span={6}>
                                        <a onClick={() => handleTabChangeFichasReal('CLIENTE')}>
                                            <h3>Clientes</h3>
                                        </a>
                                        <a onClick={() => handleTabChangeFichasReal('CLIENTE', 'FINISHED')}>
                                            <h4>Fichas: {fichasReal.CLIENTE && fichasReal.CLIENTE.cant}</h4>
                                        </a>
                                    </Col>
                                    <Col span={6}>
                                        <a onClick={() => handleTabChangeFichasReal('PROVEEDOR')}>
                                            <h3>Proveedores</h3>
                                        </a>
                                        <a onClick={() => handleTabChangeFichasReal('PROVEEDOR', 'FINISHED')}>
                                            <h4>Fichas: {fichasReal.PROVEEDOR && fichasReal.PROVEEDOR.cant}</h4>
                                        </a>
                                    </Col>
                                    <Col span={6}>
                                        <a onClick={() => handleTabChangeFichasReal('DIRECTOR')}>
                                            <h3>Directores</h3>
                                        </a>
                                        <a onClick={() => handleTabChangeFichasReal('DIRECTOR', 'FINISHED')}>
                                            <h4>Fichas: {fichasReal.DIRECTOR && fichasReal.DIRECTOR.cant}</h4>
                                        </a>
                                    </Col>
                                    <Col span={6}>
                                        <a onClick={() => handleTabChangeFichasReal('COLABORADOR')}>
                                            <h3>Colaboradores</h3>
                                        </a>
                                        <a onClick={() => handleTabChangeFichasReal('COLABORADOR', 'FINISHED')}>
                                            <h4>Fichas: {fichasReal.COLABORADOR && fichasReal.COLABORADOR.cant}</h4>
                                        </a>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={6}>
                                        <Select style={{width:'100%'}} placeholder="Tipo de Persona" onChange={(e)=>{handleFicRealTypePerson(e)}}>
                                            <Option value={null}>
                                                Todos
                                            </Option>
                                            <Option value='Person'>
                                                Persona Natural
                                            </Option>
                                            <Option value='Entity'>
                                                Persona Jurídica
                                            </Option>
                                        </Select>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <div className="section">
                                {recordOnbRisk ?
                                    <>
                                        <Row gutter={[16, 16]}>
                                            <h3>Riesgo Identificado</h3>
                                            <p>Se presentan las personas y empresas que poseen una ficha de cliente</p>
                                        </Row>
                                        <Row gutter={[16, 16]} className="percent-block-wrapper-onb">
                                            <Col span={6}>
                                                <div className="pie-wrapper-dashboard">
                                                    { (cliRisk.total) > 0 ?
                                                        <PieChart
                                                            animate={ true }
                                                            animationDuration={ 500 }
                                                            animationEasing="ease-out"
                                                            cx={ 50 }
                                                            cy={ 50 }
                                                            data={ clientPieData }
                                                            lineWidth={ 24 }
                                                        />
                                                        :
                                                        <div className="na">N/A</div>
                                                    }
                                                </div>
                                            </Col>

                                            <Col span={6}>
                                                <div className="pie-wrapper-dashboard">
                                                    { (provRisk.total) > 0 ?
                                                        <PieChart
                                                            animate={ true }
                                                            animationDuration={ 500 }
                                                            animationEasing="ease-out"
                                                            cx={ 50 }
                                                            cy={ 50 }
                                                            data={ provPieData }
                                                            lineWidth={ 24 }
                                                        />
                                                        :
                                                        <div className="na">N/A</div>
                                                    }
                                                </div>
                                            </Col>
                                            <Col span={6}>
                                                <div className="pie-wrapper-dashboard">
                                                    { (dirRisk.total) > 0 ?
                                                        <PieChart
                                                            animate={ true }
                                                            animationDuration={ 500 }
                                                            animationEasing="ease-out"
                                                            cx={ 50 }
                                                            cy={ 50 }
                                                            data={ dirPieData }
                                                            lineWidth={ 24 }
                                                        />
                                                        :
                                                        <div className="na">N/A</div>
                                                    }
                                                </div>
                                            </Col>
                                            <Col span={6}>
                                                <div className="pie-wrapper-dashboard">
                                                    { (colabRisk.total) > 0 ?
                                                        <PieChart
                                                            animate={ true }
                                                            animationDuration={ 500 }
                                                            animationEasing="ease-out"
                                                            cx={ 50 }
                                                            cy={ 50 }
                                                            data={ colabPieData }
                                                            lineWidth={ 24 }
                                                        />
                                                        :
                                                        <div className="na">N/A</div>
                                                    }
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row gutter={[16, 16]} className="label-percent-wrapper-onb">
                                            <Col span={6}>
                                                <h3>Clientes</h3>
                                                <a onClick={() => handleTabChangeFichasRisk('CLIENTE', 'BLACK')}>
                                                    <div className="risk">Riesgo Crítico: {cliRisk.black}</div>
                                                </a>
                                                <a onClick={() => handleTabChangeFichasRisk('CLIENTE', 'RED')}>
                                                    <div className="risk">Riesgo Alto: {cliRisk.red}</div>
                                                </a>
                                            </Col>
                                            <Col span={6}>
                                                <h3>Proveedores</h3>
                                                <a onClick={() => handleTabChangeFichasRisk('PROVEEDOR', 'BLACK')}>
                                                    <div className="risk">Riesgo Crítico: {provRisk.black}</div>
                                                </a>
                                                <a onClick={() => handleTabChangeFichasRisk('PROVEEDOR', 'RED')}>
                                                    <div className="risk">Riesgo Alto: {provRisk.red}</div>
                                                </a>
                                            </Col>
                                            <Col span={6}>
                                                <h3>Directores</h3>
                                                <a onClick={() => handleTabChangeFichasRisk('DIRECTOR', 'BLACK')}>
                                                    <div className="risk">Riesgo Crítico: {dirRisk.black}</div>
                                                </a>
                                                <a onClick={() => handleTabChangeFichasRisk('DIRECTOR', 'RED')}>
                                                    <div className="risk">Riesgo Alto: {dirRisk.red}</div>
                                                </a>
                                            </Col>
                                            <Col span={6}>
                                                <h3>Colaboradores</h3>
                                                <a onClick={() => handleTabChangeFichasRisk('COLABORADOR', 'BLACK')}>
                                                    <div className="risk">Riesgo Crítico: {colabRisk.black}</div>
                                                </a>
                                                <a onClick={() => handleTabChangeFichasRisk('COLABORADOR', 'RED')}>
                                                    <div className="risk">Riesgo Alto: {colabRisk.red}</div>
                                                </a>
                                            </Col>
                                        </Row>
                                        <Row style={{marginTop: 20}}>
                                            <Col span={6}>
                                                <Select style={{width:'100%'}} placeholder="Tipo de Persona" onChange={(e) => {handleTypePersonRisk(e)}}>
                                                    <Option value={null}>
                                                        Todos
                                                    </Option>
                                                    <Option value='Person'>
                                                        Persona Natural
                                                    </Option>
                                                    <Option value='Entity'>
                                                        Persona Jurídica
                                                    </Option>
                                                </Select>
                                            </Col>
                                        </Row>
                                    </>
                                    :
                                    <Row>
                                        <Col span={24}>
                                            <div className="spin-container-dashboard">
                                                <Spin/>
                                            </div>
                                        </Col>
                                    </Row>
                                }
                            </div>
                        </Col>
                    </Row>
                </>
                :
                <ModalNewRequestPage currentUser={currentUser} closeModalRequest={closeModalRequest} />
            }

            {recordFicha &&
                <Modal
                    wrapClassName="modal-fichaCliente-onb"
                    style={{top:'10px'}}
                    title={"Ficha de Cliente"}
                    visible={true}
                    onCancel={handleCloseModalFicha}
                    cancelText="Cerrar"
                    footer={null}
                    width={'95vw'}
                >
                    <ModalClientCardPage item={recordFicha} handleCancel={handleCloseModalFicha} />
                </Modal>
            }
        </div>

    )
}

export default Dashboard
