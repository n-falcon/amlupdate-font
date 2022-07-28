import React from 'react';
import {Row, Col, Table, Button } from 'antd';
import moment from 'moment'
const InfoPep = ({infoPep={}, record, actual}) => {
    const relationRecColumns = [
        {
            title: "Empresa",
            dataIndex: 'empresa'
        },
        {
            title: "Nro. Identificación",
            dataIndex: 'nroIdEmp'
        },
        {
            title: "Tipo relación",
            dataIndex: 'tipoRel'
        },
        {
            title: "País",
            dataIndex: 'pais'
        }
        ]
    const publicRecColumns = [
        {
            title: "Organismo público",
            dataIndex: 'orgPublic'
        },
        {
            title: "Cargo",
            dataIndex: 'cargo'
        },
        {
            title: "País",
            dataIndex: 'pais'
        },
        {
            title: "Término",
            dataIndex: 'fecTermino',
            render: (date) => {
            return moment(date).format('DD/MM/YYYY')
            }
        },
    ]
    const familyRecColumns = [
        {
        title: "Organismo público",
        dataIndex: 'orgPublic'
        },
        {
        title: "País",
        dataIndex: 'pais'
        },
        {
        title: "Parentesco",
        dataIndex: 'parentesco'
        },
        {
        title: "Nombre",
        dataIndex: 'nombreFuncPublic'
        },
        {
        title: "Número de identificación",
        dataIndex: 'nroIdFuncPublic'
        },
        {
        title: "Cargo",
        dataIndex: 'cargo'
        },
        {
        title: "Término",
        dataIndex: 'fecTermino',
        render: (date) => {
            return moment(date).format('DD/MM/YYYY')
        }
        },
    ]
    return (
        <div>
        <Row gutter={[0, 36]}>
            <Col span={22}>
                {record.type === 'Person' ?
                "Desempeño o he desempeñado en el último año funciones públicas destacadas, en el país o en el extranjero"
                :
                "En alguno de los grupos antes mencionados existe una persona que desempeñe o haya desempeñado en el último año funciones públicas destacadas, en el país o en el extranjero"
                }.
            </Col>
            <Col span={2} >
                <Button type="primary" className={"radioDecision " + (actual && infoPep.isPublic !== actual.isPublic ? "difference" : "")}>
                    {infoPep.isPublic ? "Si" : "No"}
                </Button>
            </Col>
            </Row>
            {infoPep.isPublic &&
            <Row gutter={[0, 36]}>
                <Col span={24}>
                <Table
                    className={actual && infoPep.publicRecords !== actual.publicRecords && "difference"}
                    columns={publicRecColumns}
                    dataSource={infoPep.publicRecords}
                    pagination={ infoPep.publicRecords && infoPep.publicRecords.length > 10 }
                />
                </Col>
            </Row>
            }
            <Row gutter={[0, 36]}>
            <Col span={22}>
                {record.type === 'Person' ?
                "Poseo un cónyuge o pariente hasta el segundo grado de consanguinidad (abuelo(a), padre, madre, hijo(a), hermano(a), nieto(a)), que desempeña o ha desempeñado en el último año funciones públicas destacadas, en el país o en el extranjero"
                :
                "En alguno de los grupos antes mencionados existe una persona que posea un cónyuge o pariente hasta el segundo grado de consanguinidad (abuelo(a), padre, madre, hijo(a), hermano(a), nieto(a)), que desempeñe o haya desempeñado en el último año funciones públicas destacadas, en el país o en el Extranjero"
                }
            </Col>
            <Col span={2}>
                <Button type="primary" className={"radioDecision " + (actual && infoPep.hasFamily !== actual.hasFamily ? "difference" : "")}>
                {infoPep.hasFamily ? "Si" : "No"}
                </Button>
            </Col>
            </Row>
            {infoPep.hasFamily &&
            <Row className="field-section-row">
                <Col span={24}>
                <Table
                    className={actual && infoPep.familyRecords !== actual.familyRecords && "difference"}
                    columns={familyRecColumns}
                    dataSource={infoPep.familyRecords}
                    pagination={infoPep.familyRecords && infoPep.familyRecords.length > 10 }
                />
                </Col>
            </Row>
            }
            <Row className="field-section-row">
            <Col span={22}>
                {record.type === 'Person' ?
                "He celebrado un pacto de actuación conjunta que otorgue poder de voto suficiente para influir en sociedades constituidas dentro del país, con una persona que desempeña o ha desempeñado en el último año funciones públicas destacadas, en el país o en el Extranjero."
                :
                "En alguno de los grupos antes mencionados existe una persona que ha celebrado un pacto de actuación conjunta que otorgue poder de voto suficiente para influir en sociedades constituidas en Chile, con una persona que desempeñe o haya desempeñado en el último año funciones públicas destacadas, en el país o en el Extranjero."
                }
            </Col>
            <Col span={2}>
                <Button type="primary" className={"radioDecision " + (actual && infoPep.hasRelation !== actual.hasRelation ? "difference" : "")}>
                {infoPep.hasRelation ? "Si" : "No"}
                </Button>
            </Col>
            </Row>
            {infoPep.hasRelation &&
            <Row className="field-section-row">
                <Col span={24}>
                <Table
                    className={actual && infoPep.relationRecords !== actual.relationRecords && "difference"}
                    columns={relationRecColumns}
                    dataSource={infoPep.relationRecords}
                    pagination={infoPep.relationRecords && infoPep.relationRecords.length > 10 }
                />
                </Col>
            </Row>
            }
        </div>
    );
};

export default InfoPep;