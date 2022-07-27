import './Breadcrumbs.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { Icon } from 'antd'
import { camelizerHelper } from '../../../../helpers/'

export default ({ className, items }) => {
  const { t } = useTranslation()

  const renderBreadcrumbs = (items) => {
    if (items !== undefined) {
      const breadcrumbsItems = []

      for (let i = 0; i < items.length; i++) {
        breadcrumbsItems.push(
          <li key={ i } className="breadcumbs-item">
            <Icon type={ items[i].icon } />
            <NavLink to={ items[i].link } onClick={items[i].onClick !== undefined ? items[i].onClick : null}>
              { items[i].icon === 'user' ? <div className="camelized-name">{ camelizerHelper(items[i].title) }</div> : items[i].title }
            </NavLink>
          </li>
        )
      }

      return breadcrumbsItems
    }
  }

  return (
    <div className={ 'breadcrumbs' + (className ? ' ' + className : '') }>
      <ul className="breadcumbs-items">
        <li className="breadcumbs-item">
          <Icon type="home" />
          <NavLink to="/">
            { t('messages.aml.home') }
          </NavLink>
        </li>
        { renderBreadcrumbs(items).map(item => item) }
      </ul>
    </div>
  )
}
