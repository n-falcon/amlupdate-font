import { QueryService, LocalStorageService } from '../../../services'

const getCurrentLanguage = () => {
  const language = LocalStorageService.read('i18nextLng')

  return language ? language.substring(0,2) : null
}

export default (query, subclientId, resultsPerPage, type, typeSearch) => {
  return new Promise(async (resolve, reject) => {
    const language = getCurrentLanguage()

    await QueryService.create(query, subclientId, resultsPerPage, language, type, typeSearch)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
