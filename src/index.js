import 'antd/dist/antd.css'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'

import moment from 'moment'
import { Loading, ModalChangePassword } from './layouts/Private/components'
import { LayoutPrivate, LayoutPublic } from './layouts'

import 'moment/locale/es'
import i18nextConfig from './config/i18next'


/* Pages */
import {LoginPage,
    NotFoundPage,
    NotAuthorizedPage,
    HomePage,
    RegisterPage,
    NewRegisterPage,
    QueryPage,
    OnBoardingPage /*, ProfilePage, NewRegisterPage*/ } from './pages'

/* Promises */
import { animateLogoutPromise, changePasswordPromise, getCurrentUserPromise, logoutPromise, removeLoginAnimationsPromise } from './promises'

/* Helpers*/
import { authTokenValidatorHelper, sessionStorageCleanerHelper, authTokenRenewerHelper } from './helpers'

/* Services */
import { LocalStorageService } from './services'


class App extends Component {
    state = {
        currentUser: {},
        isActivated: true,
        isLoading: true,
        isLoggedIn: false,
        isModalChangePasswordVisible: false
    }

    async componentDidMount() {
        const language = LocalStorageService.read('i18nextLng')
        moment.locale(language.substring(0,2))

        this.handleThemeCheck()

        const isValidAuthToken = await authTokenValidatorHelper()
        if (isValidAuthToken) {
            const currentUser = await this.getCurrentUser()

            const isActivated = currentUser.feActivacion !== null
            if(isActivated) {
                this.setState({
                    currentUser,
                    isLoggedIn: true
                })

                removeLoginAnimationsPromise()

                const isActivated = currentUser.feActivacion !== null

                if (!isActivated) {
                    this.handleOpenModalChangePassword()
                }

                if (currentUser.cliente.pais !== 'CHI') {
                    i18nextConfig.changeLanguage(language.substring(0,2) + currentUser.cliente.pais)
                }
            }
        }

        this.setState({ isLoading: false })
    }

    handleThemeCheck() {
        const theme = LocalStorageService.read('theme')

        if (theme !== null) {
            document.body.className = theme
        } else {
            document.body.className = 'theme-metal'
        }
    }

    async handleLogin() {

        const currentUser = await this.getCurrentUser()

        if (!currentUser.error) {
            const isActivated = currentUser.feActivacion !== null

            if (!isActivated) {
                this.handleOpenModalChangePassword()
            }else {
                await this.setState({
                    currentUser,
                    isLoggedIn: true
                })
                new authTokenRenewerHelper(this.handleLogout.bind(this))
            }
        }
    }

    async handleLogout() {
        await logoutPromise()
        await sessionStorageCleanerHelper()
        await animateLogoutPromise()

        await this.setState({
            currentUser: {},
            isActivated: true,
            isLoading: false,
            isLoggedIn: false
        })
    }

    async getCurrentUser() {
        const currentUser = await getCurrentUserPromise()

        this.setState({ isLoading: false })

        return currentUser
    }

    async handleOpenModalChangePassword() {
        this.setState({ isModalChangePasswordVisible: true })
    }

    async handleCloseModalChangePassword() {
        this.setState({ isModalChangePasswordVisible: false })
    }

    async handleSaveChangePassword(passwordCurrent, passwordNew, passwordNewConfirm) {
        await changePasswordPromise(passwordCurrent, passwordNew, passwordNewConfirm)

        this.setState({ isModalChangePasswordVisible: false })
    }

    renderComponent(CurrentPage, protectedContent=null) {
        const { isLoggedIn, currentUser } = this.state

        if (protectedContent !== null && currentUser !== {} && currentUser.cliente !== undefined && currentUser.modules !== null) {
            if(!currentUser.cliente.modules.includes('AML2')) {
                CurrentPage = NotAuthorizedPage
            } else {
                switch(protectedContent) {

                    case 'query':
                        CurrentPage = (currentUser.cliente.planHist !== null && currentUser.cliente.modules.includes('CONSULTA') && currentUser.modules.includes('CONSULTA')) ? CurrentPage : NotAuthorizedPage
                        break

                    case 'query2':
                        CurrentPage = (currentUser.cliente.planHist !== null && currentUser.cliente.modules.includes('CONSULTA2')) ? CurrentPage : NotAuthorizedPage
                        break

                    case 'monitoring':
                        CurrentPage = (currentUser.cliente.modules.includes('MONITOR') && currentUser.modules.includes('MONITOR')) ? CurrentPage : NotAuthorizedPage
                        break

                    case 'batch':
                        CurrentPage = (currentUser.cliente.planBatch !== null && currentUser.cliente.planBatch.tipo === 'ABIERTO' && currentUser.cliente.modules.includes('BATCH') && currentUser.modules.includes('BATCH')) ? CurrentPage : NotAuthorizedPage
                        break

                    case 'register':
                        CurrentPage = (currentUser.cliente.modules.includes('REGISTRO') && currentUser.cliente.oficialCto !== null && currentUser.cliente.oficialCto.id === currentUser.id || currentUser.modules.includes('REGISTRO')) ? CurrentPage : NotAuthorizedPage
                        break

                    case 'conflict':
                        CurrentPage = (currentUser.cliente.modules.includes('CDI-MATCH') || currentUser.cliente.modules.includes('CDI-FORM')) && (currentUser.modules.includes('CDI-MATCH') || currentUser.modules.includes('CDI-FORM')) ? CurrentPage : NotAuthorizedPage
                        break

                    case 'bankruptcy':
                        CurrentPage = (currentUser.cliente.modules.includes('QUIEBRA') && currentUser.modules.includes('QUIEBRA')) ? CurrentPage : NotAuthorizedPage
                        break

                    case 'onboarding':
                        CurrentPage = (currentUser.cliente.modules.includes('ONBOARDING') && currentUser.modules.includes('ONBOARDING')) ? CurrentPage : NotAuthorizedPage
                        break
                }
            }
        }

        return isLoggedIn ? <CurrentPage currentUser={ currentUser } /> : <LoginPage successHandler={ this.handleLogin.bind(this) } />
    }

    render() {
        const { currentUser, isLoading, isLoggedIn, isModalChangePasswordVisible } = this.state
        const Layout = isLoggedIn ? LayoutPrivate : LayoutPublic

        if (isLoading) {
            return <Loading />
        } else {
            return (
                <I18nextProvider i18n={ i18nextConfig }>
                    <Router>
                        <Layout currentUser={ currentUser } logoutHandler={ this.handleLogout.bind(this) }>
                            <Switch>
                                <Route path="/" exact render={ () => this.renderComponent(HomePage, 'home') } />

                                <Route path="/consulta" exact render={ () => this.renderComponent(QueryPage, 'query') } />
                                <Route path="/registro" exact render={ () => this.renderComponent(RegisterPage, 'register') } />
                                <Route path="/registro2" exact render={ () => this.renderComponent(NewRegisterPage, 'new-register') } />
                                <Route path="/onboarding/" exact render={ () => this.renderComponent(OnBoardingPage, 'onboarding') } />

                                {/*}
                                <Route path="/consulta2" exact render={ () => this.renderComponent(Query2Page, 'query2') } />
                                <Route path="/monitoreo" exact render={ () => this.renderComponent(MonitoringPage, 'monitoring') } />
                                <Route path="/monitoreo/alerta/:alertId" exact render={ () => this.renderComponent(AlertManagerPage, 'monitoring') } />
                                <Route path="/monitoreo/alertas/:category" exact render={ () => this.renderComponent(MonitoringPage, 'monitoring') } />
                                <Route path="/monitoreo/eventos" exact render={ () => this.renderComponent(MonitoringPage, 'monitoring') } />
                                <Route path="/consulta/:text" exact render={ () => this.renderComponent(QueryPage, 'query') } />
                                <Route path="/masivos" exact render={ () => this.renderComponent(BatchPage, 'batch') } />
                                <Route path="/perfil/:id" exact render={ () => this.renderComponent(ProfilePage, 'query') } />
                                <Route path="/administracion" exact render={ () => this.renderComponent(AdminPage, 'admin') } />
                                <Route path="/quiebras" exact render={ () => this.renderComponent(QuiebrasPage, 'bankruptcy') } />
                                <Route path="/conflictos-de-interes" exact render={ () => this.renderComponent(ConflictsOfInterestPage, 'conflict') } />
                                <Route path="/forms/1/formTrab/:id/:view?" exact render={ () => <FormTrabPageSmu/>} />
                                <Route path="/forms/1/formProv/:id/:view?" exact render={ () => <FormProvPageSmu/>} />
                                <Route path="/forms/1/formDir/:id/:view?" exact render={ () => <FormDirPageSmu/>} />

                                <Route path="/forms/2/formTrab/:id/:view?" exact render={ () => <FormTrabPageCLA/>} />
                                <Route path="/forms/2/formProv/:id/:view?" exact render={ () => <FormProvPageCLA/>} />
                                <Route path="/forms/2/formDir/:id/:view?" exact render={ () => <FormDirPageCLA/>} />

                                <Route path="/forms/parauco/formKyc/:id/:view?" exact render={ () => <FormKycPagePar/>} />
                                <Route path="/forms/:client/formKyc/:id/:view?" exact render={ () => <FormKycPage/>} />

                                <Route path="/forms/btgpactual/formTrab/:id/:view?" exact render={ () => <FormTrabPageBtg/>} />
                                <Route path="/forms/btgpactual/formPatr/:id/:view?" exact render={ () => <FormPatrPageBtg/>} />

                                <Route path="/forms/santanderconsumer/formTrab/:id/:view?" exact render={ () => <FormTrabPageSC/>} />

                                <Route path="/forms/3/formTrab/:id/:view?" exact render={ () => <FormTrabPageFam/>} />

                                // Routa generica para formTrab

                                <Route path="/forms/:cliente/formTrab/:id/:view?" exact render={ () => <FormTrabPageGen/>} />
                                <Route path="/forms/:cliente/formFP/:id/:view?" exact render={ () => <FormFPPage/>} />
                                <Route path="/forms/:cliente/formSoc/:id/:view?" exact render={ () => <FormSocPage/>} />
                                <Route path="/forms/:cliente/formGift/:id/:view?" exact render={ () => <FormGiftPage/>} />
                                <Route path="/forms/:cliente/formTravel/:id/:view?" exact render={ () => <FormTravelPage/>} />
                                <Route path="/forms/:cliente/formValues/:id/:view?" exact render={ () => <FormValuesPage/>} />

                                <Route path="/formPepNatural/:id/:view?" exact render={ () => <FormPepNaturalPage/>} />

                                <Route path="/portal/:domain" exact render={ () => <StakeholderPage/>} />
                                {*/}
                                <Route render={ () => <NotFoundPage /> } />

                            </Switch>
                            { isModalChangePasswordVisible &&
                                <ModalChangePassword
                                    visible={ true }
                                    onOk={ this.handleSaveChangePassword.bind(this) }
                                    onCancel={ this.handleCloseModalChangePassword.bind(this) }
                                    isForced
                                />
                            }
                        </Layout>
                    </Router>
                </I18nextProvider>
            )
        }
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
