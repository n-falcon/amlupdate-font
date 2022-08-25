import './CakeChart.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Spin } from 'antd'
import PieChart from 'react-minimal-pie-chart'

export default ({ isLoading, firstLoading, totalNum, riskCritical, riskHigh, riskMedium, riskLow, riskNa }) => {
  const { t } = useTranslation()

  const data = [
    { title: t('messages.aml.riskCritical'), value: riskCritical, color: '#000000' },
    { title: t('messages.aml.riskHigh'), value: riskHigh, color: '#d9534f' },
    { title: t('messages.aml.riskMedium'), value: riskMedium, color: '#fcdc6b' },
    { title: t('messages.aml.riskLow'), value: riskLow, color: '#598756' },
    { title: t('messages.aml.notProcessed'), value: riskNa, color: '#999' }
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
          <span className="results-number">{ totalNum }</span>
          <span className="results-label">{ t('messages.aml.results') }</span>
        </>
      }
    </div>
  )
}
