import './Login.scss'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from 'react-router'
import { Button, Col, Form, Icon, Input, notification, Row, Spin } from 'antd'
import { getAuthTokenPromise } from '../../promises'
import { resetPasswordPromise } from './promises'
import { authTokenSessionStorageSaverHelper } from '../../helpers'

class Login extends Component {
  state = {
    username: '',
    password: '',
    isLoading: false,
    isRestore: false
  }

  handleUsernameOnChange(username) {
    this.setState({ username })
  }

  handlePasswordOnChange(password) {
    this.setState({ password })
  }

  validateFields(fields) {
    const { form } = this.props

    return form.validateFields(fields, { force: true })
  }

  async handleSubmit(e) {
    e.preventDefault()

    await this.validateFields(['username', 'password'])

    this.setState({ isLoading: true })

    const { username, password } = this.state

    const authToken = await getAuthTokenPromise(username, password)

    this.setState({ isLoading: false })

    if (!authToken.error) {
      await authTokenSessionStorageSaverHelper(authToken)

      const { successHandler } = this.props

      await successHandler()
    }
  }

  renderFormItem = (formItem) => {
    const { getFieldDecorator } = this.props.form

    return (
      <Form.Item label={ formItem.label }>
        { getFieldDecorator(formItem.name, { rules: formItem.rules })(formItem.item) }
      </Form.Item>
    )
  }

  async handleSwitchToRestore(e) {
    e.preventDefault()

    await this.setState({ isRestore: true })
  }

  async handleSwitchToLogin(e) {
    e.preventDefault()

    await this.setState({ isRestore: false })
  }

  async handleRestorePassword(e) {
    e.preventDefault()

    const { t } = this.props

    await this.validateFields(['username'])

    await this.setState({ isLoading: true })

    const login = document.getElementById('login_form_username').value
    const reset = await resetPasswordPromise(login)

    if (reset.success) {
      notification.success({
        message: t('messages.aml.successfulOperation'),
        description: t('messages.aml.checkYourEmail')
      })

      window.setTimeout(async () => {
        await this.setState({ isRestore: false })
      }, 4500)
    } else {
      notification.error({
        message: t('messages.aml.notifications.anErrorOcurred'),
        description: t('messages.aml.usernameDoesNotExists')
      })
    }

    await this.setState({ isLoading: false })
  }

  render() {
    const { t } = this.props
    const { isLoading, isRestore } = this.state

    return (
      <div className="login">
        <div className="login-header">
          <Row>
            <Col xs={ 9 }>
            </Col>
            <Col xs={ 6 }>
              <div className="spin-wrapper">
                <Spin style={{ fontColor: '#fff' }} spinning={ isLoading } size={ 'large' } />
              </div>
            </Col>
            <Col xs={ 9 }>
            </Col>
          </Row>
        </div>
        <div className="login-content">
          <Row>
            <Col xs={3} sm={5} md={7} lg={8} xl={9}>
            </Col>
            <Col xs={18} sm={14} md={10} lg={8} xl={6}>
              <div className="login-box">
                <Form onSubmit={ isRestore ? this.handleRestorePassword.bind(this) : this.handleSubmit.bind(this) } className="login-form">
                  <Row>
                    <Col xs={ 24 }>
                      <h2>{ isRestore ? t('messages.aml.restorePassword') : 'AMLupdate v.2.0' }</h2>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={ 24 }>
                      {
                        this.renderFormItem({
                          name: 'username',
                          rules: [{ required: true, message: t('messages.aml.dontForgetUsername') }],
                          item: (
                            <Input
                              disabled={ false }
                              onChange={ (e) => this.handleUsernameOnChange.bind(this)(e.target.value) }
                              prefix={ <Icon type="user" style={{ color: 'rgba(0,0,0,.2)' }} /> }
                              placeholder={ t('messages.aml.username') }
                              />
                          )
                        })
                      }
                    </Col>
                  </Row>
                  { !isRestore &&
                    <Row>
                      <Col xs={ 24 }>
                        {
                          this.renderFormItem({
                            name: 'password',
                            rules: [{ required: true, message: t('messages.aml.dontForgetPassword') }],
                            item: (
                              <Input
                                onChange={ (e) => this.handlePasswordOnChange.bind(this)(e.target.value) }
                                type="password"
                                autoComplete="off"
                                prefix={ <Icon type="lock" style={{ color: 'rgba(0,0,0,.2)' }} /> }
                                placeholder={ t('messages.aml.password') }
                                />
                            )
                          })
                        }
                      </Col>
                    </Row>
                  }
                  <Row>
                    <Col xs={ 24 }>
                      <Button className="login-form-button" type="primary" htmlType="submit">{ t('messages.aml.send') }</Button>
                    </Col>
                  </Row>
                </Form>
              </div>
              { !isRestore && <a href='#' className="login-link" onClick={ this.handleSwitchToRestore.bind(this) } style={{ display: 'block', textAlign: 'center', paddingTop: 15 }}>{ t('messages.aml.forgotYourPassword') }</a> }
              { isRestore && <a href='#' className="login-link" onClick={ this.handleSwitchToLogin.bind(this) } style={{ display: 'block', textAlign: 'center', paddingTop: 15 }}>{ t('messages.aml.backToLogin') }</a> }
            </Col>
            <Col xs={3} sm={5} md={7} lg={8} xl={9}>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

const LoginForm = Form.create({ name: 'login_form' })(Login)


export default withTranslation()(withRouter(LoginForm))
