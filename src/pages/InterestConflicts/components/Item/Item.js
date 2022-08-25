import './Item.scss'
import React from 'react'
import moment from 'moment'
import { Col, Icon, Row } from 'antd'
import iconGift from './icon-gift.png'

const Item = ({ item }) => {
	const handleRenderStatus = (status) => {
		switch (status) {
			case 'PENDING':
				return 'En cola'

			case 'PROCESSING':
				return 'Procesando'

			default:
				return 'Finalizado'
		}
	}

	return (
		<div className="item">
			<Row>
				<Col span={2}>
					<div className="col-inner">
						<div className="circle">
							<img src={ iconGift } alt="" />
						</div>
					</div>
				</Col>
				<Col span={10}>
					<div className="col-inner" style={{ fontSize: '1em' }}>
						{ item.subject }
					</div>
				</Col>
				<Col span={3}>
					<div className="col-inner" style={{ textIndent: 22, width: '100%' }}>
						{ item.nroRecipients }
					</div>
				</Col>
				<Col span={3}>
					<div className="col-inner">
						{ moment(item.date).format('DD/MM/YYYY') }
					</div>
				</Col>
				<Col span={3}>
					<div className="col-inner">
						{ item.periodicity }
					</div>
				</Col>
				<Col span={3}>
					<div className="col-inner">
						{ handleRenderStatus(item.status) } &nbsp;&nbsp;
					</div>
				</Col>
			</Row>
		</div>
	)
}

export default Item
