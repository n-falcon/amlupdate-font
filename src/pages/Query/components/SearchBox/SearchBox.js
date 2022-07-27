import './SearchBox.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from 'antd'

const { Search } = Input

export default ({ currentQuery, onChange, onSearch }) => {
  const { t } = useTranslation()

  return (
    <div id="searchbox">
      <Search placeholder={ t('messages.aml.enterNameOrRut') } onChange={ onChange } onSearch={ onSearch } value={ currentQuery } allowClear enterButton />
    </div>
  )
}
