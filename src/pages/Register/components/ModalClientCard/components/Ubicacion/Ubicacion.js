import React from 'react';
import {Row, Col, Input } from 'antd'

const Ubicacion = ({ubicacion={}, record, actual}) => {
    return (
        <div>
            <Row className="field-section-row" gutter={[32, 32]}>
              {record.type==='Entity' && ubicacion.web !== undefined &&
                <Col span={4}>
                  Página Web
                  <Input readOnly value={ubicacion.web}/>
                </Col>
              }
              <Col span={record.type==='Entity' && ubicacion.pais !== undefined ?4:5}>
                País
                <Input readOnly value={ubicacion.pais} className={actual && ubicacion.pais !== actual.pais && "difference"}/>
              </Col>
              <Col span={record.type==='Entity' && ubicacion.region !== undefined ?4:5}>
                Región
                <Input readOnly value={ubicacion.region} className={actual && ubicacion.region !== actual.region && "difference"}/>
              </Col>
              <Col span={record.type==='Entity' && ubicacion.comuna !== undefined ?4:5}>
                Comuna
                <Input readOnly value={ubicacion.comuna} className={actual && ubicacion.comuna !== actual.comuna && "difference"}/>
              </Col>
              <Col span={record.type==='Entity' && ubicacion.direccion !== undefined ? 8:9}>
                Domicilio
                <Input readOnly value={ubicacion.direccion} className={actual && ubicacion.direccion !== actual.direccion && "difference"}/>
              </Col>
            </Row>
        </div>
    );
};

export default Ubicacion;