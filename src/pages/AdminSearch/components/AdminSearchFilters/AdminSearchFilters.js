import './AdminSearchFilters.scss'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, DatePicker, Input, Radio, Row, Select, Switch, Modal } from 'antd'
import { UsersService } from '../../../../services'

const { Option } = Select

export default ({
  currentUser,
  defaultValues,
  onChangeDateHandler,
  onChangeDateFromHandler,
  onChangeDateToHandler,
  onChangeHasReportHandler,
  onChangeSearchHandler,
  onChangeModeHandler,
  onChangeSearchOutcomeHandler,
  onChangeSearchTypeIsRutHandler,
  onChangeUserHandler,
  onChangeTypeHandler,
  onClickRestoreFiltersHandler,
  onClickExportHandler,
  onSubmit
}) => {
  const [users, setUsers] = useState([])
  const [modules, setModules] = useState([])
  const [searchTypeIsRut, setSearchTypeIsRut] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    UsersService.read()
      .then(response => setUsers(response.data.records))
      .catch(err => console.log(err))
    if(currentUser.modules != null) {
      for(let i=0;i<currentUser.modules.length;i++) {
        let module = currentUser.modules[i]
        if(module === 'PEP' || module === 'PEPH' || module === 'PEPC' || module === 'PERSON' || module === 'PJUD' || module === 'VIP' || module === 'PFA' || module === 'NEG') {
          if(currentUser.cliente.modules.includes(module) ||
            (module === 'PJUD' && (currentUser.cliente.modules.includes('PJUD-PENAL') || currentUser.cliente.modules.includes('PJUD-CIVIL')
                                  || currentUser.cliente.modules.includes('PJUD-COB') || currentUser.cliente.modules.includes('PJUD-LAB')
                                  || currentUser.cliente.modules.includes('PJUD-APE') || currentUser.cliente.modules.includes('PJUD-SUP')
                                  ))
            ) {
            modules.push(module)
          }
        }
      }
    }
  }, [])

  const handleSearchTypeIsRutChange = (e) => {
    const value = e.target.value

    setSearchTypeIsRut(value)

    onChangeSearchTypeIsRutHandler(value)
  }

  const handleDateChange = (value) => {
    if (value === 'RANGE') {
      setIsModalVisible(true)
    } else {
      setIsModalVisible(false)
    }
    onChangeDateHandler(value)
  }

  const titleModule = (module) => {
    if(module === 'PEPH') return t('messages.aml.historicalPEPS')
    if(module === 'PERSON') return t('messages.aml.modulesNames.peopleInterest')
    if(module === 'PEPC') return t('messages.aml.candidates')
    if(module === 'PFA') return 'Dow Jones R&C'
    if(module === 'NEG') return t('messages.aml.modulesNames.ownLists')
    if(module === 'PJUD') return t('messages.aml.powerOfAttorney')
    return module
  }

  return (
    <div className='admin-search-filters'>
      <Row>
        <Col xs={6}>
          <div className="rut-name module">
            <Radio.Group value={ defaultValues.searchFiltersTypeIsRut } onChange={ handleSearchTypeIsRutChange }>
              <Radio value={ true }>{ t('messages.aml.rutNumber') }</Radio>
              <Radio value={ false }>{ t('messages.aml.name') }</Radio>
            </Radio.Group>
            <div className="module-inner">
              <Input placeholder={ searchTypeIsRut ? t('messages.aml.enterRutNumber') : t('messages.aml.enterName') } onChange={ onChangeSearchHandler } onSearch={ (e) => e.preventDefault() } value={ defaultValues.search } />
            </div>
          </div>
        </Col>
        <Col xs={4}>
          <div className="user module">
            { t('messages.aml.username') } :
            <div className="module-inner">
              <Select value={ defaultValues.searchFiltersUser } onChange={ onChangeUserHandler } style={{ width: '100%' }}>
                <Option value="">[ { t('messages.aml.allTheUsers') } ]</Option>
                { users.map(user => <Option value={ user.id }>{ user.name }</Option>) }
              </Select>
            </div>
          </div>
        </Col>
        <Col xs={6}>
          <div className="certificate module">
            Con certificado :
            <div className="module-inner">
              <Switch onChange={ onChangeHasReportHandler } checked={ defaultValues.searchFiltersHasReport } />
            </div>
          </div>
        </Col>
        <Col xs={8}>
          <div className="outcome module">
            Desenlace de las búsquedas :
            <div className="module-inner">
              <Radio.Group value={ defaultValues.searchFiltersOutcome } onChange={ onChangeSearchOutcomeHandler }>
                <Radio value="S">{ t('messages.aml.withResults') }</Radio>
                <Radio value="N">{ t('messages.aml.withoutResults') }</Radio>
                <Radio value="ALL">{ t('messages.aml.both')}</Radio>
              </Radio.Group>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <div className="type module">
            { t('messages.aml.module') } :
            <div className="module-inner">
              <Select value={ defaultValues.searchFiltersType } onChange={ onChangeTypeHandler } style={{ width: '100%' }}>
                <Option value={null}>[ { t('messages.aml.allModules') } ]</Option>
                { modules.map(module =>
                  <Option value={module}>{ titleModule(module) }</Option>
                )}
              </Select>
            </div>
          </div>
        </Col>
        <Col xs={4}>
          <div className="dates module">
            { t('messages.aml.dates') } :
            <div className="module-inner">
              <Select value={ defaultValues.searchFiltersDate } onChange={ handleDateChange } style={{ width: '100%' }}>
                <Option value="ALL">[ { t('messages.aml.allTheDates') } ]</Option>
                <Option value="TODAY">{ t('messages.aml.today') }</Option>
                <Option value="WEEK">{ t('messages.aml.lastWeek') }</Option>
                <Option value="MONTH">{ t('messages.aml.lastMonth') }</Option>
                <Option value="3MONTH">{ t('messages.aml.last3Months') }</Option>
                <Option value="RANGE">{ t('messages.aml.customRange') }</Option>
              </Select>
            </div>
          </div>
        </Col>
        <Col xs={6}>
          <div className="outcome module">
            Modo :
            <div className="module-inner">
              <Radio.Group key="2" value={ defaultValues.searchFiltersMode } onChange={ onChangeModeHandler }>
                <Radio value="ALL">{ t('messages.aml.all') }</Radio>
                <Radio value="ONLINE">{ t('messages.aml.online') }</Radio>
                <Radio value="BATCH">Batch</Radio>
              </Radio.Group>
            </div>
          </div>
        </Col>
        <Col xs={8}>
          <div className="submit module">
            <div className="module-inner">
              <Button type="primary" onClick={ onSubmit } icon="check">{ t('messages.aml.apply') }</Button>&nbsp;
              <Button type="primary" onClick={ onClickExportHandler } icon="file-excel">{ t('messages.aml.export') }</Button>&nbsp;
              <Button onClick={ onClickRestoreFiltersHandler } ghost icon="stop">{ t('messages.aml.restore') }</Button>
            </div>
          </div>
        </Col>
      </Row>

      <Modal visible={isModalVisible}
        onCancel={ () => setIsModalVisible(false) }
        footer={ [
          <Button onClick={ () => setIsModalVisible(false) }>{ t('messages.aml.btnClose') }</Button>
        ] }
        >
        <div className="date-pickers module">
          <Row>
            <Col xs={ 12 }>
              { t('messages.aml.fromDate') } :
              <div className="module-inner">
                <DatePicker format="DD/MM/YYYY" defaultValue={ defaultValues.searchFiltersDateFrom } onChange={ onChangeDateFromHandler } placeholder="Fecha desde" />
              </div>
            </Col>
            <Col xs={ 12 }>
              { t('messages.aml.toDate') } :
              <div className="module-inner">
                <DatePicker format="DD/MM/YYYY" defaultValue={ defaultValues.searchFiltersDateTo } onChange={ onChangeDateToHandler } placeholder="Fecha hasta" />
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  )
}
