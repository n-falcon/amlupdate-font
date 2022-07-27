import './ResultsPerPageSelector.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Radio } from 'antd'

export default ({ value, onChange }) => {
  const { t } = useTranslation()

  return (
    <div id="results-per-page-selector" className="results-per-page-selector">
      { t('messages.aml.resultsPerPage') } : &nbsp;
      <Radio.Group value={ value } buttonStyle="solid" onChange={ onChange } size="small">
        <Radio.Button value="5">5</Radio.Button>
        <Radio.Button value="10">10</Radio.Button>
        <Radio.Button value="15">15</Radio.Button>
      </Radio.Group>
    </div>
  )
}
