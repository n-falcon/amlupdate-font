import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default {
  getForms: (id) => {
    return apiRequestorHelper({
  		url: apiConfig.url + '/portal/getCDIDeclarationsByRecordId/' + id,
  		method: 'post'
  	})
  }
}
