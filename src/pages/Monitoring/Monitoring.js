import './Monitoring.scss'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Content, Sidebar, Wrapper } from './layout'
import { Page, PageBottomBar, PageContent, PageFooter, PageHeader, PageTopBar } from '../../layouts/Private/components'
import { TabAlerts, TabMonitoreo, TabRules, TabSimulator } from './components'
import { TabIndicators, TabReports } from './tabs'
import { getCategoriesClientPromise } from './promises'
import { withTranslation } from "react-i18next";

class Monitoring extends Component {
  state = {
		activeTab: '',
    breadcrumbs: this.getBreadcrumbs(),
    categories: [],
    loadCategories: false
	}

  componentDidMount() {
    const { match } = this.props
    getCategoriesClientPromise().then((categories) => {
      this.setState({ categories, loadCategories: true })
    })

    if(match.url.startsWith('/monitoreo/alertas') && match.params.category !== undefined && match.params.category !== null) {
      this.setState({ activeTab: 'tab-alerts-'+match.params.category })
    }else if(match.url.startsWith('/monitoreo/eventos')){
      this.setState({ activeTab: 'tab-custom-alerts' })
    }else {
      this.setState({ activeTab: 'tab-indicators' })
    }
  }

  getBreadcrumbs() {
    const { t } = this.props

    const breadcrumbs = [
      { title: 'Monitoreo', icon: 'branches', link: '/monitoreo' }
    ]

    return breadcrumbs
  }

  handleTabChange(activeTab) {
    this.setState({ activeTab })
  }

  render() {
		const { activeTab, breadcrumbs, categories, loadCategories, state } = this.state
		const { currentUser, t } = this.props
    

		return (
      <div className="monitoring">
        <PageTopBar breadcrumbs={ breadcrumbs } />
        <Page>
          <PageHeader
            title={ t("messages.aml.monitoring") }
            description={t("messages.aml.monitoringDescription")}
            icon="branches"
            />
          <PageContent>
            <Wrapper>
              <Sidebar currentUser={currentUser} activeTab={ activeTab } onTabChange={ this.handleTabChange.bind(this) } categories = {categories} />
              { loadCategories &&
                <Content>
                  {activeTab === 'tab-indicators' && <TabIndicators categories={categories} /> }
                  {activeTab === 'tab-reports' && <TabReports categories={categories} /> }
                  { activeTab.startsWith('tab-alerts-open-') && <TabAlerts key={activeTab} type={activeTab.substring(16)} currentUser={currentUser} alertStatus="OPEN"/> }
                  { activeTab.startsWith('tab-alerts-close-') && <TabAlerts key={activeTab} type={activeTab.substring(17)} currentUser={currentUser} alertStatus="CLOSED"/> }
                  { activeTab.startsWith('tab-monitoreo-') && <TabMonitoreo key={activeTab} type={activeTab.substring(14)} currentUser={currentUser}/> }
                  { activeTab === 'tab-rules' && <TabRules currentUser={currentUser} /> }
                  { activeTab === 'tab-custom-alerts' && <TabAlerts key={activeTab} type="EVENTO" currentUser={currentUser} categories={categories} /> }
                  { activeTab === 'tab-simulator' && <TabSimulator type="EVENTO" currentUser={currentUser} /> }
                </Content>
              }
            </Wrapper>
          </PageContent>
        </Page>
        <PageBottomBar breadcrumbs={ breadcrumbs } />
      </div>
    )
  }
}
export default withTranslation()(withRouter(Monitoring))
