import './ModalAddBatchFile.scss'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, Icon, Row, Select, Upload, Switch } from 'antd'
import imgUpload from './drag-icon.png'
import imgNewFile from './new-file.png'
import apiConfig from '../../../../config/api'

const ModalAddBatchFile = ({ currentUser, isUploading, uploadHandler }) => {
  const { t } = useTranslation()
  const { Dragger } = Upload
  const { Option } = Select

  const [tmpFilesList, setTmpFilesList] = useState([])
  const [searchRecordType, setSearchRecordType] = useState(null)
  const [searchScope, setSearchScope] = useState('near')
  const [databases, setDatabases] = useState([])
  const [databasesSel, setDatabasesSel] = useState([])

  useEffect(() => {
    let db = []
    if(currentUser.modules.includes("PEP") && currentUser.cliente.modules.includes("PEP")) db.push("PEP")
    if(currentUser.modules.includes("PEPH") && currentUser.cliente.modules.includes("PEPH")) db.push("PEPH")
    if(currentUser.modules.includes("PEPC") && currentUser.cliente.modules.includes("PEPC")) db.push("PEPC")
    if(currentUser.modules.includes("PERSON") && currentUser.cliente.modules.includes("PERSON")) db.push("PERSON")
    if(currentUser.modules.includes("PJUD") && (currentUser.cliente.modules.includes("PJUD-CIVIL")
          || currentUser.cliente.modules.includes("PJUD-PENAL") || currentUser.cliente.modules.includes("PJUD-LAB")
          || currentUser.cliente.modules.includes("PJUD-COB") || currentUser.cliente.modules.includes("PJUD-APE")
          || currentUser.cliente.modules.includes("PJUD-SUP")
    )) db.push("PJUD")
    if(currentUser.modules.includes("VIP") && currentUser.cliente.modules.includes("VIP")) db.push("VIP")
    if(currentUser.modules.includes("PFA") && currentUser.cliente.modules.includes("PFA")) db.push("PFA")
    if(currentUser.modules.includes("NEG") && currentUser.cliente.modules.includes("NEG")) db.push("NEG")

    setDatabases(db)
    setDatabasesSel(db)
  }, [])

  const propsUpload = {
    accept: ".txt",
    onRemove: file => {
      setTmpFilesList(oldTmpFilesList => {
        const index = oldTmpFilesList.indexOf(file)
        const newTmpFilesList = oldTmpFilesList.slice()

        newTmpFilesList.splice(index, 1)

        return newTmpFilesList
      })
    },
    beforeUpload: file => {
      if(tmpFilesList.length === 0) {
        setTmpFilesList(oldTmpFilesList => [...oldTmpFilesList, file])
      }

      return false
    },
    multiple: false,
    fileList: tmpFilesList,
  }

  const handleRemoveFile = () => {
    setTmpFilesList(oldTmpFilesList => {
      const newTmpFilesList = oldTmpFilesList.slice()

      newTmpFilesList.splice(0, 1)

      return newTmpFilesList
    })
  }

  const handleOnChangeSearchRecordType = (value) => {
    setSearchRecordType(value)
  }

  const handleOnChangeSearchScope = (value) => {
    setSearchScope(value)
  }

  const handleOnChangeModule = (key, checked) => {
    let modules = [ ...databasesSel]

    if (checked && !modules.includes(key)) {
      modules.push(key)
    }

    if (!checked && modules.includes(key)) {
      let index = modules.indexOf(key)
      modules.splice(index, 1)
    }
    setDatabasesSel(modules)
  }

  const downloadPlantilla = () => {
    window.open(apiConfig.url + '/../templates/consulta_masiva.txt', 'download')
  }

  return (
    <div className="modal-add-batch-file-content">
      { tmpFilesList.length === 0 ?
          <Dragger {...propsUpload}>
            <img src={ imgUpload } alt='' />
            <h3>{ t('messages.aml.clickHereOrDragText') }</h3>
          </Dragger>
        :
          <div className="tmp-files-list">
            {
              isUploading &&
                <div className="spinner">
                  <Icon type="loading" /> &nbsp;&nbsp;<span>{ t('messages.aml.uploadingFileToServer') }</span>
                </div>
            }

            <div className={ isUploading ? 'image-wrapper is-uploading' : 'image-wrapper' }>
              <img src={ imgNewFile } alt="" />
              <div className="remove" onClick={ handleRemoveFile }>
                <Icon type="close" />
              </div>
            </div>
            <div className="file-name">{ tmpFilesList[0].name }</div>
          </div>

      }
      <div className="params">
        <Row>
          {/*
          <Col xs={ 12 }>
            <div className="col-inner">
              <label>{ t('messages.aml.registerTypes') }</label>
              <Select placeholder="Seleccionar" onChange={ handleOnChangeSearchRecordType } disabled={ isUploading } defaultValue="">
                <Option value="Person">{ t('messages.aml.person') }</Option>
                <Option value="Entity">{ t('messages.aml.entity') }</Option>
                <Option value="">{ t('messages.aml.both') }</Option>
              </Select>
            </div>
          </Col>
          */}
          <Col xs={ 24 }>
            <div className="col-inner">
              <label>{ t('messages.aml.searchScope') }</label>
              <Select placeholder={ t('messages.aml.select') } onChange={ handleOnChangeSearchScope } disabled={ isUploading } value={searchScope}>
                <Option value="fuzzy">{ t('messages.aml.wide') }</Option>
                <Option value="near">{ t('messages.aml.near') }</Option>
                <Option value="exact">{ t('messages.aml.exact') }</Option>
              </Select>
            </div>
          </Col>
          <Col xs={ 24 }>
            <div className="col-inner">
              <label>{ t('messages.aml.databases') }</label>

              { databases.includes('PEP') &&
                <Col span={6} className="block-database">
                  <label>PEP</label>
                  <Switch onChange={(checked) => handleOnChangeModule('PEP', checked)} defaultChecked={databasesSel.includes('PEP')} />
                </Col>
              }
              { databases.includes('PEPH') &&
                <Col span={6} className="block-database">
                  <label>{t('messages.aml.modulesNames.pepHistorical')}</label>
                  <Switch onChange={(checked) => handleOnChangeModule('PEPH', checked)} defaultChecked={databasesSel.includes('PEPH')} />
                </Col>
              }
              { databases.includes('PEPC') &&
                <Col span={6} className="block-database">
                  <label>{t('messages.aml.candidates')}</label>
                  <Switch onChange={(checked) => handleOnChangeModule('PEPC', checked)} defaultChecked={databasesSel.includes('PEPC')} />
                </Col>
              }
              { databases.includes('PERSON') &&
                <Col span={6} className="block-database">
                  <label>{t('messages.aml.modulesNames.peopleInterest')}</label>
                  <Switch onChange={(checked) => handleOnChangeModule('PERSON', checked)} defaultChecked={databasesSel.includes('PERSON')} />
                </Col>
              }
              { databases.includes('PJUD') &&
                <Col span={6} className="block-database">
                  <label>{t('messages.aml.powerOfAttorney')}</label>
                  <Switch onChange={(checked) => handleOnChangeModule('PJUD', checked)} defaultChecked={databasesSel.includes('PJUD')} />
                </Col>
              }
              { databases.includes('VIP') &&
                <Col span={6} className="block-database">
                  <label>VIP</label>
                  <Switch onChange={(checked) => handleOnChangeModule('VIP', checked)} defaultChecked={databasesSel.includes('VIP')} />
                </Col>
              }
              { databases.includes('PFA') &&
                <Col span={6} className="block-database">
                  <label>{t('messages.aml.modulesNames.dowJonesRC')}</label>
                  <Switch onChange={(checked) => handleOnChangeModule('PFA', checked)} defaultChecked={databasesSel.includes('PFA')} />
                </Col>
              }
              { databases.includes('NEG') &&
                <Col span={6} className="block-database">
                  <label>{t('messages.aml.modulesNames.ownLists')}</label>
                  <Switch onChange={(checked) => handleOnChangeModule('NEG', checked)} defaultChecked={databasesSel.includes('NEG')} />
                </Col>
              }
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={ 24 }>
            <div className="col-inner save">
              <Button id="save" type="primary" disabled={ tmpFilesList.length === 0 || isUploading } onClick={ () => uploadHandler(tmpFilesList[0], searchRecordType, searchScope, databasesSel) }>{ t('messages.aml.save') }</Button>
              <div className="plantilla"><a onClick={() => downloadPlantilla('records')}>Plantilla</a></div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ModalAddBatchFile
