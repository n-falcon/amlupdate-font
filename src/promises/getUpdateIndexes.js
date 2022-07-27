import { indicesService } from '../services'

export default (name) => {
  return new Promise((resolve, reject) => {
    indicesService.getUpdateIndexes(name)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
