import './ModalViewSimulation.scss'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Modal, Progress, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { TabAlertsSimulator } from '../'
import { getSimulacionPromise } from '../TabSimulator/promises'

const ModalViewSimulation = ({ currentUser, isVisible, handleClose, sim }) => {
  const [simulation, setSimulation] = useState({ estado: '' })

  const { t } = useTranslation()

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
      savedCallback.current = callback;
    });

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }

      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }, [delay]);
  }

  useEffect(() => {
    setSimulation(sim)
  }, [])

  useInterval(() => {
    handleRefreshItems(sim)
  }, 1000)

  const handleRefreshItems = async (simObj) => {
    if(simObj.estado !== 'FINALIZED' && simObj.estado !== 'APPLIED' && simObj.estado !== 'DISCARDED') {
      const sim = await getSimulacionPromise(simObj.id)
      setSimulation(sim.data)
    }
  }

  return (
    <Modal
      className={'modal-view-simulation ' + simulation.estado}
      footer={ null }
      header={ null }
      onCancel={ handleClose }
      visible={ isVisible }
      width={sim.estado === 'FINALIZED' || sim.estado === 'APPLIED' || sim.estado === 'DISCARDED' || simulation.estado === 'FINALIZED' || simulation.estado === 'APPLIED' || simulation.estado === 'DISCARDED' ? 1200 : 1000}
      >
      <div className="modal-view-simulation-header">
        <h1>{ sim.name }</h1>
      </div>
      <div className="modal-view-simulation-body">
        <div className={'modal-view-simulation-body-inner ' + simulation.estado}>
          { simulation !== null &&
            <div className="modal-view-simulation-body-inner-inner">
            { ( simulation.estado === "FINALIZED" || simulation.estado === "APPLIED" || simulation.estado === "DISCARDED") ?
                <TabAlertsSimulator currentUser={currentUser} sim={simulation} />
              :
                <div className="content-wrap index-2">
                  <div className="content-wrap-inner">
                    { simulation !== null &&
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
                                    { simulation.estado === 'EXECUTING' && <Progress type="circle" percent={ simulation.nroTransacciones === 0 ? 100 : parseInt(( simulation.nroTransaccionesProc * 100 ) / simulation.nroTransacciones ) } height={ 100 } /> }
                                    { simulation.estado === 'SENDING' && <Progress type="circle" percent={ simulation.nroAlertas === 0 ? 100 : parseInt(( simulation.nroAlertasProc * 100 ) / simulation.nroAlertas ) } height={ 100 } /> }
                                  </div>
                                  <div className="bottom-bar">
                                    { t('messages.aml.monitor.status.' + simulation.estado) }
                                  </div>
                                </div>
                              </Col>
                              <Col span="18">
                                <ul>
                                  <li><label>Estado</label><p>{ t('messages.aml.monitor.status.' + simulation.estado) }</p></li>
                                  <li><label>Nro. de Transacciones</label><p>{ simulation.nroTransacciones }</p></li>
                                  <li><label>Nro. de Alertas</label><p>{ simulation.estado === 'SENDING' ? simulation.nroAlertas  : 'N/A' }</p></li>
                                  <li><label>Período</label> <p>{ sim.period }</p></li>
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
          }
        </div>
      </div>
      <div className="modal-view-simulation-footer">
        <Button type="primary" onClick={handleClose}>Cerrar</Button>
      </div>
    </Modal>
  )
}

export default ModalViewSimulation
