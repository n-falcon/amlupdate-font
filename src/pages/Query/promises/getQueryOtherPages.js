import { QueryService } from '../../../services'

export default (from, searchId, resultsPerPage) => {
  return new Promise(async (resolve, reject) => {
    await QueryService.update(from, searchId, resultsPerPage)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
