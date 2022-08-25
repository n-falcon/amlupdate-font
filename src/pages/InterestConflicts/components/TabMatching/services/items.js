import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default (from, size,keyword='', optDates='', fromDate='', toDate='', status='', hasMatches='') => {
  return apiRequestorHelper({
		url: apiConfig.url + '/cdi/getCDIMatchRequestList',
		method: 'post',
    body: { from, size,keyword, optDates, fromDate, toDate, status, hasMatches }
	})
}
