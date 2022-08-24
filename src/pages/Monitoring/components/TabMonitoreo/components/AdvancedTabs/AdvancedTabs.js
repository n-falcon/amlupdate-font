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
import { getGruposPromise } from "../../../../../Register/promises";
import { getUsersByClientPromise } from "../../../../../../promises";
import { useTranslation } from "react-i18next";

const AdvancedTabs = ({ category, cbFilters, currentUser }) => {
  const [grupos, setGrupos] = useState([]);
  const [asignados, setAsignados] = useState([]);
  const [advancedObj, setAdvancedObj] = useState({});
  const [advancedObjMenu, setAdvancedObjMenu] = useState({
    m1: {},
    m2: {},
    m3: {},
  });
  const { TabPane } = Tabs;
  const { t } = useTranslation();

  useEffect(() => {
    getUsersByClientPromise().then((response) => {
      const filtered = [];
      response.map((u) => {
        if (
          (u.type === "ADMIN" || u.type === "SADMIN" || u.type === "USUARIO") &&
          u.status === "ACTIVE"
        ) {
          filtered.push(u);
        }
        return true;
      });
      setAsignados(filtered);
    });

    getGruposPromise(category).then((response) => {
      const filtered = [];
      response.map((g) => {
        if (g.grupo !== "N/A") {
          filtered.push(g.grupo);
        }
        return true;
      });
      setGrupos(filtered);
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
                Persona{" "}
                <Badge count={Object.entries(advancedObjMenu.m1).length} />
              </span>
            }
          >
            <Row>
              <Col span={8}>
                <Input
                  placeholder="Rut o Nombre"
                  value={advancedObj.rutNombre}
                  onChange={(e) =>
                    handlerChange("m1", "rutNombre", e.target.value, false)
                  }
                  onPressEnter={(e) =>
                    enterHandler("m1", "rutNombre", e.target.value)
                  }
                />
              </Col>
              <Col span={5} offset={1}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Grupo"
                  value={advancedObj.grupo}
                  onChange={(value) =>
                    handlerChange("m1", "grupo", value, true)
                  }
                >
                  {grupos.map((grupo) => (
                    <Select.Option value={grupo}>{grupo}</Select.Option>
                  ))}
                </Select>
              </Col>

              <Col span={5} offset={1}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Tipo de Persona"
                  value={advancedObj.tipoPersona}
                  onChange={(value) =>
                    handlerChange("m1", "tipoPersona", value, true)
                  }
                >
                  <Select.Option value="Person">Natural</Select.Option>
                  <Select.Option value="Entity">Jurídica</Select.Option>
                </Select>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            key="2"
            tab={
              <span>
                Riesgo{" "}
                <Badge count={Object.entries(advancedObjMenu.m2).length} />
              </span>
            }
          >
            <Row>
              <Col span={5}>
                <Select
                  style={{ width: "100%" }}
                  placeholder={t("messages.aml.risk.PERSONA")}
                  value={advancedObj.persona}
                  onChange={(value) =>
                    handlerChange("m2", "persona", value, true)
                  }
                >
                  <Select.Option key="1" value={1}>
                    {t("messages.aml.risk.LOW")}
                  </Select.Option>
                  <Select.Option KEY="2" value={2}>
                    {t("messages.aml.risk.MEDIUM")}
                  </Select.Option>
                  <Select.Option key="3" value={3}>
                    {t("messages.aml.risk.HIGH")}
                  </Select.Option>
                  <Select.Option key="4" value={4}>
                    {t("messages.aml.risk.CRITICAL")}
                  </Select.Option>
                </Select>
              </Col>
              { currentUser.cliente.modules.includes('MONITOR-T') &&
              <>
                <Col span={5} offset={1}>
                  <Select
                    style={{ width: "100%" }}
                    placeholder={t("messages.aml.risk.DEMOGRAFICA")}
                    value={advancedObj.demografico}
                    onChange={(value) =>
                      handlerChange("m2", "demografico", value, true)
                    }
                  >
                    <Select.Option key="1" value={1}>
                      {t("messages.aml.risk.LOW")}
                    </Select.Option>
                    <Select.Option KEY="2" value={2}>
                      {t("messages.aml.risk.MEDIUM")}
                    </Select.Option>
                    <Select.Option key="3" value={3}>
                      {t("messages.aml.risk.HIGH")}
                    </Select.Option>
                    <Select.Option key="4" value={4}>
                      {t("messages.aml.risk.CRITICAL")}
                    </Select.Option>
                  </Select>
                </Col>
                <Col span={5} offset={1}>
                  <Select
                    style={{ width: "100%" }}
                    placeholder={t("messages.aml.risk.TRANSACCIONAL")}
                    value={advancedObj.transaccional}
                    onChange={(value) =>
                      handlerChange("m2", "transaccional", value, true)
                    }
                  >
                    <Select.Option key="1" value={1}>
                      {t("messages.aml.risk.LOW")}
                    </Select.Option>
                    <Select.Option KEY="2" value={2}>
                      {t("messages.aml.risk.MEDIUM")}
                    </Select.Option>
                    <Select.Option key="3" value={3}>
                      {t("messages.aml.risk.HIGH")}
                    </Select.Option>
                    <Select.Option key="4" value={4}>
                      {t("messages.aml.risk.CRITICAL")}
                    </Select.Option>
                  </Select>
                </Col>
              </>
              }
            </Row>
          </TabPane>

          <TabPane
            key="3"
            tab={
              <span>
                Alerta{" "}
                <Badge count={Object.entries(advancedObjMenu.m3).length} />
              </span>
            }
          >
            <Row>
              <Col span={9}>
                <DatePicker.RangePicker
                  placeholder={["Fecha Última Alerta", "Hasta"]}
                  style={{ width: "100%" }}
                  value={
                    advancedObj.fechaUltimaAlerta
                      ? [
                          moment(advancedObj.fechaUltimaAlerta[0]),
                          moment(advancedObj.fechaUltimaAlerta[1]),
                        ]
                      : null
                  }
                  onChange={(momentObj) =>
                    handlerChange(
                      "m3",
                      "fechaUltimaAlerta",
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
              <Col span={5} offset={1}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Asignado a"
                  value={advancedObj.asignadoA}
                  onChange={(value) =>
                    handlerChange("m3", "asignadoA", value, true)
                  }
                >
                  {asignados.map((asignado) => (
                    <Select.Option key={asignado.id} value={asignado.id}>
                      {asignado.name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>


            </Row>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default AdvancedTabs;
