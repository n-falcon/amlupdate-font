import './Collection.scss'
import React from 'react'
import { Col, Row } from 'antd'
import { Item } from '../'

const Collection = ({ items }) => {
	return (
		<div className="collection">
			<div className="collection-header">
				<Row>
					<Col span={2} style={{ textIndent: 25 }}>Tipo</Col>
					<Col span={10} style={{ textIndent: 5 }}>Asunto</Col>
					<Col span={3}>Recipientes</Col>
					<Col span={3}>Fecha de envío</Col>
					<Col span={3}>Periodicidad</Col>
					<Col span={3}>Estado</Col>
				</Row>
			</div>
			<div className="collection-body">
				{ items.data.map(item => <Item item={ item } />) }
			</div>
		</div>
	)
}

export default Collection
