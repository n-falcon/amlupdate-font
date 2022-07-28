import './Home.scss'
import React, {Component} from 'react'
import {withTranslation} from 'react-i18next'
import {withRouter} from 'react-router'
import {Col, Row, Timeline, Tooltip, Badge, Spin} from 'antd'
import {Page, PageBottomBar, PageContent, PageFooter, PageHeader, PageTopBar} from '../../layouts/Private/components'
import {getHistoryMonitoreoClientPromise} from '../Register/promises'
import {getNewsGesintelPromise} from '../AdminParams/promises'

class Home extends Component {
    state = {
        hasRegistro: false,
        newsLetter: null,
        isLoadingNews: true,
        newsGesintel: []
    }

    async componentDidMount() {
        const {currentUser} = this.props
        let hasRegistro = false
        if (currentUser.cliente.modules.includes('REGISTRO') && (currentUser.type === 'SADMIN' || (currentUser.modules !== null && currentUser.modules.includes('REGISTRO')))) {
            hasRegistro = true
            const monitoreo = await getHistoryMonitoreoClientPromise()
            this.setState({hasRegistro, monitoreo})
        }
        const newsGesintel = await getNewsGesintelPromise(currentUser)
        this.setState({newsGesintel, isLoadingNews: false})
    }

    onClickAlerta(alertas, fecAlerta) {
        if (alertas > 0) {
            const {history} = this.props
            history.push('/registro?fa=' + fecAlerta)
        }
    }

    render() {
        const {t} = this.props
        const {hasRegistro, monitoreo, newsGesintel, isLoadingNews} = this.state

        return (
            <div className="home">
                <PageTopBar breadcrumbs={[]}/>
                <Page>
                    <PageHeader title={t("messages.aml.homePageTitle")}
                                description="Controle la información más importantes desde aquí." icon="home"/>
                    <PageContent>
                        <Row>
                            {hasRegistro &&
                                <Col xs={11}>
                                    <div className="h3-wrapper">
                                        <h3 className="references-title">{t('messages.aml.monitoring')}</h3>
                                    </div>
                                    <div className="references">
                                        <Timeline>
                                            {monitoreo.map((monitor, index) =>
                                                <div key={index}>
                                                    <Timeline.Item>
                                                        <div
                                                            className={'timeline-item-monitor' + (monitor.cant_alertas > 0 ? ' timeline-alerta' : '')}
                                                            onClick={() => this.onClickAlerta(monitor.cant_alertas, monitor.fecha)}>
                                                            <h3>{monitor.fecha}</h3>
                                                            {monitor.cant_alertas > 0 &&
                                                                <Tooltip placement="top"
                                                                         title={t('messages.aml.alerts')}>
                                                                    <Badge count={monitor.cant_alertas} size="small"/>
                                                                </Tooltip>
                                                            }
                                                            <ul className="colors">
                                                                <Tooltip placement="top"
                                                                         title={t('messages.aml.riskCritical')}>
                                                                    <li className="risk-BLACK">
                                                                        {monitor.cant_black}
                                                                    </li>
                                                                </Tooltip>
                                                                <Tooltip placement="top"
                                                                         title={t('messages.aml.riskHigh')}>
                                                                    <li className="risk-RED">
                                                                        {monitor.cant_red}
                                                                    </li>
                                                                </Tooltip>
                                                                <Tooltip placement="top"
                                                                         title={t('messages.aml.riskMedium')}>
                                                                    <li className="risk-ORANGE">
                                                                        {monitor.cant_orange}
                                                                    </li>
                                                                </Tooltip>
                                                                <Tooltip placement="top"
                                                                         title={t('messages.aml.riskLow')}>
                                                                    <li className="risk-YELLOW">
                                                                        {monitor.cant_yellow}
                                                                    </li>
                                                                </Tooltip>
                                                                <Tooltip placement="top"
                                                                         title={t('messages.aml.risk.GREEN')}>
                                                                    <li className="risk-GREEN">
                                                                        {monitor.cant_green}
                                                                    </li>
                                                                </Tooltip>
                                                            </ul>
                                                        </div>
                                                    </Timeline.Item>
                                                </div>
                                            )
                                            }
                                        </Timeline>
                                    </div>
                                </Col>
                            }
                            <Col xs={1}></Col>
                            <Col xs={12}>
                                <div className="h3-wrapper">
                                    <h3 className="references-title">Newsletter</h3>
                                </div>
                                {isLoadingNews ?
                                    <Spin size="large"/>
                                    :
                                    <div className="newsLetter">
                                        {newsGesintel.map((news, index) =>
                                            <Row key={index}>
                                                <Col xs={4}>
                                                    {news._embedded['wp:featuredmedia'] !== undefined && news._embedded['wp:featuredmedia'].length > 0 &&
                                                        <img alt=""
                                                             src={news._embedded['wp:featuredmedia'][0].source_url}
                                                             className="news"/>
                                                    }
                                                </Col>
                                                <Col xs={20}>
                                                    <h3 dangerouslySetInnerHTML={{__html: news.title.rendered}}></h3>
                                                    <div className="content"
                                                         dangerouslySetInnerHTML={{__html: news.content.rendered}}></div>
                                                </Col>
                                            </Row>
                                        )}
                                    </div>
                                }
                            </Col>
                        </Row>
                    </PageContent>
                    <PageFooter/>
                </Page>
                <PageBottomBar breadcrumbs={[]}/>
            </div>
        )
    }
}

export default withTranslation()(withRouter(Home))
