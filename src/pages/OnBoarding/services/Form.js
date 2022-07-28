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
  updateOnb: (form) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/onb/saveFormDecl',
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
  },
  addFilesForm: (formData) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/cdi/addFilesForm',
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    })
  },
  getFilesForm: (formId, originalName) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/cdi/getFileForm',
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: formId
    })
  },
  getCountriesCode: () => {
    return apiRequestorHelper({
      url: apiConfig.url + '/public/getCountriesISO',
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    })
  }
}