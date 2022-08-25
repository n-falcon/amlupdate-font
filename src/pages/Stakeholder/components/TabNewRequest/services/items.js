import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default {
  getCDIForm: (id, type) => {
    return apiRequestorHelper({
  		url: apiConfig.url + '/portal/getCDIFormStakeholder',
  		method: 'post',
      body: { id, type }
  	})
  }
}
