import { SearchesService } from '../services'

export default (fromNum, resultsPerPage, filters = null) => {
  return new Promise(async (resolve, reject) => {
    await SearchesService.read(fromNum, resultsPerPage, filters)
      .then(response => resolve(response.data))
      .then(err => reject({ error: true }))
  })
}
