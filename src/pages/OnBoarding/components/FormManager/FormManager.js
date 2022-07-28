import './FormManager.scss'
import React, { useState, useEffect } from 'react';
import {Tabs } from 'antd';
import {Row, Col, Input, Icon } from 'antd'
import {FormTablePage} from './components'
import { getAreasPromise } from '../../promises';

const FormManager = ({options}) => {

	const [rut, setRut] = useState(null)
	const [ opt, setOpt ] = useState(options)
	const [isAdvancedSearchVisible, setIsAdvancedSearchVisible] = useState(null)
	const [areas, setAreas] = useState(null)

	useEffect(() => {
		getAreasPromise().then((areas) => {
			setAreas(areas)
		})
	}, []);

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
		}
	]

    return (
		<div className="onb-form-manager">
			<div className="top-bar-form-manager">
				<Row>
					<Col span={5} push={18}>
						<Input.Search
							placeholder={"Buscar nombre o rut"}
							style={{ width: "100%", marginTop: "0px", position: 'absolute', zIndex: '1' }}
							onSearch={(value) => {setRut(value)}}
							allowClear
						/>
					</Col>
					<Col span={1} push={18}>
						<div style={{position: "absolute", zIndex: '1'}}className={isAdvancedSearchVisible ? 'advanced-search on' : 'advanced-search'} onClick={!isAdvancedSearchVisible ? () => {setIsAdvancedSearchVisible(true)} : () => {setIsAdvancedSearchVisible(false)}}>
							<Icon style={{fontSize: '20px', marginTop: 5, marginLeft: 10, cursor: 'pointer'}} type={!isAdvancedSearchVisible ? 'filter' : 'close'} />
						</div>
					</Col>
				</Row>
			</div>
			<div className="form-manager-content">
				<Row>
					<Col span={24}>
						{areas &&
							<Tabs defaultActiveKey={options && options.category ? options.category : "CLIENTE"} size="small" type="card" onChange={() => setOpt(null)}>
								{cat.map(i =>
									<Tabs.TabPane tab={i.tab} key={i.key}>
										<FormTablePage key={i.key+"-"+rut} categoria={i.key} rut={rut} options={opt} isAdvancedSearchVisible={isAdvancedSearchVisible} areas={areas}/>
									</Tabs.TabPane>
								)}
							</Tabs>
						}
					</Col>
				</Row>
			</div>
		</div>
    );
}
export default FormManager
