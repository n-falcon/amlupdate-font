import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default (type, from, size, keyword='', optDates='', fromDate='', toDate='',risk=[], hasMatches='') => {
  return apiRequestorHelper({
		url: apiConfig.url + '/cdi/getCDIRegistro/' + type,
		method: 'post',
		body: { from, size, keyword, optDates, fromDate, toDate,risk, hasMatches }
	})
}
