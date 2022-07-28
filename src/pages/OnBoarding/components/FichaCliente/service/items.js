import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default {
	itemsFicha: (type, filters) => {
		return apiRequestorHelper({
				url: apiConfig.url + '/onb/getFichasCliente/'+ type,
				method: 'post',
				body: filters
			})
		},
	sendReminders: (type, filters, items) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/cdi/sendReminders/' + type,
			method: 'post',
			body: { ...filters, items }
		})
	},
	deleteDeclarations: (type, filters, items) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/cdi/deletedeclarations/' + type,
			method: 'post',
			body: { ...filters, items }
		})
	},
	updateRisk: (id, risk, commentRisk) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/changeRiskRecord',
			method: 'post',
			body: { id, risk, commentRisk }
		})
	},
	getFicha: (id) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/onb/ficha',
			method: 'post',
			body: { id }
		})
	},
	saveComments: (formId, title, comments) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/onb/saveCommentsFicha',
			method: 'post',
		body: { formId, title, comments }
		})
	},
	getUbosCtrlByRut: (rut, country) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/getUbosControllersByRut',
			method: 'post',
			body: { rut, country }
		})
	},
	savePeriodicity: (id, periodicity) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/onb/savePeriodicity',
			method: 'post',
			body: { id, periodicity }
		})
	}
}
