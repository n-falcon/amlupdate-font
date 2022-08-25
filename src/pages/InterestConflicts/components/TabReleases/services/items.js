import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default (type, keyword='', optDates='', fromDate='', toDate='', status='', hasMatches='') => {
  return apiRequestorHelper({
		url: apiConfig.url + '/cdi/declarations/' + type,
		method: 'post',
    body: { keyword, optDates, fromDate, toDate, status, hasMatches }
	})
}
