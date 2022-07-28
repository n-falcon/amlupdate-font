import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default {
	items: (type, filters) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/cdi/declarationsByType/' + type,
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
	getForm: (id) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/cdi/form/' + id,
			method: 'post',
		})
	},
	saveState: (id, statusDecl, statusComments, resendOnBoardingForm) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/onb/changeStatus',
			method: 'post',
			body: { id, statusDecl, statusComments, resendOnBoardingForm }
		})
	},
	// getFichas: (id, statusDecl, commentsStatus) => {
	// 	return apiRequestorHelper({
	// 		url: apiConfig.url + '/onb/changeStatus',
	// 		method: 'post',
	// 			body: { id, statusDecl, commentsStatus }
	// 	})
	// },
	saveComments: (formId, title, comments) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/cdi/saveComments',
			method: 'post',
		body: { formId, title, comments }
		})
	},
}
