import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {
  read: (from, size, filters) => {
    const config = {
      url: apiConfig.url + '/quiebras/getRecordsMonitoreo',
      method: 'post',
      body: {
        from,
        size
      }
    }

    for (let key in filters) {
      config.body[key] = filters[key]
    }

    return apiRequestorHelper(config)
  },
  historyQuiebras: (rut) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/quiebras/getDetalleByRut/'+ rut,
      method: 'post'
    })
  },
  ubosQuiebras: (id) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/quiebras/getDetalle/'+ id,
      method: 'post'
    })
  }
}
