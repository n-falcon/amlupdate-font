import './Header.scss'
import React from 'react'
import { Layout,Menu } from 'antd'
import Logo from './Logo/Logo'


const { Header } = Layout

export default ({view}) => (

<Header id="header" theme="dark" className={view}>
  {/* <div className="logo" />
  <Menu
    mode="horizontal"
    defaultSelectedKeys={['2']}
    style={{ lineHeight: '64px' }}
  >
    <Menu.Item key="1">nav 1</Menu.Item>
    <Menu.Item key="2">nav 2</Menu.Item>
    <Menu.Item key="3">nav 3</Menu.Item>
  </Menu> */}

  {/* <Logo currentUser = {currentUser}/> */}


</Header>


)
