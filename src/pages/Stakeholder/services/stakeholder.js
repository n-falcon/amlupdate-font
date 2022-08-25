import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {

  getClientDomain: (domain) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/portal/getClienteByDomain/'+domain,
			method: 'post'
		})
	},
  getUser: (clientId, rut, password) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/portal/getUser',
			method: 'post',
			body: {clientId, rut, password }
		})
	},
  getUserById: (clientId, id) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/portal/getUserById',
			method: 'post',
			body: {clientId, id }
		})
	},
  createUser: (clientId, rut, response) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/portal/createUser',
			method: 'post',
			body: {clientId, rut, response}
		})
	},
  forgotUser: (clientId, rut, response) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/portal/forgotUser',
			method: 'post',
			body: {clientId, rut, response }
		})
	},
  changePwd: ( userId, password, newpwd ) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/portal/changePwd',
			method: 'post',
			body: { userId, password, newpwd}
		})
	},
  deleteDeclarations: (userId, items) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/portal/deletedeclarations/' + userId,
			method: 'post',
			body: { items }
		})
	}
}
