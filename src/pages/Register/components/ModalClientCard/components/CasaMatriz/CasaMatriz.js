import React from 'react';
import {Row, Col, Input } from 'antd'

const CasaMatriz = ({casaMatriz={}, actual}) => {
    return (
        <div>
            <Row gutter={[36, 36]}>
                <Col span={6}>
                    Nombre
                    <Input readOnly value={casaMatriz.nombreMatriz} className={actual && casaMatriz.nombreMatriz !== actual.nombreMatriz && "difference"}/>
                </Col>
                <Col span={6}>
                    País
                    <Input readOnly value={casaMatriz.paisMatriz} className={actual && casaMatriz.paisMatriz !== actual.paisMatriz && "difference"}/>
                </Col>
                <Col span={6}>
                    Ciudad
                    <Input readOnly value={casaMatriz.ciudadMatriz} className={actual && casaMatriz.ciudadMatriz !== actual.ciudadMatriz && "difference"}/>
                </Col>
                <Col span={6}>
                    Dirección
                    <Input readOnly value={casaMatriz.direccionMatriz} className={actual && casaMatriz.direccionMatriz !== actual.direccionMatriz && "difference"}/>
                </Col>
            </Row>
        </div>
    );
};

export default CasaMatriz;