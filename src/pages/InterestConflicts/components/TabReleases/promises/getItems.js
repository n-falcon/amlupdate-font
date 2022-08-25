import { itemsService } from '../services'

export default (type, keyword='', optDates='', fromDate='', toDate='', status='', hasMatches='') => {
	return new Promise(resolve => {
		itemsService(type, keyword, optDates, fromDate, toDate, status, hasMatches)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
