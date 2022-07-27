import './UserDetailsBlock.scss'
import React from 'react'
import { Col, Icon, Input, Row } from 'antd'
import moment from "moment"
import { camelizerHelper } from '../../../../helpers'
import userIconImg from './user-icon-2.png'
import { useTranslation } from 'react-i18next'

const UserDetailsBlock = ({alert}) => {
  const { t } = useTranslation()

  const handleRenderPersonType = (firstLetter) => {
    switch(firstLetter) {
      case 'Person':
        return t('messages.aml.personNatural')

      case 'Entity':
        return t('messages.aml.personLegal')
    }
  }

  const handleAddDotsToNumber = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const handleRenderPepType = (letter) => {
    switch (letter) {
      case 'I':
        return "PEP Internacional"
        break

      case 'T':
        return "PEP Titular"
        break

      case 'S':
        return "Socio de PEP"
        break

      case 'P':
        return "Pariente de PEP"
        break
    }
  }

  return (
    <div className="user-details-block block">
      <div className="block-title" style={{ textAlign: 'center' }}>
        <Icon type="info-circle" />
        <h3>Información de la Persona</h3>
      </div>
      { alert != null &&
        <div className="block-content">
          <div className="img-wrap">
            <div className="img-wrap-inner">
              <img src={ userIconImg } alt="" />
            </div>
          </div>
          <div className="block-content-inner">
              { alert.record !== null &&
              <>
                <div className={ alert.contratante === null ? 'field-long field' : 'field' }>
                  <div className="field-inner">
                    <label>{ t('messages.aml.name') }</label>
                    <p>{ camelizerHelper(alert.record.nombre) }</p>
                  </div>
                </div>

                <div className={ alert.contratante === null ? 'field-long field' : 'field' }>
                  <div className="field-inner">
                    <label>{t('messages.aml.rutNumber')}</label>
                    <p>{alert.record.rut}</p>
                  </div>
                </div>
                <div className={ alert.contratante === null ? 'field-long field' : 'field' }>
                  <div className="field-inner">
                    <label>{t('messages.aml.category')}</label>
                    <p>{ t('messages.aml.category.' + alert.record.category) }</p>
                  </div>
                </div>
                { alert.record.citizenship &&
                  <div className={ alert.contratante === null ? 'field-long field' : 'field' }>
                    <div className="field-inner">
                      <label>{t('messages.aml.citizenship')}</label>
                      <p>{ alert.record.citizenship }</p>
                    </div>
                  </div>
                }
                { alert.record.dateBirth &&
                  <div className={ alert.contratante === null ? 'field-long field' : 'field' }>
                    <div className="field-inner">
                      <label>{alert.record.type === 'Person' ? t('messages.aml.birthDate') : t('messages.aml.registerDate')}</label>
                      <p>{ alert.record.dateBirth }</p>
                    </div>
                  </div>
                }
                { alert.record.pais &&
                  <div className={ alert.contratante === null ? 'field-long field' : 'field' }>
                    <div className="field-inner">
                      <label>{alert.record.type === 'Person' ? t('messages.aml.countryofresindent') : t('messages.aml.country')}</label>
                      <p>{ alert.record.pais }</p>
                    </div>
                  </div>
                }
              </>
              }
              { alert.contratante !== null &&
              <>
                {
                  (alert.contratante.fechaNacimiento !== null && alert.contratante.fechaNacimiento !== undefined) &&
                  <div className="field">
                    <div className="field-inner">
                      <label>{ t('messages.aml.birthDate') }</label>
                      <p>{moment(alert.contratante.fechaNacimiento).format('DD/MM/YYYY')}</p>
                    </div>
                  </div>
                }
                {
                  (alert.contratante.pais !== null && alert.contratante.pais !== undefined) &&
                  <div className="field">
                    <div className="field-inner">
                      <label>{ t('messages.aml.country') }</label>
                      <p>{alert.contratante.pais}</p>
                    </div>
                  </div>
                }
                {
                  (alert.record.type !== null && alert.record.type !== undefined) &&
                  <div className="field">
                    <div className="field-inner">
                      <label>{ t('messages.aml.personType') }</label>
                      <p>{handleRenderPersonType(alert.record.type)}</p>
                    </div>
                  </div>
                }
                {
                  (alert.contratante.comunaComercial !== null && alert.contratante.comunaComercial !== undefined) &&
                  <div className="field">
                    <div className="field-inner">
                      <label>{ t('messages.aml.commercialDistrict') }</label>
                      <p>{ camelizerHelper(alert.contratante.comunaComercial) }</p>
                    </div>
                  </div>
                }
                {
                  (alert.contratante.comunaParticular !== null && alert.contratante.comunaParticular !== undefined) &&
                  <div className="field">
                    <div className="field-inner">
                      <label>{ t('messages.aml.particularNeighbourhood') }</label>
                      <p>{ camelizerHelper(alert.contratante.comunaParticular) }</p>
                    </div>
                    </div>
                }
                {
                  (alert.contratante.sueldoPromedio !== null && alert.contratante.sueldoPromedio !== undefined) &&
                  <div className="field">
                    <div className="field-inner">
                      <label>{ t('messages.aml.averageIncome') }</label>
                      <p>$ { handleAddDotsToNumber(alert.contratante.sueldoPromedio) }</p>
                    </div>
                  </div>
                }
                {
                  (alert.contratante.ventaPromedio !== null && alert.contratante.ventaPromedio !== undefined) &&
                  <div className="field">
                    <div className="field-inner">
                      <label>{ t('messages.aml.averageSale') }</label>
                      <p>$ { handleAddDotsToNumber(alert.contratante.ventaPromedio) }</p>
                    </div>
                  </div>
                }
                {
                  (alert.contratante.actividadEconomica !== null && alert.contratante.actividadEconomica !== undefined) &&
                  <div className="field">
                    <div className="field-inner">
                      <label>Actividad económica</label>
                      <p>{ camelizerHelper(alert.contratante.actividadEconomica) }</p>
                    </div>
                  </div>
                }
                { alert.contratante.typePEP !== null && alert.contratante.typePEP !== undefined  &&
                    <div className="pep-block">
                      <div className="field">
                        <div className="field-inner">
                          <label>Tipo PEP</label>
                          <p>{ handleRenderPepType(alert.contratante.typePEP) }</p>
                        </div>
                      </div>
                      {
                        (alert.contratante.nombrePEPTitular !== null && alert.contratante.nombrePEPTitular !== undefined) &&
                        <div className="field">
                          <div className="field-inner">
                            <label>Nombre PEP Titular</label>
                            <p>{ camelizerHelper(alert.contratante.nombrePEPTitular) }</p>
                          </div>
                        </div>
                      }
                      {
                        (alert.contratante.rutPEPTitular !== null && alert.contratante.rutPEPTitular !== undefined) &&
                        <div className="field">
                          <div className="field-inner">
                            <label>Rut PEP Titular</label>
                            <p>{ alert.contratante.rutPEPTitular }</p>
                          </div>
                        </div>
                    }
                  </div>
                }
              </>
              }
          </div>
        </div>
      }
    </div>
  )
}

export default UserDetailsBlock
