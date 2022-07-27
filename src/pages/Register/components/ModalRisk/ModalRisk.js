import './ModalRisk.scss'
import React, { useState, useEffect } from 'react'
import { Descriptions, Button, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import { getClientDetailPromise, getClientHistoryMonitoreoPromise } from '../../promises'
import { camelizerHelper } from '../../../../helpers'
import apiConfig from '../../../../config/api'
import Plot from "react-plotly.js";
import moment from 'moment';


const ModalRisk = ({ record }) => {
  const { t } = useTranslation()

  const [ setClientDetail] = useState(null)
  const [clientHistory, setClientHistory] = useState(null)
  const [ubos, setUbos] = useState([])

  useEffect(() => {
    if (record.id !== null && record.id !== undefined) {
      getClientDetailPromise(record.id)
        .then(response => {
          setClientDetail(response)
          if (response.entity !== null && response.entity.propietarios !== null) {
            setUbos(getRiskUbos(response))
          }
        })
      getClientHistoryMonitoreoPromise(record.id)
        .then(response => {
          setClientHistory(response)
        })
    }
  }, [])

  const labelFormatterPlotly = (e) => {
    switch (e) {
      case 0: return '0'
      case 1: return '1'
      case 2: return '2'
      case 3: return '3'
      case 4: return '4'
      default: return ''
    }
  }




  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const getValueRisk = (risk) => {
    if (risk !== null) {
      if (risk === 'GREEN') return 0
      else if (risk === 'YELLOW') return 1
      else if (risk === 'ORANGE') return 2
      else if (risk === 'RED') return 3
      else if (risk === 'BLACK') return 4
    }
    return 0
  }

  const getColorByRisk = (risk) => {
    if (risk === 'GREEN') return '#598756'
    else if (risk === 'YELLOW') return '#fcdc6b'
    else if (risk === 'ORANGE') return '#FE9F0C'
    else if (risk === 'RED') return '#d9534f'
    else if (risk === 'BLACK') return '#4C4C4C'
  }

  const getRiskName = (risk) => {
    if (risk === 'GREEN') return t('messages.aml.risk.N')
    else if (risk === 'YELLOW') return t('messages.aml.low')
    else if (risk === 'ORANGE') return t('messages.aml.medium')
    else if (risk === 'RED') return t('messages.aml.high')
    else if (risk === 'BLACK') return t('messages.aml.critical')
  }

  let dataPoints = []
  if (clientHistory != null) {
    for (let i = 0; i < clientHistory.length; i++) {
      let parts = clientHistory[i].fecha.split('-')
      dataPoints.push({ name: getRiskName(clientHistory[i].aml_status), x: new Date(parts[2], parseInt(parts[1]) - 1, parts[0]), y: getValueRisk(clientHistory[i].aml_status), color: getColorByRisk(clientHistory[i].aml_status) })
    }
  }

  const downloadReportRisk = (pdfFile) => {
    window.open(apiConfig.url + '/../getPDFUboFinder?path=' + pdfFile)
  }

  const getRiskUbos = (data) => {
    let rows = []
    if (data.entity !== null) {
      if (data.entity.amlStatus !== null && data.entity.amlStatus !== 'GREEN') {
        data.entity.type = data.clCliente.type
        rows.push(data.entity)
      }
      for (let i = 0; i < data.entity.propietarios.length; i++) {
        if (data.entity.propietarios[i].amlStatus !== null && data.entity.propietarios[i].amlStatus !== 'GREEN') {
          rows.push(data.entity.propietarios[i])
        }
      }
    }
    return rows
  }

  const getBasesAML = (bases) => {
    if (bases !== null) return bases.join()
  }

  const riskHistoryColumns = [
    {
      title: t('messages.aml.date'),
      dataIndex: 'fecha',
      width: 200
    }, {
      title: t('messages.aml.risk'),
      dataIndex: 'aml_status',
      width: 200,
      render: (text, record) => {
        return <div className={'onboarding risk-' + text} />
      }
    }, {
      title: t('messages.aml.databases'),
      dataIndex: 'bases_aml'
    }

  ]

  const getTypeRelated = (type) => {
    if(type === "REPLEGAL") return t('messages.aml.repLegal')
    else if(type === "DIRECTOR") return "Director"
    else if(type === "GERENTE_GENERAL") return "Gerente"
    else if(type === "EJ_PRINCIPAL") return "Ejecutivo Principal"
    else if(type === "AVAL") return "Aval o Coaval"
    else if(type === "APODERADO") return "Apoderado"
    else return type
  }

  const riskTableColumns = [
    {
      title: t('messages.aml.type'),
      dataIndex: 'type',
      width: 100,
      render: (text, record) => {
        if (text === 'Entity') {
          return t('messages.aml.entity')
        } else if(record.origenMallaPropiedad === 'CLIENTE'){
          return "UBO"
        }else {
          return getTypeRelated(record.origenMallaPropiedad)
        }
      }
    },
    {
      title: t('messages.aml.rut'),
      dataIndex: 'rut',
      width: 100,
      render: (text, record) => {
        if (record.pais === 'NACIONAL') {
          return text
        }
      }
    },
    {
      title: t('messages.aml.name'),
      dataIndex: 'name',
      width: 220,
      render: (text) => camelizerHelper(text)
    },
    {
      title: t('messages.aml.risk'),
      dataIndex: 'amlStatus',
      width: 70,
      render: (text) => <div className={'onboarding risk-' + text} />
    },
    {
      title: t('messages.aml.module'),
      dataIndex: 'baseAml',
      width: 150
    },
    {
      title: t('messages.aml.download'),
      dataIndex: 'pdfFile',
      width: 80,
      render: (text) => <Button type="primary" icon="file-pdf" onClick={(e) => downloadReportRisk(text)} />
    }
    /*,
    {
      title: 'Revisión',
      dataIndex: 'estadoFP',
      width: 80,
      render: (text) => {
        debugger
        if (text === null) {
          return <Tooltip title="Coincidencia exacta"><Icon type="check" /></Tooltip>
        } else if (text === 'PENDIENTE') {
          return <Tooltip title="Pendiente por revisar"><Icon type="warning" /></Tooltip>
        } else {
          return <Tooltip title="Revisado"><Icon type="solution" /></Tooltip>
        }
      }
    }*/
  ]

  const getHistorial = () => {
    let history = []
    if (clientHistory !== null) {
      for (let i = clientHistory.length; i > 0; i--) {
        history.push(clientHistory[i - 1])
      }
    }
    return history
  }

  return (
    <div className="modal-risk">
      { record.id !== null && record.id !== undefined &&
        <Descriptions layout="vertical" size="small" column={2} bordered>
          <Descriptions.Item label="Rut">
            {record.rut}
          </Descriptions.Item>
          <Descriptions.Item label={t('messages.aml.name')}>
            {camelizerHelper(record.nombre)}
          </Descriptions.Item>
          <Descriptions.Item label={t('messages.aml.type')}>
            {record.type}
          </Descriptions.Item>
          <Descriptions.Item label={t('messages.aml.risk')}>
            <div className={'onboarding risk-' + record.amlStatus} />
          </Descriptions.Item>
          {record.pdfFile !== null && record.pdfFile !== '' &&
            <Descriptions.Item label={t('messages.aml.downloadPDF')}>
              <Button type="primary" icon="file-pdf" onClick={(e) => downloadReportRisk(record.pdfFile)} />
            </Descriptions.Item>
          }
          {record.pdfFile !== null && record.pdfFile !== '' &&
            <Descriptions.Item label={t('messages.aml.databases')}>
              {getBasesAML(record.basesAml)}
            </Descriptions.Item>
          }
          {ubos !== null && ubos.length > 0 &&
            <Descriptions.Item label={t('messages.aml.databases')} span={2}>
              {getBasesAML(record.basesAml)}
            </Descriptions.Item>
          }
          {ubos !== null && ubos.length > 0 &&
            <Descriptions.Item label={t('messages.aml.detail')} span={2}>
              <Table dataSource={ubos} columns={riskTableColumns} pagination={false} size='small' />
            </Descriptions.Item>
          }
          <Descriptions.Item label="Historia" span={2}>
            <div className="risk-chart">
              <div className="risk-chart-inner">
                <Plot
                  data={
                    [
                      {
                        x: clientHistory !== null ? clientHistory.map(obj=>{
                          return moment(obj.fecha,'DD-MM-YYYY').format('YYYY-MM-DD')
                        }):null,
                        y: clientHistory !== null ? clientHistory.map(obj=>getValueRisk(obj.aml_status)):null,
                        hovertemplate: '%{text}<extra></extra>',
                        text : clientHistory !== null ? clientHistory.map(obj=>{
                          return '<b>'+obj.fecha + ': '+getRiskName(obj.aml_status)+'</b>'
                        }):null,
                        type: 'scatter',
                        line: {
                          shape: 'spline',
                          smoothing: '1.2',
                          width: 2,
                          color: 'rgb(109 120 174)',
                        },

                        mode: 'lines+markers',
                        marker: {
                          color: clientHistory !== null ? clientHistory.map(detail=>getColorByRisk(detail.aml_status)):null,
                          size: 7,
                        },
                      },
                    ]
                  }

                  layout=
                  {{
                    hovermode: 'closest',
                    showlegend: false,
                    margin: {
                      l: 25,
                      r: 20,
                      b: 60,
                      t: 0,
                    },
                    width: 800,
                    height: 250,
                    // title: '',
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    autoscale: false,
                    xaxis: {
                      type:'array',
                      tickvals: clientHistory !== null ? clientHistory.map(obj=>{
                        return moment(obj.fecha,'DD-MM-YYYY').format('YYYY-MM-DD')
                      }):null,
                      ticktext: clientHistory !== null ? clientHistory.map(obj=>{
                        return capitalizeFirstLetter(moment(obj.fecha,'DD-MM-YYYY').format('MMM DD YYYY'))
                      }):null,
                      showgrid: false,
                      showticklabels: true,
                      tickfont: {
                        family: 'Arial, sans-serif',
                        size: 9,
                        color: 'rgb(103 103 103)'
                      },
                      ticklen: 4,
                      tickwidth: 1,
                      tickcolor: "#000",
                      dtick: 1,
                      // showline: true,
                      // linewidth:2
                    },
                    yaxis: {
                      rangemode:'tozero',
                      range:[0, 5],
                      // type:'linear',
                      title: 'Risk',
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
                      // autotick:false,
                      // tick0:0,
                      // dtick:1,
                      ticklen: 4,
                      tickwidth: 1,
                      tickcolor: "#000",
                      tickmode: 'array',
                      tickvals: [0,1,2,3,4],
                      ticktext: [0,1,2,3,4].map(i => labelFormatterPlotly(i)),
                      showgrid: true,
                      gridcolor: 'rgb(187 187 187)',
                      // showline: true,
                      // linewidth:2
                      // zeroline:true
                    }

                  }}

                  config={{
                    displayModeBar: false, // this is the line that hides the bar.
                  }}
                >
                </Plot>
              </div>
            </div>
            <br />
            <Table dataSource={getHistorial()} columns={riskHistoryColumns} pagination={true} size='small' />
          </Descriptions.Item>
        </Descriptions>
      }
    </div>
  )
}
export default ModalRisk;