import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default (type, from, size, keyword='', optDates='', fromDate='', toDate='', status='', hasMatches='', risk='') => {
  return apiRequestorHelper({
		url: apiConfig.url + '/cdi/getCDIMatchDetailList/' + type,
		method: 'post',
		body: { from, size, keyword, optDates, fromDate, toDate, status, hasMatches, risk }
	})
}
