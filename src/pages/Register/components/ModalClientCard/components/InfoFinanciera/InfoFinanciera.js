import React from 'react';
import {Row, Col, Input } from 'antd';
const InfoFinanciera = (infoFinanciera = {}, actual) => {
    return (
        <div>
            <Row gutter={[32, 32]}>
                <Col span={6}>
                Año
                <Input
                    readOnly
                    value={infoFinanciera.anio}
                    className={actual && infoFinanciera.anio !== actual.anio && "difference"}
                />
                </Col>
                <Col span={6}>
                Ingresos totales anuales
                <Input
                    readOnly
                    value={infoFinanciera.ingreso}
                    className={actual && infoFinanciera.ingreso !== actual.ingreso && "difference"}
                />
                </Col>
                <Col span={6}>
                Egresos totales anuales
                <Input
                    readOnly
                    value={infoFinanciera.egreso}
                    className={actual && infoFinanciera.egreso !== actual.egreso && "difference"}
                />
                </Col>
                <Col span={6}>
                Valor activos
                <Input
                    readOnly
                    value={infoFinanciera.activos}
                    className={actual && infoFinanciera.activos !== actual.activos && "difference"}
                />
                </Col>
                <Col span={6}>
                Valor pasivos
                <Input
                    readOnly
                    value={infoFinanciera.pasivos}
                    className={actual && infoFinanciera.pasivos !== actual.pasivos && "difference"}
                />
                </Col>
                <Col span={6}>
                Utilidad/Perdida
                <Input
                    readOnly
                    value={infoFinanciera.utilidad}
                    className={actual && infoFinanciera.utilidad !== actual.utilidad && "difference"}
                />
                </Col>
                <Col span={6}>
                Nro. de empleados
                <Input
                    readOnly
                    value={infoFinanciera.nroEmpleados}
                    className={actual && infoFinanciera.nroEmpleados !== actual.nroEmpleados && "difference"}
                />
                </Col>
            </Row>
        </div>
    );
};

export default InfoFinanciera;