import "./TabIndicators.scss";
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { Col, Icon, Row, Select, Spin, Button, Modal, Table } from "antd";
import { camelizerHelper } from "../../../../helpers/";
import {
  getIndicatorsRulesPromise,
  getIndicatorsRangeAlertsPromise,
  getIndicatorsRisksPromise,
  getIndicatorsRisksStatusPromise,
} from "../../promises";
import { useTranslation } from "react-i18next";
//import { parse } from "@babel/core";   -> error de polifils
import {TableModal} from './Components'

const TabIndicators = ({ categories }) => {
  const [activeCategory, setActiveCategory] = useState(categories.length > 0 ? categories[0] : null);
  const [months, setMonths] = useState(null);
  const [rules, setRules] = useState([]);
  const [slicedRules, setSlicedRules] = useState([]);
  const [rangeAlerts, setRangeAlerts] = useState({});
  const [risks, setRisks] = useState([]);
  const [ids, setIds] = useState([]);
  const [labels, setLabels] = useState([]);
  const [parents, setParents] = useState([]);
  const [values, setValues] = useState([]);
  const [colors, setColors] = useState([]);
  const [isModalRulesTableVisible, setIsModalRulesTableVisible] = useState(false);


  const { t } = useTranslation();
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);
  const [isLoading4, setIsLoading4] = useState(false);
  const [wfDataX, setWfDataX] = useState([]);
  const [wfBase, setWfBase] = useState([]);
  const [annotations, setAnnotations] = useState([])
  const [wfOpenClosedTotal, setWfOpenClosedTotal] = useState([]);
  const [wfTextOpenClosedTotal, setWfTextOpenClosedTotal] = useState([]);

  // let labels = [];
  // let parents = [];
  // let values = [];

  const sortedRules = (objArray) =>
    objArray.sort(function (a, b) {
      switch (a.value > b.value) {
        case true:
          return -1;
        case false:
          return 1;
        default:
          return 0;
      }
    });

  const rulesTableColumns = [
    {
      title: "Código",
      dataIndex: "code",
    },
    {
      title: "Nombre",
      dataIndex: "name",
    },
    {
      title: "Alertas",
      dataIndex: "value",
    },
  ];



  const handleModalRulesTableCancel = () =>{
    setIsModalRulesTableVisible(false)
  }

  const handleOnRenderModalRulesTable = () => {
    setIsModalRulesTableVisible(true)
  }

  const getArrasySunburst = (obj, prefix) => {
    let ids = []
    let labels = []
    let parents = []
    let values = []
    let colors = []

    obj.types.forEach(typesObjArr => {
      ids.push(prefix + '-' + typesObjArr.type)
      labels.push(t('messages.aml.indicators.sunburst.type.' + typesObjArr.type))
      parents.push(prefix)
      values.push(typesObjArr.total)
      colors.push(t('messages.aml.indicators.sunburst.color.' + prefix + '.' + typesObjArr.type))

      typesObjArr.risk.forEach(riskObj => {
        ids.push(prefix + '-' + typesObjArr.type + '-' + riskObj.risk)
        labels.push(t('messages.aml.indicators.sunburst.risk.' + riskObj.risk))
        parents.push(prefix + '-' + typesObjArr.type)
        values.push(riskObj.value)
        colors.push(t('messages.aml.indicators.sunburst.color.risk.' + riskObj.risk))
      })
    })

    return { ids, labels, parents, values, colors }
  }

  useEffect(() => {

    let body = {
      category: activeCategory,
      months: months,
      size: 100,
    };




    setIsLoading1(true);
    setIsLoading2(true);
    setIsLoading3(true);
    setIsLoading4(true);
    getIndicatorsRulesPromise(body).then((response) => {
      setRules(response.data);
      setSlicedRules(response.data.slice(-5))
      setIsLoading1(false);
    });
    getIndicatorsRangeAlertsPromise(body).then((response) => {
      const alerts = response.data
      setRangeAlerts(response.data);

      const wfDatax = [
        ...alerts.open.ranges
          .map((el) =>
            t(
              "messages.aml.indicators.open." +
              el.rango
            )
          ),
        "Alertas Abiertas",
        ...alerts.closed.ranges
          .map((el) =>
            t(
              "messages.aml.indicators.closed." +
              el.rango
            )
          ),
        "Cerradas",
        "Pendientes",
      ];





      const wfOpen = [
        ...alerts.open.ranges.map(
          (el) => el.value
        ), alerts.open.total, 0, 0, 0, 0, 0
      ];

      const wfTextOpen = [
        ...alerts.open.ranges.map(
          (el) => el.value
        ), alerts.open.total
      ]

      const wfTextClosed = ['', '', '', '', '',
        ...alerts.closed.ranges.map(
          (el) => el.value
        ), alerts.closed.total
      ]

      const wfTextTotal = [0, 0, 0, 0, 0, 0, 0, 0, 0, alerts.open.total - alerts.closed.total]


      const wfTextOpenClosedTotal = [
        ...alerts.open.ranges.map(
          (el) => el.value
        ), alerts.open.total, ...alerts.closed.ranges.map(
          (el) => el.value
        ), alerts.closed.total, alerts.open.total - alerts.closed.total

      ]

      const wfClosed = [
        0, 0, 0, 0, 0, ...alerts.closed.ranges.map(
          (el) => el.value
        ), alerts.closed.total
      ]

      const wfOpenClosedTotal = [
        ...alerts.open.ranges.map(
          (el) => el.value
        ), alerts.open.total, ...alerts.closed.ranges.map(
          (el) => el.value
        ), alerts.closed.total, alerts.open.total - alerts.closed.total
      ]




      const wfBase = [
        0,
        alerts.open.ranges[0].value,
        alerts.open.ranges[0].value + alerts.open.ranges[1].value,
        alerts.open.ranges[0].value + alerts.open.ranges[1].value + alerts.open.ranges[2].value,
        0,
        alerts.open.total - alerts.closed.ranges[0].value,
        alerts.open.total - alerts.closed.ranges[0].value - alerts.closed.ranges[1].value,
        alerts.open.total - alerts.closed.ranges[0].value - alerts.closed.ranges[1].value - alerts.closed.ranges[2].value,
        alerts.open.total - alerts.closed.ranges[0].value - alerts.closed.ranges[1].value - alerts.closed.ranges[2].value
        , 0
      ]



      setWfDataX(wfDatax);
      setWfOpenClosedTotal(wfOpenClosedTotal);
      setWfTextOpenClosedTotal(wfTextOpenClosedTotal);
      setWfBase(wfBase);
      setIsLoading2(false);

      const annotations = [{
        x: 0,
        y: alerts.pending.total * 1.06,
        text: alerts.pending.total,
        font: {
          family: 'Arial',
          size: 12,
          color: 'rgba(0,0,0,.8)'
        },
        showarrow: false,
      }]

      let remaining = alerts.pending.total
      for (let i = 1; i < 5; i++) {

        let result = {
          x: i,
          y: remaining + alerts.pending.total * 0.06,
          text: alerts.pending.ranges[i - 1].value !== 0 ? alerts.pending.ranges[i - 1].value : '',
          font: {
            family: 'Arial',
            size: 12,
            color: 'rgba(0,0,0,.8)'
          },
          showarrow: false
        };
        annotations.push(result);
        remaining = remaining - alerts.pending.ranges[i - 1].value
      };

      setAnnotations(annotations)


    });


    getIndicatorsRisksPromise(body).then((response) => {
      setRisks(response.data);

      setIsLoading3(false);
    });


    getIndicatorsRisksStatusPromise(body).then((response) => {
      const obj = response.data;

      let idsTemp = ['open', 'closed']
      let labelsTemp = [t('messages.aml.indicators.sunburst.open'), t('messages.aml.indicators.sunburst.closed')]
      let parentsTemp = ['', '']
      let valuesTemp = [obj.open.total, obj.closed.total]
      let colorsTemp = ['#143a6c', '#ffc000']

      let arrays = getArrasySunburst(obj.open, 'open')

      idsTemp = [...idsTemp, ...arrays.ids]
      labelsTemp = [...labelsTemp, ...arrays.labels]
      parentsTemp = [...parentsTemp, ...arrays.parents]
      valuesTemp = [...valuesTemp, ...arrays.values]
      //colorsTemp = [...colorsTemp, ...arrays.colors]

      arrays = getArrasySunburst(obj.closed, 'closed')

      idsTemp = [...idsTemp, ...arrays.ids]
      labelsTemp = [...labelsTemp, ...arrays.labels]
      parentsTemp = [...parentsTemp, ...arrays.parents]
      valuesTemp = [...valuesTemp, ...arrays.values]
      //colorsTemp = [...colorsTemp, ...arrays.colors]

      setIds(idsTemp)
      setLabels(labelsTemp)
      setParents(parentsTemp)
      setValues(valuesTemp)
      setColors(colorsTemp)

      setIsLoading4(false);
    });
  }, [activeCategory, months]);

  const handleSetActiveCategory = (category) => {
    setActiveCategory(category);
  };

  const noData = () => {
    return (
      <div className="no-data">
        {t("messages.aml.noData")}
      </div>
    )
  }


  return (
    <>
      <div className="box container-top">
        <div className="box-inner">
          <Row>
            <Col span={2}>
              <div className="col-inner">
                <div className="key">{t("messages.aml.category")}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="col-inner">
                <div className="value">
                  <Select
                    size="small"
                    style={{ width: "100%" }}
                    value={activeCategory}
                    onChange={(value) => handleSetActiveCategory(value)}
                  >
                    {categories.map((category) => (
                      <Select.Option key={category} value={category}>
                        {camelizerHelper(category)}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>
            </Col>



            <Col span={2} offset={3}>
              <div className="col-inner">
                <div className="key">{t("messages.aml.period")}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="col-inner">
                <div className="value">
                  <Select
                    size="small"
                    style={{ width: "100%" }}
                    defaultValue={null}
                    onChange={(value) => setMonths(value)}
                  >
                    <Select.Option key={0} value={null}>
                      [Todos]
                    </Select.Option>
                    <Select.Option key={1} value={1}>
                      1 mes
                    </Select.Option>
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((el) => (
                      <Select.Option key={el} value={el}>
                        {el} meses
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div id="tab-indicators" className="tab-indicators">
        <div className="big-contents">
          {categories.map((category) => (
            <div
              className={
                activeCategory === category
                  ? "big-contents-item active"
                  : "big-contents-item"
              }
            >
              <div className="big-contents-item-inner">
                <Row>
                  <Col span={12}>
                    <div
                      className={
                        categories.length > 0 ? "col-inner" : "col-inner loading"
                      }
                    >
                      <h4>{t("messages.aml.rules")}</h4>
                      <div className="card-dropdown">
                        <Button className="table-renderer" onClick={e => handleOnRenderModalRulesTable()} >
                          <Icon type="table" style={{ fontSize: '20px' }}></Icon>
                        </Button>
                      </div>
                      {isLoading1 ? (
                        <div className="spinner">
                          <Spin spinning={true} size="big" />
                        </div>
                      ) : rules.length > 0 ?
                          <div className="plot-container">
                            <Plot
                              data={[
                                {
                                  type: "bar",
                                  x: rules.length > 5 ? slicedRules.map((el) => el.value) : rules.map((el) => el.value),
                                  y: rules.length > 5 ? slicedRules.map((el) => el.code + ' ') : rules.map((el) => el.code + ' '),
                                  text: rules.length > 5 ? slicedRules.map((el) => el.name) : rules.map((el) => el.name),
                                  orientation: "h",
                                  marker: {
                                    color: 'rgba(157,195,230,1)'
                                  }
                                },
                              ]}
                              layout={{
                                margin: {
                                  l: 55,
                                  r: 25,
                                  b: 50,
                                  t: 0,
                                },
                                paper_bgcolor: "transparent",
                                plot_bgcolor: "transparent",
                                width: 380,
                                height: 250,
                              }}
                              config={{
                                displayModeBar: false, // this is the line that hides the bar.
                              }}
                            ></Plot>
                          </div>
                          :
                          <div className="no-data">
                            No hay datos
                       </div>
                      }
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="col-inner" style={{ textAlign: "center" }}>
                      <h4>{t("messages.aml.indicators.risksByType")}</h4>
                      {isLoading4 ? (
                        <div className="spinner">
                          <Spin spinning={true} size="big" />
                        </div>
                      ) : ids.length > 2 ?
                          <div className="plot-container">
                            <Plot
                              data={[
                                {
                                  type: "sunburst",
                                  ids: ids,
                                  labels: labels,
                                  parents: parents,
                                  values: values,
                                  branchvalues: 'total',
                                  marker: {
                                    colors
                                  },
                                  //leaf: {opacity: .9}
                                },
                              ]}
                              layout={{
                                margin: {
                                  l: 0,
                                  r: 0,
                                  b: 0,
                                  t: 0,
                                },
                                width: 250,
                                height: 250,
                                paper_bgcolor: "transparent",
                                plot_bgcolor: "transparent",
                              }}
                              config={{
                                displayModeBar: false, // this is the line that hides the bar.
                              }}
                            />
                          </div>
                          : noData()

                      }
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <div className="col-inner">
                      <h4>{t("messages.aml.indicators.alertsState")}</h4>
                      {isLoading2 ? (
                        <div className="spinner">
                          <Spin spinning={true} size="big" />
                        </div>
                      ) : (
                          rangeAlerts.open !== undefined && rangeAlerts.open.total !== 0 ?
                            <div className="plot-container">
                              <Plot
                                data={[

                                  {
                                    type: "bar",
                                    x: wfDataX,
                                    y: wfBase,
                                    marker: {
                                      color: 'rgba(1,1,1,0.0)'
                                    },
                                    cliponaxis: false
                                  },
                                  {
                                    type: "bar",
                                    x: wfDataX,
                                    y: wfOpenClosedTotal,
                                    text: wfTextOpenClosedTotal,
                                    textposition: 'auto',
                                    cliponaxis: false,
                                    marker: { color: ["rgba(20,58,108,.5)", "rgba(20,58,108,.5)", "rgba(20,58,108,.5)", "rgba(20,58,108,.5)", "rgba(20,58,108,.9)", "rgba(255,192,0,.5)", "rgba(255,192,0,.5)", "rgba(255,192,0,.5)", "rgba(255,192,0,.9)", "rgba(237,125,49,.9)"] }
                                  },
                                ]}
                                layout={{
                                  margin: {
                                    l: 50,
                                    r: 50,
                                    b: 60,
                                    t: 40,
                                  },
                                  barmode: 'stack',
                                  hovermode: false,
                                  yaxis: {
                                    title: {
                                      text: t("messages.aml.indicators.AlertsAmount"),
                                    },
                                  },
                                  xaxis: {},
                                  showlegend: false,
                                  paper_bgcolor: "transparent",
                                  plot_bgcolor: "transparent",
                                  width: 800,
                                  height: 250,
                                }}
                                config={{
                                  displayModeBar: false, // this is the line that hides the plotly bar.
                                }}
                              ></Plot>
                            </div>
                            : noData()


                        )}
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col span={12}>
                    <div className="col-inner">
                      <h4>{t("messages.aml.indicators.pendingAlerts")}</h4>
                      {isLoading2 ? (
                        <div className="spinner">
                          <Spin spinning={true} size="big" />
                        </div>
                      ) : (
                          rangeAlerts.pending !== undefined && rangeAlerts.pending.total !== 0 ?
                            <div className="plot-container">
                              <Plot
                                data={[
                                  {
                                    type: "waterfall",
                                    x: [
                                      "Pendientes",
                                      ...rangeAlerts.pending.ranges.map((el) =>
                                        t(
                                          "messages.aml.indicators.open." + el.rango
                                        )
                                      ),
                                    ],
                                    y: [
                                      rangeAlerts.pending.total,
                                      ...rangeAlerts.pending.ranges.map(
                                        (el) => -el.value
                                      ),
                                    ],
                                    text: [
                                      rangeAlerts.pending.total,
                                      ...rangeAlerts.pending.ranges.map(
                                        (el) => el.value
                                      ),
                                    ],
                                    textposition: "none",
                                    cliponaxis: false,
                                    measure: [
                                      "relative",
                                      "relative",
                                      "relative",
                                      "relative",
                                      "relative",
                                    ],
                                    connector: {
                                      visible: false,
                                      line: {
                                        color: "rgb(63, 63, 63)",
                                      },
                                    },
                                    increasing: { marker: { color: "rgba(237,125,49,.9)" } },
                                    decreasing: { marker: { color: "rgba(237,125,49,.5)" } }
                                  },
                                ]}
                                layout={{
                                  margin: {
                                    l: 50,
                                    r: 30,
                                    b: 65,
                                    t: 30,
                                  },
                                  hovermode: false,
                                  annotations: annotations,
                                  yaxis: {
                                    title: {
                                      text: t("messages.aml.indicators.AlertsAmount"),
                                    },
                                  },
                                  legend: { orientation: "h" },
                                  showlegend: false,
                                  paper_bgcolor: "transparent",
                                  plot_bgcolor: "transparent",
                                  width: 380,
                                  height: 250,
                                }}
                                config={{
                                  displayModeBar: false, // this is the line that hides the bar.
                                }}
                              ></Plot>
                            </div>
                            : noData()


                        )}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="col-inner">
                      <h4>{t("messages.aml.indicators.totalSystemRisk")}</h4>
                      {isLoading3 ? (
                        <div className="spinner">
                          <Spin spinning={true} size="big" />
                        </div>
                      ) : risks[0] !== undefined && risks[0].value !== 0 || risks[1] !== undefined && risks[1].value !== 0 || risks[2] !== undefined && risks[2].value !== 0 || risks[3] !== undefined && risks[3].value !== 0 ?
                          <div className="plot-container">
                            <Plot
                              data={[
                                {
                                  mode: "markers+text",
                                  x: [t("messages.aml.low"), t("messages.aml.medium"), t("messages.aml.high"), t("messages.aml.critical")],
                                  y: risks.map((el) => el.value),
                                  marker: {
                                    size: risks.map((el) => {
                                      return parseInt(
                                        (el.value /
                                          risks.reduce(
                                            (a, b) => a + (b["value"] || 0),
                                            0
                                          )) *
                                        1000
                                      );
                                    }),
                                    color: [
                                      "rgb(93, 164, 214)",
                                      "rgb(255, 144, 14)",
                                      "rgb(44, 160, 101)",
                                      "rgb(255, 65, 54)",
                                    ],
                                    sizemode: "area",
                                  },

                                  text: risks.map((el) => el.value),
                                  textposition: "right center",
                                  // cliponaxis: false,
                                },
                              ]}
                              layout={{
                                margin: {
                                  l: 50,
                                  r: 30,
                                  b: 50,
                                  t: 0,
                                },
                                hovermode: false,
                                yaxis: {
                                  title: {
                                    text: t("messages.aml.indicators.RegistersAmount"),
                                  },
                                },
                                legend: { orientation: "h" },
                                showlegend: false,
                                paper_bgcolor: "transparent",
                                plot_bgcolor: "transparent",
                                width: 390,
                                height: 250,
                              }}
                              config={{
                                displayModeBar: false, // this is the line that hides the bar.
                              }}
                            ></Plot>
                          </div>
                          : noData()
                      }
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          ))}
        </div>
      </div>
      {
        isModalRulesTableVisible&&
        <div id="modal-user">
          <TableModal 
            onCancel = {handleModalRulesTableCancel}
            dataSource = {[...rules].reverse()}
            columns={rulesTableColumns}
            title={"Tabla de Reglas"}
          />
        </div>
      }
    </>
  );
};

export default TabIndicators;
