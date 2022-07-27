import './FinalBeneficiariesTabContent.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Table, Tooltip, Spin } from 'antd'
import { camelizerHelper } from '../../../../helpers'

export default ({ personUbosControllers }) => {
  const { t } = useTranslation()

  const tableColumns = [
    {
      title: t('messages.aml.type'),
      dataIndex: 'relation',
      render: (text) => {
        return camelizerHelper(text)
      },
      sorter: (a, b) => a.relation.localeCompare(b.relation)
    },
    {
      title: t('messages.aml.name'),
      dataIndex: 'name',
      render: (text) => {
        return camelizerHelper(text)
      },
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
      title: t('messages.aml.isUBO'),
      dataIndex: 'ubo',
      render: (text) => {
        return text ? 'Sí' : 'No'
      },
      sorter: (a, b) => a.ubo === b.ubo ? 0 : 1
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

  return (
    <div className='final-beneficiaries'>
      { personUbosControllers.status === "OK" ?
      <>
        { personUbosControllers.ubos !== undefined && personUbosControllers.ubos.length > 0 ?
            <Table dataSource={ personUbosControllers.ubos } columns={ tableColumns } size="small" />
          :
            <div className="no-data-block">
              { t('messages.aml.noInfoAboutFinalBeneficiaries')}.
            </div>
        }
      </>
      : <Spin/>
      }
    </div>
  )
}
