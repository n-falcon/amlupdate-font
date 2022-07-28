import './OnBoarding.scss'
import React, { Component } from 'react'
import { Col, Row } from 'antd'
import { Page, PageBottomBar, PageContent, PageFooter, PageHeader, PageTopBar } from '../../layouts/Private/components'
import { Content, Sidebar, Wrapper } from './layout'
import { DashboardPage, SolicitudesPage, FormManagerPage, FichaClientePage, ReportingPage } from './components'

class OnBoarding extends Component {
	state = {
		activeTab: 'tab-dashboard',
		breadcrumbs: this.getBreadcrumbs(),
		categories: [],
		options: {}
	}

	getBreadcrumbs() {
		const { t } = this.props

		const breadcrumbs = [
			{ title: 'OnBoarding', icon: 'form', link: '/onboarding' },
		]

		return breadcrumbs
	}

	handleTabChange(activeTab, options) {
		this.setState({ activeTab, options })
	}

	handleTabChangeDashboard(activeTab, options) {
		window.scrollTo(0, 0)
		this.handleTabChange(activeTab, options)
	}

	render() {
		const { activeTab, breadcrumbs, categories, options } = this.state
		const { currentUser, t } = this.props

		return (
			<div className="onboarding">
				<PageTopBar breadcrumbs={ breadcrumbs } />
				<Page>
					<PageHeader
						title="OnBoarding"
						icon="form"
						/>
					<PageContent>
						<Wrapper>
							<Sidebar currentUser={currentUser} activeTab={ activeTab } onTabChange={ this.handleTabChange.bind(this) } categories={categories} />
							<Content>
								{/* { activeTab.startsWith('tab-monitoring-') && <TabMonitoringDetails key={activeTab} type={activeTab.substring(15)} currentUser={currentUser} /> } */}
								{ activeTab === 'tab-dashboard' && <DashboardPage currentUser={currentUser} handleTabChange={this.handleTabChangeDashboard.bind(this) } /> }
								{ activeTab === 'tab-solicitudes' && <SolicitudesPage currentUser={currentUser} /> }
								{ activeTab === 'tab-forms' && <FormManagerPage currentUser={currentUser} options={options} /> }
								{ activeTab === 'tab-clientData' && <FichaClientePage currentUser = {currentUser} options={options} /> }
								{ activeTab === 'tab-reporting' && <ReportingPage currentUser = {currentUser}/> }
							</Content>
						</Wrapper>
					</PageContent>
				</Page>
				<PageBottomBar breadcrumbs={ breadcrumbs } />
			</div>
		)
	}
}
export default OnBoarding
