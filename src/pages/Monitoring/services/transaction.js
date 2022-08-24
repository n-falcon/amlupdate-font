import apiConfig from '../../../../src/config/api'
import { apiRequestorHelper } from '../../../../src/helpers'

export default {
	getRules: (filters) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/getRulesByClient',
			method: 'post',
			body:filters,
		})
	},
	saveRuleClient: (body) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/saveRuleClient',
			method: 'post',
			body: 	{
				id:body.id,
				code:body.code,
				status:body.status,
				score:body.score,
				params:body.params,
		 }
		})
	},
	getMonitorTipoReglas: () => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/getMonitorTipoReglas',
			method: 'post',
		})
	},
	saveMonitorTipoReglas: (body) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/saveMonitorTipoReglas',
			method: 'post',
			body,
		})
	},
	getMonitorRegistros: (categoria,filters) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/getMonitorRegistro/'+categoria,
			method: 'post',
			body:filters
		})
	},
	getMonitorRegistro: (id) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/getMonitorRegistroById',
			method: 'post',
			body:{ id}
		})
	},
	saveRegistro: ({id,riskAsignedInt,comments}) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/saveRegistro/',
			method: 'post',
			body:
			{
				id,
				riskAsignedInt,
				comments
			}
		})
	},
	getAlertasByRegistro: (id) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/getAlertasByRegistro/'+id,
			method: 'post',
		})
	},
	getMonitorHistorialRegla: (id) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/getMonitorHistorialRegla/'+id,
			method: 'post',
		})
	},
  aplicarSimulacion: (simId,status)=>{
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/aplicarSimulacion/'+simId+'/'+status,
			method: 'post',
		})
	},
	deleteSimulacion: (simId)=>{
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/deleteSimulacion/'+simId,
			method: 'post',
		})
	},
	deleteSimulacion: (simId)=>{
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/deleteSimulacion/'+simId,
			method: 'post',
		})
	},
	getIndicatorsRules: ({category,months=null,size=5})=>{
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/indicators/rules',
			method: 'post',
			body: {
				category,
				months:months,
				size:size,
			}
		})
	},
	getIndicatorsRangeAlerts: ({category,months=null,size=5})=>{
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/indicators/rangeAlerts',
			method: 'post',
			body: {
				category,
				months:months,
				size:size,
			}
		})
	},
	getIndicatorsRisks: ({category,months=null,size=5})=>{
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/indicators/risks',
			method: 'post',
			body: {
				category,
				months:months,
				size:size,
			}
		})
	},
	getIndicatorsRisksStatus: ({category,months=null,size=5})=>{
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/indicators/riskStatus',
			method: 'post',
			body: {
				category,
				months:months,
				size:size,
			}
		})
	},
	getCategoriesClient: () => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/getCategoriesClient',
			method: 'post'
		})
	}
}
