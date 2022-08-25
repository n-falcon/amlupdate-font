import './Stakeholder.scss'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from "react-i18next"
import { Sidebar, Content as ContentLayout } from './layout'
import { TabDeclarations, TabNewRequest, TabTasks, TabOnboarding, TabCdiForms } from './components'
import { Page, PageBottomBar, PageContent, PageFooter, PageHeader, PageTopBar, Content } from '../../layouts/Private/components'
import { Button, Row } from 'antd'
import { ReportService } from '../../services/'
import {getEstadoTareasUserPromise} from './promises'
import { getFormsPromise } from './components/TabDeclarations/promises'



const StakePrivate = ({ client, currentUser }) => {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState('')
	const [content, setContent] = useState(null)
	const [edoTasks,setEdoTasks] = useState(null)
	const [hasPendent, setHasPendent] = useState(null);

	const handleTabChange = (tab) => {
		setActiveTab(tab)
	}

	useEffect(() => {

		// LLamar promesa y validar la que tenga estado send
		// getFormsPromise(currentUser.id).then((res) => {
		// 	let info = res.data.filter(item => item.status != 'SENT');
		// 	if(info.length > 0 && client.modules.includes('CDI-FORM')){
		// 		setHasPendent(true);
		// 	}
		// })

		if (client.modules.includes('ONBOARDING'))
			setActiveTab('tab-onboarding')
		if (client.modules.includes('CDI-FORM'))
			setActiveTab('tab-newdeclaraciones')
		if	(client.modules.includes("MONITOR")){
			getEstadoTareasUserPromise(currentUser.id).then(res=>{
				setEdoTasks(res.data)
				if(res.data.PENDIENTE > 0) {
					setActiveTab('tab-tasks-PENDIENTE')
				}else if(res.data.EN_PROCESO > 0) {
					setActiveTab('tab-tasks-EN_PROCESO')
				}else if(res.data.TERMINADO > 0) {
					setActiveTab('tab-tasks-TERMINADO')
				}
			})
		}

	}, [])

	const breadcrumbs = [
		{ title: 'Conflictos de Interés', icon: 'branches', link: './' + client.abreviado },
	]

	const exportForms = () => {
		ReportService.read('/portal/excelCDIDeclarationsByRecordId/' + currentUser.id, null, null, "declaraciones.xlsx")
	}

	const changeContent = (component) => {
		setContent(component)
	}

	const changeTabHeaderAction = () => {
		handleTabChange('tab-declaraciones');
	}

	return (
		<div className="stakeholder-private">
			<Content>
				{ content !== null ?
					content
				:
				<>
					<PageTopBar breadcrumbs={ [] } />
					<Page>
						<PageHeader
							title="Portal de Usuarios"
							description={ t('messages.aml.category.' + currentUser.category) }
							icon="user"
							hasAdvice={hasPendent}
							formAction={changeTabHeaderAction.bind(this)}
							/>
						<PageContent className="minisite-stakeholder">
							<Sidebar client={client} activeTab={ activeTab } onTabChange={ handleTabChange } edoTasks = {edoTasks} />
							<ContentLayout>
								{ activeTab === 'tab-newdeclaraciones' &&
									<TabCdiForms client={client} currentUser={currentUser} />
								}
								{ activeTab === 'tab-old-decl' &&
									<TabNewRequest client={client} currentUser={currentUser} />
								}
								{ activeTab === 'tab-declaraciones' &&
									<TabDeclarations client={client} currentUser={currentUser} />
								}
								{ activeTab.startsWith ('tab-tasks-') &&
									<TabTasks key={activeTab} status={activeTab.substring(10)} currentUser={currentUser} callback={changeContent}/>
								}
								{ activeTab === 'tab-reporte' &&
									<div style={{padding: '0px 10px'}}>
										<Button type="primary" icon="file-excel" onClick={exportForms}>Descargar Reporte</Button>
									</div>
								}
								{ activeTab === 'tab-onboarding' &&
									<div>
										<TabOnboarding client={client} currentUser={currentUser}/>
									</div>
								}
							</ContentLayout>
						</PageContent>
					</Page>
				</>
				}
			</Content>
		</div>
	)
}

export default StakePrivate
