import './Admin.scss'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { Tabs } from 'antd'
import { Page, PageBottomBar, PageContent, PageFooter, PageHeader, PageTopBar } from '../../layouts/Private/components'

import {
  AdminUsersPage,
  AdminAuditPage,
  AdminSearchPage,
  AdminConsultasPage,
  AdminLogBasesPage,
  AdminListsPage,
  AdminAuthIpsPage,
  AdminRiskPage,
  AdminGroupsPage} from '../'

const { TabPane } = Tabs

class Admin extends Component {
  state = {
    breadcrumbs: this.getBreadcrumbs()
  }

  getBreadcrumbs() {
    const { t } = this.props

    const breadcrumbs = [
      { title: t('messages.aml.administration'), icon: 'file-search', link: '/administracion' },
    ]

    return breadcrumbs
  }

  render() {
    const { breadcrumbs } = this.state
    const { currentUser, t } = this.props

    return (
      <div className="admin">
        <PageTopBar breadcrumbs={ breadcrumbs } />
        <Page>
          <PageHeader
            title={ t('messages.aml.administrationPageTitle') }
            description={ t('messages.aml.administrationPageDescription')}
            icon="file-search"
            />
          <PageContent>
            <Tabs type="card">
              { !currentUser.cliente.modules.includes('CONSULTA2') &&
              <TabPane tab={ t('messages.aml.users') } key="1">
                <AdminUsersPage currentUser={ currentUser } />
              </TabPane>
              }
              <TabPane tab={ t('messages.aml.auditTitle') } key="2">
                <AdminAuditPage currentUser={ currentUser } />
              </TabPane>
              { (currentUser.cliente.planBatch !== null || currentUser.cliente.planHist !== null) &&
                <TabPane tab={ t('messages.aml.searches') } key="3">
                  <AdminSearchPage currentUser={ currentUser } />
                </TabPane>
              }
              { currentUser.type === 'SADMIN' && (currentUser.cliente.planBatch !== null || currentUser.cliente.planHist !== null) &&
                <TabPane tab={ t("messages.aml.admin.query") } key="4">
                  <AdminConsultasPage currentUser={ currentUser } />
                </TabPane>
              }
              { currentUser.type === 'SADMIN' && currentUser.cliente.modules.includes('PFA') &&
                <TabPane tab={ t("messages.aml.admin.log") } key="5">
                  <AdminLogBasesPage currentUser={ currentUser }/>
                </TabPane>
              }

              { currentUser.cliente.modules.includes('NEG') && (currentUser.type === 'SADMIN' || (currentUser.modules !== null && currentUser.modules.includes('LOADNEG'))) &&
                <TabPane tab={ t('messages.aml.ownLists') } key="6">
                  <AdminListsPage currentUser={ currentUser } />
                </TabPane>
              }
              { currentUser.type === 'SADMIN' &&
                <TabPane tab={ t('messages.aml.risk') } key="7">
                  <AdminRiskPage currentUser={ currentUser} />
                </TabPane>
              }
              { currentUser.type === 'SADMIN' && currentUser.cliente.modules.includes('REGISTRO') &&
                <TabPane tab={ t('messages.aml.groups') } key="8">
                  <AdminGroupsPage currentUser={ currentUser } />
                </TabPane>
              }
              { currentUser.type === 'SADMIN' &&
                <TabPane tab={ t('messages.aml.parameters') } key="9">
                  <AdminAuthIpsPage currentUser={ currentUser } />
                </TabPane>
              }
            </Tabs>
          </PageContent>
          <PageFooter>

          </PageFooter>
        </Page>
        <PageBottomBar breadcrumbs={ breadcrumbs } />
      </div>
    )
  }
}

export default withTranslation()(Admin)
