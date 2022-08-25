import { itemsService } from '../services'

export default (from, size,keyword='', optDates='', fromDate='', toDate='', status='', hasMatches='') => {
	return new Promise(resolve => {
		itemsService(from, size,keyword, optDates, fromDate, toDate, status, hasMatches)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
