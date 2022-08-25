import "./AdvancedTabs.scss";
import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";
import moment from "moment";
import {
  Button,
  DatePicker,
  Input,
  Select,
  Menu,
  Badge,
  Tooltip,
  Tabs,
  Row,
  Col,
} from "antd";
import { useTranslation } from "react-i18next";
import { getUsersRespTareasPromise } from "../../promises";

const AdvancedTabs = ({ cbFilters, type, userId }) => {
  const { Option } = Select;
  const { SubMenu, Item } = Menu;
  const [elementLeft, setElementLeft] = useState(0);
  const [advancedObj, setAdvancedObj] = useState({});
  const [advancedObjMenu, setAdvancedObjMenu] = useState({
    m1: {},
    m2: {},
    m3: {},
  });
  const [responsables, setResponsables] = useState([]);
  const { TabPane } = Tabs;
  const { t } = useTranslation();

  useEffect(() => {
    getUsersRespTareasPromise(userId).then((response) => {
      const { data } = response;
      setResponsables(data);
    });
  }, []);

  const handlerChange = (menu, field, value, enter) => {
    const obj = { ...advancedObj, [field]: value };
    if (value === null || value === "") {
      delete obj[field];
    }
    setAdvancedObj(obj);
    if (enter) {
      let objMenu = advancedObjMenu[menu];
      const obj2 = { ...objMenu, [field]: value };
      if (value === null || value === "") {
        delete obj2[field];
      }
      const obj3 = { ...advancedObjMenu, [menu]: obj2 };

      cbFilters(obj);
      setAdvancedObjMenu(obj3);
    }
  };

  const enterHandler = (menu, field, value) => {
    handlerChange(menu, field, value, true);
  };

  const handleClear = () => {
    setAdvancedObj({});
    setAdvancedObjMenu({ m1: {}, m2: {}, m3: {} });
    cbFilters({});
  };

  return (
    <div className="adv-tabs-filters">
      <div className="filters-inner">
        <Tooltip title="Borrar Filtros">
          <Button
            icon="delete"
            className="btn-clear"
            shape="circle"
            ghost
            onClick={handleClear}
          />
        </Tooltip>
        <Tabs>
          <TabPane
            key="1"
            tab={
              <span>
                Tarea{" "}
                <Badge count={Object.entries(advancedObjMenu.m1).length} />
              </span>
            }
          >
            <Row gutter={16}>
              <Col span={4}>
                <Input
                  placeholder="nro tarea"
                  value={advancedObj.nroTarea}
                  onChange={(e) =>
                    handlerChange("m1", "nroTarea", e.target.value, false)
                  }
                  onPressEnter={(e) =>
                    enterHandler("m1", "nroTarea", e.target.value)
                  }
                />
              </Col>
              <Col span={4}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Solicitante"
                  value={advancedObj.solicitante}
                  onChange={(value) =>
                    handlerChange("m1", "solicitante", value, true)
                  }
                >
                  {responsables.map((responsable) => (
                    <Select.Option key={responsable.id} value={responsable.id}>
                      {responsable.name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={8}>
                <DatePicker.RangePicker
                  placeholder={["Fec. Asignación", "Hasta"]}
                  style={{ width: "100%" }}
                  value={
                    advancedObj.fechaAsignacion
                      ? [
                          moment(advancedObj.fechaAsignacion[0]),
                          moment(advancedObj.fechaAsignacion[1]),
                        ]
                      : null
                  }
                  onChange={(momentObj) =>
                    handlerChange(
                      "m1",
                      "fechaAsignacion",
                      momentObj !== null
                        ? [
                            moment(momentObj[0]).valueOf(),
                            moment(momentObj[1]).valueOf(),
                          ]
                        : null,
                      true
                    )
                  }
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane
            key="2"
            tab={
              <span>
                Alerta{" "}
                <Badge count={Object.entries(advancedObjMenu.m2).length} />
              </span>
            }
          >
            <Row gutter={16}>
              <Col span={8}>
                <DatePicker.RangePicker
                  placeholder={["Fecha Asignación", "Hasta"]}
                  style={{ width: "100%" }}
                  value={
                    advancedObj.fechaAsignacionAlerta
                      ? [
                          moment(advancedObj.fechaAsignacionAlerta[0]),
                          moment(advancedObj.fechaAsignacionAlerta[1]),
                        ]
                      : null
                  }
                  onChange={(momentObj) =>
                    handlerChange(
                      "m2",
                      "fechaAsignacionAlerta",
                      momentObj !== null
                        ? [
                            moment(momentObj[0]).valueOf(),
                            moment(momentObj[1]).valueOf(),
                          ]
                        : null,
                      true
                    )
                  }
                />
              </Col>
              <Col span={4}>
                <Input
                  placeholder="clave(Rut o Nombre)"
                  value={advancedObj.rutNombre}
                  onChange={(e) =>
                    handlerChange("m2", "rutNombre", e.target.value, false)
                  }
                  onPressEnter={(e) =>
                    enterHandler("m2", "rutNombre", e.target.value)
                  }
                />
              </Col>
              <Col span={4}>
              <Input
                      placeholder="folio"
                      style={{ width: "100%" }}
                      value={advancedObj.folio}
                      onChange={(e) =>
                        handlerChange("m2", "folio", e.target.value, false)
                      }
                      onPressEnter={(e) =>
                        enterHandler("m2", "folio", e.target.value)
                      }
                    />
              </Col>
              <Col span={4}>
              <Select
                      style={{ width: "135px" }}
                      placeholder="Tipo de Riesgo"
                      value={advancedObj.riesgo}
                      onChange={(value) =>
                        handlerChange("m2", "riesgo", value, true)
                      }
                    >
                      <Select.Option key = "DEMOGRAFICA" value="DEMOGRAFICA">
                        Demográfica
                      </Select.Option>
                      <Select.Option key = "TRANSACCIONAL" value="TRANSACCIONAL">
                        Transaccional
                      </Select.Option>
                      <Select.Option KEY = "PERSONA" value="PERSONA">Persona</Select.Option>
                    </Select>
              </Col>
              <Col span={4}>
              <Select
                      style={{ width: "100%" }}
                      placeholder="Puntaje"
                      value={advancedObj.puntaje}
                      onChange={(value) =>
                        handlerChange("m2", "puntaje", value, true)
                      }
                    >
                      <Select.Option value="1">1</Select.Option>
                      <Select.Option value="2">2</Select.Option>
                      <Select.Option value="3">3</Select.Option>
                      <Select.Option value="4">4</Select.Option>
                    </Select>
              </Col>
            </Row>
          </TabPane>
          <TabPane
            key="3"
            tab={
              <span>
                Respuesta{" "}
                <Badge count={Object.entries(advancedObjMenu.m3).length} />
              </span>
            }
          >
            <Row gutter={16}>
              <Col span={9}>
              <DatePicker.RangePicker
                      placeholder={["Fecha para Responder","Hasta"]}
                      style={{ width: "100%" }}
                      value={
                        advancedObj.fechaFinalResponderResp
                          ? [moment(advancedObj.fechaFinalResponderResp[0]),moment(advancedObj.fechaFinalResponderResp[1])]
                          : null
                      }
                      onChange={(momentObj) =>
                        handlerChange(
                          "m3",
                          "fechaFinalResponderResp",
                          momentObj !== null
                          ? [moment(momentObj[0]).valueOf(), moment(momentObj[1]).valueOf()]:null,
                          true
                        )
                      }
                    />

              </Col>
              <Col span={9}>
              <DatePicker.RangePicker
                       placeholder={["Feha Modificación","Hasta"]}
                      style={{ width: "100%" }}
                      value={
                        advancedObj.fechaUltimaModResp
                          ? [moment(advancedObj.fechaUltimaModResp[0]),moment(advancedObj.fechaUltimaModResp[1])]
                          : null
                      }
                      onChange={(momentObj) =>
                        handlerChange(
                          "m3",
                          "fechaUltimaModResp",
                          momentObj !== null
                          ? [moment(momentObj[0]).valueOf(), moment(momentObj[1]).valueOf()]:null,
                          true
                        )
                      }
                    />
    
              </Col>

            </Row>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default AdvancedTabs;
