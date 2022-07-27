import './RevisionBlock.scss'
import React, { useEffect, useState } from 'react'
import { Button, Col, Icon, Input, Modal, notification, Row, Select, Switch, Upload, Tooltip, Steps, Popconfirm } from 'antd'
import { saveTaskPromise, uploadFilesTaskPromise } from './promises'
import { useTranslation } from 'react-i18next'
import { camelizerHelper } from '../../../../helpers'
import moment from 'moment'
import { ReportService } from '../../../../services'

const RevisionBlock = ({ alert, origin, currentUser, taskId=null, refreshHandler }) => {
  const [isEnabled, setIsEnabled] = useState(false)
  const tasks = ['Solicitamos el Origen de Fondos', 'Solicitamos mayor información de la persona', 'Solicitamos una explicación de la transacción realizada', 'Solicitar Orígen de Fondos']
  const [tasksCollection, setTasksCollection] = useState([])
  const { t } = useTranslation()
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false)
  const [currentActiveTask, setCurrentActiveTask] = useState(null)
  const [areAllTasksClosed, setAreAllTasksClosed] = useState(false)
  const [ fileList, setFileList ] = useState([])
  const [ filesUploaded, setFilesUploaded ] = useState(null)

  useEffect(() => {
    if (origin === "portal") {
      setIsEnabled(true)
    }
    if (alert !== null) {
      handleSetTasksCollection()
    }
  }, [alert])

  const checkIfAllTasksAreClosed = () => {
    const tasksNum = tasksCollection.length
    let tasksClosed = 0

    for (let i = 0; i < tasksCollection.length; i++) {
      if (tasksCollection[i].estadoResp === "TERMINADO") {
        tasksClosed++
      }
    }

    if (tasksClosed === tasksNum) {
      setAreAllTasksClosed(true)
    }
  }

  const getUploadProps = (task) => {
    return {
      accept: ".pdf",
      onRemove: file => {
        setFileList(oldFileList => {
          const index = oldFileList.indexOf(file)
          const newFileList = oldFileList.slice()

          newFileList.splice(index, 1)

          return newFileList
        })
      },
      beforeUpload: file => {
        setFileList(oldFileList => [...oldFileList, file])
        return false
      },
      multiple: true,
      fileList
    }
  }

  const handleSetTasksCollection = async () => {
    await setTasksCollection(oldTasks => {
      const arr = JSON.parse(JSON.stringify(alert.tasks))

      for (let i = 0; i < arr.length; i++) {
        arr[i].changes = 0
        arr[i].estadoRespOrig = arr[i].estadoResp
        arr[i].filesOrig = arr[i].files
        arr[i].filesRespOrig = arr[i].filesResp
        if(origin === 'portal')
          arr[i].origin = origin
        else if(arr[i].responsable === null && arr[i].estadoResp !== 'TERMINADO') {
          arr[i].origin = 'portal'
        }else {
          arr[i].origin = origin
        }
      }

      return arr
    })
  }

  const handleCommentsChange = (value, index) => {
    setTasksCollection(oldCollection => {
      const obj = JSON.parse(JSON.stringify(oldCollection))

      obj[index].comentarios = value
      obj[index].changes = obj[index].changes + 1

      return obj
    })
  }

  const handleSetResponseState = (name, index) => {
    if(tasksCollection[index].estadoRespOrig === 'PENDIENTE' || (tasksCollection[index].estadoRespOrig === 'EN_PROCESO' && name !== 'PENDIENTE') || (tasksCollection[index].estadoRespOrig === 'TERMINADO'  && name === 'TERMINADO')) {
      setTasksCollection(oldCollection => {
        const arr = JSON.parse(JSON.stringify(oldCollection))

        arr[index].estadoResp = name
        arr[index].changes = arr[index].changes + 1

        return arr
      })
    }
  }

  const handleSave = async (index, selectedTask = null) => {
    const defaultTask = {
      alertId: alert.id,
      userId: currentUser.id,
      origin: tasksCollection[index].origin,
      task: {
        id: tasksCollection[index].id,
        estado: tasksCollection[index].estado,
        estadoResp: tasksCollection[index].estadoResp,
        comentarios: tasksCollection[index].comentarios,
        comentariosResp: tasksCollection[index].comentariosResp
      }
    }

    if(selectedTask !== null) {
      defaultTask.task = selectedTask
    }
    defaultTask.task.files = filesUploaded

    await setTasksCollection(oldCollection => {
        const arr = JSON.parse(JSON.stringify(oldCollection))
        arr[index].changes = 0
        return arr
    })


    saveTaskPromise(defaultTask)
      .then(response => {
        notification['success']({
          message: "Operación exitosa",
          description: "Tarea guardada exitosamente"
        })

        setTasksCollection(oldCollection => {
          const arr = JSON.parse(JSON.stringify(oldCollection))
          arr[index] = response.data
          arr[index].estadoRespOrig = arr[index].estadoResp
          if(origin === 'portal')
            arr[index].origin = origin
          else if(arr[index].responsable === null && arr[index].estadoResp !== 'TERMINADO') {
            arr[index].origin = 'portal'
          }else {
            arr[index].origin = origin
          }
          return arr
        })

        closeModalFiles()
        if(refreshHandler !== undefined) refreshHandler()
      })
      .catch(error => {
        window.alert(error)
      })
  }

  const handleResponsibleCommentsChange = (value, index) => {
    setTasksCollection(oldCollection => {
      const arr = JSON.parse(JSON.stringify(oldCollection))
      arr[index].comentariosResp = value
      arr[index].changes = arr[index].changes + 1
      return arr
    })
  }

  const handleShowUploadModal = task => {
    setIsUploadModalVisible(true)
    setCurrentActiveTask(task)
    setFileList([])
  }

  const handleCloseTask = index => {
    setTasksCollection(oldCollection => {
      const arr = JSON.parse(JSON.stringify(oldCollection))
      arr[index].estado = "CERRADA"
      arr[index].changes = arr[index].changes + 1
      return arr
    })

    const task = {
      id: tasksCollection[index].id,
      estado: "CERRADA",
      estadoResp: tasksCollection[index].estadoResp,
      comentarios: tasksCollection[index].comentarios,
      comentariosResp: tasksCollection[index].comentariosResp
    }

    handleSave(index, task)
  }

  const renderStatusIcon = status => {
    switch (status) {
      case "PENDIENTE":
        return "status-icon status1"
        break
      case "EN_PROCESO":
        return "status-icon status2"
        break
      case "TERMINADO":
        return "status-icon status3"
        break
    }
  }

  const handleCloseOverlay = index => {
    setTasksCollection(oldCollection => {
      const arr = JSON.parse(JSON.stringify(oldCollection))
      arr[index].overlay = false
      return arr
    })
  }

  const handleRejectTask = index => {
    setTasksCollection(oldCollection => {
      const arr = JSON.parse(JSON.stringify(oldCollection))
      arr[index].estadoResp = "EN_PROCESO"
      return arr
    })

    const task = {
      id: tasksCollection[index].id,
      estado: tasksCollection[index].estado,
      estadoResp: "EN_PROCESO",
      comentarios: tasksCollection[index].comentarios,
      comentariosResp: tasksCollection[index].comentariosResp
    }

    handleSave(index, task)
  }

  const closeModalFiles = () => {
    setFileList([])
    setFilesUploaded(null)
    setIsUploadModalVisible(false)
  }

  const loadFiles = () => {
    const formData = new FormData()
    fileList.forEach(file => {
      formData.append('file', file)
    })
    uploadFilesTaskPromise(formData, currentUser.id, currentActiveTask.origin, alert.id, currentActiveTask.nro)
      .then(response => {
        setFilesUploaded(response.data)
        setTasksCollection(oldCollection => {
          const arr = JSON.parse(JSON.stringify(oldCollection))
          for(let i=0;i<arr.length;i++) {
            if(arr[i].id === currentActiveTask.id) {
              arr[i].changes = arr[i].changes + 1
              if(currentActiveTask.origin === 'portal') {
                if(arr[i].filesRespOrig === null) {
                  arr[i].filesResp = response.data
                }else {
                  let files = arr[i].filesRespOrig
                  response.data.map((item, index) => (
                    files.push(item)
                  ))
                  arr[i].filesResp = files
                }
              }else {
                if(arr[i].filesOrig === null) {
                  arr[i].files = response.data
                }else {
                  let files = arr[i].filesOrig
                  response.data.map((item, index) => (
                    files.push(item)
                  ))
                  arr[i].files = files
                }
              }
            }
          }
          return arr
        })
      })
    setIsUploadModalVisible(false)
  }

  const handleOnFile = async (path, fileName) =>{
    await ReportService.read('/transaction/portal/getFile', {alertId: alert.id, path, origin, userId: currentUser.id}, null, fileName)
  }

  const getFile = (file) => {
    let parts = file.split("/")
    let fileName = parts[parts.length-1]
    return (<a onClick = {e => handleOnFile(file, fileName)}>{fileName}</a>)
  }

  return (
    <div className={'revision-block block block-' + origin}>
      <div className="block-title">
        <Icon type="plus" />
        <h3>{ t('messages.aml.review') }</h3>
        <Switch size="small" defaultChecked={ isEnabled } onChange={ value => setIsEnabled(value) } />
      </div>
      <div className={ isEnabled ? "block-content show " : "block-content hide "}>
        <div className="block-content-inner">
        {
          alert !== null &&
            tasksCollection.map((task, index) => {
              return (
                  (origin === "aml" || (task.responsable !== null && task.responsable.id === currentUser.id && task.id === taskId)) &&
                    <div className="revision-item">
                      { (task.origin === "aml" && task.estadoResp === "TERMINADO" && task.estado !== "CERRADA" && task.overlay !== false && false) &&
                        <div className="confirm-finish">
                          <h6>{ camelizerHelper(task.responsable !== null ? task.responsable.name : task.userAsig.name).split(' ')[0] } ha finalizado la tarea y se solicita modificar el estado a cerrada.</h6>
                          <ul>
                            <li>
                              <Tooltip placement="left" title="Usted regresará a la pantalla en la cual podrá colocar sus comentarios finales o adjuntar información complementaria antes de modificar el estado Cerrada.">
                                <Button type="primary" onClick={ () => handleCloseOverlay(index) }>Cambiar a Cerrada</Button>
                              </Tooltip>
                            </li>
                            <li>
                              <Tooltip placement="right" title="Se mantiene en revisión la tarea por lo tanto se modificará el estado de la respuesta del responsable En Proceso.">
                                <Button type="primary" onClick={ () => handleRejectTask(index) }>Mantener en Revisión</Button>
                              </Tooltip>
                            </li>
                          </ul>
                        </div>
                      }
                      { ((origin === "portal" && task.estadoRespOrig !== 'TERMINADO') || (origin === "aml" && task.estado !== 'CERRADA')) && task.changes > 0 && <Button className="save-button" type="primary" icon="save" size="small" onClick={ () => handleSave(index) } style={{ right: task.origin === "portal" ? 45 : 25 }}>Guardar cambios</Button> }
                      <h4>
                        <div className="task-number">
                          <Icon type="check-square" />&nbsp;&nbsp;
                           { t('messages.aml.task') }&nbsp;&nbsp;
                           <em>#{ task.nro }</em>
                        </div>
                        <div className="task-nick">
                          <div className={ renderStatusIcon(task.estadoResp) } />{ camelizerHelper(task.tarea) }
                        </div>
                      </h4>

                      <div className={ task.origin === "aml" ? "revision-item-half editable" : "revision-item-half non-editable" }>
                        <h5><Icon type="forward" /> Solicitud</h5>

                        <div className="field">
                          <label>Usuario solicitante</label>
                          <p className="truncate">{ camelizerHelper(task.userAsig.name) }</p>
                        </div>

                        <div className="field">
                          <label>{ t('messages.aml.creationDate') }</label>
                          <p>{ moment(task.creationDate).format('DD/MM/YYYY') }</p>
                        </div>
                        <div className="field">
                          <label>Tiempo asignado</label>
                          <p>{ task.dias } días</p>
                        </div>
                        <div className="field">
                          <label>Tiempo transcurrido</label>
                          <p>{ task.diasTranscurridos } días</p>
                        </div>
                        <div className="field long comments-field" style={{ height: '200px !important' }}>
                          <label>{ t('messages.aml.comments') }</label>
                          <textarea disabled={ task.origin === "aml" && task.estado !== "CERRADA" ? false : true } onChange={ (e) => handleCommentsChange(e.target.value, index) }>{ task.comentarios }</textarea>
                        </div>
                        <div className="field">
                          <label style={{ marginBottom: 5 }}>Estado</label>
                          <div className="status-wrap">
                            <p className={'status-'+task.estado}>{ camelizerHelper(task.estado).replace('_', ' ') }</p>
                            { task.origin === "aml" && task.estado !== "CERRADA" && task.estadoResp === "TERMINADO" &&
                              <Popconfirm
                                title="Está seguro de cerrar la tarea?"
                                onConfirm={() => handleCloseTask(index)}>
                                <Button type="primary" className="close-task" size="small" icon="check">Cerrar tarea</Button>
                              </Popconfirm>
                            }
                          </div>
                        </div>
                        <div className="field">
                          <label>Archivos adjuntos</label>
                          { task.origin === "aml" && task.estado !== "CERRADA" &&
                            <Col span={9}>
                              <Button type="primary" icon="upload" size="small" style={{ width: '100%' }} onClick={ () => handleShowUploadModal(task) }>{ t('messages.aml.select') }</Button>
                            </Col>
                          }
                          { task.files != null &&
                            <Col className="files" span={task.origin === "aml" && task.estado !== "CERRADA" ? 15 : 24}>
                                { task.files.map((file, indexFile) => {
                                  return (
                                    <Col className={'file1 file-attach'}>
                                      <li>{ getFile(file) }</li>
                                    </Col>
                                  )
                                })
                                }
                            </Col>
                          }
                        </div>
                      </div>
                      <div className={ task.origin === "aml" ? "revision-item-half non-editable" : "revision-item-half editable" }>
                        <h5><Icon type="backward" /> Respuesta</h5>
                        <div className="field long">
                          <label>{ t('messages.aml.inControl') }</label>
                          <Input value={ camelizerHelper(task.responsable !== null ? task.responsable.name : task.userAsig.name) } size="small" style={{ padding: '0 5px', height: 18 }} disabled />
                        </div>
                        <div className="field">
                          <label>Fecha final para responder</label>
                          <p>{ moment(task.fecPlazo).format('DD/MM/YYYY') }</p>
                        </div>
                        <div className="field">
                          <label>Grado de avance</label>
                          <p>{ camelizerHelper(task.statusPlazo).replace('_', ' ') }</p>
                        </div>
                        <div className="field long comments-field">
                          <label>{ t('messages.aml.comments') }</label>
                          <textarea disabled={ task.origin === "aml" || task.estadoRespOrig === 'TERMINADO' } onChange={ e => handleResponsibleCommentsChange(e.target.value, index) }>{ tasksCollection[index].comentariosResp }</textarea>
                        </div>
                        <div className={'field' + (task.origin === "aml" ? ' long' : '')}>
                          <label>Estado de la Solicitud</label>
                          {
                            task.origin === "portal" ?
                              <div className="status-selector">
                                <ul>
                                  <li className={ (tasksCollection[index].estadoResp === "PENDIENTE" ? "checked" : "") + (tasksCollection[index].estadoRespOrig !== 'PENDIENTE' ? ' disabled' : '')} onClick={ () => handleSetResponseState("PENDIENTE", index) }>
                                    <div className="radio-wrap">
                                      <div className="radio">
                                        <div className="radio-inner" />
                                      </div>
                                    </div>
                                    <label>Pendiente</label>
                                  </li>
                                  <li className={ (tasksCollection[index].estadoResp === "EN_PROCESO" ? "checked" : "") + (tasksCollection[index].estadoRespOrig === 'TERMINADO' ? ' disabled' : '')} onClick={ () => handleSetResponseState("EN_PROCESO", index) }>
                                    <div className="radio-wrap">
                                      <div className="radio">
                                        <div className="radio-inner" />
                                      </div>
                                    </div>
                                    <label>En Proceso</label>
                                  </li>
                                  <li className={ tasksCollection[index].estadoResp === "TERMINADO" ? "checked" : "" } onClick={ () => handleSetResponseState("TERMINADO", index) }>
                                    <div className="radio-wrap">
                                      <div className="radio">
                                        <div className="radio-inner" />
                                      </div>
                                    </div>
                                    <label>Terminado</label>
                                  </li>
                                </ul>
                              </div>
                            :
                              <Steps current={task.estadoResp === 'PENDIENTE' ? 0 : (task.estadoResp === 'EN_PROCESO' ? 1 : 2)} size="small">
                                <Steps.Step title={ t('messages.aml.request.PENDIENTE') } />
                                <Steps.Step title={ t('messages.aml.request.EN_PROCESO') } />
                                <Steps.Step title={ t('messages.aml.request.TERMINADO') } />
                              </Steps>
                          }
                        </div>
                        <Col span={task.origin === "aml" ? 24 : (task.estadoRespOrig === 'TERMINADO' ? 12 : 6)} className="colFiles">
                          <label>Archivos adjuntos</label>
                          {task.origin === "portal" && task.estadoRespOrig !== 'TERMINADO' &&
                            <Col span={24}>
                              <Button type="primary" icon="upload" style={{ width: '100%' }} onClick={ () => handleShowUploadModal(task) }>{ t('messages.aml.select') }</Button>
                            </Col>
                          }
                        </Col>
                        { task.filesResp != null &&
                          <Col className={'files files-'+task.origin} span={task.origin === "aml" ? 24 : (task.estadoRespOrig === 'TERMINADO' ? 12 : 6)}>
                            { task.filesResp.map((file, indexFile) => {
                              return (
                                <Col className={'file1 file-attach-resp'} span={task.origin === 'portal' && task.estadoRespOrig !== 'TERMINADO' ? 24 : 11} offset={1}><li>{ getFile(file) }</li></Col>
                              )
                            })
                            }
                          </Col>
                        }
                      </div>
                    </div>
              )
            })
        }
        </div>
      </div>
      { isUploadModalVisible && currentActiveTask !== null &&
        <Modal
            title="Subir archivos"
            visible={true}
            onCancel={ closeModalFiles }
            footer={[
              <Button onClick={ closeModalFiles }>{ t('messages.aml.cancel') }</Button>,
              <Button onClick={ loadFiles }>{ t('messages.aml.load') }</Button>
            ]}
        >
          <Upload {...getUploadProps(currentActiveTask)}>
            <Button icon="upload">{t('messages.aml.file')}</Button>
          </Upload>
        </Modal>
      }
    </div>
  )
}

export default RevisionBlock
