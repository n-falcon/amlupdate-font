import './TopBar.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Icon } from 'antd'
import { QuerySearchBox } from '../../components'

export default ({ addRegister, onSearch, onClickAddToClient, onClickReport, isLoadingReport }) => {
  const { t } = useTranslation()

  return (
    <div className="topbar">
      <Button disabled={isLoadingReport} className="download-report-button" type="primary" onClick={ onClickReport } >
        <Icon type={ isLoadingReport ? 'loading': 'file-pdf' }/>
        { t('messages.aml.viewPdf') }
      </Button>&nbsp;
      { addRegister === true &&
        <Button className="add-button" type="primary" onClick={ onClickAddToClient }><Icon type="plus" /> { t('messages.aml.addToClientsList') }</Button>
      }
      <QuerySearchBox  onSearch={ onSearch } />
    </div>
  )
}
