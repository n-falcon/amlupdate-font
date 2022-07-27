import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {
	create: (id, tasks) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/createTasks',
			method: 'post',
      body: {
        id,
        tasks
      }
		})
	},
	getHistorial: (alertId,userId) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/portal/getHistorial/'+alertId,
			method: 'post',
      body: {userId}
		})
	},

	requestRos: (alertId,comments) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/requestROS',
			method: 'post',
      body: {
				id: alertId,
				ros: {
						comments
				}
			}
		})
	},

	updateRos: (alertId,ros) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/updateROS',
			method: 'post',
			body:{
				id: alertId,
				ros: {
						status:ros.status,
						comments:ros.comments,
						dateReport: ros.dateReport,
						code: ros.code
			  }
			
			}
		})
	},
}


