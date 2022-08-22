import './AdminUsers.scss'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { UsersService } from '../../services'
import { getUsersByClientPromise } from '../../promises'
import { Button, Icon, Modal, notification, Popconfirm, Table, Tooltip, Spin } from 'antd'
import ModalCreateContent from './ModalContentCreate'
import { generatePasswordHelper } from '../../helpers'
import { ReportService } from '../../services'

class AdminUsers extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: {},
      isLoading: true,
      isLoadingReport: false,
      isModalVisible: false,
      modal: ''
    }
  }

  async componentDidMount() {
    const data = await getUsersByClientPromise()

    await this.setState({
      data,
      isLoading: false
    })
  }

  async handleUserDelete(userId) {
    const { t } = this.props
    await UsersService.delete(userId)
      .then(async response => {
        if (response.data.status === "OK") {
          const data = await getUsersByClientPromise()
          this.setState({ data })

          notification.success({
            message: t('messages.aml.notifications.succesfulOperation'),
            description: 'La cuenta de usuario ha sido correctamente eliminada.'
          })
        }else {
          notification.error({
            message: t('messages.aml.notifications.anErrorOcurred'),
            description: response.data.message
          })
        }
      })
      .catch(err => console.log(err))
  }

  handleModalCancel = () => {
    this.setState({ isModalVisible: false })
  }

  async exportHandler() {
    await this.setState({ isLoadingReport: true })
    await ReportService.read('/excelUsuarios', null, null, 'usuarios.xlsx')
    await this.setState({ isLoadingReport: false })
  }

  async handleModalOk(modalType, user) {
    const { t } = this.props
    if (modalType === 'view') {
      this.setState({ isModalVisible: false })
    }

    if (modalType === 'create') {
      await UsersService.create(user)
        .then(async response => {
          if(response.data.status === 'OK') {
            const data = await getUsersByClientPromise()
            this.setState({ data, isModalVisible: false })

            notification['success']({
              message: t('messages.aml.notifications.succesfulOperation'),
              description: 'Usuario creado exitosamente'
            })
          }else {
            notification.error({
              message: t('messages.aml.notifications.anErrorOcurred'),
              description: response.data.message
            })
          }
        })
        .catch(err => console.log(err))
    }

    if (modalType === 'edit') {
      await UsersService.update(user)
        .then(async response => {
          const data = await getUsersByClientPromise()
          this.setState({ data, isModalVisible: false })

          notification['success']({
            message: t('messages.aml.notifications.succesfulOperation'),
            description: 'Usuario guardado'
          })
        })
        .catch(err => console.log(err))
    }
  }

  renderModal(type, user) {
    const { currentUser, t } = this.props

    let content = {}

    if (type === 'create') {
      content = {
        title: [ <Icon type="user-add" />, ' ', t('messages.aml.createNewUser') ],
        className: 'modal-user-create',
        content: <ModalCreateContent
            key={ Math.floor((Math.random() * 100) + 1) }
            currentUser={ user }
            password={ generatePasswordHelper() }
            onOk={ this.handleModalOk.bind(this) }
            onCancel={ this.handleModalCancel.bind(this) }
            modalType="create" />
      }
    }

    if (type === 'view') {
      content = {
        title: [ <Icon type="eye" />, ' ', t('messages.aml.viewUserInfo') ],
        className: 'modal-user-create',
        content: <ModalCreateContent key={ Math.floor((Math.random() * 100) + 1) } currentUser={ currentUser } user={ user } onOk={ this.handleModalOk.bind(this) } onCancel={ this.handleModalCancel.bind(this) } modalType="view" />
      }
    }

    if (type === 'edit') {
      content = {
        title: [ <Icon type="edit" />, ' ', t('messages.aml.editUserInfo') ],
        className: 'modal-user-create',
        content: <ModalCreateContent key={ Math.floor((Math.random() * 100) + 1) } user={ user }  password={ generatePasswordHelper() } currentUser={ currentUser } onOk={ this.handleModalOk.bind(this) } onCancel={ this.handleModalCancel.bind(this) } modalType="edit" />
      }
    }

    this.setState({
      isModalVisible: true,
      modal: content
    })
  }

  render() {
    const { currentUser, t } = this.props

    const tableColumns = [
      { title: t('messages.aml.type'), dataIndex: 'type', render: (text => {
        switch(text) {
          case 'SADMIN':
            return t('messages.aml.sadmin')
          case 'ADMIN':
            return t('messages.aml.admin')
          case 'SERVICIO':
            return t('messages.aml.service')
          case 'USUARIO':
            return t('messages.aml.user')
          case 'AUDIT':
            return t('messages.aml.audit')
          default:
            return text
        }
      })
      },
      { title: t('messages.aml.name'), dataIndex: 'name' },
      { title: t('messages.aml.username'), dataIndex: 'login' },
      { title: t('messages.aml.email'), dataIndex: 'email' },
      { title: t('messages.aml.creationDate'), dataIndex: 'dateShortAsString' },
      { title: t('messages.aml.status'), dataIndex: 'status', render: (text => {
        switch(text) {
          case 'ACTIVE':
            return t('messages.aml.active')
          default:
            return t('messages.aml.inactive')
        }
      }) },
      { title: '', dataIndex: 'id', render: (id, user) => (
        <div className="actions">
          <Icon type="eye" theme="filled" onClick={ this.renderModal.bind(this, 'view', user) } /> &nbsp;&nbsp;
          { !(currentUser.type === 'SADMIN' || (currentUser.type === 'ADMIN' && ( user.type === 'AUDIT' || user.type === 'USUARIO' || user.type === 'SERVICIO' || currentUser.id === id ))) ?
            <Icon className="disabled" type="edit" theme="filled" />
            :
            <Icon type="edit" theme="filled" onClick={ this.renderModal.bind(this, 'edit', user) } />
          }&nbsp;&nbsp;
          {
            currentUser.type === 'AUDIT' || currentUser.id === id || user.type === 'SADMIN' ?
              <Tooltip title="No tiene permisos eliminar este usuario." placement="left" trigger="click">
                <Icon className="disabled" type="delete" theme="filled" />
              </Tooltip>
            :
              <Popconfirm
                  title={ [ 'Realmente desea eliminar ', <strong>{ user.name }</strong>, ' ?' ] }
                  placement="left"
                  onConfirm={ () => this.handleUserDelete(id) }
                  okText="Sí"
                  cancelText="No"
                >
                <Icon type="delete" theme="filled" />
              </Popconfirm>
          }
        </div>
      )}
    ]

    return (
      <div className="admin-users">
          <div className="tools-area">
          { currentUser.type !== 'AUDIT' &&
            <Button id="create-user" type="primary" icon="plus" onClick={ this.renderModal.bind(this, 'create', currentUser) }>{ t('messages.aml.createNewUser') }</Button>
          }
          &nbsp;
          <Button type="primary" icon="file-excel" onClick={ this.exportHandler.bind(this) }>Exportar</Button>
          </div>
          <div className="table-wrapper">
            {
              this.state.isLoading ?
                <Spin spinning={ true } size="large" />
              :
                <Table columns={ tableColumns } dataSource={ this.state.data } size="small" loading={ this.state.isLoadingReport } />
            }
          </div>
          <div id="modal-user">
            <Modal
              title={ this.state.modal.title }
              className={ this.state.modal.className }
              visible={ this.state.isModalVisible }
              style={{ top: 30 }}
              footer={ null }
              onCancel={ this.handleModalCancel }
              >
              { this.state.modal.content }
          </Modal>
          </div>
        </div>
    )
  }
}

export default withTranslation()(AdminUsers)
