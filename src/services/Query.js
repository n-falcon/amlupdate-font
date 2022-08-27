import apiConfig from '../config/api'
import { apiRequestorHelper } from '../helpers'

export default {
  create: (query, subclienteId, resultsPerPage, language, type = undefined, typeSearch = undefined) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/search',
      method: 'post',
      body: {
        name: query,
        subclienteId,
        size: resultsPerPage,
        language,
        type,
        typeSearch
      }
    })
  },

  update: (from, searchId, resultsPerPage) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/search',
      method: 'post',
      body: {
        from,
        searchId,
        size: resultsPerPage
      }
    })
  }
}
