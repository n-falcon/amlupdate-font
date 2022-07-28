import React from 'react';
import {Row, Col, Input } from 'antd';

const OrigenFondos = ({origenFondos={}}) => {
    return (
        <div>
        <Row className="field-section-row">
            <Col span={12}>
                El origen de los fondos con los que se realizan operaciones, provienen de:
                <Input readOnly value={origenFondos.origenRecursos &&
                    origenFondos.origenRecursos.map((e) =>{
                    return " "+ (e === 'Otros' ? origenFondos.origenRecursosOtro : e)
                    }
                    )}
                />
            </Col>
            <Col span={11} offset={1}>
                El o los medios de pagos a ser utilizados serán:
                <Input readOnly value={origenFondos.mediosPago &&
                        origenFondos.mediosPago.map((e) =>{
                    return " "+ (e === 'Otros' ? origenFondos.mediosPagoOtro : e)
                    }
                    )}
                />
            </Col>
        </Row>
        </div>
    );
};

export default OrigenFondos;