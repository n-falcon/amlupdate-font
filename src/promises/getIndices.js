import { indicesService } from '../services'

export default () => {
  return new Promise((resolve, reject) => {
    indicesService.getIndices()
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
