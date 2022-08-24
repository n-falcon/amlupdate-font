import { simulateRulesService } from '../services'

export default (id) => {
	return new Promise(resolve => {
		simulateRulesService.simulate(id)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
