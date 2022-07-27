import './Navigation.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Icon, Menu } from 'antd'

export default ({ currentUser }) => {
  const { t } = useTranslation()

  return (
    <Menu
      className="navigation"
      theme="light"
      mode="horizontal"
      >
      <Menu.Item id="home-button">
        <Icon type='home' />{ t('messages.aml.homePageTitle') }
        <Link to={ '/' } />
      </Menu.Item>
      { currentUser.cliente.planHist !== null && currentUser.cliente.modules.includes('CONSULTA') && currentUser.modules !== null && currentUser.modules.includes('CONSULTA') &&
      <Menu.Item id="query-button">
        <Icon type='file-search' />{ t('messages.aml.queryPageTitle') }
        <Link to={ '/consulta' } />
      </Menu.Item>
      }
      { currentUser.cliente.planHist !== null && currentUser.cliente.modules.includes('CONSULTA2') && currentUser.modules !== null &&
      <Menu.Item id="query-button2">
        <Icon type='file-search' />Certificados UAF
        <Link to={ '/consulta2' } />
      </Menu.Item>
      }
      { currentUser.cliente.planBatch !== null && currentUser.cliente.planBatch.tipo === 'ABIERTO' && currentUser.cliente.modules.includes('BATCH') && currentUser.modules !== null && currentUser.modules.includes('BATCH') &&
        <Menu.Item id="batch-button">
          <Icon type='coffee' />{ t('messages.aml.batchProcesses') }
          <Link to={ '/masivos' } />
        </Menu.Item>
      }
      { currentUser.cliente.modules.includes('QUIEBRA') && currentUser.modules !== null && currentUser.modules.includes('QUIEBRA') &&
        <Menu.Item id="quiebra-button">
          <Icon type='warning' />{ t('messages.aml.quiebras') }
          <Link to={ '/quiebras' } />
        </Menu.Item>
      }
      { currentUser.cliente.modules.includes('REGISTRO') && currentUser.modules !== null && currentUser.modules.includes('REGISTRO') &&
        <Menu.Item id="register-button">
          <Icon type='user-add' />{ t('messages.aml.registerPageTitle') }
          <Link to={ '/registro' } />
        </Menu.Item>
      }
			{
				((currentUser.cliente.modules.includes('CDI-MATCH') || currentUser.cliente.modules.includes('CDI-FORM'))
          && currentUser.modules !== null && (currentUser.modules.includes('CDI-MATCH') || currentUser.modules.includes('CDI-FORM'))) &&
					<Menu.Item id="conflicts-button">
						<Icon type='branches' /> Conflictos de Interés
						<Link to={ '/conflictos-de-interes' } />
					</Menu.Item>
			}
      { currentUser.cliente.modules.includes('MONITOR') && (currentUser.modules !== null && currentUser.modules.includes('MONITOR')) &&
        <Menu.Item id="monitoring-button">
          <Icon type='safety' /> {t('messages.aml.monitoring')}
          <Link to={ '/monitoreo' } />
        </Menu.Item>
      }
      { currentUser.cliente.modules.includes('ONBOARDING') && (currentUser.modules !== null && currentUser.modules.includes('ONBOARDING')) &&
        <Menu.Item id="onboarding-button">
          <Icon type='form' /> OnBoarding
          <Link to={ '/onboarding' } />
        </Menu.Item>
      }

    </Menu>
  )
}
