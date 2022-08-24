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
import { getUsersByClientPromise } from "../../../../../../promises";
import { useTranslation } from "react-i18next";
import { getRulesPromise } from "../../../../promises";

const AdvancedTabs = ({ cbFilters, simId }) => {
  const [users, setUsers] = useState([]);
  const [rules, setRules] = useState([]);
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
      setUsers(filtered);
    });
    getRulesPromise({simId}).then((response) => {
      const rulesTest = response.data;
      const filteredRules = rulesTest.filter(
        (rule) => rule.type === advancedObj.tipoRiesgoRules
      );
      setRules(response.data);
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
              <>
                <span>Alertas Simuladas</span>
                <Badge count={Object.entries(advancedObjMenu.m1).length} />
              </>
            }
          >
            <Row gutter={16}>
              <Col span={5}>
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
              <Col span={6}>
                <DatePicker.RangePicker
                  placeholder={["Fec. Alerta", "Hasta"]}
                  style={{ width: "100%" }}
                  value={
                    advancedObj.fechaAlerta
                      ? [
                          moment(advancedObj.fechaAlerta[0]),
                          moment(advancedObj.fechaAlerta[1]),
                        ]
                      : null
                  }
                  onChange={(momentObj) =>
                    handlerChange(
                      "m1",
                      "fechaAlerta",
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
                <Select
                  style={{ width: "100%" }}
                  placeholder="Tipo Riesgo"
                  value={advancedObj.riesgo}
                  onChange={(value) =>
                    handlerChange("m1", "riesgo", value, true)
                  }
                >
                  <Select.Option value="DEMOGRAFICA">Demográfica</Select.Option>
                  <Select.Option value="TRANSACCIONAL">
                    Transaccional
                  </Select.Option>
                  <Select.Option value="PERSONA">Persona</Select.Option>
                </Select>
              </Col>
              <Col span={3}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Puntaje"
                  value={advancedObj.puntaje}
                  onChange={(value) =>
                    handlerChange("m1", "puntaje", value, true)
                  }
                >
                  <Select.Option value={1}>1</Select.Option>
                  <Select.Option value={2}>2</Select.Option>
                  <Select.Option value={3}>3</Select.Option>
                  <Select.Option value={4}>4</Select.Option>
                </Select>
              </Col>

              <Col span={3}>
                <Input
                  placeholder="folio"
                  style={{ width: "100%" }}
                  value={advancedObj.folio}
                  onChange={(e) =>
                    handlerChange("m1", "folio", e.target.value, false)
                  }
                  onPressEnter={(e) =>
                    enterHandler("m1", "folio", e.target.value)
                  }
                />
              </Col>

              <Col span={3}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Estado"
                  value={advancedObj.estado}
                  onChange={(value) =>
                    handlerChange("m1", "estado", value, true)
                  }
                >
                  <Select.Option value="OPEN">
                    {t("messages.aml.alert.status.OPEN")}
                  </Select.Option>
                  <Select.Option value="CLOSED">
                    {t("messages.aml.alert.status.CLOSED")}
                  </Select.Option>
                </Select>
              </Col>
            </Row>
          </TabPane>
          <TabPane
            key="2"
            tab={
              <span>
                Reglas{" "}
                <Badge count={Object.entries(advancedObjMenu.m2).length} />
              </span>
            }
          >
            <Row gutter={16}>
              <Col span={7}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Regla"
                  value={advancedObj.ruleId}
                  onChange={(value) =>
                    handlerChange("m2", "ruleId", value, true)
                  }
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {rules
                    .filter((rule) => rule.type === "TRANSACCIONAL")
                    .map((rule) => {
                      return (
                        <Select.Option value={rule.id}>
                          {rule.name}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Col>
              <Col span={5}>
                <Input
                  placeholder= {"Número de Transacción"}
                  value={advancedObj.transactionNumber}
                  onChange={(e) =>
                    handlerChange("m2", "transactionNumber", e.target.value, false)
                  }
                  onPressEnter={(e) =>
                    enterHandler("m2", "transactionNumber", e.target.value)
                  }
                />
              </Col>

              <Col span={8}>
                <DatePicker.RangePicker
                  placeholder={["Fec. Transacción", "Hasta"]}
                  style={{ width: "100%" }}
                  value={
                    advancedObj.fechaTransaction
                      ? [
                          moment(advancedObj.fechaTransaction[0]),
                          moment(advancedObj.fechaTransaction[1]),
                        ]
                      : null
                  }
                  onChange={(momentObj) =>
                    handlerChange(
                      "m2",
                      "fechaTransaction",
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
        </Tabs>
      </div>
    </div>
  );
};

export default AdvancedTabs;
