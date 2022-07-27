import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {
  read: (from, size, filters) => {
    const config = {
      url: apiConfig.url + '/getClientes',
      method: 'post',
      body: {
        from,
        size
      }
    }

    for (let key in filters) {
      config.body[key] = filters[key]
    }

    return apiRequestorHelper(config)
  },
  detail: (id) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/clientDetail/'+id,
      method: 'post'
    })
  },
  tree: (id) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/clientTree/'+id,
      method: 'post'
    })
  },
  validateForm: (id) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/ddaValidate/'+id,
      method: 'post'
    })
  },
  saveDDAValidated: (id, updateMalla) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/saveDDAValidated/'+id+'/'+updateMalla,
      method: 'post'
    })
  },
  sendFormC57: (id, obsCli) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/sendFormC57',
      method: 'post',
      body: {
        obsCli,
        clCliente: {
          id
        }
      }
    })
  },
  historyMonitoreo: (id) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/getMonitoreoRegistroByClient',
      method: 'post',
      body: {
        id
      }
    })
  },
  monitoreoHisClient: () => {
    return apiRequestorHelper({
      url: apiConfig.url + '/getMonitoreoHistCliente',
      method: 'post'
    })
  },
  areas: () => {
		return apiRequestorHelper({
			url: apiConfig.url + '/getAreasClient',
			method: 'post'
		})
	},
  grupos: (category) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/getGroupsClientesByUser/' + category,
			method: 'post'
		})
	},
  categories: () => {
		return apiRequestorHelper({
			url: apiConfig.url + '/getCategoriesClient',
			method: 'post'
		})
	}

}
