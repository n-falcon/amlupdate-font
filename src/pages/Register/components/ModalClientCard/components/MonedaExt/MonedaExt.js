import React from 'react';
import {Row, Col, Table } from 'antd';

const MonedaExt = ({monedaExt={}, actual, lastFormDate}) => {
    const exMonColumns = [
        {
            title: "Tipo de moneda",
            dataIndex: 'tipoMon'
        },
        {
            title: "País",
            dataIndex: 'country'
        },
    ]
    return (
        <div>
            <Row className="field-section-row">
                <Col span={24}>
                    <Table
                        className={actual && monedaExt.exMonRecords !== actual.exMonRecords && "difference"}
                        columns={exMonColumns}
                        dataSource={monedaExt.exMonRecords}
                        pagination={monedaExt.exMonRecords && monedaExt.exMonRecords.length > 10 }
                    />
                </Col>
            </Row>
        </div>
    );
};

export default MonedaExt;