import { itemsService } from '../services'

export default (type, from, size, keyword='', optDates='', fromDate='', toDate='',risk=[], hasMatches='') => {
	return new Promise(resolve => {
		itemsService(type, from, size, keyword, optDates, fromDate, toDate, risk, hasMatches)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
