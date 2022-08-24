import "./TabRules.scss";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, Table, Spin, notification, Icon } from "antd";
import { camelizerHelper } from "../../../../helpers/";
import { ModalViewRules, ModalRiskPonderator } from "../";
import { useTranslation } from "react-i18next";
import {
  getRulesPromise,
  saveRuleClientPromise,
  getMonitorTipoReglasPromise,
  saveMonitorTipoReglasPromise,
  getMonitorHistorialReglaPromise
} from "../../promises";
import {AdvancedTabs} from './components'



const TabRules = ({ type, currentUser, simId=null }) => {
  const { t } = useTranslation();
  const [clickedItem, setClickedItem] = useState({});
  const [isItemsLoading, setIsItemsLoading] = useState(false);
  const [ruleItems, setRuleItems] = useState([]);
  const [filters, setFilters] = useState({});
  const [rulesHistory, setRulesHistory] = useState([]);



  const [isModalViewRulesVisble, setIsModalViewRulesVisible] = useState(false);
  const [
    isModalRiskPonderatorVisble,
    setIsModalRiskPonderatorVisible,
  ] = useState(false);

  const [riskPonderator, setRiskPonderator] = useState([]);
  const [isAdvancedSearchVisible, setIsAdvancedSearchVisible] = useState(null);

  const handleChangeModalRules = async (objModal) => {
    const response = await saveRuleClientPromise({
      id: objModal.id,
      code: objModal.code,
      status: objModal.status,
      score: objModal.score,
      params: objModal.params,
    });
    if (response.success === true) {
      notification.success({
        message: t("messages.aml.successfulOperation"),
      });
    }
    const index = ruleItems.findIndex((obj) => obj.id === objModal.id);
    const array = ruleItems;
    array[index] = response.data;
    setRuleItems(array);
    handleModalCancel();
  };

  const handleShowAdvancedSearch = () => {
    setIsAdvancedSearchVisible(true);
  };

  const handleHideAdvancedSearch = () => {
    setIsAdvancedSearchVisible(false);
  };

  const cbFilters = (objFilters) => {
    setFilters(objFilters);
    handleSearch(1, objFilters);
  };

  const handleChangeModalPonderator = async (itemModal) => {
    const response = await saveMonitorTipoReglasPromise(itemModal);
    if (response.data === "success") {
      notification.success({
        message: t("messages.aml.successfulOperation"),
      });
    }
    handleModalCancel();
  };

  const handleModalCancel = () => {
    setIsModalViewRulesVisible(false);
    setIsModalRiskPonderatorVisible(false);
  };

  const handleModalPonderator = async () => {
    const { data } = await getMonitorTipoReglasPromise();
    setRiskPonderator(data);
    setIsModalRiskPonderatorVisible(true);
  };

  const handleTableOnRow = (record, index) => {
    return {
      onClick: async (e) => {
        setClickedItem(record);
        const response = await getMonitorHistorialReglaPromise(record.id)
        setRulesHistory(response.data)
        setIsModalViewRulesVisible(true);
      },
    };
  };

  useEffect(() => {
    handleSearch(1, {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (page, filters) => {
    setIsItemsLoading(true);
    if(simId !==null) filters.simId = simId
    const { data } = await getRulesPromise(filters);
    setRuleItems(data);
    setIsItemsLoading(false);
  };

  const tableColumns = [
    {
      title: () => (
        <>
          <div>Tipo de Riesgo</div>
        </>
      ),
      dataIndex: "type",
      render: (text, record) => {
        return (
          <>
            <div>
              {text !== undefined ? camelizerHelper(text) : "undefined text"}
            </div>
          </>
        );
      },
    },
    {
      title: () => (
        <>
          <div>Código</div>
        </>
      ),
      render: (text, record) => {
        return (
          <>
            <div>{record.code}</div>
          </>
        );
      },
    },
    {
      title: () => (
        <>
          <div>Regla</div>
        </>
      ),
      dataIndex: "rule",
      render: (text, record) => {
        return (
          <>
            <div>{record.name}</div>
          </>
        );
      },
    },
    {
      title: () => (
        <>
          <div>Estado</div>
        </>
      ),
      render: (text, record) => {
        return (
          <>
            <div>{t("messages.aml." + record.status.toLowerCase())}</div>
          </>
        );
      },
    },

    {
      title: () => (
        <>
          <div>Puntaje</div>
        </>
      ),
      dataIndex: "score"
    },

    {
      title: () => (
        <>
          <div>Parámetro</div>
        </>
      ),
      dataIndex: "params",
      render: (text) => (
        <>
          {text.map((parameter, index) => {
            return <div key={index}>{parameter.name}</div>;
          })}
        </>
      ),
    },
    {
      title: () => (
        <>
          <div>Fecha última actualización</div>
        </>
      ),
      dataIndex: "dateUpdated",
      render: (text) => (
        <>
          {text !== null ? moment(text).format('DD/MM/YYYY'):'-'}
        </>
      ),
    }



    // {
    // 	title: ()=>(
    // 		<>
    // 			<div>Última Modificación </div>
    // 		</>
    // 	),
    // 	dataIndex: 'lastAlert',
    // 	render: (text,record) => <>
    // 	<div style={{textAlign:'left' }}>{text === null ? '-':moment(text).format('DD/MM/YYYY')}</div>
    // 	</>
    // },
  ];

  return (
    <div className="tab-rules">
      <div className="top-bar" id="top-bar-tab-rules">
        { simId === null && currentUser.cliente.modules.includes('MONITOR-T') &&
          <Button
            type="primary"
            className="btn-risk-ponderator"
            onClick={() => handleModalPonderator()}
          >
            Riesgo (Ponderador)
          </Button>
        }

        <div
          className={
            isAdvancedSearchVisible ? "advanced-search on" : "advanced-search"
          }
          onClick={
            !isAdvancedSearchVisible
              ? handleShowAdvancedSearch
              : handleHideAdvancedSearch
          }
        >
          <Icon type="menu" /> &nbsp;
          <span>Búsqueda avanzada</span> &nbsp;
          <Icon type={!isAdvancedSearchVisible ? "down" : "close"} />
        </div>
      </div>

      <div
        className={
          isAdvancedSearchVisible === null
            ? "filters-wrapper null"
            : isAdvancedSearchVisible
            ? "filters-wrapper show"
            : "filters-wrapper hide"
        }
      >
        <div className="filters-wrapper-inner">
          <AdvancedTabs
            cbFilters={cbFilters}
            userId={currentUser.id}
            simId={simId}
          />
        </div>
      </div>

      <div className="items-wrapper">
        {isItemsLoading ? (
          <div className="spinner">
            <Spin size="large" spinning="true" />
          </div>
        ) : (
          <Table
            onRow={handleTableOnRow}
            dataSource={ruleItems}
            columns={tableColumns}
            rowClassName="row-form"
          />
        )}
      </div>
      {isModalViewRulesVisble && rulesHistory!==null && (
        <ModalViewRules
          modalItem={clickedItem}
          onCancel={handleModalCancel}
          handleChangeModal={handleChangeModalRules}
          historyTable = {rulesHistory}
        />
      )}
      {isModalRiskPonderatorVisble && (
        <ModalRiskPonderator
          modalItem={riskPonderator}
          onCancel={handleModalCancel}
          handleChangeModal={handleChangeModalPonderator}
        />
      )}
    </div>
  );
};

export default TabRules;
