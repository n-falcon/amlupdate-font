import './AdverseMediaAndVipTabContent.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import moment from "moment";
import { Icon, Table, Tabs, Tooltip, Descriptions, Row, Col, Spin } from 'antd'
import { camelizerHelper } from '../../../../helpers'
import { ReportService } from '../../../../services'
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

const getTitle = (title, count, tooltipText = null) => {
  const tooltip = <InfoIcon text={ tooltipText } />

  return <div>{ tooltipText !== null && tooltip } { title } { count > 0 && <span className="green-dot" /> }</div>
}

const getInfoIcon = (title, tooltipText) => {
  const tooltip =  <InfoIcon text={ tooltipText } />
  return <div>{ tooltipText !== null && tooltip } { title }</div>
}

const handlerReport = (fileName) => {
  ReportService.read('/personDocument', {name: fileName}, null, fileName)
}

const getMediosInclusion = (person) => {
  if(person.mediosInclusion != null && person.mediosInclusion.length > 0) {
    let medios = []
    for (let i = 0; i < person.mediosInclusion.length; i++) {
      medios.push(<a onClick={ (e) => handlerReport(person.corrNoticia[i]) } target="_blank">{ camelizerHelper(person.mediosInclusion[i]) }</a>)
    }
    return medios
  }
}

const getMediosExclusion = (person) => {
  let medios = []
  if(person.mediosExclusion != null && person.mediosExclusion.length > 0) {
    for (let i = 0; i < person.mediosExclusion.length; i++) {
      if(person.mediosExclusion[i] !== '') {
        medios.push(<a onClick={ (e) => handlerReport(person.corrNoticia[person.mediosInclusion.length+i]) } target="_blank">{ camelizerHelper(person.mediosExclusion[i]) }</a>)
      }
    }
  }
  if(medios.length === 0) medios.push('N/A')
  return medios
}

const pjudByType = (results, type) => {
  let records = []
  results.map((record, index) => {
      if(record.causa.type === type) {
        records.push(record)
      }
  })
  return records
}

export default ({ currentUser, person }) => {
  const { t } = useTranslation()

  let relatedHFamily
  let relatedCFamily
  let relatedHPartnerships
  let relatedCPartnerships
  let vinculadosHFamily
  let vinculadosCFamily
  let vinculadosHPartnerships
  let vinculadosCPartnerships

  let pjudCivil
  let pjudPenal
  let pjudApelaciones
  let pjudSuprema
  let pjudCobranza
  let pjudLaboral

  let cantHist = 0
  let cantCand = 0

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

    pepCandidates: [
      {
        title: t('messages.aml.category'),
        dataIndex: 'categoriaPep',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.jurisdiction'),
        dataIndex: 'jurisdiccion',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.year'),
        dataIndex: 'anoCandidatura'
      }
    ],

    pepCRelatedFamily: [
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
        dataIndex: 'categoriaTitular',
        render: (text, record) =>
          <>
            <Row>
              <Col className="title" span={5}>{t('messages.aml.holderCategory')}</Col>
              <Col span={19}>{ camelizerHelper(record.categoriaTitular) }</Col>
            </Row>
            <Row>
              <Col className="title" span={5}>{t('messages.aml.category')}</Col>
              <Col span={7}>{ camelizerHelper(record.categoriaPep) }</Col>
              <Col className="title" span={4}>{t('messages.aml.relationship')}</Col>
              <Col span={8}>{ camelizerHelper(record.tipoParentesco) }</Col>
            </Row>
            <Row>
              <Col className="title" span={5}>{t('messages.aml.jurisdiction')}</Col>
              <Col span={7}>{ camelizerHelper(record.jurisdiccion) }</Col>
              <Col className="title" span={4}>{t('messages.aml.year')}</Col>
              <Col span={8}>{ camelizerHelper(record.anoCandidatura) }</Col>
            </Row>
          </>
      }
    ],

    pepCRelatedPartnerships: [
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
        dataIndex: 'categoriaTitular',
        render: (text, record) =>
          <>
            <Row>
              <Col className="title" span={5}>{t('messages.aml.holderCategory')}</Col>
              <Col span={19}>{ camelizerHelper(record.categoriaTitular) }</Col>
            </Row>
            <Row>
              <Col className="title" span={5}>{t('messages.aml.category')}</Col>
              <Col span={7}>{ camelizerHelper(record.categoriaPep) }</Col>
              <Col className="title" span={4}>{t('messages.aml.partnershipName')}</Col>
              <Col span={8}>{ camelizerHelper(record.razonSocialSociedad === 'N/A' ? 'N/A' : camelizerHelper(record.razonSocialSociedad)) }</Col>
            </Row>
            <Row>
              <Col className="title" span={5}>{t('messages.aml.jurisdiction')}</Col>
              <Col span={7}>{ camelizerHelper(record.jurisdiccion) }</Col>
              <Col className="title" span={4}>{t('messages.aml.year')}</Col>
              <Col span={8}>{ camelizerHelper(record.anoCandidatura) }</Col>
            </Row>
          </>
      }
    ],

    pepCRelatedNetworksFamily: [
      {
        title: 'RUT',
        dataIndex: 'formatRut',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.name'),
        dataIndex: 'nombreCompleto',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.category'),
        dataIndex: 'categoriaPep',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.relationship'),
        dataIndex: 'tipoParentesco',
        render: (text) => camelizerHelper(text)
      }
    ],

    pepCRelatedNetworksPartnerships: [
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
        title: t('messages.aml.category'),
        dataIndex: 'categoriaPep',
        render: (text) => camelizerHelper(text)
      },
      {
        title: t('messages.aml.partnershipName'),
        dataIndex: 'razonSocialSociedad',
        render: (text) => {
          if(text === 'N/A') {
            return text
          }else {
            return camelizerHelper(text)
          }
        }
      }
    ],

    vipColumns: [
      {
        title: getInfoIcon(t('messages.aml.category'), 'División de la base VIP al que pertenece cada persona (embajador, gremios, medios de comunicación, entre otros)'),
        dataIndex: 'categoriaPep',
        render: (text) => camelizerHelper(text)
      },
      {
        title: getInfoIcon(t('messages.aml.institution'), 'Institución donde la persona desempeña su cargo o familia a la que pertenece'),
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
        dataIndex: 'fechaInicio'
      },
      {
        title: t('messages.aml.endingDate'),
        dataIndex: 'fechaTermino'
      }
    ],

    pjudColumns: [
      {
        dataIndex: 'formatRutDte',
        width: 250,
        render: (text, record) =>
          <div className="rutName">
            <div className="title">Nombre y rut demandante</div>
            <div>{ camelizerHelper(record.nombreDte) }</div>
            <div>{ text }</div>
          </div>
      },
      {
        dataIndex: 'causa',
        render: (text, record) =>
          <>
            <Row>
              <Col className="title" span={4}>Rol</Col>
              <Col span={6}>{ record.causa.rolInterno }</Col>
              <Col className="title" span={4}>{ t('messages.aml.caratulated') }</Col>
              <Col span={10}>{ camelizerHelper(record.causa.identificacion) }</Col>
            </Row>
            <Row>
              <Col className="title" span={4}>{ t('messages.aml.fecIngreso') }</Col>
              <Col span={6}>{ record.causa.fecIngreso }</Col>
              <Col className="title" span={4}>{ t('messages.aml.location') }</Col>
              <Col span={10}>{ camelizerHelper(record.causa.ubicacion) }</Col>
            </Row>
            <Row>
              <Col className="title" span={4}>{ t('messages.aml.status') }</Col>
              <Col span={6}>{ record.causa.estado }</Col>
              <Col className="title" span={4}>{ t('messages.aml.court') }</Col>
              <Col span={10}>{ camelizerHelper(record.causa.tribunal) }</Col>
            </Row>
            <Row>
              <Col className="title" span={4}>{ t('messages.aml.administrativeStatus') }</Col>
              <Col span={6}>{ record.causa.estadoAdm }</Col>
              <Col className="title" span={4}>{ t('messages.aml.stage') }</Col>
              <Col span={10}>{ camelizerHelper(record.causa.etapa) }</Col>
            </Row>
          </>
      }
    ],

    quiebrasColumns: [
      {
        title: t('messages.aml.date'),
        dataIndex: 'fecha',
        width: 100,
        render: (text, record) => moment(text, 'YYYY-MM-DD').format("DD-MM-YYYY")
      },
      {
        title: 'Tipo procedimiento',
        dataIndex: 'tipoProc',
        width: 250
      },
      {
        title: 'Nombre publicación',
        dataIndex: 'nombrePub',
        width: 350
      },
      {
        title: 'Síndico',
        dataIndex: 'martillero',
        width: 200,
        render: (text) => camelizerHelper(text)
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
    if( person.compliance.KYCAME.details.pepHResult != null ) {
      relatedHFamily = getRelatedFamily(person.compliance.KYCAME.details.pepHRelResult)
      relatedHPartnerships = getRelatedPartnerships(person.compliance.KYCAME.details.pepHRelResult)
      cantHist = person.compliance.KYCAME.details.pepHResult.length + person.compliance.KYCAME.details.pepHRelResult.length

      if (person.compliance.KYCAME.details.pepHResult.length > 0) {
        vinculadosHFamily = getRelatedFamily(person.compliance.KYCAME.details.pepHVinculados)
        vinculadosHPartnerships = getRelatedPartnerships(person.compliance.KYCAME.details.pepHVinculados)
      }
    }

    if( person.compliance.KYCAME.details.pepCResult != null ) {
      relatedCFamily = getRelatedFamily(person.compliance.KYCAME.details.pepCRelResult)
      relatedCPartnerships = getRelatedPartnerships(person.compliance.KYCAME.details.pepCRelResult)
      cantCand = person.compliance.KYCAME.details.pepCResult.length + person.compliance.KYCAME.details.pepCRelResult.length

      if (person.compliance.KYCAME.details.pepCResult.length > 0) {
        vinculadosCFamily = getRelatedFamily(person.compliance.KYCAME.details.pepCVinculados)
        vinculadosCPartnerships = getRelatedPartnerships(person.compliance.KYCAME.details.pepCVinculados)
      }
    }

    if( person.compliance.KYCAME.details.pjudResults != null ) {
      pjudCivil = pjudByType(person.compliance.KYCAME.details.pjudResults, 'CIVIL')
      pjudPenal = pjudByType(person.compliance.KYCAME.details.pjudResults, 'PENAL')
      pjudApelaciones = pjudByType(person.compliance.KYCAME.details.pjudResults, 'APELACIONES')
      pjudSuprema = pjudByType(person.compliance.KYCAME.details.pjudResults, 'SUPREMA')
      pjudCobranza = pjudByType(person.compliance.KYCAME.details.pjudResults, 'COBRANZA')
      pjudLaboral = pjudByType(person.compliance.KYCAME.details.pjudResults, 'LABORAL')
    }
  }

  return (
    <div id="pep-kycame">
      { person.loading ? <Spin/>
        :
        <Tabs type="card">
          { person.compliance !== undefined && person.compliance.KYCAME !== undefined && person.compliance.KYCAME.details.personResult !== undefined && (
            <TabPane tab={ getTitle(t('messages.aml.personsOfInterest'), person.compliance.KYCAME.details.personResult.length, t('messages.aml.tooltipKyc1')) }  key="1">
              <div id="pep-sanctions">
              {
                ( person.compliance.KYCAME.details.personResult.length > 0 ) ?
                  <>
                    { person.compliance.KYCAME.details.personResult.map((record, index) =>
                    <>
                    <Descriptions bordered layout="vertical" column={2} size="small" className="personInfo">
                      <Descriptions.Item label={getInfoIcon(t('messages.aml.category'), 'Nombre del caso en el que está involucrado el delito')}>{ record.categoria }</Descriptions.Item>
                      <Descriptions.Item label={getInfoIcon('Causa', 'Delito')}>{ camelizerHelper(record.delito) }</Descriptions.Item>
                      <Descriptions.Item label={getInfoIcon('Fecha de Inclusión', 'Fecha en que la información fue subida al sistema')}>{ record.fechaInclusion }</Descriptions.Item>
                      <Descriptions.Item label={getInfoIcon('Medio de Inclusión', 'Medio o sitio web de donde se obtuvo la información')}>{ getMediosInclusion(record) }</Descriptions.Item>
                      <Descriptions.Item label={getInfoIcon('Fecha de Exclusión', 'Fecha en que la persona deja de ser investigada por sobreseimiento y/o porque la justicia determina que no hay razones para seguir con la causa')}>{ record.fechaExclusion !== null && record.fechaExclusion !== '' ? record.fechaExclusion : 'N/A' }</Descriptions.Item>
                      <Descriptions.Item label={getInfoIcon('Medio de Exclusión', 'Medio o sitio web de donde se obtuvo la información')}>{ getMediosExclusion(record) }</Descriptions.Item>
                    </Descriptions>
                      { record.resumen !== null && record.resumen !== '' &&
                        <Descriptions bordered layout="vertical" column={2} size="small" className="personInfo">
                          <Descriptions.Item label="Resumen" span={2}>{ record.resumen }</Descriptions.Item>
                        </Descriptions>
                      }
                      </>
                   )}
                  </>
                :
                <div className="no-data-block">{ t('messages.aml.noInfoAboutPersonOfInterest') }.</div>
              }
              </div>
            </TabPane>
            )
          }
          {
            (person.compliance !== undefined && person.compliance.KYCAME.details.djRecord !== undefined) &&
            <TabPane tab={ getTitle('Adverse Media', person.compliance.KYCAME.details.djRecord.length, t('messages.aml.tooltipKyc2')) } key="2">
              {person.compliance.KYCAME.details.djRecord.length > 0 ?
                <PersonInfoTabContent person={ person.compliance.KYCAME.details.djRecord[0] } />
                :
                <div className="no-data-block">{ t('messages.aml.noInfoAboutAdverseAndSpecialInterest') }.</div>
              }
            </TabPane>
          }
          { person.compliance !== undefined && person.compliance.KYCAME !== undefined && person.compliance.KYCAME.details.pepHResult !== undefined && (
            <TabPane tab={ getTitle(t('messages.aml.historicalPEPS'), cantHist, t('messages.aml.tooltipKyc3')) }  key="3">
              <div id="pep-sanctions">
                  {
                    ( person.compliance.KYCAME.details.pepHResult.length > 0 ) ?
                      <div>
                        <div className="table-wrapper titular">
                          <h3>{ t('messages.aml.holderPep') }</h3>
                          <Table dataSource={ person.compliance.KYCAME.details.pepHResult } columns={ tableColumns.pepTitular } size="small" pagination={ false } />
                        </div>
                      </div>
                    :
                    <div className="no-data-block">{ t('messages.aml.noInfoAboutHolderPEP') }.</div>
                  }
                  {
                    ( person.compliance.KYCAME.details.pepHRelResult.length > 0 ) ?
                      <div>
                        { relatedHFamily && relatedHFamily.length > 0 &&
                          <div className="table-wrapper relations-pep">
                            <h3>{ t('messages.aml.relationshipWithOtherPEPS')}</h3>
                            <Table dataSource={ relatedHFamily }
                              columns={ tableColumns.pepRelatedFamily }
                              pagination={ false } size="small"
                            />
                          </div>
                        }
                        { relatedHPartnerships && relatedHPartnerships.length > 0 &&
                          <div className="table-wrapper relations-pep">
                            <h3>{ t('messages.aml.partnershipsWithOtherPEPS')}</h3>
                            <Table dataSource={ relatedHPartnerships }
                              columns={ tableColumns.pepRelatedPartnerships }
                              pagination={ false } size="small"
                             />
                          </div>
                        }
                      </div>
                    :
                      <div className="no-data-block">{ t('messages.aml.noInfoAboutRelationshipWithOtherPEPS') }.</div>
                  }
                  { person.compliance.KYCAME.details.pepHResult.length > 0 && (
                      (person.compliance.KYCAME.details.pepHVinculados !== null && person.compliance.KYCAME.details.pepHVinculados.length > 0) ?
                        <div>
                          { vinculadosHFamily && vinculadosHFamily.length > 0 &&
                            <div className="table-wrapper">
                              <h3>{ t('messages.aml.relatedByKinship') }</h3>
                              <Table dataSource={ vinculadosHFamily } columns={ tableColumns.pepRelatedNetworksFamily } size="small" pagination={ true } />
                            </div>
                          }
                          { vinculadosHPartnerships && vinculadosHPartnerships.length > 0 &&
                            <div className="table-wrapper">
                              <h3>{ t('messages.aml.relatedByPartnership') }</h3>
                              <Table dataSource={ vinculadosHPartnerships } columns={ pepRelatedNetworksPartnerships } size="small" pagination={ true } />
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
          { person.compliance !== undefined && person.compliance.KYCAME !== undefined && person.compliance.KYCAME.details.pepCResult !== undefined && (
            <TabPane tab={ getTitle(t('messages.aml.candidates'), cantCand, t('messages.aml.tooltipKyc4')) } key="4">
              <div id="pep-sanctions">
                  {
                    ( person.compliance.KYCAME.details.pepCResult.length > 0 ) ?
                      <div>
                        <div className="table-wrapper titular">
                          <h3>{ t('messages.aml.holderCandidate')}</h3>
                          <Table dataSource={ person.compliance.KYCAME.details.pepCResult } columns={ tableColumns.pepCandidates } size="small" pagination={ false } />
                        </div>
                      </div>
                    :
                    <div className="no-data-block">{ t('messages.aml.noInfoAboutHolderCandidate') }.</div>
                  }
                  {
                    ( person.compliance.KYCAME.details.pepCRelResult.length > 0 ) ?
                      <div>
                        { relatedCFamily && relatedCFamily.length > 0 &&
                          <div className="table-wrapper  relations-pep">
                            <h3>Parentesco con otros Candidatos</h3>
                            <Table dataSource={ relatedCFamily }
                              columns={ tableColumns.pepCRelatedFamily }
                              pagination={ false } size="small"
                            />
                          </div>
                        }
                        { relatedCPartnerships && relatedCPartnerships.length > 0 &&
                          <div className="table-wrapper relations-pep">
                            <h3>Sociedades con otros Candidatos</h3>
                            <Table dataSource={ relatedCPartnerships }
                              columns={ tableColumns.pepCRelatedPartnerships }
                              pagination={ false } size="small"
                            />
                          </div>
                        }
                      </div>
                    :
                      <div className="no-data-block">{ t('messages.aml.noInfoAboutRelationshipsWithOtherCandidates') }.</div>
                  }
                  { person.compliance.KYCAME.details.pepCResult.length > 0 && (
                    (person.compliance.KYCAME.details.pepCVinculados !== null && person.compliance.KYCAME.details.pepCVinculados.length > 0) ?
                      <div>
                        { vinculadosCFamily && vinculadosCFamily.length > 0 &&
                          <div className="table-wrapper">
                            <h3>{ t('messages.aml.relatedByKinship') }</h3>
                            <Table dataSource={ vinculadosCFamily } columns={ tableColumns.pepCRelatedNetworksFamily } size="small" pagination={ true } />
                          </div>
                        }
                        { vinculadosCPartnerships && vinculadosCPartnerships.length > 0 &&
                          <div className="table-wrapper">
                            <h3>{ t('messages.aml.relatedByPartnership') }</h3>
                            <Table dataSource={ vinculadosCPartnerships } columns={ tableColumns.pepCRelatedNetworksPartnerships } size="small" pagination={ true } />
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
          { person.compliance !== undefined && person.compliance.KYCAME.details.vipResult !== undefined && (
              <TabPane tab={ getTitle('VIP', person.compliance.KYCAME.details.vipResult.length, t('messages.aml.tooltipKyc5')) } key="5">
                <div id="pep-sanctions">
                {
                  ( person.compliance.KYCAME.details.vipResult.length > 0 ) ?
                    <div>
                      <Table dataSource={ person.compliance.KYCAME.details.vipResult } columns={ tableColumns.vipColumns } size="small" pagination={ false } />
                    </div>
                  :
                  <div className="no-data-block">{ t('messages.aml.noVipInformation') }.</div>
                }
                </div>
              </TabPane>
            )
          }
          { person.compliance !== undefined && person.compliance.KYCAME.details.pjudResults !== undefined && (
              <TabPane tab={ getTitle('PJUD', person.compliance.KYCAME.details.pjudResults.length, t('messages.aml.tooltipKyc6')) } key="6">
                <div id="pep-sanctions">
                {
                  ( person.compliance.KYCAME.details.pjudResults.length > 0 ) ?
                    <div>
                    {pjudCivil.length > 0 &&
                      <div className="table-wrapper pjud">
                        <h3>{ t('messages.aml.civilCauses') }</h3>
                        <Table dataSource={ pjudCivil }
                          columns={ tableColumns.pjudColumns }
                          pagination={ true } size="small"
                         />
                      </div>
                    }
                    {pjudPenal.length > 0 &&
                      <div className="table-wrapper pjud">
                        <h3>{ t('messages.aml.criminalCauses') }</h3>
                        <Table dataSource={ pjudPenal }
                          columns={ tableColumns.pjudColumns }
                          pagination={ true } size="small"
                        />
                      </div>
                    }
                    {pjudApelaciones.length > 0 &&
                      <div className="table-wrapper pjud">
                        <h3>{ t('messages.aml.courtAppeals') }</h3>
                        <Table dataSource={ pjudApelaciones }
                          columns={ tableColumns.pjudColumns }
                          pagination={ true } size="small"
                        />
                      </div>
                    }
                    {pjudSuprema.length > 0 &&
                      <div className="table-wrapper pjud">
                        <h3>{ t('messages.aml.supremeCourt') }</h3>
                        <Table dataSource={ pjudSuprema }
                          columns={ tableColumns.pjudColumns }
                          pagination={ true } size="small"
                        />
                      </div>
                    }
                    {pjudLaboral.length > 0 &&
                      <div className="table-wrapper pjud">
                        <h3>{ t('messages.aml.laborCauses') }</h3>
                        <Table dataSource={ pjudLaboral }
                          columns={ tableColumns.pjudColumns }
                          pagination={ true } size="small"
                        />
                      </div>
                    }
                    {pjudCobranza.length > 0 &&
                      <div className="table-wrapper pjud">
                        <h3>{ t('messages.aml.collectionCauses') }</h3>
                        <Table dataSource={ pjudCobranza }
                          columns={ tableColumns.pjudColumns }
                          pagination={ true } size="small"
                        />
                      </div>
                    }
                    </div>
                  :
                  <div className="no-data-block">{ t('messages.aml.noInfoAboutPowerOfAttorney') }.</div>
                }
                </div>
              </TabPane>
            )
          }
          { person.compliance !== undefined && person.compliance.KYCAME.details.quiebraResult !== undefined &&
            <TabPane tab={ getTitle(t('messages.aml.quiebras'), person.compliance.KYCAME.details.quiebraResult.length > 0 && person.compliance.KYCAME.details.quiebraResult[0].hasQuiebra === true ? 1 : 0, t('messages.aml.quiebras')) } key="7">
              <div id="pep-sanctions">
              { person.compliance.KYCAME.details.quiebraResult.length > 0 ?
                <div>
                  { person.compliance.KYCAME.details.quiebraResult[0].hasQuiebra === true ?
                    <Descriptions bordered layout="vertical" column={2} size="small" className="personInfo1">
                      <Descriptions.Item label={t('messages.aml.stage')}>{ person.compliance.KYCAME.details.quiebraResult[0].etapa }</Descriptions.Item>
                      <Descriptions.Item label="Rol">{ person.compliance.KYCAME.details.quiebraResult[0].rol }</Descriptions.Item>
                      <Descriptions.Item label={t('messages.aml.court')}>{ person.compliance.KYCAME.details.quiebraResult[0].tribunal }</Descriptions.Item>
                      <Descriptions.Item label="Síndico">{ person.compliance.KYCAME.details.quiebraResult[0].martillero }</Descriptions.Item>
                      <Descriptions.Item label="Historial" span={2}>
                        <Table dataSource={ person.compliance.KYCAME.details.quiebraResult[0].history } columns={ tableColumns.quiebrasColumns } size="small" />
                      </Descriptions.Item>
                    </Descriptions>
                    :
                    <div className="no-data-block">{ t('messages.aml.noQuiebrasRut') }.</div>
                  }
                </div>
                :
                <div className="no-data-block">{ t('messages.aml.noQuiebrasInformation') }.</div>
              }
              </div>
            </TabPane>
          }
        </Tabs>
      }
    </div>
  )
}
