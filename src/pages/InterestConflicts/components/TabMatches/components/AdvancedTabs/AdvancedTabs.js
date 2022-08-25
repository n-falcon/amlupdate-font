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
//import { getUsersByClientPromise } from "../../../../../../promises";
//import { getRulesPromise } from "../../../../promises";
import { useTranslation } from "react-i18next";

const AdvancedTabs = ({ cbFilters, type, currentUser, alertStatus }) => {
  const [users, setUsers] = useState([])
  const [rules, setRules] = useState([])
  const { Option } = Select;
  const { SubMenu, Item } = Menu;
  const [elementLeft, setElementLeft] = useState(0);
  const [advancedObj, setAdvancedObj] = useState({
    // tipoRiesgoRules:"DEMOGRAFICA"
  });
  const [advancedObjMenu, setAdvancedObjMenu] = useState({
    m1: {},
    m2: {},
    m3: {},
    m4: {},
  });
  const { TabPane } = Tabs;
  const { t } = useTranslation();

  useEffect(() => {
    /*    
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
    */
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
    setAdvancedObjMenu({ m1: {}, m2: {}, m3: {}, m4: {} });
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
            <Row gutter={4}>
            <Col span={8}>
                <Input
                  style={{ width: "100%" }}
                  placeholder= "Rut o Nombre"
                  value={advancedObj.rutNombre}
                  onChange={(e) =>
                    handlerChange("m1", "rutNombre", e.target.value, false)
                  }
                  onPressEnter={(e) =>
                    enterHandler("m1", "rutNombre", e.target.value)
                  }
                />
            </Col>

            <Col span={4}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Tipo de Persona"
                  value={advancedObj.tipoPersona}
                  onChange={(value) =>
                    handlerChange("m1", "tipoPersona", value, true)
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

              <Col span={6}>
                <Input
                  style={{ width: "100%" }}
                  placeholder= "Empresa"
                  value={advancedObj.empresa}
                  onChange={(e) =>
                    handlerChange("m1", "empresa", e.target.value, false)
                  }
                  onPressEnter={(e) =>
                    enterHandler("m1", "empresa", e.target.value)
                  }
                />
            </Col>

            <Col span={6}>
                <Input
                  style={{ width: "100%" }}
                  placeholder= "Area"
                  value={advancedObj.area}
                  onChange={(e) =>
                    handlerChange("m1", "area", e.target.value, false)
                  }
                  onPressEnter={(e) =>
                    enterHandler("m1", "area", e.target.value)
                  }
                />
            </Col>
              
            </Row>
          </TabPane>

          <TabPane
            key="2"
            tab={
                <>
                <span>
                  Declaración
                </span>
                <Badge count={Object.entries(advancedObjMenu.m2).length} />
                </>
            }
          >
            <Row gutter={4}>
              <Col span={5}>
              <Input
                  placeholder= "Folio"
                  value={advancedObj.folio}
                  onChange={(e) =>
                    handlerChange("m2", "folio", e.target.value, false)
                  }
                  onPressEnter={(e) =>
                    enterHandler("m2", "folio", e.target.value)
                  }
                />
              </Col>
              {type === 'CDI' &&
                <>
                  <Col span={4}>
                    {type === 'CDI' ?
                      <Select 
                        value={advancedObj.status}
                        style={{width: "100%" }}
                        placeholder="Estado" 
                        onChange={(value) =>
                          handlerChange("m2", "status", value, true)} 
                        >
                        <Option value="ENVIADO">Enviado</Option>
                        <Option value="COMPLETADO">Completado</Option>
                      </Select>
                      :
                      <Select value={advancedObj.status} 
                      placeholder="Seleccione un estado ..." 
                      onChange={(value) =>
                        handlerChange("m2", "status", value, true)}
                      >
                        <Option value="PENDING">Pendiente</Option>
                        <Option value="FINISHED">Finalizado</Option>
                      </Select>
                    }
	                      
                  </Col>
                  <Col span={3}>
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Vínculos"
                      value={advancedObj.hasMatches}
                      onChange={(value) =>
                        handlerChange("m2", "hasMatches", value, true)
                      }
                    >
                      <Select.Option value={true}>SI</Select.Option>
                      <Select.Option value={false}>NO</Select.Option>
                    </Select>
                  </Col>
                <Col span={6}>
                  <DatePicker.RangePicker
                    placeholder={["Fec. Envío", "Hasta"]}
                    style={{ width: "100%" }}
                    value={
                      advancedObj.sendDate
                        ? [
                            moment(advancedObj.sendDate[0]),
                            moment(advancedObj.sendDate[1]),
                          ]
                        : null
                          }
                    onChange={(momentObj) =>
                      handlerChange(
                        "m2",
                        "sendDate",
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
              <Col span={6}>
                <DatePicker.RangePicker
                  placeholder={["Fec. Completado", "Hasta"]}
                  style={{ width: "100%" }}
                  value={
                    advancedObj.completeDate
                      ? [
                          moment(advancedObj.completeDate[0]),
                          moment(advancedObj.completeDate[1]),
                        ]
                      : null
                        }
                  onChange={(momentObj) =>
                    handlerChange(
                      "m2",
                      "completeDate",
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
                Riesgo
                <Badge count={Object.entries(advancedObjMenu.m3).length} />
              </span>
            }
          >
            <Row gutter={4}>
              <Col span={7}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Riesgo"
                  value={advancedObj.risk}
                  onChange={(value) =>
                    handlerChange("m3", "risk", value, true)
                  }
                >
                  <Option value="NA">No Asignado</Option>
                  <Option value="N">No Posee</Option>
                  <Option value="LOW">Bajo</Option>
                  <Option value="MEDIUM">Medio</Option>
                  <Option value="HIGH">Alto</Option>
                </Select>
              </Col>
            </Row>
          </TabPane>
        { type === "CDI" &&
          <TabPane
            key="4"
            tab={
              <span>
                Recordatorio
                <Badge count={Object.entries(advancedObjMenu.m4).length} />
              </span>
            }
          >
            <Row gutter={4}>
              <Col span={8}>
                <DatePicker.RangePicker
                  placeholder={["Fec. Envío Último Recordatorio", "Hasta"]}
                  style={{ width: "100%" }}
                  value={
                    advancedObj.lastReminder
                      ? [
                          moment(advancedObj.lastReminder[0]),
                          moment(advancedObj.lastReminder[1]),
                        ]
                      : null
                  }
                  onChange={(momentObj) =>
                    handlerChange(
                      "m4",
                      "lastReminder",
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
        }
        </Tabs>
      </div>
    </div>


  );
};

export default AdvancedTabs;
