import { stakeholderService } from '../services'

export default (domain) => {
	return new Promise(resolve => {
		stakeholderService.getClientDomain(domain)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
