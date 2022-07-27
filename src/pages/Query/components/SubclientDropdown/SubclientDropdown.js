import './SubclientDropdown.scss'
import React from 'react'
import { useTranslation } from 'react-i18next'
import apiConfig from '../../../../config/api'
import { Select } from 'antd'

export default ({ onChangeHandler, subclients }) => {
  const { t } = useTranslation()
  const { Option } = Select

  return (
    <div className="subclient-dropdown">
      <label for="subclient-dropdown">Ejecutar consulta como: </label>
      <Select id="subclient-dropdown"
        onChange={ onChangeHandler }
        placeholder="Seleccionar empresa"
        >
        { subclients.map(item =>
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
  )
}
