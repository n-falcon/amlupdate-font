import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {
  save: (client) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/saveClient',
      method: 'post',
      body: client
    })
  },
  upload: (formData) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/uploadClientes',
      method: 'post',
      body: formData,
      headers: {
          'Content-Type': 'multipart/form-data'
      }
    })
  },
  bajaClientes: (formData) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/bajaClientes',
      method: 'post',
      body: formData,
      headers: {
          'Content-Type': 'multipart/form-data'
      }
    })
  },
  uploadRelacionados: (formData) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/uploadRelacionados',
      method: 'post',
      body: formData,
      headers: {
          'Content-Type': 'multipart/form-data'
      }
    })
  },
}
