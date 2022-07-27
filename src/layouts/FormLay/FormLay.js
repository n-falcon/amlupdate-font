import './form-lay.scss'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Layout } from 'antd'
import { Content, Header,Footer } from './components'


class FormLayout extends Component {
  componentDidMount() {
    document.body.id = 'form-layout'
  }

  render() {
    const { children} = this.props
    const { view } = this.props

    return (
      <Layout className="layout-private">
        { view !== "modal" && <Header view={view}/> }
        <Content view={view}>
          { children }
        </Content>
        <Footer/>
      </Layout>

    )
  }
}

export default withRouter(props => <FormLayout {...props} />)
