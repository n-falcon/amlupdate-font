import "./TabMonitoreo.scss";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Icon, Pagination, Spin, Empty,notification } from "antd";
import { saveRegistroPromise,getMonitorRegistrosPromise,getAlertasByRegistroPromise } from "../../promises";

import { ModalViewMonitoreo } from "../";
import { useTranslation } from "react-i18next";
import { AdvancedTabs } from "./components";
import personIcon from "../../../Query/components/PersonCard/person-icon.png";
import entityIcon from "../../../Query/components/PersonCard/entity-icon.png";


const TabMonitoreo = ({ type, currentUser }) => {
  const [items, setItems] = useState([]);
  const [clickedItem, setClickedItem] = useState({});
  const [isAdvancedSearchVisible, setIsAdvancedSearchVisible] = useState(null);
  const [isItemsLoading, setIsItemsLoading] = useState(false);
  const [itemsTotalNum, setItemsTotalNum] = useState(-1);
  const [isModalViewMonitoreoVisble, setIsModalViewMonitoreoVisible] = useState(
    false
  );
  const [alertItems,setAlertItems] = useState(null)
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { t } = useTranslation();

  const handleChangeModalViewMonitoreo = async (objModal) => {
    const response = await saveRegistroPromise(objModal);
    if (response.success === true) {
      notification.success({
        message: t("messages.aml.successfulOperation"),
      });
    }
    const index = items.findIndex((obj) => obj.id === objModal.id);
    const array = items;
    array[index] = response.data;
    setItems(array);
    handleModalCancel();
  };

  const handleModalCancel = () => {
    setIsModalViewMonitoreoVisible(false);
  };

  useEffect(() => {
    handleSearch(1, {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (page, filters) => {
    setIsItemsLoading(true);
    const fromNum = (page - 1) * itemsPerPage;
    filters.from = fromNum;
    filters.size = itemsPerPage;
    const items = await getMonitorRegistrosPromise(type, filters);
    setItems(items.data.records);
    setItemsTotalNum(items.data.total);
    setCurrentPage(page);
    setIsItemsLoading(false);
  };

  const handleOnRowClick = async (item) => {
    setIsModalViewMonitoreoVisible(true);
    setClickedItem(item);
    const response = await getAlertasByRegistroPromise(item.id)
    setAlertItems(response.data)
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

  const cbFilters = (objFilters) => {
    setFilters(objFilters);
    handleSearch(1, objFilters);
  };

  const renderType = (type) => {
    if (type === "Person") {
      return personIcon;
    }

    if (type === "Entity") {
      return entityIcon;
    }
  };

  return (
    <div className="tab-monitoreo">
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
          <AdvancedTabs
            category={type}
            cbFilters={cbFilters}
            currentUser={currentUser}
          />
        </div>
      </div>

      {itemsTotalNum > 0 ? (
        <div className="custom-table">
          <div className="custom-table-head">
            <h4>
              <Icon type="team" />
              &nbsp;&nbsp; Monitoreo de Personas
            </h4>
            <div className="th">
              <div className="th-inner">
                <p>Grupo</p>
                <p>Tipo persona</p>
              </div>
            </div>
            <div className="th">
              <div className="th-inner">
                <p>Riesgo Persona</p>
              </div>
            </div>
            <div className="th">
              <div className="th-inner">
                <p>Riesgo Demográfico</p>
              </div>
            </div>
            <div className="th">
              <div className="th-inner">
                <p>Riesgo Transaccional</p>
                <p></p>
              </div>
            </div>
            <div className="th">
              <div className="th-inner">
                <p>Riesgo Asignado</p>
              </div>
            </div>
            <div className="th">
              <div className="th-inner">
                <p>Última alerta</p>
                <p>Asignado a</p>
              </div>
            </div>
          </div>
          {isItemsLoading ? (
            <div className="spinner">
              <Spin size="large" spinning="true" />
            </div>
          ) : (
            <div className="custom-table-body">
              {items.map((item, index) => (
                <div className="item" onClick={(e) => handleOnRowClick(item)}>
                  <div className="item-title">
                    <h4>
                      {item.record.nombre}&nbsp; / &nbsp; {item.record.rut}
                    </h4>
                  </div>
                  <div className="th">
                    <div className="th-inner">
                      <p>{item.group === null ? "-" : item.group}</p>
                      <p>
                        <img
                          src={renderType(item.type)}
                          alt=""
                          style={{
                            width: 35,
                            height: 35,
                            marginTop: -5,
                            marginLeft: -10,
                            opacity: 0.5,
                          }}
                        />
                      </p>
                    </div>
                  </div>
                  <div className="th">
                    <div className="th-inner">
                      <div
                        className={"circle standard risk-" + item.personRisk}
                        title={
                          t("messages.aml.risk") +
                          ": " +
                          t("messages.aml.risk." + item.personRisk)
                        }
                      >
                        {t("messages.aml.risk.char." + item.personRisk)}
                      </div>
                      <div className="circle-label">R.Persona</div>
                    </div>
                  </div>
                  <div className="th">
                    <div className="th-inner">
                      { currentUser.cliente.modules.includes('MONITOR-T') ?
                        <div
                          className={"circle risk-" + item.demoRisk}
                          title={
                            t("messages.aml.risk") +
                            ": " +
                            t("messages.aml.risk." + item.demoRisk)
                          }
                        >
                          {t("messages.aml.risk.char." + item.demoRisk)}
                        </div>
                        :
                        <div className="circle">
                          <Icon type="lock"/>
                        </div>
                      }
                      <div className="circle-label">R.Demográfico</div>
                    </div>
                  </div>
                  <div className="th">
                    <div className="th-inner">
                      { currentUser.cliente.modules.includes('MONITOR-T') ?
                        <div
                          className={"circle risk-" + item.transRisk}
                          title={
                            t("messages.aml.risk") +
                            ": " +
                            t("messages.aml.risk." + item.transRisk)
                          }
                        >
                          {t("messages.aml.risk.char." + item.transRisk)}
                        </div>
                        :
                        <div className="circle">
                          <Icon type="lock"/>
                        </div>
                      }
                      <div className="circle-label">R.Transaccional</div>
                    </div>
                  </div>
                  <div className="th">
                    <div className="th-inner">
                      <div
                        className={"circle assigned risk-" + item.riskAsigned}
                        title={
                          t("messages.aml.risk") +
                          ": " +
                          t("messages.aml.risk." + item.riskAsigned)
                        }
                      >
                        {t("messages.aml.risk.char." + item.riskAsigned)}
                      </div>
                      <div className="circle-label">R.Asignado</div>
                    </div>
                  </div>
                  <div className="th">
                    <div className="th-inner">
                      <p>
                        {item.dateLastAlert !== null
                          ? moment(item.dateLastAlert).format("DD/MM/YYYY")
                          : "-"}
                      </p>
                      <p>{item.asignedTo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="bottom-bar">
            <Pagination
              onChange={handlePaginationChange}
              pageSize={itemsPerPage}
              current={currentPage}
              total={itemsTotalNum}
            />
          </div>
        </div>
      ) : (
        itemsTotalNum === 0 && <Empty />
      )}

      {isModalViewMonitoreoVisble && alertItems !==null && (
        <ModalViewMonitoreo
          handleChangeModal={handleChangeModalViewMonitoreo}
          modalItem={clickedItem}
          onCancel={handleModalCancel}
          historyTable = {alertItems}
          currentUser = {currentUser}
        />
      )}
    </div>
  );
};

export default TabMonitoreo;
