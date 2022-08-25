import './InterestConflicts.scss'
import React, { Component } from 'react'
import { Col, Row } from 'antd'
import { Page, PageBottomBar, PageContent, PageFooter, PageHeader, PageTopBar } from '../../layouts/Private/components'
import { Content, Sidebar, Wrapper } from './layout'
import { TabBigMatches, TabMatches, TabReleases,TabMatching,TabMatchingDetails,TabMonitoringDetails,TabStockTrading } from './components'
import { getCategoriesPromise } from './promises'

class InterestConflicts extends Component {
	state = {
		activeTab: '',
		breadcrumbs: this.getBreadcrumbs(),
		categories: []
	}

	async reloadCategories() {
		let c = await getCategoriesPromise()
		this.setState({ categories: c.data })
	}

	async componentDidMount() {
		await this.reloadCategories()
		const { categories } = this.state
		const { currentUser } = this.props
		if(categories.length > 0) {
			for(let i=0;i<categories.length;i++) {
				if((currentUser.cliente.modules.includes('CDI-MATCH') && currentUser.modules.includes('CDI-MATCH'))
					|| (currentUser.cliente.modules.includes('CDI-FORM') && currentUser.modules.includes('CDI-FORM') && currentUser.modules.includes('CDI-FORM-PC') && (categories[i] === 'COLABORADOR' || categories[i] === 'PROVEEDOR') && currentUser.modules.includes('CDI-FORM-PC-' + categories[i].substring(0,1)))) {
						this.handleTabChange('tab-monitoring-'+categories[i])
						break;
					}
			}
		}
	}

	getBreadcrumbs() {
		const { t } = this.props

		const breadcrumbs = [
			{ title: 'Conflictos de Interés', icon: 'branches', link: '/conflictos-de-interes' },
		]

		return breadcrumbs
	}

	handleTabChange(activeTab) {
		this.setState({ activeTab })
	}

	render() {
		const { activeTab, breadcrumbs, categories } = this.state
		const { currentUser, t } = this.props

		return (
			<div className="conflicts-of-interest">
				<PageTopBar breadcrumbs={ breadcrumbs } />
				<Page>
					<PageHeader
						title="Administrador de Conflictos de Interés"
						description="Administra los vínculos entre colaboradores, proveedores y otras partes relacionadas"
						icon="branches"
						/>
					<PageContent>
						<Wrapper>
							<Sidebar currentUser={currentUser} activeTab={ activeTab } onTabChange={ this.handleTabChange.bind(this) } categories={categories} />
							<Content>

								{ activeTab.startsWith('tab-monitoring-') && <TabMonitoringDetails key={activeTab} type={activeTab.substring(15)} currentUser={currentUser} /> }
								{ activeTab === 'tab-matching' && <TabMatching currentUser={currentUser} reloadCategories={this.reloadCategories.bind(this)} /> }
								{ activeTab.startsWith('tab-matching-') && <TabMatchingDetails key={activeTab} type={activeTab.substring(13)} currentUser={currentUser} /> }
								{ activeTab === 'tab-releases' && <TabReleases type="I" currentUser={currentUser} reloadCategories={this.reloadCategories.bind(this)} /> }
								{ activeTab === 'tab-statements' && <TabReleases type="D" currentUser={currentUser} reloadCategories={this.reloadCategories.bind(this)} /> }
								{ activeTab === 'tab-workers' && <TabMatches type="COLABORADOR" currentUser={currentUser} /> }
								{ activeTab === 'tab-providers' && <TabMatches type="PROVEEDOR" currentUser={currentUser} /> }
								{ activeTab === 'tab-clients' && <TabMatches type="CLIENTE" currentUser={currentUser} /> }
								{ activeTab === 'tab-directors' && <TabMatches type="DIRECTOR" currentUser={currentUser} /> }
								{ activeTab === 'tab-gifts' && <TabMatches type="GIFT" currentUser={currentUser} /> }
								{ activeTab === 'tab-travels' && <TabMatches type="TRAVEL" currentUser={currentUser} /> }
								{ activeTab === 'tab-civil-servants' && <TabMatches type="FP" currentUser={currentUser} /> }
								{ activeTab === 'tab-partnerships' && <TabMatches type="SOC" currentUser={currentUser} /> }
								{ activeTab === 'tab-stock-trading' && <TabStockTrading type="COLABORADOR" currentUser={currentUser} /> }

							</Content>
						</Wrapper>
					</PageContent>
				</Page>
				<PageBottomBar breadcrumbs={ breadcrumbs } />
			</div>
		)
	}
}
export default InterestConflicts
