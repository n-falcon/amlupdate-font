import './Filters.scss'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import apiConfig from '../../../../config/api'
import { Button, DatePicker, Icon, Input, Switch, Select } from 'antd'

const Filters = ({ currentUser, filters, groups, categories, onChangeFilters }) => {
  const { t } = useTranslation()
  const { Option } = Select

  useEffect(() => {

  }, [])

  return (
    <div id="filters" className="filters">
      { currentUser.cliente.outsourcer && currentUser.cliente.clientes !== null && currentUser.cliente.clientes.length > 0 && currentUser.subcliente === null &&
        <div className="filter">
          <h5>{ t('messages.aml.subclient') }</h5>
            <Select onChange={ (value) => onChangeFilters('subclienteId', value, value) }
              placeholder="Seleccionar empresa"
              className="subclient-dropdown"
              allowClear
              >
              { currentUser.cliente.clientes.map(item =>
                  <Option className="subclient-option" value={ item.id }>
                    <div className="subclient-option-inner">
                      <figure className="subclient-logo">
                        <img src={ apiConfig.url + '/../getImageClientUser/0/' + item.id } alt="" style={{ height: '15px' }} />
                      </figure>
                      <span className="subclient-name" style={{ paddingLeft: '10px' }}>{ item.name }</span>
                    </div>
                  </Option>
                )
              }
            </Select>
        </div>
      }
      <div className="filter">
        <h5>{ t('messages.aml.keywordSearch') }</h5>
        <Input.Search placeholder={ t('messages.aml.searhcDniNameEmail') } onSearch={ (value) => onChangeFilters('text', value, value!=='') } allowClear />
      </div>
      <div className="filter">
        <h5>{ t('messages.aml.type') }</h5>
        <ul>
          <li>{ t('messages.aml.naturalPerson') } <Switch size="small" checked={ filters['types'] !== null && filters['types'] !== undefined && filters['types'].includes('Person') } onChange={ (value) => onChangeFilters('types', 'Person', value) } /></li>
          <li>{ t('messages.aml.legalPerson') } <Switch size="small" checked={ filters['types'] !== null && filters['types'] !== undefined && filters['types'].includes('Entity') } onChange={ (value) => onChangeFilters('types', 'Entity', value) } /></li>
        </ul>
      </div>
      { categories !== undefined && categories.length > 0 && (categories.length > 1 || categories[0].categoria !== 'N/A') &&
        <div className="filter">
          <h5>{ t('messages.aml.category') }</h5>
          <ul>
            { categories.map(category =>
              <li>
              { category.categoria !== 'N/A' ? t('messages.aml.category.' + category.categoria) : 'N/A' } ({ category.cant }) <Switch size="small" checked={ filters['categories'] !== null && filters['categories'].includes(category.categoria) } onChange={ (value) => onChangeFilters('categories', category.categoria, value) } />
              </li>
            )}
          </ul>
        </div>
      }
      { groups !== undefined && groups.length > 0 && (groups.length > 1 || groups[0].grupo !== 'N/A') &&
        <div className="filter">
          <h5>{ t('messages.aml.group') }</h5>
          <ul>
            { groups.map(group =>
              <li>
              { group.grupo } ({ group.cant }) <Switch size="small" checked={ filters['grupos'] !== null && filters['grupos'].includes(group.grupo) } onChange={ (value) => onChangeFilters('grupos', group.grupo, value) } />
              </li>
            )}
          </ul>
        </div>
      }
      <div className="filter">
        <h5>{ t('messages.aml.pjStatus') }</h5>
        <ul>
          <li>{ t('messages.aml.active') } <Switch size="small" checked={ filters['estados'] !== null && filters['estados'] !== undefined && filters['estados'].includes('ACTIVE') } onChange={ (value) => onChangeFilters('estados', 'ACTIVE', value) } /></li>
          <li>{ t('messages.aml.inactive') } <Switch size="small" checked={ filters['estados'] !== null && filters['estados'] !== undefined && filters['estados'].includes('INACTIVE') } onChange={ (value) => onChangeFilters('estados', 'INACTIVE', value) }/></li>
        </ul>
      </div>
      { currentUser.cliente.modules.includes('ADMCLI') &&
        <div className="filter">
          <h5>{ t('messages.aml.requestState') }</h5>
          <ul>
            <li>{ t('messages.aml.malla.SOLICITADO') } <Switch size="small" checked={ filters['estadoMalla'] !== null && filters['estadoMalla'] !== undefined && filters['estadoMalla'].includes('SOLICITADO') } onChange={ (value) => onChangeFilters('estadoMalla', 'SOLICITADO', value) } /></li>
            <li>{ t('messages.aml.malla.ENTREGADO') } <Switch size="small" checked={ filters['estadoMalla'] !== null && filters['estadoMalla'] !== undefined && filters['estadoMalla'].includes('ENTREGADO') } onChange={ (value) => onChangeFilters('estadoMalla', 'ENTREGADO', value) } /></li>
          </ul>
        </div>
      }
    </div>
  )
}

export default Filters
