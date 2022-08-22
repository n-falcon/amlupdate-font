import React from 'react'
import { withTranslation } from 'react-i18next'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Button, Col, Divider, Form, Icon, Input, notification, Row, Select, Switch, Tabs, Tooltip } from 'antd'
import { InfoIcon } from '../../../layouts/Private/components'

class ModalContentCreate extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      id: '',
      name: '',
      email: '',
      type: '',
      login: '',
      password: null,
      token: null,
      status: 'ACTIVE',
      modules: [],
      empresas: null,
      isPasswordReset: false
    }
  }

  async componentDidMount() {
    if (this.props.modalType === 'edit' || this.props.modalType === 'view') {
      const { form } = this.props
      this.setState({
        id: this.props.user.id,
        name: this.props.user.name,
        email: this.props.user.email,
        type: this.props.user.type,
        login: this.props.user.login,
        status: this.props.user.status,
        token: this.props.user.ticket,
        modules: this.props.user.modules !== null ? this.props.user.modules : [],
        empresas: this.props.user.empresas !== null ? this.props.user.empresas : []
      })

      form.setFieldsValue({
        name: this.props.user.name,
        email: this.props.user.email,
        type: this.props.user.type,
        status: this.props.user.status,
        login: this.props.user.login,
        token: this.props.user.ticket,
        empresas: this.props.user.empresas !== null ? this.props.user.empresas : []
      })
    }
  }

  handleOnChange = async (key, value) => {
    await this.setState({ [key]: value })
  }

  handleOnChangeType = (value) => {
    this.setState({ type: value })
  }

  handleOnChangeStatus = (value) => {
    this.setState({ status: value })
  }

  handleOnChangeModule = (key, checked) => {
    const modules = this.state.modules

    if (checked && !modules.includes(key)) {
      modules.push(key)
      if (key === 'CDI-FORM') {
        if (!modules.includes('CDI-FORM-PC')) {
          modules.push('CDI-FORM-PC')
        }
        if (!modules.includes('CDI-FORM-PC-CO')) {
          modules.push('CDI-FORM-PC-CO')
        }
        if (!modules.includes('CDI-FORM-PC-PR')) {
          modules.push('CDI-FORM-PC-PR')
        }
        if (!modules.includes('CDI-FORM-PC-CL')) {
          modules.push('CDI-FORM-PC-CL')
        }
        if (!modules.includes('CDI-FORM-PC-DI')) {
          modules.push('CDI-FORM-PC-DI')
        }

        if (!modules.includes('CDI-FORM-GC')) {
          modules.push('CDI-FORM-GC')
        }
        if (!modules.includes('CDI-FORM-GC-I')) {
          modules.push('CDI-FORM-GC-I')
        }
        if (!modules.includes('CDI-FORM-GC-D')) {
          modules.push('CDI-FORM-GC-D')
        }

        if (!modules.includes('CDI-FORM-GD')) {
          modules.push('CDI-FORM-GD')
        }
        if (!modules.includes('CDI-FORM-GD-T')) {
          modules.push('CDI-FORM-GD-T')
        }
        if (!modules.includes('CDI-FORM-GD-P')) {
          modules.push('CDI-FORM-GD-P')
        }
        if (!modules.includes('CDI-FORM-GDIR')) {
          modules.push('CDI-FORM-GDIR')
        }
        if (!modules.includes('CDI-FORM-GPATR')) {
          modules.push('CDI-FORM-GPATR')
        }
        if (!modules.includes('CDI-FORM-GREL')) {
          modules.push('CDI-FORM-GREL')
        }

        if (!modules.includes('CDI-FORM-GF')) {
          modules.push('CDI-FORM-GF')
        }
        if (!modules.includes('CDI-FORM-GF-T')) {
          modules.push('CDI-FORM-GF-T')
        }
        if (!modules.includes('CDI-FORM-GF-G')) {
          modules.push('CDI-FORM-GF-G')
        }
        if (!modules.includes('CDI-FORM-GF-F')) {
          modules.push('CDI-FORM-GF-F')
        }
        if (!modules.includes('CDI-FORM-GF-S')) {
          modules.push('CDI-FORM-GF-S')
        }
        if (!modules.includes('CDI-FORM-GF-V')) {
          modules.push('CDI-FORM-GF-V')
        }
      } else if (key === 'CDI-FORM-PC') {
        if (!modules.includes('CDI-FORM-PC-CO')) {
          modules.push('CDI-FORM-PC-CO')
        }
        if (!modules.includes('CDI-FORM-PC-PR')) {
          modules.push('CDI-FORM-PC-PR')
        }
        if (!modules.includes('CDI-FORM-PC-CL')) {
          modules.push('CDI-FORM-PC-CL')
        }
        if (!modules.includes('CDI-FORM-PC-DI')) {
          modules.push('CDI-FORM-PC-DI')
        }
      } else if (key === 'CDI-FORM-GC') {
        if (!modules.includes('CDI-FORM-GC-I')) {
          modules.push('CDI-FORM-GC-I')
        }
        if (!modules.includes('CDI-FORM-GC-D')) {
          modules.push('CDI-FORM-GC-D')
        }
      } else if (key === 'CDI-FORM-GD') {
        if (!modules.includes('CDI-FORM-GD-T')) {
          modules.push('CDI-FORM-GD-T')
        }
        if (!modules.includes('CDI-FORM-GD-P')) {
          modules.push('CDI-FORM-GD-P')
        }
        if (!modules.includes('CDI-FORM-GDIR')) {
          modules.push('CDI-FORM-GDIR')
        }
        if (!modules.includes('CDI-FORM-GPATR')) {
          modules.push('CDI-FORM-GPATR')
        }
        if (!modules.includes('CDI-FORM-GREL')) {
          modules.push('CDI-FORM-GREL')
        }
      } else if (key === 'CDI-FORM-GF') {
        if (!modules.includes('CDI-FORM-GF-T')) {
          modules.push('CDI-FORM-GF-T')
        }
        if (!modules.includes('CDI-FORM-GF-G')) {
          modules.push('CDI-FORM-GF-G')
        }
        if (!modules.includes('CDI-FORM-GF-F')) {
          modules.push('CDI-FORM-GF-F')
        }
        if (!modules.includes('CDI-FORM-GF-S')) {
          modules.push('CDI-FORM-GF-S')
        }
        if (!modules.includes('CDI-FORM-GF-V')) {
          modules.push('CDI-FORM-GF-V')
        }
      }
    }

    if (!checked && modules.includes(key)) {
      let index = modules.indexOf(key)
      modules.splice(index, 1)
      if (key === 'CDI-FORM') {
        if (modules.includes('CDI-FORM-PC')) {
          modules.splice(modules.indexOf('CDI-FORM-PC'), 1)
        }
        if (modules.includes('CDI-FORM-PC-CO')) {
          modules.splice(modules.indexOf('CDI-FORM-PC-CO'), 1)
        }
        if (modules.includes('CDI-FORM-PC-PR')) {
          modules.splice(modules.indexOf('CDI-FORM-PC-PR'), 1)
        }
        if (modules.includes('CDI-FORM-PC-CL')) {
          modules.splice(modules.indexOf('CDI-FORM-PC-CL'), 1)
        }
        if (modules.includes('CDI-FORM-PC-DI')) {
          modules.splice(modules.indexOf('CDI-FORM-PC-DI'), 1)
        }

        if (modules.includes('CDI-FORM-GC')) {
          modules.splice(modules.indexOf('CDI-FORM-GC'), 1)
        }
        if (modules.includes('CDI-FORM-GC-I')) {
          modules.splice(modules.indexOf('CDI-FORM-GC-I'), 1)
        }
        if (modules.includes('CDI-FORM-GC-D')) {
          modules.splice(modules.indexOf('CDI-FORM-GC-D'), 1)
        }

        if (modules.includes('CDI-FORM-GD')) {
          modules.splice(modules.indexOf('CDI-FORM-GD'), 1)
        }
        if (modules.includes('CDI-FORM-GD-T')) {
          modules.splice(modules.indexOf('CDI-FORM-GD-T'), 1)
        }
        if (modules.includes('CDI-FORM-GD-P')) {
          modules.splice(modules.indexOf('CDI-FORM-GD-P'), 1)
        }
        if (modules.includes('CDI-FORM-GDIR')) {
          modules.splice(modules.indexOf('CDI-FORM-GDIR'), 1)
        }
        if (modules.includes('CDI-FORM-GPATR')) {
          modules.splice(modules.indexOf('CDI-FORM-GPATR'), 1)
        }
        if (modules.includes('CDI-FORM-GREL')) {
          modules.splice(modules.indexOf('CDI-FORM-GREL'), 1)
        }

        if (modules.includes('CDI-FORM-GF')) {
          modules.splice(modules.indexOf('CDI-FORM-GF'), 1)
        }
        if (modules.includes('CDI-FORM-GF-F')) {
          modules.splice(modules.indexOf('CDI-FORM-GF-F'), 1)
        }
        if (modules.includes('CDI-FORM-GF-G')) {
          modules.splice(modules.indexOf('CDI-FORM-GF-G'), 1)
        }
        if (modules.includes('CDI-FORM-GF-T')) {
          modules.splice(modules.indexOf('CDI-FORM-GF-T'), 1)
        }
        if (modules.includes('CDI-FORM-GF-S')) {
          modules.splice(modules.indexOf('CDI-FORM-GF-S'), 1)
        }
        if (modules.includes('CDI-FORM-GF-V')) {
          modules.splice(modules.indexOf('CDI-FORM-GF-V'), 1)
        }
      } else if (key === 'CDI-FORM-PC') {
        if (modules.includes('CDI-FORM-PC-CO')) {
          modules.splice(modules.indexOf('CDI-FORM-PC-CO'), 1)
        }
        if (modules.includes('CDI-FORM-PC-PR')) {
          modules.splice(modules.indexOf('CDI-FORM-PC-PR'), 1)
        }
        if (modules.includes('CDI-FORM-PC-CL')) {
          modules.splice(modules.indexOf('CDI-FORM-PC-CL'), 1)
        }
        if (modules.includes('CDI-FORM-PC-DI')) {
          modules.splice(modules.indexOf('CDI-FORM-PC-DI'), 1)
        }
      } else if (key === 'CDI-FORM-GC') {
        if (modules.includes('CDI-FORM-GC-I')) {
          modules.splice(modules.indexOf('CDI-FORM-GC-I'), 1)
        }
        if (modules.includes('CDI-FORM-GC-D')) {
          modules.splice(modules.indexOf('CDI-FORM-GC-D'), 1)
        }
      } else if (key === 'CDI-FORM-GD') {
        if (modules.includes('CDI-FORM-GD-T')) {
          modules.splice(modules.indexOf('CDI-FORM-GD-T'), 1)
        }
        if (modules.includes('CDI-FORM-GD-P')) {
          modules.splice(modules.indexOf('CDI-FORM-GD-P'), 1)
        }
        if (modules.includes('CDI-FORM-GDIR')) {
          modules.splice(modules.indexOf('CDI-FORM-GDIR'), 1)
        }
        if (modules.includes('CDI-FORM-GPATR')) {
          modules.splice(modules.indexOf('CDI-FORM-GPATR'), 1)
        }
        if (modules.includes('CDI-FORM-GREL')) {
          modules.splice(modules.indexOf('CDI-FORM-GREL'), 1)
        }
      } else if (key === 'CDI-FORM-GF') {
        if (modules.includes('CDI-FORM-GF-F')) {
          modules.splice(modules.indexOf('CDI-FORM-GF-F'), 1)
        }
        if (modules.includes('CDI-FORM-GF-G')) {
          modules.splice(modules.indexOf('CDI-FORM-GF-G'), 1)
        }
        if (modules.includes('CDI-FORM-GF-T')) {
          modules.splice(modules.indexOf('CDI-FORM-GF-T'), 1)
        }
        if (modules.includes('CDI-FORM-GF-S')) {
          modules.splice(modules.indexOf('CDI-FORM-GF-S'), 1)
        }
        if (modules.includes('CDI-FORM-GF-V')) {
          modules.splice(modules.indexOf('CDI-FORM-GF-V'), 1)
        }
      }
    }

    this.setState({ modules })
  }

  handleOnChangeEmpresas = (empresas) => {
    let _emp = []
    if (empresas !== null) {
      for (let i = 0; i < empresas.length; i++) {
        _emp.push({ id: empresas[i] })
      }
    }
    this.setState({ empresas: _emp })
  }

  handleUsernameOnKeyDown = (e) => {
    const char = String.fromCharCode(e.which)

    if (e.which === 16) {
      e.preventDefault()
    } else {
      if (e.which !== 190 && e.which !== 8 && e.which !== 189) {
        if (!(/^[A-Za-z0-9_.]+$/.test(char))) {
          e.preventDefault()
        }
      }
    }
  }

  handleCopyToClipboard = (id) => {
    const { t } = this.props

    let description = 'Copiado'

    if (id === 'username') {
      description = t('messages.aml.usernameCopiedToClipboard')
    }

    if (id === 'password') {
      description = t('messages.aml.passwordCopiedToClipboard')
    }

    notification['success']({
      message: t('messages.aml.notifications.succesfulOperation'),
      description
    })
  }

  handlePasswordReset = async () => {
    this.setState({
      isPasswordReset: true,
      password: this.props.password
    })
  }

  getEmpresas = (empresas) => {
    let _emp = []
    if (empresas != null) {
      for (let i = 0; i < empresas.length; i++) {
        if (empresas[i] !== null && empresas[i].id !== null && empresas[i].id !== undefined) {
          _emp.push(empresas[i].id)
        }
      }
    }
    return _emp
  }

  async handleSubmit(e) {
    e.preventDefault()

    const { form } = this.props

    form.validateFields(['name', 'email', 'type', 'login'], { force: true });

    if (!this.state.name.length || !this.state.email.length || !this.state.type.length || !this.state.login.length) {
      notification['error']({
        message: 'Ha ocurrido un error',
        description: 'Uno o mas campos requeridos no han sido completados.'
      })
    } else {
      if (this.state.isPasswordReset || this.props.modalType === 'create') {
        await this.setState({
          password: this.props.password
        })
      }

      this.props.onOk(this.props.modalType, this.state)
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { modalType } = this.props
    const { t } = this.props

    const tooltipTextType = (
      <div className="tooltip">
        <strong className="tooltip-title">{t('messages.aml.userTypes')}</strong>
        <dl>
          <dt>&bull;&nbsp; {t('messages.aml.service')} :</dt>
          <dd>{t('messages.aml.serviceTypeDescription')}.</dd>
          <dt>&bull;&nbsp; {t('messages.aml.audit')} :</dt>
          <dd>{t('messages.aml.auditTypeDescription')}.</dd>
          <dt>&bull;&nbsp; {t('messages.aml.user')} :</dt>
          <dd>{t('messages.aml.userTypeDescription')}.</dd>
          <dt>&bull;&nbsp; {t('messages.aml.administrator')} :</dt>
          <dd>{t('messages.aml.administratorTypeDescription')}.</dd>
        </dl>
      </div>
    )

    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
          <Tabs type="card">
            <Tabs.TabPane tab={[<Icon type="info-circle" />, t('messages.aml.information')]} key="1">
              <Form className="modal-content-create" onSubmit={this.handleSubmit.bind(this)}>
                <Row gutter={[8]}>
                  <Col span={12}>
                    <Form.Item label={t('messages.aml.name')}>
                      {getFieldDecorator('name', {
                        rules: [
                          {
                            required: true,
                            message: t('messages.aml.nameMandatory'),
                          },
                        ],
                      })(<Input value={this.state.name} onChange={(e) => this.handleOnChange('name', e.target.value)} disabled={this.props.modalType === 'view'} />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="E-mail">
                      {getFieldDecorator('email', {
                        rules: [
                          {
                            type: 'email',
                            message: t('messages.aml.emailNotValid'),
                          },
                          {
                            required: true,
                            message: t('messages.aml.emailMandatory'),
                          },
                        ],
                      })(
                        <Input
                          onChange={(e) => this.handleOnChange('email', e.target.value)}
                          value={this.state.email}
                          disabled={this.props.modalType === 'view'}
                        />
                      )
                      }
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[8]}>
                  <Col span={12}>
                    <Form.Item label={[<><InfoIcon placement="left" text={tooltipTextType} />&nbsp;</>, t('messages.aml.userType')]}>
                      {getFieldDecorator('type', {
                        rules: [
                          {
                            required: true,
                            message: t('messages.aml.typeMandatory'),
                          },
                        ],
                      })(
                        <Select
                          className="type"
                          showSearch
                          placeholder={t('messages.aml.typePlaceholder')}
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={(value) => this.handleOnChangeType(value)}
                          value={this.state.type}
                          disabled={this.props.modalType === 'view' || this.state.type === 'SADMIN'}
                        >
                          <Select.Option value="SERVICIO">{t('messages.aml.service')}</Select.Option>
                          <Select.Option value="USUARIO">{t('messages.aml.user')}</Select.Option>
                          <Select.Option value="AUDIT">{t('messages.aml.audit')}</Select.Option>
                          <Select.Option value="ADMIN">{t('messages.aml.admin')}</Select.Option>
                          <Select.Option value="SADMIN" disabled>{t('messages.aml.sadmin')}</Select.Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  {this.props.modalType !== 'create' &&
                    <Col span={12}>
                      <Form.Item label={t('messages.aml.status')}>
                        {getFieldDecorator('status', {
                          rules: [
                            {
                              required: true,
                              message: t('messages.aml.status'),
                            },
                          ],
                        })(
                          <Select
                            placeholder={t('messages.aml.status')}
                            onChange={(value) => this.handleOnChangeStatus(value)}
                            value={this.state.status}
                            disabled={this.props.modalType === 'view'}
                          >
                            <Select.Option value="ACTIVE">{t('messages.aml.rule.status.ACTIVE')}</Select.Option>
                            <Select.Option value="INACTIVE">{t('messages.aml.rule.status.INACTIVE')}</Select.Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  }
                  {(this.props.currentUser.cliente.clientes.length > 0 && this.props.currentUser.cliente.outsourcer) &&
                    <Col span={this.props.modalType === 'create' ? 12 : 24}>
                      <Form.Item label={t('messages.aml.subclient')}>
                        <Select
                          className="subclient"
                          placeholder={t('messages.aml.selectSubclient')}
                          onChange={(value) => this.handleOnChangeEmpresas(value)}
                          value={this.getEmpresas(this.state.empresas)}
                          disabled={this.props.modalType === 'view'}
                          mode="multiple"
                        >
                          {this.props.currentUser.cliente.clientes.map((value, index) => {
                            return <Select.Option value={value.id}>{value.name}</Select.Option>
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                  }
                </Row>
                {this.props.modalType === 'view' && this.props.user.type === 'SERVICIO' &&
                  <Row>
                    <Col span={24}>
                      <Form.Item label={t('messages.aml.token')}>
                        {getFieldDecorator('token', {
                          rules: [
                            {
                              message: t('messages.aml.token')
                            },
                          ],
                        })(
                          <div className="token-wrapper">
                            <Input value={this.state.token} className="token-input" disabled={true} />
                            <Tooltip placement="top" title={t('messages.aml.copyTokenToClipboard')}>
                              <CopyToClipboard text={this.state.token} onCopy={() => this.handleCopyToClipboard('token')}>
                                <Button type="primary">
                                  <Icon type="copy" />
                                </Button>
                              </CopyToClipboard>
                            </Tooltip>
                          </div>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                }
                <Row className="login-username">
                  <Col xs={24}>
                    <h3>{t('messages.aml.loginCredentials')}</h3>
                    <p><strong className="ant-form-item-required"><span style={{ textDecoration: 'underline' }}>{t('messages.aml.username')}</span> :</strong> {t('messages.aml.usernameDescriptionP1')} <strong>{t('messages.aml.usernameDescriptionP2')}</strong>.</p>
                    <Form.Item className="username">
                      {getFieldDecorator('login', {
                        rules: [
                          {
                            required: true,
                            message: t('messages.aml.loginMandatory'),
                          }
                        ],
                      })(
                        <div className="username-wrapper">
                          <Input
                            id="username"
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            className="username-input"
                            maxlength="20"
                            onKeyDown={this.handleUsernameOnKeyDown}
                            onChange={(e) => this.handleOnChange('login', e.target.value.toLowerCase())}
                            value={this.state.login}
                            disabled={this.props.modalType === 'view'}
                          />
                          <span className="username-suffix">@ {this.props.currentUser.cliente.abreviado}</span>
                          <Tooltip placement="top" title={t('messages.aml.copyUserToClipboard')}>
                            <CopyToClipboard text={this.state.login + '@' + this.props.currentUser.cliente.abreviado} onCopy={() => this.handleCopyToClipboard('username')}>
                              <Button type="primary">
                                <Icon type="copy" />
                              </Button>
                            </CopyToClipboard>
                          </Tooltip>
                        </div>
                      )
                      }
                    </Form.Item>
                    {modalType === 'create' &&
                      <div>
                        <Divider />
                        <p><strong><span style={{ textDecoration: 'underline' }}>{t('messages.aml.password')}</span> :</strong> {t('messages.aml.passwordDescriptionP1')}. <strong>{t('messages.aml.passwordDescriptionP2')}</strong>.</p>
                        <Form.Item className="password">
                          {getFieldDecorator('password')(
                            <div className="password-wrapper">
                              <div className="password-inner">
                                <Tooltip placement="top" title={t('messages.aml.copyPasswordToClipboard')}>
                                  <CopyToClipboard text={this.props.password} onCopy={() => this.handleCopyToClipboard('password')}>
                                    <Button type="primary">
                                      <Icon type="copy" />
                                    </Button>
                                  </CopyToClipboard>
                                </Tooltip>
                                <Input
                                  id="password"
                                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                  className="password-input"
                                  value={this.props.password}
                                  disabled
                                />
                              </div>
                            </div>
                          )
                          }
                        </Form.Item>
                      </div>
                    }

                    {modalType === 'edit' &&
                      <div>
                        <Divider />
                        <p><strong><span style={{ textDecoration: 'underline' }}>{t('messages.aml.password')}</span> :</strong> {t('messages.aml.passwordEditDescriptionP1')}. <strong>{t('messages.aml.passwordDescriptionP2')}</strong>.</p>
                        <Form.Item className="password">
                          {getFieldDecorator('password')(
                            <div className="password-wrapper">
                              <div className="password-inner">
                                {this.state.isPasswordReset ?
                                  <div>
                                    <Tooltip className="edit-button" placement="top" title={t('messages.aml.copyPasswordToClipboard')}>
                                      <CopyToClipboard text={this.state.password} onCopy={() => this.handleCopyToClipboard('password')}>
                                        <Button type="primary">
                                          <Icon type="copy" />
                                        </Button>
                                      </CopyToClipboard>
                                    </Tooltip>
                                    <Input
                                      id="new-assword"
                                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                      className="new-password-input"
                                      value={this.state.password}
                                      disabled
                                    />
                                  </div>
                                  :
                                  <Button type="primary" className="password-reset" onClick={this.handlePasswordReset.bind(this)}><Icon type="lock" /> {t('messages.aml.resetPassword')}</Button>
                                }
                              </div>
                            </div>
                          )
                          }
                        </Form.Item>
                      </div>
                    }
                  </Col>
                </Row>
              </Form>
            </Tabs.TabPane>
            <Tabs.TabPane tab={[<Icon type="database" />, t('messages.aml.databases')]} key="2">
              <div className="switches first">
                <ul className="switches-items">
                  {(this.props.currentUser.cliente.modules.includes('PEP')) &&
                    <li className="switches-item">
                      <span className="name">
                        <Tooltip placement="left" title={t('messages.aml.modulesNames.pepFpDescription')}>
                          <Icon type="info-circle" />&nbsp;&nbsp; {t('messages.aml.modulesNames.pepFp')}
                        </Tooltip>
                      </span>
                      <Switch onChange={(checked) => this.handleOnChangeModule('PEP', checked)} defaultChecked={this.state.modules.includes('PEP') ? true : false} disabled={this.props.modalType === 'view'} />
                    </li>
                  }
                  {(this.props.currentUser.cliente.modules.includes('PEPH')) &&
                    <li className="switches-item penultimate">
                      <span className="name">
                        <Tooltip placement="left" title={t('messages.aml.modulesNames.pepHistoricalDescription')}>
                          <Icon type="info-circle" />&nbsp;&nbsp; {t('messages.aml.modulesNames.pepHistorical')}
                        </Tooltip>
                      </span>
                      <Switch onChange={(checked) => this.handleOnChangeModule('PEPH', checked)} defaultChecked={this.state.modules.includes('PEPH') ? true : false} disabled={this.props.modalType === 'view'} />
                    </li>
                  }
                  {(this.props.currentUser.cliente.modules.includes('PEPALL') && (this.props.currentUser.cliente.modules.includes('PEP') || this.props.currentUser.cliente.modules.includes('PEPH'))) &&
                    <li className="switches-item">
                      <span className="name">
                        <Tooltip placement="left" title={t('messages.aml.modulesNames.useExpandedListDescription')}>
                          <Icon type="info-circle" />&nbsp;&nbsp; {t('messages.aml.modulesNames.useExpandedList')}
                        </Tooltip>
                      </span>
                      <Switch onChange={(checked) => this.handleOnChangeModule('PEPALL', checked)} defaultChecked={this.state.modules.includes('PEPALL') ? true : false} disabled={this.props.modalType === 'view'} />
                    </li>
                  }
                </ul>
              </div>
              <div className="switches">
                <ul className="switches-items">
                  {(this.props.currentUser.cliente.modules.includes('PEPC')) &&
                    <li className="switches-item">
                      <span className="name">
                        <Tooltip placement="left" title={t('messages.aml.modulesNames.pepCandidatesDescription')}>
                          <Icon type="info-circle" />&nbsp;&nbsp; {t('messages.aml.modulesNames.pepCandidates')}
                        </Tooltip>
                      </span>
                      <Switch onChange={(checked) => this.handleOnChangeModule('PEPC', checked)} defaultChecked={this.state.modules.includes('PEPC') ? true : false} disabled={this.props.modalType === 'view'} />
                    </li>
                  }
                  {
                    (
                      this.props.currentUser.cliente.modules.includes('PJUD-APE') ||
                      this.props.currentUser.cliente.modules.includes('PJUD-CIVIL') ||
                      this.props.currentUser.cliente.modules.includes('PJUD-LAB') ||
                      this.props.currentUser.cliente.modules.includes('PJUD-SUP') ||
                      this.props.currentUser.cliente.modules.includes('PJUD-PENAL') ||
                      this.props.currentUser.cliente.modules.includes('PJUD-COB')
                    ) &&
                    <li className="switches-item">
                      <span className="name">
                        <Tooltip placement="left" title={t('messages.aml.modulesNames.legalProceedingsDescription')}>
                          <Icon type="info-circle" />&nbsp;&nbsp; {t('messages.aml.modulesNames.legalProceedings')}
                        </Tooltip>
                      </span>
                      <Switch onChange={(checked) => this.handleOnChangeModule('PJUD', checked)} defaultChecked={this.state.modules.includes('PJUD') ? true : false} disabled={this.props.modalType === 'view'} />
                    </li>
                  }
                  {(this.props.currentUser.cliente.modules.includes('PERSON')) &&
                    <li className="switches-item">
                      <span className="name">
                        <Tooltip placement="left" title={t('messages.aml.modulesNames.peopleInterestDescription')}>
                          <Icon type="info-circle" />&nbsp;&nbsp; {t('messages.aml.modulesNames.peopleInterest')}
                        </Tooltip>
                      </span>
                      <Switch onChange={(checked) => this.handleOnChangeModule('PERSON', checked)} defaultChecked={this.state.modules.includes('PERSON') ? true : false} disabled={this.props.modalType === 'view'} />
                    </li>
                  }
                  {(this.props.currentUser.cliente.modules.includes('PFA')) &&
                    <li className="switches-item">
                      <span className="name">
                        <Tooltip placement="left" title={t('messages.aml.modulesNames.dowJonesRCDescription')}>
                          <Icon type="info-circle" />&nbsp;&nbsp; {t('messages.aml.modulesNames.dowJonesRC')}
                        </Tooltip>
                      </span>
                      <Switch onChange={(checked) => this.handleOnChangeModule('PFA', checked)} defaultChecked={this.state.modules.includes('PFA') ? true : false} disabled={this.props.modalType === 'view'} />
                    </li>
                  }
                  {(this.props.currentUser.cliente.modules.includes('VIP')) &&
                    <li className="switches-item">
                      <span className="name">
                        <Tooltip placement="left" title={t('messages.aml.modulesNames.vipDescription')}>
                          <Icon type="info-circle" />&nbsp;&nbsp; {t('messages.aml.modulesNames.vip')}
                        </Tooltip>
                      </span>
                      <Switch onChange={(checked) => this.handleOnChangeModule('VIP', checked)} defaultChecked={this.state.modules.includes('VIP') ? true : false} disabled={this.props.modalType === 'view'} />
                    </li>
                  }
                  {(this.props.currentUser.cliente.modules.includes('NEG')) &&
                    <li className="switches-item">
                      <span className="name">
                        <Tooltip placement="left" title={t('messages.aml.modulesNames.ownListsDescription')}>
                          <Icon type="info-circle" />&nbsp;&nbsp; {t('messages.aml.modulesNames.ownLists')}
                        </Tooltip>
                      </span>
                      <Switch onChange={(checked) => this.handleOnChangeModule('NEG', checked)} defaultChecked={this.state.modules.includes('NEG') ? true : false} disabled={this.props.modalType === 'view'} />
                    </li>
                  }
                </ul>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={[<Icon type="audit" />, t('messages.aml.permissions')]} key="3">
              <div className="switches">
                <ul className="switches-items">
                  {(this.props.currentUser.cliente.modules.includes('CONSULTA')) &&
                    <li className="switches-item">
                      <span className="name">
                        <Tooltip placement="left" title={t('messages.aml.query')}>
                          <Icon type="info-circle" />&nbsp;&nbsp; {t('messages.aml.query')}
                        </Tooltip>
                      </span>
                      <Switch onChange={(checked) => this.handleOnChangeModule('CONSULTA', checked)} defaultChecked={this.state.modules.includes('CONSULTA') ? true : false} disabled={this.props.modalType === 'view'} />
                    </li>
                  }
                  {(this.props.currentUser.cliente.modules.includes('BATCH')) &&
                    <li className="switches-item">
                      <span className="name">
                        <Tooltip placement="left" title={t('messages.aml.modulesNames.massiveProcessesDescription')}>
                          <Icon type="info-circle" />&nbsp;&nbsp; {t('messages.aml.modulesNames.massiveProcesses')}
                        </Tooltip>
                      </span>
                      <Switch onChange={(checked) => this.handleOnChangeModule('BATCH', checked)} defaultChecked={this.state.modules.includes('BATCH') ? true : false} disabled={this.props.modalType === 'view'} />
                    </li>
                  }
                  {(this.props.currentUser.cliente.modules.includes('NEG') && this.props.currentUser.type === 'SADMIN') &&
                    <li className="switches-item">
                      <span className="name">
                        <Tooltip placement="left" title={t('messages.aml.modulesNames.manageOwnListsDescription')}>
                          <Icon type="info-circle" />&nbsp;&nbsp; {t('messages.aml.modulesNames.manageOwnLists')}
                        </Tooltip>
                      </span>
                      <Switch onChange={(checked) => this.handleOnChangeModule('LOADNEG', checked)} defaultChecked={this.state.modules.includes('LOADNEG')} disabled={this.props.modalType === 'view'} />
                    </li>
                  }
                  {(this.props.currentUser.cliente.modules.includes('OFCTO') && this.props.currentUser.type === 'SADMIN') &&
                    <li className="switches-item">
                      <span className="name">
                        <Tooltip placement="left" title={t('messages.aml.modulesNames.complianceOfficer')}>
                          <Icon type="info-circle" />&nbsp;&nbsp; {t('messages.aml.modulesNames.complianceOfficer')}
                        </Tooltip>
                      </span>
                      <Switch onChange={(checked) => this.handleOnChangeModule('OFCTO', checked)} defaultChecked={this.state.modules.includes('OFCTO')} disabled={this.props.modalType === 'view'} />
                    </li>
                  }
                  {(this.props.currentUser.cliente.modules.includes('OFCTO') && this.props.currentUser.type === 'SADMIN') &&
                    <li className="switches-item">
                      <span className="name">
                        <Tooltip placement="left" title={t('messages.aml.modulesNames.complianceAnalyst')}>
                          <Icon type="info-circle" />&nbsp;&nbsp; {t('messages.aml.modulesNames.complianceAnalyst')}
                        </Tooltip>
                      </span>
                      <Switch onChange={(checked) => this.handleOnChangeModule('ANCTO', checked)} defaultChecked={this.state.modules.includes('ANCTO')} disabled={this.props.modalType === 'view'} />
                    </li>
                  }
                  {(this.props.currentUser.cliente.modules.includes('OFCTO') && this.props.currentUser.cliente.modules.includes('REGISTRO')) &&
                    <>
                      <li className="switches-item">
                        <span className="name">
                          <Tooltip placement="left" title={t('messages.aml.register')}>
                            <Icon type="info-circle" />&nbsp;&nbsp; {t('messages.aml.register')}
                          </Tooltip>
                        </span>
                        <Switch key="14" onChange={(checked) => this.handleOnChangeModule('REGISTRO', checked)} defaultChecked={this.state.modules.includes('REGISTRO') ? true : false} disabled={this.props.modalType === 'view'} />
                      </li>
                      <li className="switches-item">
                        <span className="name">
                          <Tooltip placement="left" title={t('messages.aml.modulesNames.uboFinderTracingDescription')}>
                            <Icon type="info-circle" />&nbsp;&nbsp; {t('messages.aml.modulesNames.uboFinderTracing')}
                          </Tooltip>
                        </span>
                        <Switch onChange={(checked) => this.handleOnChangeModule('UFALL', checked)} defaultChecked={this.state.modules.includes('UFALL') ? true : false} disabled={this.props.modalType === 'view'} />
                      </li>
                    </>
                  }
                  {this.props.currentUser.cliente.modules.includes('QUIEBRA') &&
                    <li className="switches-item">
                      <span className="name">
                        <Tooltip placement="left" title={t('messages.aml.quiebras')}>
                          <Icon type="info-circle" />&nbsp;&nbsp; {t('messages.aml.quiebras')}
                        </Tooltip>
                      </span>
                      <Switch onChange={(checked) => this.handleOnChangeModule('QUIEBRA', checked)} defaultChecked={this.state.modules.includes('QUIEBRA')} disabled={this.props.modalType === 'view'} />
                    </li>
                  }
                  {(this.props.currentUser.cliente.modules.includes('CDI-MATCH')) &&
                    <li className="switches-item">
                      <span className="name">
                        <Tooltip placement="left" title={t('messages.aml.modulesNames.cdi')}>
                          <Icon type="info-circle" />&nbsp;&nbsp; {t('messages.aml.modulesNames.cdiMatch')}
                        </Tooltip>
                      </span>
                      <Switch onChange={(checked) => this.handleOnChangeModule('CDI-MATCH', checked)} defaultChecked={this.state.modules.includes('CDI-MATCH') ? true : false} disabled={this.props.modalType === 'view'} />
                    </li>
                  }
                  {(this.props.currentUser.cliente.modules.includes('CDI-FORM')) &&
                    <li className="switches-item">
                      <span className="name">
                        <Tooltip placement="left" title={t('messages.aml.modulesNames.cdi')}>
                          <Icon type="info-circle" />&nbsp;&nbsp; {t('messages.aml.modulesNames.cdiForm')}
                        </Tooltip>
                      </span>
                      <Switch onChange={(checked) => this.handleOnChangeModule('CDI-FORM', checked)} checked={this.state.modules.includes('CDI-FORM')} disabled={this.props.modalType === 'view'} />
                      {this.state.modules.includes('CDI-FORM') &&
                        <>
                          <Row className="row-subgrant">
                            <Col span={22} offset={2}>
                              <span>Panel de Control</span>
                              <Switch onChange={(checked) => this.handleOnChangeModule('CDI-FORM-PC', checked)} checked={this.state.modules.includes('CDI-FORM-PC')} disabled={this.props.modalType === 'view' || !this.state.modules.includes('CDI-FORM')} />
                              {this.state.modules.includes('CDI-FORM-PC') &&
                                <>
                                  <Row className="row-subgrant1">
                                    <Col span={22} offset={2}>
                                      <span>Trabajadores</span>
                                      <Switch onChange={(checked) => this.handleOnChangeModule('CDI-FORM-PC-CO', checked)} checked={this.state.modules.includes('CDI-FORM-PC-CO')} disabled={this.props.modalType === 'view' || !this.state.modules.includes('CDI-FORM') || !this.state.modules.includes('CDI-FORM-PC')} />
                                    </Col>
                                  </Row>
                                  <Row className="row-subgrant1">
                                    <Col span={22} offset={2}>
                                      <span>Proveedores</span>
                                      <Switch onChange={(checked) => this.handleOnChangeModule('CDI-FORM-PC-PR', checked)} checked={this.state.modules.includes('CDI-FORM-PC-PR')} disabled={this.props.modalType === 'view' || !this.state.modules.includes('CDI-FORM') || !this.state.modules.includes('CDI-FORM-PC')} />
                                    </Col>
                                  </Row>
                                  { this.props.currentUser.cliente.modules.includes('CDI-FORM-PATR') &&
                                    <Row className="row-subgrant1">
                                      <Col span={22} offset={2}>
                                        <span>Clientes</span>
                                        <Switch onChange={(checked) => this.handleOnChangeModule('CDI-FORM-PC-CL', checked)} checked={this.state.modules.includes('CDI-FORM-PC-CL')} disabled={this.props.modalType === 'view' || !this.state.modules.includes('CDI-FORM') || !this.state.modules.includes('CDI-FORM-PC')} />
                                      </Col>
                                    </Row>
                                  }
                                  { this.props.currentUser.cliente.modules.includes('CDI-FORM-DIR') &&
                                    <Row className="row-subgrant1">
                                      <Col span={22} offset={2}>
                                        <span>Directores</span>
                                        <Switch onChange={(checked) => this.handleOnChangeModule('CDI-FORM-PC-DI', checked)} checked={this.state.modules.includes('CDI-FORM-PC-DI')} disabled={this.props.modalType === 'view' || !this.state.modules.includes('CDI-FORM') || !this.state.modules.includes('CDI-FORM-PC')} />
                                      </Col>
                                    </Row>
                                  }
                                </>
                              }
                            </Col>
                          </Row>
                          <Row className="row-subgrant">
                            <Col span={22} offset={2}>
                              <span>Gestión de Comunicados</span>
                              <Switch onChange={(checked) => this.handleOnChangeModule('CDI-FORM-GC', checked)} checked={this.state.modules.includes('CDI-FORM-GC')} disabled={this.props.modalType === 'view' || !this.state.modules.includes('CDI-FORM')} />
                              {this.state.modules.includes('CDI-FORM-GC') &&
                                <>
                                  <Row className="row-subgrant1">
                                    <Col span={22} offset={2}>
                                      <span>Envío Informativos Periódicos</span>
                                      <Switch onChange={(checked) => this.handleOnChangeModule('CDI-FORM-GC-I', checked)} checked={this.state.modules.includes('CDI-FORM-GC-I')} disabled={this.props.modalType === 'view' || !this.state.modules.includes('CDI-FORM') || !this.state.modules.includes('CDI-FORM-GC')} />
                                    </Col>
                                  </Row>
                                  <Row className="row-subgrant1">
                                    <Col span={22} offset={2}>
                                      <span>Solicitud de Declaraciones</span>
                                      <Switch onChange={(checked) => this.handleOnChangeModule('CDI-FORM-GC-D', checked)} checked={this.state.modules.includes('CDI-FORM-GC-D')} disabled={this.props.modalType === 'view' || !this.state.modules.includes('CDI-FORM') || !this.state.modules.includes('CDI-FORM-GC')} />
                                    </Col>
                                  </Row>
                                </>
                              }
                            </Col>
                          </Row>

                          {(this.props.currentUser.cliente.modules.includes('CDI-FORM-CDI') || this.props.currentUser.cliente.modules.includes('CDI-FORM-DIR') || this.props.currentUser.cliente.modules.includes('CDI-FORM-PATR') || this.props.currentUser.cliente.modules.includes('CDI-FORM-REL')) &&
                            <Row className="row-subgrant">
                              <Col span={22} offset={2}>
                                <span>Gestión de Declaraciones</span>
                                <Switch onChange={(checked) => this.handleOnChangeModule('CDI-FORM-GD', checked)} checked={this.state.modules.includes('CDI-FORM-GD')} disabled={this.props.modalType === 'view' || !this.state.modules.includes('CDI-FORM')} />
                                {this.state.modules.includes('CDI-FORM-GD') &&
                                  <>
                                    {
                                      this.props.currentUser.cliente.modules.includes('CDI-FORM-CDI') &&
                                      <>
                                        <Row className="row-subgrant1">
                                          <Col span={22} offset={2}>
                                            <span>Trabajadores</span>
                                            <Switch onChange={(checked) => this.handleOnChangeModule('CDI-FORM-GD-T', checked)} checked={this.state.modules.includes('CDI-FORM-GD-T')} disabled={this.props.modalType === 'view' || !this.state.modules.includes('CDI-FORM') || !this.state.modules.includes('CDI-FORM-GD')} />
                                          </Col>
                                        </Row>
                                        <Row className="row-subgrant1">
                                          <Col span={22} offset={2}>
                                            <span>Proveedores</span>
                                            <Switch onChange={(checked) => this.handleOnChangeModule('CDI-FORM-GD-P', checked)} checked={this.state.modules.includes('CDI-FORM-GD-P')} disabled={this.props.modalType === 'view' || !this.state.modules.includes('CDI-FORM') || !this.state.modules.includes('CDI-FORM-GD')} />
                                          </Col>
                                        </Row>
                                      </>
                                    }
                                    {
                                      this.props.currentUser.cliente.modules.includes('CDI-FORM-DIR') &&
                                      <Row className="row-subgrant1">
                                        <Col span={22} offset={2}>
                                          <span>Directores</span>
                                          <Switch onChange={(checked) => this.handleOnChangeModule('CDI-FORM-GDIR', checked)} checked={this.state.modules.includes('CDI-FORM-GDIR')} disabled={this.props.modalType === 'view' || !this.state.modules.includes('CDI-FORM') || !this.state.modules.includes('CDI-FORM-GD')} />
                                        </Col>
                                      </Row>
                                    }
                                    {
                                      this.props.currentUser.cliente.modules.includes('CDI-FORM-PATR') &&
                                      <Row className="row-subgrant1">
                                        <Col span={22} offset={2}>
                                          <span>Relaciones Patrimoniales</span>
                                          <Switch onChange={(checked) => this.handleOnChangeModule('CDI-FORM-GPATR', checked)} checked={this.state.modules.includes('CDI-FORM-GPATR')} disabled={this.props.modalType === 'view' || !this.state.modules.includes('CDI-FORM') || !this.state.modules.includes('CDI-FORM-GD')} />
                                        </Col>
                                      </Row>
                                    }
                                    {
                                      this.props.currentUser.cliente.modules.includes('CDI-FORM-REL') &&
                                      <Row className="row-subgrant1">
                                        <Col span={22} offset={2}>
                                          <span>Relacionados</span>
                                          <Switch onChange={(checked) => this.handleOnChangeModule('CDI-FORM-GREL', checked)} checked={this.state.modules.includes('CDI-FORM-GREL')} disabled={this.props.modalType === 'view' || !this.state.modules.includes('CDI-FORM') || !this.state.modules.includes('CDI-FORM-GD')} />
                                        </Col>
                                      </Row>
                                    }
                                  </>
                                }
                              </Col>
                            </Row>

                          }

                          {(this.props.currentUser.cliente.modules.includes('CDI-FORM-G') || this.props.currentUser.cliente.modules.includes('CDI-FORM-T')
                            || this.props.currentUser.cliente.modules.includes('CDI-FORM-F') || this.props.currentUser.cliente.modules.includes('CDI-FORM-S')
                            || this.props.currentUser.cliente.modules.includes('CDI-FORM-V')) &&

                            <Row className="row-subgrant">
                              <Col span={22} offset={2}>
                                <span>Gestión de Formularios</span>
                                <Switch onChange={(checked) => this.handleOnChangeModule('CDI-FORM-GF', checked)} checked={this.state.modules.includes('CDI-FORM-GF')} disabled={this.props.modalType === 'view' || !this.state.modules.includes('CDI-FORM')} />
                                {this.state.modules.includes('CDI-FORM-GF') &&
                                  <>

                                    {
                                      this.props.currentUser.cliente.modules.includes('CDI-FORM-G') &&
                                      <Row className="row-subgrant1">
                                        <Col span={22} offset={2}>
                                          <span>Regalos</span>
                                          <Switch onChange={(checked) => this.handleOnChangeModule('CDI-FORM-GF-G', checked)} checked={this.state.modules.includes('CDI-FORM-GF-G')} disabled={this.props.modalType === 'view' || !this.state.modules.includes('CDI-FORM') || !this.state.modules.includes('CDI-FORM-GF')} />
                                        </Col>
                                      </Row>
                                    }

                                    {
                                      this.props.currentUser.cliente.modules.includes('CDI-FORM-T') &&
                                      <Row className="row-subgrant1">
                                        <Col span={22} offset={2}>
                                          <span>Viajes</span>
                                          <Switch onChange={(checked) => this.handleOnChangeModule('CDI-FORM-GF-T', checked)} checked={this.state.modules.includes('CDI-FORM-GF-T')} disabled={this.props.modalType === 'view' || !this.state.modules.includes('CDI-FORM') || !this.state.modules.includes('CDI-FORM-GF')} />
                                        </Col>
                                      </Row>

                                    }

                                    {
                                      this.props.currentUser.cliente.modules.includes('CDI-FORM-F') &&
                                      <Row className="row-subgrant1">
                                        <Col span={22} offset={2}>
                                          <span>Funcionarios públicos</span>
                                          <Switch onChange={(checked) => this.handleOnChangeModule('CDI-FORM-GF-F', checked)} checked={this.state.modules.includes('CDI-FORM-GF-F')} disabled={this.props.modalType === 'view' || !this.state.modules.includes('CDI-FORM') || !this.state.modules.includes('CDI-FORM-GF')} />
                                        </Col>
                                      </Row>

                                    }
                                    {
                                      this.props.currentUser.cliente.modules.includes('CDI-FORM-S') &&
                                      <Row className="row-subgrant1">
                                        <Col span={22} offset={2}>
                                          <span>Asociaciones empresariales</span>
                                          <Switch onChange={(checked) => this.handleOnChangeModule('CDI-FORM-GF-S', checked)} checked={this.state.modules.includes('CDI-FORM-GF-S')} disabled={this.props.modalType === 'view' || !this.state.modules.includes('CDI-FORM') || !this.state.modules.includes('CDI-FORM-GF')} />
                                        </Col>
                                      </Row>

                                    }
                                    {(this.props.currentUser.cliente.modules.includes('CDI-FORM-GF-V')) &&
                                      <Row className="row-subgrant1">
                                        <Col span={22} offset={2}>
                                          <span>Compra Venta Valores</span>
                                          <Switch onChange={(checked) => this.handleOnChangeModule('CDI-FORM-GF-V', checked)} checked={this.state.modules.includes('CDI-FORM-GF-V')} disabled={this.props.modalType === 'view' || !this.state.modules.includes('CDI-FORM') || !this.state.modules.includes('CDI-FORM-GF')} />
                                        </Col>
                                      </Row>
                                    }
                                  </>
                                }
                              </Col>
                            </Row>
                          }

                        </>
                      }
                    </li>
                  }
                  {(this.props.currentUser.cliente.modules.includes('MONITOR')) &&
                    <li className="switches-item">
                      <span className="name">
                        <Tooltip placement="left" title="Gestión de Alertas">
                          <Icon type="info-circle" />&nbsp;&nbsp; Monitoreo
                        </Tooltip>
                      </span>
                      <Switch onChange={(checked) => this.handleOnChangeModule('MONITOR', checked)} defaultChecked={this.state.modules.includes('MONITOR') ? true : false} disabled={this.props.modalType === 'view'} />
                    </li>
                  }
                  {(this.props.currentUser.cliente.modules.includes('ONBOARDING')) &&
                    <li className="switches-item">
                      <span className="name">
                        <Tooltip placement="left" title="Gestión de formularios Onboarding">
                          <Icon type="info-circle" />&nbsp;&nbsp; Onboarding
                        </Tooltip>
                      </span>
                      <Switch onChange={(checked) => this.handleOnChangeModule('ONBOARDING', checked)} defaultChecked={this.state.modules.includes('ONBOARDING') ? true : false} disabled={this.props.modalType === 'view'} />
                    </li>
                  }
                </ul>
              </div>
            </Tabs.TabPane>
          </Tabs>
          <div className="ant-modal-footer">
            {this.props.modalType !== 'view' && <Button onClick={this.props.onCancel}>{t('messages.aml.cancel')}</Button>}
            {this.props.modalType !== 'view' ? <Button type="primary" htmlType="submit" className="login-form-button">{t('messages.aml.save')}</Button> : <Button onClick={() => this.props.onOk('view')} type="primary">Ok</Button>}
          </div>
        </Form>
      </div>
    )
  }
}

const WrappedTimeRelatedForm = Form.create({ name: 'create_new_user' })(ModalContentCreate)

export default withTranslation()(WrappedTimeRelatedForm)
