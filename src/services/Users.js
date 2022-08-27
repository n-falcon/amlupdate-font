import apiConfig from '../config/api'
import { apiRequestorHelper } from '../helpers'

export default {
  create: (user) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/saveUser',
      method: 'post',
      body: user
    })
  },

  read: () => {
    return apiRequestorHelper({
      url: apiConfig.url + '/usersByClient',
      method: 'post'
    })
  },

  update: (user) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/saveUser',
      method: 'post',
      body: user
    })
  },

  delete: (id) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/deleteUser',
      method: 'post',
      body: { id }
    })
  },
  getParametroByKey: (key) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/getParametroByKey',
      method: 'post',
      body: { key }
    })
  },
}
