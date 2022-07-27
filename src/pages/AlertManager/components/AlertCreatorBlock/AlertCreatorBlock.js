import './AlertCreatorBlock.scss'
import React, { useEffect, useState } from 'react'
import { AutoComplete, Button, Col, Icon, Input, notification, Row, Select, Switch, Modal, Checkbox } from 'antd'
import { getClientsMinPromise } from './promises'
import { getCategoriesPromise } from '../../../Register/promises'
import { createTasksPromise } from '../../promises'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

const AlertCreatorBlock = ({ alert, refreshHandler }) => {
  const NEW_ITEM = "+ Nueva Tarea"
  const [isEnabled, setIsEnabled] = useState(false)
  const [alerts, setAlerts] = useState([])
  const tasks = ['Solicitamos el Origen de Fondos', 'Solicitamos mayor información de la persona', 'Solicitamos una explicación de la transacción realizada', NEW_ITEM]
  const [ destinatario, setDestinatario] = useState(null)
  const [ cc, setCc] = useState(null)
  const [ cc2, setCc2] = useState(null)
  const { t } = useTranslation()
  const { Option } = AutoComplete
  const [changes, setChanges] = useState(0)
  const [showNewTask, setShowNewTask] = useState(false)
  const [indexTask, setIndexTask] = useState(-1)
  const [newTask, setNewTask] = useState(null)
  const [asignedToMe, setAsignedToMe] = useState(false)
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState(null)

  useEffect(() => {
    handleAddAlert()
    getCategoriesPromise().then((response) => {
      setCategories(response)
    })
  }, [])

  const handleAddAlert = () => {
    const newAlert = {}

    setAlerts(currentAlerts => [...currentAlerts, newAlert])
  }

  const handleRenderCurrentDateTime = () => {
    let today = new Date()
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()

    return date+' '+time
  }

  const handleRemoveAlert = (index) => {
    if (index > 0) {
      const list = JSON.parse(JSON.stringify(alerts))

      list.splice(index, 1)

      setAlerts(list)
    }
  }

  const onSelectDest = async (data) => {
    await setDestinatario(data)
    handleAddChange()
  };

  const onSelectCc = async (data) => {
    await setCc(data)
    handleAddChange()
  };

  const onSelectCc2 = async (data) => {
    await setCc2(data)
    handleAddChange()
  };

  const handleSave = async () => {
    let errors = 0
    let timeInDays = null
    let days = document.getElementById('global-time-in-days')
    if(days != null && days.value !== '') {
      timeInDays = parseInt(days.value)
    }else if(alert.assign !== null && alert.assign.days !== null) {
      timeInDays = alert.assign.days
    }

    if (timeInDays !== null) {
      for (let i = 0; i < alerts.length; i++) {
        const days = parseInt(alerts[i].dias)

        if (days > timeInDays) {
          errors++

          notification['error']({
            message: "Error en número de días",
            description: "El número de días no debe exceder a " + timeInDays
          })
        }
      }
    }

    for (let i = 0; i < alerts.length; i++) {
      if (!("tarea" in alerts[i])) {
        errors++

        notification['error']({
          message: "Campo Requerido",
          description: "El campo 'Tarea' es obligatorio"
        })

        break
      }
    }

    if(!asignedToMe) {
      for (let i = 0; i < alerts.length; i++) {
        if (destinatario === null) {
          errors++

          notification['error']({
            message: "Campo Requerido",
            description: "El campo 'Responsable' es obligatorio"
          })

          break
        }
      }
    }

    if (errors === 0) {
      const tasksCollection = JSON.parse(JSON.stringify(alerts))

      tasksCollection.map((task, index) => {
        tasksCollection[index].responsable = { id: (asignedToMe ? null : destinatario) }
        tasksCollection[index].informe1 = { id: (asignedToMe ? null : cc) }
        tasksCollection[index].informe2 = { id: (asignedToMe ? null : cc2) }
      })

      const res = await createTasksPromise(alert.id, tasksCollection)

      setAlerts([])
      handleAddAlert()
      setChanges(0)
      setAsignedToMe(false)
      setCategory(null)

      notification['success']({
        message: "Operación exitosa",
        description: "Las tareas han sido guardadas exitosamente"
      })

      refreshHandler()
    }
  }

  const DestinationComplete = (placeholder, onSelectCallback) => {
    const [result, setResult] = useState([]);
    //const [text, setText] = useState(null)

    const handleSearch = async(value) => {
      let res = [];

      if(value !== null && value !== '') {
        const records = await getClientsMinPromise(0, 10, [category], value, null, null)
        res = records.data.records
      }
      setResult(res);
      //setText(value)
    }

    const onSelect = (data, obj) => {
      onSelectCallback(data)
      //setText(obj.props.children)
    };

    return (
      asignedToMe ?
      <Input disabled={true} size="small" placeholder={placeholder} style={{ width: '100%', paddingLeft: '11px', paddingTop: '5px', marginTop: '1px' }}/>
      :
      <AutoComplete
        style={{
          width: '100%'
        }}
        onSearch={handleSearch}
        placeholder={placeholder}
        onSelect={onSelect}
        size="small"
        disabled={category===null}
      >
        {result.map(record => (
          <Option value={record.id}>
            {record.nombre}
          </Option>
        ))}
      </AutoComplete>
    );
  };

  const handleAddChange = () => {
    setChanges(oldChanges => {
      let number = oldChanges + 1
      return number
    })
  }

  const handleTaskSelect = async (task, index) => {
    if (task !== NEW_ITEM) {
      await setAlerts(oldAlerts => {
        const obj = JSON.parse(JSON.stringify(oldAlerts))
        obj[index].tarea = task
        return obj
      })
    }else {
      setIndexTask(index)
      setShowNewTask(true)
    }
    handleAddChange()
  }

  const handleTimeInDaysSelect = async (days, index) => {
    await setAlerts(oldAlerts => {
      const obj = JSON.parse(JSON.stringify(oldAlerts))
      obj[index].dias = days
      return obj
    })

    handleAddChange()
  }

  const handleCommentsChange = async (comments, index) => {
    await setAlerts(oldAlerts => {
      const obj = JSON.parse(JSON.stringify(oldAlerts))
      obj[index].comentarios = comments
      return obj
    })

    handleAddChange()
  }

  const changeCategoryHandler = (value) => {
    setCategory(value)
  }

  const changeAsignedToMeHandler = (e) => {
    setAsignedToMe(e.target.checked)
  }


  return (
    <div className="alert-creator-block block">
      <div className="block-title">
        <Icon type="plus" />
        <h3>{ t('messages.aml.tasksRequest')}</h3>
        <Switch size="small" onChange={ value => setIsEnabled(value) } />
        { changes > 0 && <Button className="save-button" icon="save" type="primary" onClick={ handleSave } size="small">Guardar cambios</Button> }
      </div>
      <div className={ isEnabled ? "block-content show " : "block-content hide "}>
        {
          alerts.map((alert, index) =>
            <div className="alert">
              <Row>
                <Col span={24} style={{ padding: '  0 5px'}}>
                  <div className="alert-header">
                    { t('messages.aml.task') } #{ index + 1 }
                    { index > 0 && <Button icon="delete" size="small" onClick={ () => handleRemoveAlert(index) }></Button> }
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <label>{ t('messages.aml.task') }</label>
                  <Select style={{ width: '100%' }} size="small" value={alert.tarea} onChange={ (value) => handleTaskSelect(value, index) }>
                    {
                      tasks.map((task, index) => <Select.Option value={task}>{task}</Select.Option>)
                    }
                  </Select>
                </Col>
                <Col span={12}>
                  <label>{ t('messages.aml.timeNumberOfDays') }</label>
                  <Input size="small" onChange={ e => handleTimeInDaysSelect(e.target.value, index) }/>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ paddingBottom: 5 }}>
                  <textarea placeholder={ t('messages.aml.comments') } onChange={ e => handleCommentsChange(e.target.value, index) }></textarea>
                </Col>
              </Row>
              <Row>
                <center>Fecha de creación : <strong>{ moment(handleRenderCurrentDateTime()).format('DD/MM/YYYY') }</strong></center>
              </Row>
            </div>
          )
        }
        { showNewTask &&
          <Modal
            title="Tarea"
            className="modal-new-tarea"
            visible={ true }
            width={ 600 }
            onOk={() => {
              let inputValue = newTask.trim()

              setAlerts(oldCollection => {
                const arr = JSON.parse(JSON.stringify(oldCollection))
                arr[indexTask].tarea = inputValue
                return arr
              })
              setIndexTask(-1)
              setShowNewTask(false)
            }}
            onCancel={() => {
              setIndexTask(-1)
              setShowNewTask(false)
              setAlerts(oldCollection => {
                const arr = JSON.parse(JSON.stringify(oldCollection))
                delete arr[indexTask].tarea
                return arr
              })
            }}
          >
            <Input onChange={(e) => setNewTask(e.target.value) }/>
          </Modal>
        }
        <div className="block-footer">
          <Row>
            <Col span={3}>
              Yo resolveré:
            </Col>
            <Col span={5}>
              <Checkbox checked={asignedToMe} style={{display: 'initial'}} onChange={changeAsignedToMeHandler} />
            </Col>
            <Col span={6} offset={2}>
              <Button icon="plus" type="primary" onClick={handleAddAlert} size="small" style={{width:'100%'}}>
                { t('messages.aml.newTask') }
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={3}>
              { t('messages.aml.category') }:
            </Col>
            <Col span={5}>
              <Select style={{ width: '100%' }} size="small" value={asignedToMe ? null : category} onChange={changeCategoryHandler} disabled={asignedToMe}>
                { categories.map((item, index) =>
                  <Select.Option value={item}>
                    { t('messages.aml.category.' + item)}
                  </Select.Option>
                )}
              </Select>
            </Col>
            <Col span={2}>
              { t('messages.aml.inControl') }:
            </Col>
            <Col span={6}>
              { DestinationComplete(t('messages.aml.inControl'), onSelectDest) }
            </Col>
            <Col span={2}>
              { t('messages.aml.informTo') }:
            </Col>
            <Col span={6}>
              { DestinationComplete(t('messages.aml.informTo'), onSelectCc) }
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}

export default AlertCreatorBlock
