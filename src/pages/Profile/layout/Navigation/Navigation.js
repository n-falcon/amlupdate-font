import './Navigation.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from 'antd'

export default ({ currentUser, onChange, currentPerson = {}, isLoading }) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div id="profile-navigation" className="navigation is-loading">
        <ul>
            <li id="nav-item-1" onClick={ (e) => onChange(e, 'nav-item-1') } className="nav-item selected"><a href="#"></a></li>
            <li id="nav-item-2" onClick={ (e) => onChange(e, 'nav-item-2') } className="nav-item"><a href="#"></a></li>
            <li id="nav-item-3" onClick={ (e) => onChange(e, 'nav-item-3') } className="nav-item"><a href="#"></a></li>
            <li id="nav-item-4" onClick={ (e) => onChange(e, 'nav-item-4') } className="nav-item"><a href="#"></a></li>
            <li id="nav-item-5" onClick={ (e) => onChange(e, 'nav-item-5') } className="nav-item"><a href="#"></a></li>
        </ul>
      </div>
    )
  } else {
    return (
      <div id="profile-navigation" className="navigation">
        <ul>
            <li id="nav-item-1" onClick={ (e) => onChange(e, 'nav-item-1') } className="nav-item selected"><a href="#">{ t('messages.aml.basicInformation') }</a></li>
            <li id="nav-item-2" onClick={ currentPerson.compliance.PEPSAN.bases === null ? (e) => e.preventDefault() : (e) => onChange(e, 'nav-item-2') } className="nav-item">{ currentPerson.compliance.PEPSAN.bases === null ? <div>{ t('messages.aml.pepAndSanctions') } <Icon type="lock" size="small" /></div> : <div><a href="#">{ t('messages.aml.pepAndSanctions') }</a> { currentPerson.compliance.PEPSAN.bases.length ? <span className="green-dot" /> : <span /> }</div> }</li>
            <li id="nav-item-3" onClick={ currentPerson.compliance.KYCAME.bases === null ? (e) => e.preventDefault() : (e) => onChange(e, 'nav-item-3') } className="nav-item">{ currentPerson.compliance.KYCAME.bases === null ? <div>{ t('messages.aml.kycAdverseMedia') } <Icon type="lock" size="small" /></div> : <div><a href="#">{ t('messages.aml.kycAdverseMedia') }</a> { currentPerson.compliance.KYCAME.bases.length ? <span className="green-dot" /> : <span /> }</div> }</li>
            <li id="nav-item-4" onClick={ currentPerson.compliance.UBOCOM.bases === null || !currentUser.cliente.modules.includes('UBOCOM') ? (e) => e.preventDefault() : (e) => onChange(e, 'nav-item-4') } className="nav-item">
              { currentPerson.compliance.UBOCOM.bases === null || !currentUser.cliente.modules.includes('UBOCOM') ?
                  <div>{ t('messages.aml.uboControllers') } <Icon type="lock" size="small" /></div>
                  :
                  <div><a href="#">{ t('messages.aml.uboControllers') }</a> { currentPerson.compliance.UBOCOM.bases.includes('UBO') || currentPerson.compliance.UBOCOM.bases.includes('SOC') || currentPerson.compliance.UBOCOM.bases.includes('BRD') || currentPerson.compliance.UBOCOM.bases.includes('PSOC') || currentPerson.compliance.UBOCOM.bases.includes('DIR') ? <span className="green-dot" /> : <span /> }</div>
              }
            </li>
            { currentUser.cliente.pais === 'CHI' && currentPerson.type === 'Entity' &&
              <>
                <li id="nav-item-5" onClick={ currentPerson.compliance.UBOCOM.bases === null || !currentUser.cliente.modules.includes('BUSINF') ? (e) => e.preventDefault() : (e) => onChange(e, 'nav-item-5') } className="nav-item">
                  { currentPerson.compliance.UBOCOM.bases === null || !currentUser.cliente.modules.includes('BUSINF') ?
                    <div>{ t('messages.aml.finalBeneficiaries') } <Icon type="lock" size="small" /></div>
                    :
                    <div><a href="#">{ t('messages.aml.finalBeneficiaries') }</a> { currentPerson.compliance.UBOCOM.bases.includes('UBO') ? <span className="green-dot" /> : <span /> }</div>
                  }
                </li>
                <li id="nav-item-6" onClick={ currentPerson.compliance.UBOCOM.bases === null || !currentUser.cliente.modules.includes('BUSINF') ? (e) => e.preventDefault() : (e) => onChange(e, 'nav-item-6') } className="nav-item">
                  { currentPerson.compliance.UBOCOM.bases === null || !currentUser.cliente.modules.includes('BUSINF') ?
                    <div>{ t('messages.aml.ownershipTree') } <Icon type="lock" size="small" /> </div>
                    :
                    <div><a href="#">{ t('messages.aml.ownershipTree') }</a> { currentPerson.compliance.UBOCOM.bases.includes('UBO') ? <span className="green-dot" /> : <span /> }</div>
                  }
                </li>
              </>
            }
            { currentUser.cliente.pais === 'CHI' &&
              <li id="nav-item-7" onClick={ currentPerson.compliance.UBOCOM.bases === null || !currentUser.cliente.modules.includes('BUSINF') ? (e) => e.preventDefault() : (e) => onChange(e, 'nav-item-7') } className="nav-item">
              { currentPerson.compliance.UBOCOM.bases === null || !currentUser.cliente.modules.includes('BUSINF') ?
                <div>{ t('messages.aml.partnershipsPresence') } <Icon type="lock" size="small" /></div>
                :
                <div><a href="#">{ t('messages.aml.partnershipsPresence') }</a> { currentPerson.compliance.UBOCOM.bases.includes('PSOC') ? <span className="green-dot" /> : <span /> }</div>
              }
              </li>
            }
        </ul>
      </div>
    )
  }
}
