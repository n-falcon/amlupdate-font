import './SearchFilters.scss'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { Button, Col, DatePicker, Form, Icon, Input, Row, Select } from 'antd'
import { getUsersPromise } from '../../promises'

const SearchFilters = ({ currentValues, fileNameHandler, form, fromDateHandler, optDatesHandler, toDateHandler, userHandler, applyHandler, clearHandler }) => {
  const { t } = useTranslation()
  const { Search } = Input
  const { getFieldDecorator } = form

  const [users, setUsers] = useState([])
  const [customDate, setCustomDate] = useState(false)

  useEffect(() => {
    handleGetUsers()
  }, [])

  const handleGetUsers = async () => {
    const users = await getUsersPromise()

    setUsers(users)
  }

  const handleOptDatesChange = (value) => {
    if (value === 'RANGE') {
      setCustomDate(true)
    } else {
      setCustomDate(false)
    }

    optDatesHandler(value)
  }

  const handleChangeFromDate = async (fromDate) => {
    const formatFromDate = moment(fromDate).format('DD-MM-YYYY')
    fromDateHandler(formatFromDate)
  }

  const handleChangeToDate = async (toDate) => {
    const formatToDate = moment(toDate).format('DD-MM-YYYY')
    toDateHandler(formatToDate)
  }

  const handleUserChange = (id) => {
    userHandler(id)
  }

  const handleClearFilters = () => {
    form.setFieldsValue({
      fileName: '',
      optDates: '',
      user: '',
      fromDate: '',
      toDate: ''
    })

    clearHandler()
  }

  return (
    <div className="search-filters">
      <Form id="batch-search-filters">
        <Row>
          <Col xs={ 12 }>
            <div className="col-inner">
              <label>{ t('messages.aml.fileName') } : </label>
              <Form.Item>
                {
                  getFieldDecorator('fileName')(
                    <Search onChange={ fileNameHandler } />
                  )
                }
              </Form.Item>
            </div>
          </Col>
          <Col xs={ 12 }>
            <div className="col-inner">
              <label>{ t('messages.aml.timeRange') } : </label>
              <Form.Item>
                {
                  getFieldDecorator('optDates')(
                    <Select style={{ width: '100%'}} onChange={ handleOptDatesChange } placeholder={ t('messages.aml.select') } allowClear>
                      <Select.Option value="ALL">[ { t('messages.aml.allTheDates') } ]</Select.Option>
                      <Select.Option value="TODAY">{ t('messages.aml.today') }</Select.Option>
                      <Select.Option value="WEEK">{ t('messages.aml.lastWeek') }</Select.Option>
                      <Select.Option value="MONTH">{ t('messages.aml.lastMonth') }</Select.Option>
                      <Select.Option value="3MONTH">{ t('messages.aml.last3Months') }</Select.Option>
                      <Select.Option value="RANGE">{ t('messages.aml.customRange') }</Select.Option>
                    </Select>
                  )
                }
              </Form.Item>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={ 12 }>
            <div className="col-inner">
              <label>{ t('messages.aml.user') } : </label>
              <Form.Item>
                {
                  getFieldDecorator('user')(
                    <Select style={{ width: '100%' }} onChange={ handleUserChange } placeholder={ t('messages.aml.select') } allowClear>
                      { users.map(user => <Select.Option value={ user.id }>{ user.name }</Select.Option>) }
                    </Select>
                  )
                }
              </Form.Item>
            </div>
          </Col>
          <Col xs={ 12 }>
            <div className="col-inner">
              <Row>
                <Col xs={ 12 }>
                  <div className="col-col-inner from">
                    <label>{ t('messages.aml.from') } : </label>
                    <Form.Item>
                      {
                        getFieldDecorator('fromDate')(
                          <DatePicker format="DD/MM/YYYY" onChange={ handleChangeFromDate } placeholder={ t('messages.aml.select') } disabled={ !customDate } style={{ width: '100%' }} allowClear />
                        )
                      }
                    </Form.Item>
                  </div>
                </Col>
                <Col xs={ 12 }>
                  <div className="col-col-inner to">
                    <label>{ t('messages.aml.to') } : </label>
                    <Form.Item>
                      {
                        getFieldDecorator('toDate')(
                          <DatePicker format="DD/MM/YYYY" onChange={ handleChangeToDate } placeholder={ t('messages.aml.select') } disabled={ !customDate } style={{ width: '100%' }} allowClear />
                        )
                      }
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={ 24 } style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={ applyHandler } htmlType="submit"><Icon type="check" /> { t('messages.aml.applyFilters') }</Button>
          <Button onClick={ clearHandler } onClick={ handleClearFilters } ghost><Icon type="stop" /> { t('messages.aml.clearFilters') }</Button>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default Form.create()(SearchFilters)
