import "./AlertManagerSimulator.scss";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import { Button, Icon, Spin } from "antd";
import {
  Page,
  PageContent,
  PageHeader,
  PageTopBar
} from "../../../../layouts/Private/components";
import { camelizerHelper } from "../../../../helpers";
import {
  AlertDetailsBlock,
  UserDetailsBlock
} from "../../../AlertManager/components";
import { getAlertPromise } from "./promises";
import moment from "moment";

class AlertManagerSimulator extends Component {
  state = {
    breadcrumbs: [],
    alert: null,
  };

  async componentDidMount() {
    let alertx = await getAlertPromise(this.props.alertId);
    this.setState({ alert: alertx });
  }

  async handleRefreshTasks() {
    const { match } = this.props;
    const alertObj = await getAlertPromise(match.params.alertId);
    this.setState({ alert: alertObj });
  }

  render() {
    const { alert } = this.state;
    const { currentUser, t, currentPage } = this.props;

    return (
      <div id="alert-manager-simulator">
        <div id="content">
          <PageTopBar breadcrumbs={null}>
            <div className="title">
              Las alertas mostradas corresponden a los resultados entregados en la página {currentPage}
            </div>
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
                    <div className="meta-data first">
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
                { alert !== null && alert.record !== null && <UserDetailsBlock alert={alert} /> }
                <AlertDetailsBlock alert={alert} />
              </PageContent>
            </>
            }
          </Page>
        </div>
      </div>
    );
  }
}

export default withTranslation()(withRouter(AlertManagerSimulator));
