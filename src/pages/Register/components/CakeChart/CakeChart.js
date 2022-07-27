import './CakeChart.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Spin } from 'antd'
import PieChart from 'react-minimal-pie-chart'

export default ({ isLoading, firstLoading, colorsCake }) => {
  const { t } = useTranslation()

  const data = [
    { title: t('messages.aml.riskCritical'), value: colorsCake.critical, color: '#000000' },
    { title: t('messages.aml.riskHigh'), value: colorsCake.high, color: '#d9534f' },
    { title: t('messages.aml.riskMedium'), value: colorsCake.medium, color: '#FE9F0C' },
    { title: t('messages.aml.riskLow'), value: colorsCake.low, color: '#fcdc6b' },
    { title: t('messages.aml.risk.N'), value: colorsCake.n, color: '#598756' },
    { title: t('messages.aml.notProcessed'), value: colorsCake.na, color: '#999' }
  ]

  return (
    <div className="cake">
      { firstLoading ?
        <div className="cake-is-loading">
          <Spin spinning={ true } />
        </div>
        :
        <>
          <PieChart
            className={ isLoading ? 'is-loading' : '' }
            animate={ true }
            animationDuration={ 500 }
            animationEasing="ease-out"
            cx={ 50 }
            cy={ 50 }
            data={ data }
            lineWidth={ 25 }
          />
          <span className="results-number">{ colorsCake.total }</span>
          <span className="results-label">{ t('messages.aml.results') }</span>
        </>
      }
    </div>
  )
}
