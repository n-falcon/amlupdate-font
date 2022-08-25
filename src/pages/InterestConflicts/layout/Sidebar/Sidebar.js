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
				{categories.length > 0 &&
					((currentUser.cliente.modules.includes('CDI-MATCH') && currentUser.modules.includes('CDI-MATCH'))
					 	|| (currentUser.cliente.modules.includes('CDI-FORM') && currentUser.modules.includes('CDI-FORM') && currentUser.modules.includes('CDI-FORM-PC'))
					) &&
					<div className="menu-block">
						<h3>{/*<img src={ iconMessages } alt="" />*/}Gestión por Registro</h3>
						<ul>
							{ categories.map((category) => <>
								{ ((currentUser.cliente.modules.includes('CDI-MATCH') && currentUser.modules.includes('CDI-MATCH'))
									|| (currentUser.cliente.modules.includes('CDI-FORM') && currentUser.modules.includes('CDI-FORM') && currentUser.modules.includes('CDI-FORM-PC') && (category === 'COLABORADOR' || category === 'PROVEEDOR' || category === 'CLIENTE' || category === 'DIRECTOR') && currentUser.modules.includes('CDI-FORM-PC-' + category.substring(0,2)))
									) &&
								<li className={ activeTab === 'tab-monitoring-' + category ? 'active' : '' } onClick={ () => onTabChange('tab-monitoring-'+category) }>
									<div className="menu-item-inner">
										{t('messages.aml.menu.category.' + category)}
										<Icon type="check" />
									</div>
								</li>
								}</>
							)}
						</ul>
					</div>
				}

				{ currentUser.cliente.modules.includes('CDI-MATCH') && currentUser.modules.includes('CDI-MATCH') &&
				<div className="menu-block">
					<h3>Investigación de Personas</h3>
					<ul>
						<li className={ activeTab === 'tab-matching' ? 'active' : '' } onClick={ () => onTabChange('tab-matching') }>
							<div className="menu-item-inner">
								Solicitud de Investigación
								<Icon type="check" />
							</div>
						</li>
						{ categories.map((category) =>
							<li className={ activeTab === 'tab-matching-' + category ? 'active' : '' } onClick={ () => onTabChange('tab-matching-'+category) }>
								<div className="menu-item-inner">
									{t('messages.aml.menu.category.' + category)}
									<Icon type="check" />
								</div>
							</li>
						)}
					</ul>
				</div>
				}
				{ currentUser.cliente.modules.includes('CDI-FORM') && currentUser.modules.includes('CDI-FORM') &&
				<>
					{ currentUser.modules.includes('CDI-FORM-GC') &&
						<div className="menu-block">
							<h3>Gestión de Comunicados</h3>
							<ul>
								{ currentUser.modules.includes('CDI-FORM-GC-I') &&
									<li className={ activeTab === 'tab-releases' ? 'active' : '' } onClick={ () => onTabChange('tab-releases') }>
										<div className="menu-item-inner">
										Envío Informativo Periódicos
											<Icon type="check" />
										</div>
									</li>
								}
								{ currentUser.modules.includes('CDI-FORM-GC-D') &&
									<li className={ activeTab === 'tab-statements' ? 'active' : '' } onClick={ () => onTabChange('tab-statements') }>
										<div className="menu-item-inner">
											Solicitud de Declaraciones
											<Icon type="check" />
										</div>
									</li>
								}
							</ul>
						</div>
					}
					{ currentUser.modules.includes('CDI-FORM-GD') && (currentUser.cliente.modules.includes('CDI-FORM-CDI') || currentUser.cliente.modules.includes('CDI-FORM-DIR') || currentUser.cliente.modules.includes('CDI-FORM-PATR') || currentUser.cliente.modules.includes('CDI-FORM-REL')) &&
						<div className="menu-block">
							<h3>{/*<img src={ iconNetwork } alt="" />*/}Gestión de Declaraciones</h3>
							<ul>
								{ currentUser.modules.includes('CDI-FORM-GD-T') &&
									<li className={ activeTab === 'tab-workers' ? 'active' : '' } onClick={ () => onTabChange('tab-workers') }>
										<div className="menu-item-inner">
											Trabajadores
											<Icon type="check" />
										</div>
									</li>
								}
								{ currentUser.modules.includes('CDI-FORM-GD-P') && currentUser.cliente.modules.includes('CDI-FORM-CDI') &&
									<li className={ activeTab === 'tab-providers' ? 'active' : '' } onClick={ () => onTabChange('tab-providers') }>
										<div className="menu-item-inner">
											Proveedores
											<Icon type="check" />
										</div>
									</li>
								}
								{ currentUser.modules.includes('CDI-FORM-GPATR') && currentUser.cliente.modules.includes('CDI-FORM-PATR') &&
									<li className={ activeTab === 'tab-clients' ? 'active' : '' } onClick={ () => onTabChange('tab-clients') }>
										<div className="menu-item-inner">
											Clientes
											<Icon type="check" />
										</div>
									</li>
								}
								{ currentUser.modules.includes('CDI-FORM-GDIR') && currentUser.cliente.modules.includes('CDI-FORM-DIR') &&
									<li className={ activeTab === 'tab-directors' ? 'active' : '' } onClick={ () => onTabChange('tab-directors') }>
										<div className="menu-item-inner">
											Directores
											<Icon type="check" />
										</div>
									</li>
								}
							</ul>
						</div>
					}
					{ currentUser.modules.includes('CDI-FORM-GF') &&
					(currentUser.cliente.modules.includes('CDI-FORM-G') || currentUser.cliente.modules.includes('CDI-FORM-T')
					|| currentUser.cliente.modules.includes('CDI-FORM-F') || currentUser.cliente.modules.includes('CDI-FORM-S')
					|| currentUser.cliente.modules.includes('CDI-FORM-V'))&&
						<div className="menu-block">
							<h3>{/*<img src={ iconAlert } alt="" />*/}Gestión de Formularios</h3>
							<ul>
								{ currentUser.modules.includes('CDI-FORM-GF-G') && currentUser.cliente.modules.includes('CDI-FORM-G') &&
									<li className={ activeTab === 'tab-gifts' ? 'active' : '' } onClick={ () => onTabChange('tab-gifts') }>
											<div className="menu-item-inner">
												Regalos
												<Icon type="check" />
											</div>
									</li>
								}
								{ currentUser.modules.includes('CDI-FORM-GF-T') && currentUser.cliente.modules.includes('CDI-FORM-T')&&
									<li className={ activeTab === 'tab-travels' ? 'active' : '' } onClick={ () => onTabChange('tab-travels') }>
											<div className="menu-item-inner">
												Viajes
												<Icon type="check" />
											</div>
									</li>
								}
								{ currentUser.modules.includes('CDI-FORM-GF-F') && currentUser.cliente.modules.includes('CDI-FORM-F') &&
									<li className={ activeTab === 'tab-civil-servants' ? 'active' : '' } onClick={ () => onTabChange('tab-civil-servants') }>
										<div className="menu-item-inner">
											Funcionarios públicos
											<Icon type="check" />
										</div>
									</li>
								}
								{ currentUser.modules.includes('CDI-FORM-GF-S') && currentUser.cliente.modules.includes('CDI-FORM-S') &&
									<li className={ activeTab === 'tab-partnerships' ? 'active' : '' } onClick={ () => onTabChange('tab-partnerships') }>
										<div className="menu-item-inner">
											Asociaciones empresariales
											<Icon type="check" />
										</div>
									</li>
								}
								{ currentUser.modules.includes('CDI-FORM-GF-V') && currentUser.cliente.modules.includes('CDI-FORM-V') &&
									<li className={ activeTab === 'tab-stock-trading' ? 'active' : '' } onClick={ () => onTabChange('tab-stock-trading') }>
										<div className="menu-item-inner">
											Compra Venta Valores
											<Icon type="check" />
										</div>
									</li>
								}
							</ul>
						</div>
					}
				</>
				}
			</div>
		</Col>
	)
}

export default Sidebar
