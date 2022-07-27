import './QuerySearchBox.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from 'antd'

export default ({ onSearch }) => {
  const { t } = useTranslation()

  return (
    <div className="query-search-box">
      <Input.Search placeholder={ t('messages.aml.newQuickQuery') } onSearch={ onSearch } />
      </div>
  )
}
