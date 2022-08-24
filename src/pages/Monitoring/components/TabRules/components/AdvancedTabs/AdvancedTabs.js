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

const AdvancedTabs = ({ cbFilters, type, simId }) => {
  const { Option } = Select;
  const { SubMenu, Item } = Menu;
  const [elementLeft, setElementLeft] = useState(0);
  const [advancedObj, setAdvancedObj] = useState({});
  const [advancedObjMenu, setAdvancedObjMenu] = useState({
    m1: {},
    m2: {},
    m3: {},
  });
  const { TabPane } = Tabs;
  const { t } = useTranslation();

  useEffect(() => {

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
                Reglas{" "}
                <Badge count={Object.entries(advancedObjMenu.m1).length} />
              </span>
            }
          >
            <Row gutter={16}>
              <Col span={4}>
                <Input
                  placeholder="Regla"
                  value={advancedObj.regla}
                  onChange={(e) =>
                    handlerChange("m1", "regla", e.target.value, false)
                  }
                  onPressEnter={(e) =>
                    enterHandler("m1", "regla", e.target.value)
                  }
                />
              </Col>
              { simId === null &&
                <Col span={4}>
                <Select
                        style={{ width: "100%" }}
                        placeholder="Tipo de Riesgo"
                        value={advancedObj.riesgo}
                        onChange={(value) =>
                          handlerChange("m1", "riesgo", value, true)
                        }
                      >
                        <Select.Option value="DEMOGRAFICA">
                          Demográfica
                        </Select.Option>
                        <Select.Option value="TRANSACCIONAL">
                          Transaccional
                        </Select.Option>
                        <Select.Option value="PERSONA">Persona</Select.Option>
                      </Select>
                </Col>
              }
              <Col span={4}>
              <Select
                      style={{ width: "100%" }}
                      placeholder="Estado"
                      value={advancedObj.estado}
                      onChange={(value) =>
                        handlerChange("m1", "estado", value, true)
                      }
                    >
                      <Select.Option value="ACTIVE">
                        {t("messages.aml.rule.status.ACTIVE")}
                      </Select.Option>
                      <Select.Option value="INACTIVE">
                        {t("messages.aml.rule.status.INACTIVE")}
                      </Select.Option>
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
                      <Select.Option value={1}>1</Select.Option>
                      <Select.Option value={2}>2</Select.Option>
                      <Select.Option value={3}>3</Select.Option>
                      <Select.Option value={4}>4</Select.Option>
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
