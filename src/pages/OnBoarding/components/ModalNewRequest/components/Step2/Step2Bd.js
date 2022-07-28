import React, {useEffect, useState} from "react"
import './Step2Bd.scss'
import {Form, Row, Col, Select, Button, message} from 'antd'
import {getAreasPromise} from '../../../../promises'
import {getClientsMinPromise} from '../../../../promises'
import { getGruposPromise } from '../../../../../Register/promises'

const Step2Bd = ({form, next2Bd, prev, currentUser}) => {

    const [area, setArea] = useState([])
    const { getFieldDecorator, validateFields, getFieldsError, setFieldsValue } = form;
    const [grupos, setGrupos] = useState([]);

    useEffect(() => {
      getAreasPromise().then(response => {
          setArea(response);
      })
      getGruposPromise('ALL').then(response => {
          setGrupos(response);
      })
    }, [])

    const nextStepLocal = () => {
        validateFields(['category', 'typePerson', 'company', 'area', 'segment']).then((c) => {
            next2Bd(c)
        })
      }

    return (
        <div className="step2bd-content">
            <div className="step2bd-title">
                Paso 2: Identifique el tipo de destinatario a través de filtros
            </div>
            <div>
                <Form>
                    <Row className="step2bd-field-select" gutter={[30,0]}>
                        <Col span={5}>
                            <Form.Item label="Indique la categoría">
                                { getFieldDecorator('category', {
                                    rules: [{
                                        required: true,
                                        message: 'Indique la Categoría'
                                    }]
                                })(
                                    <Select>
                                        <Select.Option value="CLIENTE">Cliente</Select.Option>
                                        <Select.Option value="COLABORADOR">Colaborador</Select.Option>
                                        <Select.Option value="PROVEEDOR">Proveedor</Select.Option>
                                        <Select.Option value="DIRECTOR">Director</Select.Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label="Tipo de Persona">
                                { getFieldDecorator('typePerson', {
                                    rules: [{
                                        required: true,
                                        message: 'Tipo de persona'
                                    }]
                                })(
                                    <Select>
                                        <Select.Option value="Person">Persona Natural</Select.Option>
                                        <Select.Option value="Entity">Persona Jurídica</Select.Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        { currentUser.cliente.outsourcer && currentUser.cliente.clientes && currentUser.cliente.clientes.length > 0 &&
                          <Col span={5}>
                              <Form.Item label="Empresa">
                                  { getFieldDecorator('company', {
                                      rules: [{
                                          required: false,
                                          message: 'Empresa'
                                      }]
                                  })(
                                      <Select allowClear>
                                           {(currentUser.empresas !== null && currentUser.empresas.length > 0) ?
                                              currentUser.empresas.map( (c) => <Select.Option value={c.id}>{c.name}</Select.Option>)
                                           :
                                           <Select.Option value="N/A">No tiene empresas</Select.Option>
                                           }
                                      </Select>
                                  )}
                              </Form.Item>
                          </Col>
                        }
                        <Col span={5}>
                            <Form.Item label="Área">
                            { getFieldDecorator('area', {
                                rules: [{
                                    required: false,
                                    message: 'Área'
                                }]
                            })(
                                <Select allowClear>
                                     {(area.length > 0) ?
                                        area.map( (c) => <Select.Option value={c}>{c}</Select.Option>)
                                     :
                                        <Select.Option value="N/A">No tiene área</Select.Option>
                                     }
                                </Select>
                            )}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="Grupo">
                            { getFieldDecorator('segment', {
                                rules: [{
                                    required: false,
                                    message: 'Segmento'
                                }]
                            })(
                                <Select allowClear>
                                  { grupos.map(g =>
                                    <Select.Option value={g.grupo}>{g.grupo}</Select.Option>
                                  )}
                                </Select>
                            )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div className="steps-buttons">
                <Button  onClick={() => prev()}>
                    Atrás
                </Button>
                <Button style={{ marginLeft: 8 }} type="primary" onClick={() => nextStepLocal()}>
                    Siguiente
                </Button>
            </div>
        </div>
    )
}
export default Form.create()(Step2Bd);
