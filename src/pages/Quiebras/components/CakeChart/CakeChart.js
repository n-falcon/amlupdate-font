import './CakeChart.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Spin } from 'antd'
import Plot from "react-plotly.js"

export default ({  firstLoading, totalNum, riskCritical, riskHigh, riskMedium, riskLow, riskNa }) => {
  const { t } = useTranslation()

  const data = [
    { title: t('messages.aml.riskCritical'), value: riskCritical, color: '#000000' },
    { title: t('messages.aml.riskHigh'), value: riskHigh, color: '#d9534f' },
    { title: t('messages.aml.riskMedium'), value: riskMedium, color: '#fcdc6b' },
    { title: t('messages.aml.riskLow'), value: riskLow, color: '#598756' },
    { title: t('messages.aml.notProcessed'), value: riskNa, color: '#999' }
  ]

  const graphGenerator = (graphData) => {
    const values = graphData.map(x => x.value);
    const labels = graphData.map(x => x.title);
    const color =  graphData.map(x => x.color);

    const dataGraph = [{
      type: "pie",
      values: values,
      labels: labels,
      hoverinfo: "",
      textposition: "inside",
      textinfo: 'none',
      automargin: false,
      hole: .74,
      marker: {
        colors: color
      },
    },
    ]
    const layoutGraph = {
      showlegend: false,
      height: 133,
      width: 133,
      margin: {
        l: 6,
        r: 6,
        b: 6,
        t: 6,
      },
    }
    return (
        <Plot data={dataGraph} layout={layoutGraph} />
    )
  }


  return (
    <div className="cake">
      { firstLoading ?
        <div className="cake-is-loading">
          <Spin spinning={ true } />
        </div>
        :
        <>
          {graphGenerator(data)}
          <span className="results-number">{ totalNum }</span>
          <span className="results-label">{ t('messages.aml.results') }</span>
        </>
      }
    </div>
  )
}
