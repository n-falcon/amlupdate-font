
import React,{useState, useEffect} from 'react'
import moment from 'moment'
import { Row, Col, Button, Select, message, notification, Spin, Modal, Divider } from 'antd'
import { sendBdRequestPromise } from '../../../../../../promises'
import { useTranslation } from 'react-i18next'

const ModalRequestOpt = ({type, recipients, category, handleCancel}) => {
  const { t } = useTranslation()
  const [period, setPeriod] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const Option = Select;
  const { confirm } = Modal;
  const today = moment().format('DD/MM/YYYY')

  const showConfirm = () => {
    if (type === 'cronForm') {
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
    }else{
      confirm({
        title: 'Confirmación',
        cancelText: 'Cancelar',
        content: "¿Quiere enviar el formulario a estas personas?",
      onOk() {
        handleSendRequest()
      },
      onCancel() {
      },
    });
    }
  }

  const handleSendRequest = () => {
    setIsLoading(true)
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
    }
    )
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
        :
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
