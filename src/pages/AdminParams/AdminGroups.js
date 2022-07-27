import './AdminGroups.scss'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { Spin, Button, Icon, Input, notification } from 'antd'
import { getParamsPromise } from './promises'
import { ParamsService } from './services'

class AdminParams extends Component {
  columnsParams = []
  widthTable = 0

  state = {
    isLoading: true,
    isSaving: false,
    paramsResults: {}
  }

  async componentDidMount() {
      this.getParameters()
  }

  async getParameters() {
    const parameters = await getParamsPromise()
    await this.setState({
      isLoading: false,
      paramsResults: parameters
    })
  }

  arrayRemove(arr, value) {
   return arr.filter(function(ele){
       return ele !== value;
   });
  }

  async saveParamsHandler() {
    await this.setState({ isSaving: true })
    const { paramsResults } = this.state
    const { t } = this.props
    let grupos = []

    if(paramsResults.gruposNames != null) {
      paramsResults.gruposNames.map(grupo => {
        if(grupo !== '') {
          grupos.push(grupo)
        }
      })
    }

    paramsResults.gruposNames = grupos

    const bodyParams = {
      grupos: paramsResults.gruposNames
    }

    const resultSave = await ParamsService.save(bodyParams)

    await this.setState({ isSaving: false, paramsResults })

    if(resultSave.data) {
      notification.success({
        message: t('messages.aml.successfulOperation'),
        description: t('messages.aml.paramsSaved')
      })
    } else {
      notification.error({
        message: t('messages.aml.notifications.anErrorOcurred'),
        description:  t('messages.aml.errorSavingParams')
      })
    }
  }

  handlerChangeGrupo(index, e) {
    const { paramsResults } = this.state
    paramsResults.gruposNames[index] = e.target.value
    this.setState({ paramsResults })
  }

  handlerDeleteGroup(index, e) {
    const { paramsResults } = this.state
    paramsResults.gruposNames.splice(index,1)
    this.setState({ paramsResults })
  }

  handlerAddGroup() {
    const { paramsResults } = this.state
    if(paramsResults.gruposNames === null) {
      paramsResults.gruposNames = []
    }
    paramsResults.gruposNames.push('')
    this.setState({ paramsResults })
  }

  render() {
    const { t } = this.props
    const { isLoading, isSaving, paramsResults } = this.state

    return (
      <div className="admin-groups">
        <div className="tools-area">
          <Button type="primary" icon="plus" onClick={ this.handlerAddGroup.bind(this) }>{ t('messages.aml.newGroup') }</Button>&nbsp;
          <Button type="primary" icon={ isSaving ? 'loading': 'save' } onClick={ this.saveParamsHandler.bind(this) }>{ t('messages.aml.save') }</Button>
        </div>
        <div className="table-wrapper">
          { isLoading ?
            <Spin spinning={ true } size="large" />
            :
            <>
              { paramsResults.gruposNames !== null && paramsResults.gruposNames.map((grupo, i) => <Input size="large" className="groupInput" value={ grupo } onChange={ this.handlerChangeGrupo.bind(this, i) } suffix={<Icon type="close" onClick={ this.handlerDeleteGroup.bind(this, i) }/> } />)
              }
            </>
          }
        </div>
      </div>
    )
  }
}

export default withTranslation()(AdminParams)
