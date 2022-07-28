import './Reporting.scss'
import React, { useEffect, useState, moment } from 'react'
import {Tabs, TabPane } from 'antd';
import {Row, Col} from 'antd'
import { getDeclarationsPromise } from '../../promises';
import {ReportingFormPage} from './components'

const Reporting = ({currentUser}) => {

	  const cat = [
		  {
            tab: "Gestión de Formularios",
		  	key: "form"
		  },
		  {
            tab: "Gestion de Fichas",
		  	key: "ficha"
		  },
	  ]

    return (
        <div className="reporting-content">
            <Row>
                <Col span={24}>
                    <div className="reporting-tabs">
                        <Tabs defaultActiveKey="form" size="small" type="card">
                            {cat.map(i =>
                                <Tabs.TabPane tab={i.tab} key={i.key}>
                                    <ReportingFormPage report={i.key} currentUser={currentUser} key={Math.random()} />
                                </Tabs.TabPane>
                            )}
                        </Tabs>
                    </div>
                </Col>
            </Row>
        </div>
    );
}
export default Reporting
