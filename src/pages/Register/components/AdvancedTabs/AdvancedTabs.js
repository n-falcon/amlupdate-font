import "./AdvancedTabs.scss";
import React, { useState } from "react";
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

const AdvancedTabs = ({ cbFilters, areas }) => {
  const { Option } = Select;
  const { SubMenu, Item } = Menu;
  const [advancedObj, setAdvancedObj] = useState({
  });
  const [advancedObjMenu, setAdvancedObjMenu] = useState({
    m1: {},
    m2: {},
    m3: {},
    m4: {},
  });
  const { TabPane } = Tabs;
  const { t } = useTranslation();

  const handlerChange = (menu, field, value=null, enter) => {
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
                placeholder= "Nombre o Dni"
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
                allowClear
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
            {/* <Select
                style={{ width: "100%" }}
                placeholder="Area"
                allowClear
                value={advancedObj.area}
                onChange={(value) =>
                  handlerChange("m1", "area", value, true)
                }
              >
                {areas.map((area) => (
                    <Option value={area}>
                      {area}
                    </Option>
                  )
                )}
              </Select> */}
            </Col>
            <Col span={6}>
                <DatePicker.RangePicker
                  placeholder={["Fec. Actualización", "Hasta"]}
                  style={{ width: "100%" }}
                  value={
                    advancedObj.declUpdate
                      ? [
                          moment(advancedObj.declUpdate[0]),
                          moment(advancedObj.declUpdate[1]),
                        ]
                      : null
                        }
                  onChange={(momentObj) =>
                    handlerChange(
                      "m1",
                      "declUpdate",
                      momentObj !== null && momentObj.length > 0
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
                  Cumplimiento{" "}
                  <Badge count={Object.entries(advancedObjMenu.m2).length} />
                </span>
            }
          >
            <Row gutter={4}>
              <Col span={6}>
                <Select 
                  value={advancedObj.compliance}
                  style={{width: "100%" }}
                  placeholder="Cumplimiento"
                  allowClear
                  onChange={(value) =>
                  handlerChange("m2", "compliance", value, true)} 
                >
                  <Option value="PEPSAN">Listas Obligatorias</Option>
                  <Option value="KYCAME">KYC</Option>
                  <Option value="UBOCOM">UBO & Companies</Option>
                </Select>	                      
              </Col>
              <Col span={6}>
                <Select 
                  value={advancedObj.risk}
                  style={{width: "100%" }}
                  placeholder="Índice de Riesgo"
                  allowClear
                  onChange={(value) =>
                  handlerChange("m2", "risk", value, true)} 
                >
                  <Option value="BLACK">Crítico</Option>
                  <Option value="RED">Alto</Option>
                  <Option value="ORANGE">Medio</Option>
                  <Option value="YELLOW">Bajo</Option>
                  <Option value="GREEN">No Posee</Option>
                </Select>	                      
              </Col>
              <Col span={6}>
                <Select 
                  value={advancedObj.hasMatches}
                  style={{width: "100%" }}
                  placeholder="Coincidencias"
                  allowClear
                  onChange={(value) =>
                  handlerChange("m2", "hasMatches", value, true)} 
                >
                  <Option value="Y">Con Coincidencias</Option>
                  <Option value="N">Sin Coincidencias</Option>
                </Select>	                      
              </Col>
            </Row>
          </TabPane>

          <TabPane
            key="3"
            tab={
              <span>
                Comentarios{" "}
                <Badge count={Object.entries(advancedObjMenu.m3).length} />
              </span>
            }
          >
            <Row gutter={4}>
              <Col span={7}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Comentarios"
                  allowClear
                  value={advancedObj.hasComments}
                  onChange={(value) =>
                    handlerChange("m3", "hasComments", value, true)
                  }
                >
                  <Option value="Y">Tiene comentarios</Option>
                  <Option value="N">No tiene comentarios</Option>
                </Select>
              </Col>
            </Row>
          </TabPane>
          <TabPane
            key="4"
            tab={
              <span>
                Actualización{" "}
                <Badge count={Object.entries(advancedObjMenu.m4).length} />
              </span>
            }
          >
            <Row gutter={4}>
            <Col span={7}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Periodicidad"
                  allowClear
                  value={advancedObj.periodicity}
                  onChange={(value) =>
                    handlerChange("m4", "periodicity", value, true)
                  }
                >
                  <Option value="ANNUAL">Anual</Option>
                  <Option value="BIANNUAL">Semestral</Option>
                  <Option value="QUARTERLY">Trimestral</Option>
                  <Option value="MONTHLY">Mensual</Option>
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
