import './AdvancedSearchToggleButton.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'

export default ({ onChangeHandler }) => {
  const { t } = useTranslation()

  return (
    <div className="advanced-search">
      <Button onClick={ onChangeHandler } ghost icon="filter">{ t('messages.aml.advancedSearch') }</Button>
    </div>
  )
}
