import React from 'react';
import {Row, Col, Table, Button} from 'antd'
const ParticipacionSoc = ({sociedades, actual, record}) => {
    const socRecColumns = () => {
        const columns = [
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
        if (record.type === 'Person'){
            columns.push(
            {
                title: "Cargo",
                dataIndex: 'cargo'
            },
            )
        }

        columns.push(
            {
            title: "Nom. Emp. Prop. Indirecta",
            dataIndex: 'nombrePropIndirect'
            },
            {
            title: "Ident. Emp. Prop. Indirecta",
            dataIndex: 'nroIdPropIndirect'
            }
        )

        return columns
        }
    return (
        <div>
            <Row gutter={[48, 48]}>
                <Col span={22}>
                    Participa en sociedades, en forma directa o a través de otras personas naturales o jurídicas,
                    con un 10% o más de su capital, o bien ocupa el cargo de director, gerente general o
                    ejecutivo principal, tanto en el país como en el extranjero
                </Col>
                <Col span={2}>
                    <Button type="primary" className="radioDecision">
                        {sociedades && sociedades.hasSociedades ? "Si" : "No"}
                    </Button>
                </Col>
                </Row>
                {sociedades && sociedades.hasSociedades &&
                <Row className="field-section-row">
                    <Col span={24}>
                    <Table
                        className={actual && sociedades.socRecords !== actual.socRecords && "difference"}
                        columns={socRecColumns()}
                        dataSource={sociedades && sociedades.socRecords}
                        pagination={ sociedades && sociedades.socRecords && sociedades.socRecords.length > 10 }
                    />
                    </Col>
                </Row>
                }
        </div>
    );
};

export default ParticipacionSoc;