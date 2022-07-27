import './PepAndSanctionsTabContent.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Icon, Table, Tabs, Tooltip, Row, Col, Spin } from 'antd'
import { camelizerHelper } from '../../../../helpers'
import { InfoIcon } from '../../../../layouts/Private/components'
import { PersonInfoTabContent } from '../'

const { TabPane } = Tabs

const getRelatedFamily = (relatedPersons) => {
  const related = []

  for (let i = 0; i < relatedPersons.length; i++) {
    if (relatedPersons[i].pepPorParentesco) {
      related.push(relatedPersons[i])
    }
  }

  return related
}

const getRelatedPartnerships = (relatedPersons) => {
  const related = []

  for (let i = 0; i < relatedPersons.length; i++) {
    if (relatedPersons[i].pepPorAsociacion) {
      related.push(relatedPersons[i])
    }
  }

  return related
}

const getNegRelatedFamily = (relatedPersons) => {
  const related = []

  for (let i = 0; i < relatedPersons.length; i++) {
    if (relatedPersons[i].pariente === 'SI') {
      related.push(relatedPersons[i])
    }
  }

  return related
}

const getNegRelatedPartnerships = (relatedPersons) => {
  const related = []

  for (let i = 0; i < relatedPersons.length; i++) {
    if (relatedPersons[i].asociado === 'SI') {
      related.push(relatedPersons[i])
    }
  }

  return related
}

const getTitle = (title, count, tooltipText = null) => {
  const tooltip = <InfoIcon text={ tooltipText} />

  return <div>{ tooltipText !== null && tooltip } { title } { count > 0 && <span className="green-dot" /> }</div>
}

export default ({ currentUser, person }) => {
  let relatedFamily
  let relatedPartnerships
  let vinculadosFamily
  let vinculadosPartnerships

  let relatedFamilyNeg
  let relatedPartnershipsNeg
  let vinculadosFamilyNeg
  let vinculadosPartnershipsNeg

  let cantPep = 0
  let cantNeg = 0

  const { t } = useTranslation()

  const tableColumns = {
    pepTitular: [
      {
        title: t('messages.aml.category'),
        dataIndex: 'categoriaPep',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.institution'),
        dataIndex: 'institucionPublica',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.position'),
        dataIndex: 'cargo',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.startingDate'),
        dataIndex: 'fechaInicio',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.endingDate'),
        dataIndex: 'fechaTermino',
        render: (text) => camelizerHelper(text)
      }
    ],

    pepRelatedFamily: [
      {
        dataIndex: 'formatRutTitular',
        width: 250,
        render: (text, record) =>
          <div className="rutName">
            <div className="title">Nombre y rut</div>
            <div>{ camelizerHelper(record.nombrePepTitularRelacionado) }</div>
            <div>{ text }</div>
          </div>
      },
      {
        dataIndex: 'nombrePepTitularRelacionado',
        render: (text, record) =>
          <>
            <Row>
              <Col className="title" span={5}>{t('messages.aml.holderCategory')}</Col>
              <Col span={19}>{ camelizerHelper(record.categoriaTitular) }</Col>
            </Row>
            <Row>
              <Col className="title" span={5}>{t('messages.aml.relationship')}</Col>
              <Col span={8}>{ camelizerHelper(record.tipoParentesco) }</Col>
              <Col className="title" span={4}>{t('messages.aml.category')}</Col>
              <Col span={7}>{ camelizerHelper(record.categoriaPep) }</Col>
            </Row>
            <Row>
              <Col className="title" span={5}>{t('messages.aml.position')}</Col>
              <Col span={8}>{ camelizerHelper(record.cargo) }</Col>
              <Col className="title" span={4}>{t('messages.aml.institution')}</Col>
              <Col span={7}>{ camelizerHelper(record.institucionPublica) }</Col>
            </Row>
            <Row>
              <Col className="title" span={5}>{t('messages.aml.startingDate')}</Col>
              <Col span={8}>{ camelizerHelper(record.fechaInicio) }</Col>
              <Col className="title" span={4}>{t('messages.aml.endingDate')}</Col>
              <Col span={7}>{ camelizerHelper(record.fechaTermino) }</Col>
            </Row>
          </>
      }
    ],

    pepRelatedPartnerships: [
      {
        dataIndex: 'formatRutTitular',
        width: 250,
        render: (text, record) =>
          <div className="rutName">
            <div className="title">Nombre y rut</div>
            <div>{ camelizerHelper(record.nombrePepTitularRelacionado) }</div>
            <div>{ text }</div>
          </div>
      },
      {
        dataIndex: 'nombrePepTitularRelacionado',
        render: (text, record) =>
          <>
            <Row>
              <Col className="title" span={5}>{t('messages.aml.holderCategory')}</Col>
              <Col span={19}>{ camelizerHelper(record.categoriaTitular) }</Col>
            </Row>
            <Row>
              <Col className="title" span={5}>{t('messages.aml.partnershipName')}</Col>
              <Col span={8}>{ camelizerHelper(record.razonSocialSociedad) }</Col>
              <Col className="title" span={4}>{t('messages.aml.category')}</Col>
              <Col span={7}>{ camelizerHelper(record.categoriaPep) }</Col>
            </Row>
            <Row>
              <Col className="title" span={5}>{t('messages.aml.position')}</Col>
              <Col span={8}>{ camelizerHelper(record.cargo) }</Col>
              <Col className="title" span={4}>{t('messages.aml.institution')}</Col>
              <Col span={7}>{ camelizerHelper(record.institucionPublica) }</Col>
            </Row>
            <Row>
              <Col className="title" span={5}>{t('messages.aml.startingDate')}</Col>
              <Col span={8}>{ camelizerHelper(record.fechaInicio) }</Col>
              <Col className="title" span={4}>{t('messages.aml.endingDate')}</Col>
              <Col span={7}>{ camelizerHelper(record.fechaTermino) }</Col>
            </Row>
          </>
      }
    ],

    pepRelatedNetworksFamily: [
      {
        title: 'RUT',
        dataIndex: 'formatRut',
        width: 120
      },
      {
        title: t('messages.aml.name'),
        dataIndex: 'nombreCompleto',
        width: 300,
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.relationship'),
        dataIndex: 'tipoParentesco',
        width: 250,
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.category'),
        dataIndex: 'categoriaPep',
        width: 250,
        render: (text) => camelizerHelper(text)
      }
    ],

    pepCivilServant: [
      {
        title: t('messages.aml.publicInstitution'),
        dataIndex: 'institucion',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.position'),
        dataIndex: 'cargo',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.contractType'),
        dataIndex: 'tipoContrato',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.grossPay'),
        dataIndex: 'renumeracionBruta',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.currencyType'),
        dataIndex: 'unidadMonetaria',
        render: (text) => camelizerHelper(text)
      }
    ],

    negTitular: [
      {
        title: t('messages.aml.causal'),
        dataIndex: 'causal',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.startingDate'),
        dataIndex: 'fechaInicio',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.endingDate'),
        dataIndex: 'fechaFin',
        render: (text) => camelizerHelper(text)
      }
    ],
    negRelatedFamily: [
      {
        title: t('messages.aml.rut'),
        dataIndex: 'formatRutRelacionado',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.name'),
        dataIndex: 'nombreRelacionado',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.kinship'),
        dataIndex: 'tipoParentesco',
        render: (text) => camelizerHelper(text)
      },
      {
        title: 'Causal',
        dataIndex: 'causal',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.startingDate'),
        dataIndex: 'fechaInicio'
      },
      {
        title: t('messages.aml.endingDate'),
        dataIndex: 'fechaFin'
      }
    ],

    negRelatedPartnerships: [
      {
        title: t('messages.aml.rut'),
        dataIndex: 'formatRutRelacionado'
      },
      {
        title: t('messages.aml.name'),
        dataIndex: 'nombreRelacionado',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.partnershipName'),
        dataIndex: 'razonSociedad',
        render: (text) => {
          if(text === 'N/A') {
            return text
          }else {
            return camelizerHelper(text)
          }
        }
      },
      {
        title: 'Causal',
        dataIndex: 'causal',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.startingDate'),
        dataIndex: 'fechaInicio'
      },
      {
        title: t('messages.aml.endingDate'),
        dataIndex: 'fechaFin'
      }
    ],

    negRelatedNetworksFamily: [
      {
        title: 'RUT',
        dataIndex: 'formatRut'
      },
      {
        title: t('messages.aml.name'),
        dataIndex: 'nombreCompleto',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.kinship'),
        dataIndex: 'tipoParentesco',
        render: (text) => camelizerHelper(text)
      }
    ],

    negRelatedNetworksPartnerships: [
      {
        title: 'RUT',
        dataIndex: 'formatRut'
      },
      {
        title: t('messages.aml.name'),
        dataIndex: 'nombreCompleto',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.partnershipName'),
        dataIndex: 'razonSociedad',
        render: (text) => {
          if(text === 'N/A') {
            return text
          }else {
            return camelizerHelper(text)
          }
        }
      }
    ]
  }

  let pepRelatedNetworksPartnerships = [
    {
      title: 'RUT',
      dataIndex: 'formatRut',
      width: 120,
    },
    {
      title: t('messages.aml.name'),
      dataIndex: 'nombreCompleto',
      width: 300,
      render: (text) => camelizerHelper(text)
    },
    {
      title: t('messages.aml.partnershipName'),
      dataIndex: 'razonSocialSociedad',
      width: 300,
      render: (text) => {
        if(text === 'N/A') {
          return text
        }else {
          return camelizerHelper(text)
        }
      }
    }
  ]
  if(currentUser.cliente.modules.includes('PARTICIP')) {
    pepRelatedNetworksPartnerships.push(
      {
        title: t('messages.aml.participation'),
        dataIndex: 'participacion',
        width: 130,
        render: (text) => {
          if(text !== null) {
            return text + '%'
          }else {
            return 'N/A'
          }
        }
      }
    )
  }
  pepRelatedNetworksPartnerships.push(
    {
      title: t('messages.aml.category'),
      dataIndex: 'categoriaPep',
      width: 200,
      render: (text) => camelizerHelper(text)
    }
  )

  if( person.compliance !== undefined ) {
    if( person.compliance.PEPSAN.details.pepResult != null ) {
      relatedFamily = getRelatedFamily(person.compliance.PEPSAN.details.pepRelResult)
      relatedPartnerships = getRelatedPartnerships(person.compliance.PEPSAN.details.pepRelResult)
      cantPep = person.compliance.PEPSAN.details.pepResult.length + person.compliance.PEPSAN.details.pepRelResult.length

      if (person.compliance.PEPSAN.details.pepResult.length > 0) {
        vinculadosFamily = getRelatedFamily(person.compliance.PEPSAN.details.pepVinculados)
        vinculadosPartnerships = getRelatedPartnerships(person.compliance.PEPSAN.details.pepVinculados)
      }
    }

    if( person.compliance.PEPSAN.details.negResults != null ) {
      relatedFamilyNeg = getNegRelatedFamily(person.compliance.PEPSAN.details.negRelResults)
      relatedPartnershipsNeg = getNegRelatedPartnerships(person.compliance.PEPSAN.details.negRelResults)
      cantNeg = person.compliance.PEPSAN.details.negResults.length + person.compliance.PEPSAN.details.negRelResults.length

      if (person.compliance.PEPSAN.details.negResults.length > 0) {
        vinculadosFamilyNeg = getNegRelatedFamily(person.compliance.PEPSAN.details.negVinculados)
        vinculadosPartnershipsNeg = getNegRelatedPartnerships(person.compliance.PEPSAN.details.negVinculados)
      }
    }
  }

  return (
    <div className="pep-tab-content">
      { person.loading ? <Spin />
        :
        <Tabs type="card">
          { person.compliance !== undefined && person.compliance.PEPSAN !== undefined && person.compliance.PEPSAN.details.pepResult !== undefined && (
            <TabPane tab={ getTitle(t('messages.aml.activePEPS'), cantPep, t('messages.aml.tooltipPep1')) } key="1">
              <div id="pep-sanctions">
                  {
                    ( person.compliance.PEPSAN.details.pepResult.length > 0 ) ?
                      <div>
                        <div className="table-wrapper titular">
                          <h3>{ t('messages.aml.holderPep') }</h3>
                          <Table dataSource={ person.compliance.PEPSAN.details.pepResult } columns={ tableColumns.pepTitular } size="small" pagination={ false } />
                        </div>
                      </div>
                    :
                    <div className="no-data-block">{ t('messages.aml.noInfoAboutHolderPEP') }.</div>
                  }
                  {
                    ( person.compliance.PEPSAN.details.pepRelResult.length > 0 ) ?
                      <div>
                        { relatedFamily && relatedFamily.length > 0 &&
                          <div className="table-wrapper relations-pep">
                            <h3>{ t('messages.aml.kinshipWithOtherPeps') }</h3>
                            <Table dataSource={ relatedFamily }
                              columns={ tableColumns.pepRelatedFamily }
                              pagination={ false } size="small"
                              />
                          </div>
                        }
                        { relatedPartnerships && relatedPartnerships.length > 0 &&
                          <div className="table-wrapper relations-pep">
                            <h3>{ t('messages.aml.partnershipsWithOtherPEPS') }</h3>
                            <Table dataSource={ relatedPartnerships }
                              columns={ tableColumns.pepRelatedPartnerships }
                              pagination={ false } size="small"
                              />
                          </div>
                        }
                      </div>
                    :
                      <div className="no-data-block">{ t('messages.aml.noInfoAboutRelationshipWithOthers') }.</div>
                  }
                  { person.compliance.PEPSAN.details.pepResult.length > 0 && (
                    (person.compliance.PEPSAN.details.pepVinculados !== null && person.compliance.PEPSAN.details.pepVinculados.length > 0) ?
                      <div>
                        { vinculadosFamily && vinculadosFamily.length > 0 &&
                          <div className="table-wrapper">
                            <h3>{ t('messages.aml.peopleRelatedWithHolderPEPByKinship') }</h3>
                            <Table dataSource={ vinculadosFamily } columns={ tableColumns.pepRelatedNetworksFamily } size="small" pagination={ true } />
                          </div>
                        }
                        { vinculadosPartnerships && vinculadosPartnerships.length > 0 &&
                          <div className="table-wrapper">
                            <h3>{ t('messages.aml.peopleRelatedWithHolderPEPByPartnership') }</h3>
                            <Table dataSource={ vinculadosPartnerships } columns={ pepRelatedNetworksPartnerships } size="small" pagination={ true } />
                          </div>
                        }
                      </div>
                    :
                      <div className="no-data-block">{ t('messages.aml.noInfoAboutPersonsAndEntitiesRelatedWithHolderPEP') }.</div>
                    )
                  }
                </div>
              </TabPane>
            )
          }
          { (person.compliance !== undefined && person.compliance.PEPSAN.details.fpResult !== undefined) &&
            <TabPane tab={ getTitle(t('messages.aml.civilServant'), person.compliance.PEPSAN.details.fpResult.length, t('messages.aml.tooltipPep2')) } key="3">
              {person.compliance.PEPSAN.details.fpResult.length > 0 ?
                <Table dataSource={ person.compliance.PEPSAN.details.fpResult } columns={ tableColumns.pepCivilServant } size="small" pagination={ false } />
                :
                <div className="no-data-block">{ t('messages.aml.noInfoAboutCivilServant') }.</div>
              }
            </TabPane>
          }
          {
            (person.compliance !== undefined && person.compliance.PEPSAN.details.djRecord !== undefined) &&
            <TabPane tab={ getTitle('WatchList', person.compliance.PEPSAN.details.djRecord.length,  t('messages.aml.tooltipPep3')) } key="4">
              {person.compliance.PEPSAN.details.djRecord.length > 0 ?
                <PersonInfoTabContent person={ person.compliance.PEPSAN.details.djRecord[0] } />
                :
                <div className="no-data-block">{ t('messages.aml.noInfoAboutPEPAndSanctionsInInternationalDatabases')}.</div>
              }
            </TabPane>
          }
          { person.compliance !== undefined && person.compliance.PEPSAN !== undefined && person.compliance.PEPSAN.details.negResults !== undefined && (
            <TabPane tab={ getTitle(t('messages.aml.ownLists'), cantNeg,  t('messages.aml.tooltipPep4')) } key="5">
              <div id="pep-sanctions">
                  {
                    ( person.compliance.PEPSAN.details.negResults.length > 0 ) ?
                      <div>
                        <div className="table-wrapper titular">
                          <h3>{ t('messages.aml.holder') }</h3>
                          <Table dataSource={ person.compliance.PEPSAN.details.negResults } columns={ tableColumns.negTitular } size="small" pagination={ false } />
                        </div>
                      </div>
                    :
                    <div className="no-data-block">{ t('messages.aml.noInfoAboutOwnLists') }.</div>
                  }
                  {
                    ( person.compliance.PEPSAN.details.negRelResults.length > 0 ) ?
                      <div>
                        { relatedFamilyNeg && relatedFamilyNeg.length > 0 &&
                          <div className="table-wrapper relations">
                            <h3>{ t('messages.aml.kinshipWithOthers') }</h3>
                            <Table dataSource={ relatedFamilyNeg } columns={ tableColumns.negRelatedFamily } pagination={ false } size="small" />
                          </div>
                        }
                        { relatedPartnershipsNeg && relatedPartnershipsNeg.length > 0 &&
                          <div className="table-wrapper relations">
                            <h3>{ t('messages.aml.partnershipWithOthers')}</h3>
                            <Table dataSource={ relatedPartnershipsNeg } columns={ tableColumns.negRelatedPartnerships } pagination={ false } size="small" />
                          </div>
                        }
                      </div>
                    :
                      <div className="no-data-block">{ t('messages.aml.noInfoAboutRelationshipWithOthers') }.</div>
                  }
                  { person.compliance.PEPSAN.details.negResults.length > 0 && (
                    (person.compliance.PEPSAN.details.negVinculados !== null && person.compliance.PEPSAN.details.negVinculados.length > 0) ?
                      <div>
                        { vinculadosFamilyNeg && vinculadosFamilyNeg.length > 0 &&
                          <div className="table-wrapper">
                            <h3>{ t('messages.aml.peopleRelatedByKinship') }</h3>
                            <Table dataSource={ vinculadosFamilyNeg } columns={ tableColumns.negRelatedNetworksFamily } size="small" pagination={ true } />
                          </div>
                        }
                        { vinculadosPartnershipsNeg && vinculadosPartnershipsNeg.length > 0 &&
                          <div className="table-wrapper">
                            <h3>{ t('messages.aml.peopleRelatedByPartnerhip') }</h3>
                            <Table dataSource={ vinculadosPartnershipsNeg } columns={ tableColumns.negRelatedNetworksPartnerships } size="small" pagination={ true } />
                          </div>
                        }
                      </div>
                    :
                      <div className="no-data-block">{ t('messages.aml.noInfoAboutPersonsAndEntitiesRelatedWithHolderPEP') }.</div>
                    )
                  }
                </div>
              </TabPane>
            )
          }
        </Tabs>
      }
    </div>
  )
}
