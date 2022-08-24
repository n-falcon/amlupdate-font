import apiConfig from '../config/api'
import { apiRequestorHelper } from '../helpers'

const user = {
  read: () => {
    return apiRequestorHelper({
      url: apiConfig.url + '/currentUser',
      method: 'post'
    })
  },

  changePwd: (password, newpwd) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/changePwd',
      method: 'post',
      body: {
        password,
        newpwd
      }
    })
  },

  logout: () => {
    return apiRequestorHelper({
      url: apiConfig.url + '/logout',
      method: 'post'
    })
  }
}

export default user