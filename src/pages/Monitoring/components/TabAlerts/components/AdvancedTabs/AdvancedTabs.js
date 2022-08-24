import "./AdvancedTabs.scss";
import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Button,
  DatePicker,
  Input,
  Select,
  Badge,
  Tooltip,
  Tabs,
  Row,
  Col,
} from "antd";
import { getUsersByClientPromise } from "../../../../../../promises";
import { getRulesPromise } from "../../../../promises";

import { useTranslation } from "react-i18next";

const AdvancedTabs = ({ cbFilters, type, currentUser, alertStatus }) => {
  const [users, setUsers] = useState([])
  const [rules, setRules] = useState([])
  const [advancedObj, setAdvancedObj] = useState({
    // tipoRiesgoRules:"DEMOGRAFICA"
  });
  const [advancedObjMenu, setAdvancedObjMenu] = useState({
    m1: {},
    m2: {},
    m3: {},
    m4: {},
    m5: {}
  });
  const { TabPane } = Tabs;
  const { t } = useTranslation();

  useEffect(() => {
    getUsersByClientPromise().then((response) => {
      const filtered = []
      response.map(u => {
        if ((u.type === 'ADMIN' || u.type === 'SADMIN' || u.type === 'USUARIO') && u.status === 'ACTIVE') {
          filtered.push(u)
        }
        return true
      })
      setUsers(filtered)
    })

    getRulesPromise({}).then((response) => {
      const rulesTest = response.data
      const filteredRules =  rulesTest.filter(rule => rule.type===advancedObj.tipoRiesgoRules)
      setRules(response.data)
    })
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
    setAdvancedObjMenu({ m1: {}, m2: {}, m3: {}, m4: {}, m5: {} });
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
            key="4"
            tab={
              <span>
                Personas{" "}
                <Badge count={Object.entries(advancedObjMenu.m4).length} />
              </span>
            }
          >
            <Row gutter={4}>
              <Col span={8}>
                  <Input
                    placeholder= {type !== 'EVENTO' ?  "Rut o Nombre":"Rut, Nombre u Otro" }
                    value={advancedObj.rutNombre}
                    onChange={(e) =>
                      handlerChange("m4", "rutNombre", e.target.value, false)
                    }
                    onPressEnter={(e) =>
                      enterHandler("m4", "rutNombre", e.target.value)
                    }
                  />
              </Col>

              <Col span={4}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Tipo de Persona"
                  value={advancedObj.tipoPersona}
                  onChange={(value) =>
                    handlerChange("m4", "tipoPersona", value, true)
                  }
                >
                  <Select.Option value="Entity">
                    {t("messages.aml.entity")}
                  </Select.Option>
                  <Select.Option value="Person">
                    {t("messages.aml.person")}
                  </Select.Option>
                </Select>
              </Col>
            </Row>
          </TabPane>
          <TabPane
            key="1"
            tab={
                <>
                <span>
                  {type === "EVENTO" ? 'Alertas Creadas':'Alertas Recibidas' }
                  {" "}
                </span>
                <Badge count={Object.entries(advancedObjMenu.m1).length} />
                </>
            }
          >
            <Row gutter={4}>
              { alertStatus === 'CLOSED' &&
              <Col span={7}>
                <DatePicker.RangePicker
                  placeholder={["Fec. Cierre", "Hasta"]}
                  style={{ width: "100%" }}
                  value={
                    advancedObj.closeDate
                      ? [
                          moment(advancedObj.closeDate[0]),
                          moment(advancedObj.closeDate[1]),
                        ]
                      : null
                        }
                  onChange={(momentObj) =>
                    handlerChange(
                      "m1",
                      "closeDate",
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
            }

              <Col span={7}>
                <DatePicker.RangePicker
                  placeholder={["Fec. Recibido", "Hasta"]}
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
                  value={advancedObj.tipoRiesgo}
                  onChange={(value) =>
                    handlerChange("m1", "tipoRiesgo", value, true)
                  }
                >
                  <Select.Option value="DEMOGRAFICA">Demográfica</Select.Option>
                  {type === "EVENTO" && (
                    <Select.Option value="EVENTO">Cumplimiento</Select.Option>
                  )}
                  {type !== "EVENTO" && (
                    <Select.Option value="TRANSACCIONAL">
                      Transaccional
                    </Select.Option>
                  )}
                  {type !== "EVENTO" && (
                    <Select.Option value="PERSONA">Persona</Select.Option>
                  )}
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
                  placeholder="Folio"
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
            </Row>
          </TabPane>

          <TabPane
            key="2"
            tab={
              <span>
                Alertas Asignadas{" "}
                <Badge count={Object.entries(advancedObjMenu.m2).length} />
              </span>
            }
          >
            <Row gutter={4}>
              <Col span={7}>
                <DatePicker.RangePicker
                  placeholder={["Fecha Asignación", "Hasta"]}
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
                      "m2",
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

              <Col span={7}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Usuario Asignado"
                  value={advancedObj.usuarioAsignado}
                  onChange={(value) =>
                    handlerChange("m2", "usuarioAsignado", value, true)
                  }
                >
                  {users.map((user) => (
                    <Select.Option value={user.id}>{user.name}</Select.Option>
                  ))}
                </Select>
              </Col>

              <Col span={7}>
                <DatePicker.RangePicker
                  placeholder={["Feha Final", "Hasta"]}
                  style={{ width: "100%" }}
                  value={
                    advancedObj.fechaFinal
                      ? [
                          moment(advancedObj.fechaFinal[0]),
                          moment(advancedObj.fechaFinal[1]),
                        ]
                      : null
                  }
                  onChange={(momentObj) =>
                    handlerChange(
                      "m2",
                      "fechaFinal",
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
            key="3"
            tab={
              <span>
                Reglas{" "}
                <Badge count={Object.entries(advancedObjMenu.m3).length} />
              </span>
            }
          >
            <Row gutter={4}>
            <Col span={4}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Tipo Riesgo"
                  value={advancedObj.tipoRiesgoRules}
                  onChange={(value) =>
                    handlerChange("m3", "tipoRiesgoRules", value, true)
                  }
                >
                  { currentUser.cliente.modules.includes('MONITOR-T') && <Select.Option value="DEMOGRAFICA">Demográfica</Select.Option> }
                  {type === "EVENTO" && <Select.Option value="EVENTO">Cumplimiento</Select.Option> }
                  {type !== "EVENTO" && currentUser.cliente.modules.includes('MONITOR-T') && <Select.Option value="TRANSACCIONAL">Transaccional</Select.Option> }
                  {type !== "EVENTO" && <Select.Option value="PERSONA">Persona</Select.Option> }
                </Select>
              </Col>

              <Col span={7}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Regla"
                  value={advancedObj.ruleId}
                  onChange={(value) =>
                    handlerChange("m3", "ruleId", value, true)
                  }
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onSearch = {(value)=>{
                  }}
                >
                  {rules.filter(rule => advancedObj.tipoRiesgoRules === undefined ? rule:rule.type===advancedObj.tipoRiesgoRules).map((rule) => {
                    return(
                      <Select.Option value={rule.id}>{rule.name}</Select.Option>
                    )
                  })}
                </Select>
              </Col>

            {
              advancedObj.tipoRiesgoRules === "TRANSACCIONAL" &&
              <>
              <Col span={5}>
                <Input
                  placeholder= {"Número de Transacción"}
                  value={advancedObj.transactionNumber}
                  onChange={(e) =>
                    handlerChange("m3", "transactionNumber", e.target.value, false)
                  }
                  onPressEnter={(e) =>
                    enterHandler("m3", "transactionNumber", e.target.value)
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
                      "m3",
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
              </>
            }
            </Row>
          </TabPane>
          { type !== "EVENTO" &&
            <TabPane
              key="5"
              tab={
                <span>
                  Coincidencias por Nombre{" "}
                  <Badge count={Object.entries(advancedObjMenu.m5).length} />
                </span>
              }
            >
              <Row gutter={4}>
                <Col span={5}>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Tiene coincidencias"
                    value={advancedObj.hasFP}
                    onChange={(value) =>
                      handlerChange("m5", "hasFP", value, true)
                    }
                  >
                    <Select.Option value="S">Si tiene</Select.Option>
                    <Select.Option value="N">No tiene</Select.Option>
                  </Select>
                </Col>
              </Row>
            </TabPane>
          }

        </Tabs>
      </div>
    </div>


  );
};

export default AdvancedTabs;
