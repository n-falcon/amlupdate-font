import './Sidebar.scss'
import React from 'react'
import { Col, Icon } from 'antd'
import iconMessages from './icon-message.png'
import iconNetwork from './icon-network.png'
import iconAlert from './icon-alert.png'
import iconSettings from './icon-settings.png'
import { useTranslation } from 'react-i18next';

const Sidebar = ({ currentUser, activeTab, onTabChange, categories, alertState }) => {
	const {t} = useTranslation()

	return (
		<Col className="sidebar" span={ 5 }>
			<div className="sidebar-inner">
				<div className="menu-block">
					<h3>{t("messages.aml.ControlPanel")}</h3>
						<ul>
							<li className={ activeTab === 'tab-indicators' ? 'active' : '' } onClick={ () => onTabChange('tab-indicators') }>
								<div className="menu-item-inner">
									{t("messages.aml.Indicators")}
									<Icon type="check" />
								</div>
							</li>
							<li className={ activeTab === 'tab-reports' ? 'active' : '' } onClick={ () => onTabChange('tab-reports') }>
								<div className="menu-item-inner">
									{t("messages.aml.Reports")}
									<Icon type="check" />
								</div>
							</li>
						</ul>
				</div>
						
				{categories.length > 0 &&
					<div className="menu-block">
						<h3>{/*<img src={ iconMessages } alt="" />*/}{t("messages.aml.OpenAlertsManagment")}</h3>
						<ul>
							{ categories.map((category) =>
								<li key = {category} className={ activeTab === 'tab-alerts-open-' + category ? 'active' : '' } onClick={ () => onTabChange('tab-alerts-open-'+category) }>
									<div className="menu-item-inner">
										{t('messages.aml.menu.category.' + category)}
										<Icon type="check" />
									</div>
								</li>
							)}
						</ul>
					</div>
				}

				{categories.length > 0 &&
					<div className="menu-block">
						<h3>{/*<img src={ iconMessages } alt="" />*/}{t("messages.aml.ClosedAlertsManagment")}</h3>
						<ul>
							{
							categories.map((category) =>
							<li key = {category} className={ activeTab === 'tab-alerts-close-' + category ? 'active' : '' } onClick={ () => onTabChange('tab-alerts-close-'+category) }>
								<div className="menu-item-inner">
									{t('messages.aml.menu.category.' + category)}
									<Icon type="check" />
								</div>
							</li>
							)}
						</ul>
					</div>
				}

				{categories.length > 0 &&
					<div className="menu-block">
						<h3>{/*<img src={ iconMessages } alt="" />*/}{t("messages.aml.MonitoringPerPerson")}</h3>
						<ul>
							{ categories.map((category) =>
								<li key={category} className={ activeTab === 'tab-monitoreo-' + category ? 'active' : '' } onClick={ () => onTabChange('tab-monitoreo-'+category) }>
									<div className="menu-item-inner">
										{t('messages.aml.menu.category.' + category)}
										<Icon type="check" />
									</div>
								</li>
							)}
						</ul>
					</div>
				}

			<div className="menu-block">
				<h3>{t("messages.aml.administrationPageTitle")}</h3>
				<ul>
					{ currentUser.cliente.oficialCto !== null && currentUser.cliente.oficialCto.id === currentUser.id &&
						<>
						<li className={ activeTab === 'tab-rules' ? 'active' : '' } onClick={ () => onTabChange('tab-rules') }>
							<div className="menu-item-inner">
								{t("messages.aml.RulesLibrary")}
								<Icon type="check" />
							</div>
						</li>
						{ currentUser.cliente.modules.includes("MONITOR-T") &&
						<li className={ activeTab === 'tab-simulator' ? 'active' : '' } onClick={ () => onTabChange('tab-simulator') }>
							<div className="menu-item-inner">
								{t("messages.aml.Simulator")}
								<Icon type="check" />
							</div>
						</li>
						}
						</>
					}
				<li className={ activeTab === 'tab-custom-alerts' ? 'active' : '' } onClick={ () => onTabChange('tab-custom-alerts') }>
					<div className="menu-item-inner">
						{t("messages.aml.customAlerts")}
						<Icon type="check" />
					</div>
				</li>
				</ul>
			</div>
		</div>
		</Col>
	)
}

export default Sidebar
