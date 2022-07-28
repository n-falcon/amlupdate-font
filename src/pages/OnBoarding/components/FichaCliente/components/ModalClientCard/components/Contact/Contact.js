import React from 'react';
import {Row, Col, Input } from 'antd'

const Contact = ({contacto={}, record, actual}) => {
    return (
        <div>
            <Row gutter={[36, 36]}>
                    {record.type==='Entity' &&
                      <Col span={6}>
                        Nombre
                        <Input readOnly value={contacto.contactName} className={actual && contacto.contactName !== actual.contactName && "difference"}/>
                      </Col>
                    }
                    {record.type==='Entity' &&
                      <Col span={6}>
                        Cargo
                        <Input readOnly value={contacto.infoCargo} className={actual && contacto.infoCargo !== actual.infoCargo && "difference"}/>
                      </Col>
                    }
                    {record.type==='Person' &&
                      <Col span={8}>
                        Celular
                        <Input readOnly value={contacto.cel} className={actual && contacto.cel !== actual.cel && "difference"}/>
                      </Col>
                    }
                    <Col span={record.type==='Entity' ?6:8}>
                      Teléfono Fijo
                      <Input readOnly value={contacto.tel} className={actual && contacto.tel !== actual.tel && "difference"}/>
                    </Col>
                    <Col span={record.type==='Entity' ? 6:8}>
                      Correo Electrónico
                      <Input readOnly value={contacto.mail} className={actual && contacto.mail !== actual.mail && "difference"}/>
                    </Col>
                  </Row>
        </div>
    );
};

export default Contact;