import React from 'react';
import {Row, Table } from 'antd'
const BenFinales = ({benFinales={}, actual}) => {
    const sociedadesColumns = [
        {
            title: "Nombre",
            dataIndex: 'name'
        },
        {
            title: "Nro. identificación",
            dataIndex: 'nroDoc'
        },
        {
            title: "Nacionalidad",
            dataIndex: 'nacionalidad'
        },
        {
            title: "País de residencia",
            dataIndex: 'pais'
        },
        {
            title: "Participación en %",
            dataIndex: 'porcParti'
        },
    ]
    return (
        <div>
            <Row className="field-section-row">
                <Table
                    className={actual && benFinales.records !== actual.records && "difference"}
                    columns={sociedadesColumns}
                    dataSource={benFinales.records}
                    pagination={benFinales.records && benFinales.records.length > 10}
                />
            </Row>
        </div>
    );
};

export default BenFinales;