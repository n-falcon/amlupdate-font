import './Header.scss'
import React from 'react'
import { Layout } from 'antd'
import { CurrentUser, Logo, Navigation } from '../'

const { Header } = Layout

export default ({ currentUser, logoutHandler  }) => (
  <Header id="header" theme="dark">
    <Logo currentUserId={ currentUser.id } />
    {currentUser.cliente.modules.includes('AML2') &&
    <>
      <CurrentUser
        currentUser={ currentUser }
        logoutHandler={ logoutHandler }
        />
      <Navigation currentUser={ currentUser } />
    </>
    }
  </Header>
)
