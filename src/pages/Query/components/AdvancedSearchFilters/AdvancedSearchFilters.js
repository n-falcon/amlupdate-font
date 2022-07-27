import './AdvancedSearchFilters.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Radio, Row } from 'antd'

export default ({ defaultValues, onChangeTypeHandler, onChangeSearchHandler }) => {
  const { t } = useTranslation()

  return (
    <div className='query-filters'>
      <div className="filters-inner">
        <Row>
          <Col xs={6}>
            <label className="default" for="query-type">{ t('messages.aml.registerTypes') } : </label>
            <Radio.Group id="query-type" defaultValue={ defaultValues.queryFiltersPersonType } value={ defaultValues.queryFiltersPersonType } buttonStyle="solid" onChange={ onChangeTypeHandler } size='small'>
              <Radio.Button value="Person">{ t('messages.aml.person') }</Radio.Button>
              <Radio.Button value="Entity">{ t('messages.aml.entity') }</Radio.Button>
              <Radio.Button value="">{ t('messages.aml.both') }</Radio.Button>
            </Radio.Group>
          </Col>
          <Col xs={6}>
            <label className="default" for="query-scope">{ t('messages.aml.queryScope') } : </label>
            <Radio.Group id="query-scope" defaultValue={ defaultValues.queryFiltersSearchScope } value={ defaultValues.queryFiltersSearchScope } buttonStyle="solid" onChange={ onChangeSearchHandler } size='small'>
              <Radio.Button value="fuzzy">{ t('messages.aml.wide') }</Radio.Button>
              <Radio.Button value="near">{ t('messages.aml.close') }</Radio.Button>
              <Radio.Button value="exact">{ t('messages.aml.exact') }</Radio.Button>
            </Radio.Group>
          </Col>
          <Col xs={6}></Col>
          <Col xs={6}></Col>
        </Row>
      </div>
    </div>
  )
}
