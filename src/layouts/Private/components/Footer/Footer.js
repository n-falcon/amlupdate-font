import './Footer.scss'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import i18nextConfig from '../../../../config/i18next'
import moment from 'moment'
import { LocalStorageService } from '../../../../services'
import { Col, Icon, Row } from 'antd'
import iconLangEsCl from './lang-es.png'
import iconLangEsPe from './lang-es-pe.png'
import iconLangEsCr from './lang-es.png'
import iconLangEn from './lang-en.png'
import logoAml from './logo-aml.png'
import logoTemp from './logo-temp.png'
import { hotjar } from 'react-hotjar';

export default ({ currentUser, hotjarVal }) => {
  const { t } = useTranslation()

  const lang = LocalStorageService.read('i18nextLng')

  const [language, setLanguage] = useState(lang)
  const [theme, setTheme] = useState('theme-metal')

  useEffect(() => {
    let theme = LocalStorageService.read('theme')

    if ('i18nextLng' in localStorage) {
      const l = lang.substring(0, 2)
      handleLanguageChange(l)
    }

    if (theme === null) {
      theme = 'theme-metal'
      LocalStorageService.create('theme', theme)
    }
    setTheme(theme)
    document.body.className = theme

    if(hotjarVal) {
      hotjar.initialize(hotjarVal,6)
    }
  }, [])

  const handleThemeChange = (e, themeClassName) => {
    e.preventDefault()

    setTheme(themeClassName)

    document.body.className = themeClassName

    LocalStorageService.update('theme', themeClassName)
  }

  const handleLanguageChange = async (lng) => {
    const country = currentUser.cliente.pais

    let language = lng + country
    await setLanguage(language)
    await i18nextConfig.changeLanguage(language)
    await LocalStorageService.update('i18nextLng', language)
    moment.locale(lng)
  }

  return (
    <div id="footer">
      <Row className="footer-inner">
        <Col xs={ 7 }>
          {
            /*
            <div className="logo-wrapper">
              <img src={ logoTemp } alt="" style={{ height: '125px', margin: '0 auto', position: 'relative', left: '45px', marginBottom: '15px' }} /><br />
            </div>
            */
          }
          <img className="logo" src={ logoAml } alt="" />
          <div className="powered">
            <span>Powered by <a href="https://www.gesintel.cl" target="_blank">Gesintel Compliance S.A.</a></span>
          </div>
        </Col>
        <Col xs={ 5 }>
          <div className="h3-wrapper">
            <h3>{ t('messages.aml.navigation') }</h3>
          </div>
          <ul className="navigation">
            <li id="button-footer-home">
              <Link to="/">
                <div className="circle">
                  <Icon type="home" />
                </div>
                { t('messages.aml.home') }
                <Icon type="check" />
              </Link>
            </li>
            { currentUser.cliente.planHist !== null && currentUser.cliente.modules.includes('CONSULTA') && currentUser.modules !== null && currentUser.modules.includes('CONSULTA') &&
              <li id="button-footer-query">
                <Link to="/consulta">
                  <div className="circle">
                    <Icon type="file-search" />
                  </div>
                  { t('messages.aml.query') }
                   <Icon type="check" />
                </Link>
              </li>
            }
            { currentUser.cliente.planBatch !== null && currentUser.cliente.planBatch.tipo === 'ABIERTO' && currentUser.cliente.modules.includes('BATCH') && currentUser.modules !== null && currentUser.modules.includes('BATCH') &&
              <li id="button-footer-batch">
                <Link to="/masivos">
                  <div className="circle">
                    <Icon type="coffee" />
                  </div>
                  { t('messages.aml.batchProcesses') }
                   <Icon type="check" />
                </Link>
              </li>
            }
            { currentUser.cliente.modules.includes('REGISTRO') && ((currentUser.cliente.oficialCto !== null && currentUser.cliente.oficialCto.id === currentUser.id) || (currentUser.modules !== null && currentUser.modules.includes('REGISTRO'))) &&
              <li id="button-footer-register">
                <Link to="/registro">
                  <div className="circle">
                    <Icon type="user-add" />
                  </div>
                  { t('messages.aml.register') }
                  <Icon type="check" />
                </Link>
              </li>
            }
            { ( currentUser.type === 'SADMIN' || currentUser.type === 'ADMIN' || currentUser.type === 'AUDIT' ) &&
              <li id="button-footer-administration">
                <Link to="/administracion">
                  <div className="circle">
                    <Icon type="setting" />
                  </div>
                  { t('messages.aml.administration') }
                  <Icon type="check" />
                </Link>
              </li>
            }
          </ul>
        </Col>
        <Col xs={ 1 }>&nbsp;</Col>
        <Col xs={ 5 }>
          <div className="h3-wrapper">
            <h3>{ t('messages.aml.themeSelector') }</h3>
          </div>
          <ul className="selector">
            <li className={ theme === 'theme-metal' ? 'selected' : '' } onClick={ (e) => handleThemeChange(e, 'theme-metal') }>
              <a href="#">
                <div className="theme-color" style={{ backgroundColor: '#c9c7c7' }}></div>
                <span>Metal</span>
                { theme === 'theme-metal' && <Icon type="check" /> }
              </a>
            </li>
            <li className={ theme === 'theme-sepia' ? 'selected' : '' } onClick={ (e) => handleThemeChange(e, 'theme-sepia') }>
              <a href="#">
                <div className="theme-color" style={{ backgroundColor: '#cebb7d' }}></div>
                <span>{ t('messages.aml.themes.sepia') }</span>
                { theme === 'theme-sepia' && <Icon type="check" /> }
              </a>
            </li>
            <li className={ theme === 'theme-ice' ? 'selected' : '' } onClick={ (e) => handleThemeChange(e, 'theme-ice') }>
              <a href="#">
                <div className="theme-color" style={{ backgroundColor: '#c6dbf4' }}></div>
                <span>{ t('messages.aml.themes.ice') }</span>
                { theme === 'theme-ice' && <Icon type="check" /> }
              </a>
            </li>
            {
              /*
                <li className={ theme === 'theme-forest' ? 'selected' : '' } onClick={ (e) => handleThemeChange(e, 'theme-forest') }>
                  <a href="#">
                    <div className="theme-color" style={{ backgroundColor: '#efe78e' }}></div>
                    <span>{ t('messages.aml.themes.lime') }</span>
                    { theme === 'theme-forest' && <Icon type="check" /> }
                  </a>
                </li>
              */
            }
          </ul>
        </Col>
        <Col xs={ 1 }>&nbsp;</Col>
        <Col xs={ 5 }>
            <div className="h3-wrapper">
              <h3>{ t('messages.aml.languageSelector') }</h3>
            </div>
            <ul className="selector langs">
              <li className={ (language === 'esCHI' || language === 'esPER' || language === 'esCR') ? 'selected' : '' } onClick={ () => handleLanguageChange('es') }>
                  <img className="language-icon" src={ currentUser.cliente.pais === 'PER' ? iconLangEsPe : iconLangEsCl } alt="" />
                  <span>Español { currentUser.cliente.pais === 'PER' && <span>( Perú )</span> }</span>
                  <Icon type="check" />
              </li>
              <li className={ (language === 'enCHI' || language === 'enPER' || language === 'enCR') ? 'selected' : '' } onClick={ () => handleLanguageChange('en') }>
                  <img className="language-icon"  src={ iconLangEn } alt="" />
                  <span>English</span>
                  <Icon type="check" />
              </li>
            </ul>
        </Col>
      </Row>
      <Row className="footer-bottom">
        <Col xs={ 24 }>
          Copyright &copy; 2019 Gesintel Compliance S.A. - { t('messages.aml.allRightsReserved') }.
        </Col>
      </Row>
    </div>
  )
}
