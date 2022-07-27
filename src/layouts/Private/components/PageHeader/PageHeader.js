import './PageHeader.scss'
import React from 'react'
import { Icon, Button } from 'antd'
import { useTranslation } from 'react-i18next'

export default ({ children, description, title, icon, hasAdvice, formAction }) => {
  const {t} = useTranslation();

 return (
  <div className="page-header">
    <div className="pageTitle">
      <figure className="page-icon">
        <Icon type={icon} />
      </figure>
      <h1 className="page-title">{title}</h1>
      <p className="page-description">{description}</p>
      {children}
    </div>
    {hasAdvice && 
    <div className="advice">
      <div className="adviceMsgContainer">
        <span className="adviceTitle">{t('messages.aml.adviseTitle')}</span>
        <span className="adviceMsg">{t('messages.aml.adviseDescription')}</span>
      </div>
      <div className="adviceButton">
        <Button type="primary" onClick={formAction}>{t('messages.aml.adviseButtonText')}</Button>
      </div>
    </div>
    }
  </div>
)
  
}
