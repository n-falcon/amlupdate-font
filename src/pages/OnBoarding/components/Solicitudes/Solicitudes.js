import './Solicitudes.scss'
import React, { useEffect, useState, moment } from 'react'
import {Tabs, TabPane } from 'antd';
import {Row, Col, DatePicker, Input } from 'antd'
import {ReqTablePage} from './components'
import { getDeclarationsPromise } from '../../promises';

const Solicitudes = ({currentUser}) => {

	const [categoria, setCategoria] = useState("CLIENTE");
	const [dateRange, setDateRange] = useState(null)
	const [key, setKey] = useState(Math.random())

	const handleRangeChange = (value) => {
		setDateRange(value)
		setKey(Math.random())
	}

	const handleChange = () => {

	}

	  const cat = [
		  {
				tab: "Clientes",
		  	key: "CLIENTE"
		  },
		  {
				tab: "Colaboradores",
		  	key: "COLABORADOR"
		  },
			{
				tab: "Proveedores",
		  	key: "PROVEEDOR"
		  },
		  {
				tab: "Directores",
		  	key: "DIRECTOR"
		  },
	  ]

    return (
		<>
			<div className="top-bar-solicitudes">
				<Row>
					<Col span={6} push={18}>
						<DatePicker.RangePicker
							placeholder={["Fec. Inicio", "Fec. Hasta"]}
							format = 'DD/MM/YYYY'
							style={{ width: "100%", marginTop: "0px", position: 'absolute', zIndex: '1' }}
							onChange={handleRangeChange}
						/>
					</Col>
				</Row>
			</div>
			<div className="solicitudes-content">
				<Row>
					<Col span={24}>
						<Tabs defaultActiveKey="CLIENTE" size="small" type="card">
							{cat.map(i =>
								<Tabs.TabPane tab={i.tab} key={i.key}>
									<ReqTablePage categoria={i.key} dateRange={dateRange} currentUser={currentUser} key={i.key + '-' + key}/>
								</Tabs.TabPane>
							)}
						</Tabs>
					</Col>
				</Row>
			</div>
		</>
    );
}
export default Solicitudes
