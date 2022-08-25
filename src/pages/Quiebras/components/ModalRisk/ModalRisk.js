import './ModalRisk.scss'
import React, { useState, useEffect } from 'react'
import { Descriptions, Button, Table, Icon, Tabs } from 'antd'
import { useTranslation } from 'react-i18next'
import moment from "moment";
import { getHistoryQuiebrasPromise, getUbosQuiebrasPromise } from '../../promises'
import { camelizerHelper } from '../../../../helpers'
import apiConfig from '../../../../config/api'

const { TabPane } = Tabs

export default ({ record }) => {
  const { t } = useTranslation()

  const [quiebra, setQuiebra] = useState(null)
  const [ubos, setUbos] = useState(null)

  useEffect(() => {
    if(record.recordId !== null && record.recordId !== undefined) {
      if(record.riskRecord !== null) {
        let _ubos = []
        if(record.riskRecord !== 'GREEN') {
          _ubos.push({rut: record.rut, nombre: record.name, relacion: 'TITULAR', riesgo: record.riskRecord})
        }
        getUbosQuiebrasPromise(record.recordId)
          .then(response => {
            for(let i=0;i<response.length;i++) {
              if(response[i].riesgo !== null && response[i].riesgo !== 'GREEN') {
                _ubos.push(response[i])
              }
            }
            if(record.riskRecord !== 'GREEN' && _ubos.length === 1) {
              getHistoryQuiebrasPromise(record.rut)
                .then(response => {
                  setQuiebra(response)
                })
            }else {
              setUbos(_ubos)
            }
          })
      }else {
        getHistoryQuiebrasPromise(record.rut)
          .then(response => {
            setQuiebra(response)
          })
      }
    }
  }, [])

  const riskTableColumns = [
    {
      title: t('messages.aml.type'),
      dataIndex: 'relacion',
      width: 100,
      render: (text) => camelizerHelper(text)
    },
    {
      title: t('messages.aml.rut'),
      dataIndex: 'rut',
      width: 100
    },
    {
      title: t('messages.aml.name'),
      dataIndex: 'nombre',
      width: 220,
      render: (text) => camelizerHelper(text)
    },
    {
      title: t('messages.aml.risk'),
      dataIndex: 'riesgo',
      width: 70,
      render: (text) => {
          if(text !==null) return <div className={ 'onboarding risk-' + text } />
          else return 'N/A'
      }
    }
  ]

  const quiebrasColumn = [
    {
      title: 'Tipo Procedimiento',
      dataIndex: 'tipoProc',
      width: 200
    },
    {
      title: t('messages.aml.name'),
      dataIndex: 'nombrePub',
      width: 200
    },
    {
      title: t('messages.aml.date'),
      dataIndex: 'fecha',
      width: 100,
      render: (text, record) => moment(text, 'YYYY-MM-DD').format("DD-MM-YYYY")
    },
    {
      title: 'Martillero',
      dataIndex: 'martillero',
      width: 300,
      render: (text) => camelizerHelper(text)
    }
  ]

  return (
    <div className="modal-risk">
      { record.rut !== null && record.rut !== undefined &&
        <Descriptions layout="vertical" size="small" column={2} bordered>
          <Descriptions.Item label="Rut">
            { record.rut }
          </Descriptions.Item>
          <Descriptions.Item label={ t('messages.aml.name') }>
            { camelizerHelper(record.name) }
          </Descriptions.Item>
          <Descriptions.Item label={ t('messages.aml.type') }>
            { record.type }
          </Descriptions.Item>
          <Descriptions.Item label={ t('messages.aml.risk') }>
            <div className={ 'onboarding risk-' + record.risk } />
          </Descriptions.Item>
          <Descriptions.Item label="Rol">
            { quiebra !== null && quiebra.rol !== null ? quiebra.rol : 'N/A' }
          </Descriptions.Item>
          <Descriptions.Item label={ t('messages.aml.stage') }>
            { quiebra !== null && quiebra.etapa !== null ? quiebra.etapa : 'N/A' }
          </Descriptions.Item>
          <Descriptions.Item label={ t('messages.aml.court') }>
            { quiebra !== null && quiebra.tribunal !== null ? quiebra.tribunal : 'N/A' }
          </Descriptions.Item>
          <Descriptions.Item label="Martillero">
            { quiebra !== null && quiebra.martillero !== null ? camelizerHelper(quiebra.martillero) : 'N/A'}
          </Descriptions.Item>
          { (quiebra !== null || ubos !== null) &&
            <>
            { quiebra !== null ?
              <Descriptions.Item label="Historial">
                { quiebra.history !== null &&
                  <Table dataSource={ quiebra.history } columns={ quiebrasColumn } size='small' />
                }
              </Descriptions.Item>
              :
              <Descriptions.Item label={t('messages.aml.finalBeneficiaries')}>
                { ubos !== null &&
                    <Table dataSource={ ubos } columns={ riskTableColumns } pagination={ false } size='small' />
                }
              </Descriptions.Item>
            }
            </>
          }
        </Descriptions>
      }
    </div>
  )
}
