import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default {
  items: (type, filters) => {
    return apiRequestorHelper({
  		url: apiConfig.url + '/cdi/declarationsByType/' + type,
  		method: 'post',
  		body: filters
  	})
  },
  sendReminders: (type, filters, items) => {
    return apiRequestorHelper({
  		url: apiConfig.url + '/cdi/sendReminders/' + type,
  		method: 'post',
  		body: { ...filters, items }
  	})
  },
  deleteDeclarations: (type, filters, items) => {
    return apiRequestorHelper({
  		url: apiConfig.url + '/cdi/deletedeclarations/' + type,
  		method: 'post',
  		body: { ...filters, items }
  	})
  },
}
