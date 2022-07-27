import './InfoTabContent.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Table } from 'antd'
import { camelizerHelper } from '../../../../helpers'
import Plot from "react-plotly.js";
import moment from "moment";

export default (props) => {
  const { person } = props
  const { compliance } = props
  const { isChile } = props
  const { t } = useTranslation()


  const labelFormatterPlotly = (e) => {
    switch (e) {
      case 1: return '1: Sin Ventas'
      case 2: return '2: Micro 1: 200'
      case 3: return '3: Micro 2: 600'
      case 4: return '4: Micro 3: 2.400'
      case 5: return '5: Pequeña 1: 5.000'
      case 6: return '6: Pequeña 2: 10.000'
      case 7: return '7: Pequeña 3: 25.000'
      case 8: return '8: Mediana 1: 50.000'
      case 9: return '9: Mediana 2: 100.000'
      case 10: return '10: Grande 1: 200.000'
      case 11: return '11: Grande 2: 600.000'
      case 12: return '12: Grande 3: 1.000.000'
      case 13: return '13: Grande 4: +1.000.000'
      default: return ''
    }
  }

  const tableColumnsActivities = [
    {
      title: t('messages.aml.code'),
      dataIndex: 'codigo'
    },
    {
      title: t('messages.aml.description'),
      dataIndex: 'descripcion'
    }
  ]

  const tableColumnsAddresses = [
    {
      title: t('messages.aml.type'),
      dataIndex: 'tipo',
      render: (text) => t('messages.aml.address.type.' + text)
    },
    {
      title: t('messages.aml.address'),
      dataIndex: 'calle',
      render: (text) => camelizerHelper(text)
    },
    {
      title: t('messages.aml.number'),
      dataIndex: 'numero'
    },
    {
      title: t('messages.aml.neighbourhood'),
      dataIndex: 'comuna',
      render: (text) => camelizerHelper(text)
    },
    {
      title: t('messages.aml.region'),
      dataIndex: 'region'
    }
  ]

  const tableVehiculos = [
    {
      title: t('messages.aml.marca'),
      dataIndex: 'marca'
    },
    {
      title: t('messages.aml.modelo'),
      dataIndex: 'modelo'
    },
    {
      title: t('messages.aml.year'),
      dataIndex: 'anno'
    },
    {
      title: t('messages.aml.tasacion'),
      dataIndex: 'tasacion',
      align: 'right',
      render: (text) => {
        if (text !== null && text !== undefined)
          return '$ ' + text.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      }
    }
  ]

  const tableParientes = [
    {
      title: t('messages.aml.rut'),
      dataIndex: 'formatRut'
    },
    {
      title: t('messages.aml.name'),
      dataIndex: 'name',
      render: (text) => camelizerHelper(text)
    },
    {
      title: t('messages.aml.relationship'),
      dataIndex: 'relation',
      render: (text) => camelizerHelper(text)
    },
    {
      title: t('messages.aml.category'),
      dataIndex: 'category',
      render: (text) => camelizerHelper(text)
    }
  ]

  let dataPoints = []
  if (person.tramosVenta != null) {
    for (let i = 0; i < person.tramosVenta.length; i++) {
      dataPoints.push({ x: person.tramosVenta[i].anio, y: person.tramosVenta[i].tramo, markerSize: 10, markerBorderThickness: 5, markerColor: 'rgba(255,255,255,.7)', markerBorderColor: 'rgba(91,160,253,.7)' })
    }
  }

  let parientes = null
  if (compliance.compliance !== undefined) {
    if (compliance.compliance.PEPSAN !== undefined && compliance.compliance.PEPSAN.bases !== null && compliance.compliance.PEPSAN.bases.includes('PEPV') && compliance.compliance.PEPSAN.details !== null && compliance.compliance.PEPSAN.details !== undefined && compliance.compliance.PEPSAN.details.pepVinculados !== undefined && compliance.compliance.PEPSAN.details.pepVinculados !== null) {
      parientes = []
      for (let i = 0; i < compliance.compliance.PEPSAN.details.pepVinculados.length; i++) {
        let vinc = compliance.compliance.PEPSAN.details.pepVinculados[i]
        if (vinc.pepPorParentesco) {
          parientes.push({ formatRut: vinc.formatRut, name: vinc.nombreCompleto, relation: vinc.tipoParentesco, category: vinc.categoriaPep })
        }
      }
    } else if (compliance.compliance.KYCAME !== undefined && compliance.compliance.KYCAME.bases !== null && compliance.compliance.KYCAME.bases.includes('PEPH') && compliance.compliance.KYCAME.details !== null && compliance.compliance.KYCAME.details !== undefined && compliance.compliance.KYCAME.details.pepHVinculados !== undefined && compliance.compliance.KYCAME.details.pepHVinculados !== null) {
      parientes = []
      for (let i = 0; i < compliance.compliance.KYCAME.details.pepHVinculados.length; i++) {
        let vinc = compliance.compliance.KYCAME.details.pepHVinculados[i]
        if (vinc.pepPorParentesco) {
          parientes.push({ formatRut: vinc.formatRut, name: vinc.nombreCompleto, relation: vinc.tipoParentesco, category: vinc.categoriaPep })
        }
      }
    } else if (compliance.compliance.KYCAME !== undefined && compliance.compliance.KYCAME.bases !== null && compliance.compliance.KYCAME.bases.includes('PEPC') && compliance.compliance.KYCAME.details !== null && compliance.compliance.KYCAME.details !== undefined && compliance.compliance.KYCAME.details.pepCVinculados !== undefined && compliance.compliance.KYCAME.details.pepCVinculados !== null) {
      parientes = []
      for (let i = 0; i < compliance.compliance.KYCAME.details.pepCVinculados.length; i++) {
        let vinc = compliance.compliance.KYCAME.details.pepCVinculados[i]
        if (vinc.pepPorParentesco) {
          parientes.push({ formatRut: vinc.formatRut, name: vinc.nombreCompleto, relation: vinc.tipoParentesco, category: vinc.categoriaPep })
        }
      }
    }
  }

  return (
    <div id="tab-content-1" className="tab-content">
      <Row>
        <Col xs={12}>
          <div className="col-inner">
            <strong>{t('messages.aml.name')}</strong>
            {camelizerHelper(person.name)}
          </div>
        </Col>
        <Col xs={12}>
          <div className="col-inner">
            <strong>{t('messages.aml.rut')}</strong>
            {person.formatRut}
          </div>
        </Col>
        {person.type === 'Person' && person.rut !== null &&
          <>
          <Col xs={12}>
            <div className="col-inner">
              <strong>{t('messages.aml.citizenship')}</strong>
              {person.nacionalidad ? person.nacionalidad : 'N/A'}
            </div>
          </Col>
          <Col xs={12}>
            <div className="col-inner">
              <strong>{t('messages.aml.birthDate')}</strong>
              {person.fecNac ? person.fecNac : 'N/A'}
            </div>
          </Col>
          </>
        }
      </Row>
      { isChile &&
        <div>
          {person.type === 'Person' && person.actEcos && person.actEcos.length > 0 &&
            <Row>
              <Col xs={24}>
                <div className="col-inner list">
                  <strong>{t('messages.aml.economicalActivities')}</strong>
                  <Table dataSource={person.actEcos} columns={tableColumnsActivities} pagination={true} size="small" />
                </div>
              </Col>
            </Row>
          }
          {person.type === 'Entity' &&
            <>
              <Row>
                <Col xs={12}>
                  <div className="col-inner">
                    <strong>{t('messages.aml.startingDate')}</strong>
                    {person.fecInicio}
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="col-inner">
                    <strong>{t('messages.aml.endingDate')}</strong>
                    {person.fecTermino}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={24}>
                  <div className="col-inner list">
                    <strong>{t('messages.aml.economicalActivities')}</strong>
                    <Table dataSource={person.actEcos} columns={tableColumnsActivities} pagination={true} size="small" />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={24}>
                  <div className="col-inner list">
                    <strong>{t('messages.aml.addresses')}</strong>
                    <Table dataSource={person.direcciones} columns={tableColumnsAddresses} pagination={true} size="small" />
                  </div>
                </Col>
              </Row>

              { person.tramosVenta !== null &&
                <Row>
                  <Col xs={24}>
                    <div className="col-inner list">
                      <strong>{t('messages.aml.tramosVenta')}</strong>
                      <div className="ventas-chart">
                        <div className="ventas-chart-inner">
                          <Plot
                            data={
                              [
                                {
                                  x: person.tramosVenta.map(el => el.anio),
                                  y: person.tramosVenta.map(el => el.tramo),
                                  type: 'scatter',
                                  line: {
                                    shape: 'spline',
                                    smoothing: '1.3',
                                    width: 4,
                                    color: 'rgb(138 187 249)',
                                  },
                                  mode: 'lines+markers',
                                  marker: {
                                    color: 'rgb(217 231 251)',
                                    size: 10,
                                    line: {
                                      color: 'rgb(138 187 249)',
                                      width: 5
                                    }
                                  },

                                },
                              ]
                            }

                            layout=
                            {{
                              hovermode: 'closest',
                              showlegend: false,
                              margin: {
                                l: 110,
                                r: 20,
                                b: 30,
                                t: 0,
                              },
                              width: 700,
                              height: 200,
                              title: 'Tramos de Venta',

                              paper_bgcolor: 'rgba(0,0,0,0)',
                              plot_bgcolor: 'rgba(0,0,0,0)',
                              autoscale: false,
                              xaxis: {
                                showgrid: false,
                                showticklabels: true,
                                tickfont: {
                                  family: 'Arial, sans-serif',
                                  size: 10,
                                  color: 'rgb(103 103 103)'
                                },
                                dtick: 1
                              },
                              yaxis: {
                                title: 'Ventas anuales en UF',
                                titlefont: {
                                  family: 'Arial, sans-serif',
                                  size: 10,
                                  color: 'rgb(103 103 103)'
                                },
                                showticklabels: true,
                                tickfont: {
                                  family: 'Arial, sans-serif',
                                  size: 10,
                                  color: 'rgb(103 103 103)'
                                },
                                range: [0, 14],
                                tickmode: 'array',
                                tickvals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                                ticktext: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(i => labelFormatterPlotly(i)),
                                showgrid: true,
                                gridcolor: 'rgb(187 187 187)',
                              }
                            }}

                            config={{
                              displayModeBar: false, // this is the line that hides the bar.
                            }}
                          >
                          </Plot>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              }

            </>
          }
          {person.vehiculos && person.vehiculos.length > 0 &&
            <Row>
              <Col xs={24}>
                <div className="col-inner list">
                  <strong>{t('messages.aml.vehiculosInscritos')}</strong>
                  <Table dataSource={person.vehiculos} columns={tableVehiculos} pagination={true} size="small" />
                </div>
              </Col>
            </Row>
          }
          {parientes && parientes.length > 0 &&
            <Row>
              <Col xs={24}>
                <div className="col-inner list">
                  <strong>{t('messages.aml.mallaParental')}</strong>
                  <Table dataSource={parientes} columns={tableParientes} pagination={true} size="small" />
                </div>
              </Col>
            </Row>
          }
        </div>
      }
    </div>
  )
}
