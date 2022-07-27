import './ResultsInfo.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default ({ totalResultsNum }) => {
  const { t } = useTranslation()

  return (
    <div className="results-info">
      <h3 className="query-results">{ t('messages.aml.weHaveFound')} { totalResultsNum } { t('messages.aml.result') }{ totalResultsNum > 0 && 's' } :</h3>
    </div>
  )
}
