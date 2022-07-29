import './ModalClient.scss'
import React from 'react'
import { withTranslation } from 'react-i18next'
import moment from 'moment'
import apiConfig from '../../../../config/api'
import { Row, Col, Form, Input, DatePicker, Select, Button, Modal, Radio, Switch, Spin, Tooltip, Table, notification } from 'antd'
import { saveRegisterClientPromise, getClientDetailPromise, getAreasPromise } from '../../promises'
import { getParamsPromise, getCountriesPromise } from '../../../AdminParams/promises'
import { getUsersByClientPromise } from '../../../../promises'
import { validateRutHelper } from "../../../../helpers";

const NEW_ITEM = "NEW_ITEM"

class ModalClient extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      client: {status: 'ACTIVE', type: 'Person', category: 'CLIENTE', formularioInterno: true, subcliente: props.currentUser.subcliente, dateBirth: null},
      mode: 'new',
      countries: [],
      users: [],
      groups: [],
      repLegales: [],
      isLoading: true,
      areas: [],
      showListArea: false,
      showListRelEntidad: false,
      newArea: null,
      newRelEntidad: null,
      empresas: [],
      indexRelated: -1
    }
  }

  async componentDidMount() {
    const { form, currentUser } = this.props

    let client = this.props.client

    let mode = 'edit' // view para modo lectura
    if(client.id === undefined) {
      client = { ...this.state.client, ...client }
      if(this.props.client.type === undefined) {
        mode = 'new'
      }else {
        mode = 'newFilled'
        if(client.extId !== null && client.pais !== 'CHIL') {
          client.rut = 'EXTRANJERO'
          client.params = client.pais + '-' + client.extId
        }
      }
      client.userAsig = {id: currentUser.id}

      this.setState({ repLegales: [{}] })
    }else {
      let clientDetail = await getClientDetailPromise(this.props.client.id)
      client = clientDetail.clCliente
      if(client.repLegales) {
        client.repLegales.map((rl) => {
          rl.isValid=true
          rl.isNew=false
        })
        this.setState({ repLegales: client.repLegales })
      }
    }
    let areas = await getAreasPromise()
    this.setState({
      client,
      mode,
      areas
    })

    const parameters = await getParamsPromise()
    const users = await getUsersByClientPromise()

    let empresas = []
    if(currentUser.cliente.outsourcer && currentUser.cliente.clientes !== null && currentUser.cliente.clientes.length > 0) {
      empresas = currentUser.cliente.clientes
      if(currentUser.empresas !== null && currentUser.empresas.length > 1) {
        empresas = currentUser.empresas
      }
    }

    this.setState({
      groups: parameters.gruposNames,
      uboFinderParams: parameters.ubofinder,
      isLoading: false,
      users,
      empresas
    })

    const countries = await getCountriesPromise()
    this.setState({
      countries
    })

    form.setFieldsValue({
      status: client.status,
      rut: client.rut,
      category: client.category,
      subcliente: client.subcliente !== null && client.subcliente !== undefined ? client.subcliente.id : null,
      nombre: this.props.client.nombre,
      type: this.props.client.type,
      grupo: this.props.client.grupo,
      area: this.props.client.area,
      email: this.props.client.email,
      telefono: this.props.client.telefono,
      direccion: this.props.client.direccion,
      ciudad: this.props.client.ciudad,
      pais: this.props.client.pais,
      aliasFantasia: this.props.client.aliasFantasia,
      giroProfesion: this.props.client.giroProfesion,
      proposito: this.props.client.proposito,
      userAsig: client.userAsig !== null && client.userAsig !== undefined ? client.userAsig.id : null,
      dateBirth: this.props.client.dateBirth,
      citizenship: this.props.client.citizenship,
    })
  }

  handleCloseModal() {
    this.props.onCancel()
  }

  handleOnChange = (key, value) => {
    const { client } = this.state
    client[key] = value
    if(key === 'type' && client.id === undefined) {
      client.processUF = false
      client.formularioInterno = true
    }
    this.setState({ client })
  }

  handleOnChangeArea = (value) => {
    const { client } = this.state
    if (value !== NEW_ITEM) {
      client.area = value
      this.setState({ client })
    } else {
      this.setState({ showListArea: true })
    }
  }

  handleOnChangeAsignedUser = (value) => {
    const { client } = this.state
    if(client.userAsig === null || client.userAsig === undefined) {
      client.userAsig = {}
    }
    client.userAsig.id = value
    this.setState({ client })
  }

  handleOnChangeUF = (processUF) => {
    const { client, mode } = this.state
    client.processUF = processUF
    if(!processUF) {
      if(mode === 'edit') {
        //client.processUF = true
      }else {
        client.formularioInterno = true
      }
    }
    this.setState({ client })
  }

  async handleSaveClient(e) {
    e.preventDefault()
    const { form, t } = this.props
    let { client, repLegales } = this.state
    form.validateFields(err => {
      if (!err) {
        let rp = repLegales.filter(rec => rec.isValid)
        client.repLegales = rp
        saveRegisterClientPromise(client)
        .then(response => {
          if(response.status === 'OK') {
            notification.success({
              message: t('messages.aml.successfulOperation'),
              description: t('messages.aml.dataSavedSuccessfully')
            })
            this.handleCloseModal()
            this.props.onOk()
          }else {
            notification.error({
              message: t('messages.aml.notifications.anErrorOcurred'),
              description: response.message
            })
          }
        })
      }else {
        notification.error({
          message: t('messages.aml.notifications.anErrorOcurred'),
          description: t('messages.aml.missingRequiredField')
        })
      }
    })
  }

  handleEditClient() {
    this.setState({ mode: 'edit' })
  }

  getButtonsMode = (mode) => {
    const { t, currentUser } = this.props
    let buttons = []
    buttons.push(<Button onClick={ this.handleCloseModal.bind(this) }>{ t('messages.aml.cancel') }</Button>)
    if(currentUser.type !== 'AUDIT') {
      if(mode === 'view') {
        buttons.push(<Button type="primary" onClick={ this.handleEditClient.bind(this) }>{ t('messages.aml.edit') }</Button>)
      }else {
        buttons.push(<Button type="primary" onClick={ this.handleSaveClient.bind(this) }>{ t('messages.aml.save') }</Button>)
      }
    }
    return buttons
  }

  getUsersAsig(users) {
    const { currentUser } = this.props
    let _users = []
    for(let i=0;i<users.length;i++) {
      if((users[i].type === 'ADMIN' || users[i].type === 'SADMIN' || users[i].type === 'USUARIO') && ((currentUser.cliente.oficialCto !== null && currentUser.cliente.oficialCto.id === users[i].id) || (users[i].modules !== null && users[i].modules.includes('REGISTRO')))) {
        _users.push(<Select.Option value={ users[i].id }>{ users[i].name }</Select.Option>)
      }
    }
    return _users
  }

  getFechaFromLong(date) {
    let now = new Date()
    let dDate = new Date(date + now.getTimezoneOffset() * 60 * 1000)
    let mDate = moment(dDate)

    return <Tooltip placement="top" title={ mDate.format('DD-MM-YYYY HH:mm') }>
      <label className="fecUpdate">{ mDate.fromNow() }</label>
    </Tooltip>
  }

  handleChangeRepLegal(field, value, index) {
    let { repLegales } = this.state
    repLegales[index][field] = value
    repLegales[index].isBlank = false
    if(repLegales[index].tipoDoc === 'RUT' && repLegales[index].dni) {
      repLegales[index].isValid = validateRutHelper(repLegales[index].dni)
    }else {
      repLegales[index].isValid = true
    }

    if(field === 'type') {
      if (value === NEW_ITEM) {
        repLegales[index][field] = null
        this.setState({ showListRelEntidad: true })
      }
    }
    this.setState({ repLegales, indexRelated: index })
  }

  handleNewRepLegal() {
    let { repLegales } = this.state
    repLegales.push({isBlank: true, isValid: false})
    this.setState({ repLegales })
  }

  handleRemoveRepLegal(index) {
    let { repLegales } = this.state
    if(repLegales.length > 0) {
      repLegales.splice(index, 1)
      this.setState({ repLegales })
    }
  }

  handleChangeNewArea(value) {
    this.setState({ newArea: value })
  }

  handleChangeNewRelEntidad(value) {
    let { indexRelated } = this.state
    this.setState({ newRelEntidad: value })
  }


  handleOnChangeSubcliente(value) {
    const { client } = this.state
    client.subcliente = { id: value }
    this.setState({ client })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { client, mode, groups, countries, uboFinderParams, users, repLegales, isLoading, areas, showListArea, showListRelEntidad, newArea, newRelEntidad, empresas, indexRelated } = this.state
    const { t, currentUser } = this.props

    const tableColumns = [
      {
        title: t('messages.aml.name'),
        dataIndex: 'name',
        render: (text, record, index) => {
          if(mode === 'view') {
            return text
          }else {
            return <Input value={ text } onChange={ (e) => this.handleChangeRepLegal('name', e.target.value, index) } maxLength={255}/>
          }
        }
      },
      {
        title: t('messages.aml.dniType'),
        dataIndex: 'tipoDoc',
        render: (text, record, index) => {
          if(mode === 'view') {
            return text
          }else {
            return(<Select defaultValue={text} onChange={ (value) => this.handleChangeRepLegal('tipoDoc', value, index) }>
              <Select.Option value="RUT">Rut</Select.Option>
              <Select.Option value="OTRO">Otro</Select.Option>
            </Select>)
          }
        }
      },
      {
        title: t('messages.aml.dniLarge'),
        dataIndex: 'dni',
        render: (text, record, index) => {
          if(mode === 'view') {
            return text
          }else {
            return (
                <div className="dni">
                  <Input value={ text } onChange={ (e) => this.handleChangeRepLegal('dni', e.target.value, index) } maxLength={20}/>
                  <div className="error">
                    Documento de identidad no es valido
                  </div>
                </div>
              )
          }
        }
      },
      {
        title: t('messages.aml.entityRelation'),
        dataIndex: 'type',
        render: (text, record, index) => {
          if(mode === 'view') {
            return text
          }else {
            return(<Select value={text} onChange={ (value) => this.handleChangeRepLegal('type', value, index) }>
              <Select.Option value="REPLEGAL">{t('messages.aml.repLegal')}</Select.Option>
              <Select.Option value="DIRECTOR">Director</Select.Option>
              <Select.Option value="GERENTE_GENERAL">Gerente</Select.Option>
              <Select.Option value="EJ_PRINCIPAL">Ejecutivo Principal</Select.Option>
              <Select.Option value="AVAL">Aval o Coaval</Select.Option>
              <Select.Option value="APODERADO">Apoderado</Select.Option>
              <Select.Option value={NEW_ITEM}>+ Nuevo Item</Select.Option>
            </Select>)
          }
        }
      },
      {
        title: 'Email',
        dataIndex: 'email',
        render: (text, record, index) => {
          if(mode === 'view') {
            return text
          }else {
            return <Input value={ text } onChange={ (e) => this.handleChangeRepLegal('email', e.target.value, index) } maxLength={150}/>
          }
        }
      },
      {
        title: 'Nacionalidad',
        dataIndex: 'citizenship',
        render: (text, record, index) => {
          if(mode === 'view') {
            return text
          }else {
            return <Select showSearch defaultValue={ text }
                  onChange={ (value) => this.handleChangeRepLegal('citizenship', value, index) }
                  allowClear
                  >
                    { currentUser.cliente.pais === "CHI" &&
                    <Select.Option
                    value= "Chile">
                    Chile
                    </Select.Option> }
                    { currentUser.cliente.pais === "PER" &&
                    <Select.Option
                    value= "Peru">
                    Peru
                    </Select.Option> }
                    { countries.map(country => <Select.Option value={ country.name }>{ country.name }</Select.Option>) }
                </Select>
          }
        }
      },
      {
        title: 'Fec. Nacimiento',
        dataIndex: 'dateBirth',
        render: (text, record, index) => {
          if(mode === 'view') {
            return text
          }else {
            return <DatePicker
                    placeholder="Fec. Nacimiento"
                    format="DD/MM/YYYY"
                    defaultValue={ text ? moment(text, "DD/MM/YYYY") : null }
                    onChange={(momentObj) =>
                      this.handleChangeRepLegal(
                        "dateBirth",
                        momentObj !== null
                        ?
                          moment(momentObj).format("DD/MM/YYYY")
                        : null,
                        index
                      )
                    }
                  />
          }
        }
      },
      {
        title: 'Pais residencia',
        dataIndex: 'residentOf',
        render: (text, record, index) => {
          if(mode === 'view') {
            return text
          }else {
            return <Select showSearch defaultValue={ text }
                  onChange={ (value) => this.handleChangeRepLegal('residentOf', value, index) }
                  allowClear
                  >
                    { currentUser.cliente.pais === "CHI" &&
                    <Select.Option
                    value= "Chile">
                    Chile
                    </Select.Option> }
                    { currentUser.cliente.pais === "PER" &&
                    <Select.Option
                    value= "Peru">
                    Peru
                    </Select.Option> }
                    { countries.map(country => <Select.Option value={ country.name }>{ country.name }</Select.Option>) }
                </Select>
          }
        }
      },
      {
        dataIndex: 'id',
        width: 50,
        render: (text, record, index) => {
          if(mode !== 'view') {
            return <Button type="primary" icon="close" size="small" onClick={ (e) => this.handleRemoveRepLegal(index) }/>
          }
        }
      }
    ]

    return (
      <div id="div-modal-cliente">
        <Modal
          title={ t('messages.aml.registry.modalCustomer') }
          className="modal-cliente"
          visible={ true }
          width={ 1200 }
          onCancel={ this.handleCloseModal.bind(this) }
          footer={ this.getButtonsMode(mode) }
          >
          { isLoading ?
            <Spin spinning={ true } size="large" />
            :
            <Form labelCol={{span:8 }} wrapperCol={{span:15, offset:1 }} colon={false}>
              <Input type="hidden" value={ client.id } />
              { (mode === 'view' || mode === 'edit') &&
                <Row>
                  <Col xs={0} md={14}></Col>
                  <Col xs={24} md={ 10 }>
                    <Form.Item label={ t('messages.aml.updateDate') } labelCol={{span:14 }} wrapperCol={{span:10 }}>
                      { this.getFechaFromLong(client.fecLastUpdate) }
                    </Form.Item>
                  </Col>
                </Row>
              }
              <h4>Información Básica</h4>
              <Row>
                <Col xs={ 12 }>
                  <Form.Item label={ t('messages.aml.active') } >
                    <Switch checked={ client.status === 'ACTIVE' } disabled={ mode === 'view' || mode === 'new' || mode === 'newFilled' } onChange={ (checked) => this.handleOnChange('status', checked?'ACTIVE':'INACTIVE') } />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={ 12 }>
                  <Form.Item label={ t('messages.aml.category') } >
                    { getFieldDecorator('category', {
                        rules: [
                          {
                            required: true
                          }
                        ],
                      })(
                        <Select defaultValue={ client.category } onChange={ (value) => this.handleOnChange('category', value) } className={ mode === 'view' ? 'select-readonly' : '' }>
                          <Select.Option value="CLIENTE">{ t('messages.aml.category.CLIENTE') }</Select.Option>
                          <Select.Option value="PROVEEDOR">{ t('messages.aml.category.PROVEEDOR') }</Select.Option>
                          <Select.Option value="COLABORADOR">{ t('messages.aml.category.COLABORADOR') }</Select.Option>
                          <Select.Option value="DIRECTOR">{ t('messages.aml.category.DIRECTOR') }</Select.Option>
                        </Select>
                      )
                    }
                  </Form.Item>
                </Col>
                <Col span={ 12}>
                  <Form.Item label={ t('messages.aml.type') }>
                    <Radio.Group value={ client.type } disabled={ mode === 'newFilled' || mode === 'edit' || mode === 'view' } onChange={ (e) => this.handleOnChange('type', e.target.value) }>
                      { ((!currentUser.cliente.modules.includes('REG-PERSON') && !currentUser.cliente.modules.includes('REG-ENTITY')) || currentUser.cliente.modules.includes('REG-PERSON')) &&
                        <Radio value="Person">{ t('messages.aml.naturalPerson') }</Radio>
                      }
                      { ((!currentUser.cliente.modules.includes('REG-PERSON') && !currentUser.cliente.modules.includes('REG-ENTITY')) || currentUser.cliente.modules.includes('REG-ENTITY')) &&
                        <Radio value="Entity">{ t('messages.aml.legalPerson') }</Radio>
                      }
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={ 12}>
                  <Form.Item label={ client.type === 'Person' ? t('messages.aml.name') : t('messages.aml.legalName') } >
                    { getFieldDecorator('nombre', {
                        rules: [
                          {
                            required: true
                          },
                        ],
                      })(
                        <Input type="text" value={ client.nombre } disabled={ mode === 'newFilled' } readOnly={ mode === 'view' } onChange={ (e) => this.handleOnChange('nombre', e.target.value) } />
                      )
                    }
                  </Form.Item>
                </Col>
                <Col xs={ 12 }>
                  <Form.Item label={ t('messages.aml.rut') } >
                    { getFieldDecorator('rut', {
                        rules: [
                          {
                            required: true
                          },
                        ],
                      })(
                        <Input type="text" value={ client.rut } disabled={ mode === 'newFilled' || mode === 'edit' || mode === 'view' } onChange={ (e) => this.handleOnChange('rut', e.target.value) } />
                      )
                    }
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={ 12 }>
                  <Form.Item label="Area">
                    { getFieldDecorator('area', {
                        rules: [
                          {
                            required: currentUser.cliente.modules.includes('CDI-FORM')
                          }
                        ],
                      })(
                        <Select value={ client.area } onChange={ (value) => this.handleOnChangeArea(value) } className={ mode === 'view' ? 'select-readonly' : '' }>
                            <Select.Option value={ null }>[{ t('messages.aml.none') }]</Select.Option>
                            { areas.map(area => <Select.Option value={ area }>{ area }</Select.Option>) }
                            <Select.Option value={NEW_ITEM}>+ Nuevo Item</Select.Option>
                        </Select>
                      )
                    }
                  </Form.Item>
                </Col>
                <Col span={ 12 }>
                  <Form.Item label="Email">
                    { getFieldDecorator('email', {
                        rules: [
                          {
                            //type: 'email',
                            required: currentUser.cliente.modules.includes('CDI-FORM')
                          }
                        ],
                      })(
                        <Input type="text" value={ client.email } onChange={ (e) => this.handleOnChange('email', e.target.value) } readOnly={ mode === 'view' } />
                      )
                    }
                  </Form.Item>
                </Col>
                { empresas.length > 0 &&
                  <Col span={ 12 }>
                    <Form.Item label={ t('messages.aml.subclient') }>
                      { getFieldDecorator('subcliente', {
                        rules: [
                          {
                            required: currentUser.cliente.modules.includes('CDI-FORM')
                          }
                        ],
                      })(
                          <Select value={ client.subcliente !== null && client.subcliente !== undefined ? client.subcliente.id : null }  onChange={ (value) => this.handleOnChangeSubcliente(value) } className={ mode === 'view' ? 'select-readonly' : '' } >
                            { empresas.map(item =>
                              <Select.Option className="subclient-option" value={ item.id }>
                                <div className="subclient-option-inner">
                                  <figure className="subclient-logo">
                                    <img src={ apiConfig.url + '/../getImageClientUser/0/' + item.id } alt="" style={{ height: '15px' }} />
                                  </figure>
                                  <span className="subclient-name" style={{ paddingLeft: '10px' }}>{ item.name }</span>
                                </div>
                              </Select.Option>
                              )
                            }
                          </Select>
                      )}
                    </Form.Item>
                  </Col>
                }
                { groups !== null && groups.length > 0 &&
                  <Col span={ 12}>
                    <Form.Item label={ t('messages.aml.group') }>
                    { getFieldDecorator('grupo', {
                      rules: [
                        {
                          required: true
                        },
                      ],
                    })(
                      <Select value={ client.grupo } onChange={ (value) => this.handleOnChange('grupo', value) } className={ mode === 'view' ? 'select-readonly' : '' }>
                        { groups.map(grupo => <Select.Option value={ grupo }>{ grupo }</Select.Option>) }
                      </Select>
                      )}
                    </Form.Item>
                  </Col>
                }
                { currentUser.cliente.modules.includes('MONITOR-AML') &&
                  <Col span={ 12 }>
                    <Form.Item label={ t('messages.aml.asignedUser') }>
                    { getFieldDecorator('userAsig', {
                      rules: [
                        {
                          required: true
                        },
                      ],
                    })(
                      <Select value={ client.userAsig !== undefined && client.userAsig !== null ? client.userAsig.id : currentUser.id } onChange={ (value) => this.handleOnChangeAsignedUser(value) } className={ mode === 'view' ? 'select-readonly' : '' }>
                          { this.getUsersAsig(users) }
                      </Select>
                    )}
                    </Form.Item>
                  </Col>
                }
                <Col xs={ 12 }>
                  <Form.Item label={ t('messages.aml.title.phone') } >
                    <Input type="text" value={ client.telefono } onChange={ (e) => this.handleOnChange('telefono', e.target.value) } readOnly={ mode === 'view' } />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <h4>Demográficos</h4>
              </Row>
                  {/*}
                  <Col xs={ 12 }>
                    <Form.Item label={ client.type === 'Person' ? t('messages.aml.title.alias') : t('messages.aml.title.fantasyName') } >
                      <Input type="text" value={ client.aliasFantasia } onChange={ (e) => this.handleOnChange('aliasFantasia', e.target.value) } readOnly={ mode === 'view' } />
                    </Form.Item>
                  </Col>
                  */}
              <Row>
                <Col xs={ 12 }>
                  <Form.Item label={ t('messages.aml.address') } >
                    <Input type="text" value={ client.direccion } onChange={ (e) => this.handleOnChange('direccion', e.target.value) } readOnly={ mode === 'view' } />
                  </Form.Item>
                </Col>
                <Col xs={ 12 }>
                  <Form.Item label={ client.type === 'Person' ? t('messages.aml.title.profession') : t('messages.aml.title.comercialActivity') } >
                     <Input type="text" value={ client.giroProfesion } onChange={ (e) => this.handleOnChange('giroProfesion', e.target.value) } readOnly={ mode === 'view' } />
                  </Form.Item>
                </Col>
                <Col xs={ 12 }>
                  <Form.Item label={ t('messages.aml.title.city') } >
                    <Input type="text" value={ client.ciudad } onChange={ (e) => this.handleOnChange('ciudad', e.target.value) } readOnly={ mode === 'view' } />
                  </Form.Item>
                </Col>
                { (client.type === 'Person' || client.type === 'Entity') &&
                  <Col xs={ 12 }>
                    <Form.Item label={ client.type === 'Person' ? t('messages.aml.birthDate') : t("messages.aml.registerDate") } >
                      <DatePicker
                      placeholder={ client.type === 'Person' ? "Fec. Nacimiento" : "Fec. Registro" }
                      format="DD/MM/YYYY"
                      defaultValue={ client.dateBirth !== null ? moment(client.dateBirth, "DD/MM/YYYY") : null }
                      onChange={(momentObj) =>
                        this.handleOnChange(
                        "dateBirth",
                        momentObj !== null
                        ?
                          moment(momentObj).format("DD/MM/YYYY")
                        : null,
                        true
                      )
                    } />
                    </Form.Item>
                  </Col>
                }
                <Col xs={ 12 }>
                  <Form.Item label={ client.type === 'Person' ? t('messages.aml.countryofresindent') : t('messages.aml.country') } >
                    <Select showSearch value={ client.pais } onChange={ (value) => this.handleOnChange('pais', value) } readOnly={ mode === 'view' } className={ mode === 'view' ? 'select-readonly' : '' } >
                        { countries.map(country => <Select.Option value={ country.name }>{ country.name }</Select.Option>) }
                    </Select>
                  </Form.Item>
                </Col>
                { (client.type === 'Person' || client.type === 'Entity') &&
                  <Col xs={ 12 }>
                   <Form.Item label={ client.type === 'Person' ? t('messages.aml.citizenship') : t('messages.aml.countryofregister') } >
                      <Select showSearch value={ client.citizenship }
                        onChange={ (value) => this.handleOnChange('citizenship', value) }
                        readOnly={ mode === 'view' }
                        className={ mode === 'view' ? 'select-readonly' : '' }
                        allowClear
                        >
                          { currentUser.cliente.pais === "CHI" &&
                          <Select.Option
                          value= "Chile">
                          Chile
                          </Select.Option> }
                          { currentUser.cliente.pais === "PER" &&
                          <Select.Option
                          value= "Peru">
                          Peru
                          </Select.Option> }
                          { countries.map(country => <Select.Option value={ country.name }>{ country.name }</Select.Option>) }
                      </Select>
                    </Form.Item>
                  </Col>
                }
              </Row>
              <Row>
                <Col xs={ 24 }>
                  <Form.Item label={ t('messages.aml.title.purpose') } labelCol={{span:4 }} wrapperCol={{span:20 }} className="prop-div" >
                    <Input type="text" value={ client.proposito } onChange={ (e) => this.handleOnChange('proposito', e.target.value) } readOnly={ mode === 'view' } />
                  </Form.Item>
                </Col>
              </Row>
              { client.type === 'Entity' &&
                <>
                <Row>
                  <h4>{ t('messages.aml.related') }</h4>
                  <Col xs={ 24 }>
                    <Table className="tbl-related" dataSource={ repLegales } columns={ tableColumns } pagination={ false } size='small' rowClassName={(record, index) => {return record.isValid === false && record.isBlank === false ? 'no-valid' : ''}} />
                  </Col>
                </Row>
                { mode !== 'view' &&
                  <Row>
                    <Col xs={ 24 }>
                      <Button type="primary" icon="plus" size="small" onClick={ this.handleNewRepLegal.bind(this) } className="btn-add-replegal">
                        { t('messages.aml.addRelated') }
                      </Button>
                    </Col>
                  </Row>
                }
                </>
              }
              { (currentUser.cliente.modules.includes('QUIEBRA') || (client.type === 'Entity' && currentUser.cliente.modules.includes('ADMCLI'))) &&
                <Row>
                  <h4>Servicios</h4>
                    <Col span={ 14 }>
                      { currentUser.cliente.modules.includes('QUIEBRA') &&
                        <Row>
                          <Form.Item label="Activa Monitoreo de Quiebras" labelAlign="left">
                            <Switch checked={ client.hasQuiebras } disabled={ mode === 'view' } onChange={ (checked) => this.handleOnChange('hasQuiebras', checked) } />
                          </Form.Item>
                        </Row>
                      }
                      { client.type === 'Entity' && currentUser.cliente.modules.includes('ADMCLI') && uboFinderParams && !uboFinderParams.noInvestigaMalla &&
                      <>
                        <Row>
                          <Form.Item label={ t('messages.aml.ubosInvestigate') } labelAlign="left" >
                            <Switch checked={ client.processUF } disabled={ mode === 'view' || (mode==='newFilled' && client.pais !== 'CHIL') } onChange={ (checked) => this.handleOnChangeUF(checked) } />
                          </Form.Item>
                        </Row>
                        { uboFinderParams.formularioInterno && !uboFinderParams.sinFormulario &&
                          <Row>
                            <Form.Item label={ t('messages.aml.sendMail') } labelAlign="left" >
                              <Switch checked={ !client.formularioInterno } disabled={ !client.processUF || mode === 'view' } onChange={ (checked) => this.handleOnChange('formularioInterno', !checked) } />
                            </Form.Item>
                          </Row>
                        }
                      </>
                    }
                    </Col>
                </Row>
              }

            </Form>
          }
        </Modal>

        { showListArea &&
          <Modal
            title="Area"
            className="modal-area-cliente"
            visible={ true }
            width={ 400 }
            onOk={() => {
              let inputValue = newArea.trim()
              client.area = inputValue
              this.setState({
                client,
                showListArea: false,
                newArea: null
              })
              if (!areas.includes(inputValue)) {
                this.setState({
                  areas: [inputValue, ...areas]
                });
              }
            }}
            onCancel={() => {
              this.setState({ showListArea: false });
            }}
          >
            <Input value={newArea} onChange={(e) => this.handleChangeNewArea(e.target.value)}/>
          </Modal>
        }

        { showListRelEntidad &&
          <Modal
            title="Relación con la Entidad"
            className="modal-area-cliente"
            visible={ true }
            width={ 400 }
            onOk={() => {
              let inputValue = newRelEntidad.trim()
              repLegales[indexRelated].type = inputValue
              this.setState({
                repLegales,
                showListRelEntidad: false,
                newRelEntidad: null
              })
            }}
            onCancel={() => {
              this.setState({ showListRelEntidad: false });
            }}
          >
            <Input value={newRelEntidad} onChange={(e) => this.handleChangeNewRelEntidad(e.target.value)}/>
          </Modal>
        }
      </div>
    )
  }
}

const WrappedModalClient = Form.create({ name: 'client_form' })(ModalClient)
export default withTranslation()(WrappedModalClient)
