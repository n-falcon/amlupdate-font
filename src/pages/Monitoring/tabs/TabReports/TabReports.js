import "./TabReports.scss";
import React, { useEffect, useState, useContext } from "react";
import {
  Col,
  Row,
  Radio,
  Select,
  Icon,
  Checkbox,
  DatePicker,
  Button
} from "antd";

import { camelizerHelper } from "../../../../helpers/";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { getUsersByClientPromise } from "../../../../promises";
import { getGruposPromise } from "../../../Register/promises";
import {getRulesPromise} from '../../promises';
import { globalContext } from '../../../../contexts'

const TabReports = ({ categories }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [obj, setObj] = useState({
    reporte: "alertas",
    tipoAlertas: "automaticas",
    asignadas: false
  });
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rules, setRules] = useState([])
  const { generateReport } = useContext(globalContext)

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
    getGruposPromise(activeCategory === null ? 'ALL' : activeCategory).then((response) => {
      const filtered = [];
      response.map((g) => {
        if (g.grupo !== "N/A") {
          filtered.push(g.grupo);
        }
        return true;
      });
      setGrupos(filtered);
    });

    getRulesPromise({}).then((response) => {
      setRules(response.data)
    })

  }, []);

  const localGenerateReport = (type) => {
    let filters = obj
    return generateReport(type, filters, finishReport)
  }

  const finishReport = (type) => {
    if(type === 'ALERT' || type === undefined) setIsLoading(false)
  }

  const handleClear = () => {
    let reporte = obj.reporte

    setObj({
      reporte,
      tipoAlertas: "automaticas",
      asignadas: false
    })
  };

  const handleSetActiveCategory = (category) => {
    setActiveCategory(category);
    setObj({ ...obj, category: category });
  };

  const handleChangeObj = (field, value) => {
    setObj({ ...obj, [field]: value });
  };

  const handleDownloadReport = async () => {
    localGenerateReport('ALERT').then(r => {
      if(r) {
        setIsLoading(true);
      }
    })
  }

  return (
    <div id="tab-reports" className="tab-reports">
      <div className="content-alerts-people">
        <Row>
          <div className="inner-row">
            <Col span={12}>
              <div className="inner-col-header">
                <Radio
                  value="alertas"
                  checked={obj.reporte === "alertas"}
                  onClick={() => setObj({ ...obj, reporte: "alertas" })}
                >
                  Reporte Gestión de Alertas
                </Radio>
              </div>
            </Col>
            <Col span={12}>
              <div className="inner-col-header">
                <Radio
                  value="personas"
                  checked={obj.reporte === "personas"}
                  onClick={() => setObj({ ...obj, reporte: "personas" })}
                >
                  Reporte Personas
                </Radio>
              </div>
            </Col>
          </div>
        </Row>

        <div className="box-inner">
          <Row>
            <div className="inner-row" style={{ marginTop:0 }}>
              <Col span={12} style = {{paddingRight:'5px'}}>
                  <Select
                    style={{ width: '100%' }}
                    value={activeCategory}
                    onChange={(value) => handleSetActiveCategory(value)}
                  >
                    <Select.Option value={null}>Todas</Select.Option>
                    {categories.map((category) => (
                      <Select.Option key={category} value={category}>
                        {camelizerHelper(category)}
                      </Select.Option>
                    ))}
                  </Select>
              </Col>

            </div>
          </Row>

          {obj.reporte === "alertas" && (
            <Row>
              <div className="inner-row" style={{ marginTop:0 }}>
                <Col span={12} style = {{paddingRight:'5px'}}>
                  <Select
                    defaultValue="automaticas"
                    style={{ width: "100%" }}
                    value={obj.tipoAlertas}
                    onChange={(value) => handleChangeObj("tipoAlertas", value)}
                  >
                    <Select.Option value="automaticas">
                      Alertas Automáticas
                    </Select.Option>
                    <Select.Option value="personalizadas">
                      Alertas Personalizadas
                    </Select.Option>
                    <Select.Option value="coincidencias">
                      Coincidencias por Nombre
                    </Select.Option>
                  </Select>
                </Col>
                <Col span={3}>
                  <div className="asignadas">Asignadas</div>
                </Col>
                <Col span={4}>
                  <Checkbox
                    checked={obj.asignadas}
                    onChange={(e) => {
                      handleChangeObj("asignadas", e.target.checked);
                    }}
                  />
                </Col>
                <Col span={3}>
                  Borrar Filtros
                </Col>
                <Col span={2}>
                  <Button
                    className="delete-filters"
                    onClick={handleClear}
                  >
                    <Icon type="delete"></Icon>

                  </Button>
                </Col>

              </div>
            </Row>
          )}

          {obj.reporte === "personas" && (
            <Row>
              <div className="inner-row">
                <Col span={18}>
                  Monitoreo de Personas
                  <hr style={{ marginBlockEnd: '2px' }} />
                </Col>
                <Col span={3} offset={1}>
                  Borrar Filtros
                </Col>
                <Col span={2}>
                  <Button
                    className="delete-filters"
                    onClick={handleClear}
                  >
                    <Icon type="delete"></Icon>

                  </Button>
                </Col>


              </div>
            </Row>
          )}

          {obj.reporte === "alertas" && (
            <>
              <Row>
                <Col span={12}>
                  <div className="col-inner">
                    <div className="key">
                      {obj.tipoAlertas === "automaticas" ? "Periodo (Recepción de la Alerta)" : "Periodo (Alerta creada)"}
                    </div>
                    <DatePicker.RangePicker
                      placeholder={["Desde", "Hasta"]}
                      style={{ width: "100%" }}
                      value={
                        obj.fechaAlerta
                          ? [
                            moment(obj.fechaAlerta[0]),
                            moment(obj.fechaAlerta[1]),
                          ]
                          : null
                      }
                      onChange={(momentObj) =>
                        handleChangeObj(
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
                  </div>
                </Col>

                <Col span={12}>
                  <div className="col-inner">
                    <div className="key">Tipo de Riesgo</div>
                    <Select
                      style={{ width: "100%" }}
                      onChange={(value) => handleChangeObj("tipoRiesgo", value)}
                      value={obj.tipoRiesgo}
                    >
                      <Select.Option value="DEMOGRAFICA">Demográfica</Select.Option>
                      {obj.tipoAlertas === "automaticas" &&
                        <Select.Option value="TRANSACCIONAL">Transaccional</Select.Option>
                      }
                      {obj.tipoAlertas === "automaticas" &&
                        <Select.Option value="PERSONA">Persona</Select.Option>
                      }
                      {obj.tipoAlertas === "personalizadas" &&
                        <Select.Option value="EVENTO">Cumplimiento</Select.Option>
                      }
                    </Select>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="col-inner">
                    <div className="key">Puntaje</div>
                    <Select
                      style={{ width: "100%" }}
                      onChange={(value) => handleChangeObj("puntaje", value)}
                      value={obj.puntaje}
                    >
                      <Select.Option value={1}>1</Select.Option>
                      <Select.Option value={2}>2</Select.Option>
                      <Select.Option value={3}>3</Select.Option>
                      <Select.Option value={4}>4</Select.Option>
                    </Select>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="col-inner">
                    <div className="key">Estado de la Alerta</div>
                    <Select
                      style={{ width: "100%" }}
                      onChange={(value) => handleChangeObj("estado", value)}
                      value={obj.estado}
                    >
                      <Select.Option value="OPEN">
                        {t("messages.aml.alert.status.OPEN")}
                      </Select.Option>
                      <Select.Option value="CLOSED">
                        {t("messages.aml.alert.status.CLOSED")}
                      </Select.Option>
                    </Select>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="col-inner">
                    <div className="key">Tipo de Persona</div>
                    <Select
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        handleChangeObj("tipoPersona", value)
                      }
                      value={obj.tipoPersona}

                    >
                      <Select.Option value="Person">Natural</Select.Option>
                      <Select.Option value="Entity">Jurídica</Select.Option>
                    </Select>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="col-inner">
                    <div className="key">Estado de la Tarea</div>
                    <Select
                      style={{ width: "100%" }}
                      onChange={(value) => handleChangeObj("edoTarea", value)}
                      value={obj.edoTarea}
                    >
                      <Select.Option value="COMPLETAS">Completas</Select.Option>
                      <Select.Option value="INCOMPLETAS">
                        Incompletas
                      </Select.Option>
                      <Select.Option value="NoAsignadas">
                        No asignadas
                      </Select.Option>
                    </Select>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="col-inner">
                    <div className="key">Regla</div>
                    <Select
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        handleChangeObj("ruleId", value)
                      }
                      value={obj.ruleId}
                    >
                      {rules.filter(rule => {
                        if (obj.tipoRiesgo !== undefined)
                         return (rule.type === obj.tipoRiesgo)
                        else
                         return true
                      }).map(filteredRule => {
                        return  <Select.Option value={filteredRule.id}>{filteredRule.name}</Select.Option>
                      })}
                    </Select>
                  </div>
                </Col>

                {obj.tipoAlertas === "personalizadas" &&
                  <Col span={12}>
                    <div className="col-inner">
                      <div className="key">Usuario que creó la Alerta</div>
                      <Select
                        style={{ width: "100%" }}
                        onChange={(value) =>
                          handleChangeObj("userAlertCreation", value)
                        }
                      >
                        {users.map((user) => (
                          <Select.Option value={user.id}>
                            {user.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </Col>
                }
              </Row>


              {obj.asignadas && (
                <Row>
                  <Col span={12}>
                    <div className="col-inner">
                      <div className="key">Usuario Asignado</div>
                      <Select
                        style={{ width: "100%" }}
                        onChange={(value) =>
                          handleChangeObj("assignedUser", value)
                        }
                        value={obj.assignedUser}
                      >
                        {users.map((user) => (
                          <Select.Option value={user.id}>
                            {user.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </Col>

                  <Col span={12}>
                    <div className="col-inner">
                      <div className="key">Periodo (Alerta asignada)</div>
                      <DatePicker.RangePicker
                        placeholder={["Desde", "Hasta"]}
                        style={{ width: "100%" }}
                        value={
                          obj.fechaAsignacion
                            ? [
                              moment(obj.fechaAsignacion[0]),
                              moment(obj.fechaAsignacion[1]),
                            ]
                            : null
                        }
                        onChange={(momentObj) =>
                          handleChangeObj(
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
                    </div>
                  </Col>
                </Row>
              )}

            </>
          )}

          {obj.reporte === "personas" && (
            <>
              <Row>
                <Col span={12}>
                  <div className="col-inner">
                    <div className="key">Grupo</div>
                    <Select
                      style={{ width: "100%" }}
                      onChange={(value) => handleChangeObj("grupo", value)}
                    >
                      {grupos.map((grupo) => (
                        <Select.Option value={grupo}>{grupo}</Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="col-inner">
                    <div className="key">Tipo de Persona</div>
                    <Select
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        handleChangeObj("tipoPersona", value)
                      }
                    >
                      <Select.Option value="Person">Natural</Select.Option>
                      <Select.Option value="Entity">Jurídica</Select.Option>
                    </Select>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col span={12}>
                  <div className="col-inner">
                    <div className="key">Tipo de Riesgo</div>
                    <Select
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        handleChangeObj("tipoRiesgo", value)
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
                  </div>
                </Col>
                <Col span={12}>
                  <div className="col-inner">
                    <div className="key">Puntaje</div>
                    <Select
                      style={{ width: "100%" }}
                      onChange={(value) => handleChangeObj("puntaje", value)}
                      value={obj.puntaje}
                    >
                      <Select.Option value={1}>1</Select.Option>
                      <Select.Option value={2}>2</Select.Option>
                      <Select.Option value={3}>3</Select.Option>
                      <Select.Option value={4}>4</Select.Option>
                    </Select>
                  </div>
                </Col>
              </Row>
            </>
          )}



          <Button
            icon={isLoading ? "loading" : "file-excel"}
            className="bottom-button"
            type="primary"
            disabled={isLoading}
            onClick={handleDownloadReport}
          >
            Exportar a Excel
          </Button>
        </div>
      </div>
    </div>
  );
};
export default TabReports;
