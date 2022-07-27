import './SuspiciousOperationBlock.scss'
import React, { useEffect, useState } from 'react'
import { Button, Col, DatePicker, Icon, Input, Radio, Row, Switch,notification } from 'antd'
import dateIcon from './date-icon.png'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { requestRosPromise, updateRosPromise } from "../../promises";

const SuspiciousOperationBlock = ({ alert, currentUser, refreshHandler }) => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [changes, setChanges] = useState(0)
  const [ros, setRos] = useState({})
  const [commentsResponse, setCommentsResponse] = useState(null)
  const [date, setDate] = useState(null)
  const [code, setCode] = useState(null)

  const { t } = useTranslation()

  useEffect(() => {
		if(alert !== null && alert.ros !== null) {
			setRos(alert.ros)
		}
	}, [alert])

  function requestRos() {
    requestRosPromise(alert.id, ros.comments).then((response) => {
      notification["success"]({
        message: t("messages.aml.delivered"),
      });
      setRos({...ros, comments:''})
      refreshHandler()
    });
  }

  function updateRos() {
    updateRosPromise(alert.id, ros).then((response) => {
      notification["success"]({
        message: t("messages.aml.delivered"),
      });
      setRos({...ros,
        status:null,
        comments:null,
        dateReport:null,
        code:null
      })
      refreshHandler()
    });
  }

  const handlerOnChange = (field,value) => {
    console.log(ros)
    setRos({...ros,[field]:value})
    setChanges(changes+1)
  }


  return (
      <div className="suspicious-operation-block block">
        { alert !== null &&
          <>
            <div className="block-title">
              <Icon type="file" />
              <h3>{ t('messages.aml.suspiciousOperationReport') }</h3>
              <Switch size="small" onChange={ value => setIsEnabled(value) } />
              { changes > 0 && currentUser.cliente.oficialCto !== null && currentUser.id === currentUser.cliente.oficialCto.id &&
              <Button className="save-button" onClick = {(e)=>updateRos()} type="primary" icon="save" size="small">Guardar cambios</Button> }
            </div>
            <div className={ isEnabled ? "block-content show " : "block-content hide "}>
              <div className="block-content-inner">
                {
                  currentUser.cliente.oficialCto !== null && currentUser.id === currentUser.cliente.oficialCto.id ?
                    <div className="item">
                      <Row>
                        <Col span={6}>
                          <div className="col-inner">
                            <label className="column-name">
                              { t('messages.aml.authorization') }
                            </label>
                            <Radio.Group onChange={ e => handlerOnChange('status',e.target.value) } >
                              <div className="radios">
                                <Radio value="AUTHORIZED">{ t('messages.aml.authorized') }</Radio>
                              </div>
                              <div className="radios">
                                <Radio value='DENIED'>{ t('messages.aml.rejected') }</Radio>
                              </div>
                            </Radio.Group>
                            <div className="date-child-block">
                              <img src={dateIcon} />
                              <small>{ t('messages.aml.date') }: <strong>{alert !== null && alert.ros !== null && moment(alert.ros.date).format('DD/MM/YYYY')}</strong></small>
                            </div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="col-inner">
                            <label className="column-name">
                              { t('messages.aml.comments') }
                            </label>
                            <div className="textarea">
                              <textarea onChange={ e=>handlerOnChange('comments',e.target.value) } placeholder="Comentarios ..." />
                            </div>
                          </div>
                        </Col>
                        <Col span={6}>
                          <div className="col-inner">
                            <label className="column-name">
                              { t('messages.aml.reportROStoUAF') }
                            </label>
                            <div className="dates">
                              { t('messages.aml.reportDate') }
                              <DatePicker style={{ width: '100%' }} placeholder={ t('messages.aml.selectDate') } onChange={ momentObj => handlerOnChange('dateReport',moment(momentObj).valueOf()) } format="DD/MM/YYYY" />
                            </div>
                            <div className="rosCode">
                              Cod. ROS
                              <Input onChange={ e=> handlerOnChange('code',e.target.value) } />
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    :
                    <div className="item">
                      <Row>
                        <Col span="24">
                          <div className="request-ros">
                            Informe de Operación Sospechosa al Oficial de Cumplimiento
                            { alert.ros === null &&
                              <Button type="primary" className="request-ros-button" icon="plus" onClick = {(e)=>requestRos()}>Solicitar Ahora</Button>
                            }
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col span="24">
                          <textarea disabled={alert.ros !== null} defaultValue={alert.ros !== null ? ros.comments : null} onChange={ e=>handlerOnChange('comments',e.target.value) } placeholder="Comentarios ..." style={{ height: 100 }}></textarea>
                        </Col>
                      </Row>
                      {alert.ros !== null &&<Row>
                       <center>Última modificación: <strong>{moment(alert.ros.date).format('DD/MM/YYYY')}</strong></center>
                      </Row>}

                    </div>
                }
              </div>
            </div>
          </>
        }
      </div>
  )
}

export default SuspiciousOperationBlock
