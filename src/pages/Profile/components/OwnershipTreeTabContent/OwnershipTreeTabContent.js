import './OwnershipTreeTabContent.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {  Table, Spin, Descriptions } from 'antd'
import moment from 'moment'
import { camelizerHelper } from '../../../../helpers'

export default ({ personUbosControllers }) => {
  const { t } = useTranslation()

  const tableColumns = [
    {
      title: t('messages.aml.rut'),
      dataIndex: 'rut',
      render: (text, record) => {
        return {
            props: {
              className: 'entity-type-'+record.type,   // there it is!
            },
            children: text
        }
      }
    },
    {
      title: t('messages.aml.name'),
      dataIndex: 'nombre',
      render: (text, record) => {
        return {
            props: {
              className: 'entity-type-'+record.type,   // there it is!
            },
            children: camelizerHelper(text)
        }
      },
      sorter: (a, b) => a.nombre.localeCompare(b.nombre)
    },
    {
      title: t('messages.aml.percent'),
      dataIndex: 'porcentaje',
      render: (text) => {
        if (text !== null) {
          return (Math.round(text * 100)/100) + '%'
        }
      },
      sorter: (a, b) => a.porcentaje - b.porcentaje
    },
    {
      title: t('messages.aml.type'),
      dataIndex: 'tipo',
      render: (text) => camelizerHelper(text)
    }
  ]

  const getDataTree = (propietarios, level) => {
    if( propietarios !== undefined && propietarios !== null && propietarios.length > 0) {
      const list = []
      for (let i = 0; i < propietarios.length; i++) {
        list.push({ key: i+propietarios[i].id+level, rut: (propietarios[i].paisId === 1 ? propietarios[i].formatRut : propietarios[i].pais), nombre: propietarios[i].name, porcentaje: propietarios[i].participacionDirecta, type: propietarios[i].type, tipo: propietarios[i].relation,children: getDataTree(propietarios[i].propietarios, level+1) })
      }
      return list
    }
  }

  return (
    <div id="tab-ownership" className="tab-content">
      { personUbosControllers.status === "OK" ?
      <>
        { personUbosControllers.fecMalla !== null &&
          <Descriptions size="small" bordered>
            <Descriptions.Item label={ t('messages.aml.mallaDate') }>
              {moment(personUbosControllers.fecMalla).format('DD-MM-YYYY')}
            </Descriptions.Item>
          </Descriptions>
        }
        { personUbosControllers.propietarios != undefined && personUbosControllers.propietarios.length > 0 ?
          <Table columns={ tableColumns } dataSource={ getDataTree(personUbosControllers.propietarios, 0) } size="small" pagination={ false } />
          :
          <div className="no-data-block">{ t('messages.aml.noInfoAboutOnwershipTree') }</div>
        }
      </>
      : <Spin/>
      }
    </div>
  )
}
