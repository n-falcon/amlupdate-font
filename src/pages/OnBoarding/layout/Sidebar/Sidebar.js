import './Sidebar.scss'
import React from 'react'
import { Col, Icon } from 'antd'
import iconMessages from './icon-message.png'
import iconNetwork from './icon-network.png'
import iconAlert from './icon-alert.png'
import iconSettings from './icon-settings.png'
import { useTranslation } from 'react-i18next';

const Sidebar = ({ currentUser, activeTab, onTabChange, categories }) => {
	const {t} = useTranslation()

	return (
		<Col className="sidebar" span={ 5 }>
			<div className="sidebar-inner">
				<div className="menu-block">
					<ul>
						<li className={ activeTab === 'tab-dashboard' ? 'active' : '' } onClick={ () => onTabChange('tab-dashboard') }>

							<div className="menu-item-inner">
								<Icon type="dashboard" className="option"/>Dashboard
								<Icon type="check" />
							</div>
						</li>
						<li className={ activeTab === 'tab-solicitudes' ? 'active' : '' } onClick={ () => onTabChange('tab-solicitudes') }>
							<div className="menu-item-inner">
								<Icon type="mail" className="option"/>Solicitudes
								<Icon type="check" />
							</div>
						</li>
						<li className={ activeTab === 'tab-forms' ? 'active' : '' } onClick={ () => onTabChange('tab-forms') }>
							<div className="menu-item-inner">
								<Icon type="form" className="option"/>Gestión de Formularios
								<Icon type="check" />
							</div>
						</li>
						<li className={ activeTab === 'tab-clientData' ? 'active' : '' } onClick={ () => onTabChange('tab-clientData') }>
							<div className="menu-item-inner">
								<Icon type="user" className="option"/>Ficha Cliente
								<Icon type="check" />
							</div>
						</li>
						<li className={ activeTab === 'tab-reporting' ? 'active' : '' } onClick={ () => onTabChange('tab-reporting') }>
							<div className="menu-item-inner">
								<Icon type="file-excel" className="option"/>Reporting
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
