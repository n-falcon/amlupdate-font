import './ModalNewAlert.scss'
import React, { useState, useEffect } from 'react'
import {  Button, Col, Input, Modal, Row, Radio, Select, Form, notification, AutoComplete } from 'antd'
import { useTranslation } from 'react-i18next'
import { getClientsMinPromise } from '../../../../../AlertManager/components/AlertCreatorBlock/promises'
import { getRecordByRutPromise, createEventPromise } from '../../promises'

const ModalNewAlert = ({ form, closeModalHandler, categories }) => {
  const [isNewAlertModalVisible, setIsNewAlertModalVisible] = useState(false)
  const [isYesSelected, setIsYesSelected] = useState(false)
  const [isNoSelected, setIsNoSelected] = useState(false)
  const [score, setScore] = useState(null)
  const [name, setName] = useState(null)
  const [description, setDescription] = useState(null)
  const [category, setCategory] = useState(null)
  const [recordId, setRecordId] = useState(null)
  const [recordName, setRecordName] = useState(null)
  const [recordRut, setRecordRut] = useState(null)
  const [recordType, setRecordType] = useState(null)
  const [ changeRut, setChangeRut ] = useState(false)

  const { t } = useTranslation()
  const { TextArea } = Input
  const { getFieldDecorator, validateFields, setFields, getFieldsError } = form;

  const handleSave = (e) => {
    e.preventDefault();
    if(isYesSelected) {
      validateFields([
        "name", "score", "description", "category"
      ])
    }else {
      validateFields([
        "name", "score", "description"
      ])
    }

    if (!hasErrors(getFieldsError())) {
      if(isYesSelected && recordId === null) {
        notification["error"]({
          message: t("messages.aml.missingRequiredField"),
          description: t('messages.aml.register')
        });
      }else {
        let obj = {
          score,
          params: {
            description: {
              name,
              description
            }
          }
        }
        if(isYesSelected) {
          obj.rut = recordRut
        }
        createEventPromise(obj).then((response) => {
          notification["success"]({
            message: t("messages.aml.notifications.succesfulOperation"),
          });
          closeModalHandler(true)
        })
      }
    }
  }

  function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some((field) => fieldsError[field]);
  }

  const DestinationComplete = (value, onSelectCallback) => {
    const [result, setResult] = useState([]);

    const handleSearch = async(value) => {
      let res = [];

      if(value !== null && value !== '') {
        const records = await getClientsMinPromise(0, 10, [category], value, null, null)
        res = records.data.records
      }
      setResult(res);
    }

    const onSelect = (data, obj) => {
      onSelectCallback(data, obj.props)
    };

    return (
      value !== null ?
      <AutoComplete
        style={{
          width: '100%'
        }}
        onSearch={handleSearch}
        onSelect={onSelect}
        disabled={category===null}
        onFocus={() => setRecordName(null)}
        value={value}
      >
        {result.map(record => (
          <AutoComplete.Option value={record.id} rut={record.rut} type={record.type}>
            {record.name}
          </AutoComplete.Option>
        ))}
      </AutoComplete>
      :
      <AutoComplete
        style={{
          width: '100%'
        }}
        onSearch={handleSearch}
        onSelect={onSelect}
        disabled={category===null}
        onFocus={() => setRecordName(null)}
      >
        {result.map(record => (
          <AutoComplete.Option value={record.id} rut={record.rut} type={record.type}>
            {record.name}
          </AutoComplete.Option>
        ))}
      </AutoComplete>
    )
  }

  const onSelectRegister = async (data, obj ) => {
    setRecordId(data)
    setRecordRut(obj.rut)
    setRecordType(obj.type)
  };

  const changeSelectedHandler = (e) => {
    if (e.target.value) {
      setIsYesSelected(true)
      setIsNoSelected(false)
    } else {
      setIsNoSelected(true)
      setIsYesSelected(false)
    }
  }

  const changeRutHandler = (e) => {
    setChangeRut(true)
    setRecordRut(e.target.value)
  }

  const searchRecordByRut = async () => {
    if(changeRut && recordRut !== null && recordRut !== '') {
      let record = await getRecordByRutPromise(recordRut)
      if(record !== null && record !== '') {
        setRecordName(record.nombre)
        setRecordId(record.id)
        setRecordType(record.type)
        setCategory(record.category)
      }else {
        setRecordRut(null)
        setRecordName('')
        setRecordId(null)
        setRecordType(null)
        notification["error"]({
          message: t("messages.aml.recordNotExist"),
        });
      }
    }
  }

  return (
    <>
      <Form onSubmit={handleSave} className="form-form">
          <h3>Nueva Alerta</h3>
          <div className="section-wrap first">
            <Row>
              <Col span="18">
                <p>¿ La Alerta personalizada que desea crear se encuentra asociada a una persona natural o jurídica registrada en AMLUPDATE ?</p>
              </Col>
              <Col span="6" style={{ paddingTop: 10 }}>
              <Radio.Group onChange={changeSelectedHandler}>
                <Radio value={true} >Sí</Radio>
                <Radio value={false} >No</Radio>
              </Radio.Group>
              </Col>
            </Row>
          </div>
          <div className={'section-first-dropdown visible-' + isYesSelected}>
              <div className="section-first-dropdown-inner">
                <Row>
                  <Col span="24"><p style={{ borderBottom: '1px rgba(255, 255, 255, .3) solid' }}>A continuación complete los datos de la persona a quien se le relacionará la alerta.</p></Col>
                </Row>
                <Row>
                  <Col span="12" className="main">
                    <div className="col-inner">
                      <p>Categoría</p>
                      <Form.Item>
                        { getFieldDecorator('category', {
                            initialValue: category,
                            rules: [
                              {
                                required: true,
                                message: t("messages.aml.requestedField")
                              },
                            ],
                          })(
                            <Select style={{ width: '100%' }} value={category} onChange={(value) => setCategory(value)}>
                              { categories.map((item, index) =>
                                <Select.Option value={item}>
                                  { t('messages.aml.category.' + item)}
                                </Select.Option>
                              )}
                            </Select>
                          )
                        }
                      </Form.Item>
                    </div>
                  </Col>
                  <Col span="12">
                    <div className="col-inner">
                      <p>Nombre</p>
                      <Form.Item>
                        { DestinationComplete(recordName, onSelectRegister) }
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span="12">
                    <div className="col-inner">
                      <p>Rut</p>
                      <Form.Item>
                        <Input value={recordRut} onChange={(e) => setRecordRut(e.target.value)} onFocus={() => setChangeRut(false)} onChange={changeRutHandler} onBlur={searchRecordByRut}/>
                      </Form.Item>
                    </div>
                  </Col>
                  <Col span="12">
                    <div className="col-inner">
                      <p>Tipo de Persona</p>
                      <Form.Item>
                        <Input disabled={true} value={recordType !== null ? t('messages.aml.' + recordType.toString().toLowerCase()) : ''} />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          <div className="section-wrap">
            {
              isNoSelected &&
              <Row>
                <Col span={24} style={{ marginBottom: 10 }}>
                  <p>A continuación describa la situación o evento respecto del cual desea realizar un seguimiento y mantener un historial.</p>
                </Col>
              </Row>
            }
            <Row>
              <Col span="12">
                <div className="col-inner" style={{ paddingRight: 15 }}>
                  <p>Descripción Corta</p>
                  <Form.Item>
                    { getFieldDecorator('name', {
                        rules: [
                          {
                            required: true,
                            message: t("messages.aml.requestedField")
                          },
                        ],
                      })(
                        <Input maxlength="35" value={name} onChange={(e) => setName(e.target.value)}/>
                      )
                    }
                  </Form.Item>
                </div>
              </Col>
              <Col span="12">
                <p>Puntaje</p>
                <Form.Item>
                  { getFieldDecorator('score', {
                      rules: [
                        {
                          required: true,
                          message: t("messages.aml.requestedField")
                        },
                      ],
                    })(
                      <Select style={{ width: '100%' }} onChange={(value) => setScore(value)}>
                        <Select.Option value={1}>{ t("messages.aml.low") }</Select.Option>
                        <Select.Option value={2}>{ t("messages.aml.medium") }</Select.Option>
                        <Select.Option value={3}>{ t("messages.aml.high") }</Select.Option>
                        <Select.Option value={4}>{ t("messages.aml.critical") }</Select.Option>
                      </Select>
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className="section-wrap">
            <Row>
              <Col span="24">
                <p>Descripción Larga</p>
                <Form.Item>
                  { getFieldDecorator('description', {
                      rules: [
                        {
                          required: true,
                          message: t("messages.aml.requestedField")
                        },
                      ],
                    })(
                      <TextArea style={{ height: 100, width: '100%' }} value={description} onChange={(e) => setDescription(e.target.value)}></TextArea>
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className="section-wrap">
            <Row>
              <Col className="foot" span="24" style={{ color: 'rgba(0, 0, 0, .5)' }}>
                {
                  isYesSelected &&
                  <p>La alerta personalizada a ser creada se encuentra asociada a una persona registrada en AMLUPDATE, por tanto el riesgo asignado será Demográfico (identificado con la letra D)</p>
                }

                {
                  isNoSelected &&
                  <p>La alerta personalizada a ser creada se encuentra asociada a una situación o evento y será categorizada como riesgo de Cumplimiento (identificado con la letra O)</p>
                }
              </Col>
            </Row>
          </div>
          <div className="section-wrap last">
            <Row>
              <Button type="primary" icon="disk" htmlType="submit">{t('messages.aml.save')}</Button>
            </Row>
          </div>
      </Form>
    </>
  )
}

export default Form.create()(ModalNewAlert)
