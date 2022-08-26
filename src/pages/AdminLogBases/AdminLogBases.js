import './AdminLogBases.scss'
import React from 'react'
import { withTranslation } from 'react-i18next'
import {  getIndicesPromise,getUpdateIndexesPromise } from '../../promises'
import { Button, Icon, Modal, notification, Popconfirm, Table, Tooltip, Spin } from 'antd'

import moment from "moment";

class AdminLogBases extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: {},
      isLoading: true,
      isLoadingReport: false,
      isModalVisible: false,
      modal: '',
      updateIndices:[]
    }
  }

  async componentDidMount() {
    const indices = await getIndicesPromise()
    const filteredBases = indices.filter(index=>index.type ==="PFA" || index.type ==="SOC" || index.type ==="AME")

    this.setState({
      data:filteredBases,
      isLoading: false
    })
  }


  async handleDownload(name) {
    const updateIndices = await getUpdateIndexesPromise(name)
    this.setState({ isModalVisible:true, updateIndices })
  }

  handleModalCancel = () => {
    this.setState({ isModalVisible: false })
  }



  render() {
    const { currentUser, t } = this.props

    const tableColumns = [
      { title: t('messages.aml.baseName'), dataIndex: 'description' },
      { title: t('messages.aml.indexDate'), dataIndex: 'indexDate',
      render: (text) => {
        return text !== null ? moment(text).format('DD/MM/YYYY'):'-'
      }
    },
      { title: t('messages.aml.recordsCamel'), dataIndex: 'registros' },
      { title: t('messages.aml.log'), dataIndex: 'id', render: (id, record) => (
        <div className="actions">
           <Button type="primary" icon='unordered-list' onClick={e=>this.handleDownload.bind(this)(record.type) }>{ 'Historial' }</Button>
        </div>
      )}
    ]



    const updateIndicesColumns = [

      { title:'Fecha', dataIndex: 'date' },
    ]



    return (
      <div className="admin-log-bases">
          <div className="tools-area">
            <center>
            Historial de actualización de las bases de datos
            </center>
          </div>
          <div className="table-wrapper">
            {
              this.state.isLoading ?
                <Spin spinning={ true } size="large" />
              :
                <Table columns={ tableColumns } dataSource={ this.state.data } size="small" loading={ this.state.isLoadingReport } />
            }
          </div>
          <div id="modal-user">
            <Modal
              title={ "Fechas de actualización" }
              className={ this.state.modal.className }
              visible={ this.state.isModalVisible }
              style={{ top: 30 }}
              footer={ null }
              onCancel={ this.handleModalCancel }
            >
                <>
                  <Table dataSource={this.state.updateIndices} columns={updateIndicesColumns} size="small" />
                </>
            </Modal>
          </div>
        </div>
    )
  }
}

export default withTranslation()(AdminLogBases)
