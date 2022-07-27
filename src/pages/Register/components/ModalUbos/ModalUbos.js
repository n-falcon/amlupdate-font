import './ModalUbos.scss'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { Button, Row, Col, Descriptions, Table, Modal, Tabs, Spin, Input, notification } from 'antd'
import { getClientDetailPromise, getClientTreePromise, validateFormPromise, saveDDAValidatedPromise, sendFormC57Promise } from '../../promises'
import { getParamsPromise } from '../../../AdminParams/promises'
import { ReportService } from '../../../../services'
import { camelizerHelper } from '../../../../helpers'
import apiConfig from '../../../../config/api'

const { TabPane } = Tabs
const { TextArea } = Input

class ModalUbos extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      parameters: null,
      isModalUbosVisible: false,
      details: {},
      tree: [],
      loading: true,
      loadingTree: true,
      obsCli: null,
      sendFormComment: false
    }
  }

  setErrors(details, ddaValidate) {
    if(ddaValidate !== null && ddaValidate.errors !== null) {
      for(let i in ddaValidate.errors) {
        let error = ddaValidate.errors[i]
        if(error.code === 'E03' || error.code === 'E05') {
          if(details.ubosForm !== null) {
            for(let f in details.ubosForm) {
              if(details.ubosForm[f].rut === error.rut) {
                details.ubosForm[f].error = error
              }
            }
          }
        }
        if(error.code === 'E04' || error.code === 'E05') {
          if(details.entity !== null && details.entity.propietarios !== null) {
            for(let f in details.entity.propietarios) {
              if(details.entity.propietarios[f].rut === error.rut) {
                details.entity.propietarios[f].error = error
              }
            }
          }
        }
      }
    }
    return details
  }

  async init(id) {
    this.setState({ loading: true })
    let details = await getClientDetailPromise(id)
    if(details.form !== null && details.form.ddaValidate !== null) {
      details = this.setErrors(details, details.form.ddaValidate)
    }
    const parameters = await getParamsPromise()
    this.setState({ details, record: details.clCliente, parameters, loading: false })
  }

  async componentDidMount() {
    const { record } = this.props
    this.init(record.id)

    const tree = await getClientTreePromise(record.id)
    this.setState({ tree, loadingTree: false })
  }

  openPdfForm = () => {
    const { record } = this.props
    window.open(apiConfig.url + '/../ubo/pdfFormUF/' + record.form.id)
  }

  getMallaPropiedad(ubos) {
    let records = []
    if(ubos !== null) {
      for(let i=0;i<ubos.length;i++) {
        if(ubos[i].origenMallaPropiedad === 'CLIENTE') {
          records.push(ubos[i])
        }
      }
    }
    return records
  }

  handleOnCancelModalUbos() {
    this.setState({ isModalUbosVisible: false })
  }

  handleViewUbos() {
    this.setState({ isModalUbosVisible: true })
  }

  getDataTree(propietarios, level) {
    if( propietarios !== undefined && propietarios !== null && propietarios.length > 0) {
      const list = []
      for (let i = 0; i < propietarios.length; i++) {
        list.push({ key: i+propietarios[i].id+level, rut: (propietarios[i].paisId === 1 ? propietarios[i].formatRut : propietarios[i].pais), nombre: propietarios[i].name, porcentaje: propietarios[i].participacionDirecta, type: propietarios[i].type, tipo: propietarios[i].relation, children: this.getDataTree(propietarios[i].propietarios, level+1) })
      }
      return list
    }
  }

  completeForm() {
    const { record, currentUser } = this.props
    window.open(apiConfig.urlAml + '/ubo/formC57FI?formId=' + record.form.id + '&userId=' + currentUser.id)
  }

  closeConfirmSend() {
    notification.close('confirm-send-form')
  }

  async sendFormClient() {
    const { record } = this.props
    const { obsCli } = this.state

    await sendFormC57Promise(record.id, obsCli)

    notification.close('confirm-send-form')

    this.init(record.id)
  }

  async handleAddCommentClick() {
    await this.setState({ sendFormComment: true })

    this.renderNotification()
  }

  renderNotification() {
    const { t } = this.props
    const { sendFormComment } = this.state

    let btn =
        <div className="message-buttons-confirm">
          <Button type="ghost" onClick={ this.closeConfirmSend.bind(this) }>{ t('messages.aml.btnClose') }</Button>&nbsp;
          <Button type="primary" onClick={ this.sendFormClient.bind(this) }>{ t('messages.aml.ubofinder.sendForm') }</Button>
        </div>
    let description = <div>
      { t('messages.aml.ubofinder.confirmSendForm') }<br/>
      { !sendFormComment &&
        <div className="addComment" onClick={ this.handleAddCommentClick.bind(this) }>
          <span>Agregar commentario</span>
          <Button type="primary" shape="circle" icon="plus" size="small" />
        </div>
      }
      { sendFormComment && <TextArea id="add-comment" rows={2} onChange={ this.handleChangeObs.bind(this) }/> }
        </div>

      notification.info({
        key: 'confirm-send-form',
        message: t('messages.aml.confirm'),
        description,
        duration: 10,
        btn
      })
  }

  sendForm() {
    this.renderNotification()
  }

  handleChangeObs(e) {
    this.setState({ obsCli: e.target.value })
  }

  async validateForm() {
    const { t,  record } = this.props
    const validate = await validateFormPromise(record.id)
    if(validate.status === 'OK') {
      this.saveValidated(record.id, '¿Desea aprobar el formulario y pasar a Monitoreo?', 'N')
    }else if(validate.status === 'WARNING') {
      let details = await getClientDetailPromise(record.id)
      details = this.setErrors(details, validate)
      this.setState({ details })
      this.saveValidated(record.id, '¿Desea aprobar igualmente con diferencia de porcentajes?', 'N')
    }else { //ERROR
      if ( validate.errors[0].code === 'E01' || validate.errors[0].code === 'E02' ) {
        notification.error({
          message: t('messages.aml.notifications.anErrorOcurred'),
          description:  validate.errors[0].message
        })
      }else {
        let details = await getClientDetailPromise(record.id)
        details = this.setErrors(details, validate)
        this.setState({ details })

        let msg = <div><p className="confirm-message warning-message">Hay inconsistencias en declaracion de formulario con Malla de propiedad.</p>
              <p className="confirm-message">¿Desea aceptar el formulario y pasar a monitoreo?</p></div>
        this.saveValidated(record.id, msg, 'Y');
      }
    }
  }

  closeConfirm() {
    notification.close('confirm-validate')
  }

  async confirmValidate(id, updateMalla) {
    await saveDDAValidatedPromise(id, updateMalla)
    notification.close('confirm-validate')
    this.init(id)
  }

  async saveValidated (id, mensaje, updateMalla) {
    const { t } = this.props
    let btn =
        <div className="message-buttons-confirm">
          <Button type="ghost" onClick={ this.closeConfirm.bind(this) }>{ t('messages.aml.btnClose') }</Button>&nbsp;
          <Button type="primary" onClick={ () => this.confirmValidate(id, updateMalla) }>{ t('messages.aml.accept') }</Button>
        </div>
    notification.info({
      key: 'confirm-validate',
      message: t('messages.aml.confirm'),
      description: mensaje,
      duration: 10,
      btn
    })
  }

  async exportTree() {
    const { record } = this.props
    await ReportService.read('/exportPropietarios/'+record.id, null, null, 'propietarios.txt')
  }

  async exportUbos() {
    const { record } = this.props
    await ReportService.read('/exportUBOS/'+record.id, null, null, 'ubos.txt')
  }

  openCertificate() {
    const { record, currentUser } = this.props
    window.open(apiConfig.url + '/../ubo/pdfUF?idPj='+record.id+'&userId='+currentUser.id)
  }

  render() {
    const { t, currentUser } = this.props
    const { record, details, isModalUbosVisible, tree, loadingTree, parameters, loading } = this.state

    const mallaTableColumns = [
      {
        title: t('messages.aml.rut'),
        dataIndex: 'rut',
        render: (text, record) => {
          if(record.pais === 'NACIONAL') {
            return text
          }
        }
      },
      {
        title: t('messages.aml.name'),
        dataIndex: 'name',
        render: (text) => camelizerHelper(text),
        sorter: (a, b) => a.name.localeCompare(b.name)
      },
      {
        title: t('messages.aml.participation'),
        dataIndex: 'participacionDirecta',
        render: (text) => {
          if (text !== null) {
            return (Math.round(text * 100)/100) + '%'
          }
        },
        sorter: (a, b) => a.participacionDirecta - b.participacionDirecta
      },
      {
        title: t('messages.aml.citizenship'),
        dataIndex: 'nacionalidad',
        render: (text) => camelizerHelper(text)
      },
      {
        title: 'UBO',
        dataIndex: 'ubo',
        render: (text) => text ? 'Si' : 'No'
      },
      {
        title: t('messages.aml.differences'),
        dataIndex: 'error',
        whiteSpace: 'nowrap',
        render: (error) => {
          if(error !== undefined && error !== null) {
            return {
                props: {
                  className: 'error-' + error.code,   // there it is!
                },
                children: <div className="nowrap">{ error.message }</div>
            }
          }
        }
      }
    ]

    const formTableColumns = [
      {
        title: t('messages.aml.rut'),
        dataIndex: 'rut'
      },
      {
        title: t('messages.aml.name'),
        dataIndex: 'nombre',
        render: (text) => camelizerHelper(text),
        sorter: (a, b) => a.nombre.localeCompare(b.nombre)
      },
      {
        title: t('messages.aml.participation'),
        dataIndex: 'participacion',
        render: (text) => {
          if (text !== null) {
            return (Math.round(text * 100)/100) + '%'
          }
        },
        sorter: (a, b) => a.participacion - b.participacion
      },
      {
        title: t('messages.aml.title.country'),
        dataIndex: 'pais'
      },
      {
        title: t('messages.aml.title.city'),
        dataIndex: 'ciudad',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.address'),
        dataIndex: 'direccion',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.differences'),
        dataIndex: 'error',
        whiteSpace: 'nowrap',
        render: (error) => {
          if(error !== undefined && error !== null) {
            return {
                props: {
                  className: 'error-' + error.code,   // there it is!
                },
                children: <div className="nowrap">{ error.message }</div>
            }
          }
        }
      }
    ]

    const tableColumnsTree = [
      {
        title: t('messages.aml.rut'),
        dataIndex: 'rut',
        render: (text, record) => {
          return {
              props: {
                className: 'entity-type-'+record.type,   // there it is!
              },
              children: text
          }
        }
      },
      {
        title: t('messages.aml.name'),
        dataIndex: 'nombre',
        render: (text, record) => {
          return {
              props: {
                className: 'entity-type-'+record.type,   // there it is!
              },
              children: camelizerHelper(text)
          }
        },
        sorter: (a, b) => a.nombre.localeCompare(b.nombre)
      },
      {
        title: t('messages.aml.percent'),
        dataIndex: 'porcentaje',
        render: (text) => {
          if (text !== null) {
            return (Math.round(text * 100)/100) + '%'
          }
        },
        sorter: (a, b) => a.porcentaje - b.porcentaje
      },
      {
        title: t('messages.aml.type'),
        dataIndex: 'tipo',
        render: (text) => camelizerHelper(text)
      }
    ]

    const tableColumnsUbos = [
      {
        title: t('messages.aml.rut'),
        dataIndex: 'ubo.rut',
        render: (text, record) => {
          if(record.ubo.pais === 'NACIONAL') {
            return text
          }
        }
      },
      {
        title: t('messages.aml.name'),
        dataIndex: 'ubo.name',
        render: (text) => camelizerHelper(text),
        sorter: (a, b) => a.ubo.name.localeCompare(b.ubo.name)
      },
      {
        title: t('messages.aml.national'),
        dataIndex: 'ubo.pais',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.participation'),
        dataIndex: 'participacion',
        render: (text) => {
          if(text !== null) {
            return (Math.round(text * 100)/100) + '%'
          }
        },
        sorter: (a, b) => a.participacion - b.participacion
      },
      {
        title: 'Pactos',
        dataIndex: 'pactos',
        render: (pactos) => {
          if(pactos !== null) {

          }
        }
      },
      {
        title: 'UBO',
        dataIndex: 'ubo',
        render: (ubo) => ubo ? 'Sí' : 'No',
        sorter: (a, b) => a.ubo === b.ubo ? 0 : 1
      }
    ]

    return (
      <div id="div-modal-ubos">
        { loading ?
          <Spin spinning={ true } size="large" />
          :
          <>
            <Row>
              <Col xs={24}>
                <h2>{ camelizerHelper(record.nombre) }</h2>
                <h3>{ record.rut }</h3>
              </Col>
            </Row>
            <Row>
              <Col xs={24}>
                <div className="monitoreo">
                  { record.form !== null && record.form.plazoStatus !== null ?
                    <div className={'onboarding risk-' + record.form.plazoStatus} />
                    :
                    <div className="onboarding risk-GRAY" />
                  }
                  { record.form !== null && record.form.verifStatus !== null ?
                    <div className={'onboarding risk-' + record.form.verifStatus} />
                    :
                    <div className="onboarding risk-GRAY" />
                  }
                  { record.amlStatus !== null ?
                    <div className={'onboarding risk-' + record.amlStatus} />
                    :
                    <div className="onboarding risk-GRAY" />
                  }
                </div>
              </Col>
            </Row>

            <h3 className="title-section">{ t('messages.aml.ubofinder.generalData') }</h3>
            <Descriptions layout="vertical" size="small" column={6} bordered>
              <Descriptions.Item label={ t('messages.aml.registerDate') }>
                { record.dateShortAsString }
              </Descriptions.Item>
              <Descriptions.Item label={ t('messages.aml.repLegal') }>
                { record.nombreRep }
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                { record.email }
              </Descriptions.Item>
              <Descriptions.Item label={ t('messages.aml.sendMail') }>
                { record.formularioInterno === true ? 'No' : 'Si' }
              </Descriptions.Item>
              <Descriptions.Item label="Celular">
                { record.telefono }
              </Descriptions.Item>
              <Descriptions.Item label={ t('messages.aml.status') }>
                { record.status }
              </Descriptions.Item>
              <Descriptions.Item label={ t('messages.aml.options') } span={6}>
                <div className="btn-actions-form">
                  <Button type="primary" icon="file-pdf" onClick={ this.openCertificate.bind(this) }>{ t('messages.aml.certificate') }</Button>
                </div>
              </Descriptions.Item>
            </Descriptions>

            <h3 className="title-section">{ t('messages.aml.ownershipTree') }</h3>
            <Descriptions layout="vertical" size="small" column={3} bordered>
              <Descriptions.Item label={ t('messages.aml.status') }>
                { t('messages.aml.malla.'+record.ddaStatus) }
              </Descriptions.Item>
              <Descriptions.Item label={ t('messages.aml.date') }>
                { record.strDdaDate }
              </Descriptions.Item>
              <Descriptions.Item label={ t('messages.aml.ownershipTree') }>
                { record.ddaStatus === 'ENTREGADO' &&
                  <Button icon="profile" size="small" onClick={ this.handleViewUbos.bind(this) } />
                }
              </Descriptions.Item>
              <Descriptions.Item label={ t('messages.aml.finalBeneficiaries') } span={3} className="table-cell">
                { details.entity !== null && details.entity.propietarios !== undefined && details.entity.propietarios !== null && details.entity.propietarios.length > 0 ?
                    <Table dataSource={ this.getMallaPropiedad(details.entity.propietarios) } columns={ mallaTableColumns } pagination={ true } size='small' />
                    :
                    <>
                    { record.ddaStatus === 'ENTREGADO' ?
                      <h3 className="no-info-red">{ t('messages.aml.noInfoPossibleAboutFinalBeneficiaries') }</h3>
                      :
                      <h3 className="no-info">{ t('messages.aml.noInfoAboutFinalBeneficiaries') }</h3>
                    }
                    </>
                }
              </Descriptions.Item>
            </Descriptions>

            { parameters !== null && parameters.ubofinder !== null && parameters.ubofinder.sinFormulario === false &&
              <>
                <h3 className="title-section">{ t('messages.aml.ubofinder.form') }</h3>
                <Descriptions layout="vertical" size="small" column={7} bordered>
                  <Descriptions.Item label={ t('messages.aml.status') }>
                    { record.form !== null &&
                        record.form.status
                    }
                  </Descriptions.Item>
                  <Descriptions.Item label={ t('messages.aml.shippingDate') }>
                    { record.form !== null &&
                      record.form.strFecEnvio
                    }
                  </Descriptions.Item>
                  <Descriptions.Item label={ t('messages.aml.receiveDate') }>
                    { record.form !== null &&
                      record.form.strFecRecibido
                    }
                  </Descriptions.Item>
                  <Descriptions.Item label={ t('messages.aml.deadlineDate') }>
                    { record.form !== null &&
                      record.form.strShortFecPlazo
                    }
                  </Descriptions.Item>
                  <Descriptions.Item label={ t('messages.aml.warningDays') }>
                    { record.alerta }
                  </Descriptions.Item>
                  <Descriptions.Item label={ t('messages.aml.termDays') }>
                    { record.plazo }
                  </Descriptions.Item>
                  <Descriptions.Item>
                      {record.form !== null && (record.form.status === 'RECIBIDO' || record.form.status === 'VALIDADO' || record.form.version > 1) &&
                      <Button icon="file-pdf" size="small" onClick={this.openPdfForm.bind(this)}/>
                      }
                  </Descriptions.Item>
                  { currentUser.type !== 'AUDIT' && (record.form === null || record.form.status !== 'VALIDADO') &&
                    <Descriptions.Item label={ t('messages.aml.options') } span={7}>
                      <div className="btn-actions-form">
                        { record.form !== null && parameters.ubofinder.formularioInterno === true &&
                            <Button type="primary" icon="form" onClick={ this.completeForm.bind(this) }>{ t('messages.aml.ubofinder.completeForm') }</Button>
                        }
                        <Button type="primary" icon="mail" onClick={ this.sendForm.bind(this) }>{ t('messages.aml.ubofinder.sendForm') }</Button>
                        { (record.form !== null && record.form.status === 'RECIBIDO') &&
                          <Button type="primary" icon="check-square" onClick={ this.validateForm.bind(this) }>{ t('messages.aml.ubofinder.validateForm') }</Button>
                        }
                      </div>
                    </Descriptions.Item>
                  }
                  <Descriptions.Item label={ t('messages.aml.finalBeneficiaries') } span={7} className="table-cell">
                    { details.ubosForm !== undefined && details.ubosForm !== null && details.ubosForm.length > 0 ?
                      <Table dataSource={ details.ubosForm } columns={ formTableColumns } pagination={ true } size='small' />
                      :
                      <h3 className="no-info">{ t('messages.aml.noInfoAboutFinalBeneficiaries') }</h3>
                    }
                  </Descriptions.Item>
                </Descriptions>
              </>
            }
            { record.ddaStatus === 'ENTREGADO' &&
              <Modal
                title={ t('messages.aml.ownershipTree') }
                visible={ isModalUbosVisible }
                onCancel={ this.handleOnCancelModalUbos.bind(this) }
                width={ 900 }
                className="modal-tree"
                footer={ [
                  <Button onClick={ this.handleOnCancelModalUbos.bind(this) }>{ t('messages.aml.btnClose') }</Button>
                ] }
                >
                { loadingTree ?
                  <Spin spinning={ true } size="large" />
                  :
                  <Tabs type="card">
                    <TabPane tab={ t('messages.aml.ownershipTree') } key="1">
                      <Button icon="file-text" style={{float: 'right', marginBottom: '5px'}} onClick={ this.exportTree.bind(this) }>{ t('messages.aml.export') }</Button>
                      <br/><br/>
                      <Table columns={ tableColumnsTree } dataSource={ this.getDataTree(tree.propietarios, 0) } size="small" pagination={ false } />
                    </TabPane>
                    <TabPane tab={ t('messages.aml.finalBeneficiaries') } key="2">
                      <Button icon="file-text" style={{float: 'right', marginBottom: '5px'}} onClick={ this.exportUbos.bind(this) }>{ t('messages.aml.export') }</Button>
                      <br/><br/>
                      <Table columns={ tableColumnsUbos } dataSource={ tree.ubos } size="small" pagination={ true } />
                    </TabPane>
                  </Tabs>
                }
              </Modal>
            }
          </>
        }
      </div>
    )
  }
}

export default withTranslation()(ModalUbos)
