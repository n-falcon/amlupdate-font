import './TabAlerts.scss'
import './newItemModal.scss'
import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"
import moment from 'moment'
import { AutoComplete, Button, Col, Icon, Pagination, Row, Spin, Modal, Empty } from 'antd'
import { getItemsPromise } from './promises'
import { camelizerHelper } from '../../../../helpers/'
import { ModalNewAlert,AdvancedTabs } from "./components";
//import { AlertManagerPage } from "../../..";
import { useTranslation } from 'react-i18next';


const TabAlerts = ({ type, currentUser, categories, alertStatus }) => {
	const [items, setItems ] = useState([])
	const [clickedIndex, setClickedIndex] = useState(-1);
	const [clickedItem, setClickedItem] = useState({})
	const [visibleAlertManager, setVisibleAlertManager] = useState(false)
	const [isAdvancedSearchVisible, setIsAdvancedSearchVisible] = useState(null)
	const [isItemsLoading, setIsItemsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsTotalNum, setItemsTotalNum] = useState(-1)
	const history = useHistory()
	const itemsPerPage = 10;
	const [filters, setFilters] = useState({});
  const { Option } = AutoComplete
  const [isModalNewAlertVisible, setIsNewAlertModalVisible] = useState(false)
	const [ hasEmpresa, setHasEmpresa ] = useState(false)
	const {t} = useTranslation()

	useEffect(() => {
		if(currentUser.cliente.outsourcer && currentUser.cliente.clientes !== null && currentUser.cliente.clientes.length>0 && currentUser.subcliente === null) {
			setHasEmpresa(true)
		}
		handleSearch(1, {})
	}, [])



	const handleSearch = async(page, filters) => {
		setIsItemsLoading(true)

		const fromNum = ((page - 1) * itemsPerPage)
		filters.from = fromNum;
    	filters.size = itemsPerPage;
		filters.estado = alertStatus;

    const apiResponse = await getItemsPromise(type, filters)
		setItems(apiResponse.data.records)
		setItemsTotalNum(apiResponse.data.total)
		setCurrentPage(page)

    setIsItemsLoading(false)
	}

	const cbFilters = (objFilters) => {
    setFilters(objFilters);
    handleSearch(1, objFilters);
  };

	const handlePaginationChange = async (value) => {
		handleSearch(value, filters)
  }

	const handleShowAdvancedSearch = () => {
		setIsAdvancedSearchVisible(true)
	}

	const handleHideAdvancedSearch = () => {
		setIsAdvancedSearchVisible(false)
	}

	const handleTableOnRow = (record, index) => {
		setClickedIndex(index);
		setClickedItem(record)
		setVisibleAlertManager(true)
    //history.push('/monitoreo/alerta/' + record.id)
	}

  const handleOpenNewAlertModal = () => {
    setIsNewAlertModalVisible(true)
  }

	const closeModalHandler = (reload) => {
		setIsNewAlertModalVisible(false)
		if(reload === true) {
			handleSearch(currentPage, filters)
		}
	}

	const closeModalAlertHandler = () => {
		setVisibleAlertManager(false)
	}

	const getHandlePrevItem = () => {
		if (clickedIndex <= 0) {
			return null;
		} else {
			return () => {
				setClickedItem(items[clickedIndex - 1]);
				setClickedIndex(clickedIndex - 1);
			};
		}
	};

	const getHandleNextItem = () => {
		if (clickedIndex >= items.length - 1) {
			return null;
		} else {
			return () => {
				setClickedItem(items[clickedIndex + 1]);
				setClickedIndex(clickedIndex + 1);
			};
		}
	};

	return (
    <>
		<div className="tab-alerts">
			<div className="top-bar" id="top-bar-tab-task">
				{ type === 'EVENTO' && <Button type="primary" icon="plus" className="add-button" onClick={ handleOpenNewAlertModal }>Nueva Alerta Personalizada</Button>
				}
        <div
          className={
            isAdvancedSearchVisible ? "advanced-search on" : "advanced-search"
          }
          onClick={
            !isAdvancedSearchVisible
              ? handleShowAdvancedSearch
              : handleHideAdvancedSearch
          }
        >
          <Icon type="menu" /> &nbsp;
          <span>Búsqueda avanzada</span> &nbsp;
          <Icon type={!isAdvancedSearchVisible ? "down" : "close"} />
        </div>
      </div>

      <div
        className={
          isAdvancedSearchVisible === null
            ? "filters-wrapper null"
            : isAdvancedSearchVisible
            ? "filters-wrapper show"
            : "filters-wrapper hide"
        }
      >
        <div className="filters-wrapper-inner">
          {/* <AdvancedNav type={type} cbFilters={cbFilters} /> */}
					<AdvancedTabs
						type={type}
            			cbFilters={cbFilters}
						currentUser={currentUser}
						alertStatus={alertStatus}
          />
        </div>
      </div>

			{ itemsTotalNum > 0 ?
			<div className="alerts-pseudo-table">
				<div className="thead">
				<div className="thead-alerts section">
					<h4><Icon type="warning" />&nbsp; { type === 'EVENTO' ? 'Alertas Personalizadas' : 'Alertas'}</h4>
					<div className="th">
					<div className="th-inner">
						<p>Fecha de Recepción</p>
						<p>Riesgo / Puntaje</p>
					</div>
					</div>
					<div className="th">
					<div className="th-inner">
						<p>Folio</p>
						<p>Estado</p>
					</div>
					</div>
					<div className="th">
					<div className="th-inner">
						<p>Fecha asignación</p>
						<p>Usuario asignado</p>
					</div>
					</div>
					<div className="th">
					<div className="th-inner">
										<p>Fecha final</p>
										{alertStatus === 'CLOSED' && <p>Fecha Cierre</p>}
										{ type === 'EVENTO' && <p>Creada por</p> }
					</div>
					</div>
				</div>
				<div className="thead-tasks section">
					<h4><Icon type="check-square" />&nbsp; Tareas</h4>
					<div className="th">
					<div className="th-inner">
						<p>Tareas totales</p>
						<p>Tareas completadas</p>
					</div>
					</div>
				</div>
				</div>
					{ isItemsLoading ?
							<div className="spinner"><Spin size="large" spinning="true" /></div>
							:
			        <div className="tbody">
			          {
			            items.map((item, index) =>
			              <div className="alert-item" onClick={ () => handleTableOnRow(item, index) }>
			                  <div className="alert-title">
			                    { item.name ?
														<>{ camelizerHelper(item.name) + ' / ' + item.rut }</>
														:
														item.description !== null ? item.description.name : ''
													}
			                  </div>
			                  <Row>
			                    <Col span="4">
			                      <div className="col-inner">
			                        <p>{ moment(item.creationDate).format('DD/MM/YYYY') }</p>
			                        <p>
			                          <span className="circle-type circle">{ item.type.charAt(0) }</span>&nbsp; / &nbsp;
			                          <span className="circle-score circle">{ item.score }</span>
			                        </p>
			                      </div>
			                    </Col>
			                    <Col span="4">
			                      <div className="col-inner">
			                        <p>{ item.folio }</p>
			                        <p>{ t('messages.aml.alert.status.' + item.status) }</p>
			                      </div>
			                    </Col>
			                    <Col span="4">
			                      <div className="col-inner">
			                        { item.assign !== null ? <p>{ moment(item.assign.date).format('DD/MM/YYYY') }</p> : <p>N / A</p> }
			                        { item.assign !== null ? <p>{ item.assign.userName }</p> : <p>N / A</p> }
			                      </div>
			                    </Col>

			                    <Col span="4">
			                      <div className="col-inner">
			                        { item.fecPlazo !== null ? <p>{ moment(item.fecPlazo).format('DD/MM/YYYY') }</p>:<p>N / A</p> }
									{ alertStatus === 'CLOSED' && <p>{ moment(item.dateStatus).format('DD/MM/YYYY') }</p>}
									{ type === 'EVENTO' && <p>{ item.username }</p> }

			                      </div>
			                    </Col>

			                    <Col span="4">
			                      <div className="col-inner">
			                        <p>{ item.nroTareas }</p>
			                        <p>{ item.nroTareasComp }</p>
			                      </div>
			                    </Col>
			                  </Row>
			              </div>
			            )
			          }
			        </div>
					}
	        <div className="bottom-bar">
	          <Pagination onChange={ handlePaginationChange } pageSize={ itemsPerPage } current={ currentPage } total={ itemsTotalNum } />
	        </div>
				</div>
				:
				itemsTotalNum === 0 && <Empty/>
			}
    </div>
		{ isModalNewAlertVisible &&
      <Modal
        className="new-item-modal"
        header={ null }
        footer={ null }
        visible={ true }
        onOk={ closeModalHandler  }
        onCancel={ closeModalHandler }
        >
        <ModalNewAlert closeModalHandler={closeModalHandler} categories={categories}/>
      </Modal>
		}
		{ visibleAlertManager &&
			<Modal
				className="alert-manager"
				visible={ true }
				header={ null }
				footer={ null }
				onCancel={ closeModalAlertHandler }
				style={{top: '50px'}}
				bodyStyle={{padding: '0px 0px 0px 0px'}}
				>
				{/*<AlertManagerPage
					key={"alert-detail-" + clickedItem.id}
					currentPage={currentPage}
					item={clickedItem} currentUser={currentUser}
					closeOverlayAlerta={closeModalAlertHandler}
					handlePrevItem={getHandlePrevItem()}
					handleNextItem={getHandleNextItem()}/>*/}
			</Modal>
		}
    </>
	)
}

export default TabAlerts
