import React from 'react';
import {Row, Col, Input } from 'antd';

const InfoTrib = ({infoTributaria = {}, actual, lastFormDate}) => {
    return (
        <div>
            <Row gutter={[36, 36]}>
                <Col span={5}>
                    Tipo de Contribuyente
                    <Input readOnly value={infoTributaria.tipoContribuyente} className={actual && infoTributaria.tipoContribuyente !== actual.tipoContribuyente && "difference"}/>
                </Col>
                <Col span={5}>
                    Tipo de Régimen
                    <Input readOnly value={infoTributaria.regimen} className={actual && infoTributaria.regimen !== actual.regimen && "difference"}/>
                </Col>
                <Col span={5}>
                    Nro. resolución
                    <Input readOnly value={infoTributaria.nroResolucion} className={actual && infoTributaria.nroResolucion !== actual.nroResolucion && "difference"}/>
                </Col>
                <Col span={5}>
                    Obligación fiscal en otro país
                    <Input readOnly value={infoTributaria.fiscalObligations} className={actual && infoTributaria.fiscalObligations !== actual.fiscalObligations && "difference"}/>
                </Col>
                <Col span={4}>
                    País
                    <Input readOnly value={infoTributaria.fisObligationsCountry ? infoTributaria.fisObligationsCountry : "N/A"} className={actual && infoTributaria.fisObligationsCountry !== actual.fisObligationsCountry && "difference"}/>
                </Col>
            </Row>
        </div>
    );
};

export default InfoTrib;