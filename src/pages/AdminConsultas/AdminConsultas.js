import './AdminConsultas.scss'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { Icon, Spin, Table, Select, Row, Col } from 'antd'
import apiConfig from '../../config/api'
import { getMesesPromise, getConsultasPromise } from './promises'
import { ReportService, SessionStorageService } from '../../services'

class AdminConsultas extends Component {
  state = {
    isLoading: true,
    consultas: [],
    mes: null,
    meses: []
  }

  async componentDidMount() {
    const meses = await getMesesPromise()
    const { currentUser } = this.props

    await this.setState({ meses, isLoading: false })
  }

  renderTableColumns() {
    const { t } = this.props

    const columns = [
      {
        title: t('messages.aml.subclient'),
        dataIndex: 'subcliente'
      },
      {
        title: t('messages.aml.type'),
        dataIndex: 'tipo'
      },
      {
        title: 'Precio Base',
        dataIndex: 'base',
        align: 'right'
      },
      {
        title: 'Tarifa / Rango',
        dataIndex: 'tarifa'
      },
      {
        title: 'Tarifa Unidad',
        dataIndex: 'tarifaUnit',
        align: 'right'
      },
      {
        title: 'Registros',
        dataIndex: 'registros',
        align: 'right',
        render: (text) => {
          return this.numberFormatD(text,"")
        }
      },
      {
        title: 'Reg. Unicos',
        dataIndex: 'regUnicos',
        align: 'right',
        render: (text) => {
          return this.numberFormatD(text,"")
        }
      },
      {
        title: 'Consultas',
        dataIndex: 'consultas',
        align: 'right',
        render: (text) => {
          return this.numberFormatD(text,"")
        }
      },
      {
        title: 'Consultas Exitosas',
        dataIndex: 'exitosas',
        align: 'right',
        render: (text) => {
          return this.numberFormatD(text,"")
        }
      },
      {
        title: 'Max Usuarios',
        dataIndex: 'totUsuarios'
      },
      {
        title: 'Valor',
        dataIndex: 'valor',
        align: 'right',
        render: (text) => {
          return this.numberFormatD(text,"")
        }
      }
    ]

    return columns
  }

  numberFormat ( data, symbol ) {
  	return this.numberFormatD(data, symbol, 2);
  }

  numberFormatD ( data, symbol, decimals ) {
  	if(data == null || data == "" || isNaN(data)) {
  		return data;
  	}else {
  		var int = Math.floor(data);
  		var decimal = data - int;
  		var s=(int+""), a=s.split(""), out="", iLen=s.length;
  		for ( var i=0 ; i<iLen ; i++ ) {
  			if ( i%3 === 0 && i !== 0 ) {
  				out = '.'+out;
  			}
  			out = a[iLen-i-1]+out;
  		}
  		let pos = decimal.toString().indexOf(".");
  		return symbol+" "+out+(decimal>0?","+decimal.toString().substring(pos+1, pos+1+decimals):"");
  	}
  }

  async changeMes(mes) {
    this.setState({ mes, isLoading: true })
    let consultas =  await getConsultasPromise(mes)
    let base = 0
    let registros = 0
    let _consultas = 0
    let exitosas = 0
    let usuariosUnicos
    let maxUsuarios
    let valor = 0

    for(let i=0;i<consultas.length;i++) {
      let row = consultas[i]
      if(row.subcliente === 'SubTotal') {
        base += row.base
        registros += row.registros
        _consultas += row.consultas
        exitosas += row.exitosas
        valor += row.valor

        usuariosUnicos = row.usuariosUnicos
        maxUsuarios = row.maxUsuarios
      }
    }

    let totUsuarios = usuariosUnicos
    let totmax_usuarios = 0
    if(maxUsuarios > -1) {
      totmax_usuarios=(usuariosUnicos-maxUsuarios)*0.5
      if(totmax_usuarios<0) {
        totmax_usuarios = 0;
      }
      totUsuarios = usuariosUnicos + "/" + maxUsuarios + "=" + totmax_usuarios
    }

    let total = { total: true, subcliente:'Total', base, registros, consultas: _consultas, exitosas, totUsuarios, valor: valor + totmax_usuarios }
    consultas.push(total)

    this.setState({ consultas, isLoading: false })
  }

  render() {
    const { t } = this.props
    const { isLoading, meses, mes, consultas } = this.state

    return (
      <div className="admin-consultas">
        <div className="tools-area">
          <Row>
            <Col span={4} offset={20}>
              <Select onChange={ (mes) => this.changeMes(mes) } placeholder="Seleccionar Mes" style={{width: '100%'}}>
              {meses.map(mes =>
                <Select.Option value={ mes }>{mes.substring(0,4) + '-' + mes.substring(4)}</Select.Option>
              )}
              </Select>
            </Col>
          </Row>
        </div>
        <div className="table-wrapper">
          { isLoading ?
              <Spin spinning="true" size="large" />
              :
              <Table dataSource={ consultas } columns={ this.renderTableColumns() } size="small" pagination={false} rowClassName={(record, index) => { if(record.total === true) return 'total-row'; else if(record.subcliente === 'SubTotal') return 'subtotal-row'}}
               />
          }
        </div>
      </div>
    )
  }

}

export default withTranslation()(AdminConsultas)
