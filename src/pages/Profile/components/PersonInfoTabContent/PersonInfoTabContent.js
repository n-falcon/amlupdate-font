import './PersonInfoTabContent.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Descriptions, Row, Table } from 'antd'
import BRDImage from './img/BRDicon.gif'
import OOLImage from './img/OOLicon.gif'
import PEPImage from './img/PEPicon.gif'
import RCAImage from './img/RCAicon.gif'
import SANImage from './img/SANicon.gif'
import SOCImage from './img/SOCicon.gif'
import SIImage from './img/SIicon.gif'

const objImages = { BRDImage, OOLImage, PEPImage, RCAImage, SANImage, SOCImage, SIImage}

const PersonInfoTabContent = ({ person }) => {
  const { t } = useTranslation()

  const getFormatDate = (day, month, year) => {
    let fecha = ''
    if (day !== null && day !== '') {
      fecha = fecha + day + '/'
    }
    if (month !== null && month !== '') {
      fecha = fecha + month + '/'
    }
    if (year !== null && year !== '') {
      fecha = fecha + year
    }
    return fecha
  }

  const documentsTableColumns = [
    {
      title: t('messages.aml.type'),
      dataIndex: 'type'
    },
    {
      title: t('messages.aml.number'),
      dataIndex: 'value'
    },
    {
      title: t('messages.aml.comments'),
      dataIndex: 'notes',
      render: (text) => {
        if (text === null) {
          return 'N/A'
        } else {
          return text
        }
      }
    }
  ]

  const regionsTableColumns = [
    {
      title: t('messages.aml.type'),
      dataIndex: 'type',
      width: 200
    },
    {
      title: t('messages.aml.country'),
      dataIndex: 'country.name',
      width: 200
    },
    {
      title: t('messages.aml.sanctions'),
      dataIndex: 'country.sanctions',
      render: (text) => {
        if (text !== null) {
          let sanciones = []
          text.map(sanction =>
            sanciones.push(<p class={'dj-country dj-country-' + sanction }>{ t('messages.dj.countries.'+sanction) } </p>)
          )
          return sanciones
        }
      }
    }
  ]

  const sanctionsTableColumns = [
    {
      title: t('messages.aml.list'),
      dataIndex: 'sancionList.name'
    },
    {
      title: t('messages.aml.from'),
      dataIndex: 'sinceDay',
      render: (text, record) => {
        return getFormatDate(record.sinceDay, record.sinceMonth, record.sinceYear)
      }
    },
    {
      title: t('messages.aml.to'),
      dataIndex: 'toDay',
      render: (text, record) => {
        return getFormatDate(record.toDay, record.toMonth, record.toYear)
      }
    }
  ]

  const rolesTableColumns = [
    {
      title: t('messages.aml.type'),
      dataIndex: 'type'
    },
    {
      title: t('messages.aml.category'),
      dataIndex: 'occupation.name'
    },
    {
      title: t('messages.aml.position'),
      dataIndex: 'desc'
    },
    {
      title: t('messages.aml.from'),
      dataIndex: 'sinceDay',
      render: (text, record) => {
        return getFormatDate(record.sinceDay, record.sinceMonth, record.sinceYear)
      }
    },
    {
      title: t('messages.aml.to'),
      dataIndex: 'toDay',
      render: (text, record) => {
        return getFormatDate(record.toDay, record.toMonth, record.toYear)
      }
    }
  ]

  const aliasTableColumns = [
    {
      title: t('messages.aml.name'),
      dataIndex: 'primaryName',
      render: (text, record) => {
        if(record.primaryName !== '') {
          return record.primaryName
        } else {
          return record.entityName
        }
      }
    },
    {
      title: t('messages.aml.middleName'),
      dataIndex: 'middleName'
    },
    {
      title: t('messages.aml.lastName'),
      dataIndex: 'surName'
    },
    {
      title: t('messages.aml.originalScriptName'),
      dataIndex: 'originalScriptName',
      render: (originalScriptName) => {
        let aliases = []
        originalScriptName.map(script =>
            aliases.push(<p class="script">{ script }</p>)
        )
        return aliases
      }
    }
  ]

  const fechaTableColumns = [
    {
      title: t('messages.aml.type'),
      dataIndex: 'type'
    },
    {
      title: t('messages.aml.date'),
      dataIndex: 'date'
    }
  ]

  const addressesTableColumns = [
    {
      title: t('messages.aml.address'),
      dataIndex: 'address'
    },
    {
      title: t('messages.aml.title.city'),
      dataIndex: 'city'
    },
    {
      title: t('messages.aml.title.country'),
      dataIndex: 'country.name'
    }
  ]

  const getImages = (types) => {
    if(types !== null) {
      let images = []
      types.map(image => {
        images.push(<img src={ objImages[image+'Image'] } class='img-clasif' alt=""/>)
      })
      return images
    }
  }

  const relationsTableColumns = [
    {
      title: t('messages.aml.classification'),
      dataIndex: 'related.types',
      render: (types) => {
        return getImages(types)
      }
    },
    {
      title: t('messages.aml.name'),
      dataIndex: 'related.primaryName.formatName'
    },
    {
      title: t('messages.aml.type'),
      dataIndex: 'related.type'
    },
    {
      title: t('messages.aml.relationship'),
      dataIndex: 'relation.name'
    }
  ]

  const getRelations = (relations) => {
    let related = []
    relations.map(relation => {
        if (relation.related !== null) {
          related.push(relation)
        }
    })
    return related
  }

  const getFechas = (recod) => {
      let fechas = []

      if (person.dateOfBirth !== undefined && person.dateOfBirth !== null && person.dateOfBirth.year !== null) {
        fechas.push({type: t('messages.aml.birthDate'), date: getFormatDate(person.dateOfBirth.day, person.dateOfBirth.month, person.dateOfBirth.year)})
      }
      if (person.dateDeceased !== undefined && person.dateDeceased !== null && person.dateDeceased.year !== null) {
        fechas.push({type: t('messages.aml.deathDate'), date: getFormatDate(person.dateDeceased.day, person.dateDeceased.month, person.dateDeceased.year)})
      }
      if (person.dateOfRegistration !== undefined && person.dateOfRegistration !== null && person.dateOfRegistration.year !== null) {
        fechas.push({type: t('messages.aml.registerDate'), date: getFormatDate(person.dateOfRegistration.day, person.dateOfRegistration.month, person.dateOfRegistration.year)})
      }
      return fechas
  }

  const getTitle = (text) => {
    let title

    switch(text) {
      case 'pfa':
        title = 'Watchlist'
        break
      case 'soc':
        title = 'State Owned Companies'
        break
      default:
        title = 'Adverse Media'
        break
    }

    return title
  }

  const urlify = (text) => {
    var urlRegex = /(https?:\/\/[^\s]+)/g

    return text.replace(urlRegex, (url) => {
      return '<a href="' + url + '" target="_blank">' + url + '</a>'
    })
  }

  let related = []
  if (person.relations !== undefined && person.relations !== null && person.relations.length > 0) {
    related = getRelations(person.relations)
  }

  return (
    <div className="person-info">
      <h3 className="basic-info-title">Basic Information</h3>
      <div className="basic-info">
        <Row>
          <Col xs={12}>
            <label>Nro. Perfil</label>
            <p>{ person.id }</p>
          </Col>
          <Col xs={12}>
            <label>Tipo</label>
            <p>{ person.type }</p>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <label>Clasificación</label>
            <p>{ getImages(person.types) }</p>
          </Col>
          <Col xs={12}>
            <label>Última actualización</label>
            <p>{ person.date }</p>
          </Col>
        </Row>
        { (person.type === 'Person') &&
          <Row>
            <Col xs={12}>
              <label>Género</label>
              <p>{ person.gender }</p>
            </Col>
            <Col xs={12}>
              <label>Fallecido</label>
              <p>{ person.deceased }</p>
            </Col>
          </Row>
        }
        <Row>
          <Col xs={12}>
            <label>Nombre</label>
            <p>
              {
                person.type === 'Person' ?
                  person.primaryName.primaryName
                  :
                  person.primaryName.entityName
              }
            </p>
          </Col>
          <Col xs={12}>
            <label>Segundo nombre</label>
            <p>{ person.primaryName.middleName }</p>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <label>Apellido</label>
            <p>{ person.primaryName.surName }</p>
          </Col>
          <Col xs={12}>
            <label>Script original</label>
            { person.primaryName.originalScriptName.map(script => <p class="script">{ script }</p>) }
          </Col>
        </Row>
      </div>
      <Descriptions layout="vertical" size="small" column={4} bordered>
      {
        /*
          <Descriptions.Item label="Nro. Perfil">
            { person.id }
          </Descriptions.Item>
          <Descriptions.Item label="Tipo">
            { person.type }
          </Descriptions.Item>
          <Descriptions.Item label="Clasificación">
            { getImages(person.types) }
          </Descriptions.Item>
          <Descriptions.Item label="Última actualización">
            { person.date }
          </Descriptions.Item>

          { (person.type === 'Person') &&
            <Descriptions.Item label="Género">
              { person.gender }
            </Descriptions.Item>
          }
          { (person.type === 'Person') &&
            <Descriptions.Item label="Fallecido" span={3}>
              { person.deceased }
            </Descriptions.Item>
          }

          <Descriptions.Item label="Nombre">
            { person.type === 'Person' ?
              person.primaryName.primaryName
            :
              person.primaryName.entityName
           }
          </Descriptions.Item>
          <Descriptions.Item label="Segundo Nombre">
            { person.primaryName.middleName }
          </Descriptions.Item>
          <Descriptions.Item label="Apellido">
            { person.primaryName.surName }
          </Descriptions.Item>
          <Descriptions.Item label="Script Original" className="break-line">
            { person.primaryName.originalScriptName.map(script =>
                <p class="script">{ script }</p>
            )}
          </Descriptions.Item>
        */
      }

        { (person.aliases !== undefined && person.aliases !== null && person.aliases.length > 0) &&
          <Descriptions.Item label={ t('messages.aml.title.alias') } span={4}>
            <Table dataSource={ person.aliases } columns={ aliasTableColumns } pagination={ false } size='small' />
          </Descriptions.Item>
        }
        { (person.lowAliases !== undefined && person.lowAliases !== null && person.lowAliases.length > 0) &&
          <Descriptions.Item label={ t('messages.aml.lowAliases')} span={4}>
            <Table dataSource={ person.lowAliases } columns={ aliasTableColumns } pagination={ false } size='small' />
          </Descriptions.Item>
        }
        { (person.spellingVariation !== undefined && person.spellingVariation !== null && person.spellingVariation.length > 0) &&
          <Descriptions.Item label={ t('messages.aml.aliasVariations')} span={4}>
            <Table dataSource={ person.spellingVariation } columns={ aliasTableColumns } pagination={ false } size='small' />
          </Descriptions.Item>
        }
        { (person.formerlyAliases !== undefined && person.formerlyAliases !== null && person.formerlyAliases.length > 0) &&
          <Descriptions.Item label={ t('messages.aml.formerlyAliases') } span={4}>
            <Table dataSource={ person.formerlyAliases } columns={ aliasTableColumns } pagination={ false } size='small' />
          </Descriptions.Item>
        }

        { (person.validImages !== undefined && person.validImages !== null && person.validImages.length > 0) &&
          <Descriptions.Item className="images" label={ t('messages.aml.photographies') } span={4}>
            { person.validImages.map(imgUrl => <img src={ imgUrl } alt="" style={{ height: '100px' }} />) }
          </Descriptions.Item>
        }
        { (person.countryDetails !== undefined && person.countryDetails !== null && person.countryDetails.length > 0) &&
          <Descriptions.Item label={ t('messages.aml.regions') } span={4}>
            <Table dataSource={ person.countryDetails } columns={ regionsTableColumns } pagination={ false } size='small' />
          </Descriptions.Item>
        }

        { ((person.dateOfBirth !== undefined && person.dateOfBirth !== null && person.dateOfBirth.year !== null) || (person.dateDeceased !== undefined && person.dateDeceased !== null && person.dateDeceased.year !== null) || (person.dateOfRegistration !== undefined && person.dateOfRegistration !== null && person.dateOfRegistration.year !== null)) && (
            <Descriptions.Item label={ t('messages.aml.dates') } span={4}>
              <Table dataSource={ getFechas(person) } columns={ fechaTableColumns } pagination={ false } size='small' />
            </Descriptions.Item>
          )
        }
        {
          (person.roles !== undefined && person.roles !== null && person.roles.length > 0) &&
          <Descriptions.Item label={ t('messages.aml.positions') } span={4}>
            <Table dataSource={ person.roles } columns={ rolesTableColumns } pagination={ false } size='small' />
          </Descriptions.Item>
        }
        {
          (person.addresses !== undefined && person.addresses !== null && person.addresses.length > 0) &&
          <Descriptions.Item label={ t('messages.aml.addresses') } span={4}>
            <Table dataSource={ person.addresses } columns={ addressesTableColumns } pagination={ false } size='small' />
          </Descriptions.Item>
        }
        { (person.sanctionsList !== undefined && person.sanctionsList !== null && person.sanctionsList.length > 0) &&
          <Descriptions.Item label={ t('messages.aml.sanctions') } span={4}>
            <Table dataSource={ person.sanctionsList } columns={ sanctionsTableColumns } pagination={ false } size="small" />
          </Descriptions.Item>
        }
        { (related.length > 0) &&
          <Descriptions.Item label={ t('messages.aml.related') } span={4}>
            <Table dataSource={ related } columns={ relationsTableColumns } pagination={ true } size="small" />
          </Descriptions.Item>
        }
        {
          (person.documentList !== undefined && person.documentList !== null && person.documentList.length > 0) &&
          <Descriptions.Item label={ t('messages.aml.documents') } span={4}>
            <Table dataSource={ person.documentList } columns={ documentsTableColumns } pagination={ false } size='small' />
          </Descriptions.Item>
        }
        {
          (person.descriptions !== undefined && person.descriptions !== null && person.descriptions.length > 0) &&
          <Descriptions.Item label={ getTitle(person.origin) } span={4}>
            <div className="watchlist">
              <table>
                <thead>
                  <tr>
                    <th>Estado</th>
                    <th>{ person.activeStatus }</th>
                  </tr>
                </thead>
                { person.descriptions.map(item =>
                    <tr>
                      <td>
                      { item.parent !== null && item.parent.parent !== null &&
                            <div>
                              { t('messages.aml.category') + ' ' + item.parent.parent.level }
                            </div>
                      }
                      { item.parent !== null &&
                            <div>
                              { t('messages.aml.category') + ' ' + item.parent.level }
                            </div>
                      }
                        <div>
                          { t('messages.aml.category') + ' ' + item.level }
                        </div>
                      </td>
                      <td>
                      { item.parent !== null && item.parent.parent &&
                        <div>
                          { item.parent.parent.name }
                        </div>
                      }
                      { item.parent !== null &&
                        <div>
                          { item.parent.name }
                        </div>
                      }
                        <div>
                          { item.name }
                        </div>
                      </td>
                    </tr>
                  )
                }
              </table>
            </div>
          </Descriptions.Item>
        }
        { (person.profileNotes !== undefined && person.profileNotes !== null) &&
          <Descriptions.Item label={ t('messages.aml.title.profileNotes') } span={4}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              { person.profileNotes }
            </pre>
          </Descriptions.Item>
        }
        { (person.sourceDescription !== undefined && person.sourceDescription !== null && person.sourceDescription.length > 0) &&
          <Descriptions.Item label={ t('messages.aml.sources') } span={4} className="break-line">
            { person.sourceDescription.map(item => <p dangerouslySetInnerHTML={{ __html: urlify(item) }} />) }
          </Descriptions.Item>
        }
      </Descriptions>
    </div>
  )
}

export default PersonInfoTabContent
