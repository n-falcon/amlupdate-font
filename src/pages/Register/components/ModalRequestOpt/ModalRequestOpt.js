
import React,{useState} from 'react'
import moment from 'moment'
import { Row, Col, Button, Select, message, Spin, Modal, Divider, notification} from 'antd'
import { sendBdRequestPromise } from '../../../OnBoarding/promises'
import { useTranslation } from 'react-i18next'

const ModalRequestOpt = ({type, recipients, category, handleCancel}) => {
  const { t } = useTranslation()
  const [period, setPeriod] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const Option = Select;
  const { confirm } = Modal;
  const today = moment().format('DD/MM/YYYY')

  const showConfirm = () => {
    switch (type) {
      case ('cronForm'):
        if(period){
          confirm({
            title: 'Confirmación',
            cancelText: 'Cancelar',
            content: "¿Quiere programar el envío "+t('messages.aml.onboarding.period.'+period)+" a estas personas?",
            onOk() {
              handleSendRequest()
            },
            onCancel() {
            },
          });
        }else {
          message.error('Seleccione un periodo')
        }
      break;
      case "newRequest":
        confirm({
          title: 'Confirmación',
          cancelText: 'Cancelar',
          content: "¿Quiere enviar el formulario Onboarding a estas personas?",
          onOk() {
            handleSendRequest()
          },
          onCancel() {
          },
        });
      break;
      case "brokeRegister":
        confirm({
          title: 'Confirmación',
          cancelText: 'Cancelar',
          content: "¿Quiere activar el registro de quiebras para estas personas?",
          onOk() {
            handleSendRequest()
          },
          onCancel() {
          },
        });
      break;
      case "uboFinder":
        confirm({
          title: 'Confirmación',
          cancelText: 'Cancelar',
          content: "¿Quiere activar la investigación UBO a estas personas?",
          onOk() {
            handleSendRequest()
          },
          onCancel() {
          },
        });
      break;
      case "form57":
        confirm({
          title: 'Confirmación',
          cancelText: 'Cancelar',
          content: "¿Quiere enviar el formulario de circular 57 a estas personas?",
          onOk() {
            handleSendRequest()
          },
          onCancel() {
          },
        });
      break;
      default:
      break;
    }
  }

  const handleSendRequest = () => {
    setIsLoading(true)
    if (type === 'cronForm' || type === 'newRequest') {

      sendBdRequestPromise({period, type, category, recipients: recipients.map((recipient) => recipient.id)}).then(results => {
          setIsLoading(false)
        if(results.status === 'OK' && recipients.length > 0) {
          if (type === 'newRequest'){
            message.success('Solicitud enviada con éxito')
          }else{
            message.success('Solicitud programada con éxito')
          }
            handleCancel();
        }else {
            notification.error({
            message: 'Error',
            description: recipients.length === 0 ? "Debe seleccionar destinatarios" : results.message
          })
        }
      })
    }else if (type === 'brokeRegister'){

    }else if (type === 'uboFinder'){

    }else if (type === 'form57'){

    }
  }

  return (
  isLoading ? 
    <Row>
      <Col span={24} style={{justifyContent: 'center', display: 'flex'}}>
        <Spin size="large" />
      </Col>
    </Row>
  :
    <div className="modal-remind-opt">
      {type === 'newRequest' ?
          <>
            <Row gutter={[0, 64]}>
              <Col>
                El sistema enviará automáticamente una nueva solicitud del formulario de Onboarding a las siguientes personas:
              </Col>
            </Row>
            <Row gutter={[0, 48]}>
              <Col>
                <ul>
                  {recipients.map((recipient) => {
                    return <li>{recipient.name}</li>
                  })}
                </ul>
              </Col>
            </Row>
          </>
        : type === 'cronForm' ?
        <>
          <Row gutter={[0, 24]}>
            <Col>
              A continuación seleccione el periodo de tiempo en el que se enviará la solicitud
            </Col>
          </Row>
          <Row gutter={[0, 24]}>
            <Col span={10} push={7}>
              <Select style={{width: '100%'}} onChange={(e) => setPeriod(e)}>
                <Option value="MONTHLY">{t('messages.aml.onboarding.period.MONTHLY')}</Option>
                <Option value="QUARTERLY">{t('messages.aml.onboarding.period.QUARTERLY')}</Option>
                <Option value="BIANNUAL">{t('messages.aml.onboarding.period.BIANNUAL')}</Option>
                <Option value="ANNUAL">{t('messages.aml.onboarding.period.ANNUAL')}</Option>
              </Select>
            </Col>
          </Row>
          <Row gutter={[0, 24]}>
            <Col span={24}>
              {"AMLupdate enviará automáticamente una solicitud vía correo electrónico, a partir de la fecha de hoy ("+today+"). Si requiere desactivar el envío periodico sólo debe ingresar a la ficha de cliente e inactivar el botón de periodicidad"}
            </Col>
          </Row>
        </>
        : type === 'brokeRegister' ?
          <>
              <Row gutter={[0, 64]}>
                <Col>
                  El sistema activará automáticamente el seguimiento de quiebras para las siguientes personas:
                </Col>
              </Row>
              <Row gutter={[0, 48]}>
                <Col>
                  <ul>
                    {recipients.map((recipient) => {
                      return <li>{recipient.name}</li>
                    })}
                  </ul>
                </Col>
              </Row>
            </>
        : type === 'uboFinder' ?
          <>
            <Row gutter={[0, 64]}>
              <Col>
                El sistema activará automáticamente la investigación de UBOs para las siguientes empresas:
              </Col>
            </Row>
            <Row gutter={[0, 48]}>
              <Col>
                <ul>
                  {recipients.map((recipient) => {
                    return <li>{recipient.name}</li>
                  })}
                </ul>
              </Col>
            </Row>
          </>
        : type === 'form57' ?
          <>
            <Row gutter={[0, 64]}>
              <Col>
                El sistema enviará automáticamente una solicitud del formulario de Circular 57 a las siguientes empresas:
              </Col>
            </Row>
            <Row gutter={[0, 48]}>
              <Col>
                <ul>
                  {recipients.map((recipient) => {
                    return <li>{recipient.name}</li>
                  })}
                </ul>
              </Col>
            </Row>
          </>
        : null
      }
      <Row>
        <Divider/>
        <Button style={{float: 'right'}} onClick={showConfirm}>
          Aceptar
        </Button>
      </Row>
    </div>
  )
}

export default ModalRequestOpt
