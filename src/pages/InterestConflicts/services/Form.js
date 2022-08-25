import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {
  getForm: (hash) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/cdi/formStatus',
      method: 'post',
      body: {
        hash,
      }
    })
  },
  getParamsClient: (clientId) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/cdi/formParamsClient/' + clientId,
      method: 'post'
    })
  },
  update: (form) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/cdi/saveForm',
      method: 'post',
      body:
        form,
    })
  },
  updateCDI: (form) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/cdi/saveFormTrab',
      method: 'post',
      body:
        form,
    })
  },
  updateCDIprov: (form) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/cdi/saveFormProv',
      method: 'post',
      body:
        form,
    })
  },
  send: (id, requestId) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/cdi/sendForm',
      method: 'post',
      body: {
        id,
        requestId
      }
    })
  },
  signCDIForm: (id, email) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/cdi/signCDIForm',
      method: 'post',
      body: {
        id, email
      }
    })
  }
}
