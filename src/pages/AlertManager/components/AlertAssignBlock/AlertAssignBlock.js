import './AlertAssignBlock.scss'
import React, { useEffect, useState } from 'react'
import { Button, Col, Icon, Input, notification, Row, Select, Switch } from 'antd'
import { getUsersByClientPromise } from '../../../../promises'
import { useTranslation } from 'react-i18next'
import { alertAssignPromise } from './promises'
import moment from 'moment'
const { TextArea } = Input;


const AlertAssignBlock = ({ alert, currentUser, refreshHandler }) => {
  const [users, setUsers] = useState([])
  const [isEnabled, setIsEnabled] = useState(false)
  const [user, setUser] = useState(null)
  const [timeInDays, setTimeInDays] = useState(null)
  const [comms, setComms] = useState(null)
  const [changes, setChanges] = useState(0)

  const { t } = useTranslation()

  useEffect(() => {
      handleGetUsers()
  }, [])

  useEffect(() => {
    if (alert !== null && alert.assign !== null) {
      handleGetInitialData()
    }
  }, [alert])

  const handleGetUsers = async () => {
    const usrs = await getUsersByClientPromise()
    const filtered = []

    usrs.map(u => {
      if ((u.type === 'ADMIN' || u.type === 'SADMIN' || u.type === 'USUARIO') && u.status === 'ACTIVE' && u.modules.includes('ANCTO')) {
        filtered.push(u)
      }

      return true
    })

    setUsers(filtered)
  }

  const handleGetInitialData = () => {
    setUser(alert.assign.userId)
    setComms(alert.assign.comments)
    setTimeInDays(alert.assign.days)
  }

  const handleAddChange = () => {
    setChanges(oldChanges => {
      const newNumber = oldChanges + 1
      return newNumber
    })
  }

  const handleRenderCurrentDateTime = () => {
    let today = new Date()
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()

    return date+' '+time
  }

  const handleUserChange = async (value) => {
    await setUser(value)
    handleAddChange()
  }

  const handleTimeInDaysChange = async (value) => {
    await setTimeInDays(value)
    handleAddChange()
  }

  const handleCommentsChange = async (value) => {
    await setComms(value)
    handleAddChange()
  }

  const handleSave = () => {
    alertAssignPromise(alert.id, user, timeInDays, comms)
      .then(response => {
        notification['success']({
          "message": "Operación Exitosa",
          "description": "La asignación ha sido guardada exitosamente"
        })

        setChanges(0)
        refreshHandler()
      })
  }

  return (
    <div className="alert-assign-block block">
      <div className="block-title">
        <Icon type="forward" />
        <h3>{ t('messages.aml.alertAssign') }</h3>
        <Switch size="small" onChange={ value => setIsEnabled(value) } />
        { changes > 0 && alert!==null && alert.status !== "CLOSED" && <Button type="primary" size="small" icon="save" className="save-button" onClick={ handleSave }>Guardar cambios</Button> }
      </div>
      <div className={ isEnabled ? "block-content show " : "block-content hide "}>
        <div className="alert">
          <Row>
            <Col span={12}>
              <label>{ t('messages.aml.user') }</label>
              <Select value={ user } placeholder={ t('messages.aml.select') } disabled={alert!==null && alert.status === "CLOSED" ? true : false} style={{ width: '100%' }} size="small" onChange={ handleUserChange }>
                {
                  users.map(user => <Select.Option value={user.id}>{user.name}</Select.Option>)
                }
              </Select>
            </Col>
            <Col span={12}>
              <label>{ t('messages.aml.timeNumberOfDays') }</label>
              <Input id="global-time-in-days" size="small" onChange={ (e) => handleTimeInDaysChange(e.target.value) } value={ timeInDays } disabled={alert!==null && alert.status === "CLOSED" ? true : false} />
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ paddingBottom: '0 !important' }}>
              <TextArea placeholder={ t('messages.aml.comments') } value={comms} onChange={ (e) => handleCommentsChange(e.target.value) } disabled={alert!==null && alert.status === "CLOSED" ? true : false}>{ comms }</TextArea>
            </Col>
          </Row>
          { alert !== null && alert.assign !== null &&
          <Row>
            <Col span={24}><center>Última modificación <strong>{ moment(alert.assign.date).format('DD/MM/YYYY') }</strong></center></Col>
          </Row>
          }
        </div>
      </div>
    </div>
  )
}

export default AlertAssignBlock
