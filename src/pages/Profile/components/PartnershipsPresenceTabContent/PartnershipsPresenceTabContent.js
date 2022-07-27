import './PartnershipsPresenceTabContent.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Table, Spin } from 'antd'
import { camelizerHelper } from '../../../../helpers'

export default ({ personUbosControllers }) => {
  const { t } = useTranslation()

  const tableColumns = [
    {
      title: t('messages.aml.rut'),
      dataIndex: 'rut'
    },
    {
      title: t('messages.aml.name'),
      dataIndex: 'nombre',
      render: (text) => camelizerHelper(text)
    },
    {
      title: t('messages.aml.percent'),
      dataIndex: 'porcentaje',
      render: (text) => {
        if (text !== null) {
          return (Math.round(text * 100)/100) + '%'
        }
      }
    },
    {
      title: t('messages.aml.type'),
      dataIndex: 'tipo',
      render: (text) => camelizerHelper(text)
    }
  ]

  const getDataTree = (sociedades, level) => {
    if( sociedades !== undefined && sociedades !== null && sociedades.length > 0) {
      const list = []
      for (let i = 0; i < sociedades.length; i++) {
        list.push({ key: i+sociedades[i].id+level, rut: (sociedades[i].paisId === 1 ? sociedades[i].formatRut : sociedades[i].pais), nombre: sociedades[i].name, porcentaje: sociedades[i].participacionDirecta, tipo: sociedades[i].relation, children: getDataTree(sociedades[i].sociedades, level+1) })
      }
      return list
    }
  }

  return (
    <div id="tab-partnership" className="tab-content">
      { personUbosControllers.status === "OK" ?
      <>
        { personUbosControllers.psoc && personUbosControllers.psoc.length > 0 ?
          <Table columns={ tableColumns } dataSource={ getDataTree(personUbosControllers.psoc, 0) } pagination={ false } size="small" />
          :
          <div className="no-data-block">{ t('messages.aml.noInfoAboutPartnershipsPresence') }</div>
        }
      </>
      : <Spin/>
      }
    </div>
  )
}
