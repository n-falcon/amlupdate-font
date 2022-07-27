import { createTasksService } from '../services'

export default (alertId, ros) => {
	return new Promise(resolve => {
		createTasksService.updateRos(alertId,ros)
			.then(response => resolve(response.data))
	})
}
