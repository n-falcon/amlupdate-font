import "./TabTasks.scss";
import React, { useCallback, useEffect, useState } from "react";
import {
  Icon,
  Pagination,
  Menu,
  Empty,
} from "antd";
import { PortalAlertManager } from "..";
import { getTareasPromise } from "./promises";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { camelizerHelper } from "../../../../helpers";
import { AdvancedNav,AdvancedTabs } from "../";

const TabTask = ({ currentUser, callback, status }) => {
  const [items, setItems] = useState([]);
  const history = useHistory();
  const [itemsTotalNum, setItemsTotalNum] = useState(-1);
  const itemsPerPage = 5;
  const [isItemsLoading, setIsItemsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();
  const { SubMenu, Item } = Menu;
  const [advancedObj, setAdvancedObj] = useState({});
  const [isAdvancedSearchVisible, setIsAdvancedSearchVisible] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    handleSearch(1, {});
  }, []);

  const handleSearch = async (page, filters) => {
    setIsItemsLoading(true);
    const fromNum = (page - 1) * itemsPerPage;
    filters.from = fromNum;
    filters.size = itemsPerPage;
    const apiResponse = await getTareasPromise(status, currentUser.id, filters);
    setItems(apiResponse.data.records);
    setItemsTotalNum(apiResponse.data.total);
    setCurrentPage(page);
    setIsItemsLoading(false);
  };

  const handleShowAdvancedSearch = () => {
    setIsAdvancedSearchVisible(true);
  };

  const handleHideAdvancedSearch = () => {
    setIsAdvancedSearchVisible(false);
  };

  const cbFilters = (objFilters) => {
    setFilters(objFilters);
    handleSearch(1, objFilters);
  };

  const handlePaginationChange = async (value) => {
    handleSearch(value, filters);
  };

  const clickReturnPortal = () => {
    callback(null);
  };

  const handleRowOnClick = (record, index) => {
    callback(
      <PortalAlertManager
        taskId={record.id}
        alertId={record.alert.id}
        clickReturnPortal={clickReturnPortal}
        currentUser={currentUser}
      />
    );
  };

  return (
    <div className="tab-tasks">
      <div className="top-bar" id="top-bar-tab-task">
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
          <AdvancedTabs cbFilters={cbFilters} userId = {currentUser.id} />
        </div>
      </div>

      <div className="tasks-pseudo-table">
        { !isItemsLoading &&
          <>
            { itemsTotalNum > 0 ?
              <div className="table-head">
                <div className="section">
                  <h4>
                    <Icon type="check-square" />
                    &nbsp;&nbsp;Tarea
                  </h4>
                  <div className="section-content">
                    <div className="section-content-half">
                      <div className="section-content-half-inner">
                        <p>Número</p>
                        <p>Solicitante</p>
                      </div>
                    </div>
                    <div className="section-content-half">
                      <div className="section-content-half-inner">
                        <p>Fecha de asignación</p>
                        <p>Estado</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="section">
                  <h4>
                    <Icon type="warning" />
                    &nbsp;&nbsp;Alerta
                  </h4>
                  <div className="section-content">
                    <div className="section-content-half">
                      <div className="section-content-half-inner">
                        <p>Fecha</p>
                        <p>Nombre</p>
                        <p>Rut</p>
                      </div>
                    </div>
                    <div className="section-content-half">
                      <div className="section-content-half-inner">
                        <p>Folio</p>
                        <p>Tipo riesgo / Puntaje</p>
                        <p>Categoría</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="section">
                  <h4>
                    <Icon type="double-left" />
                    &nbsp;&nbsp;Respuesta
                  </h4>
                  <div className="section-content">
                    <div className="section-content-half">
                      <div className="section-content-half-inner">
                        <p>Fecha final para responder</p>
                        <p>Avance fecha</p>
                      </div>
                    </div>
                    <div className="section-content-half">
                      <div className="section-content-half-inner">
                        <p>Fecha de última modificación</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              :
              <Empty/>
            }
          </>
        }


        <div className="table-body">
          {items.map((item, index) => (
            <div
              className="task-item"
              onClick={() => handleRowOnClick(item, index)}
            >
              <div className="task-name">{item.tarea}</div>
              <div className="section">
                <div className="data-block">
                  <div className="data-block-half">
                    <p>{item.nro}</p>
                    <p>{camelizerHelper(item.userAsig.name)}</p>
                  </div>
                  <div className="data-block-half">
                    <p>{moment(item.creationDate).format("DD/MM/YYYY")}</p>
                    <p>{t("messages.aml.request." + item.estado)}</p>
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="data-block">
                  <div className="data-block-half">
                    <p>
                      {moment(item.alert.creationDate).format("DD/MM/YYYY")}
                    </p>
                    <p>{camelizerHelper(item.alert.name)}</p>
                    <p>{item.alert.rut}</p>
                  </div>
                  <div className="data-block-half">
                    <p>{item.alert.folio}</p>
                    <p>
                      {item.alert.type === "DEMOGRAFICA" && (
                        <div className="squar" title="Riesgo Demográfico">
                          D
                        </div>
                      )}{" "}
                      {item.alert.type === "TRANSACCIONAL" && (
                        <div className="squar" title="Riesgo Transaccional">
                          T
                        </div>
                      )}
                      {item.alert.type === "PERSONA" && (
                        <div className="squar" title="Riesgo Persona">
                          P
                        </div>
                      )}
                      &nbsp; / &nbsp;
                      <div className="squar">{item.alert.score}</div>
                    </p>
                    <p>{t("messages.aml.category." + item.alert.category)}</p>
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="data-block">
                  <div className="data-block-half">
                    <div>{moment(item.fecPlazo).format("DD/MM/YYYY")}</div>
                    <div>{item.dias + " dias"}</div>
                  </div>
                  <div className="data-block-half">
                    <p>
                      {item.fecEstadoResp !== null
                        ? moment(item.fecEstadoResp).format("DD/MM/YYYY")
                        : "NA"}
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ clear: "both" }} />
            </div>
          ))}
        </div>
      </div>

      {itemsTotalNum > 0 && (
        <div className="bottom-bar">
          <Pagination
            onChange={handlePaginationChange}
            pageSize={itemsPerPage}
            current={currentPage}
            total={itemsTotalNum}
          />
        </div>
      )}
    </div>
  );
};

export default TabTask;
