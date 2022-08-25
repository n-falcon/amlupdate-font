import './Stakeholder.scss'
import React, { useEffect, useState } from 'react'
import { withRouter, Link } from "react-router-dom"
import { Layout, Spin, Icon, Menu, Dropdown, Button, Col, Row } from 'antd'
import { useTranslation } from "react-i18next"
import { StakePublic, StakePrivate } from '../'
import { ModalChangePassword } from '../../layouts/Private/components'
import { getDomainPromise, getUserByIdPromise, changePasswordPromise } from './promises'
import apiConfig from '../../config/api'
import { SessionStorageService } from '../../services'

import logoAml from '../../layouts/Private/components/Footer/logo-aml.png'

const { Header, Footer } = Layout

const Stakeholder = ({ match }) => {
	const { t } = useTranslation();
	const [cliente, setCliente] = useState(null)
	const [user, setUser] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [isModalChangePasswordVisible, setIsModalChangePasswordVisible] = useState(false)

	document.title = "Portal de Usuarios"

	useEffect(() => {
		getDomainPromise(match.params.domain).then(c => {
			setCliente(c.data)

			if(c.data !== null && c.data !== '') {
				const userId = SessionStorageService.read('portal-user-id')
				if(userId !== null && userId !== '') {
					getUserByIdPromise(c.data.id, userId).then(u => {
						if(u.data !== null && u.data !== '') {
							handleLogin(u.data, 'x')
						}
					})
				}
			}
			setIsLoading(false)
		})
	}, [])

	const handleLogin = async (record, code) => {
		if(code === 'x') {
			record.activeUser = true
		}else if(code === '200') {
			record.activeUser = true
			SessionStorageService.create('portal-user-id', record.id)
		}else record.activeUser = false
		setUser(record)
		setIsLoggedIn(true)
  }

	const handleLogout = async (e) => {
		setIsLoggedIn(false)
		setUser(null)
		SessionStorageService.delete('portal-user-id')
  }

	const handleOpenModalChangePassword = () => {
		setIsModalChangePasswordVisible(true)
	}

	const handleCloseModalChangePassword = () => {
		setIsModalChangePasswordVisible(false)
  }

 	const handleSaveModalChangePassword = (passwordCurrent, passwordNew, passwordNewConfirm) => {
    changePasswordPromise(user.id, passwordCurrent, passwordNew, passwordNewConfirm).then(response => {
			if(response) {
				setIsModalChangePasswordVisible(false)
				if(!user.activeUser) {
					let _u = {...user, activeUser: true}
					setUser(_u)
				}
			}
		})
  }


	const dropdownMenu = (
		<Menu>
			<Menu.Item>
				<Link to={ '#' } onClick={ handleOpenModalChangePassword }>
					<Icon type="lock" /> &nbsp;{ t('messages.aml.changePwd') }
				</Link>
			</Menu.Item>
			<Menu.Item>
				<Link to={ '#' } onClick={ handleLogout }>
					<Icon type="logout" /> { t('messages.aml.logout') }
				</Link>
			</Menu.Item>
		</Menu>
	)

	return (
		<div className="stakeholder">
			{ cliente !== null &&
				<>
				{ cliente !== '' ?
					<>
						<Header className="header">
							<div className="logo">
								<img src={ apiConfig.url + '/../getImageClient?clientId=' + cliente.id } alt="" />
							</div>
							{ isLoggedIn && user !== null &&
								<div className="current-user">
					        <Dropdown overlay={ dropdownMenu }>
					          <Button>
					            <Icon type="user" /> { user.nombre } <Icon type="caret-down" />
					          </Button>
					        </Dropdown>
								</div>
							}
						</Header>
						{ isLoading ? <Col className="row-loading"><Spin size="large"/></Col>
							:
							isLoggedIn ?
								<>
								{ user.activeUser && <StakePrivate client={cliente} currentUser={user} /> }
								{ (isModalChangePasswordVisible || user.activeUser === false) &&
									<ModalChangePassword
										visible={ true }
										isForced={user.activeUser === false}
										onOk={ handleSaveModalChangePassword }
										onCancel={ handleCloseModalChangePassword }
										/>
								}
								</>
								:
								<StakePublic client={cliente} successHandler={handleLogin} />
						}
						<div id="footer">
							<Row className="footer-inner">
        						<Col xs={ 7 }>
									<img className="logo" src={ logoAml } alt="" />
									<div className="powered">
										<span>Powered by <a href="https://www.gesintel.cl" target="_blank">Gesintel Compliance S.A.</a></span>
									</div>
								</Col>
							</Row>
						</div>
					</>
					:
					<center><br/><br/><br/><h1>Cliente no existe</h1></center>
				}
				</>
			}
		</div>
	)
}

export default withRouter(Stakeholder)
