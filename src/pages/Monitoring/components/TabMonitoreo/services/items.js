import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default (type, filters) => {
  return apiRequestorHelper({
		url: apiConfig.url + '/cdi/getCDIRegistro/' + type,
		method: 'post',
		body: filters
	})
}
