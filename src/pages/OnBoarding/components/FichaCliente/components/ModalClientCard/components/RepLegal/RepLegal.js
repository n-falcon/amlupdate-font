import React from 'react';
import {Row, Col, Input } from 'antd';
import moment from 'moment';

const RepLegal = ({repLegal={}, actual}) => {
    return (
        <div>
            <Row gutter={[36, 36]}>
                <Col span={6}>
                Nombres y Apellidos
                <Input readOnly value={repLegal.name} className={actual && repLegal.name !== actual.name && "difference"}/>
                </Col>
                <Col span={6}>
                Nro. de indentificación
                <Input readOnly value={repLegal.nroid} className={actual && repLegal.nroid !== actual.nroid && "difference"}/>
                </Col>
                <Col span={6}>
                Tipo de Documento
                <Input readOnly value={repLegal.tipoDoc} className={actual && repLegal.tipoDoc !== actual.tipoDoc && "difference"}/>
                </Col>
                <Col span={6}>
                Correo electronico
                <Input readOnly value={repLegal.correo} className={actual && repLegal.correo !== actual.correo && "difference"}/>
                </Col>
                <Col span={6}>
                Fecha de Nacimiento
                <Input readOnly value={repLegal.fecNac} className={actual && repLegal.fecNac !== actual.fecNac && "difference"}/>
                </Col>
                <Col span={6}>
                Nacionalidad
                <Input readOnly value={repLegal.nationality} className={actual && repLegal.nationality !== actual.nationality && "difference"}/>
                </Col>
                <Col span={6}>
                Profesión
                <Input readOnly value={repLegal.profesion} className={actual && repLegal.profesion !== actual.profesion && "difference"}/>
                </Col>
                <Col span={6}>
                Es accionista
                <Input readOnly value={repLegal.esAccionista} className={actual && repLegal.esAccionista !== actual.esAccionista && "difference"}/>
                </Col>
                <Col span={6}>
                Teléfono de contacto
                <Input readOnly value={repLegal.telefono} className={actual && repLegal.telefono !== actual.telefono && "difference"}/>
                </Col>
            </Row>
        </div>
    );
};

export default RepLegal;