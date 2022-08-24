import "./TabAlertsSimulator.scss";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import {
  Col,
  Icon,
  Pagination,
  Row,
  Spin,
  Modal,
  Empty,
  Button,
  notification,
  Popconfirm,
} from "antd";
import { getItemsPromise } from "./promises";
import { camelizerHelper } from "../../../../helpers/";
import { AdvancedTabs } from "./components";
import { useTranslation } from "react-i18next";
import { AlertManagerSimulator } from "../";
import { aplicarSimulacionPromise } from "../../promises";
import { ReportService } from "../../../../services";

const TabAlertsSimulator = ({ currentUser, categories, sim }) => {
  const [items, setItems] = useState([]);
  const [clickedItem, setClickedItem] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(-1);
  const [isAdvancedSearchVisible, setIsAdvancedSearchVisible] = useState(null);
	const [isItemsLoading, setIsItemsLoading] = useState(false);
	const [isFileLoading, setIsFileLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsTotalNum, setItemsTotalNum] = useState(-1);
  const history = useHistory();
  const itemsPerPage = 10;
  const [filters, setFilters] = useState({});
  const [hasEmpresa, setHasEmpresa] = useState(false);
  const { t } = useTranslation();
  const [estado, setEstado] = useState(sim.estado);

  const handleDownloadReport = async () => {
		setIsFileLoading(true)
    await ReportService.read(
      "/transaction/reportSimulacion/" + sim.id,
      filters,
      null,
      "simulacion" + ".xlsx"
		);
		setIsFileLoading(false)
  };

  useEffect(() => {
    if (
      currentUser.cliente.outsourcer &&
      currentUser.cliente.clientes !== null &&
      currentUser.cliente.clientes.length > 0 &&
      currentUser.subcliente === null
    ) {
      setHasEmpresa(true);
    }
    handleSearch(1, {});
  }, []);

  const handleAplicar = (simId, status) => {
    aplicarSimulacionPromise(simId, status).then((response) => {
      setEstado(status);
      if (response.success === true) {
        notification.success({
          message: t("messages.aml.successfulOperation"),
          description:
            status === "APPLIED"
              ? "Simulación Aplicada"
              : "Simulación Descartada",
        });
      }
    });
  };

  const handleSearch = async (page, filters) => {
    setIsItemsLoading(true);
    const fromNum = (page - 1) * itemsPerPage;
    filters.from = fromNum;
    filters.size = itemsPerPage;
    filters.simId = sim.id;
    const apiResponse = await getItemsPromise("SIMULADOR", filters);
    setItems(apiResponse.data.records);
    setItemsTotalNum(apiResponse.data.total);
    setCurrentPage(page);

    setIsItemsLoading(false);
  };

  const cbFilters = (objFilters) => {
    setFilters(objFilters);
    handleSearch(1, objFilters);
  };

  const handlePaginationChange = async (value) => {
    handleSearch(value, filters);
  };

  const handleShowAdvancedSearch = () => {
    setIsAdvancedSearchVisible(true);
  };

  const handleHideAdvancedSearch = () => {
    setIsAdvancedSearchVisible(false);
  };

  const handleTableOnRow = (record, index) => {
    setClickedItem(record);
    setClickedIndex(index);
  };

  const closeOverlayAlerta = () => {
    setClickedItem(null);
    setClickedIndex(-1);
  };

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
      <div className="tab-alerts-simulator">
        <div className="top-bar" id="top-bar-tab-task">
          <Row className="header-description-row" type="flex">
            <Col span={14}>
              <div className="header-description-col">
                El proceso de simulación se ejecutó sobre{" "}
                <strong>{sim.nroTransacciones}</strong> transacciones,
                resultando en <strong>{sim.nroAlertas}</strong> alertas.​
                {estado === "FINALIZED" && (
                  <>
                    <br />
                    <div>
                      Si desea aplicar las modificaciones realizadas a las
                      reglas presione aquí{" "}
                      <Popconfirm
                        title={["Confirma aplicar las reglas"]}
                        onConfirm={(e) => handleAplicar(sim.id, "APPLIED")}
                        okText="Sí"
                        cancelText="No"
                      >
                        <Button
                          className="save-button"
                          type="primary"
                          size="small"
                        >
                          Aplicar
                        </Button>
                      </Popconfirm>{" "}
                    </div>

                    <div>
                      Y si no aplicará las reglas pero desea dejar registro
                      presione aquí{" "}
                      <Popconfirm
                        title={["Confirma descartar las reglas"]}
                        onConfirm={(e) => handleAplicar(sim.id, "DISCARDED")}
                        okText="Sí"
                        cancelText="No"
                      >
                        <Button
                          className="save-button"
                          type="primary"
                          size="small"
                        >
                          Descartar
                        </Button>
                      </Popconfirm>
                    </div>
                  </>
                )}
              </div>
            </Col>

            <Col span={5}>
              <div className="excel-download">
                <Button
                  disabled={isFileLoading}
                  icon= {isFileLoading ? "loading":"file-excel"}
                  className="btn-report"
                  type="ghost"
                  onClick={handleDownloadReport}
                >
                  Exportar Resultado
                </Button>
              </div>
            </Col>

            <Col span={5}>
              <div
                className={
                  isAdvancedSearchVisible
                    ? "advanced-search on"
                    : "advanced-search"
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
            </Col>
          </Row>
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
            <AdvancedTabs cbFilters={cbFilters} simId={sim.id} />
          </div>
        </div>

        {itemsTotalNum > 0 ? (
          <div className="alerts-pseudo-table">
            <div className="thead">
              <div className="thead-alerts section">
                <h4>
                  <Icon type="warning" />
                  &nbsp;Alertas
                </h4>
                <div className="th">
                  <div className="th-inner">
                    <p>Fecha</p>
                  </div>
                </div>
                <div className="th">
                  <div className="th-inner">
                    <p>Riesgo / Puntaje</p>
                  </div>
                </div>
                <div className="th">
                  <div className="th-inner">
                    <p>Folio</p>
                  </div>
                </div>
              </div>
            </div>
            {isItemsLoading ? (
              <div className="spinner">
                <Spin size="large" spinning="true" />
              </div>
            ) : (
              <div className="tbody">
                {items.map((item, index) => (
                  <div
                    className="alert-item"
                    onClick={() => handleTableOnRow(item, index)}
                  >
                    <div className="alert-title">
                      {camelizerHelper(item.name) + " / " + item.rut}
                    </div>
                    <Row>
                      <Col span="8">
                        <div className="col-inner">
                          <p>
                            {moment(item.creationDate).format("DD/MM/YYYY")}
                          </p>
                        </div>
                      </Col>
                      <Col span="8">
                        <div className="col-inner">
                          <p>
                            <span className="circle-type circle">
                              {item.type.charAt(0)}
                            </span>
                            &nbsp; / &nbsp;
                            <span className="circle-score circle">
                              {item.score}
                            </span>
                          </p>
                        </div>
                      </Col>
                      <Col span="8">
                        <div className="col-inner">
                          <p>{item.folio}</p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>
            )}
            <div className="bottom-bar">
              {itemsTotalNum > 0 && (
                <Pagination
                  onChange={handlePaginationChange}
                  pageSize={itemsPerPage}
                  current={currentPage}
                  total={itemsTotalNum}
                />
              )}
            </div>
          </div>
        ) : (
          itemsTotalNum === 0 && <Empty />
        )}
      </div>
      {clickedItem !== null && (
        <div id="overlay-alert-detail-simulator">
          <AlertManagerSimulator
            key={"alert-detail-" + clickedItem.id}
            alertId={clickedItem.id}
            currentPage={currentPage}
            closeOverlayAlerta={closeOverlayAlerta}
            handlePrevItem={getHandlePrevItem()}
            handleNextItem={getHandleNextItem()}
          />
        </div>
      )}
    </>
  );
};

export default TabAlertsSimulator;
