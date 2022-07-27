import './ControllersTabContent.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Icon, Table, Tooltip, Spin } from 'antd'
import { camelizerHelper } from '../../../../helpers'
import { InfoIcon } from '../../../../layouts/Private/components'
import { PersonInfoTabContent } from '../'

export default ({ currentUser, personUbosControllers, personCompliance }) => {
  const { t } = useTranslation()

  const getUbos = (ubos) => {
    const list = []

    if (ubos !== undefined) {
      for (let i = 0; i < ubos.length; i++) {
        if (ubos[i].ubo) {
          list.push(ubos[i])
        }
      }
    }

    return list
  }

  const getParticipantes = (participantes) => {

  }

  const tableColumnsControllers = [
    {
      title: t('messages.aml.type'),
      dataIndex: 'relation',
      render: (text) => camelizerHelper(text),
      sorter: (a, b) => a.relation.localeCompare(b.relation)
    },
    {
      title: t('messages.aml.name'),
      dataIndex: 'name',
      render: (text) => camelizerHelper(text),
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: t('messages.aml.rut'),
      dataIndex: 'formatRut'
    },
    {
      title: t('messages.aml.participation'),
      dataIndex: 'participacion',
      render: (text) => {
        if (text !== null) {
          return (Math.round(text * 100)/100) + '%'
        } else {
          return 'N/A'
        }
      },
      sorter: (a, b) => a.participacion - b.participacion
    },
    {
      title: t('messages.aml.pactos'),
      dataIndex: 'pactos',
      render: (pactos, record) => {
        if(pactos !== null && pactos.length > 0) {
          let p = []
          for(let i=0;i<pactos.length;i++) {
            let divPactos = <div>{ t('messages.aml.pacto') }: { pactos[i].desc } <table width="100%">
              <tr className="title">
                <td width="17%">{ t('messages.aml.rut') }</td>
                <td width="50%">{ t('messages.aml.name') }</td>
                <td width="16%">{ t('messages.aml.relation') }</td>
                <td width="17%">{ t('messages.aml.participation') }</td>
              </tr>
              <tr>
								<td>{ record.formatRut }</td>
								<td>{ camelizerHelper(record.name) }</td>
								<td>{ t('messages.aml.titular') }</td>
								<td>{ record.participacion !== null ?
                  <>
                  { Math.round(record.participacion * 100)/100 } %
                  </>
                  :
                  <>N/A</>
                }</td>
							</tr>
              { pactos[i].participantes.map(participante =>
                <tr>
  								<td>{ participante.formatRut }</td>
  								<td>{ camelizerHelper(participante.name) }</td>
  								<td>{ camelizerHelper(participante.relation) }</td>
  								<td>{ participante.participacionDirecta !== null ?
                    <>
                    { Math.round(participante.participacionDirecta * 100)/100 } %
                    </>
                    :
                    <>N/A</>
                  }</td>
  							</tr>
              ) }
            </table></div>
            p.push(<Tooltip title={ divPactos } overlayClassName="div-tooltip-pactos"><a> { pactos[i].desc }: { pactos[i].participacion !== null ? (Math.round(pactos[i].participacion * 100)/100) : '' } % </a></Tooltip>)
          }
          return p
        }
      }
    }
  ]

  const tableColumnsParticipacion = [
    {
      title: t('messages.aml.type'),
      dataIndex: 'relation',
      render: (text) => camelizerHelper(text),
      sorter: (a, b) => a.relation.localeCompare(b.relation)
    },
    {
      title:t('messages.aml.name'),
      dataIndex: 'name',
      render: (text) => camelizerHelper(text)
    },
    {
      title: t('messages.aml.rut'),
      dataIndex: 'formatRut'
    },
    {
      title: t('messages.aml.participation'),
      dataIndex: 'participacionDirecta',
      render: (text) => {
        if (text !== null) {
          return (Math.round(text * 100)/100) + '%'
        } else {
          return 'N/A'
        }
      }
    }
  ]

  const tableColumnsDirectores = [
    {
      title: t('messages.aml.position'),
      dataIndex: 'cargo',
      render: (text) => camelizerHelper(text)
    },
    {
      title: personCompliance.type === 'Entity' ? t('messages.aml.name') : t('messages.aml.legalName'),
      dataIndex: 'nombre',
      render: (text, record) => {
        return personCompliance.type === 'Entity' ? camelizerHelper(record.nombre) : camelizerHelper(record.razonSocial)
      }
    },
    {
      title: t('messages.aml.rutNumber'),
      dataIndex: 'rut',
      render: (text, record) => {
        return personCompliance.type === 'Entity' ? record.rut : record.rutEmpresa
      }
    },
    {
      title: t('messages.aml.designationDate'),
      dataIndex: 'fechaNomb'
    }
  ]

  return (
    <div className='final-beneficiaries'>
      { currentUser.cliente.modules.includes('BUSINF') &&
        <>
        { personUbosControllers.status === "OK" ?
          <>
            { personCompliance.type === 'Entity' ? (
              (personUbosControllers.ubos !== undefined && personUbosControllers.ubos.length > 0) ?
                <div className="table-wrapper">
                  <h3>{ t('messages.aml.controlOwnersTitle') }</h3>
                  <Table dataSource={ getUbos(personUbosControllers.ubos) } columns={ tableColumnsControllers } size="small" />
                </div>
                :
                <div className="no-data-block">{ t('messages.aml.noInfoAboutUBOControllers') }.</div>
              )
              :
              (
                (personUbosControllers.psoc !== undefined && personUbosControllers.psoc.length > 0) ?
                  <div className="table-wrapper">
                    <h3><InfoIcon text={ t('messages.aml.tooltipUbo1') } /> &nbsp;{ t('messages.aml.controlOwnersTitle') }</h3>
                    <Table dataSource={ personUbosControllers.psoc } columns={ tableColumnsParticipacion } size="small" />
                  </div>
                  :
                  <div className="no-data-block">{ t('messages.aml.noInfoAboutPartnershipsPresence') }.</div>
              )
            }
            { personUbosControllers.directores !== undefined &&
              <>
                { personUbosControllers.directores.length > 0 ?
                  <div className="table-wrapper">
                    <h3>{ t('messages.aml.directorio') }</h3>
                    <Table dataSource={ personUbosControllers.directores } columns={ tableColumnsDirectores } size="small" />
                  </div>
                  :
                  <div className="no-data-block">{ t('messages.aml.noInfoAboutDirectory') }.</div>
                }
               </>
            }
          </>
          : <Spin/>
        }
        </>
      }
      {
        (personCompliance.compliance !== undefined && personCompliance.compliance.UBOCOM.details.djRecord !== undefined && personCompliance.compliance.UBOCOM.details.djRecord.length > 0) &&
          <div className="table-wrapper">
            <h3>State Owned Companies</h3>
            <PersonInfoTabContent person={ personCompliance.compliance.UBOCOM.details.djRecord[0] } />
          </div>
      }
      { !currentUser.cliente.modules.includes('BUSINF') && !((personCompliance.compliance !== undefined && personCompliance.compliance.UBOCOM.details.djRecord !== undefined && personCompliance.compliance.UBOCOM.details.djRecord.length > 0)) &&
        <div className="no-data-block">{ t('messages.aml.noInfoAboutUBOControllers') }.</div>
      }
    </div>
  )
}
