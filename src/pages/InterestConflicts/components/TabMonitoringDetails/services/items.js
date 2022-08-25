import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default (type, from, size, filters) => {
  return apiRequestorHelper({
		url: apiConfig.url + '/cdi/getCDIRegistro/' + type,
		method: 'post',
		body: {...filters, from, size }
	})
}
