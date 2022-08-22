import './AdminAuthIps.scss'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Form, Icon, Input, notification, Select, Spin } from 'antd'
import { UsersService } from '../../services'
import { getUserIpPromise, saveParamsPromise } from './promises'
import { getParamsPromise } from '../AdminParams/promises'

const AdminAuthIps = (props) => {
  const { t } = useTranslation()
  const { Option } = Select
  const { currentUser, form } = props
  const { getFieldDecorator } = form

  const [usersList, setUsersList] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [ipsList, setIpsList] = useState([])
  const [userIpIsLoading, setUserIpIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    handleDefaultUser()
    handleGetUsersList()
    handleGetIpsList()
  }, [])

  const handleGetUsersList = async () => {
    const u = await UsersService.read()

    setUsersList(u.data.records)
  }

  const handleGetIpsList = async () => {
    const ips = await getParamsPromise()

    await setIpsList(ips.ips)

    setIsLoading(false)
  }

  const handleDefaultUser = async () => {
    if (currentUser.cliente.oficialCto !== null) {
      setSelectedUserId(currentUser.cliente.oficialCto.id)
    }
  }

  const handleUserChange = async (id) => {
    setSelectedUserId(id)
  }

  const handleAddIp = async (e) => {
    let ip = document.getElementsByClassName('user-ip')[0].value

    if (ip !== '') {
      await setIpsList(oldIpsList => [...oldIpsList, ip])
      form.setFieldsValue({ userIp: '' })
    }
  }

  const handleRemoveIp = async (index) => {
    const newIpsList = ipsList.slice()

    newIpsList.splice(index, 1)

    setIpsList(newIpsList)
  }

  const handleGetUserIp = async () => {
    setUserIpIsLoading(true)

    const userIp = await getUserIpPromise()

    await form.setFieldsValue({ userIp })

    setUserIpIsLoading(false)
  }

  const handleSave = async () => {
    await setIsSaving(true)

    await saveParamsPromise(selectedUserId, ipsList)
      .then(response => notification.success({
        message: 'Operación exitosa',
        description: 'Lista de IPs guardada exitosamente.'
      })
    )

    await setIsSaving(false)
  }

  return (
    <div className="admin-auth-ips block">
      {
        !isLoading ?
          <Form>
            { currentUser.cliente.modules.includes('OFCTO') &&
              <div className="users block">
                <label>{ t('messages.aml.modulesNames.complianceOfficer') } : </label>
                <Select value={ selectedUserId } style={{ width: '400px' }} placeholder={ t('messages.aml.select') } onChange={ handleUserChange }>
                  { usersList.map(user => (user.type === 'SADMIN' || user.type === 'ADMIN' || user.type === 'USUARIO') && <Option value={ user.id }>{ user.name }</Option>) }
                </Select>
              </div>
            }
            <label>{ t('messages.aml.authorizedIps') } : </label>
            <div className="authorized-ips block">
              <div className="authorized-ips-inner">
                <div className="authorized-ips-header">
                  {
                    getFieldDecorator('userIp')(
                      <Input className="user-ip" placeholder={ t('messages.aml.enterIpAddress') } />
                    )
                  }
                  <div className="add-button" onClick={ handleAddIp }><Icon type="plus" /></div>
                  <div className="get-ip-button" onClick={ handleGetUserIp }><Icon type={ userIpIsLoading ? 'loading' : 'environment' } /></div>
                </div>
                <ul>
                  {
                    ipsList.map((ip, index) => <li><span className="ip-address">{ ip }</span> <span className="remove" onClick={ () => handleRemoveIp(index) }><Icon type="close" /></span></li> )
                  }
                </ul>
              </div>
            </div>

            <Button className="send-button" icon={ isSaving ? 'loading' : 'check' } type="primary" onClick={ handleSave }>Guardar</Button>
          </Form>
        :
          <Spin spinning={ true } size="large" />
      }
    </div>
  )
}

export default Form.create()(AdminAuthIps)
