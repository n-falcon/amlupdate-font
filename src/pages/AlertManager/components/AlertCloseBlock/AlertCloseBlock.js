import './AlertCloseBlock.scss'
import React, { useEffect, useState } from 'react'
import { Button, Col, Icon, Input, notification, Row, Switch, Upload } from 'antd'
// import imgUpload from './drag-icon.png'
import { useTranslation } from 'react-i18next'
import { alertClosePromise } from './promises'

const AlertCloseBlock = ({ alert, falsosPositivos, refreshHandler}) => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [shortDescription, setShortDescription] = useState(null)
  const [comms, setComms] = useState(null)
  const [changes, setChanges] = useState(0)
  const [tmpFilesList, setTmpFilesList] = useState([])
  const { TextArea } = Input;
  const { t } = useTranslation()

  useEffect(() => {
  }, [alert])

  const handleAddChange = () => {
    setChanges(oldChanges => {
      const newNumber = oldChanges + 1
      return newNumber
    })
  }

  const propsUpload = {
    //accept: ".pdf, .png",
    onRemove: file => {
      setTmpFilesList(oldTmpFilesList => {
        const index = oldTmpFilesList.indexOf(file)
        const newTmpFilesList = oldTmpFilesList.slice()
        newTmpFilesList.splice(index, 1)
        return newTmpFilesList
      })
    },
    beforeUpload: file => {
      if (file.size > (5 * 1024*1024)) {
        notification['error']({
          message: "Máx. tamaño permitido",
          description: "No se pueden cargar archivos de mas de 5MB"
        })
      }else if(tmpFilesList.length > 2 ) {
        notification['error']({
          message: "Máx. Archivos alcanzado",
          description: "No se pueden cargar más de 3 archivos"
        })
      }else {
        setTmpFilesList(oldTmpFilesList => [...oldTmpFilesList, file])
      }
      return false
    },
    multiple: false,
    listType: 'picture',
    fileList: tmpFilesList,
    className: 'upload-list-inline'
  }

  const handleShortDescriptionChange = async (value) => {
    await setShortDescription(value)
    handleAddChange()
  }

  const handleCommentsChange = async (value) => {
    setComms(value)
    handleAddChange()
  }

  const handleActionSave = () => {
    if(alert.estadoFP === 'PENDIENTE' && falsosPositivos.length > 0) {
      notification.warn({
        message: 'Se deben resolver las coincidencias por Nombre'
      })
    }else if(shortDescription === null || shortDescription ===''){
      notification['error']({
        message: t('messages.aml.requestedField'),
        description: "El campo 'Descripción corta' es obligatorio"
      })
    }else if (tmpFilesList.indexOf > 3){
      notification['error']({
        message: t('messages.aml.requestedField'),
        description: "El campo 'Descripción corta' es obligatorio"
      })
    }else {
      const formData = new FormData()
      tmpFilesList.forEach(file => {
        formData.append('file', file)
      })
      formData.append('action', "CLOSE")
      formData.append('shortDescription', shortDescription)
      if(comms) formData.append('comments', comms)
      alertClosePromise(alert.id, formData)
        .then(response => {
          notification['success']({
            "message": "Operación Exitosa",
            "description": "La asignación ha sido guardada exitosamente"
          })
          setChanges(0)
          refreshHandler()
        })
    }
  }

  return (
    <div className="alert-assign-block block">
      <div className="block-title">
        <Icon type="forward" />
        <h3>{ t('messages.aml.request.CLOSE_AUTO_ALERT') }</h3>
        <Switch size="small" onChange={ value => setIsEnabled(value) } />
        { changes > 0 && <Button type="primary" size="small" icon="save" className="save-button" onClick={ handleActionSave }>Cerrar Alerta</Button> }
      </div>
      <div className={ isEnabled ? "block-content show " : "block-content hide "}>
        <div className="alert">
          <Row>
            <Col span={24}>
              <label>{ t('messages.aml.shortDescription') }</label>
              <Input size="small" onChange={ (e) => handleShortDescriptionChange(e.target.value) } value={ shortDescription } maxLength={255} />
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ paddingBottom: '0 !important' }}>
              <TextArea placeholder={ t('messages.aml.comments') } value={comms} onChange={ (e) => handleCommentsChange(e.target.value) } maxLength={2000}>{ comms }</TextArea>
            </Col>
          </Row>
          <Row>
            <Col>
            <Upload {...propsUpload}>
              <Button>
                <Icon type="upload" /> Cargar archivos
              </Button>
            </Upload>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}

export default AlertCloseBlock
