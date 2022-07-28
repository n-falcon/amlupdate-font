import React from 'react';
import {Row, Col, Input} from 'antd';

const OficialCumplimiento = ({ofCumplimiento, actual}) => {
    return (
        <div>
            <Row gutter={[36, 36]}>
                <Col span={6}>
                    Nombre
                    <Input
                    readOnly
                    value={ofCumplimiento.ofCumplimientoName}
                    className={actual && ofCumplimiento.ofCumplimientoName !== actual.ofCumplimientoName && "difference"}
                    />
                </Col>
                <Col span={6}>
                    Correo electrónico
                    <Input
                    readOnly
                    value={ofCumplimiento.email}
                    className={actual && ofCumplimiento.email !== actual.email && "difference"}
                    />
                </Col>
                <Col span={6}>
                    Teléfono fijo
                    <Input
                    readOnly
                    value={ofCumplimiento.tel}
                    className={actual && ofCumplimiento.tel !== actual.tel && "difference"}
                    />
                </Col>
                <Col span={6}>
                    Observaciones
                    <Input
                    readOnly
                    value={ofCumplimiento.observacion}
                    className={actual && ofCumplimiento.observacion !== actual.observacion && "difference"}
                    />
                </Col>
            </Row>

        </div>
    );
};

export default OficialCumplimiento;