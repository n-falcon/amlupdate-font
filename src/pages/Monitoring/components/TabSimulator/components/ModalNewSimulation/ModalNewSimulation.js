import './ModalNewSimulation.scss'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, Row, Input, Modal, Progress, notification, Select } from 'antd'
import { createSimulationPromise, simulateRulesPromise, getSimulacionPromise, getStatusMotorPromise } from '../../promises'
import TabRules from '../../../TabRules/TabRules'
import downTimeImg from './downtime.png'
import { useTranslation } from 'react-i18next'

const ModalNewSimulation = ({ currentUser, form, isVisible, onClose, simulation = null }) => {
  const [currentActiveStep, setCurrentActiveStep] = useState(0)
  const [name, setName] = useState(null)
  const [period, setPeriod] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [simId, setSimId] = useState(null)
  const [currentState, setCurrentState] = useState(null)
  const [statusMotor, setStatusMotor] = useState(null)

  const { getFieldDecorator } = form
  const { t } = useTranslation()

  let timer = useRef(null)

  useEffect(() => {
    if(simulation !== null) {
      setName(simulation.name)
      setPeriod(simulation.period)
      setSimId(simulation.id)
    }
   handleGetStatusMotor()
  }, [])

  useEffect(() => {
    if (currentActiveStep === 2) {
      handleStartRefreshLoop()
    }
  }, [currentActiveStep])

  const handleGetStatusMotor = async () => {
    const statusM = await getStatusMotorPromise()
    setStatusMotor(statusM.data)
  }

  const handleFirstSend = async () => {
    form.validateFields(['reference', 'months'])

    if (name !== null && period !== null) {
      setIsLoading(true)
      const id = await createSimulationPromise(name, period, simId !== null ? simId : undefined)
      setIsLoading(false)

      if(id.data.startsWith('ERROR')) {
        notification['error']({
          message: t('messages.aml.notifications.anErrorOcurred')
        })
      }else {
        setSimId(id.data)
        setCurrentActiveStep(1)
      }
    }
  }

  const handleRunSimulation = async () => {
    await setIsLoading(true)
    await simulateRulesPromise(simId)
    await setIsLoading(false)

    setCurrentActiveStep(2)
  }

  const handleStartRefreshLoop = async () => {
    const state = await getSimulacionPromise(simId)
    setCurrentState(state.data)

    timer.current = setInterval(async () => {
      const state = await getSimulacionPromise(simId)
      setCurrentState(state.data)
    }, 1000)
  }

  const handleClose = () => {
    if (timer.current) {
      clearInterval(timer.current)
    }

    onClose()
  }

  return (
    <Modal
      className="modal-new-simulation"
      visible={ isVisible }
      header={ null }
      footer={ null }
      onCancel={ handleClose }
      >
      { statusMotor !== null &&
        <>
        { statusMotor.procesos > 0 || statusMotor.status !== "ONLINE" ?
          <div className="new-simulation-body">
            <div className="downtime">
              { statusMotor.procesos > 0 && <h3>Actualmente se encuentra {statusMotor.procesos} proceso(s) en ejecución</h3> }
              { statusMotor.status !== "ONLINE" && <h3>El motor se encuentra fuera de línea.</h3> }
              <p>Intente nuevamente en unos minutos.</p>
              <img src={downTimeImg} alt="" style={{ margin: '100px auto', height: 100, opacity: 0.9 }} />
            </div>
          </div>
          :
          <>
          <div className="new-simulation-head">
            <ul>
              <li className={ currentActiveStep === 0 ? "step active" : "step" }>
                  <div className="step-number">
                      1
                  </div>
                  <div className="step-name">
                    <h4>Información de Simulación</h4>
                  </div>
              </li>
              <li className={ currentActiveStep === 1 ? "step active" : "step" }>
                  <div className="step-number">
                      2
                  </div>
                  <div className="step-name">
                    <h4>Reglas</h4>
                  </div>
              </li>
              <li className={ currentActiveStep === 2 ? "step active" : "step" }>
                  <div className="step-number">
                      3
                  </div>
                  <div className="step-name">
                    <h4>Grado de avance</h4>
                  </div>
              </li>
            </ul>
          </div>
          <div className="new-simulation-body">
            { currentActiveStep === 0 &&
              <Form>
                <div className="content-wrap index-0">
                  <div className="content-wrap-inner">
                    <Row>
                      <Col span={24}>
                        <label>Ingrese una Referencia corta</label>
                        <Form.Item>
                          { getFieldDecorator('reference', {
                              initialValue: name,
                              rules: [
                                {
                                  required: true,
                                  message: t("messages.aml.requestedField")
                                },
                              ],
                            })(
                              <Input onChange={ e => setName(e.target.value) } value={ name } />
                            )
                          }
                        </Form.Item>
                      </Col>
                    </Row>
                    <br />
                    <Row>
                      <Col span={24}>
                        <label>Período ( Número de meses )</label>
                        <Form.Item>
                          { getFieldDecorator('months', {
                              initialValue: period,
                              rules: [
                                {
                                  required: true,
                                  message: t("messages.aml.requestedField")
                                },
                              ],
                            })(
                              <Select style={{ width: '100%' }} placeholder="Seleccione uno período de tiempo de la lista ..." onChange={ value => setPeriod(value) } defaultValue={ period }>
                                <Select.Option value="1 month">1 Mes</Select.Option>
                                <Select.Option value="2 month">2 Meses</Select.Option>
                                <Select.Option value="3 month">3 Meses</Select.Option>
                                <Select.Option value="4 month">4 Meses</Select.Option>
                                <Select.Option value="5 month">5 Meses</Select.Option>
                                <Select.Option value="6 month">6 Meses</Select.Option>
                                <Select.Option value="7 month">7 Meses</Select.Option>
                                <Select.Option value="8 month">8 Meses</Select.Option>
                                <Select.Option value="9 month">9 Meses</Select.Option>
                                <Select.Option value="10 month">10 Meses</Select.Option>
                                <Select.Option value="11 month">11 Meses</Select.Option>
                                <Select.Option value="12 month">12 Meses</Select.Option>
                              </Select>
                            )
                          }
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Form>
            }
            { (currentActiveStep === 1 && simId !== null) &&
              <div className="content-wrap index-1">
                <div className="content-wrap-inner">
                  <TabRules simId={ simId } currentUser={ currentUser } />
                </div>
              </div>
            }
            { currentActiveStep === 2 &&
              <div className="content-wrap index-2">
                <div className="content-wrap-inner">
                  { currentState !== null &&
                    <>
                      <center>
                        Estimado usuario le informamos que el sistema se encuentra en proceso de cálculo de la simulación solicitada.<br />
                        Una vez concluído el proceso usted podrá revisar los resultados la sección Simulador / dashboard.<br />
                        Así mismo tiene la opción de aplicar las modificaciones realizadas a las reglas de forma automática, guardando registro de la acción que realizó<br />
                      </center>

                        <div className="progress-container">
                          <Row>
                            <Col span="6">
                              <div className="progress-wrap">
                                <div className="progress-wrap-inner">
                                  { (currentState.estado === 'PENDING' || currentState.estado === 'IN_PROCESS') && <Progress type="circle" percent={ 0 } height={ 100 } /> }
                                  { (currentState.estado === 'EXECUTING' || currentState.estado === 'FINALIZED') && <Progress type="circle" percent={ currentState.nroTransacciones === 0 ? 100 : parseInt(( currentState.nroTransaccionesProc * 100 ) / currentState.nroTransacciones ) } height={ 100 } /> }
                                  { currentState.estado === 'SENDING' && <Progress type="circle" percent={ currentState.nroAlertas === 0 ? 100 : parseInt(( currentState.nroAlertasProc * 100 ) / currentState.nroAlertas ) } height={ 100 } /> }
                                </div>
                                <div className="bottom-bar">
                                  { t('messages.aml.monitor.status.' + currentState.estado) }
                                </div>
                              </div>
                            </Col>
                            <Col span="18">
                              <ul>
                                <li><label>Estado</label><p>{ t('messages.aml.monitor.status.' + currentState.estado) }</p></li>
                                <li><label>Nro. de Transacciones</label><p>{ currentState.nroTransacciones }</p></li>
                                <li><label>Nro. de Alertas</label><p>{ currentState.estado === 'SENDING' || currentState.estado === 'FINALIZED' ? currentState.nroAlertas  : 'N/A' }</p></li>
                                <li><label>Período</label> <p>{ period }</p></li>
                              </ul>
                            </Col>
                          </Row>
                      </div>
                    </>
                  }
                </div>
              </div>
            }
          </div>
          <div className="new-simulation-foot">
            { currentActiveStep === 0 &&
              <Button id="go-to-rules" icon={ isLoading ? "loading" : "arrow-right" } type="primary" onClick={ handleFirstSend }>Ir a Tabla de Reglas</Button>
            }
            { currentActiveStep === 1 &&
              <>
                <Button icon="arrow-left" type="primary" onClick={ () => { setIsLoading(false); setCurrentActiveStep(0) }}>Información de Simulación</Button>&nbsp; &nbsp;
                <Button id="run-simulation" icon={ isLoading ? "loading" : "caret-right" } type="primary" onClick={ handleRunSimulation }>Ejecutar Simulación</Button>
              </>
            }
            { currentActiveStep === 2 &&
              <Button icon={ isLoading ? "loading" : "close" } type="primary" onClick={handleClose} >Cerrar ventana (no interrumpe avance).</Button>
            }
          </div>
          </>
        }
      </>
      }
    </Modal>
  )
}

export default Form.create()(ModalNewSimulation)
