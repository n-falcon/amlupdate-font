import './CakeRisk.scss'
import React, { useState } from 'react'
import { Switch, Icon } from 'antd'
import { useTranslation } from 'react-i18next'
import Plot from "react-plotly.js";

const CakeRisks = ({ isLoading, total, handlerFilterRisk, colors }) => {
  const [filterRisk, setFilterRisk] = useState([])
  const [ dataChart, setDataChart ] = useState(null)
  const { t } = useTranslation()

  const data = [
    { title: t('messages.aml.riskHigh'), value: colors.high, color: '#d9534f' },
    { title: t('messages.aml.riskMedium'), value: colors.medium, color: '#FFC433' },
    { title: t('messages.aml.riskLow'), value: colors.low, color: '#fcdc6b' },
    { title: 'No Posee', value: colors.n, color: '#598756' },
    { title: 'No Asignado', value: colors.na, color: '#999999' }
  ]

  const changeFilterRisk = (risk, value) => {
    if(value) {
      if(!filterRisk.includes(risk)) filterRisk.push(risk)
      setFilterRisk(filterRisk)
    }else {
      let index = filterRisk.indexOf(risk)
      if(filterRisk.includes(risk)) filterRisk.splice(index, 1)
      setFilterRisk(filterRisk)
    }

    let data = []
    if(filterRisk.length === 0 || filterRisk.includes('HIGH')) {
      data.push({ title: t('messages.aml.riskHigh'), value: colors.high, color: '#d9534f' })
    }
    if(filterRisk.length === 0 || filterRisk.includes('MEDIUM')) {
      data.push({ title: t('messages.aml.riskMedium'), value: colors.medium, color: '#FFC433' })
    }
    if(filterRisk.length === 0 || filterRisk.includes('LOW')) {
      data.push({ title: t('messages.aml.riskLow'), value: colors.low, color: '#fcdc6b' })
    }
    if(filterRisk.length === 0 || filterRisk.includes('N')) {
      data.push({ title: 'No Posee', value: colors.n, color: '#598756' })
    }
    if(filterRisk.length === 0 || filterRisk.includes('NA')) {
      data.push({ title: 'No Asignado', value: colors.na, color: '#999999' })
    }
    setDataChart(data)
    handlerFilterRisk(filterRisk)
  }

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
    <div className='cake-risks'>
      <div className='cake'>
        { !isLoading && graphGenerator(dataChart === null ? data : dataChart)}
        { !isLoading && <div className='totalNum'>{ total }</div>}

      </div>
      <div className={'risk-block ' + (filterRisk.length === 0 || filterRisk.includes('HIGH') ? 'is-checked' : 'is-not-checked')}>
        <div className='top-bar'>
          { !isLoading && (filterRisk.length === 0 || filterRisk.includes('HIGH')) && <span>{  (total > 0 ? Math.round((colors.high * 100) / total) : 0) + ' %' }</span> }
          <span className="percent-locked"><Icon type="stop" /></span>
          <Switch size='small' onChange={ value => changeFilterRisk('HIGH', value)} />
        </div>
        <div className='inner-circle' style={{ backgroundColor: '#d9534f', color: 'white' }}>{ colors.high }</div>
        <div className='bottom-label'>{ t('messages.aml.riskHigh') }</div>
      </div>
      <div className={'risk-block ' + (filterRisk.length === 0 || filterRisk.includes('MEDIUM') ? 'is-checked' : 'is-not-checked')}>
        <div className='top-bar'>
        { !isLoading && (filterRisk.length === 0 || filterRisk.includes('MEDIUM')) && <span>{  (total > 0 ? Math.round((colors.medium * 100) / total) : 0) + ' %' }</span> }
          <span className="percent-locked"><Icon type="stop" /></span>
          <Switch size='small' onChange={ value => changeFilterRisk('MEDIUM', value)} />
        </div>
        <div className='inner-circle' style={{ backgroundColor: '#FFC433' }}>{ colors.medium }</div>
        <div className='bottom-label'>{ t('messages.aml.riskMedium') }</div>
      </div>
      <div className={'risk-block ' + (filterRisk.length === 0 || filterRisk.includes('LOW') ? 'is-checked' : 'is-not-checked')}>
        <div className='top-bar'>
        { !isLoading && (filterRisk.length === 0 || filterRisk.includes('LOW')) && <span>{  (total > 0 ? Math.round((colors.low * 100) / total) : 0) + ' %' }</span> }
          <span className="percent-locked"><Icon type="stop" /></span>
          <Switch size='small' onChange={ value => changeFilterRisk('LOW', value)} />
        </div>
        <div className='inner-circle' style={{ backgroundColor: '#fcdc6b' }}>{ colors.low }</div>
        <div className='bottom-label'>{ t('messages.aml.riskLow') }</div>
      </div>
      <div className={'risk-block ' + (filterRisk.length === 0 || filterRisk.includes('N') ? 'is-checked' : 'is-not-checked')}>
        <div className='top-bar'>
        { !isLoading && (filterRisk.length === 0 || filterRisk.includes('N')) && <span>{  (total > 0 ? Math.round((colors.n * 100) / total) : 0) + ' %' }</span> }
          <span className="percent-locked"><Icon type="stop" /></span>
          <Switch size='small' onChange={ value => changeFilterRisk('N', value)} />
        </div>
        <div className='inner-circle' style={{ backgroundColor: '#598756' }}>{ colors.n }</div>
        <div className='bottom-label'>No posee</div>
      </div>
      <div className={'risk-block ' + (filterRisk.length === 0 || filterRisk.includes('NA') ? 'is-checked' : 'is-not-checked')}>
        <div className='top-bar'>
        { !isLoading && (filterRisk.length === 0 || filterRisk.includes('NA')) && <span>{  (total > 0 ? Math.round((colors.na * 100) / total) : 0) + ' %' }</span> }
          <span className="percent-locked"><Icon type="stop" /></span>
          <Switch size='small' onChange={ value => changeFilterRisk('NA', value)}  />
        </div>
        <div className='inner-circle' style={{ backgroundColor: '#999999', color: 'white' }}>{ colors.na }</div>
        <div className='bottom-label'>No asignado</div>
      </div>
    </div>
  )
}

export default CakeRisks
