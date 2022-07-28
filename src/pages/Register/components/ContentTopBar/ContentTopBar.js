import './ContentTopBar.scss'
import React, { useEffect, useState } from 'react'
import { Icon, Switch } from 'antd'
import { useTranslation } from 'react-i18next'
import { CakeChart } from '../'

const ContentTopBar = ({ isLoading, firstLoading, colors, colorsCake, onChangeFilters, filters }) => {
  const { t } = useTranslation()

  useEffect(() => {
    //init()
  }, [])

  const init = async () => {
    if(filters['amlStatus'] === null) {
      //filters['amlStatus'] = ['BLACK', 'RED', 'YELLOW', 'GREEN', 'NA']
    }
  }

  debugger
  return (
    <div className="content-top-bar">
      <div className="cake-wrapper">
        <CakeChart isLoading={ isLoading } firstLoading={ firstLoading } colorsCake={colorsCake} />
      </div>
      <div className="risk-levels-wrapper">
        <ul>
          <li className={ filters['amlStatus'] === null || filters['amlStatus'] === undefined || filters['amlStatus'].length === 0 || filters['amlStatus'].includes('BLACK') ? 'is-checked' : 'is-not-checked' }>
            <span className="percent">{ colorsCake.total === 0 ? 0 : Math.round((colorsCake.critical * 100) / colorsCake.total) }%</span>
            <span className="percent-locked"><Icon type="stop" /></span>

            <Switch size="small" checked={ filters['amlStatus'] !== null && filters['amlStatus'] !== undefined && filters['amlStatus'].includes('BLACK') } onChange={ (value) => onChangeFilters('amlStatus', 'BLACK', value) } />
            <div className="risk-level-inner">
              <div id="animated-number-black" className="circle risk-BLACK">{ colors.black }</div>
              <span className="risk-level-name">{ t('messages.aml.riskCritical') }</span>
            </div>
          </li>
          <li className={ filters['amlStatus'] === null || filters['amlStatus'] === undefined || filters['amlStatus'].length === 0 || filters['amlStatus'].includes('RED') ? 'is-checked' : 'is-not-checked' }>
            <span className="percent">{ colorsCake.total === 0 ? 0 : Math.round((colorsCake.high * 100) / colorsCake.total) }%</span>
            <span className="percent-locked"><Icon type="stop" /></span>

            <Switch size="small" checked={ filters['amlStatus'] !== null && filters['amlStatus'] !== undefined && filters['amlStatus'].includes('RED') } onChange={ (value) => onChangeFilters('amlStatus', 'RED', value) } />
            <div className="risk-level-inner">
              <div  id="animated-number-red" className="circle risk-RED">{ colors.red }</div>
              <span className="risk-level-name">{ t('messages.aml.riskHigh') }</span>
            </div>
          </li>
          <li className={ filters['amlStatus'] === null || filters['amlStatus'] === undefined || filters['amlStatus'].length === 0 || filters['amlStatus'].includes('ORANGE') ? 'is-checked' : 'is-not-checked' }>
            <span className="percent">{ colorsCake.total === 0 ? 0 : Math.round((colorsCake.medium * 100) / colorsCake.total) }%</span>
            <span className="percent-locked"><Icon type="stop" /></span>

            <Switch size="small" checked={ filters['amlStatus'] !== null && filters['amlStatus'] !== undefined && filters['amlStatus'].includes('ORANGE') } onChange={ (value) => onChangeFilters('amlStatus', 'ORANGE', value) } />
            <div className="risk-level-inner">
              <div id="animated-number-orange" className="circle risk-ORANGE">{ colors.orange }</div>
              <span className="risk-level-name">{ t('messages.aml.riskMedium') }</span>
            </div>
          </li>
          <li className={ filters['amlStatus'] === null || filters['amlStatus'] === undefined || filters['amlStatus'].length === 0 || filters['amlStatus'].includes('YELLOW') ? 'is-checked' : 'is-not-checked' }>
            <span className="percent">{ colorsCake.total === 0 ? 0 : Math.round((colorsCake.low * 100)/ colorsCake.total) }%</span>
            <span className="percent-locked"><Icon type="stop" /></span>

            <Switch size="small" checked={ filters['amlStatus'] !== null && filters['amlStatus'] !== undefined && filters['amlStatus'].includes('YELLOW') } onChange={ (value) => onChangeFilters('amlStatus', 'YELLOW', value) } />
            <div className="risk-level-inner">
              <div  id="animated-number-yellow" className="circle risk-YELLOW">{ colors.yellow }</div>
              <span className="risk-level-name">{ t('messages.aml.riskLow') }</span>
            </div>
          </li>
          <li className={ filters['amlStatus'] === null || filters['amlStatus'] === undefined || filters['amlStatus'].length === 0 || filters['amlStatus'].includes('GREEN') ? 'is-checked' : 'is-not-checked' }>
            <span className="percent">{ colorsCake.total === 0 ? 0 : Math.round((colorsCake.n * 100) / colorsCake.total) }%</span>
            <span className="percent-locked"><Icon type="stop" /></span>

            <Switch size="small" checked={ filters['amlStatus'] !== null && filters['amlStatus'] !== undefined && filters['amlStatus'].includes('GREEN') } onChange={ (value) => onChangeFilters('amlStatus', 'GREEN', value) } />
            <div className="risk-level-inner">
              <div id="animated-number-green" className="circle risk-GREEN">{ colors.green }</div>
              <span className="risk-level-name">{ t('messages.aml.risk.N') }</span>
            </div>
          </li>
          <li className={ filters['amlStatus'] === null || filters['amlStatus'] === undefined || filters['amlStatus'].length === 0 || filters['amlStatus'].includes('NA') ? 'is-checked' : 'is-not-checked' }>
            <span className="percent">{ colorsCake.total === 0 ? 0 : Math.round((colorsCake.na * 100) / colorsCake.total) }%</span>
            <span className="percent-locked"><Icon type="stop" /></span>

            <Switch size="small"  checked={ filters['amlStatus'] !== null && filters['amlStatus'] !== undefined && filters['amlStatus'].includes('NA') } onChange={ (value) => onChangeFilters('amlStatus', 'NA', value) } />
            <div className="risk-level-inner">
              <div id="animated-number-grey" className="circle risk-GRAY">{ colors.na }</div>
              <span className="risk-level-name">{ t('messages.aml.notProcessed') }</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ContentTopBar
