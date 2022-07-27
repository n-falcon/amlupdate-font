import './SearchBox2.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Input, Button } from 'antd'


export default ({ currentQuery, onChange, onSearch, loading }) => {
  const { t } = useTranslation()

  return (
    <div id="searchbox">
      <div class="inputSearch">
        <Input placeholder={t('messages.aml.enterRutNumber')} onChange={onChange} value={currentQuery} onPressEnter={onSearch} allowClear style={{width: 500}}/>
      </div>
      <div class="searchBtn" >
        <Button icon={loading ? 'loading' : null} type="primary" disabled={loading}  onClick={onSearch} style={{width: 350}}>Solicitar Certificado</Button>
      </div>
    </div>
  )
}

