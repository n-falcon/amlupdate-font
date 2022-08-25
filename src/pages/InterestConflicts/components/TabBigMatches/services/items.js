import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default (type, from, size, keyword='', optDates='', fromDate='', toDate='', status='', hasMatches='') => {
  return apiRequestorHelper({
		url: apiConfig.url + '/cdi/declarationsByType/' + type,
		method: 'post',
		body: { from, size, keyword, optDates, fromDate, toDate, status, hasMatches }
	})
}
