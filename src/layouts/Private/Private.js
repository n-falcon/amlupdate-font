import './Private.scss'
import React, { Component } from 'react'
import ReactGA from 'react-ga'
import { withRouter } from 'react-router-dom'
import { Layout } from 'antd'
import { Content, Footer, Header } from './components'
import { getParametroByKeyPromise } from '../../promises'

class LayoutPrivate extends Component {
  state = {
    currentPageId: '',
    hotjar: null
  }

  async componentDidMount() {
    const { currentUser } = this.props

    await ReactGA.initialize('UA-156566165-1')

    if (currentUser.cliente.abreviado !== 'demostraciones' && currentUser.cliente.abreviado !== 'demo') {
      await ReactGA.pageview(window.location.pathname + window.location.search)
    }

    this.setCurrentPageId()

    const hotjar = await getParametroByKeyPromise('hotjar')
    this.setState({
      hotjar
    })
  }

  async componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      const { currentUser } = this.props
      const currentPageId = this.setCurrentPageId()

      await this.setState({ currentPageId })

      if (currentUser.cliente.abreviado !== 'demostraciones' && currentUser.cliente.abreviado !== 'demo') {
        await ReactGA.pageview(window.location.pathname + window.location.search)
      }

      this.clearActiveTab()
    }
  }

  setCurrentPageId() {
    const pathname = this.props.location.pathname.substr(1)
    const currentPage = pathname.split('/')[0] === 'perfil' ? 'consulta' : pathname.split('/')[0]
    const currentPageId = pathname === '' ? 'inicio' : currentPage

    let elems = document.getElementsByClassName('layout-private');
    if(elems.length > 0) elems[0].id = currentPageId

    return currentPageId
  }

  clearActiveTab() {
    const tabs = document.querySelectorAll('.ant-menu-item')
    
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove('ant-menu-item-selected')
    }
  }

  render() {
    const { children, currentUser, logoutHandler } = this.props

    return (
      <Layout className="layout-private">
        <Header
          currentUser={ currentUser }
          logoutHandler= { logoutHandler }
          />
        <Content>
          { children }
        </Content>
        <Footer key={this.state.hotjar} currentUser={ currentUser } hotjarVal={this.state.hotjar} />
      </Layout>
    )
  }
}

export default withRouter(props => <LayoutPrivate {...props} />)
