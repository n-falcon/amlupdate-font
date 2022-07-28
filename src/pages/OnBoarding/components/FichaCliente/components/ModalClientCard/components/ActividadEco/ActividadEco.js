import React from 'react';
import {Row, Col, Input, Table} from 'antd'

const ActividadEco = ({actividadEco={}, actual}) => {
    const actRecordsCol = [
        {
            title: "Actividad Económica",
            dataIndex: "linea",
            key: 'linea1',
            width: "70%",
            render: (linea) => {
                const arr = linea.slice(7)
                return arr
        }
        },
        {
            title: "Código de actividad",
            dataIndex: "linea",
            key: "linea2",
            width: "22%",
            render: (linea) => {
                const arr = linea.substr(0,6)
                return arr
        }
        },
    ];
    return (
        <div>
            <Row className="field-section-row" gutter={[32, 32]}>
                <Col span={12}>
                    Inicio de Actividades
                    <Input readOnly value={actividadEco.initDate} className={actual && actividadEco.initDate !== actual.initDate && "difference"}/>
                </Col>
                <Col span={12}>
                    Experiencia en el mercado (años)
                    <Input readOnly value={actividadEco.aniosExp} className={actual && actividadEco.aniosExp !== actual.aniosExp && "difference"}/>
                </Col>
                <Col span={24}>
                    <Table
                        className={actual && actividadEco.actRecords !== actual.actRecords && "difference"}
                        columns={actRecordsCol}
                        dataSource={actividadEco.actRecords}
                        pagination={actividadEco.actRecords && actividadEco.actRecords.length > 10}
                />
                </Col>
            </Row>
        </div>
    );
};

export default ActividadEco;