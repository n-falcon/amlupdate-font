import "./Sidebar.scss";
import React from "react";
import { Col, Icon, Badge } from "antd";
import { useTranslation } from 'react-i18next';

const Sidebar = ({ client, activeTab, onTabChange, edoTasks }) => {
  const {t} = useTranslation()
  return (
    <Col className="sidebar" span={5}>
      <div className="sidebar-inner">
        <div className="menu-block">
          <ul>
            {client.modules.includes("CDI-FORM") && (
              <>
                <h3>Conflicto de Interés</h3>
                <li
                  className={
                    activeTab === "tab-newdeclaraciones" ? "active" : ""
                  }
                  onClick={() => onTabChange("tab-newdeclaraciones")}
                >
                  <div className="menu-item-inner">
                    Declaraciones
                    <Icon type="check" />
                  </div>
                </li>
                {/*
                <li
                  className={
                    activeTab === "tab-old-decl" ? "active" : ""
                  }
                  onClick={() => onTabChange("tab-old-decl")}
                >
                  <div className="menu-item-inner">
                    Declaraciones
                    <Icon type="check" />
                  </div>
                </li>
                <li
                  className={activeTab === "tab-declaraciones" ? "active" : ""}
                  onClick={() => onTabChange("tab-declaraciones")}
                >
                  <div className="menu-item-inner">
                    Historial
                    <Icon type="check" />
                  </div>
                </li>
                */}
              </>
            )}

            {client.modules.includes("MONITOR") && edoTasks !== null && (
              <>
                <h3>Monitoreo</h3>
                {Object.entries(edoTasks).map(([key, val]) => (
                  <li
                    className={activeTab === "tab-tasks-" + key ? "active" : val === 0 ? "disabled-tab":""}
                    onClick={val!==0&&(() => onTabChange("tab-tasks-" + key))}
                  >
                    <div className="menu-item-inner">
                      <span>{t("messages.aml.tasks."+key)}</span>
                      <Badge count={val} size="small" showZero/>
                      <Icon type="check" />
                    </div>
                  </li>
                ))}
              </>
            )}

          {/* INICIO TABS DE ONBOARDING */}
            {client.modules.includes("ONBOARDING") && (
              <>
                <h3>OnBoarding</h3>
                <li
                  className={ activeTab === "tab-onboarding" ? "active" : "" }
                  onClick={() => onTabChange("tab-onboarding")}
                >
                  <div className="menu-item-inner">
                    <Icon type="form" className="option"/>
                    Formularios
                    <Icon type="check" />
                  </div>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </Col>
  );
};

export default Sidebar;
