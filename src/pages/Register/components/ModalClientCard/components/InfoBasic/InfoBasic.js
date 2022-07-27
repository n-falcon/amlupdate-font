import React from 'react';
import {Row, Col, Input } from 'antd'

const InfoBasic = ({basicInfo={}, record, actual}) => {
    return (
        <div>
            <Row gutter={[36, 36]}>
                <Col span={6} >
                    Nombre o Razón Social
                    <Input readOnly value={basicInfo.name ? basicInfo.name : record.nombre}/>
                </Col>
                <Col span={6}>
                    Tipo de Documento
                    <Input readOnly value={basicInfo.tipoDocumento ? basicInfo.tipoDocumento : 'Rut'}/>
                </Col>
                <Col span={6}>
                    Nro. de Documento
                    <Input readOnly value={basicInfo.nroDocumento ? basicInfo.nroDocumento : record.rut }/>
                </Col>
                <Col span={6}>
                    Tipo de Persona
                    <Input readOnly value={record.type === 'Person' ? "Persona":"Empresa"} />
                </Col>
                {record.type === 'Person' &&
                <>
                    <Col span={6} >
                        Propósito de la relación
                        <Input readOnly value={basicInfo.propositoRel} className={actual && basicInfo.propositoRel !== actual.propositoRel && "difference"} />
                    </Col>
                    <Col span={6}>
                        Nacionalidad
                        <Input readOnly value={basicInfo.nationality} className={actual && basicInfo.nationality !== actual.nationality && "difference"} />
                    </Col>
                    <Col span={6}>
                        País de residencia
                        <Input readOnly value={basicInfo.residenciaPais} className={actual && basicInfo.residenciaPais !== actual.residenciaPais && "difference"} />
                    </Col>
                    <Col span={6}>
                        Ocupación u oficio
                        <Input readOnly value={basicInfo.oficio} className={actual && basicInfo.oficio !== actual.oficio && "difference"} />
                    </Col>
                </>
                }
                {record.type === 'Entity' &&
                <>
                    <Col span={6} >
                        Propósito de la relación
                        <Input readOnly value={basicInfo.propositoRel} className={actual && basicInfo.propositoRel !== actual.propositoRel && "difference"} />
                    </Col>
                    <Col span={6}>
                        Tipo Sociedad
                        <Input readOnly value={basicInfo.tipoSociedad} className={actual && basicInfo.tipoSociedad !== actual.tipoSociedad && "difference"} />
                    </Col>
                    {basicInfo.tipoEmpresa !== undefined &&
                        <Col span={6}>
                            Tipo de Empresa
                            <Input readOnly value={basicInfo.tipoEmpresa} className={actual && basicInfo.tipoEmpresa !== actual.tipoEmpresa && "difference"} />
                        </Col>
                    }
                    {basicInfo.tamEmpresa !== undefined &&
                        <Col span={6}>
                            Tamaño de la Empresa
                            <Input readOnly value={basicInfo.tamEmpresa} className={actual && basicInfo.tamEmpresa !== actual.tamEmpresa && "difference"} />
                        </Col>
                    }
                </>
                }
            </Row>
        </div>
    );
};

export default InfoBasic;