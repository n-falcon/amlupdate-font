import './ReportingForm.scss';
import React, { useState, useEffect } from 'react';
import {Select, Input, Radio, Row, Col, DatePicker, Button} from 'antd';
import { getAreasPromise } from '../../../../promises'
import { getGruposPromise } from '../../../../../Register/promises'
import { ReportService } from '../../../../../../services'

const ReportingForm = ({report, currentUser}) => {
    const [category, setCategory] = useState("CLIENTE")
    const [status, setStatus] = useState("TODOS")
    const [hasComments, setHasComments] = useState(false)
    const [area, setArea] = useState([])
    const [selectedEmp, setSelectedEmp] = useState(null)
    const [selectedArea, setSelectedArea] = useState(null)
    const [typePerson, setTypePerson] = useState(null)
    const [grupos, setGrupos] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [dateSolicitud, setDateSolicitud] = useState(null);
    const [risk, setRisk] = useState(null);
    const [compliance, setCompliance] = useState(null);
    const [update, setUpdate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { RangePicker } = DatePicker;

    useEffect(() => {
        getAreasPromise().then(response => {
            setArea(response);
        })

        getGruposPromise('ALL').then(response => {
            setGrupos(response);
        })
    }, []);

    const handleCategoryChange = (e) => {
        setCategory(e);
    }

    const handleStatusChange = (e) => {
        setStatus(e);
    }

    const handleRadioBtnComment = (e) => {
        setHasComments(e.target.value);
    }

    const handleEmpresa = (e) => {
        setSelectedEmp(e);
    }

    const handleArea = (e) => {
        setSelectedArea(e);
    }

    const handlePersonChange = (e) => {
        setTypePerson(e)
    }

    const handleGrupo = (e) => {
        setSelectedGroup(e)
    }

    const handleDateSolicitud = (e) => {
        setDateSolicitud(e)
    }

    const handleRiskChange = (e) => {
        setRisk(e)
    }

    const handleUpdateChange = (e) => {
        setUpdate(e)
    }

    const handleComplianceChange = (e) => {
        setCompliance(e)
    }

    const handleFilterDeleted = () => {
        setStatus("TODOS");
        setCategory("CLIENTE");
        setHasComments(false);
        setSelectedEmp(null);
        setSelectedArea(null);
        setTypePerson(null);
        setSelectedGroup(null);
        setDateSolicitud(null);
        setRisk(null);
    }

    const handleReportExport = async () => {
      const obj = {
            report,
            category: category,
            risk: risk,
            statusDecl: status,
            hasComments: hasComments,
            empresa: selectedEmp,
            area: selectedArea,
            tipoPersona: typePerson,
            grupo: selectedGroup,
            sendDate: dateSolicitud,
            update: update,
            compliance: compliance,
            from: 0,
            size: 10000
        }
        setIsLoading(true)
        await ReportService.read('/cdi/exportDeclarationsByType/KYC', obj, null, 'Reporte.xlsx')
        setIsLoading(false)
    }

  return (
    <div className="reporting-form-content">
        <div className="row-wrapper-reporting">
            <Row>
                <Col span={1}>
                    <div className="step-number-reporting">
                    1
                    </div>
                </Col>
                <Col span={8} offset={1}>
                    <div className="step-title-reporting">
                        Seleccione la Categoría
                    </div>
                </Col>
                <Col span={8} offset={6}>
                    <Select value={category} style={{width: '100%' }} onChange={(e) => {handleCategoryChange(e)}}>
                        <Select.Option value="CLIENTE">Cliente</Select.Option>
                        <Select.Option value="COLABORADOR">Colaborador</Select.Option>
                        <Select.Option value="PROVEEDOR">Proveedor</Select.Option>
                        <Select.Option value="DIRECTOR">Director</Select.Option>
                    </Select>
                </Col>
            </Row>
        </div>
        <div className="row-wrapper-reporting">
            <Row>
                <Col span={1}>
                    <div className="step-number-reporting">
                    2
                    </div>
                </Col>
                <Col span={8} offset={1}>
                    <div className="step-title-reporting">
                        {report === 'form' ? "Seleccione el Estado" : "Seleccione nivel de riesgo"}
                    </div>
                </Col>
                <Col span={8} offset={6}>
                    {report === 'form' ?
                        <Select allowClear value={status} style={{width: '100%' }} onChange={(e) => {handleStatusChange(e)}}>
                            <Select.Option value="TODOS">Todos</Select.Option>
                            <Select.Option value="PENDIENTE">Pendientes</Select.Option>
                            <Select.Option value="EVALUACION">Realizados</Select.Option>
                            <Select.Option value="AUTORIZADA">Autorizados</Select.Option>
                            <Select.Option value="RECHAZADO">Rechazados</Select.Option>
                        </Select>
                        :
                        <Select allowClear value={risk} style={{width: '100%' }} onChange={(e) => {handleRiskChange(e)}}>
                            <Select.Option value="GREEN">No posee</Select.Option>
                            <Select.Option value="YELLOW">Bajo</Select.Option>
                            <Select.Option value="ORANGE">Medio</Select.Option>
                            <Select.Option value="RED">Alto</Select.Option>
                            <Select.Option value="BLACK">Crítico</Select.Option>
                        </Select>
                    }
                </Col>
            </Row>
        </div>
        <div className="row-wrapper-reporting">
            <Row>
                <Col span={1}>
                    <div className="step-number-reporting">
                    3
                    </div>
                </Col>
                <Col span={21} offset={1}>
                    <div className="step-title-reporting">
                        A continuación le presentamos una serie de filtros que puede utilizar, si lo requiere:
                    </div>
                </Col>
            </Row>
        </div>
        <div className="row-wrapper-reporting">
            <Row>
                <Col span={21} offset={3}>
                    <Row gutter={[8, 24]}>
                        <Col span={11}>
                            <div className="step-label-reporting">
                                Fecha de solicitud
                            </div>
                            <RangePicker
                                format="DD-MM-YYYY HH:mm"
                                placeholder={['Desde', 'Hasta']}
                                onChange={handleDateSolicitud}
                                value={dateSolicitud}
                            />
                        </Col>
                        <Col span={11} offset={2}>
                            <div className="step-label-reporting">
                                Tipo de persona
                            </div>
                            <Select allowClear value={typePerson} style={{width: '100%' }} onChange={(e) => {handlePersonChange(e)}}>
                                <Select.Option value="Person">Persona</Select.Option>
                                <Select.Option value="Entity">Empresa</Select.Option>
                            </Select>
                        </Col>
                    </Row>
                    {report === 'ficha' &&
                        <Row gutter={[8, 24]}>
                            <Col span={11}>
                                <div className="step-label-reporting">
                                    Fecha actualización
                                </div>
                                <RangePicker
                                    format="DD-MM-YYYY HH:mm"
                                    placeholder={['Desde', 'Hasta']}
                                    onChange={handleUpdateChange}
                                    value={update}
                                />
                            </Col>
                            <Col span={11} offset={2}>
                                <div className="step-label-reporting">
                                    Cumplimiento
                                </div>
                                <Select allowClear value={compliance} style={{width: '100%' }} onChange={(e) => {handleComplianceChange(e)}}>
                                    <Select.Option value="PEPSAN">Listas Obligatorias</Select.Option>
                                    <Select.Option value="KYCAME">KYC</Select.Option>
                                    <Select.Option value="UBOCOM">UBO & Companies</Select.Option>
                                </Select>
                            </Col>
                        </Row>
                    }
                    <Row gutter={[8, 24]}>
                        <Col span={11}>
                            <div className="step-label-reporting">
                                Área
                            </div>
                            <Select allowClear style={{width: '100%'}} onChange={(e) =>{handleArea(e)}} value={selectedArea}>
                                     {(area.length > 0) ?
                                        area.map( (c) => <Select.Option value={c}>{c}</Select.Option>)
                                     :
                                        <Select.Option value="">No tiene área</Select.Option>
                                     }
                            </Select>
                        </Col>
                        <Col span={11} offset={2}>
                            <div className="step-label-reporting">
                                Grupo
                            </div>
                            <Select allowClear style={{width: '100%'}} onChange={(e) =>{handleGrupo(e)}} value={selectedGroup}>
                                  {(grupos !== null) ?
                                    grupos.map((g) =>
                                    <Select.Option value={g.grupo}>{g.grupo}</Select.Option>
                                    )
                                    :
                                    <Select.Option value="N/A">No tiene grupo</Select.Option>
                                  }
                            </Select>
                        </Col>
                    </Row>
                    <Row gutter={[8, 24]}>
                        <Col span={11}>
                            <div className="step-label-reporting">
                                Empresa
                            </div>
                            <Select allowClear style={{width: '100%'}} onChange={(e) => {handleEmpresa(e)}} value={selectedEmp}>
                                {(currentUser.empresas !== null && currentUser.empresas.length > 0) ?
                                    currentUser.empresas.map( (c) => <Select.Option value={c.id}>{c.name}</Select.Option>)
                                :
                                <Select.Option value="N/A">No tiene empresas</Select.Option>
                                }
                            </Select>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
        <div className="row-wrapper-reporting">
            <Row>
                <Col span={1}>
                    <div className="step-number-reporting">
                    4
                    </div>
                </Col>
                <Col span={18} offset={1}>
                    <div className="step-title-reporting">
                        ¿Desea incorporar la información de comentarios en el reporte?
                    </div>
                </Col>
                <Col span={3} offset={1}>
                    <Radio.Group 
                        onChange={(e)=>{handleRadioBtnComment(e)}} 
                        value={hasComments} 
                        buttonStyle="solid"
                        style={{display:'flex', justifyContent:'flex-end'}}
                    >
                        <Radio.Button value={true}>Si</Radio.Button>
                        <Radio.Button value={false}>No</Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>
        </div>
        <div className="row-wrapper-reporting">
            <Row>
                <Col style={{float:'right'}}>
                    <Button type="danger" onClick={handleFilterDeleted}>
                        Borrar Filtros
                    </Button>
                    <Button type="primary" onClick={handleReportExport} disabled={isLoading} icon={isLoading && "loading"} style={{marginLeft:20}}>
                        Exportar Excel
                    </Button>
                </Col>
            </Row>
        </div>
    </div>
  )
}

export default ReportingForm
