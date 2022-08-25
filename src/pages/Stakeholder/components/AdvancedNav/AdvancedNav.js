import "./AdvancedNav.scss";
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
} from "antd";
import { getUsersRespTareasPromise } from "../../promises";

const AdvancedNav = ({ form, cbFilters, userId }) => {
  const [responsables, setResponsables] = useState([]);
  const { Option } = Select;
  const { SubMenu, Item } = Menu;
  const [elementLeft, setElementLeft] = useState(0)
  const [advancedObj, setAdvancedObj] = useState({});
  const [advancedObjMenu, setAdvancedObjMenu] = useState({
    m1: {},
    m2: {},
    m3: {},
  });

  useEffect(() => {
    getUsersRespTareasPromise(userId).then((response) => {
      const { data } = response;
      setResponsables(data);
    })
    let topBar = document.getElementById("top-bar-tab-task");
    var rect = topBar.getBoundingClientRect();

    var elementLeft, elementTop; //x and y
    var scrollLeft = document.documentElement.scrollLeft
      ? document.documentElement.scrollLeft
      : document.body.scrollLeft;
    setElementLeft(rect.left + scrollLeft)
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

  const onOpenChangeHandler = (a, b) => {
    ////debugger
    let elemsMenu = document.getElementsByClassName("submenu-task-popup-filter")
    for(let i=0;i<elemsMenu.length;i++) {
      let elemMenu = elemsMenu[i]
      //console.log(elemMenu)
      elemMenu.style.left = elementLeft + "px";
    }
  };

  const onclickMenu = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    domEvent.stopPropagation();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    cbFilters(advancedObj);
  };

  const handleClear = () => {
    setAdvancedObj({});
    setAdvancedObjMenu({ m1: {}, m2: {}, m3: {} });
    cbFilters({});
  };

  return (
    <div className="advnav-filters">
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

        <Menu mode="horizontal" onOpenChange={onOpenChangeHandler} onMouseOver={onOpenChangeHandler}>
          <SubMenu
            key="1"
            title={
              <span>
                Tarea{" "}
                <Badge count={Object.entries(advancedObjMenu.m1).length} />
              </span>
            }
            className="submenu-item-filter"
            popupClassName="submenu-task-popup-filter submenu-popup-filter-1"
          >
            <Menu.Item className="item-filter-task item-filter-task-1">
              <Menu mode="horizontal">
                <SubMenu
                  key="100"
                  onTitleClick={onclickMenu}
                  style={{ width: "130px" }}
                  title={
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
                  }
                ></SubMenu>

                <SubMenu
                  key="101"
                  onTitleClick={onclickMenu}
                  title={
                    <Select
                      style={{ width: "230px" }}
                      placeholder="Solicitante"
                      value={advancedObj.solicitante}
                      onChange={(value) =>
                        handlerChange("m1", "solicitante", value, true)
                      }
                    >
                      {responsables.map(responsable=>(
                        <Select.Option key = {responsable.id}  value = {responsable.id} >
                          {responsable.name}
                        </Select.Option>
                      ))}
                    </Select>
                  }
                ></SubMenu>

                <SubMenu
                  key="102"
                  onTitleClick={onclickMenu}
                  title={
                    <DatePicker.RangePicker
                      placeholder={["Fec. Asignación","Hasta"]}
                      style={{ width: "260px" }}
                      value = {advancedObj.fechaAsignacion ? [moment(advancedObj.fechaAsignacion[0]), moment(advancedObj.fechaAsignacion[1])]: null}
                      onChange={(momentObj) =>
                        handlerChange(
                          "m1",
                          "fechaAsignacion",
                          momentObj !==null ? [moment(momentObj[0]).valueOf(), moment(momentObj[1]).valueOf()]:null,
                          true
                        )
                      }
                    />
                  }
                ></SubMenu>
              </Menu>
            </Menu.Item>
          </SubMenu>


          <SubMenu
            key="2"
            title={
              <span>
                Alerta{" "}
                <Badge count={Object.entries(advancedObjMenu.m2).length} />
              </span>
            }
            className="submenu-item-filter"
            popupClassName="submenu-task-popup-filter submenu-popup-filter-2"
          >
            <Menu.Item className="item-filter-task item-filter-task-2">
              <Menu mode="horizontal">
                <SubMenu
                  key="201"
                  className="subitem-filter-task"
                  onTitleClick={onclickMenu}
                  title={
                    <DatePicker.RangePicker
                      placeholder={["Fecha Asignación","Hasta"]}
                      style={{ width: "260px" }}
                      value={
                        advancedObj.fechaAsignacionAlerta
                          ? [moment(advancedObj.fechaAsignacionAlerta[0]),moment(advancedObj.fechaAsignacionAlerta[1])]
                          : null
                      }
                      onChange={(momentObj) =>
                        handlerChange(
                          "m2",
                          "fechaAsignacionAlerta",
                          momentObj !== null
                            ? [moment(momentObj[0]).valueOf(), moment(momentObj[1]).valueOf()]:null,
                          true
                        )
                      }
                    />
                  }
                ></SubMenu>
                <SubMenu
                  key="202"
                  className="subitem-filter-task"
                  onTitleClick={onclickMenu}
                  title={
                    <Input
                      placeholder="clave(Rut o Nombre)"
                      value={advancedObj.rutNombre}
                      onChange={(e) =>
                        handlerChange(
                          "m2",
                          "rutNombre",
                          e.target.value,
                          false
                        )
                      }
                      onPressEnter={(e) =>
                        enterHandler("m2", "rutNombre", e.target.value)
                      }
                    />
                  }
                ></SubMenu>
                <SubMenu
                  key="203"
                  onTitleClick={onclickMenu}
                  className="subitem-filter-task"
                  title={
                    <Input
                      placeholder="folio"
                      style={{ width: "100px" }}
                      value={advancedObj.folio}
                      onChange={(e) =>
                        handlerChange("m2", "folio", e.target.value, false)
                      }
                      onPressEnter={(e) =>
                        enterHandler("m2", "folio", e.target.value)
                      }
                    />
                  }
                ></SubMenu>
                <SubMenu
                  key="204"
                  className="subitem-filter-task"
                  onTitleClick={onclickMenu}
                  title={
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
                  }
                ></SubMenu>
                <SubMenu
                  key="205"
                  onTitleClick={onclickMenu}
                  title={
                    <Select
                      style={{ width: "100px" }}
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
                  }
                ></SubMenu>
              </Menu>
            </Menu.Item>
          </SubMenu>

          <SubMenu
            key="3"
            title={
              <span>
                Respuesta{" "}
                <Badge count={Object.entries(advancedObjMenu.m3).length} />
              </span>
            }
            className="submenu-item-filter"
            popupClassName="submenu-task-popup-filter submenu-popup-filter-3"
          >
            <Menu.Item className="item-filter-task item-filter-task-3">
              <Menu mode="horizontal">
                <SubMenu
                  key="301"
                  onTitleClick={onclickMenu}
                  title={
                    <DatePicker.RangePicker
                      placeholder={["Fecha para Responder","Hasta"]}
                      style={{ width: "300px" }}
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
                  }
                ></SubMenu>
                <SubMenu
                  key="302"
                  onTitleClick={onclickMenu}
                  title={
                    <DatePicker.RangePicker
                       placeholder={["Feha Modificación","Hasta"]}
                      style={{ width: "300px" }}
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
                  }
                ></SubMenu>
              </Menu>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    </div>
  );
};

export default AdvancedNav;
