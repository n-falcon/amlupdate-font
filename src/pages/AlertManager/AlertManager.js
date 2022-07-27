import "./AlertManager.scss";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import { Button, Icon, notification, Popconfirm, Spin } from "antd";
import {
  Page,
  PageTopBar,
  PageContent,
  PageHeader
} from "../../layouts/Private/components";
import { camelizerHelper } from "../../helpers";
import {
  AlertAssignBlock,
  AlertCreatorBlock,
  AlertDetailsBlock,
  AlertCloseBlock,
  HistoryBlock,
  RevisionBlock,
  SuspiciousOperationBlock,
  UserDetailsBlock,
  FalsesPositivesBlock,
} from "./components";
import { getAlertPromise, closeAlertPromise } from "./promises";
import moment from "moment";

class AlertManager extends Component {
  state = {
    alert: null,
    falsosPositivos: []
  };

  async componentDidMount() {
    const { item } = this.props;
    let alertx = await getAlertPromise(item.id);
    this.setState({ alert: alertx });
  }

  async handleCloseAlert() {
    const { t } = this.props;
    const { alert, falsosPositivos } = this.state;
    if(alert.estadoFP === 'PENDIENTE' && falsosPositivos.size > 0) {
      notification.warn({
        message: 'Se deben resolver las coincidencias por Nombre'
      })
    }else {
      const alertClose = await closeAlertPromise(alert.id);
      notification["success"]({
        message: t("messages.aml.request.CERRADA"),
      });
      this.setState({ alert: alertClose });
    }
  }

  async handleRefreshTasks() {
    const { item } = this.props;
    const alertObj = await getAlertPromise(item.id);
    this.setState({ alert: alertObj });
  }

  updateFP(fps) {
    this.setState({ falsosPositivos: fps });
  }

  render() {
    const { alert, falsosPositivos } = this.state;
    const { currentUser, t, currentPage } = this.props;

    return (
      <div id="content">
        <PageTopBar breadcrumbs={null}>
          { currentPage > 0 &&
            <div className="title">
              Las alertas mostradas corresponden a los resultados entregados en la página {currentPage}
            </div>
          }
          <div className="top-buttons">
            <Button size="small" disabled={this.props.handlePrevItem === null} onClick={this.props.handlePrevItem} icon="arrow-left" ghost/>
            <Button size="small" disabled={this.props.handleNextItem === null} onClick={this.props.handleNextItem} icon="arrow-right" ghost/>
            <Button size="small" onClick={this.props.closeOverlayAlerta} icon="close" ghost/>
          </div>
        </PageTopBar>
        <Page>
          { alert === null ? <div className="spin"><Spin/></div>
            :
            <>
            <PageHeader
              title={t("messages.aml.alert")}
              description={
                alert !== null && (
                  <small>
                    Fecha de alerta :{" "}
                    {moment(alert.creationDate).format("DD/MM/YYYY")}
                  </small>
                )
              }
              icon="branches"
            >
              {alert !== null && (
                <>
                  <div className="meta-data-status">
                    <ul>
                      <li>
                        <div className="alert-score">
                          <span>
                            <Icon type="star" />
                            &nbsp;&nbsp; {t("messages.aml.alertScore")}{" "}
                            <p>
                              <span>{alert.score}</span>
                            </p>
                          </span>
                        </div>
                      </li>
                      <li>
                        <label>{t("messages.aml.status")}:</label>
                        <p>
                          {t("messages.aml.alert.status." + alert.status)}
                          {alert.dateStatus !== null && (
                            <>
                              &nbsp; -{" "}
                              <small>
                                {moment(alert.dateStatus).format("DD/MM/YYYY")}
                              </small>{" "}
                            </>
                          )}
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div className="meta-data first">
                    <ul>
                      <li>
                        <label>{t("messages.aml.personType")}:</label>
                          <p>
                            { alert.record !== null ?
                            <>
                              {alert.record.type === "Person"
                                ? t("messages.aml.personNatural")
                                : t("messages.aml.personLegal")}
                            </>
                            :
                            <>N/A</>
                            }
                          </p>
                      </li>
                      <li>
                        <label>{t("messages.aml.totalTime")}:</label>
                        <p>
                          {alert.days} día{alert.days > 1 && "(s)"}
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div className="meta-data">
                    <ul>
                      <li>
                        <label>Folio:</label>
                        <p>{alert.folio}</p>
                      </li>
                      <li>
                        <label>{t("messages.aml.riskType")}:</label>
                        <p>{camelizerHelper(alert.type)}</p>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </PageHeader>
            <PageContent>
              {alert !== null && alert.status === "READY" &&
                ((currentUser.cliente.oficialCto !== null &&
                  currentUser.id === currentUser.cliente.oficialCto.id) ||
                  (currentUser.modules !== null && (currentUser.modules.includes("OFCTO") || currentUser.modules.includes("ANCTO")))) && (
                  <div className="rules-items">
                    <strong>
                      Se completaron todas las tareas, desea cerrar la Alerta?
                    </strong>
                    <div className="subitem">
                      <Popconfirm
                        title={["Confirma cierre de alerta"]}
                        onConfirm={this.handleCloseAlert.bind(this)}
                        okText="Sí"
                        cancelText="No"
                      >
                        <Button
                          className="save-button"
                          type="primary"
                          icon="save"
                          size="small"
                        >
                          Cerrar Alerta
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>
                )}
              { alert !== null && alert.record !== null && <UserDetailsBlock alert={alert} /> }
              <AlertDetailsBlock alert={alert} />
              {alert !== null && (alert.estadoFP === 'PENDIENTE' || alert.estadoFP === 'TRATADO') &&
                <FalsesPositivesBlock alert={alert} refreshHandler={this.handleRefreshTasks.bind(this)} updateFP={this.updateFP.bind(this)} />
              }
              {((currentUser.cliente.oficialCto !== null &&
                currentUser.id === currentUser.cliente.oficialCto.id) ||
                (currentUser.modules !== null &&
                  currentUser.modules.includes("OFCTO"))) && (
                <AlertAssignBlock
                  alert={alert}
                  currentUser={this.props.currentUser}
                  refreshHandler={this.handleRefreshTasks.bind(this)}
                />
              )}

              {alert !== null && alert.status !== "CLOSED" 
                && ((currentUser.cliente.oficialCto !== null && currentUser.id === currentUser.cliente.oficialCto.id) ||
                    (currentUser.modules !== null && currentUser.modules.includes("OFCTO"))
                   ) &&
                <AlertCloseBlock
                  alert={alert}
                  falsosPositivos={falsosPositivos}
                  currentUser={this.props.currentUser}
                  refreshHandler={this.handleRefreshTasks.bind(this)}
                />
              }

              {alert !== null && alert.status !== "CLOSED" &&
                <AlertCreatorBlock
                  alert={alert}
                  refreshHandler={this.handleRefreshTasks.bind(this)}
                />
              }
              {alert !== null && alert.tasks !== null && alert.tasks.length > 0 &&
              <RevisionBlock
                alert={alert}
                origin="aml"
                currentUser={currentUser}
                refreshHandler={this.handleRefreshTasks.bind(this)}
              />
               }
              {alert.status === "CLOSED" &&
                <SuspiciousOperationBlock
                  alert={alert}
                  currentUser={currentUser}
                  refreshHandler={this.handleRefreshTasks.bind(this)}
                />
              }
              <HistoryBlock
                alert={alert}
                origin="aml"
              />
            </PageContent>
          </>
          }
        </Page>
      </div>
    );
  }
}

export default withTranslation()(withRouter(AlertManager));
