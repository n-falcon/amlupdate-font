import "./TabSimulator.scss";
import React, { useEffect, useState, useRef } from "react";
import {
  Col,
  Row,
  Button,
  Radio,
  Checkbox,
  Pagination,
  Progress,
  Tooltip,
  Icon,
  Popconfirm,
} from "antd";
import { camelizerHelper } from "../../../../helpers/";
import { deleteSimulacionPromise } from "../../promises";
import { ModalNewSimulation } from "./components";
import { ModalViewSimulation } from "../";
import moment from "moment";
import { useTranslation } from "react-i18next";
import getSimulacionesPromise from "./components/ModalNewSimulation/getSimulaciones";

const TabSimulator = ({ type, currentUser }) => {
  const [items, setItems] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [itemsTotalNum, setItemsTotalNum] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [
    isNewSimulationModalVisible,
    setIsNewSimulationModalVisible,
  ] = useState(false);
  const [isModalViewVisible, setIsModalViewVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentActiveSim, setCurrentActiveSim] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    handlePaginationChange(1);
  }, []);

  const handleClear = (simId) => {
    deleteSimulacionPromise(simId).then((response) => {
    });
  };

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
      savedCallback.current = callback;
    });

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }

      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }, [delay]);
  }

  useInterval(() => {
    handlePaginationChange(currentPage);
  }, 1000);

  const handleTableOnRow = (item, index) => {
    setCurrentActiveSim(item);
    if (item.estado === "PENDING") {
      setIsNewSimulationModalVisible(true);
    } else {
      setIsModalViewVisible(true);
    }
  };

  const handleOpenNewSimulationModal = () => {
    setCurrentActiveSim(null);
    setIsNewSimulationModalVisible(true);
  };

  const handleCloseNewSimulationModal = () => {
    setIsNewSimulationModalVisible(false);
  };

  const handlePaginationChange = async (page) => {
    setIsLoading(true);

    const fromNum = (page - 1) * itemsPerPage;

    const apiResponse = await getSimulacionesPromise(fromNum, itemsPerPage);

    setItems(apiResponse.data.records);
    setItemsTotalNum(apiResponse.data.total);
    setCurrentPage(page);

    setIsLoading(false);
  };

  const handleModalViewSimulationClose = () => {
    setIsModalViewVisible(false);
  };

  const addS = (number) => (number > 1 ? "s" : "");

  return (
    <>
      <div className="tab-simulator">
        <div className="top-bar">
          <Button
            type="primary"
            icon="plus"
            onClick={() => handleOpenNewSimulationModal()}
          >
            Nueva Simulación
          </Button>
        </div>
        <div className="alerts-pseudo-table">
          <div className="thead">
            <div className="thead-alerts section">
              <h4>
                <Icon type="warning" />
                &nbsp; Simulaciones
              </h4>
              <div className="th" style={{ width: "33.333%" }}>
                <div className="th-inner">
                  <p>Fecha</p>
                  <p>Reglas modificadas</p>
                </div>
              </div>
              <div className="th" style={{ width: "33.333%" }}>
                <div className="th-inner">
                  <p>Tipo de riesgo</p>
                  <p>Periodo</p>
                </div>
              </div>
              <div className="th" style={{ width: "33.333%" }}>
                <div className="th-inner">
                  <p>Nro. de Operaciones</p>
                  <p>Nro. de Alertas</p>
                </div>
              </div>
            </div>
            <div className="thead-tasks section">
              <h4>
                <Icon type="check-square" />
                &nbsp; Estados
              </h4>
              <div className="th">
                <div className="th-inner">
                  <p>Estado Simulación</p>
                </div>
              </div>
              <div className="th">
                <div className="th-inner">
                  <p>Fecha</p>
                  <p>Autorizado por</p>
                </div>
              </div>
            </div>
          </div>
          <div className="tbody">
            {items !== undefined &&
              items.map((item, index) => (
                <div
                  className="alert-item"
                  onClick={() => handleTableOnRow(item, index)}
                >
                  <div className="alert-title">
                    {item.name}
                    {item.estado === "PENDING" && (
                      <Tooltip title="Eliminar Simulación">
                        <Popconfirm
                          title={["Confirma aplicar las reglas"]}
                          onConfirm={
                            (e) => {
                              e.stopPropagation();
                              handleClear(item.id);
                            }
                          }
                          okText="Sí"
                          cancelText="No"
                        >
                          <Button
                            icon="delete"
                            className="btn-clear"
                            shape="circle"

                          />
                        </Popconfirm>
                      </Tooltip>
                    )}
                  </div>

                  <Row>
                    <Col span="4">
                      <div className="col-inner">
                        <p>{moment(item.fecha).format("DD/MM/YYYY")}</p>
                        <p>
                          {item.nroReglasMod} / {item.nroReglas}
                        </p>
                      </div>
                    </Col>
                    <Col span="4">
                      <div className="col-inner">
                        <p>Transaccional</p>
                        <p>
                          {item.period.substr(0, item.period.indexOf(" ")) +
                            " " +
                            t(
                              "messages.aml.period." +
                                item.period.split(" ").pop() +
                                addS(
                                  parseInt(
                                    item.period.substr(
                                      0,
                                      item.period.indexOf(" ")
                                    ),
                                    10
                                  )
                                )
                            )}
                        </p>
                      </div>
                    </Col>
                    <Col span="4">
                      <div className="col-inner">
                        <p>{item.nroTransacciones}</p>
                        <p>{item.nroAlertas}</p>
                      </div>
                    </Col>
                    <Col className="last-one" span="15">
                      <div className="col-inner">
                        <div className="area-1 area">
                          <p>
                            &nbsp;&nbsp;{" "}
                            {t("messages.aml.monitor.status." + item.estado)}
                          </p>
                          {item.estado === "EXECUTING" && (
                            <p>
                              &nbsp;&nbsp;{" "}
                              <Progress
                                size="small"
                                percent={parseInt(
                                  (item.nroTransaccionesProc * 100) /
                                    item.nroTransacciones
                                )}
                              />
                            </p>
                          )}
                        </div>
                        <div className="area-2 area">
                          <p>
                            {item.fecEstado
                              ? moment(item.fecEstado).format("DD/MM/YYYY")
                              : "-"}
                          </p>
                          <p>{item.userEstado ? item.userEstado : "-"}</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              ))}
          </div>
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
      </div>
      {isNewSimulationModalVisible && (
        <ModalNewSimulation
          currentUser={currentUser}
          isVisible={isNewSimulationModalVisible}
          onClose={handleCloseNewSimulationModal}
          simulation={currentActiveSim}
        />
      )}
      {isModalViewVisible && currentActiveSim !== null && (
        <ModalViewSimulation
          currentUser={currentUser}
          isVisible={ModalViewSimulation}
          handleClose={handleModalViewSimulationClose}
          sim={currentActiveSim}
        />
      )}
    </>
  );
};

export default TabSimulator;
