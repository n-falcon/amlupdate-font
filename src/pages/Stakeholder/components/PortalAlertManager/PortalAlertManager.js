import "./PortalAlertManager.scss";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router-dom";
import { Button, Icon } from "antd";
import {
  Page,
  PageBottomBar,
  PageContent,
  PageHeader,
  PageTopBar,
} from "../../../../layouts/Private/components";
import {
  AlertDetailsBlock,
  RevisionBlock,
  UserDetailsBlock,
} from "../../../AlertManager/components";
import { withTranslation } from "react-i18next";
import { camelizerHelper } from "../../../../helpers";

import { getAlertPromise } from "./promises";
import moment from "moment";

class PortalAlertManager extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbs: this.getBreadcrumbs(),
      alert: null,
      isLoading: true,
    };
  }

  async componentDidMount() {
    this.handleRefreshTasks()
  }

  async handleRefreshTasks() {
    this.setState({isLoading: true });
    let alertx = await getAlertPromise(this.props.alertId);
    this.setState({
      alert: alertx,
      isLoading: false
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  clickPortal() {
    this.props.clickReturnPortal();
  }

  getBreadcrumbs() {
    const { t } = this.props;
    const { match } = this.props;

    const breadcrumbs = [
      {
        title: "Portal",
        icon: "branches",
        link: match.url,
        onClick: this.clickPortal.bind(this),
      },
      { title: "Alerta", icon: "branches", link: match.url },
    ];

    return breadcrumbs;
  }

  render() {
    const { breadcrumbs, alert, isLoading } = this.state;
    const { t, alertId } = this.props;


    console.log(isLoading)
    console.log('rendering')

    return (
      <div className="portal-alert-manager">
        <PageTopBar breadcrumbs={breadcrumbs} />
        <Page>
        <PageHeader
            title={t("messages.aml.task")}
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
                        {alert.record ?
                          (alert.record.type === "Person" ? t("messages.aml.personNatural") : t("messages.aml.personLegal"))
                          :
                          'N/A'
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

          {alert !==null && (
            <PageContent>
              { (alert.record || alert.contratante) && <UserDetailsBlock alert={alert} /> }
              <AlertDetailsBlock alert={alert} />
              <RevisionBlock
                alert={alert}
                origin="portal"
                currentUser={this.props.currentUser}
                taskId={this.props.taskId}
                refreshHandler={this.handleRefreshTasks.bind(this)}
              />
            </PageContent>
          )}
        </Page>
        <PageBottomBar breadcrumbs={breadcrumbs} />
      </div>
    );
  }
}

export default withTranslation()(withRouter(PortalAlertManager));
